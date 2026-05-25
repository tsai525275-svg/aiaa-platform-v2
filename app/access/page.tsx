const pageShell = "mx-auto w-full max-w-[1440px]";

const levels = [
  {
    level: "Level 1",
    label: "L1 Operator",
    title: "AI Agent Operator",
    color: "Electric Blue",
    status: "Start here",
    rule: "Open for Level 1 application. New applicants must start here.",
    href: "/apply",
    requirement: "Build a working single agent workflow with tool calling, API integration, retry logic, execution logs, and a complete README."
  },
  {
    level: "Level 2",
    label: "L2 Engineer",
    title: "AI Agent Engineer",
    color: "Cyber Purple",
    status: "Locked",
    rule: "Level 2 requires active Level 1 certification.",
    href: "/certification/level-2",
    requirement: "Production workflow with three or more tools, queue or long task design, state persistence, monitoring, and human override."
  },
  {
    level: "Level 3",
    label: "L3 Systems Architect",
    title: "AI Agent Systems Architect",
    color: "Titan Gold",
    status: "Locked",
    rule: "Level 3 requires active Level 2 certification.",
    href: "/certification/level-3",
    requirement: "Production multi agent system with shared memory, monitoring dashboard, cost tracking, security layer, benchmark report, and API documentation."
  },
  {
    level: "Level 4",
    label: "L4 Certified Company",
    title: "Certified AI Agent Company",
    color: "Obsidian Black Gold",
    status: "Locked",
    rule: "Level 4 requires active Level 3 certification.",
    href: "/certification/level-4",
    requirement: "Company level review with real product, real team, real customers, revenue proof, SLA, security review, uptime report, and benchmark evidence."
  },
  {
    level: "Level 5",
    label: "L5 AIAA Fellow",
    title: "AIAA Association Fellow",
    color: "Platinum White",
    status: "Locked",
    rule: "Level 5 requires active Level 4 certification.",
    href: "/certification/level-5",
    requirement: "Council review for global influence, original technical contribution, public trust, ecosystem contribution, and standards leadership."
  }
];

const processSteps = [
  {
    title: "Application",
    text: "Applicants submit identity, product, technical, security, and documentation materials. Incomplete applications stay pending."
  },
  {
    title: "Document Screening",
    text: "AIAA checks whether the submission matches the selected level, verifies evidence, and blocks level skipping."
  },
  {
    title: "Exam Assignment",
    text: "Applicants receive a level specific practical assessment. The exam must prove real execution, not presentation material."
  },
  {
    title: "Technical Review",
    text: "Reviewers inspect workflow, logs, API behavior, reliability, security controls, benchmark evidence, and failure handling."
  },
  {
    title: "Council Decision",
    text: "The review board approves, rejects, or requests more evidence. Higher levels require stricter evidence and lower pass rates."
  },
  {
    title: "Certificate Issuance",
    text: "Approved applicants receive an AIAA Certificate ID, registry profile, verification URL, public badge, and ranking eligibility."
  }
];

const scores = [
  "Identity Score",
  "Capability Score",
  "Safety Score",
  "Reliability Score",
  "Documentation Score",
  "Public Trust Score"
];

const certificateRules = [
  "No level skipping. Level 1 is mandatory for every new applicant.",
  "A prompt, UI screen, slide deck, or local demo alone cannot pass certification.",
  "Every submitted agent must include execution proof, logs, retry behavior, and failure handling.",
  "Higher level applications unlock only after the previous certificate becomes active.",
  "Public Registry listing starts after certificate issuance, not after submission.",
  "AI Agent Product Ranking includes certified products only. It is not a popularity ranking."
];

export default function AccessPage() {
  return (
    <main className="min-h-screen overflow-x-hidden px-4 pb-28 pt-10 md:pt-12 text-white sm:px-6 lg:px-8">
      <section className={pageShell}>
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-10">
          <div className="max-w-6xl">
            <span className="eyebrow notranslate" translate="no">AIAA Access Portal</span>
            <h1 className="max-w-5xl break-words text-[clamp(2.75rem,5.5vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
              Certification starts at Level 1.
            </h1>
            <p className="section-copy mt-7 max-w-3xl">
              AIAA certification is a staged assessment system. Applicants submit evidence, complete practical exams, pass technical review, and receive a verifiable certificate before entering the Public Registry or certified product ranking.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/apply" className="pill-button bg-white text-black">
                Apply for Level 1
              </a>
              <a href="/certification/process" className="pill-button glass-panel">
                View Full Process
              </a>
              <a href="/rankings" className="pill-button glass-panel">
                View Rankings
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={`${pageShell} mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5`}>
        {levels.map((item, index) => (
          <article key={item.level} className="glass-panel min-w-0 rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 text-xs uppercase tracking-[0.22em] text-white/42">{item.level}</p>
              <span className={item.status === "Start here" ? "shrink-0 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100" : "shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-white/50"}>
                {item.status}
              </span>
            </div>
            <h2 className="mt-5 text-[1.65rem] font-semibold leading-tight tracking-[-0.045em] text-white">
              {item.label}
            </h2>
            <p className="mt-3 text-sm text-white/55">{item.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">{item.color}</p>
            <p className="mt-5 text-sm leading-6 text-white/68">{item.requirement}</p>
            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm text-white/65">
              {item.rule}
            </div>
            {index === 0 ? (
              <a href={item.href} className="mt-5 inline-flex text-sm font-medium text-white underline underline-offset-4">
                Start Level 1 Application
              </a>
            ) : (
              <a href={item.href} className="mt-5 inline-flex text-sm text-white/45 underline underline-offset-4">
                View Level Requirements
              </a>
            )}
          </article>
        ))}
      </section>

      <section className={`${pageShell} mt-16 grid gap-6 lg:grid-cols-[1fr_0.8fr]`}>
        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">Strict certification flow</span>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
            Submit, examine, review, certify.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.035] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/35">Step {index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">No level skipping</span>
          <h2 className="text-3xl font-semibold tracking-[-0.045em]">
            Locked levels protect certificate trust.
          </h2>
          <div className="mt-7 space-y-3">
            {certificateRules.map((rule) => (
              <div key={rule} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm leading-6 text-white/66">
                {rule}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={`${pageShell} mt-16 grid gap-6 lg:grid-cols-2`}>
        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">Review score</span>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] md:text-4xl">AIAA score is earned, not claimed.</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {scores.map((score) => (
              <div key={score} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm text-white/70">
                {score}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">After approval</span>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] md:text-4xl">Certificate creates public trust.</h2>
          <div className="mt-7 space-y-4 text-sm leading-6 text-white/66">
            <p>Approved applicants receive an AIAA Certificate ID, active certificate status, issued date, expiry date, verification URL, and public badge.</p>
            <p>Certified agents enter the Public Registry. Certified AI Agent products become eligible for the AI Agent Product Ranking.</p>
            <p>Revenue and benchmark rankings require separate verification layers. Self reported data is not equal to reviewer verified data.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
