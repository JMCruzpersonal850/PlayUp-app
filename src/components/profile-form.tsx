"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ErrorMessage,
  FieldLabel,
  PrimaryButton,
  TextArea,
  TextInput,
} from "@/components/ui";

type ProfileFormProps = {
  initial: {
    name: string;
    bio?: string | null;
    location?: string | null;
  };
};

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name,
    bio: initial.bio ?? "",
    location: initial.location ?? "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to update profile");
      return;
    }

    setSuccess("Profile updated.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <TextInput
          id="name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
      </div>
      <div>
        <FieldLabel htmlFor="location">Home area</FieldLabel>
        <TextInput
          id="location"
          value={form.location}
          onChange={(event) => setForm({ ...form, location: event.target.value })}
          placeholder="Queens, NY"
        />
      </div>
      <div>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <TextArea
          id="bio"
          value={form.bio}
          onChange={(event) => setForm({ ...form, bio: event.target.value })}
          placeholder="Weekend soccer player, always down for a run."
        />
      </div>
      <ErrorMessage message={error} />
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}
      <PrimaryButton type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save profile"}
      </PrimaryButton>
    </form>
  );
}
