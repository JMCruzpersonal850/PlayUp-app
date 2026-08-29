"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ErrorMessage,
  FieldLabel,
  PrimaryButton,
  TextInput,
} from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      let data: { error?: string } = {};
      try {
        data = await response.json();
      } catch {
        throw new Error("Unexpected server response. Please try again.");
      }

      if (!response.ok) {
        setError(data.error ?? "Unable to log in");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
      window.location.assign("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to log in. Check your connection and try again.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <TextInput
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />
      </div>
      <div>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <ErrorMessage message={error} />
      <PrimaryButton type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in..." : "Sign in"}
      </PrimaryButton>
      <p className="text-center text-sm text-slate-400">
        New to PlayUp?{" "}
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300">
          Create an account
        </Link>
      </p>
    </form>
  );
}
