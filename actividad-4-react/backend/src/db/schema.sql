-- ComuniApp · Actividad 4
-- Tablas nuevas con prefijo a4_ para no mezclar datos con la app publicada.
-- Se puede ejecutar en el SQL Editor de Supabase o con: npm run db:init

create extension if not exists pgcrypto;

create table if not exists a4_emprendedores (
  id               uuid primary key default gen_random_uuid(),
  nombre           varchar(80)  not null,
  email            varchar(120) not null unique,
  password_hash    text         not null,
  acepta_terminos  boolean      not null default false,
  creado_en        timestamptz  not null default now(),
  constraint a4_terminos_aceptados check (acepta_terminos = true)
);

create table if not exists a4_emprendimientos (
  id              uuid primary key default gen_random_uuid(),
  emprendedor_id  uuid not null references a4_emprendedores(id) on delete cascade,
  nombre          varchar(80)  not null,
  descripcion     varchar(600) not null,
  categoria       varchar(30)  not null,
  horario         varchar(80),
  whatsapp        varchar(15)  not null,
  imagen_url      text,
  creado_en       timestamptz  not null default now(),
  actualizado_en  timestamptz  not null default now(),
  constraint a4_categoria_valida check (categoria in
    ('Alimentos','Mascotas','Hogar','Belleza','Tecnología','Segunda mano','Otros')),
  constraint a4_whatsapp_valido check (whatsapp ~ '^[0-9]{10,15}$')
);

create index if not exists a4_idx_emp_categoria   on a4_emprendimientos (categoria);
create index if not exists a4_idx_emp_emprendedor on a4_emprendimientos (emprendedor_id);

-- La API se conecta con el usuario de base de datos del servidor; el navegador
-- nunca accede directo a estas tablas. Por eso se activa RLS sin políticas públicas.
alter table a4_emprendedores   enable row level security;
alter table a4_emprendimientos enable row level security;
