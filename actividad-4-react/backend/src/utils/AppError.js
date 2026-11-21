// Error controlado: lleva el código HTTP y, si aplica, el detalle por campo.
export class AppError extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

// Envuelve un controlador async para que cualquier error llegue al middleware de errores.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
