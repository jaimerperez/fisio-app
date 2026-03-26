-- =============================================
-- FisioApp - Schema para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- Tabla: patients
create table patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  last_name text not null,
  birth_date text,
  phone text,
  email text,
  dni text,
  medical_history text,
  photos jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table patients enable row level security;
create policy "own" on patients for all using (auth.uid() = user_id);

-- Tabla: appointments
create table appointments (
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
create policy "own" on appointments for all using (auth.uid() = user_id);

-- Tabla: sessions
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  patient_id uuid references patients(id) on delete cascade,
  date text not null,
  duration integer,
  notes text,
  treatment text,
  next_session text,
  created_at timestamptz default now()
);

alter table sessions enable row level security;
create policy "own" on sessions for all using (auth.uid() = user_id);
