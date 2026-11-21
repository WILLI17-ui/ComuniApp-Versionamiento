import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cargando from './Cargando';

// Protege las rutas del emprendedor. Si no hay sesión, redirige al login
// y guarda la página a la que quería entrar para volver después.
export default function RutaPrivada() {
  const { autenticado, verificando } = useAuth();
  const location = useLocation();
  if (verificando) return <Cargando texto="Verificando sesión..." />;
  if (!autenticado) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  return <Outlet />;
}
