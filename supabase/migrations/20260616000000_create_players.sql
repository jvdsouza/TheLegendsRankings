create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  gamertag text not null,
  rank_position integer not null,
  created_at timestamptz not null default now()
);

create index if not exists players_rank_position_idx on public.players (rank_position);
