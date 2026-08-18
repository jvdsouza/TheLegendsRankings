alter table public.settings
  add column if not exists tier_sizes integer[] not null default '{6}';

-- Carry forward each row's existing uniform tier_size as its first (and only)
-- explicit tier before dropping the old columns; any remaining players will
-- fall into the implicit catch-all tier computed in the application layer.
update public.settings
  set tier_sizes = array[tier_size]
  where tier_size is not null;

alter table public.settings
  drop column if exists tier_size,
  drop column if exists fill_direction;

alter table public.settings
  add constraint settings_tier_sizes_not_empty check (array_length(tier_sizes, 1) >= 1);
