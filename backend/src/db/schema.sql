-- VolunteerOS schema. Run once against your Postgres/Supabase database:
--   psql "$DATABASE_URL" -f src/db/schema.sql

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create type user_role as enum ('admin', 'program_admin', 'volunteer');
create type volunteer_status as enum ('active', 'pending', 'inactive');
create type event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');
create type registration_status as enum ('registered', 'attended', 'no_show', 'cancelled');
create type attendance_method as enum ('qr', 'manual');

-- Users: shared login table for admins and volunteers
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role user_role not null default 'volunteer',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Organizations (Rotaract Kochi, NSS TVM, etc.)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  description text,
  created_at timestamptz not null default now()
);

-- Volunteer profile, extends a user
create table volunteers (
  id uuid primary key references users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  status volunteer_status not null default 'pending',
  total_hours numeric(8, 2) not null default 0,
  total_events integer not null default 0,
  joined_at timestamptz not null default now()
);

-- Events run by organizations
create table events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  capacity integer,
  status event_status not null default 'upcoming',
  created_at timestamptz not null default now()
);

-- Which volunteers signed up for which events
create table event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  status registration_status not null default 'registered',
  registered_at timestamptz not null default now(),
  unique (event_id, volunteer_id)
);

-- QR / manual attendance logs, source of truth for hours
create table attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  check_in_time timestamptz not null default now(),
  check_out_time timestamptz,
  hours_logged numeric(6, 2),
  method attendance_method not null default 'qr',
  verified_by uuid references users(id),
  created_at timestamptz not null default now()
);

-- Certificates issued to volunteers
create table certificates (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  event_id uuid references events(id) on delete set null,
  title text not null,
  issued_at timestamptz not null default now(),
  certificate_url text
);

-- Chatbot conversation log (per user)
create table chatbot_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Per-user app settings
create table user_settings (
  user_id uuid primary key references users(id) on delete cascade,
  theme text not null default 'light',
  notifications_enabled boolean not null default true,
  timezone text not null default 'Asia/Kolkata',
  updated_at timestamptz not null default now()
);

create index idx_volunteers_org on volunteers(organization_id);
create index idx_events_org on events(organization_id);
create index idx_events_start on events(start_time);
create index idx_registrations_event on event_registrations(event_id);
create index idx_registrations_volunteer on event_registrations(volunteer_id);
create index idx_attendance_event on attendance(event_id);
create index idx_attendance_volunteer on attendance(volunteer_id);
create index idx_certificates_volunteer on certificates(volunteer_id);
create index idx_chatbot_user on chatbot_messages(user_id);
