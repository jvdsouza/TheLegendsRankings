import { createClient } from "@/lib/supabase/server";
import type { Player, Settings } from "@/lib/types";
import { computeTiers } from "@/lib/tiers";
import { addPlayer } from "./actions";
import PlayerRow from "./player-row";
import SettingsForm from "./settings-form";

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: playerData }, { data: settingsData }] = await Promise.all([
    supabase.from("players").select("id, gamertag, rank_position").order("rank_position", { ascending: true }),
    supabase.from("settings").select("tier_size, fill_direction").eq("id", 1).single(),
  ]);

  const settings: Settings = settingsData ?? { tier_size: 6, fill_direction: "bottom_up" };
  const players = (playerData ?? []) as Player[];
  const tiers = computeTiers(players, settings.tier_size, settings.fill_direction);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <SettingsForm settings={settings} />

      <section>
        <h2 className="mb-3 text-base font-semibold text-zinc-50">Add player</h2>
        <form action={addPlayer} className="flex flex-col gap-2 sm:flex-row">
          <input
            name="gamertag"
            required
            placeholder="Gamertag"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="rounded-md bg-amber-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-400"
          >
            Add
          </button>
        </form>
        <p className="mt-2 text-sm text-zinc-500">
          New players are added to the bottom of the ranked list (lowest tier).
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-zinc-50">Ranked roster</h2>
          <span className="text-sm text-zinc-500">
            {players.length} player{players.length === 1 ? "" : "s"} · {tiers.length} tier
            {tiers.length === 1 ? "" : "s"}
          </span>
        </div>

        {players.length === 0 ? (
          <p className="text-sm text-zinc-500">No players yet. Add the first one above.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {players.map((player, index) => (
              <PlayerRow
                key={player.id}
                player={player}
                isFirst={index === 0}
                isLast={index === players.length - 1}
              />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
