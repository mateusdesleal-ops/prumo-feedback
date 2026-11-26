-- Prumo Líder · base para o ambiente de testes
-- Cada usuário só enxerga e altera os próprios dados (RLS).

-- Estado do app por usuário (mesmo formato do protótipo, em JSON)
create table if not exists public.app_state (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.app_state enable row level security;

create policy "app_state_select_own" on public.app_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "app_state_insert_own" on public.app_state
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "app_state_update_own" on public.app_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "app_state_delete_own" on public.app_state
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Registro de uso de IA (escrito só pelas funções do servidor)
create table if not exists public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task text not null,
  provider text,
  model text,
  ok boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_user_day on public.ai_usage (user_id, created_at desc);
alter table public.ai_usage enable row level security;
create policy "ai_usage_select_own" on public.ai_usage
  for select to authenticated using ((select auth.uid()) = user_id);

-- Sessões de simulação por voz (controle de minutos)
create table if not exists public.sim_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  seconds integer not null default 0 check (seconds >= 0 and seconds <= 3600),
  scenario text
);
create index if not exists sim_sessions_user on public.sim_sessions (user_id, started_at desc);
alter table public.sim_sessions enable row level security;
create policy "sim_sessions_select_own" on public.sim_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
