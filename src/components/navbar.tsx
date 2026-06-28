import Link from "next/link";
import { CalendarDays, MapPin, Plus, Search, Trophy, Users } from "lucide-react";
import { getSessionUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg shadow-lg shadow-emerald-500/30">
            <Trophy className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">PlayUp</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/games" className="transition hover:text-white">
            Find Games
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>
              <Link href="/games/new" className="transition hover:text-white">
                Host a Game
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/games/new"
                className="hidden items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 sm:inline-flex"
              >
                <Plus className="h-4 w-4" />
                Host
              </Link>
              <Link
                href="/profile"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/5"
              >
                {user.name.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>PlayUp — find and host local pickup games.</p>
        <div className="flex items-center gap-4">
          <Link href="/games" className="inline-flex items-center gap-1 hover:text-white">
            <Search className="h-4 w-4" />
            Browse
          </Link>
          <Link href="/games/new" className="inline-flex items-center gap-1 hover:text-white">
            <Plus className="h-4 w-4" />
            Host
          </Link>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Your city
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            This week
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" />
            Community
          </span>
        </div>
      </div>
    </footer>
  );
}
