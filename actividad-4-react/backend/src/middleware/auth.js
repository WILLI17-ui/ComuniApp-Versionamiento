import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

const secreto = () => {
  if (!process.env.JWT_SECRET) throw new AppError(500, 'El servidor no tiene configurado JWT_SECRET.');
  return process.env.JWT_SECRET;
};

export const firmarToken = (emprendedor) =>
  jwt.sign({ sub: emprendedor.id, nombre: emprendedor.nombre }, secreto(), { expiresIn: '7d' });

// Exige el encabezado "Authorization: Bearer <token>" y deja el id del emprendedor en req.usuario.
export function requiereAuth(req, _res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) return next(new AppError(401, 'Debes iniciar sesión.'));
  try {
    const datos = jwt.verify(token, secreto());
    req.usuario = { id: datos.sub, nombre: datos.nombre };
    next();
  } catch {
    next(new AppError(401, 'Tu sesión venció. Inicia sesión de nuevo.'));
  }
}
