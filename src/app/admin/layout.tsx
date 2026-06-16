import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-50">Roster admin</h1>
          <p className="text-sm text-zinc-400">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-amber-400 hover:text-amber-300">
            View leaderboard
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
