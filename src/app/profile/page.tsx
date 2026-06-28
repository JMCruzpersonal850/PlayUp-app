import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { ProfileForm } from "@/components/profile-form";
import { PageShell, SectionHeading } from "@/components/ui";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();
  if (!user) redirect("/login?next=/profile");

  return (
    <PageShell className="max-w-2xl">
      <SectionHeading
        eyebrow="Profile"
        title="Your player profile"
        description="Update how other players see you when browsing and joining games."
      />
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <ProfileForm initial={user} />
      </div>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </PageShell>
  );
}
