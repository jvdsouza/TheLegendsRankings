export type SeasonStatus = "promoted" | "demoted";

export type Player = {
  id: string;
  gamertag: string;
  rank_position: number;
  previous_tier: number | null;
  season_status: SeasonStatus | null;
};

export type FillDirection = "bottom_up" | "top_down";

export type Settings = {
  tier_size: number;
  fill_direction: FillDirection;
  season_backup_available: boolean;
};
