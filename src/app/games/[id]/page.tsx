import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { JoinGameButton } from "@/components/join-game-button";
import { PageShell } from "@/components/ui";
import { getSessionUser } from "@/lib/auth";
import { getGameById, getOpenSpots } from "@/lib/games";
import { formatGameDate, formatRelativeDate, sportEmoji } from "@/lib/utils";

type GameDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params;
  const [game, session] = await Promise.all([getGameById(id), getSessionUser()]);

  if (!game) notFound();

  const openSpots = getOpenSpots(game);
  const isHost = session?.id === game.hostId;
  const isJoined = game.participants.some(
    (participant) => participant.userId === session?.id,
  );

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
              <span>{sportEmoji(game.sport)}</span>
              {game.sport}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
              {game.skillLevel}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm ${
                openSpots === 0
                  ? "bg-rose-500/15 text-rose-300"
                  : "bg-emerald-500/15 text-emerald-300"
              }`}
            >
              {openSpots === 0 ? "Full" : `${openSpots} spots left`}
            </span>
          </div>

          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{game.title}</h1>
          {game.description ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {game.description}
            </p>
          ) : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="mb-2 inline-flex items-center gap-2 text-sm text-slate-400">
                <CalendarDays className="h-4 w-4" />
                When
              </p>
              <p className="font-medium text-white">{formatGameDate(game.dateTime)}</p>
              <p className="mt-1 text-sm text-slate-400">
                {formatRelativeDate(game.dateTime)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="mb-2 inline-flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4" />
                Where
              </p>
              <p className="font-medium text-white">{game.location}</p>
              {game.address ? (
                <p className="mt-1 text-sm text-slate-400">{game.address}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-medium text-white">Players</h2>
            <ul className="space-y-3">
              {game.participants.map((participant) => (
                <li
                  key={participant.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3"
                >
                  <span className="text-white">{participant.user.name}</span>
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    {participant.userId === game.hostId ? "Host" : participant.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-slate-400">Hosted by</p>
            <p className="mt-1 text-xl font-semibold text-white">{game.host.name}</p>
            {game.host.location ? (
              <p className="mt-2 text-sm text-slate-400">{game.host.location}</p>
            ) : null}

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="inline-flex items-center gap-2 text-sm text-slate-400">
                <Users className="h-4 w-4" />
                Roster
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {game.maxPlayers - openSpots}/{game.maxPlayers}
              </p>
            </div>

            <div className="mt-6">
              {session ? (
                <JoinGameButton
                  gameId={game.id}
                  isJoined={isJoined}
                  isHost={isHost}
                  isFull={openSpots === 0}
                />
              ) : (
                <Link
                  href={`/login?next=/games/${game.id}`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Sign in to join
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
