"use client";

import { useState, useTransition } from "react";
import type { Settings } from "@/lib/types";
import { updateSettings } from "./actions";

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [tierSizes, setTierSizes] = useState<number[]>(
    settings.tier_sizes.length > 0 ? settings.tier_sizes : [6],
  );

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  function updateSize(index: number, value: number) {
    setTierSizes((sizes) => sizes.map((size, i) => (i === index ? value : size)));
  }

  function addTier() {
    setTierSizes((sizes) => [...sizes, 6]);
  }

  function removeTier(index: number) {
    setTierSizes((sizes) => sizes.filter((_, i) => i !== index));
  }

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-zinc-50">Tier settings</h2>
      <form
        action={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
      >
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-300">Players per tier</span>

          {tierSizes.map((size, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-sm text-zinc-500">Tier {index + 1}</span>
              <input
                name="tier_size"
                type="number"
                min={1}
                max={100}
                value={size}
                onChange={(e) => updateSize(index, parseInt(e.target.value, 10) || 1)}
                required
                className="w-24 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-zinc-50 outline-none focus:border-amber-500"
              />
              {tierSizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTier(index)}
                  className="text-sm text-zinc-500 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-sm text-zinc-500">Tier {tierSizes.length + 1}</span>
            <span className="text-sm text-zinc-500">everyone else</span>
          </div>

          <button
            type="button"
            onClick={addTier}
            className="self-start text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            + Add tier
          </button>
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
