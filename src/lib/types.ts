export type Player = {
  id: string;
  gamertag: string;
  rank_position: number;
};

export type FillDirection = "bottom_up" | "top_down";

export type Settings = {
  tier_size: number;
  fill_direction: FillDirection;
};
