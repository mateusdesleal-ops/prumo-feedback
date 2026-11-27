-- Prumo Feedback · equipes compartilhadas (hierarquia de líderes e espaço do RH)

create table public.orgs(
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 80),
  tipo text not null default 'misto' check (tipo in ('lider','rh','misto')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.org_members(
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null default '',
  email text,
  cargo text not null default '',
  papel text not null default 'lider' check (papel in ('lider','rh')),
  gestor_id uuid,
  role text not null default 'membro' check (role in ('dono','membro')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index org_members_user_idx on public.org_members(user_id);
create index org_members_gestor_idx on public.org_members(org_id, gestor_id);

create table public.org_invites(
  code text primary key,
  org_id uuid not null references public.orgs(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days',
  ativo boolean not null default true
);
create index org_invites_org_idx on public.org_invites(org_id);
create index org_invites_created_by_idx on public.org_invites(created_by);

create table public.comments(
  id bigint generated always as identity primary key,
  org_id uuid not null references public.orgs(id) on delete cascade,
  owner_id uuid not null,
  item_tipo text not null,
  item_id text not null,
  autor_id uuid not null references auth.users(id) on delete cascade,
  autor_nome text,
  texto text not null check (char_length(texto) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index comments_item_idx on public.comments(owner_id, item_tipo, item_id);
create index comments_org_idx on public.comments(org_id);
create index comments_autor_idx on public.comments(autor_id);

create table public.team_cases(
  org_id uuid not null references public.orgs(id) on delete cascade,
  id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_nome text,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (org_id, owner_id, id)
);
create index team_cases_owner_idx on public.team_cases(owner_id);

-- funções auxiliares (definer: evitam recursão nas políticas)
create function public.sou_membro(o uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.org_members where org_id = o and user_id = (select auth.uid()))
$$;
create function public.sou_dono(o uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.org_members where org_id = o and user_id = (select auth.uid()) and role = 'dono')
$$;
-- verdadeiro se quem chama está acima de "alvo" na cadeia de gestores de alguma equipe
create function public.sou_gestor_de(alvo uuid) returns boolean language sql stable security definer set search_path = '' as $$
  with recursive cadeia as (
    select org_id, user_id, gestor_id from public.org_members where user_id = alvo
    union
    select m.org_id, m.user_id, m.gestor_id from public.org_members m join cadeia c on m.org_id = c.org_id and m.user_id = c.gestor_id
  )
  select alvo <> (select auth.uid()) and exists(select 1 from cadeia where gestor_id = (select auth.uid()))
$$;

alter table public.orgs enable row level security;
alter table public.org_members enable row level security;
alter table public.org_invites enable row level security;
alter table public.comments enable row level security;
alter table public.team_cases enable row level security;

create policy orgs_select on public.orgs for select to authenticated using (public.sou_membro(id) or created_by = (select auth.uid()));
create policy orgs_insert on public.orgs for insert to authenticated with check (created_by = (select auth.uid()));
create policy orgs_update on public.orgs for update to authenticated using (public.sou_dono(id)) with check (public.sou_dono(id));
create policy orgs_delete on public.orgs for delete to authenticated using (public.sou_dono(id));

create policy members_select on public.org_members for select to authenticated using (public.sou_membro(org_id));
-- inserção direta só para o criador se tornar dono; os demais entram pela função entrar_equipe
create policy members_insert_dono on public.org_members for insert to authenticated with check (
  user_id = (select auth.uid()) and role = 'dono'
  and exists(select 1 from public.orgs o where o.id = org_id and o.created_by = (select auth.uid()))
);
create policy members_delete on public.org_members for delete to authenticated using (public.sou_dono(org_id) or user_id = (select auth.uid()));

create policy invites_select on public.org_invites for select to authenticated using (public.sou_dono(org_id));
create policy invites_insert on public.org_invites for insert to authenticated with check (public.sou_dono(org_id) and created_by = (select auth.uid()));
create policy invites_update on public.org_invites for update to authenticated using (public.sou_dono(org_id)) with check (public.sou_dono(org_id));

create policy comments_select on public.comments for select to authenticated using (public.sou_membro(org_id));
create policy comments_insert on public.comments for insert to authenticated with check (autor_id = (select auth.uid()) and public.sou_membro(org_id));
create policy comments_delete on public.comments for delete to authenticated using (autor_id = (select auth.uid()));

create policy cases_select on public.team_cases for select to authenticated using (public.sou_membro(org_id));
create policy cases_insert on public.team_cases for insert to authenticated with check (owner_id = (select auth.uid()) and public.sou_membro(org_id));
create policy cases_update on public.team_cases for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()) and public.sou_membro(org_id));
create policy cases_delete on public.team_cases for delete to authenticated using (owner_id = (select auth.uid()));

-- gestor acima na cadeia pode ver e editar o Prumo do liderado direto/indireto
create policy app_state_select_gestor on public.app_state for select to authenticated using (public.sou_gestor_de(user_id));
create policy app_state_update_gestor on public.app_state for update to authenticated using (public.sou_gestor_de(user_id)) with check (public.sou_gestor_de(user_id));

-- entrar por convite
create function public.info_convite(p_code text) returns table(org_id uuid, nome text, tipo text) language sql stable security definer set search_path = '' as $$
  select o.id, o.nome, o.tipo from public.org_invites i join public.orgs o on o.id = i.org_id
  where i.code = p_code and i.ativo and i.expires_at > now()
$$;
create function public.entrar_equipe(p_code text, p_nome text, p_email text, p_papel text) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_org uuid;
begin
  if (select auth.uid()) is null then raise exception 'nao_autenticado'; end if;
  select i.org_id into v_org from public.org_invites i where i.code = p_code and i.ativo and i.expires_at > now();
  if v_org is null then raise exception 'convite_invalido'; end if;
  insert into public.org_members(org_id, user_id, nome, email, papel)
  values (v_org, (select auth.uid()), left(coalesce(p_nome,''), 80), left(coalesce(p_email,''), 120), case when p_papel = 'rh' then 'rh' else 'lider' end)
  on conflict (org_id, user_id) do nothing;
  return v_org;
end $$;

-- ajustar papel e gestor (dono ajusta qualquer membro; cada um ajusta o próprio)
create function public.definir_membro(p_org uuid, p_user uuid, p_papel text, p_gestor uuid, p_nome text, p_cargo text) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not (public.sou_dono(p_org) or p_user = (select auth.uid())) then raise exception 'sem_permissao'; end if;
  if p_gestor is not null and (p_gestor = p_user or not exists(select 1 from public.org_members where org_id = p_org and user_id = p_gestor)) then raise exception 'gestor_invalido'; end if;
  update public.org_members set
    papel = case when p_papel in ('lider','rh') then p_papel else papel end,
    gestor_id = p_gestor,
    nome = coalesce(nullif(left(p_nome, 80), ''), nome),
    cargo = coalesce(left(p_cargo, 80), cargo)
  where org_id = p_org and user_id = p_user;
end $$;

revoke execute on function public.sou_membro(uuid), public.sou_dono(uuid), public.sou_gestor_de(uuid), public.info_convite(text), public.entrar_equipe(text,text,text,text), public.definir_membro(uuid,uuid,text,uuid,text,text) from public, anon;
grant execute on function public.sou_membro(uuid), public.sou_dono(uuid), public.sou_gestor_de(uuid), public.info_convite(text), public.entrar_equipe(text,text,text,text), public.definir_membro(uuid,uuid,text,uuid,text,text) to authenticated;
