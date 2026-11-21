import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import emprendimientoRoutes from './routes/emprendimientos.js';
import { manejarErrores, noEncontrado } from './middleware/errores.js';
import { openapi } from './docs/openapi.js';
import { CATEGORIAS } from './utils/validar.js';
import { query } from './db/pool.js';
import swaggerUiDist from 'swagger-ui-dist';

const app = express();

// Orígenes permitidos para CORS (frontend local y el desplegado), separados por coma en FRONTEND_URL.
const permitidos = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: permitidos }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await query('select 1');
    res.json({ estado: 'ok', baseDeDatos: 'conectada' });
  } catch (err) {
    // El código (no el mensaje completo) ayuda a diagnosticar sin exponer datos sensibles.
    console.error('[health]', err.code, err.message);
    res.status(503).json({ estado: 'error', baseDeDatos: 'sin conexión', codigo: err.code ?? 'desconocido' });
  }
});
app.get('/api/categorias', (_req, res) => res.json(CATEGORIAS));

app.use('/api/auth', authRoutes);
app.use('/api/emprendimientos', emprendimientoRoutes);

// Documentación: la especificación en JSON y Swagger UI servido desde el paquete swagger-ui-dist.
app.get('/api/openapi.json', (_req, res) => res.json(openapi));
app.use('/api/docs/assets', express.static(swaggerUiDist.getAbsoluteFSPath(), { index: false }));
app.get(['/api/docs', '/'], (_req, res) => res.type('html').send(`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>ComuniApp API · Swagger</title>
<link rel="stylesheet" href="/api/docs/assets/swagger-ui.css"></head>
<body><div id="swagger"></div>
<script src="/api/docs/assets/swagger-ui-bundle.js"></script>
<script src="/api/docs/iniciar.js"></script>
</body></html>`));
// El arranque va en un archivo aparte para no usar scripts en línea.
app.get('/api/docs/iniciar.js', (_req, res) => res.type('js')
  .send("SwaggerUIBundle({ url: '/api/openapi.json', dom_id: '#swagger' });"));

app.use(noEncontrado);
app.use(manejarErrores);

export default app;
