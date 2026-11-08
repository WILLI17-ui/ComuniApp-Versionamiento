# ComuniApp

Directorio web de emprendimientos y servicios del conjunto residencial **Ciudad La Salle Galet** (Bogotá).
Los residentes buscan productos y servicios de sus vecinos y los contactan por WhatsApp; los emprendedores
crean una cuenta para publicar, editar y eliminar sus emprendimientos.

Proyecto académico de la asignatura **Proyecto de Software** (Corporación Universitaria Iberoamericana).

## Tecnologías

| Parte | Herramienta |
|---|---|
| Interfaz y lógica | Next.js 16 (React 19, TypeScript) + Tailwind CSS 4 |
| Base de datos, usuarios y fotos | Supabase (PostgreSQL, Auth y Storage) |
| Publicación | Vercel |
| Código | GitHub |

## Funciones

- Inicio con categorías y emprendimientos destacados.
- Directorio con filtro por categoría y búsqueda por nombre o descripción.
- Perfil del emprendimiento con foto, horario y botón de WhatsApp.
- Registro con aceptación de términos y política de privacidad; inicio y cierre de sesión.
- Panel del emprendedor: crear, editar y eliminar emprendimientos con foto opcional (JPG o PNG, máx. 2 MB).
- Diseño responsive para celular y computador.

## Uso sin instalar nada

Abre el enlace de Vercel del proyecto en cualquier navegador.

## Ejecutar en tu computador

Requisitos: [Node.js 20 o superior](https://nodejs.org).

```bash
cd comuniapp-web
npm install
cp .env.example .env.local   # y completa los datos de Supabase
npm run dev
```

Abre http://localhost:3000. Si no configuras `.env.local`, la app funciona en **modo demostración**
(los datos se guardan solo en tu navegador).

## Configurar Supabase

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta `supabase/schema.sql` (crea tablas, reglas de seguridad y el espacio para fotos).
3. En **Authentication → Sign In / Providers → Email**, desactiva **Confirm email**.
4. En **Project Settings → API Keys**, copia el *Project URL* y la *anon/publishable key* en `.env.local`
   (y en las variables de entorno de Vercel).
5. Opcional: crea la cuenta `demo@comuniapp.com` en la app y ejecuta `supabase/seed.sql` para cargar datos de ejemplo.

## Publicar en Vercel

1. En [vercel.com](https://vercel.com) → **Add New → Project** → importa este repositorio.
2. En **Root Directory** elige `comuniapp-web`.
3. En **Environment Variables** agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Deploy**.

## Seguridad

- Las contraseñas las cifra Supabase Auth; la app nunca las guarda.
- Reglas de seguridad por fila (RLS): cualquiera puede ver los emprendimientos, pero solo el dueño puede crearlos,
  editarlos o eliminarlos, incluso si alguien intenta hacerlo directamente contra la API.
- Las fotos se guardan en la carpeta de cada usuario y solo él puede cambiarlas o borrarlas.
