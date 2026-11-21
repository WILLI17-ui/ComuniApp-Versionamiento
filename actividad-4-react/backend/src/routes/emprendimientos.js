import { Router } from 'express';
import { query } from '../db/pool.js';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { CATEGORIAS, validarEmprendimiento, validarId, validarPaginacion } from '../utils/validar.js';
import { requiereAuth } from '../middleware/auth.js';

const router = Router();

const COLUMNAS = `e.id, e.nombre, e.descripcion, e.categoria, e.horario, e.whatsapp,
  e.imagen_url as "imagenUrl", e.creado_en as "creadoEn", e.actualizado_en as "actualizadoEn",
  p.nombre as "emprendedor"`;

// Público: listado con búsqueda, filtro por categoría y paginación.
router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, offset } = validarPaginacion(req.query);
  const filtros = [];
  const params = [];
  const q = (req.query.q || '').trim();
  const categoria = (req.query.categoria || '').trim();

  if (q) {
    params.push(`%${q}%`);
    filtros.push(`(e.nombre ilike $${params.length} or e.descripcion ilike $${params.length})`);
  }
  if (categoria) {
    if (!CATEGORIAS.includes(categoria)) throw new AppError(400, 'La categoría no existe.');
    params.push(categoria);
    filtros.push(`e.categoria = $${params.length}`);
  }
  const where = filtros.length ? `where ${filtros.join(' and ')}` : '';

  // count(*) over() trae el total en la misma consulta y evita una segunda ida a la base.
  params.push(limit, offset);
  const { rows } = await query(
    `select ${COLUMNAS}, count(*) over() as total
     from a4_emprendimientos e join a4_emprendedores p on p.id = e.emprendedor_id
     ${where} order by e.creado_en desc limit $${params.length - 1} offset $${params.length}`,
    params,
  );
  const total = rows[0] ? Number(rows[0].total) : 0;
  res.json({
    datos: rows.map(({ total: _t, ...r }) => r),
    paginacion: { page, limit, total, paginas: Math.ceil(total / limit) },
  });
}));

// Privado: emprendimientos del emprendedor con sesión iniciada (para su panel).
router.get('/mios', requiereAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `select ${COLUMNAS} from a4_emprendimientos e join a4_emprendedores p on p.id = e.emprendedor_id
     where e.emprendedor_id = $1 order by e.creado_en desc`,
    [req.usuario.id],
  );
  res.json({ datos: rows });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = validarId(req.params.id);
  const { rows } = await query(
    `select ${COLUMNAS} from a4_emprendimientos e join a4_emprendedores p on p.id = e.emprendedor_id where e.id = $1`,
    [id],
  );
  if (!rows[0]) throw new AppError(404, 'Emprendimiento no encontrado.');
  res.json({ dato: rows[0] });
}));

router.post('/', requiereAuth, asyncHandler(async (req, res) => {
  const d = validarEmprendimiento(req.body);
  const { rows } = await query(
    `insert into a4_emprendimientos (emprendedor_id, nombre, descripcion, categoria, horario, whatsapp, imagen_url)
     values ($1,$2,$3,$4,$5,$6,$7) returning id`,
    [req.usuario.id, d.nombre, d.descripcion, d.categoria, d.horario, d.whatsapp, d.imagenUrl],
  );
  res.status(201).location(`/api/emprendimientos/${rows[0].id}`).json({ id: rows[0].id, mensaje: 'Emprendimiento creado.' });
}));

// Solo el dueño puede editar o eliminar: la condición emprendedor_id = $x va en el mismo UPDATE/DELETE.
router.put('/:id', requiereAuth, asyncHandler(async (req, res) => {
  const id = validarId(req.params.id);
  const d = validarEmprendimiento(req.body);
  const { rowCount } = await query(
    `update a4_emprendimientos set nombre=$1, descripcion=$2, categoria=$3, horario=$4, whatsapp=$5,
       imagen_url=$6, actualizado_en=now() where id=$7 and emprendedor_id=$8`,
    [d.nombre, d.descripcion, d.categoria, d.horario, d.whatsapp, d.imagenUrl, id, req.usuario.id],
  );
  if (!rowCount) throw new AppError(404, 'No encontramos ese emprendimiento entre los tuyos.');
  res.json({ mensaje: 'Emprendimiento actualizado.' });
}));

router.delete('/:id', requiereAuth, asyncHandler(async (req, res) => {
  const id = validarId(req.params.id);
  const { rowCount } = await query('delete from a4_emprendimientos where id=$1 and emprendedor_id=$2', [id, req.usuario.id]);
  if (!rowCount) throw new AppError(404, 'No encontramos ese emprendimiento entre los tuyos.');
  res.status(204).end();
}));

export default router;
