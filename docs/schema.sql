-- Neon Defense - Minimal Schema (RLS-friendly, writes via n8n service key)
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null
);

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  player_id uuid references public.players(id) on delete cascade,
  session_token text not null,
  current_wave int not null default 0,
  base_hp int not null default 20,
  energy int not null default 20,
  score int not null default 0
);

create table if not exists public.towers (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.runs(id) on delete cascade,
  type text not null check (type in ('laser','pulse','missile')),
  slot int not null,
  level int not null default 1,
  damage int not null default 1,
  range int not null default 100
);

create table if not exists public.enemies (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.runs(id) on delete cascade,
  wave int not null,
  type text not null check (type in ('triangle','square','circle')),
  hp int not null,
  speed numeric not null
);

create table if not exists public.meta_progression (
  player_id uuid references public.players(id) on delete cascade,
  key text not null,
  value jsonb not null,
  primary key (player_id, key)
);

-- Enable RLS
alter table public.players enable row level security;
alter table public.runs enable row level security;
alter table public.towers enable row level security;
alter table public.enemies enable row level security;
alter table public.meta_progression enable row level security;

-- Minimal read access to meta (public)
create policy meta_read_all on public.meta_progression for select using (true);

-- No public writes by default
revoke all on all tables in schema public from anon, authenticated;
grant select on public.meta_progression to anon;

-- Writes should be done via n8n with service role key.
