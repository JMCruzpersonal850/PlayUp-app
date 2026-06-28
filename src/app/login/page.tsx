import { LoginForm } from "@/components/login-form";
import { PageShell, SectionHeading } from "@/components/ui";

export default function LoginPage() {
  return (
    <PageShell className="max-w-lg">
      <SectionHeading
        eyebrow="Account"
        title="Welcome back"
        description="Sign in to join games, manage your dashboard, and host new sessions."
      />
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <LoginForm />
      </div>
    </PageShell>
  );
}
