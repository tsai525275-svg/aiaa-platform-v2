import Link from "next/link";
import { MemberAuthPanel } from "@/components/member-auth-panel";

const COPY = {
  signup: {
    eyebrow: "Create account",
    title: "Become an AIAA member.",
    description:
      "Membership is required before you submit an application, take an exam, enter review, receive a certificate, or appear on ranking records.",
    cardTitle: "Create your member account",
    cardCopy: "Start with GitHub, Google, or email.",
    switchLabel: "Already have an account?",
    switchHref: "/login",
    switchText: "Sign in",
  },
  signin: {
    eyebrow: "Sign in",
    title: "Return to your AIAA member portal.",
    description:
      "View your profile, public level records, active review stage, certificate state, and the progress of your next level application.",
    cardTitle: "Sign in to continue",
    cardCopy: "Use the same provider you used when you joined.",
    switchLabel: "Need a member account?",
    switchHref: "/signup",
    switchText: "Create account",
  },
} as const;

const steps = [
  ["01", "Member profile", "Identity, avatar, name, and contact record."],
  ["02", "Level file", "Application, exam, review, and certificate status."],
  ["03", "Public record", "Passed levels and ranking eligibility after approval."],
];

export function MemberAuthShell({ mode }: { mode: "signup" | "signin" }) {
  const copy = COPY[mode];

  return (
    <main className="min-h-screen bg-[#f3f5f8] text-neutral-950">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        <section className="relative hidden min-h-screen overflow-hidden bg-[#f7f9fc] lg:block">
          <div className="absolute inset-0 [background-image:radial-gradient(#c6ccd6_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(245,247,250,0.88)_42%,rgba(224,230,238,0.78))]" />
          <div className="absolute left-[10%] top-[26%] h-px w-[66%] rotate-[16deg] bg-neutral-300" />
          <div className="absolute left-[18%] top-[70%] h-px w-[58%] -rotate-[20deg] bg-neutral-300" />
          <div className="absolute right-[12%] top-[18%] h-28 w-28 border border-neutral-300 bg-white/45" />
          <div className="absolute bottom-[18%] right-[22%] h-16 w-16 border border-neutral-300 bg-white/45" />
          <div className="absolute -bottom-40 -left-36 h-[30rem] w-[30rem] rounded-full border border-neutral-200" />

          <div className="relative flex min-h-screen flex-col justify-between px-14 py-12">
            <Link href="/" className="inline-flex w-fit items-center gap-4" aria-label="AIAA Home">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                <img src="/aiaa-logo-icon.png" alt="AIAA" className="h-11 w-11 object-contain" />
              </span>
              <span>
                <span className="block text-2xl font-semibold tracking-[0.14em] text-neutral-950">AIAA</span>
                <span className="block text-[0.7rem] uppercase tracking-[0.32em] text-neutral-500">Member Access</span>
              </span>
            </Link>

            <div className="max-w-[39rem] pb-8">
              <p className="inline-flex rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-neutral-600">
                AIAA identity layer
              </p>
              <h2 className="mt-7 text-[clamp(3.1rem,5.3vw,5.7rem)] font-semibold leading-[0.96] tracking-[-0.075em] text-neutral-950">
                {mode === "signup" ? "One profile for applications, exams, certificates, and ranking records." : "One member profile for every AIAA level record."}
              </h2>
              <p className="mt-7 max-w-[34rem] text-xl leading-9 text-neutral-700">
                {mode === "signup"
                  ? "AIAA keeps your identity, public level status, review stage, and certificate history under one account."
                  : "Track passed levels, active applications, exam state, review progress, and certificate history in one place."}
              </p>
            </div>

            <div className="max-w-[39rem] border-y border-neutral-300 bg-white/58 backdrop-blur-sm">
              {steps.map(([number, title, text]) => (
                <div key={number} className="grid grid-cols-[4.5rem_1fr] border-b border-neutral-200 px-6 py-5 last:border-b-0">
                  <p className="font-mono text-xl font-semibold text-neutral-950">{number}</p>
                  <div>
                    <p className="text-base font-semibold text-neutral-950">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[32rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-10">
            <Link href="/" className="inline-flex items-center gap-4" aria-label="AIAA Home">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 shadow-[0_16px_38px_rgba(15,23,42,0.12)]">
                <img src="/aiaa-logo-icon.png" alt="AIAA" className="h-11 w-11 object-contain" />
              </span>
              <span>
                <span className="block text-2xl font-semibold tracking-[0.12em] text-neutral-950">AIAA</span>
                <span className="block text-[0.72rem] uppercase tracking-[0.28em] text-neutral-500">AI Agent Identity Authority</span>
              </span>
            </Link>

            <div className="mt-9">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">{copy.eyebrow}</p>
              <h1 className="mt-5 text-[clamp(2.15rem,4.2vw,3.45rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-neutral-950">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-[28rem] text-[1.06rem] leading-8 text-neutral-700">{copy.description}</p>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-7">
              <h2 className="text-[1.85rem] font-semibold leading-tight tracking-[-0.04em] text-neutral-950">{copy.cardTitle}</h2>
              <p className="mt-2 text-base leading-7 text-neutral-600">{copy.cardCopy}</p>
            </div>

            <div className="mt-7">
              <MemberAuthPanel mode={mode} />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
              <div>
                {copy.switchLabel} {" "}
                <Link href={copy.switchHref} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">
                  {copy.switchText}
                </Link>
              </div>
              <div className="flex flex-wrap gap-5">
                <span>Terms</span>
                <span>Privacy</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
