"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
