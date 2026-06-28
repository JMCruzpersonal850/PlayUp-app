import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getGameById, getOpenSpots, serializeGame } from "@/lib/games";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await context.params;
  const game = await getGameById(id);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.hostId === session.id) {
    return NextResponse.json({ error: "You are already hosting this game" }, { status: 400 });
  }

  const existing = game.participants.find(
    (participant) => participant.userId === session.id,
  );

  if (existing) {
    return NextResponse.json({ error: "You already joined this game" }, { status: 400 });
  }

  const openSpots = getOpenSpots(game);
  if (openSpots === 0) {
    return NextResponse.json({ error: "This game is full" }, { status: 400 });
  }

  await prisma.gameParticipant.create({
    data: {
      gameId: id,
      userId: session.id,
      status: "JOINED",
    },
  });

  const updated = await getGameById(id);
  return NextResponse.json({ game: updated ? serializeGame(updated) : null });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await context.params;
  const game = await getGameById(id);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.hostId === session.id) {
    return NextResponse.json(
      { error: "Hosts cannot leave their own game. Delete it instead." },
      { status: 400 },
    );
  }

  const participant = game.participants.find(
    (entry) => entry.userId === session.id,
  );

  if (!participant) {
    return NextResponse.json({ error: "You are not in this game" }, { status: 400 });
  }

  await prisma.gameParticipant.delete({ where: { id: participant.id } });

  const updated = await getGameById(id);
  return NextResponse.json({ game: updated ? serializeGame(updated) : null });
}
