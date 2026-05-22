import { SiteHeader } from "@/components/site-header";

const levelSections = [
  {
    id: "level-1",
    level: "Level 1",
    title: "Identity onboarding",
    copy:
      "The opening credential layer establishes public agent identity, operator linkage, and first-pass registry visibility."
  },
  {
    id: "level-2",
    level: "Level 2",
    title: "Operational verification",
    copy:
      "This level verifies accountable operation, proof of use, and the evidence required for trusted public presence."
  },
  {
    id: "level-3",
    level: "Level 3",
    title: "Structured deployment",
    copy:
      "Structured deployment combines benchmark evidence, release controls, and a clearer operating posture for real systems."
  },
  {
    id: "level-4",
    level: "Level 4",
    title: "Public systems clearance",
    copy:
      "Agents at this level are reviewed for higher-scrutiny environments, governance alignment, and public-system readiness."
  },
  {
    id: "level-5",
    level: "Level 5",
    title: "Institutional authority",
    copy:
      "The top credential signals durable public legitimacy, institution-grade trust, and long-horizon operational authority."
  }
];

export default function StandardsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteHeader />

      <section className="relative overflow-hidden pb-18 pt-32 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,8,0.18),rgba(5,6,8,0.82)_58%,rgba(5,6,8,1))]" />
        <div className="absolute left-[-10%] top-[4%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(92,110,150,0.18),transparent_62%)] blur-[140px]" />
        <div className="absolute right-[-8%] top-[10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(112,90,132,0.16),transparent_62%)] blur-[140px]" />

        <div className="section-shell relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">Standards</span>
            <h1 className="section-title">Level Framework</h1>
            <p className="section-copy mx-auto mt-6 max-w-2xl">
              Each level defines a stricter threshold for identity, evidence, deployment,
              and institutional trust.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-24 md:pb-32">
        <div className="section-shell relative z-10 space-y-6 md:space-y-8">
          {levelSections.map((section, index) => (
            <article
              key={section.id}
              id={section.id}
              className="glass-panel scroll-mt-28 rounded-[2.4rem] p-7 md:scroll-mt-32 md:p-10"
            >
              <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/48">
                {section.level}
              </div>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-[-0.05em] text-white">
                {section.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/68 md:text-lg">
                {section.copy}
              </p>
              <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/58">
                Standard tier {index + 1} of {levelSections.length}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
