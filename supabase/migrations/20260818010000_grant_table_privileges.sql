-- RLS policies only take effect once the underlying role has the base table
-- privilege to begin with. Hosted Supabase projects get these grants for
-- free as part of project provisioning, but a local CLI-managed database
-- does not always end up with them - without this, anon/authenticated get
-- "permission denied for table" even though the RLS policies say they
-- should be allowed through.
grant select on public.players to anon, authenticated;
grant insert, update, delete on public.players to authenticated;

grant select on public.settings to anon, authenticated;
grant update on public.settings to authenticated;
