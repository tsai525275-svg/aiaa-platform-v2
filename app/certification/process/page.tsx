const pageShell = "mx-auto w-full max-w-[1440px]";

const phases = [
  {
    title: "1. Application Intake",
    content: "The applicant submits identity, agent profile, workflow evidence, technical documents, security notes, and public links."
  },
  {
    title: "2. Eligibility Screening",
    content: "AIAA validates level eligibility. New applicants can only apply for Level 1. Higher levels require active prior certificates."
  },
  {
    title: "3. Practical Exam",
    content: "The applicant completes a level specific task. The work must produce logs, execution evidence, and reviewable outputs."
  },
  {
    title: "4. Technical Review",
    content: "Reviewers inspect architecture, reliability, safety, documentation, monitoring, benchmark evidence, and failure behavior."
  },
  {
    title: "5. Decision",
    content: "AIAA issues Approved, Need More Information, Rejected, Suspended, or Council Review status depending on evidence quality."
  },
  {
    title: "6. Certificate Issuance",
    content: "Approved applicants receive a certificate ID, public verification URL, registry profile, badge, and ranking eligibility where applicable."
  }
];

const statuses = [
  "Draft",
  "Submitted",
  "Screening",
  "Exam Assigned",
  "Under Review",
  "Need More Information",
  "Approved",
  "Rejected",
  "Certificate Issued",
  "Expired",
  "Suspended",
  "Revoked"
];

const outputs = [
  "AIAA Certificate ID",
  "Verification URL",
  "Registry profile",
  "Certification level",
  "Issued date",
  "Expiry date",
  "Public badge",
  "Ranking eligibility"
];

export default function CertificationProcessPage() {
  return (
    <main className="min-h-screen overflow-x-hidden px-4 pb-28 pt-32 text-white sm:px-6 lg:px-8">
      <section className={pageShell}>
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-10">
          <span className="eyebrow notranslate" translate="no">AIAA Certification Process</span>
          <h1 className="max-w-5xl break-words text-[clamp(2.75rem,5.5vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
            AIAA certification follows exam discipline.
          </h1>
          <p className="section-copy mt-7 max-w-3xl">
            The system is designed like a strict professional exam. Applicants submit proof, complete assessments, pass review, and receive verifiable credentials. Skipping levels is not allowed.
          </p>
        </div>
      </section>

      <section className={`${pageShell} mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3`}>
        {phases.map((phase) => (
          <article key={phase.title} className="glass-panel min-w-0 rounded-[1.75rem] p-6">
            <h2 className="break-words text-2xl font-semibold tracking-[-0.04em]">{phase.title}</h2>
            <p className="mt-4 text-sm leading-6 text-white/64">{phase.content}</p>
          </article>
        ))}
      </section>

      <section className={`${pageShell} mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">Certificate status</span>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] md:text-4xl">Every credential has a public state.</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {statuses.map((status) => (
              <span key={status} className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-white/64">
                {status}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <span className="eyebrow">Public trust outputs</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {outputs.map((item) => (
              <div key={item} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white/66">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
