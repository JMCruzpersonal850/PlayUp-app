import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getGames, serializeGame } from "@/lib/games";
import { gameFiltersSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = gameFiltersSchema.safeParse({
    sport: searchParams.get("sport") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }

  const games = await getGames(parsed.data);
  return NextResponse.json({
    games: games.map((game) => serializeGame(game)),
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { createGameSchema } = await import("@/lib/validations");
    const parsed = createGameSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const dateTime = new Date(parsed.data.dateTime);
    if (Number.isNaN(dateTime.getTime()) || dateTime <= new Date()) {
      return NextResponse.json(
        { error: "Game must be scheduled in the future" },
        { status: 400 },
      );
    }

    const game = await import("@/lib/prisma").then(({ prisma }) =>
      prisma.game.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          sport: parsed.data.sport,
          location: parsed.data.location,
          address: parsed.data.address,
          dateTime,
          maxPlayers: parsed.data.maxPlayers,
          skillLevel: parsed.data.skillLevel,
          hostId: session.id,
          participants: {
            create: {
              userId: session.id,
              status: "JOINED",
            },
          },
        },
        include: {
          host: { select: { id: true, name: true, location: true } },
          participants: {
            include: { user: { select: { id: true, name: true } } },
          },
          _count: { select: { participants: true } },
        },
      }),
    );

    return NextResponse.json({ game: serializeGame(game) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create game" }, { status: 500 });
  }
}
