"use client";

import { ExternalLink, MapPin, Phone, Star } from "lucide-react";
import type { PensacolaPark } from "@/lib/parks";
import type { ParkListing } from "@/components/pensacola-parks-map";
import { PrimaryButton } from "@/components/ui";

type ParkBusinessPanelProps = {
  park: PensacolaPark;
  listing: ParkListing | null;
  loading: boolean;
  error?: string;
  selected: boolean;
  hasGoogleApiKey: boolean;
  onSelect: () => void;
};

export function ParkBusinessPanel({
  park,
  listing,
  loading,
  error,
  selected,
  hasGoogleApiKey,
  onSelect,
}: ParkBusinessPanelProps) {
  const mapsUrl =
    listing?.googleMapsUri ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${park.name} Pensacola FL`)}`;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
            Park listing
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{park.name}</h3>
          <p className="mt-1 text-sm text-slate-400">Pensacola, FL public park</p>
        </div>
        {selected ? (
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
            Selected
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
        </div>
      ) : error ? (
        <p className="text-sm text-rose-400">{error}</p>
      ) : (
        <div className="space-y-4">
          {listing?.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.photoUrl}
              alt={listing.name}
              className="h-44 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 text-sm text-slate-500">
              Google listing photo unavailable
            </div>
          )}

          <div className="space-y-2 text-sm text-slate-300">
            <p className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              {listing?.formattedAddress ?? `${park.name}, Pensacola, FL`}
            </p>

            {listing?.rating ? (
              <p className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                {listing.rating.toFixed(1)}
                {listing.userRatingCount ? (
                  <span className="text-slate-500">
                    ({listing.userRatingCount.toLocaleString()} Google reviews)
                  </span>
                ) : null}
              </p>
            ) : null}

            {listing?.phoneNumber ? (
              <p className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                {listing.phoneNumber}
              </p>
            ) : null}
          </div>

          {listing?.openingHours?.length ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="mb-2 text-sm font-medium text-white">Hours</p>
              <ul className="space-y-1 text-sm text-slate-400">
                {listing.openingHours.slice(0, 3).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {!hasGoogleApiKey ? (
            <p className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Set <code className="text-amber-50">GOOGLE_MAPS_API_KEY</code> to load live
              Google Business details (ratings, hours, photos).
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <PrimaryButton type="button" onClick={onSelect}>
          {selected ? "Park selected" : "Host game here"}
        </PrimaryButton>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/5"
        >
          View on Google
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
