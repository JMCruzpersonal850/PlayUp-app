"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { SPORTS } from "@/lib/constants";
import { FieldLabel, PrimaryButton, SelectInput, TextInput } from "@/components/ui";

export function GameFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sport, setSport] = useState(searchParams.get("sport") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);
    if (location) params.set("location", location);
    if (q) params.set("q", q);
    router.push(`/games?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-4"
    >
      <div>
        <FieldLabel htmlFor="q">Search</FieldLabel>
        <TextInput
          id="q"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Park run, 5v5..."
        />
      </div>
      <div>
        <FieldLabel htmlFor="sport">Sport</FieldLabel>
        <SelectInput
          id="sport"
          value={sport}
          onChange={(event) => setSport(event.target.value)}
        >
          <option value="">All sports</option>
          {SPORTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectInput>
      </div>
      <div>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <TextInput
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Brooklyn"
        />
      </div>
      <div className="flex items-end">
        <PrimaryButton type="submit" className="w-full">
          Filter games
        </PrimaryButton>
      </div>
    </form>
  );
}
