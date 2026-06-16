import type { Player } from "./types";

export const PLAYERS_PER_TIER = 6;

export type Tier = {
  tierNumber: number;
  players: Player[];
};

/**
 * Splits a ranked list of players into tiers of 6, filled bottom-up.
 * Tier 1 is the top (best) tier and absorbs any remainder, so it can
 * have fewer than 6 players when the total isn't divisible by 6.
 */
export function computeTiers(players: Player[]): Tier[] {
  const sorted = [...players].sort((a, b) => a.rank_position - b.rank_position);
  const total = sorted.length;
  if (total === 0) return [];

  const remainder = total % PLAYERS_PER_TIER;
  const topTierSize = remainder === 0 ? PLAYERS_PER_TIER : remainder;
  const tierCount = Math.ceil(total / PLAYERS_PER_TIER);

  const tiers: Tier[] = [];
  let index = 0;
  for (let i = 0; i < tierCount; i++) {
    const size = i === 0 ? topTierSize : PLAYERS_PER_TIER;
    tiers.push({
      tierNumber: i + 1,
      players: sorted.slice(index, index + size),
    });
    index += size;
  }
  return tiers;
}
