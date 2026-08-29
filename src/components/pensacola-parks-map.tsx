"use client";

import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PensacolaPark } from "@/lib/parks";
import { PENSACOLA_CENTER } from "@/lib/parks";
import { FieldLabel, TextInput } from "@/components/ui";

export type ParkListing = {
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

type PensacolaParksMapProps = {
  parks: PensacolaPark[];
  selectedParkId?: string;
  activeParkId?: string;
  onParkSelect: (park: PensacolaPark) => void;
  onSearchChange?: (query: string) => void;
};

function MapFocus({ park }: { park?: PensacolaPark }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !park) return;
    map.panTo({ lat: park.latitude, lng: park.longitude });
    map.setZoom(15);
  }, [map, park]);

  return null;
}

function ParksMapCanvas({
  parks,
  selectedParkId,
  activeParkId,
  onParkSelect,
}: Omit<PensacolaParksMapProps, "onSearchChange">) {
  const focusPark = parks.find((park) => park.id === (activeParkId ?? selectedParkId));

  return (
    <>
      <MapFocus park={focusPark} />
      <Map
        defaultCenter={PENSACOLA_CENTER}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI
        mapId="playup-pensacola-parks"
        className="h-full w-full rounded-[inherit]"
        style={{ width: "100%", height: "100%" }}
      >
        {parks.map((park) => {
          const isSelected = park.id === selectedParkId;
          const isActive = park.id === activeParkId;

          return (
            <AdvancedMarker
              key={park.id}
              position={{ lat: park.latitude, lng: park.longitude }}
              onClick={() => onParkSelect(park)}
            >
              <Pin
                background={isSelected ? "#10b981" : isActive ? "#34d399" : "#0f766e"}
                borderColor={isActive ? "#ecfdf5" : "#ffffff"}
                glyphColor="#ffffff"
                scale={isActive ? 1.2 : isSelected ? 1.05 : 1}
              />
            </AdvancedMarker>
          );
        })}
      </Map>
    </>
  );
}

export function PensacolaParksMap({
  parks,
  selectedParkId,
  activeParkId,
  onParkSelect,
  onSearchChange,
}: PensacolaParksMapProps) {
  const [query, setQuery] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const filteredParks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return parks;
    return parks.filter((park) => park.name.toLowerCase().includes(normalized));
  }, [parks, query]);

  function handleSearch(value: string) {
    setQuery(value);
    onSearchChange?.(value);
  }

  if (!apiKey) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Add <code className="text-amber-50">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to
          show the interactive Google map and live Google Business listings.
        </div>
        <ParkListFallback
          parks={filteredParks}
          selectedParkId={selectedParkId}
          activeParkId={activeParkId}
          query={query}
          onSearchChange={handleSearch}
          onParkSelect={onParkSelect}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="park-search">Search Pensacola parks</FieldLabel>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <TextInput
            id="park-search"
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Bayview Park, Seville Square..."
            className="pl-11"
          />
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {filteredParks.length} public parks in Pensacola, FL
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40">
        <div className="h-[420px] w-full">
          <APIProvider apiKey={apiKey}>
            <ParksMapCanvas
              parks={filteredParks}
              selectedParkId={selectedParkId}
              activeParkId={activeParkId}
              onParkSelect={onParkSelect}
            />
          </APIProvider>
        </div>
      </div>

      <ParkListFallback
        parks={filteredParks.slice(0, 8)}
        selectedParkId={selectedParkId}
        activeParkId={activeParkId}
        query={query}
        onSearchChange={handleSearch}
        onParkSelect={onParkSelect}
        compact
      />
    </div>
  );
}

function ParkListFallback({
  parks,
  selectedParkId,
  activeParkId,
  query,
  onSearchChange,
  onParkSelect,
  compact = false,
}: {
  parks: PensacolaPark[];
  selectedParkId?: string;
  activeParkId?: string;
  query: string;
  onSearchChange: (value: string) => void;
  onParkSelect: (park: PensacolaPark) => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      {!compact ? (
        <div>
          <FieldLabel htmlFor="park-search-fallback">Search Pensacola parks</FieldLabel>
          <TextInput
            id="park-search-fallback"
            value={query}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by park name"
          />
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2">
        {parks.map((park) => {
          const isSelected = park.id === selectedParkId;
          const isActive = park.id === activeParkId;

          return (
            <button
              key={park.id}
              type="button"
              onClick={() => onParkSelect(park)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : isActive
                    ? "border-emerald-300/30 bg-white/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <p className="inline-flex items-center gap-2 font-medium text-white">
                <MapPin className="h-4 w-4 text-emerald-400" />
                {park.name}
              </p>
              <p className="mt-1 text-xs text-slate-400">Pensacola, FL</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
