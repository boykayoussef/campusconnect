create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  email varchar(255) not null unique,
  password_hash text not null,
  role varchar(20) not null default 'student' check (role in ('student','clubLeader','admin')),
  status varchar(20) not null default 'approved' check (status in ('pending','approved','rejected')),
  bio text default '',
  profile_picture text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  club varchar(160) not null,
  description text not null,
  requirements text[] not null default '{}',
  location varchar(255) not null,
  event_date timestamptz not null,
  type varchar(80) not null,
  category varchar(100) not null,
  total_slots integer not null check (total_slots > 0),
  status varchar(20) not null default 'open' check (status in ('open','closed')),
  created_by uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  status varchar(20) not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, event_id)
);

create index if not exists events_date_idx on events(event_date);
create index if not exists events_category_idx on events(category);
create index if not exists registrations_event_idx on registrations(event_id);
create index if not exists registrations_user_idx on registrations(user_id);

create or replace view event_capacity as
select e.id, e.total_slots,
  count(r.id) filter (where r.status <> 'cancelled')::integer as registered_count,
  greatest(e.total_slots - count(r.id) filter (where r.status <> 'cancelled')::integer, 0) as remaining_slots
from events e left join registrations r on r.event_id=e.id
group by e.id;
