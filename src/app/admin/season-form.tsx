"use client";

import { useState, useTransition } from "react";
import { applySeasonUpdate, undoSeasonUpdate } from "./actions";

export default function SeasonForm({ seasonBackupAvailable }: { seasonBackupAvailable: boolean }) {
  const [confirmed, setConfirmed] = useState(false);
  const [isApplying, startApply] = useTransition();
  const [isUndoing, startUndo] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleApply() {
    startApply(async () => {
      await applySeasonUpdate();
      setConfirmed(false);
      setMessage("Season updated — promotions and demotions calculated.");
      setTimeout(() => setMessage(null), 2500);
    });
  }

  function handleUndo() {
    startUndo(async () => {
      await undoSeasonUpdate();
      setMessage("Last season update undone.");
      setTimeout(() => setMessage(null), 2500);
    });
  }

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-zinc-50">Season</h2>
      <div className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 accent-amber-500"
          />
          <span>
            <span className="font-medium text-zinc-100">Confirm this is a season update</span>
            <span className="ml-1 text-zinc-400">
              — compares every player&apos;s current tier against their tier from the last
              season and marks movers as promoted or demoted.
            </span>
          </span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleApply}
            disabled={!confirmed || isApplying}
            className="rounded-md bg-amber-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
          >
            {isApplying ? "Applying..." : "Apply season update"}
          </button>
          <button
            type="button"
            onClick={handleUndo}
            disabled={!seasonBackupAvailable || isUndoing}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 disabled:opacity-30"
          >
            {isUndoing ? "Undoing..." : "Undo last season update"}
          </button>
          {message && <span className="text-sm font-medium text-green-400">{message}</span>}
        </div>
      </div>
    </section>
  );
}
