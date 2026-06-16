"use client";

import { useState, useTransition } from "react";
import type { Settings } from "@/lib/types";
import { updateSettings } from "./actions";

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-zinc-50">Tier settings</h2>
      <form
        action={handleSubmit}
        className="flex flex-col gap-5 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tier_size" className="text-sm font-medium text-zinc-300">
            Players per tier
          </label>
          <input
            id="tier_size"
            name="tier_size"
            type="number"
            min={1}
            max={20}
            defaultValue={settings.tier_size}
            required
            className="w-24 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-zinc-50 outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-300">Fill direction</span>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-zinc-300">
            <input
              type="radio"
              name="fill_direction"
              value="bottom_up"
              defaultChecked={settings.fill_direction === "bottom_up"}
              className="mt-0.5 accent-amber-500"
            />
            <span>
              <span className="font-medium text-zinc-100">Bottom-up</span>
              <span className="ml-1 text-zinc-400">
                — lower tiers fill first; Tier 1 absorbs any remainder
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-zinc-300">
            <input
              type="radio"
              name="fill_direction"
              value="top_down"
              defaultChecked={settings.fill_direction === "top_down"}
              className="mt-0.5 accent-amber-500"
            />
            <span>
              <span className="font-medium text-zinc-100">Top-down</span>
              <span className="ml-1 text-zinc-400">
                — Tier 1 fills first; the bottom tier absorbs any remainder
              </span>
            </span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-amber-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save settings"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-400">Settings saved</span>
          )}
        </div>
      </form>
    </section>
  );
}
