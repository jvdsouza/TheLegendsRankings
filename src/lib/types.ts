export type SeasonStatus = "promoted" | "demoted";

export type Player = {
  id: string;
  gamertag: string;
  rank_position: number;
  previous_tier: number | null;
  season_status: SeasonStatus | null;
};

export type Settings = {
  tier_sizes: number[];
  season_backup_available: boolean;
};
