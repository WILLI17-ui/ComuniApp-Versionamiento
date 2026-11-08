-- =====================================================================
-- ComuniApp - Esquema de base de datos para Supabase
-- Ejecutar completo en: Supabase > SQL Editor > New query > Run
-- =====================================================================

-- 1. Perfiles de emprendedores (se crean automáticamente al registrarse)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  acepto_terminos_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Cada usuario ve su perfil" on public.profiles;
create policy "Cada usuario ve su perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- Crea el perfil con el nombre y la fecha de aceptación de términos
-- que la app envía al registrarse (HU07).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, acepto_terminos_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce((new.raw_user_meta_data ->> 'acepto_terminos_at')::timestamptz, now())
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Emprendimientos
create table if not exists public.emprendimientos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 2 and 60),
  categoria text not null check (categoria in
    ('Alimentos','Mascotas','Hogar','Belleza','Tecnología','Segunda mano','Otros')),
  descripcion text not null check (char_length(descripcion) between 10 and 400),
  horario text not null check (char_length(horario) between 3 and 100),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10}$'),
  foto_url text,
  foto_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists emprendimientos_categoria_idx on public.emprendimientos (categoria);
create index if not exists emprendimientos_owner_idx on public.emprendimientos (owner_id);

alter table public.emprendimientos enable row level security;

-- Cualquiera (incluso sin cuenta) puede ver los emprendimientos (HU02, HU05)
drop policy if exists "Emprendimientos visibles para todos" on public.emprendimientos;
create policy "Emprendimientos visibles para todos"
  on public.emprendimientos for select
  using (true);

-- Solo el dueño puede crear, editar o eliminar (HU09, HU14, HU15)
drop policy if exists "El dueño crea" on public.emprendimientos;
create policy "El dueño crea"
  on public.emprendimientos for insert
  with check (auth.uid() = owner_id);

drop policy if exists "El dueño edita" on public.emprendimientos;
create policy "El dueño edita"
  on public.emprendimientos for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "El dueño elimina" on public.emprendimientos;
create policy "El dueño elimina"
  on public.emprendimientos for delete
  using (auth.uid() = owner_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists emprendimientos_updated_at on public.emprendimientos;
create trigger emprendimientos_updated_at
  before update on public.emprendimientos
  for each row execute function public.set_updated_at();

-- 3. Fotos (HU11): bucket público, solo JPG/PNG de máximo 2 MB
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 2097152, array['image/jpeg','image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Cada usuario solo puede subir, cambiar o borrar fotos dentro de su carpeta
drop policy if exists "Fotos: subir en carpeta propia" on storage.objects;
create policy "Fotos: subir en carpeta propia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Fotos: actualizar en carpeta propia" on storage.objects;
create policy "Fotos: actualizar en carpeta propia"
  on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Fotos: borrar en carpeta propia" on storage.objects;
create policy "Fotos: borrar en carpeta propia"
  on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);
