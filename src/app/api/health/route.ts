import { NextResponse } from "next/server";
import { getDatabaseKind, getEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const env = getEnv();

  try {
    await prisma.user.count();
    return NextResponse.json({
      status: "ok",
      database: getDatabaseKind(env.databaseUrl),
      maps: {
        clientKey: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
        placesKey: Boolean(process.env.GOOGLE_MAPS_API_KEY),
        mapId: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID),
      },
      auth: {
        jwtConfigured: env.jwtSecret !== "playup-dev-secret-change-in-production",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 500 },
    );
  }
}
