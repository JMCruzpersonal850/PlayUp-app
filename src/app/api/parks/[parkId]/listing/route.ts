import { NextResponse } from "next/server";
import { getPlaceDetailsById, lookupParkPlaceDetails } from "@/lib/google-places";
import { getParkById } from "@/lib/parks";

type RouteContext = {
  params: Promise<{ parkId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { parkId } = await context.params;
  const park = getParkById(parkId);

  if (!park) {
    return NextResponse.json({ error: "Park not found" }, { status: 404 });
  }

  const details = await lookupParkPlaceDetails(park);

  return NextResponse.json({
    park,
    listing: details,
    hasGoogleApiKey: Boolean(
      process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    ),
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { parkId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const park = getParkById(parkId);

  if (!park) {
    return NextResponse.json({ error: "Park not found" }, { status: 404 });
  }

  if (typeof body.placeId === "string" && body.placeId.startsWith("ChI")) {
    const listing = await getPlaceDetailsById(body.placeId);
    if (listing) {
      return NextResponse.json({ park, listing });
    }
  }

  const listing = await lookupParkPlaceDetails(park);
  return NextResponse.json({ park, listing });
}
