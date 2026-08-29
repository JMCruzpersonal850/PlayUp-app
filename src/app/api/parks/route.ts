import { NextResponse } from "next/server";
import { PENSACOLA_PARKS, searchParks } from "@/lib/parks";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const parks = q ? searchParks(q) : PENSACOLA_PARKS;

  return NextResponse.json({
    count: parks.length,
    parks,
    center: { lat: 30.4383, lng: -87.2169 },
    city: "Pensacola, FL",
  });
}
