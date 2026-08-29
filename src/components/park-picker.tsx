"use client";

import { useState } from "react";
import type { PensacolaPark } from "@/lib/parks";
import { ParkBusinessPanel } from "@/components/park-business-panel";
import { PensacolaParksMap, type ParkListing } from "@/components/pensacola-parks-map";

export type SelectedPark = {
  parkId: string;
  parkName: string;
  location: string;
  address: string;
  placeId?: string;
  latitude: number;
  longitude: number;
};

type ParkPickerProps = {
  parks: PensacolaPark[];
  value?: SelectedPark | null;
  onChange: (park: SelectedPark | null) => void;
};

export function ParkPicker({ parks, value, onChange }: ParkPickerProps) {
  const [activeParkId, setActiveParkId] = useState<string | null>(value?.parkId ?? null);
  const [listing, setListing] = useState<ParkListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGoogleApiKey, setHasGoogleApiKey] = useState(false);

  const activePark = parks.find((park) => park.id === activeParkId) ?? null;

  async function loadListing(park: PensacolaPark) {
    setActiveParkId(park.id);
    setLoading(true);
    setError("");
    setListing(null);

    try {
      const response = await fetch(`/api/parks/${park.id}/listing`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load park listing");
      }

      setListing(data.listing);
      setHasGoogleApiKey(Boolean(data.hasGoogleApiKey));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load park listing",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSelectPark() {
    if (!activePark) return;

    onChange({
      parkId: activePark.id,
      parkName: activePark.name,
      location: "Pensacola, FL",
      address: listing?.formattedAddress ?? activePark.name,
      placeId: listing?.placeId,
      latitude: activePark.latitude,
      longitude: activePark.longitude,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <PensacolaParksMap
        parks={parks}
        selectedParkId={value?.parkId}
        activeParkId={activePark?.id}
        onParkSelect={loadListing}
      />

      {activePark ? (
        <ParkBusinessPanel
          park={activePark}
          listing={listing}
          loading={loading}
          error={error}
          selected={value?.parkId === activePark.id}
          hasGoogleApiKey={hasGoogleApiKey}
          onSelect={handleSelectPark}
        />
      ) : (
        <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 text-center text-sm text-slate-400">
          Click a park pin to view its Google Business listing and choose a venue for
          your game.
        </div>
      )}
    </div>
  );
}
