create table if not exists public.settings (
  id integer primary key default 1,
  tier_sizes integer[] not null default '{6}',
  season_backup_available boolean not null default false,
  constraint settings_singleton check (id = 1),
  constraint settings_tier_sizes_not_empty check (array_length(tier_sizes, 1) >= 1)
);

grant select on public.settings to anon, authenticated;
grant update on public.settings to authenticated;
