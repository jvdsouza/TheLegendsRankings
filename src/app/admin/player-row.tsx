"use client";

import { useState, useTransition } from "react";
import type { Player } from "@/lib/types";
import { updatePlayer, deletePlayer, movePlayer } from "./actions";

export default function PlayerRow({
  player,
  isFirst,
  isLast,
}: {
  player: Player;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-3 sm:flex-row sm:items-center">
        <form
          action={async (formData) => {
            await updatePlayer(player.id, formData);
            setIsEditing(false);
          }}
          className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input
            name="gamertag"
            defaultValue={player.gamertag}
            required
            placeholder="Gamertag"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-zinc-50 outline-none focus:border-amber-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:border-zinc-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <span className="flex-1 font-medium text-zinc-50">{player.gamertag}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => startTransition(() => movePlayer(player.id, "up"))}
          disabled={isFirst || isPending}
          aria-label="Move up"
          className="rounded-md border border-zinc-700 px-2 py-1 text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => startTransition(() => movePlayer(player.id, "down"))}
          disabled={isLast || isPending}
          aria-label="Move down"
          className="rounded-md border border-zinc-700 px-2 py-1 text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-md border border-zinc-700 px-3 py-1 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => startTransition(() => deletePlayer(player.id))}
          disabled={isPending}
          className="rounded-md border border-red-900 px-3 py-1 text-sm font-medium text-red-400 hover:border-red-700 hover:text-red-300 disabled:opacity-30"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
