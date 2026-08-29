export type GooglePlaceDetails = {
  placeId: string;
  name: string;
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  websiteUri?: string;
  phoneNumber?: string;
  photoUrl?: string;
  openingHours?: string[];
  businessStatus?: string;
  types?: string[];
};

type GooglePlaceSearchResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    websiteUri?: string;
    nationalPhoneNumber?: string;
    businessStatus?: string;
    types?: string[];
    photos?: Array<{ name?: string }>;
    regularOpeningHours?: { weekdayDescriptions?: string[] };
    location?: { latitude?: number; longitude?: number };
  }>;
};

const PLACE_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.businessStatus",
  "places.types",
  "places.photos",
  "places.regularOpeningHours",
  "places.location",
].join(",");

function getGoogleApiKey() {
  return process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}

function buildPhotoUrl(photoName: string, apiKey: string) {
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=600&key=${apiKey}`;
}

function mapPlace(place: NonNullable<GooglePlaceSearchResponse["places"]>[number], apiKey: string): GooglePlaceDetails {
  const photoName = place.photos?.[0]?.name;

  return {
    placeId: place.id ?? "",
    name: place.displayName?.text ?? "Unknown park",
    formattedAddress: place.formattedAddress ?? "Pensacola, FL",
    rating: place.rating,
    userRatingCount: place.userRatingCount,
    googleMapsUri: place.googleMapsUri,
    websiteUri: place.websiteUri,
    phoneNumber: place.nationalPhoneNumber,
    photoUrl: photoName ? buildPhotoUrl(photoName, apiKey) : undefined,
    openingHours: place.regularOpeningHours?.weekdayDescriptions,
    businessStatus: place.businessStatus,
    types: place.types,
  };
}

export function buildFallbackPlaceDetails(input: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}): GooglePlaceDetails {
  const query = encodeURIComponent(`${input.name} Pensacola FL`);
  return {
    placeId: input.id,
    name: input.name,
    formattedAddress: `${input.name}, Pensacola, FL`,
    googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=`,
  };
}

export async function lookupParkPlaceDetails(input: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}): Promise<GooglePlaceDetails> {
  const apiKey = getGoogleApiKey();
  if (!apiKey) {
    return buildFallbackPlaceDetails(input);
  }

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACE_FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: `${input.name} park Pensacola FL`,
      locationBias: {
        circle: {
          center: {
            latitude: input.latitude,
            longitude: input.longitude,
          },
          radius: 500,
        },
      },
      maxResultCount: 1,
    }),
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    return buildFallbackPlaceDetails(input);
  }

  const data = (await response.json()) as GooglePlaceSearchResponse;
  const place = data.places?.[0];
  if (!place) {
    return buildFallbackPlaceDetails(input);
  }

  return mapPlace(place, apiKey);
}

export async function getPlaceDetailsById(placeId: string): Promise<GooglePlaceDetails | null> {
  const apiKey = getGoogleApiKey();
  if (!apiKey || !placeId.startsWith("ChI")) {
    return null;
  }

  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACE_FIELD_MASK.replaceAll("places.", ""),
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) return null;

  const place = await response.json();
  return mapPlace(place, apiKey);
}
