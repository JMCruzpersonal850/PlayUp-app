"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "@/components/ui";

type JoinGameButtonProps = {
  gameId: string;
  isJoined: boolean;
  isHost: boolean;
  isFull: boolean;
};

export function JoinGameButton({
  gameId,
  isJoined,
  isHost,
  isFull,
}: JoinGameButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/games/${gameId}/join`, {
      method: isJoined ? "DELETE" : "POST",
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to update RSVP");
      return;
    }

    router.refresh();
  }

  if (isHost) {
    return (
      <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        You are hosting this game.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {isJoined ? (
        <SecondaryButton onClick={handleClick} disabled={loading} className="w-full">
          {loading ? "Updating..." : "Leave game"}
        </SecondaryButton>
      ) : (
        <PrimaryButton
          onClick={handleClick}
          disabled={loading || isFull}
          className="w-full"
        >
          {loading ? "Joining..." : isFull ? "Game full" : "Join game"}
        </PrimaryButton>
      )}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
