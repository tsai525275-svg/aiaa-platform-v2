const pageShell = "mx-auto w-full max-w-[1440px]";

const applicationTracks = [
  {
    title: "AI Agent Product",
    description: "For commercial or public AI Agent products that want certification, registry listing, and product ranking eligibility.",
    href: "/apply/agent",
    status: "Open for Application",
    action: "Start Level 1 Product Certification",
    type: "available"
  },
  {
    title: "Agent Framework",
    description: "For frameworks, orchestration systems, tooling layers, and developer infrastructure. Framework applications still begin with Level 1 evidence before higher levels unlock.",
    href: "/apply/agent",
    status: "Open for Application",
    action: "Start Level 1 Framework Certification",
    type: "available"
  },
  {
    title: "Independent AI Agent Developer",
    description: "For individual AI Agent developers who submit working agents, workflow systems, or production implementations.",
    href: "/apply/agent",
    status: "Open for Application",
    action: "Start Level 1 Developer Certification",
    type: "available"
  },
  {
    title: "Company Certification Review",
    description: "For companies that have completed Level 1 to Level 3 and are ready to apply for Level 4 Company certification review.",
    href: "/certification/level-4",
    status: "Requires Level 3 Certification",
    action: "View Level 4 Company Requirements",
    type: "locked"
  }
];

const lockedLevels = [
  "Level 2 unlocks only after Level 1 certificate is active.",
  "Level 3 unlocks only after Level 2 certificate is active.",
  "Level 4 unlocks only after Level 3 certificate is active and company evidence exists.",
  "Level 5 unlocks only after Level 4 qualification and council review invitation."
];

const evidenceItems = [
  "Agent name and owner identity",
  "Website, GitHub, demo URL",
  "Technical README",
  "Execution logs",
  "API or tool calling proof",
  "Retry and failure recovery proof",
  "Security and permission notes",
  "Demo video or live review session"
];

export default function ApplyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden px-4 pb-28 pt-10 md:pt-12 text-white sm:px-6 lg:px-8">
      <section className={pageShell}>
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-10">
          <span className="eyebrow notranslate" translate="no">AIAA Application</span>
          <h1 className="max-w-5xl break-words text-[clamp(2.75rem,5.5vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
            Choose a track. Start at Level 1.
          </h1>
          <p className="section-copy mt-7 max-w-3xl">
            Every new applicant enters the certification ladder through Level 1. Higher levels remain locked until the previous certificate is active.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="/apply/agent" className="pill-button bg-white text-black">
              Continue to Level 1 form
            </a>
            <a href="/certification/process" className="pill-button glass-panel">
              View exam process
            </a>
          </div>
        </div>
      </section>

      <section className={`${pageShell} mt-10 grid gap-5 md:grid-cols-2`}>
        {applicationTracks.map((track) => {
          const isLocked = track.type === "locked";
          const cardClass = isLocked
            ? "glass-panel min-w-0 rounded-[1.75rem] p-6 opacity-70"
            : "glass-panel group min-w-0 rounded-[1.75rem] border border-white/15 p-6 ring-1 ring-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.07] hover:ring-white/20";

          const cardContent = (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="mb-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-white/45">
                    {isLocked ? "Locked Certification Type" : "Application Type"}
                  </span>
                  <h2 className="break-words text-2xl font-semibold tracking-[-0.04em]">{track.title}</h2>
                </div>
                <span className={isLocked ? "shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-white/50" : "shrink-0 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100"}>
                  {track.status}
                </span>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/65">{track.description}</p>
              <span className={isLocked ? "mt-7 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/55" : "mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition duration-300 group-hover:gap-3"}>
                {track.action}
                {!isLocked && <span aria-hidden="true">→</span>}
              </span>
              {isLocked && (
                <p className="mt-4 text-xs leading-5 text-white/42">
                  This track is not open to new applicants. Complete Level 1, Level 2, and Level 3 first.
                </p>
              )}
            </>
          );

          if (isLocked) {
            return (
              <div key={track.title} className={cardClass} aria-disabled="true">
                {cardContent}
              </div>
            );
          }

          return (
            <a key={track.title} href={track.href} className={cardClass} aria-label={`${track.action}: ${track.title}`}>
              {cardContent}
            </a>
          );
        })}
      </section>

      <section className={`${pageShell} mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">Eligibility gate</span>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] md:text-4xl">No direct application to higher levels.</h2>
          <div className="mt-7 space-y-3">
            {lockedLevels.map((item) => (
              <div key={item} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm text-white/66">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">Application evidence</span>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] md:text-4xl">Prepare proof before review.</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {evidenceItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/65">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
