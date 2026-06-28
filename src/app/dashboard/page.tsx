import Link from "next/link";
import { redirect } from "next/navigation";
import { GameCard } from "@/components/game-card";
import { EmptyState, PageShell, SectionHeading } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { gameInclude, serializeGame } from "@/lib/games";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/dashboard");

  const [hostedGames, joinedGames] = await Promise.all([
    prisma.game.findMany({
      where: { hostId: user.id },
      include: gameInclude,
      orderBy: { dateTime: "asc" },
    }),
    prisma.game.findMany({
      where: {
        participants: {
          some: { userId: user.id },
        },
        hostId: { not: user.id },
      },
      include: gameInclude,
      orderBy: { dateTime: "asc" },
    }),
  ]);

  const hosting = hostedGames.map((game) => serializeGame(game));
  const playing = joinedGames.map((game) => serializeGame(game));

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Dashboard"
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Track the games you host and the ones you have joined."
      />

      <div className="grid gap-10">
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">Hosting</h2>
            <Link
              href="/games/new"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              Host another game
            </Link>
          </div>
          {hosting.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {hosting.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="You have not hosted any games yet"
              description="Create your first pickup game and start filling the roster."
              action={
                <Link
                  href="/games/new"
                  className="inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  Host a game
                </Link>
              }
            />
          )}
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-semibold text-white">Joined</h2>
          {playing.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {playing.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No joined games yet"
              description="Browse upcoming games and join one that fits your schedule."
              action={
                <Link
                  href="/games"
                  className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-white"
                >
                  Browse games
                </Link>
              }
            />
          )}
        </section>
      </div>
    </PageShell>
  );
}
