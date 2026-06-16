create table if not exists public.settings (
  id integer primary key default 1,
  tier_size integer not null default 6,
  fill_direction text not null default 'bottom_up',
  constraint settings_singleton check (id = 1),
  constraint settings_tier_size check (tier_size >= 1 and tier_size <= 20),
  constraint settings_fill_direction check (fill_direction in ('bottom_up', 'top_down'))
);

-- Seed the single settings row with defaults.
insert into public.settings (id) values (1) on conflict do nothing;

alter table public.settings enable row level security;

create policy "Settings are publicly readable"
  on public.settings for select
  using (true);

create policy "Authenticated users can update settings"
  on public.settings for update
  to authenticated
  using (true)
  with check (true);
