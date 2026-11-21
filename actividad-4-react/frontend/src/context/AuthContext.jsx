import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { authApi } from '../api/servicios';
import { TOKEN_KEY } from '../api/cliente';
import { authReducer, estadoInicial } from './authReducer';

const AuthContext = createContext(null);

// Proveedor global de la sesión del emprendedor. Los residentes navegan sin sesión.
export function AuthProvider({ children }) {
  const [estado, dispatch] = useReducer(authReducer, estadoInicial);

  const guardarSesion = useCallback(({ token, usuario }) => {
    localStorage.setItem(TOKEN_KEY, token);
    dispatch({ type: 'SESION_INICIADA', token, usuario });
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch({ type: 'SESION_CERRADA' });
  }, []);

  // Al cargar la app, si hay un token guardado se valida contra la API.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return dispatch({ type: 'VERIFICACION_TERMINADA' });
    authApi.perfil()
      .then((usuario) => dispatch({ type: 'SESION_INICIADA', token, usuario }))
      .catch(() => cerrarSesion());
  }, [cerrarSesion]);

  // Si la API responde 401 en cualquier petición, el interceptor de Axios avisa y se cierra la sesión.
  useEffect(() => {
    window.addEventListener('sesion-vencida', cerrarSesion);
    return () => window.removeEventListener('sesion-vencida', cerrarSesion);
  }, [cerrarSesion]);

  const valor = useMemo(() => ({
    ...estado,
    autenticado: Boolean(estado.usuario),
    registrar: async (datos) => guardarSesion(await authApi.registro(datos)),
    iniciarSesion: async (datos) => guardarSesion(await authApi.login(datos)),
    cerrarSesion,
  }), [estado, guardarSesion, cerrarSesion]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// Hook propio para consumir el contexto con useContext.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
