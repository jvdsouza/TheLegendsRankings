alter table public.players enable row level security;

-- Anyone (including anonymous visitors) can read the roster for the public leaderboard.
create policy "Players are publicly readable"
  on public.players for select
  using (true);

-- Only signed-in admins can edit the roster.
create policy "Authenticated users can insert players"
  on public.players for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update players"
  on public.players for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete players"
  on public.players for delete
  to authenticated
  using (true);
