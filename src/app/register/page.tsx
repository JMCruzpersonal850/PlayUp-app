import { RegisterForm } from "@/components/register-form";
import { PageShell, SectionHeading } from "@/components/ui";

export default function RegisterPage() {
  return (
    <PageShell className="max-w-lg">
      <SectionHeading
        eyebrow="Join PlayUp"
        title="Create your account"
        description="Start hosting games or joining local pickup sessions in minutes."
      />
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <RegisterForm />
      </div>
    </PageShell>
  );
}
