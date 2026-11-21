import { api } from './cliente';

// Cada función corresponde a un endpoint documentado en Swagger (/api/docs).
export const authApi = {
  registro: (datos) => api.post('/auth/registro', datos).then((r) => r.data),
  login: (datos) => api.post('/auth/login', datos).then((r) => r.data),
  perfil: () => api.get('/auth/perfil').then((r) => r.data.usuario),
};

export const emprendimientosApi = {
  listar: (params, signal) => api.get('/emprendimientos', { params, signal }).then((r) => r.data),
  detalle: (id, signal) => api.get(`/emprendimientos/${id}`, { signal }).then((r) => r.data.dato),
  mios: () => api.get('/emprendimientos/mios').then((r) => r.data.datos),
  crear: (datos) => api.post('/emprendimientos', datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/emprendimientos/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/emprendimientos/${id}`),
};

export const CATEGORIAS = [
  { nombre: 'Alimentos', icono: '🍲' },
  { nombre: 'Mascotas', icono: '🐾' },
  { nombre: 'Hogar', icono: '🔧' },
  { nombre: 'Belleza', icono: '💇' },
  { nombre: 'Tecnología', icono: '💻' },
  { nombre: 'Segunda mano', icono: '♻️' },
  { nombre: 'Otros', icono: '✨' },
];
