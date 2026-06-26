-- =============================================
-- FisioApp - Schema para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Este script es idempotente: puede ejecutarse sobre una base nueva
-- o sobre una existente para añadir las columnas que falten.
-- =============================================

-- ---------------------------------------------
-- Tabla: patients
-- ---------------------------------------------
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  last_name text not null,
  birth_date text,
  phone text,
  email text,
  dni text,
  medical_history text,
  pathologies text,
  observations text,
  billing_rate numeric,
  billing_method text,
  billing_notes text,
  consent_signed_at timestamptz,
  avatar_path text,
  photos jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Columnas añadidas posteriormente (no-op si ya existen)
alter table patients add column if not exists pathologies text;
alter table patients add column if not exists observations text;
alter table patients add column if not exists billing_rate numeric;
alter table patients add column if not exists billing_method text;
alter table patients add column if not exists billing_notes text;
alter table patients add column if not exists consent_signed_at timestamptz;
alter table patients add column if not exists avatar_path text;
alter table patients add column if not exists updated_at timestamptz default now();

alter table patients enable row level security;
drop policy if exists "own" on patients;
create policy "own" on patients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists patients_user_id_idx on patients (user_id);
create index if not exists patients_last_name_idx on patients (last_name);

-- ---------------------------------------------
-- Tabla: appointments
-- ---------------------------------------------
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  patient_id uuid references patients(id) on delete cascade,
  date text not null,
  time text not null,
  duration integer,
  notes text,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table appointments enable row level security;
drop policy if exists "own" on appointments;
create policy "own" on appointments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists appointments_user_id_idx on appointments (user_id);
create index if not exists appointments_date_idx on appointments (date);
create index if not exists appointments_patient_id_idx on appointments (patient_id);

-- ---------------------------------------------
-- Tabla: sessions
-- ---------------------------------------------
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  patient_id uuid references patients(id) on delete cascade,
  date text not null,
  duration integer,
  treatment text,
  symptoms text,
  inspection text,
  observations text,
  notes text,
  photos jsonb default '[]'::jsonb,
  next_session text,
  created_at timestamptz default now()
);

-- Columnas añadidas posteriormente (no-op si ya existen)
alter table sessions add column if not exists symptoms text;
alter table sessions add column if not exists inspection text;
alter table sessions add column if not exists observations text;
alter table sessions add column if not exists photos jsonb default '[]'::jsonb;

alter table sessions enable row level security;
drop policy if exists "own" on sessions;
create policy "own" on sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists sessions_user_id_idx on sessions (user_id);
create index if not exists sessions_patient_id_idx on sessions (patient_id);
create index if not exists sessions_date_idx on sessions (date);

-- ---------------------------------------------
-- Tabla: app_settings (una fila por usuario)
-- Almacena la firma LOPD del fisioterapeuta y el texto del consentimiento.
-- ---------------------------------------------
create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  consent_text text not null,
  physio_name text not null default '',
  physio_consent_signed_at timestamptz,
  created_at timestamptz default now()
);

alter table app_settings enable row level security;
drop policy if exists "own" on app_settings;
create policy "own" on app_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists app_settings_user_id_idx on app_settings (user_id);

-- ---------------------------------------------
-- Tabla: exercise_folders
-- ---------------------------------------------
create table if not exists exercise_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamptz default now()
);

alter table exercise_folders enable row level security;
drop policy if exists "own" on exercise_folders;
create policy "own" on exercise_folders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists exercise_folders_user_id_idx on exercise_folders (user_id);

-- ---------------------------------------------
-- Tabla: exercises
-- ---------------------------------------------
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  folder_id uuid references exercise_folders(id) on delete set null,
  name text not null,
  mime_type text not null,
  size integer not null default 0,
  path text not null,
  created_at timestamptz default now()
);

alter table exercises enable row level security;
drop policy if exists "own" on exercises;
create policy "own" on exercises for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists exercises_user_id_idx on exercises (user_id);
create index if not exists exercises_folder_id_idx on exercises (folder_id);

-- ---------------------------------------------
-- Storage: bucket privado para archivos de ejercicios
-- Rutas: <user_id>/<uuid>.<ext>
-- ---------------------------------------------
insert into storage.buckets (id, name, public)
values ('exercises', 'exercises', false)
on conflict (id) do nothing;

drop policy if exists "exercises_select_own" on storage.objects;
create policy "exercises_select_own" on storage.objects for select
  using (bucket_id = 'exercises' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "exercises_insert_own" on storage.objects;
create policy "exercises_insert_own" on storage.objects for insert
  with check (bucket_id = 'exercises' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "exercises_update_own" on storage.objects;
create policy "exercises_update_own" on storage.objects for update
  using (bucket_id = 'exercises' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "exercises_delete_own" on storage.objects;
create policy "exercises_delete_own" on storage.objects for delete
  using (bucket_id = 'exercises' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------
-- Storage: bucket privado para fotos de pacientes y sesiones
-- Las rutas tienen la forma: <user_id>/patients/<id>/<uuid>.jpg
--                            <user_id>/sessions/<uuid>.jpg
-- El primer segmento de la ruta es el user_id (control de acceso por RLS).
-- ---------------------------------------------
insert into storage.buckets (id, name, public)
values ('patient-photos', 'patient-photos', false)
on conflict (id) do nothing;

drop policy if exists "photos_select_own" on storage.objects;
create policy "photos_select_own" on storage.objects for select
  using (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos_insert_own" on storage.objects;
create policy "photos_insert_own" on storage.objects for insert
  with check (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos_update_own" on storage.objects;
create policy "photos_update_own" on storage.objects for update
  using (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos_delete_own" on storage.objects;
create policy "photos_delete_own" on storage.objects for delete
  using (bucket_id = 'patient-photos' and (storage.foldername(name))[1] = auth.uid()::text);
