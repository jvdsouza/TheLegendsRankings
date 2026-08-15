"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeTiers } from "@/lib/tiers";
import type { Player, SeasonStatus } from "@/lib/types";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addPlayer(formData: FormData) {
  const gamertag = (formData.get("gamertag") as string)?.trim();
  if (!gamertag) return;

  const supabase = await createClient();

  const { data: maxRow } = await supabase
    .from("players")
    .select("rank_position")
    .order("rank_position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (maxRow?.rank_position ?? 0) + 1;

  await supabase.from("players").insert({ gamertag, rank_position: nextPosition });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updatePlayer(id: string, formData: FormData) {
  const gamertag = (formData.get("gamertag") as string)?.trim();
  if (!gamertag) return;

  const supabase = await createClient();
  await supabase.from("players").update({ gamertag }).eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deletePlayer(id: string) {
  const supabase = await createClient();
  await supabase.from("players").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateSettings(formData: FormData) {
  const tierSize = parseInt(formData.get("tier_size") as string, 10);
  const fillDirection = formData.get("fill_direction") as string;

  if (!Number.isInteger(tierSize) || tierSize < 1 || tierSize > 20) return;
  if (fillDirection !== "bottom_up" && fillDirection !== "top_down") return;

  const supabase = await createClient();
  await supabase
    .from("settings")
    .update({ tier_size: tierSize, fill_direction: fillDirection })
    .eq("id", 1);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function movePlayer(id: string, direction: "up" | "down") {
  const supabase = await createClient();

  const { data: players } = await supabase
    .from("players")
    .select("id, rank_position")
    .order("rank_position", { ascending: true });

  if (!players) return;

  const index = players.findIndex((p) => p.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= players.length) return;

  const current = players[index];
  const swap = players[swapIndex];

  await supabase.from("players").update({ rank_position: swap.rank_position }).eq("id", current.id);
  await supabase.from("players").update({ rank_position: current.rank_position }).eq("id", swap.id);

  revalidatePath("/admin");
  revalidatePath("/");
}

// NOTE: tier numbers are recomputed from the *current* tier_size/fill_direction settings.
// If those settings change in the same sitting as a season update, tier numbers can shift
// for reasons unrelated to actual roster movement, which would show up as spurious
// promotions/demotions.
export async function applySeasonUpdate() {
  const supabase = await createClient();

  const [{ data: playerData }, { data: settingsData }] = await Promise.all([
    supabase
      .from("players")
      .select("id, gamertag, rank_position, previous_tier, season_status")
      .order("rank_position", { ascending: true }),
    supabase.from("settings").select("tier_size, fill_direction").eq("id", 1).single(),
  ]);

  if (!playerData || !settingsData) return;

  const players = playerData as Player[];
  const tiers = computeTiers(players, settingsData.tier_size, settingsData.fill_direction);

  const tierByPlayerId = new Map<string, number>();
  for (const tier of tiers) {
    for (const player of tier.players) {
      tierByPlayerId.set(player.id, tier.tierNumber);
    }
  }

  await Promise.all(
    players.map((player) => {
      const currentTier = tierByPlayerId.get(player.id);
      if (currentTier === undefined) return null;

      let seasonStatus: SeasonStatus | null = null;
      if (player.previous_tier != null) {
        if (currentTier < player.previous_tier) seasonStatus = "promoted";
        else if (currentTier > player.previous_tier) seasonStatus = "demoted";
      }

      return supabase
        .from("players")
        .update({
          previous_tier_backup: player.previous_tier,
          season_status_backup: player.season_status,
          previous_tier: currentTier,
          season_status: seasonStatus,
        })
        .eq("id", player.id);
    }),
  );

  await supabase.from("settings").update({ season_backup_available: true }).eq("id", 1);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function undoSeasonUpdate() {
  const supabase = await createClient();

  const { data: settingsData } = await supabase
    .from("settings")
    .select("season_backup_available")
    .eq("id", 1)
    .single();

  if (!settingsData?.season_backup_available) return;

  const { data: playerData } = await supabase
    .from("players")
    .select("id, previous_tier_backup, season_status_backup");

  if (!playerData) return;

  await Promise.all(
    playerData.map((player) =>
      supabase
        .from("players")
        .update({
          previous_tier: player.previous_tier_backup,
          season_status: player.season_status_backup,
          previous_tier_backup: null,
          season_status_backup: null,
        })
        .eq("id", player.id),
    ),
  );

  await supabase.from("settings").update({ season_backup_available: false }).eq("id", 1);

  revalidatePath("/admin");
  revalidatePath("/");
}
