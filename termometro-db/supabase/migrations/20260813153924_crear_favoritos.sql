-- Crea la tabla de ciudades favoritas
create table ciudades_favoritas (
  id bigint generated always as identity primary key,
  nombre text not null,
  lat double precision not null,
  lon double precision not null,
  creada_en timestamptz default now()
);

-- Activa la seguridad a nivel de fila (RLS)
alter table ciudades_favoritas enable row level security;

-- Permite leer y escribir desde el frontend (clave publishable)
create policy "lectura y escritura publica"
  on ciudades_favoritas for all
  to anon using (true) with check (true);