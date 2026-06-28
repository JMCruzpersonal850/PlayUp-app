import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { getOpenSpots } from "@/lib/games";
import { formatGameDate, formatRelativeDate, sportEmoji } from "@/lib/utils";

type GameCardProps = {
  game: {
    id: string;
    title: string;
    sport: string;
    location: string;
    dateTime: string;
    maxPlayers: number;
    skillLevel: string;
    host: { name: string };
    participants: Array<{ status: string }>;
  };
};

export function GameCard({ game }: GameCardProps) {
  const openSpots = getOpenSpots(game);
  const isFull = openSpots === 0;

  return (
    <Link
      href={`/games/${game.id}`}
      className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-emerald-500/10"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span>{sportEmoji(game.sport)}</span>
            <span>{game.sport}</span>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300">
            {game.title}
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isFull
              ? "bg-rose-500/15 text-rose-300"
              : "bg-emerald-500/15 text-emerald-300"
          }`}
        >
          {isFull ? "Full" : `${openSpots} spots left`}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-300">
        <p className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {formatGameDate(game.dateTime)}
          <span className="text-slate-500">· {formatRelativeDate(game.dateTime)}</span>
        </p>
        <p className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          {game.location}
        </p>
        <p className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          {game.maxPlayers - openSpots}/{game.maxPlayers} players · {game.skillLevel}
        </p>
      </div>

      <p className="mt-4 text-xs text-slate-500">Hosted by {game.host.name}</p>
    </Link>
  );
}
