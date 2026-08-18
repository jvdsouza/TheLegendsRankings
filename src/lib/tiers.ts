import type { Player } from "./types";

export const DEFAULT_TIER_SIZES = [6];

export type Tier = {
  tierNumber: number;
  players: Player[];
};

export function computeTiers(players: Player[], tierSizes: number[] = DEFAULT_TIER_SIZES): Tier[] {
  const sorted = [...players].sort((a, b) => a.rank_position - b.rank_position);
  const total = sorted.length;
  if (total === 0) return [];

  const tiers: Tier[] = [];
  let index = 0;
  let tierNumber = 1;

  for (const size of tierSizes) {
    if (index >= total) break;
    const take = Math.min(size, total - index);
    tiers.push({ tierNumber: tierNumber++, players: sorted.slice(index, index + take) });
    index += take;
  }

  // Any players left over after the configured sizes are exhausted fall into
  // one final catch-all tier.
  if (index < total) {
    tiers.push({ tierNumber: tierNumber++, players: sorted.slice(index) });
  }

  return tiers;
}
