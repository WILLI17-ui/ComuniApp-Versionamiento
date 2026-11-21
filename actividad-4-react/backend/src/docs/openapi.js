// Especificación OpenAPI 3.0 de la API de ComuniApp. Swagger UI la lee desde /api/openapi.json
import { CATEGORIAS } from '../utils/validar.js';

const error = { $ref: '#/components/schemas/Error' };
const resp = (descripcion, schema) => ({ description: descripcion, content: { 'application/json': { schema } } });
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } };
const seguro = [{ bearerAuth: [] }];

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'ComuniApp API',
    version: '1.0.0',
    description: 'API REST de ComuniApp: directorio de emprendimientos de Ciudad La Salle Galet. '
      + 'Los residentes consultan sin iniciar sesión; los emprendedores se registran para publicar.',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Autenticación' }, { name: 'Emprendimientos' }, { name: 'Utilidades' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'object', properties: {
          mensaje: { type: 'string', example: 'Revisa los datos enviados.' },
          detalles: { type: 'object', additionalProperties: { type: 'string' }, example: { email: 'Escribe un correo válido.' } },
        } } },
      },
      Usuario: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, nombre: { type: 'string' }, email: { type: 'string' } } },
      Sesion: { type: 'object', properties: { token: { type: 'string' }, usuario: { $ref: '#/components/schemas/Usuario' } } },
      EmprendimientoEntrada: {
        type: 'object',
        required: ['nombre', 'descripcion', 'categoria', 'whatsapp'],
        properties: {
          nombre: { type: 'string', example: 'Arepas de la Torre 3' },
          descripcion: { type: 'string', example: 'Arepas rellenas hechas en casa, pedidos con un día de anticipación.' },
          categoria: { type: 'string', enum: CATEGORIAS },
          horario: { type: 'string', example: 'Lunes a sábado, 7:00 a. m. - 12:00 m.' },
          whatsapp: { type: 'string', example: '573001234567' },
          imagenUrl: { type: 'string', nullable: true, example: 'https://ejemplo.com/foto.jpg' },
        },
      },
      Emprendimiento: {
        allOf: [{ $ref: '#/components/schemas/EmprendimientoEntrada' }, { type: 'object', properties: {
          id: { type: 'string', format: 'uuid' }, emprendedor: { type: 'string' },
          creadoEn: { type: 'string', format: 'date-time' }, actualizadoEn: { type: 'string', format: 'date-time' },
        } }],
      },
    },
  },
  paths: {
    '/health': { get: { tags: ['Utilidades'], summary: 'Estado de la API y de la base de datos', responses: { 200: { description: 'OK' }, 503: resp('Base de datos no disponible', error) } } },
    '/categorias': { get: { tags: ['Utilidades'], summary: 'Lista de categorías válidas', responses: { 200: resp('Categorías', { type: 'array', items: { type: 'string' } }) } } },
    '/auth/registro': {
      post: {
        tags: ['Autenticación'], summary: 'Registrar un emprendedor',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['nombre', 'email', 'password', 'aceptaTerminos'], properties: {
          nombre: { type: 'string', example: 'Luisa Gómez' }, email: { type: 'string', example: 'luisa@correo.com' },
          password: { type: 'string', minLength: 8, example: 'clave-segura-1' }, aceptaTerminos: { type: 'boolean', example: true },
        } } } } },
        responses: { 201: resp('Cuenta creada', { $ref: '#/components/schemas/Sesion' }), 400: resp('Datos inválidos', error), 409: resp('Correo ya registrado', error) },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Autenticación'], summary: 'Iniciar sesión',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: {
          email: { type: 'string', example: 'luisa@correo.com' }, password: { type: 'string', example: 'clave-segura-1' } } } } } },
        responses: { 200: resp('Sesión iniciada', { $ref: '#/components/schemas/Sesion' }), 401: resp('Credenciales incorrectas', error) },
      },
    },
    '/auth/perfil': { get: { tags: ['Autenticación'], summary: 'Datos del emprendedor con sesión', security: seguro, responses: { 200: resp('Perfil', { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' } } }), 401: resp('Sin sesión', error) } } },
    '/emprendimientos': {
      get: {
        tags: ['Emprendimientos'], summary: 'Listar emprendimientos (público)',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Texto a buscar en nombre o descripción' },
          { name: 'categoria', in: 'query', schema: { type: 'string', enum: CATEGORIAS } },
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 24, default: 12 } },
        ],
        responses: { 200: resp('Listado paginado', { type: 'object', properties: {
          datos: { type: 'array', items: { $ref: '#/components/schemas/Emprendimiento' } },
          paginacion: { type: 'object', properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, paginas: { type: 'integer' } } },
        } }), 400: resp('Categoría inválida', error) },
      },
      post: {
        tags: ['Emprendimientos'], summary: 'Crear emprendimiento', security: seguro,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EmprendimientoEntrada' } } } },
        responses: { 201: { description: 'Creado' }, 400: resp('Datos inválidos', error), 401: resp('Sin sesión', error) },
      },
    },
    '/emprendimientos/mios': { get: { tags: ['Emprendimientos'], summary: 'Emprendimientos del usuario con sesión', security: seguro, responses: { 200: { description: 'Listado' }, 401: resp('Sin sesión', error) } } },
    '/emprendimientos/{id}': {
      get: { tags: ['Emprendimientos'], summary: 'Detalle de un emprendimiento (público)', parameters: [idParam], responses: { 200: resp('Detalle', { type: 'object', properties: { dato: { $ref: '#/components/schemas/Emprendimiento' } } }), 404: resp('No existe', error) } },
      put: {
        tags: ['Emprendimientos'], summary: 'Editar un emprendimiento propio', security: seguro, parameters: [idParam],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EmprendimientoEntrada' } } } },
        responses: { 200: { description: 'Actualizado' }, 400: resp('Datos inválidos', error), 401: resp('Sin sesión', error), 404: resp('No es tuyo o no existe', error) },
      },
      delete: { tags: ['Emprendimientos'], summary: 'Eliminar un emprendimiento propio', security: seguro, parameters: [idParam], responses: { 204: { description: 'Eliminado' }, 401: resp('Sin sesión', error), 404: resp('No es tuyo o no existe', error) } },
    },
  },
};
