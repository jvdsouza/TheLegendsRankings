create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  gamertag text not null,
  rank_position integer not null,
  previous_tier integer,
  season_status text check (season_status in ('promoted', 'demoted')),
  previous_tier_backup integer,
  season_status_backup text check (season_status_backup in ('promoted', 'demoted')),
  created_at timestamptz not null default now()
);

create index if not exists players_rank_position_idx on public.players (rank_position);

grant select on public.players to anon, authenticated;
grant insert, update, delete on public.players to authenticated;
