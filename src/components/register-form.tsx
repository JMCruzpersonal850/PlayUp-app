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

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || !password) {
      setError("Fill in all fields to create your account.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ name, email, password }),
      });

      let data: { error?: string } = {};
      try {
        data = await response.json();
      } catch {
        throw new Error("Unexpected server response. Please try again.");
      }

      if (!response.ok) {
        setError(data.error ?? "Unable to create account");
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
          : "Unable to create account. Check your connection and try again.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <TextInput
          id="name"
          name="name"
          autoComplete="name"
          required
        />
      </div>
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
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      <ErrorMessage message={error} />
      <PrimaryButton type="submit" disabled={loading} className="w-full">
        {loading ? "Creating account..." : "Create account"}
      </PrimaryButton>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
          Sign in
        </Link>
      </p>
    </form>
  );
}
