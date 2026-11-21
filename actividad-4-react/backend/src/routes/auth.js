import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { query } from '../db/pool.js';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { validarLogin, validarRegistro } from '../utils/validar.js';
import { firmarToken, requiereAuth } from '../middleware/auth.js';

const router = Router();

// Limita intentos de login/registro para frenar ataques de fuerza bruta.
const limitador = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: { mensaje: 'Demasiados intentos. Espera unos minutos.' } } });

const publico = (e) => ({ id: e.id, nombre: e.nombre, email: e.email });

router.post('/registro', limitador, asyncHandler(async (req, res) => {
  const { nombre, email, password, aceptaTerminos } = validarRegistro(req.body);
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `insert into a4_emprendedores (nombre, email, password_hash, acepta_terminos)
     values ($1, $2, $3, $4) returning id, nombre, email`,
    [nombre, email, hash, aceptaTerminos],
  );
  res.status(201).json({ token: firmarToken(rows[0]), usuario: publico(rows[0]) });
}));

router.post('/login', limitador, asyncHandler(async (req, res) => {
  const { email, password } = validarLogin(req.body);
  const { rows } = await query('select id, nombre, email, password_hash from a4_emprendedores where email = $1', [email]);
  const ok = rows[0] && (await bcrypt.compare(password, rows[0].password_hash));
  if (!ok) throw new AppError(401, 'Correo o contraseña incorrectos.');
  res.json({ token: firmarToken(rows[0]), usuario: publico(rows[0]) });
}));

router.get('/perfil', requiereAuth, asyncHandler(async (req, res) => {
  const { rows } = await query('select id, nombre, email from a4_emprendedores where id = $1', [req.usuario.id]);
  if (!rows[0]) throw new AppError(401, 'La cuenta ya no existe.');
  res.json({ usuario: publico(rows[0]) });
}));

export default router;
