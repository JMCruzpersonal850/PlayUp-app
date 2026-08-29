import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateGameForm } from "@/components/create-game-form";
import { PageShell, SectionHeading } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { PENSACOLA_PARKS } from "@/lib/parks";

export default async function NewGamePage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/games/new");

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Host in Pensacola"
        title="Create a game"
        description="Pick one of Pensacola's public parks on the map, review its Google listing, and publish your pickup game."
      />
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <CreateGameForm parks={PENSACOLA_PARKS} />
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Need inspiration?{" "}
        <Link href="/games" className="text-emerald-400 hover:text-emerald-300">
          Browse what others are hosting
        </Link>
        .
      </p>
    </PageShell>
  );
}
