import { AppError } from './AppError.js';

export const CATEGORIAS = ['Alimentos', 'Mascotas', 'Hogar', 'Belleza', 'Tecnología', 'Segunda mano', 'Otros'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const texto = (v) => (typeof v === 'string' ? v.trim() : '');

// Lanza 400 con todos los errores juntos, para que el formulario los muestre de una vez.
function revisar(errores) {
  if (Object.keys(errores).length) throw new AppError(400, 'Revisa los datos enviados.', errores);
}

export function validarRegistro(body = {}) {
  const datos = {
    nombre: texto(body.nombre),
    email: texto(body.email).toLowerCase(),
    password: typeof body.password === 'string' ? body.password : '',
    aceptaTerminos: body.aceptaTerminos === true,
  };
  const e = {};
  if (datos.nombre.length < 2 || datos.nombre.length > 80) e.nombre = 'Escribe un nombre de 2 a 80 caracteres.';
  if (!EMAIL.test(datos.email)) e.email = 'Escribe un correo válido.';
  if (datos.password.length < 8) e.password = 'La contraseña debe tener al menos 8 caracteres.';
  if (!datos.aceptaTerminos) e.aceptaTerminos = 'Debes aceptar los términos y la política de privacidad.';
  revisar(e);
  return datos;
}

export function validarLogin(body = {}) {
  const datos = { email: texto(body.email).toLowerCase(), password: typeof body.password === 'string' ? body.password : '' };
  const e = {};
  if (!EMAIL.test(datos.email)) e.email = 'Escribe un correo válido.';
  if (!datos.password) e.password = 'Escribe tu contraseña.';
  revisar(e);
  return datos;
}

export function validarEmprendimiento(body = {}) {
  const datos = {
    nombre: texto(body.nombre),
    descripcion: texto(body.descripcion),
    categoria: texto(body.categoria),
    horario: texto(body.horario) || null,
    whatsapp: texto(body.whatsapp).replace(/[\s()+-]/g, ''),
    imagenUrl: texto(body.imagenUrl) || null,
  };
  const e = {};
  if (datos.nombre.length < 2 || datos.nombre.length > 80) e.nombre = 'El nombre debe tener entre 2 y 80 caracteres.';
  if (datos.descripcion.length < 10 || datos.descripcion.length > 600) e.descripcion = 'La descripción debe tener entre 10 y 600 caracteres.';
  if (!CATEGORIAS.includes(datos.categoria)) e.categoria = 'Elige una categoría de la lista.';
  if (datos.horario && datos.horario.length > 80) e.horario = 'El horario no puede pasar de 80 caracteres.';
  if (!/^[0-9]{10,15}$/.test(datos.whatsapp)) e.whatsapp = 'Escribe el número con indicativo, solo dígitos (ej. 573001234567).';
  if (datos.imagenUrl && !/^https:\/\/\S+$/i.test(datos.imagenUrl)) e.imagenUrl = 'La imagen debe ser un enlace que empiece por https://';
  revisar(e);
  return datos;
}

export function validarId(id) {
  if (!UUID.test(id)) throw new AppError(404, 'Emprendimiento no encontrado.');
  return id;
}

export function validarPaginacion(q = {}) {
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(24, Math.max(1, parseInt(q.limit, 10) || 12));
  return { page, limit, offset: (page - 1) * limit };
}
