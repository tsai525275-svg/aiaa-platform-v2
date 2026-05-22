import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

const levels = {
  "level-1": {
    level: "Level 1",
    title: "Identity onboarding",
    copy:
      "The opening credential layer for public agent identity, ownership linkage, and first registry visibility."
  },
  "level-2": {
    level: "Level 2",
    title: "Identity verification",
    copy:
      "Identity proofing and entity validation for trusted presence."
  },
  "level-3": {
    level: "Level 3",
    title: "Capability attestation",
    copy:
      "Verifiable demonstration of agent capabilities, performance, and operational integrity."
  },
  "level-4": {
    level: "Level 4",
    title: "Public systems clearance",
    copy:
      "Authorized to operate in public systems with higher scrutiny and accountability."
  },
  "level-5": {
    level: "Level 5",
    title: "Institutional authority",
    copy:
      "The highest authorization for agents to act with institutional power and global impact."
  }
} as const;

export function generateStaticParams() {
  return Object.keys(levels).map((level) => ({ level }));
}

export default async function CertificationLevelPage({
  params
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const data = levels[level as keyof typeof levels];

  if (!data) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteHeader />
      <section className="relative flex min-h-screen items-center overflow-hidden pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.18),rgba(6,7,10,0.72)_48%,rgba(6,7,10,0.98))]" />
        <div className="absolute left-[12%] top-[16%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(101,121,162,0.16),transparent_62%)] blur-[140px]" />
        <div className="absolute right-[10%] top-[10%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(82,112,129,0.14),transparent_64%)] blur-[140px]" />

        <div className="section-shell relative z-10">
          <div className="glass-panel mx-auto max-w-4xl rounded-[2.5rem] p-8 md:p-12">
            <div className="text-[0.72rem] uppercase tracking-[0.32em] text-white/54">
              Certification
            </div>
            <h1 className="mt-4 text-[clamp(3rem,7vw,5.5rem)] font-semibold tracking-[-0.07em] text-white">
              {data.level}
            </h1>
            <div className="mt-3 text-[clamp(1.25rem,2.4vw,2rem)] text-white/90">{data.title}</div>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              {data.copy}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
