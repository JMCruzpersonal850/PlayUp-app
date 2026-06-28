import { Suspense } from "react";
import { GameCard } from "@/components/game-card";
import { GameFilters } from "@/components/game-filters";
import { EmptyState, PageShell, SectionHeading } from "@/components/ui";
import { getGames, serializeGame } from "@/lib/games";

type GamesPageProps = {
  searchParams: Promise<{
    sport?: string;
    location?: string;
    q?: string;
  }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const filters = await searchParams;
  const games = await getGames(filters);
  const serialized = games.map((game) => serializeGame(game));

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Discover"
        title="Find a game"
        description="Browse upcoming pickup games and filter by sport, location, or keyword."
      />

      <Suspense fallback={<div className="h-32 rounded-3xl bg-white/5" />}>
        <GameFilters />
      </Suspense>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {serialized.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {serialized.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No games match your filters"
            description="Try another sport or location, or host the first game in your area."
          />
        </div>
      ) : null}
    </PageShell>
  );
}
