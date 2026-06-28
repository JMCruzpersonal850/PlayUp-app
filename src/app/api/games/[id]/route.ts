import { NextResponse } from "next/server";
import { getGameById, serializeGame } from "@/lib/games";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const game = await getGameById(id);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ game: serializeGame(game) });
}
