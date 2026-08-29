import parks from "@/data/pensacola-parks.json";

export type PensacolaPark = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
};

export const PENSACOLA_CENTER = {
  lat: 30.4383,
  lng: -87.2169,
};

export const PENSACOLA_PARKS = parks as PensacolaPark[];

export function getParkById(id: string) {
  return PENSACOLA_PARKS.find((park) => park.id === id);
}

export function searchParks(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return PENSACOLA_PARKS;

  return PENSACOLA_PARKS.filter((park) =>
    park.name.toLowerCase().includes(normalized),
  );
}
