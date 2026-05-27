import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AIAAFrame,
  CTASection,
  DataPanel,
  IndexList,
  PageHero,
  Section,
  SplitLedger,
  StatusPill,
  ThinTable,
} from "@/components/aiaa-page-kit";

type LevelRecord = {
  level: string;
  shortLabel: string;
  identity: string;
  color: string;
  title: string;
  copy: string;
  positioning: string;
  who: string;
  entryRule: string;
  requiredTools: string[];
  capabilityGroups: Array<{ title: string; items: string[] }>;
  taskTitle: string;
  minimum: string[];
  restrictions?: string[];
  reviewMaterials?: string[];
  specialNotes?: string[];
  nextAction: string;
  certificateImage: string;
};

const levelMap: Record<string, LevelRecord> = {
  "level-1": {
    level: "Level 1",
    shortLabel: "L1 Operator",
    identity: "AI Agent Operator",
    color: "Electric Blue",
    title: "Level 1. AI Agent Operator.",
    copy: "Level 1 is the entry certification for people who can operate real AI Agent workflows. It is not for prompt only usage or slide based demos.",
    positioning:
      "AI Agent basic operation and workflow engineer. This level proves that the applicant can make an Agent run through tools, APIs, logs, retries, and documentation.",
    who: "Builders, operators, early product owners, and teams preparing a first public Agent record.",
    entryRule: "Open application. New applicants start here.",
    requiredTools: ["ChatGPT", "OpenAI Codex", "Claude", "Cursor"],
    capabilityGroups: [
      {
        title: "AI basics",
        items: [
          "Prompt Engineering",
          "Context Window",
          "Token basics",
          "LLM behavior",
          "Model differences",
          "System Prompt",
          "Temperature",
          "Few Shot",
        ],
      },
      {
        title: "Agent workflow",
        items: [
          "Single Agent Workflow",
          "Prompt Chaining",
          "Task Routing",
          "Tool Calling",
          "Input Output Handling",
          "Workflow Execution",
          "Task Retry",
          "Basic Automation",
        ],
      },
      {
        title: "Engineering",
        items: [
          "API Calls",
          "JSON Structure",
          "Webhook Basics",
          "Environment Variables",
          "CLI Basics",
          "GitHub Basics",
          "README Writing",
        ],
      },
      {
        title: "Debug",
        items: [
          "Error Reading",
          "Log Reading",
          "Retry Logic",
          "Basic Failure Recovery",
        ],
      },
    ],
    taskTitle: "Build a working Agent.",
    minimum: [
      "At least one Tool Calling flow",
      "At least one external API",
      "Complete workflow",
      "Complete README",
      "Error handling",
      "Retry Logic",
      "Execution Log",
    ],
    restrictions: [
      "Prompt only submissions are not accepted",
      "UI only submissions are not accepted",
      "Demo screen only submissions are not accepted",
      "PPT only submissions are not accepted",
    ],
    nextAction: "Application for Level 1",
    certificateImage: "/certificates/level-1.png",
  },
  "level-2": {
    level: "Level 2",
    shortLabel: "L2 Engineer",
    identity: "AI Agent Engineer",
    color: "Cyber Purple",
    title: "Level 2. AI Agent Engineer.",
    copy: "Level 2 is for production workflow engineers. It checks whether the Agent can run beyond a local demo with state, recovery, monitoring, and deployment context.",
    positioning:
      "Production Workflow Engineer. This level proves that the applicant can deploy AI Agent workflows with reliability, long running jobs, and human override.",
    who: "Approved Level 1 records that need production workflow review.",
    entryRule: "Requires approved Level 1.",
    requiredTools: ["OpenAI Codex", "Claude Code", "OpenHands", "Hermes"],
    capabilityGroups: [
      {
        title: "Agent systems",
        items: [
          "Long Running Workflow",
          "Multi Tool Workflow",
          "Task Queue",
          "Async Execution",
          "Human In The Loop",
          "State Management",
          "Session Management",
        ],
      },
      {
        title: "Reliability",
        items: [
          "Failure Recovery",
          "Fallback Systems",
          "Retry Architecture",
          "Monitoring",
          "Execution Trace",
          "Logging Systems",
        ],
      },
      {
        title: "AI engineering",
        items: [
          "Prompt System Design",
          "Context Engineering",
          "Memory Injection",
          "Tool Selection",
          "Cost Control",
          "Latency Optimization",
        ],
      },
      {
        title: "Infrastructure",
        items: [
          "Database Basics",
          "Redis Basics",
          "Queue Basics",
          "Docker Basics",
          "Deployment Basics",
        ],
      },
    ],
    taskTitle: "Build a production workflow.",
    minimum: [
      "Three or more tools",
      "Queue or long running task",
      "Notification system",
      "State persistence",
      "Error recovery",
      "Human override",
      "Monitoring",
      "Deployment guide",
    ],
    restrictions: [
      "Local demo only is not accepted",
      "Submissions without error recovery are not accepted",
      "Submissions without state are not accepted",
    ],
    nextAction: "Prepare Level 2 upgrade",
    certificateImage: "/certificates/level-2.png",
  },
  "level-3": {
    level: "Level 3",
    shortLabel: "L3 Architect",
    identity: "AI Agent Systems Architect",
    color: "Titan Gold",
    title: "Level 3. AI Agent Systems Architect.",
    copy: "Level 3 is the high bar for production multi agent systems. It reviews orchestration, memory, security, observability, cost, and benchmark evidence.",
    positioning:
      "Large scale AI Agent system architect. This level proves that the applicant can design and operate a production multi agent system.",
    who: "Approved Level 2 records with real multi agent architecture and production deployment evidence.",
    entryRule: "Requires approved Level 2.",
    requiredTools: [
      "OpenAI Codex",
      "Claude Code",
      "MCP",
      "LangGraph",
      "Hermes",
      "OpenClaw",
    ],
    capabilityGroups: [
      {
        title: "Multi agent",
        items: [
          "Agent Orchestration",
          "Role Based Agents",
          "Supervisor Agent",
          "Planner Agent",
          "Worker Agent",
          "Distributed Agent Systems",
        ],
      },
      {
        title: "Memory systems",
        items: [
          "Vector Database",
          "Retrieval Systems",
          "Long Term Memory",
          "Context Persistence",
          "Shared Memory",
        ],
      },
      {
        title: "Infrastructure",
        items: [
          "Microservices",
          "Distributed Queue",
          "Scaling",
          "Monitoring Stack",
          "CI CD",
          "Production Deployment",
          "Observability",
        ],
      },
      {
        title: "Security",
        items: [
          "Permission Systems",
          "Sandboxing",
          "Secrets Management",
          "Audit Logs",
          "Data Isolation",
        ],
      },
      {
        title: "Benchmark",
        items: [
          "Performance Evaluation",
          "Benchmark Systems",
          "Latency Analysis",
          "Cost Analysis",
          "Reliability Scoring",
        ],
      },
    ],
    taskTitle: "Build a production multi agent system.",
    minimum: [
      "Three or more Agents",
      "Shared memory",
      "Monitoring dashboard",
      "Cost tracking",
      "Security layer",
      "State recovery",
      "Production deployment",
      "Benchmark report",
      "API documentation",
    ],
    specialNotes: [
      "Target pass rate is below fifteen percent",
      "This level creates scarcity inside the certification system",
    ],
    nextAction: "Prepare Level 3 upgrade",
    certificateImage: "/certificates/level-3.png",
  },
  "level-4": {
    level: "Level 4",
    shortLabel: "L4 Company",
    identity: "Certified AI Agent Company",
    color: "Obsidian Black Gold",
    title: "Level 4. Certified AI Agent Company.",
    copy: "Level 4 is for organizations, not individuals. It reviews whether the company has real product, team, customers, revenue, operations, and infrastructure.",
    positioning:
      "Enterprise grade AI Agent organization. This level connects certification to company level trust, operations, and commercial delivery.",
    who: "Approved Level 3 records or organizations with company level AI Agent infrastructure and commercial proof.",
    entryRule:
      "Requires approved Level 3 or council accepted company review path.",
    requiredTools: [],
    capabilityGroups: [
      {
        title: "Company infrastructure",
        items: [
          "Production Infrastructure",
          "SLA",
          "Incident Response",
          "Security Review",
          "Customer Support",
          "API Governance",
        ],
      },
      {
        title: "Team operations",
        items: [
          "Engineering Management",
          "Deployment Pipeline",
          "Release Process",
          "Quality Control",
          "Documentation Systems",
        ],
      },
      {
        title: "Business systems",
        items: [
          "Revenue Systems",
          "Sales Systems",
          "Client Delivery",
          "Contracts",
          "Operational Stability",
        ],
      },
      {
        title: "AI infrastructure",
        items: [
          "Production Agent Stack",
          "Benchmark Systems",
          "Monitoring",
          "Scaling",
          "Multi Agent Operations",
        ],
      },
    ],
    taskTitle: "Prove company level readiness.",
    minimum: [
      "Official website",
      "Real product",
      "Real customers",
      "Real team",
      "Real revenue",
      "Formal brand",
    ],
    reviewMaterials: [
      "Website",
      "Product demo",
      "Company documents",
      "API documentation",
      "Customer cases",
      "Revenue proof",
      "Benchmark report",
      "Security files",
      "Uptime report",
    ],
    specialNotes: [
      "This level supports global AI company ranking",
      "This level increases enterprise trust and brand authority",
    ],
    nextAction: "Prepare Level 4 company review",
    certificateImage: "/certificates/level-4.png",
  },
  "level-5": {
    level: "Level 5",
    shortLabel: "L5 Fellow",
    identity: "AIAA Association Fellow",
    color: "Platinum White",
    title: "Level 5. AIAA Association Fellow.",
    copy: "Level 5 is for people and organizations that shape the AI Agent ecosystem. It reviews global influence, original technical contribution, public trust, and standards contribution.",
    positioning:
      "Rule maker level inside the global AI Agent world. This level is reserved for ecosystem leaders and public infrastructure builders.",
    who: "Framework authors, major AI company founders, Agent infrastructure authors, important researchers, global community leaders, and major open source maintainers.",
    entryRule: "Requires approved Level 4 or council review invitation.",
    requiredTools: [],
    capabilityGroups: [
      {
        title: "Global systems thinking",
        items: [
          "AI Governance",
          "Standards Design",
          "Protocol Thinking",
          "Ecosystem Architecture",
          "Public Infrastructure Design",
        ],
      },
      {
        title: "Technical leadership",
        items: [
          "Advanced Multi Agent Systems",
          "Infrastructure Strategy",
          "Research Direction",
          "Open Source Leadership",
        ],
      },
      {
        title: "Public influence",
        items: [
          "Global Speaking",
          "Industry Leadership",
          "Cross Organization Coordination",
          "Public Trust Building",
        ],
      },
    ],
    taskTitle: "Prove ecosystem level impact.",
    minimum: [
      "Global influence",
      "Open source influence",
      "Technical originality",
      "Public trust",
      "Ecosystem contribution",
      "Standards contribution",
    ],
    reviewMaterials: [
      "Council Review",
      "Fellow Review",
      "Public Reputation Review",
      "Impact Review",
      "Open Source Review",
    ],
    nextAction: "Request council review",
    certificateImage: "/certificates/level-5.png",
  },
};

const levelOrder = [
  "level-1",
  "level-2",
  "level-3",
  "level-4",
  "level-5",
] as const;

const levelAccent: Record<
  string,
  { main: string; soft: string; border: string; text: string }
> = {
  "level-1": {
    main: "#2563eb",
    soft: "rgba(37, 99, 235, 0.10)",
    border: "rgba(37, 99, 235, 0.34)",
    text: "#1d4ed8",
  },
  "level-2": {
    main: "#7c3aed",
    soft: "rgba(124, 58, 237, 0.10)",
    border: "rgba(124, 58, 237, 0.34)",
    text: "#6d28d9",
  },
  "level-3": {
    main: "#b7791f",
    soft: "rgba(183, 121, 31, 0.12)",
    border: "rgba(183, 121, 31, 0.36)",
    text: "#92400e",
  },
  "level-4": {
    main: "#111827",
    soft: "rgba(17, 24, 39, 0.08)",
    border: "rgba(183, 121, 31, 0.40)",
    text: "#111827",
  },
  "level-5": {
    main: "#64748b",
    soft: "rgba(226, 232, 240, 0.70)",
    border: "rgba(100, 116, 139, 0.36)",
    text: "#334155",
  },
};

function LevelNavigator({ current }: { current: string }) {
  const currentIndex = levelOrder.indexOf(
    current as (typeof levelOrder)[number],
  );
  const previousKey = currentIndex > 0 ? levelOrder[currentIndex - 1] : null;
  const nextKey =
    currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null;
  const currentRecord = levelMap[current];

  return (
    <Section
      eyebrow="Level Navigator"
      title="Choose another certification level."
      copy="Use the visible level switcher to move between Level 1 to Level 5. The next level button is highlighted when a next certification path exists."
      compact
    >
      <div className="rounded-[1.35rem] border border-neutral-200 bg-white/90 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
        <div className="grid gap-3 sm:grid-cols-5">
          {levelOrder.map((key) => {
            const item = levelMap[key];
            const theme = levelAccent[key];
            const active = key === current;

            return (
              <Link
                key={key}
                href={`/certification/${key}`}
                className="group rounded-[1rem] border px-4 py-4 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.10)]"
                style={{
                  borderColor: active ? theme.main : theme.border,
                  background: active
                    ? `linear-gradient(135deg, ${theme.soft}, rgba(255,255,255,0.96))`
                    : "rgba(255,255,255,0.78)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: theme.main }}
                  />
                  <span
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-neutral-500"
                    translate="no"
                  >
                    {item.shortLabel}
                  </span>
                </div>
                <div
                  className="mt-3 text-2xl font-semibold tracking-[-0.05em]"
                  style={{ color: active ? theme.text : "#0f172a" }}
                >
                  {item.level}
                </div>
                <div className="mt-1 text-sm leading-6 text-neutral-600">
                  {item.identity}
                </div>
                {active ? (
                  <div
                    className="mt-3 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: theme.text }}
                  >
                    Current
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-neutral-950">
              Current page
            </div>
            <div className="mt-1 text-sm text-neutral-600">
              {currentRecord.level} · {currentRecord.identity}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {previousKey ? (
              <Link
                href={`/certification/${previousKey}`}
                className="aiaa-button-light"
              >
                Previous {levelMap[previousKey].level}
              </Link>
            ) : null}
            {nextKey ? (
              <Link
                href={`/certification/${nextKey}`}
                className="aiaa-button-dark"
              >
                Next {levelMap[nextKey].level}
              </Link>
            ) : (
              <Link href="/certification" className="aiaa-button-dark">
                All levels
              </Link>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function generateStaticParams() {
  return Object.keys(levelMap).map((level) => ({ level }));
}

function WordGrid({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="border border-neutral-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700"
          translate="no"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default async function CertificationLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const record = levelMap[level];

  if (!record) notFound();

  const applicationHref =
    record.level === "Level 1" ? "/apply/agent" : "/certification/process";

  return (
    <AIAAFrame>
      <PageHero
        eyebrow={record.level}
        title={record.title}
        copy={record.copy}
        stats={[
          [record.identity, "identity"],
          [record.shortLabel, "label"],
          [record.color, "system color"],
          [record.entryRule, "entry rule"],
          [record.nextAction, "next action"],
        ]}
        action={
          <Link href={applicationHref} className="aiaa-button-dark">
            {record.nextAction}
          </Link>
        }
      />

      <Section
        eyebrow="Certificate Preview"
        title={`${record.level} certificate design.`}
        copy="This preview shows the certificate design for this level. Issued certificates will replace the sample name, certificate number, issue date, verification link, and QR code with real member data."
        compact
      >
        <div className="overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <img
            src={record.certificateImage}
            alt={`${record.level} ${record.identity} certificate preview`}
            className="block h-auto w-full rounded-[0.9rem]"
          />
        </div>
      </Section>

      <Section
        eyebrow="Positioning"
        title={record.identity}
        copy={record.positioning}
        compact
      >
        <SplitLedger
          left={
            <div className="space-y-6">
              <DataPanel label="Who it fits" title={record.who} />
              <DataPanel label="Entry rule" title={record.entryRule} />
            </div>
          }
          right={
            <ThinTable
              headers={["Field", "Value"]}
              rows={[
                ["Level", record.level],
                ["Identity", record.identity],
                [
                  "Label",
                  <span key="label" translate="no">
                    {record.shortLabel}
                  </span>,
                ],
                ["Color", record.color],
                ["Review focus", record.taskTitle],
              ].map(([field, value]) => [
                <span
                  key={String(field)}
                  className="font-semibold text-neutral-950"
                >
                  {field}
                </span>,
                value,
              ])}
            />
          }
        />
      </Section>

      <Section
        eyebrow="Capabilities"
        title="Required capability map."
        copy="This section uses the level system table as the source. Each level page only shows the capability groups for that level."
        compact
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {record.capabilityGroups.map((group) => (
            <DataPanel
              key={group.title}
              label="Capability group"
              title={group.title}
            >
              <WordGrid items={group.items} />
            </DataPanel>
          ))}
        </div>
      </Section>

      {record.requiredTools.length > 0 ? (
        <Section
          eyebrow="Required Tools"
          title="Tools expected at this level."
          copy="Tool names stay in English because they are product names and should not be translated by the browser."
          compact
        >
          <WordGrid items={record.requiredTools} />
        </Section>
      ) : null}

      <Section
        eyebrow="Task Requirement"
        title={record.taskTitle}
        copy="The applicant must provide enough proof for review. The reviewer should see the working system, evidence, logs, and operating context."
        compact
      >
        <IndexList
          rows={record.minimum.map((item, index) => ({
            index: String(index + 1).padStart(2, "0"),
            title: item,
            copy: "Required evidence for this level review.",
            meta: "Required",
          }))}
        />
      </Section>

      {record.reviewMaterials ? (
        <Section
          eyebrow="Review Materials"
          title="Files and proof reviewed."
          copy="Higher levels need company, revenue, security, uptime, council, or reputation evidence depending on the level."
          compact
        >
          <ThinTable
            headers={["No.", "Material", "Purpose"]}
            rows={record.reviewMaterials.map((item, index) => [
              <span key="no" className="font-mono text-neutral-950">
                {String(index + 1).padStart(2, "0")}
              </span>,
              <span key="material" className="font-semibold text-neutral-950">
                {item}
              </span>,
              "Used by reviewers to verify claims before public status is issued.",
            ])}
          />
        </Section>
      ) : null}

      {record.restrictions ? (
        <Section
          eyebrow="Not Accepted"
          title="Submissions that fail this level."
          copy="This prevents prompt only, mockup only, or local only submissions from entering the wrong certification path."
          compact
        >
          <ThinTable
            headers={["No.", "Restriction"]}
            rows={record.restrictions.map((item, index) => [
              <span key="no" className="font-mono text-neutral-950">
                {String(index + 1).padStart(2, "0")}
              </span>,
              <StatusPill key="restriction" tone="bad">
                {item}
              </StatusPill>,
            ])}
          />
        </Section>
      ) : null}

      {record.specialNotes ? (
        <Section
          eyebrow="Level Notes"
          title="Rules that define this level."
          copy="These notes should stay visible because they explain scarcity, ranking authority, and public trust logic."
          compact
        >
          <ThinTable
            headers={["No.", "Note"]}
            rows={record.specialNotes.map((item, index) => [
              <span key="no" className="font-mono text-neutral-950">
                {String(index + 1).padStart(2, "0")}
              </span>,
              item,
            ])}
          />
        </Section>
      ) : null}

      <LevelNavigator current={level} />

      <CTASection
        title={`${record.level} review path.`}
        copy="The level page now follows the AIAA Level 1 to Level 5 system table. Each level keeps its own identity, capability map, task requirements, and review rule."
        primaryHref={applicationHref}
        primaryLabel={record.nextAction}
        secondaryHref="/certification"
        secondaryLabel="All Levels"
      />
    </AIAAFrame>
  );
}
