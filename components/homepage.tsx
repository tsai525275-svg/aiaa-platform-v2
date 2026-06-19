"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SiteHeader } from "@/components/site-header";

const rankingRows = [
  ["01", "AI Agent Product Ranking", "Commercial and certified AI Agent systems", "AIAA Review", "Preview"],
  ["02", "GitHub Stars Ranking", "Open source AI Agent repositories", "GitHub API", "Live"],
  ["03", "GitHub Trending Ranking", "Fast growing agent repositories", "Daily Snapshots", "Live"],
  ["04", "GitHub Builders Ranking", "Maintainers, contributors, and builders", "GitHub Graph", "Live"],
  ["05", "Agent Framework Ranking", "Orchestration, tools, memory, and workflow stacks", "Review Layer", "Live"]
];

const certLevels = [
  ["Level 1", "L1 Operator", "AI Agent Operator", "Electric Blue", "Agent owner, workflow execution, tool calling, logs, and retry logic."],
  ["Level 2", "L2 Engineer", "AI Agent Engineer", "Cyber Purple", "Production workflow, long tasks, state persistence, notifications, and recovery."],
  ["Level 3", "L3 Architect", "AI Agent Systems Architect", "Titan Gold", "Multi agent systems, shared memory, monitoring, benchmark, and security design."],
  ["Level 4", "L4 Company", "Certified AI Agent Company", "Obsidian Black Gold", "Company proof, production infrastructure, SLA, customers, revenue, and governance."],
  ["Level 5", "L5 Fellow", "AIAA Association Fellow", "Platinum White", "Global influence, public trust, ecosystem contribution, and standards authority."]
];

const certLevelTones = [
  {
    card: "hover:border-[#00A3FF] hover:bg-[#EAF7FF] hover:shadow-[0_26px_76px_rgba(0,163,255,0.2)]",
    bar: "group-hover:bg-[#00A3FF]",
    number: "group-hover:text-[#0066D6]",
    title: "group-hover:text-[#0056B8]",
    badge: "group-hover:border-[#7ED8FF] group-hover:bg-white group-hover:text-[#0056B8]",
    copy: "group-hover:text-neutral-800",
    action: "group-hover:text-[#0066D6]"
  },
  {
    card: "hover:border-[#7C3AED] hover:bg-[#F3ECFF] hover:shadow-[0_26px_76px_rgba(124,58,237,0.18)]",
    bar: "group-hover:bg-[#7C3AED]",
    number: "group-hover:text-[#6D28D9]",
    title: "group-hover:text-[#5B21B6]",
    badge: "group-hover:border-[#C4B5FD] group-hover:bg-white group-hover:text-[#5B21B6]",
    copy: "group-hover:text-neutral-800",
    action: "group-hover:text-[#6D28D9]"
  },
  {
    card: "hover:border-[#D6A21E] hover:bg-[#FFF7DB] hover:shadow-[0_26px_76px_rgba(214,162,30,0.2)]",
    bar: "group-hover:bg-[#D6A21E]",
    number: "group-hover:text-[#B77900]",
    title: "group-hover:text-[#8A5A00]",
    badge: "group-hover:border-[#F4D06F] group-hover:bg-white group-hover:text-[#8A5A00]",
    copy: "group-hover:text-neutral-800",
    action: "group-hover:text-[#B77900]"
  },
  {
    card: "hover:border-[#C89B3C] hover:bg-[#111111] hover:shadow-[0_26px_80px_rgba(0,0,0,0.28)]",
    bar: "group-hover:bg-[#D6B35A]",
    number: "group-hover:text-[#F5D47A]",
    title: "group-hover:text-[#F5D47A]",
    badge: "group-hover:border-[#D6B35A] group-hover:bg-[#1D1D1D] group-hover:text-[#F5D47A]",
    copy: "group-hover:text-neutral-300",
    action: "group-hover:text-[#F5D47A]"
  },
  {
    card: "hover:border-[#C9CDD6] hover:bg-[#FAFBFF] hover:shadow-[0_26px_76px_rgba(100,116,139,0.18)]",
    bar: "group-hover:bg-[#B8BDC9]",
    number: "group-hover:text-[#475569]",
    title: "group-hover:text-[#334155]",
    badge: "group-hover:border-[#D7DBE5] group-hover:bg-white group-hover:text-[#334155]",
    copy: "group-hover:text-neutral-700",
    action: "group-hover:text-[#475569]"
  }
];

const registryRows = [
  ["Verified", "Public identity active"],
  ["Pending", "Application under review"],
  ["Expired", "Certificate requires renewal"],
  ["Watchlist", "Additional review required"]
];

const faqRows = [
  ["What does AIAA rank?", "AIAA ranks agent products, open source projects, builders, and frameworks. Each ranking uses a separate scope so unrelated tools do not mix together."],
  ["Why does AIAA need certification?", "Rankings show market signals. Certification adds identity, evidence, and review status so public trust does not depend on popularity alone."],
  ["How does the registry work?", "The registry turns certificates into searchable public records. Each record shows status, level, and validity."],
  ["What comes  after  this version?", "The next layer connects live data, item pages, trend charts, and certification application flows to the same visual system."]
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function ScrollBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 54, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroGraph() {
  const nodes = [
    { label: "Level 1", x: "18%", y: "56%", size: "large", delay: "0s" },
    { label: "Level 2", x: "31%", y: "48%", size: "small", delay: "0.4s" },
    { label: "Level 3", x: "47%", y: "40%", size: "small", delay: "0.8s" },
    { label: "Level 4", x: "64%", y: "33%", size: "large", delay: "1.2s" },
    { label: "Level 5", x: "79%", y: "26%", size: "small", delay: "1.6s" }
  ];

  const lines = [
    ["18%", "56%", "31%", "48%"],
    ["31%", "48%", "47%", "40%"],
    ["47%", "40%", "64%", "33%"],
    ["64%", "33%", "79%", "26%"],
    ["18%", "56%", "47%", "40%"],
    ["31%", "48%", "79%", "26%"]
  ];

  return (
    <div className="hero-graph constellation-hero" aria-hidden="true">
      <div className="constellation-field" />
      <svg className="constellation-svg" viewBox="0 0 1000 640" preserveAspectRatio="none">
        {lines.map(([x1, y1, x2, y2], index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} className="constellation-line" style={{ animationDelay: `${index * 0.45}s` }} />
        ))}
        <path className="constellation-path one" d="M120 430 C260 180, 420 145, 540 310 S760 500, 905 230" />
        <path className="constellation-path two" d="M96 225 C300 290, 410 520, 628 405 S835 170, 945 350" />
      </svg>
      {nodes.map((node) => (
        <span key={node.label} className={`constellation-node ${node.size}`} style={{ left: node.x, top: node.y, animationDelay: node.delay }}>
          <span className="constellation-dot" />
          <span className="constellation-label">{node.label}</span>
        </span>
      ))}
      <span className="constellation-scan horizontal" />
      <span className="constellation-scan vertical" />
      <span className="constellation-marker one" />
      <span className="constellation-marker two" />
      <span className="constellation-marker three" />
    </div>
  );
}

function RankingSignal() {
  return (
    <div className="motion-panel ranking-signal" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <span key={item} className="signal-bar" style={{ animationDelay: `${item * 0.16}s` }} />
      ))}
      <span className="panel-scan" />
    </div>
  );
}

function SealMotion() {
  return (
    <div className="motion-panel seal-motion" aria-hidden="true">
      <span className="seal-ring" />
      <span className="seal-ring small" />
      <div className="seal-level-path">
        <span>Level 1</span>
        <span>Level 2</span>
        <span>Level 3</span>
        <span>Level 4</span>
        <span>Level 5</span>
      </div>
    </div>
  );
}

function LedgerMotion() {
  return (
    <div className="motion-panel ledger-motion" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((item) => (
        <span key={item} className="ledger-row" style={{ animationDelay: `${item * 0.2}s` }} />
      ))}
    </div>
  );
}

function PipelineMotion() {
  return (
    <div className="motion-panel pipeline-motion" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => (
        <span key={item} className="pipeline-node" style={{ left: `${12 + item * 25}%`, animationDelay: `${item * 0.32}s` }} />
      ))}
      <span className="pipeline-flow" />
    </div>
  );
}

function SectionShell({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [42, -42]);

  return (
    <section ref={ref} id={id} className={`scroll-section ${className}`}>
      <motion.div style={{ y }} className="section-orb" aria-hidden="true" />
      <div className="section-inner">{children}</div>
    </section>
  );
}

export function Homepage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <HeroGraph />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] w-[min(1480px,calc(100vw-24px))] flex-col items-center justify-center py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
            <SectionLabel>AIAA Intelligence Index</SectionLabel>
            <h1 className="mx-auto max-w-6xl text-[clamp(4rem,10vw,10.5rem)] font-semibold leading-[0.84] tracking-[-0.085em] text-neutral-950">
              The <span className="bg-gradient-to-r from-[#123f8c] via-[#2563eb] to-[#0ea5a5] bg-clip-text text-transparent">AI Agent</span> <span className="aiaa-fire-text">trust</span> <span className="aiaa-earth-text">index.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-neutral-700">
              AIAA connects rankings, certification, registry records, and public signals into one identity layer for the AI Agent economy.
            </p>
            <div className="mt-5 flex justify-center">
              <span className="aiaa-element-chip rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em]">Public trust infrastructure</span>
            </div>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="/rankings" className="aiaa-button-dark">Explore rankings</a>
              <a href="/apply" className="aiaa-button-light">Submit an agent</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.75 }}
            className="mt-16 w-full border-y border-neutral-300 bg-white"
          >
            <div className="grid divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {[
                ["5", "Ranking systems", "Products, GitHub, builders, frameworks"],
                ["120+", "Tracked records", "Public index rows and snapshots"],
                ["Daily", "Snapshot cadence", "Production data refresh cycle"],
                ["Level 1 to Level 5", "Certification path", "Identity, capability, public trust"]
              ].map(([value, label, note]) => (
                <div key={label} className="px-6 py-7 text-left">
                  <div className="font-mono text-4xl font-semibold tracking-[-0.07em] text-[#123f8c]">{value}</div>
                  <div className="mt-4 text-sm font-semibold uppercase tracking-[0.18em]">{label}</div>
                  <div className="mt-2 text-sm leading-6 text-neutral-500">{note}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <SectionShell id="rankings">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <ScrollBlock>
            <SectionLabel>Rankings</SectionLabel>
            <h2 className="section-title">Public signals with <span className="text-[#2563eb]">review context.</span></h2>
            <p className="section-copy mt-6 max-w-xl">
              Each board has a clear subject, source, status, and reason for inclusion. AIAA ranks by relevance first.
            </p>
            <RankingSignal />
          </ScrollBlock>

          <ScrollBlock className="border-y border-neutral-300">
            <div className="hidden grid-cols-[80px_1fr_1fr_150px_120px] border-b border-neutral-200 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-neutral-500 md:grid">
              <div>Index</div><div>Name</div><div>Scope</div><div>Source</div><div>Status</div>
            </div>
            {rankingRows.map((row) => (
              <a key={row[0]} href="/rankings" className="group grid gap-3 border-b border-neutral-200 py-6 transition last:border-b-0 hover:bg-neutral-50 md:grid-cols-[80px_1fr_1fr_150px_120px] md:px-3">
                <div className="font-mono text-2xl font-semibold tracking-[-0.08em]">{row[0]}</div>
                <div className="text-lg font-semibold">{row[1]}</div>
                <div className="text-sm leading-6 text-neutral-600">{row[2]}</div>
                <div className="text-sm text-neutral-600">{row[3]}</div>
                <div className="text-sm font-semibold text-neutral-950">{row[4]} →</div>
              </a>
            ))}
          </ScrollBlock>
        </div>
      </SectionShell>

      <SectionShell id="certification">
        <div className="flex flex-col justify-between gap-10 border-b border-neutral-300 pb-10 lg:flex-row lg:items-end">
          <ScrollBlock>
            <SectionLabel>Certification</SectionLabel>
            <h2 className="section-title max-w-4xl">Five levels for <span className="aiaa-fire-text">public</span> <span className="aiaa-earth-text">agent trust.</span></h2>
          </ScrollBlock>
          <ScrollBlock className="shrink-0">
            <SealMotion />
          </ScrollBlock>
        </div>

        <div className="grid divide-y divide-neutral-300 border-b border-neutral-300 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {certLevels.map((row, index) => {
            const tone = certLevelTones[index];

            return (
              <motion.a
                key={row[0]}
                href={`/certification/level-${index + 1}`}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, transition: { duration: 0.2, delay: 0 } }}
                viewport={{ once: false, amount: 0.24 }}
                transition={{ delay: index * 0.06, duration: 0.55 }}
                className={`group relative min-h-[260px] overflow-hidden border border-transparent p-6 transition duration-300 hover:z-10 ${tone.card}`}
              >
                <span className={`absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-full opacity-0 transition duration-300 group-hover:scale-x-100 group-hover:opacity-100 ${tone.bar}`} />
                <div className={`font-mono text-4xl font-semibold tracking-[-0.08em] transition duration-300 ${tone.number}`}>{row[0]}</div>
                <div className={`mt-6 inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-neutral-500 transition duration-300 ${tone.badge}`}>
                  {row[3]}
                </div>
                <h3 className={`mt-8 text-xl font-semibold transition duration-300 ${tone.title}`}>{row[1]}</h3>
                <p className={`mt-2 text-sm font-medium text-neutral-500 transition duration-300 ${tone.copy}`}>{row[2]}</p>
                <p className={`mt-4 text-sm leading-6 text-neutral-600 transition duration-300 ${tone.copy}`}>{row[4]}</p>
                <div className={`mt-8 text-sm font-semibold opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100 ${tone.action}`}>View level →</div>
              </motion.a>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell id="registry">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollBlock>
            <SectionLabel>Registry</SectionLabel>
            <h2 className="section-title">Verification should be <span className="text-[#7c3aed]">searchable.</span></h2>
            <p className="section-copy mt-6 max-w-xl">
              The registry turns certificates into public records. Status, owner, level, issue date, and validity become visible trust signals.
            </p>
            <LedgerMotion />
          </ScrollBlock>

          <ScrollBlock className="border-y border-neutral-300">
            {registryRows.map((row, index) => (
              <div key={row[0]} className="grid grid-cols-[80px_1fr] gap-6 border-b border-neutral-200 py-6 last:border-b-0">
                <div className="font-mono text-xl text-neutral-400">0{index + 1}</div>
                <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                  <div className="font-semibold">{row[0]}</div>
                  <div className="text-neutral-600">{row[1]}</div>
                </div>
              </div>
            ))}
          </ScrollBlock>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollBlock>
            <SectionLabel>Method</SectionLabel>
            <h2 className="section-title">AIAA separates <span className="aiaa-fire-text">attention</span> from <span className="aiaa-earth-text">trust.</span></h2>
            <PipelineMotion />
          </ScrollBlock>
          <ScrollBlock className="grid border-y border-neutral-300 md:grid-cols-2">
            {["Public signal collection", "Scope and relevance review", "Identity and evidence check", "Certification and registry output"].map((item, index) => (
              <div key={item} className="border-b border-neutral-200 p-7 md:border-r md:odd:border-r md:even:border-r-0">
                <div className="font-mono text-2xl text-neutral-400">0{index + 1}</div>
                <div className="mt-12 text-xl font-semibold">{item}</div>
              </div>
            ))}
          </ScrollBlock>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <ScrollBlock>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="section-title">Common questions.</h2>
          </ScrollBlock>
          <ScrollBlock className="border-y border-neutral-300">
            {faqRows.map((item, index) => (
              <details key={item[0]} className="group border-b border-neutral-200 py-6 last:border-b-0" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-8 text-xl font-semibold">
                  {item[0]}
                  <span className="text-neutral-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-600">{item[1]}</p>
              </details>
            ))}
          </ScrollBlock>
        </div>
      </SectionShell>
    </main>
  );
}
