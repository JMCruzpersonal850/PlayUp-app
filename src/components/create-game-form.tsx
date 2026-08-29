"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ParkPicker, type SelectedPark } from "@/components/park-picker";
import { SKILL_LEVELS, SPORTS, type SkillLevel, type Sport } from "@/lib/constants";
import type { PensacolaPark } from "@/lib/parks";
import {
  ErrorMessage,
  FieldLabel,
  PrimaryButton,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/ui";

function defaultDateTime() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  date.setHours(18, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

type CreateGameFormProps = {
  parks: PensacolaPark[];
};

export function CreateGameForm({ parks }: CreateGameFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPark, setSelectedPark] = useState<SelectedPark | null>(null);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    sport: Sport;
    dateTime: string;
    maxPlayers: number;
    skillLevel: SkillLevel;
  }>({
    title: "",
    description: "",
    sport: SPORTS[0],
    dateTime: defaultDateTime(),
    maxPlayers: 10,
    skillLevel: SKILL_LEVELS[0],
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPark) {
      setError("Select a Pensacola park from the map before publishing.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        location: selectedPark.location,
        address: selectedPark.address,
        parkId: selectedPark.parkId,
        parkName: selectedPark.parkName,
        placeId: selectedPark.placeId,
        latitude: selectedPark.latitude,
        longitude: selectedPark.longitude,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to create game");
      return;
    }

    router.push(`/games/${data.game.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Choose a Pensacola park</h2>
          <p className="mt-1 text-sm text-slate-400">
            Browse all public city parks on the map. Click a pin to open its Google
            Business listing, then select it as your game venue.
          </p>
        </div>
        <ParkPicker parks={parks} value={selectedPark} onChange={setSelectedPark} />
        {selectedPark ? (
          <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Hosting at <strong>{selectedPark.parkName}</strong> in Pensacola, FL.
          </p>
        ) : null}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <FieldLabel htmlFor="title">Game title</FieldLabel>
          <TextInput
            id="title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Sunday evening 5v5 run"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <TextArea
            id="description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Bring water, we run full court. Teams decided on arrival."
          />
        </div>

        <div>
          <FieldLabel htmlFor="sport">Sport</FieldLabel>
          <SelectInput
            id="sport"
            value={form.sport}
            onChange={(event) =>
              setForm({ ...form, sport: event.target.value as Sport })
            }
          >
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </SelectInput>
        </div>

        <div>
          <FieldLabel htmlFor="skillLevel">Skill level</FieldLabel>
          <SelectInput
            id="skillLevel"
            value={form.skillLevel}
            onChange={(event) =>
              setForm({ ...form, skillLevel: event.target.value as SkillLevel })
            }
          >
            {SKILL_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectInput>
        </div>

        <div>
          <FieldLabel htmlFor="dateTime">Date and time</FieldLabel>
          <TextInput
            id="dateTime"
            type="datetime-local"
            value={form.dateTime}
            onChange={(event) => setForm({ ...form, dateTime: event.target.value })}
            required
          />
        </div>

        <div>
          <FieldLabel htmlFor="maxPlayers">Max players</FieldLabel>
          <TextInput
            id="maxPlayers"
            type="number"
            min={2}
            max={100}
            value={form.maxPlayers}
            onChange={(event) =>
              setForm({ ...form, maxPlayers: Number(event.target.value) })
            }
            required
          />
        </div>
      </section>

      <div>
        <ErrorMessage message={error} />
        <PrimaryButton type="submit" disabled={loading || !selectedPark}>
          {loading ? "Publishing..." : "Publish game"}
        </PrimaryButton>
      </div>
    </form>
  );
}
