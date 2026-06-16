import type { Player, FillDirection } from "./types";

export const DEFAULT_TIER_SIZE = 6;

export type Tier = {
  tierNumber: number;
  players: Player[];
};

export function computeTiers(
  players: Player[],
  tierSize = DEFAULT_TIER_SIZE,
  fillDirection: FillDirection = "bottom_up",
): Tier[] {
  const sorted = [...players].sort((a, b) => a.rank_position - b.rank_position);
  const total = sorted.length;
  if (total === 0) return [];

  const tiers: Tier[] = [];

  if (fillDirection === "top_down") {
    // Tier 1 fills completely first; the bottom tier absorbs any remainder.
    let index = 0;
    let tierNumber = 1;
    while (index < total) {
      const size = Math.min(tierSize, total - index);
      tiers.push({ tierNumber: tierNumber++, players: sorted.slice(index, index + size) });
      index += size;
    }
  } else {
    // bottom_up: lower tiers fill completely first; Tier 1 absorbs any remainder.
    const remainder = total % tierSize;
    const topTierSize = remainder === 0 ? tierSize : remainder;
    const tierCount = Math.ceil(total / tierSize);
    let index = 0;
    for (let i = 0; i < tierCount; i++) {
      const size = i === 0 ? topTierSize : tierSize;
      tiers.push({ tierNumber: i + 1, players: sorted.slice(index, index + size) });
      index += size;
    }
  }

  return tiers;
}
