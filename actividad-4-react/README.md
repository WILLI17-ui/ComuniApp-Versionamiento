# ComuniApp · Actividad 4 (React + API REST)

Versión de ComuniApp construida para la Actividad 4 de la Electiva Desarrollo de Aplicaciones Web.
Vive en esta carpeta aparte y **no modifica la aplicación publicada** en https://comuniapp-co.vercel.app/.

| Carpeta | Qué contiene | Tecnologías |
|---|---|---|
| `backend/` | API REST documentada con Swagger | Node.js, Express, PostgreSQL (Supabase), JWT, bcrypt, OpenAPI 3 |
| `frontend/` | Interfaz web | React 19, Vite, React Router, Context API + useReducer, Axios |

Roles: el **residente** consulta y contacta sin iniciar sesión; el **emprendedor** se registra para publicar, editar y eliminar sus emprendimientos.

## 1. Base de datos (Supabase)
Se usa el mismo proyecto de Supabase, pero con **tablas nuevas con prefijo `a4_`** (`a4_emprendedores`, `a4_emprendimientos`), así que no se tocan las tablas de la app publicada.

1. En Supabase: *Project Settings → Database → Connection string → URI* (modo *Transaction pooler*, puerto 6543). Copia la cadena.
2. Ejecuta `backend/src/db/schema.sql` en el *SQL Editor* de Supabase, o bien `npm run db:init` desde `backend/`.
3. (Opcional) `npm run db:seed` carga 6 emprendimientos **de ejemplo** y la cuenta `demo@comuniapp.co` / `demo12345`.

## 2. Ejecutar en local
```bash
# API
cd backend
cp .env.example .env      # pega DATABASE_URL y un JWT_SECRET largo
npm install
npm run dev               # http://localhost:4000  ·  Swagger: http://localhost:4000/api/docs

# Frontend (otra terminal)
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev               # http://localhost:5173
```

## 3. Pruebas
```bash
cd backend && npm test    # 11 pruebas de integración (usar una base de pruebas en DATABASE_URL)
cd frontend && npm test   # 5 pruebas de componentes y lógica (Vitest + Testing Library)
```

## 4. Despliegue en Vercel (dos proyectos nuevos)
1. **API**: *Add New → Project* → este repositorio → *Root Directory* `actividad-4-react/backend`.
   Variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (la URL del frontend desplegado).
2. **Frontend**: otro proyecto → *Root Directory* `actividad-4-react/frontend` (Vercel detecta Vite).
   Variable: `VITE_API_URL=https://<url-de-la-api>/api`.
3. Después de desplegar el frontend, actualiza `FRONTEND_URL` en la API y vuelve a desplegarla (para CORS).

## Endpoints principales
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/emprendimientos?q=&categoria=&page=` | Público |
| GET | `/api/emprendimientos/:id` | Público |
| POST | `/api/auth/registro` · `/api/auth/login` | Público |
| GET | `/api/emprendimientos/mios` | Emprendedor |
| POST · PUT · DELETE | `/api/emprendimientos[/:id]` | Emprendedor (solo los suyos) |

La documentación completa e interactiva está en `/api/docs` (Swagger UI).
