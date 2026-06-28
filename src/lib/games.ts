import { prisma } from "./prisma";

export const gameInclude = {
  host: {
    select: { id: true, name: true, location: true },
  },
  participants: {
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
    orderBy: { joinedAt: "asc" as const },
  },
  _count: {
    select: { participants: true },
  },
};

export async function getGames(filters?: {
  sport?: string;
  location?: string;
  q?: string;
}) {
  const where: {
    sport?: string;
    location?: { contains: string };
    OR?: Array<{
      title?: { contains: string };
      description?: { contains: string };
      location?: { contains: string };
    }>;
  } = {};

  if (filters?.sport) {
    where.sport = filters.sport;
  }

  if (filters?.location) {
    where.location = { contains: filters.location };
  }

  if (filters?.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { description: { contains: filters.q } },
      { location: { contains: filters.q } },
    ];
  }

  return prisma.game.findMany({
    where,
    include: gameInclude,
    orderBy: { dateTime: "asc" },
  });
}

export async function getGameById(id: string) {
  return prisma.game.findUnique({
    where: { id },
    include: gameInclude,
  });
}

export function getOpenSpots(game: {
  maxPlayers: number;
  participants: Array<{ status: string }>;
}) {
  const joinedCount = game.participants.filter(
    (participant) => participant.status === "JOINED",
  ).length;
  return Math.max(game.maxPlayers - joinedCount, 0);
}

export function serializeGame<T extends { dateTime: Date }>(game: T) {
  return {
    ...game,
    dateTime: game.dateTime.toISOString(),
    createdAt:
      "createdAt" in game && game.createdAt instanceof Date
        ? game.createdAt.toISOString()
        : undefined,
    updatedAt:
      "updatedAt" in game && game.updatedAt instanceof Date
        ? game.updatedAt.toISOString()
        : undefined,
  };
}
