import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { GameCard } from "@/components/game-card";
import { PageShell } from "@/components/ui";
import { getGames, serializeGame } from "@/lib/games";

export default async function HomePage() {
  const games = await getGames();
  const featured = games.slice(0, 3).map((game) => serializeGame(game));

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_35%)]" />
        <PageShell className="relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-300">
              Local sports game hosting
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Find your next game. Host the one your neighborhood needs.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              PlayUp helps players discover pickup games, fill open spots, and organize
              local sports without group chats and scattered flyers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/games"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Browse games
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/games/new"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/5"
              >
                Host a game
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Play nearby",
                copy: "Filter by city, neighborhood, or sport.",
              },
              {
                icon: Users,
                title: "Fill your roster",
                copy: "Set player limits and let people join instantly.",
              },
              {
                icon: CalendarDays,
                title: "Keep it organized",
                copy: "See upcoming games on your personal dashboard.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
              >
                <item.icon className="mb-3 h-5 w-5 text-emerald-400" />
                <h2 className="font-medium text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{item.copy}</p>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      <PageShell className="py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
              Upcoming
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Games near you</h2>
          </div>
          <Link href="/games" className="text-sm text-emerald-400 hover:text-emerald-300">
            View all
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center text-slate-400">
            No games yet. Be the first to host one.
          </div>
        )}
      </PageShell>
    </>
  );
}
