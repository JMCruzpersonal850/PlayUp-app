"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <PrimaryButton onClick={handleLogout} className="bg-white/10 text-white hover:bg-white/15">
      Log out
    </PrimaryButton>
  );
}
