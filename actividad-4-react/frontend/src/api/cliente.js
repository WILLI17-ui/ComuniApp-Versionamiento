import axios from 'axios';

export const TOKEN_KEY = 'comuniapp_token';

// Instancia única de Axios: todas las peticiones salen con la misma URL base y tiempo límite.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
});

// Interceptor de petición: si hay sesión, agrega el token JWT en el encabezado Authorization.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de respuesta: convierte cualquier error en un objeto simple { mensaje, detalles, status }
// para que los componentes no tengan que conocer la estructura interna de Axios.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    const status = error.response?.status ?? 0;
    const mensaje = error.response?.data?.error?.mensaje
      ?? (status === 0 ? 'No hay conexión con el servidor. Revisa tu internet.' : 'Algo salió mal.');
    if (status === 401) window.dispatchEvent(new Event('sesion-vencida'));
    return Promise.reject({ status, mensaje, detalles: error.response?.data?.error?.detalles ?? {} });
  },
);
