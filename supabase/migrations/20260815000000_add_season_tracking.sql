alter table public.players
  add column if not exists previous_tier integer,
  add column if not exists season_status text,
  add column if not exists previous_tier_backup integer,
  add column if not exists season_status_backup text;

alter table public.players
  add constraint players_season_status_check
  check (season_status in ('promoted', 'demoted')),
  add constraint players_season_status_backup_check
  check (season_status_backup in ('promoted', 'demoted'));

alter table public.settings
  add column if not exists season_backup_available boolean not null default false;
