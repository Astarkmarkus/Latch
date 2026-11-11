-- Applied to Latch Supabase project on 2026-11-11.
-- Prevent overseas discovery of users who have not opted into worldwide connections.
create or replace function latch_internal.viewer_country()
returns text language sql stable security definer set search_path=''
as $$
 select lower(nullif(btrim(p.country),''))
 from public.latch_profiles p
 where p.user_id = (select auth.uid());
$$;
revoke all on function latch_internal.viewer_country() from public,anon;
grant execute on function latch_internal.viewer_country() to authenticated;

drop policy if exists "view opted in profiles" on public.latch_profiles;
create policy "view opted in profiles" on public.latch_profiles
for select to authenticated using (
 user_id=(select auth.uid())
 or (
   visible
   and latch_internal.can_view(user_id)
   and (worldwide or lower(nullif(btrim(country),'')) = latch_internal.viewer_country())
 )
);
