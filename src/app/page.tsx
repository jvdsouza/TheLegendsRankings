import { createClient } from "@/lib/supabase/server";
import type { Player, Settings } from "@/lib/types";
import { computeTiers } from "@/lib/tiers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: playerData }, { data: settingsData }] = await Promise.all([
    supabase.from("players").select("id, gamertag, rank_position").order("rank_position", { ascending: true }),
    supabase.from("settings").select("tier_size, fill_direction").eq("id", 1).single(),
  ]);

  const settings: Settings = settingsData ?? { tier_size: 6, fill_direction: "bottom_up" };
  const players = (playerData ?? []) as Player[];
  const tiers = computeTiers(players, settings.tier_size, settings.fill_direction);

  const footerText =
    settings.fill_direction === "top_down"
      ? `Tiers fill top-down in groups of ${settings.tier_size}; the bottom tier holds any remainder.`
      : `Tiers fill bottom-up in groups of ${settings.tier_size}; the top tier holds any remainder.`;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-6 py-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">The Legends Rankings</h1>
        <p className="mt-2 text-zinc-400">Tournament tiers · hosted by CryingLegend</p>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {tiers.length === 0 ? (
          <p className="text-center text-zinc-500">No rankings yet. Check back soon.</p>
        ) : (
          <div className="flex flex-col gap-10">
            {tiers.map((tier) => (
              <section key={tier.tierNumber}>
                <h2 className="mb-3 flex items-baseline gap-2 text-xl font-semibold text-amber-400">
                  Tier {tier.tierNumber}
                  <span className="text-sm font-normal text-zinc-500">
                    {tier.players.length} player{tier.players.length === 1 ? "" : "s"}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tier.players.map((player) => (
                    <div
                      key={player.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
                    >
                      <p className="font-medium text-zinc-50">{player.gamertag}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 px-6 py-6 text-center text-sm text-zinc-500">
        {footerText}
      </footer>
    </div>
  );
}
