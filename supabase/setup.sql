-- Run once in Supabase SQL Editor. Only signed-in owners can access their own state.
create table if not exists public.lager_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.lager_state enable row level security;
revoke all on public.lager_state from anon;
grant select, insert, update on public.lager_state to authenticated;
drop policy if exists lager_state_owner_select on public.lager_state;
drop policy if exists lager_state_owner_insert on public.lager_state;
drop policy if exists lager_state_owner_update on public.lager_state;
create policy lager_state_owner_select on public.lager_state for select to authenticated using (user_id = (select auth.uid()));
create policy lager_state_owner_insert on public.lager_state for insert to authenticated with check (user_id = (select auth.uid()));
create policy lager_state_owner_update on public.lager_state for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
-- Atomic compare-and-swap update to avoid silently overwriting concurrent changes.
create or replace function public.save_lager_state(expected_revision bigint, new_payload jsonb)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare new_revision bigint;
begin
  update public.lager_state set payload = new_payload, revision = revision + 1, updated_at = now()
  where user_id = (select auth.uid()) and revision = expected_revision
  returning revision into new_revision;
  if new_revision is null then raise exception 'VERSION_CONFLICT: cloud state changed or not initialized'; end if;
  return new_revision;
end;
$$;
revoke all on function public.save_lager_state(bigint,jsonb) from public, anon;
grant execute on function public.save_lager_state(bigint,jsonb) to authenticated;
