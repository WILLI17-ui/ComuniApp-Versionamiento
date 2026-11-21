import { AppError } from '../utils/AppError.js';

export function noEncontrado(req, _res, next) {
  next(new AppError(404, `No existe la ruta ${req.method} ${req.originalUrl}`));
}

// Middleware central de errores: todas las respuestas de error tienen la misma forma
// { error: { mensaje, detalles? } } y nunca se expone el stack al cliente.
// eslint-disable-next-line no-unused-vars
export function manejarErrores(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') err = new AppError(400, 'El cuerpo de la petición no es un JSON válido.');
  if (err.code === '23505') err = new AppError(409, 'Ya existe una cuenta con ese correo.');
  if (err.code === '23514') err = new AppError(400, 'Algún dato no cumple las reglas de la base de datos.');

  const status = err instanceof AppError ? err.status : 500;
  if (status === 500) console.error('[API]', err);

  res.status(status).json({
    error: {
      mensaje: status === 500 ? 'Ocurrió un error inesperado. Intenta más tarde.' : err.message,
      ...(err.detalles && { detalles: err.detalles }),
    },
  });
}
