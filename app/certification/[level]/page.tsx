import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

const levels = {
  "level-1": {
    level: "Level 1",
    label: "L1 Operator",
    title: "AI Agent Operator",
    badge: "Certified AI Agent Operator",
    color: "Electric Blue",
    position: "AI Agent basic operation and workflow engineer.",
    identity:
      "Level 1 verifies that a builder can make an AI Agent operate with a real workflow, tool calling, logging, retry logic, and basic failure handling.",
    exam: "Basic Agent Workflow",
    pass: "80 points",
    validity: "12 months",
    difficulty: "Foundation",
    scarcity: "High volume",
    core: "Workflow",
    categories: [
      {
        title: "AI Foundations",
        items: [
          "Prompt Engineering",
          "Context Window",
          "Token Basics",
          "LLM Behavior",
          "Model Differences",
          "System Prompt",
          "Temperature",
          "Few Shot"
        ]
      },
      {
        title: "Agent Workflow",
        items: [
          "Single Agent Workflow",
          "Prompt Chaining",
          "Task Routing",
          "Tool Calling",
          "Input Output Handling",
          "Workflow Execution",
          "Task Retry",
          "Basic Automation"
        ]
      },
      {
        title: "Engineering Basics",
        items: [
          "API Calls",
          "JSON Structure",
          "Webhook Basics",
          "Environment Variables",
          "CLI Basics",
          "GitHub Basics",
          "README Writing"
        ]
      },
      {
        title: "Debugging",
        items: [
          "Error Reading",
          "Log Reading",
          "Retry Logic",
          "Basic Failure Recovery"
        ]
      }
    ],
    tools: ["ChatGPT", "OpenAI Codex", "Claude", "Cursor"],
    requirements: [
      "Build a working Agent",
      "Use at least 1 Tool Calling flow",
      "Connect at least 1 external API",
      "Complete a full Workflow",
      "Write a complete README",
      "Add Error Handling",
      "Add Retry Logic",
      "Provide Execution Log"
    ],
    rejected: [
      "Prompt only submission",
      "UI only submission",
      "Static demo only",
      "PPT only submission"
    ]
  },
  "level-2": {
    level: "Level 2",
    label: "L2 Engineer",
    title: "AI Agent Engineer",
    badge: "Certified AI Agent Engineer",
    color: "Cyber Purple",
    position: "Production Workflow Engineer.",
    identity:
      "Level 2 verifies that a builder can deploy a production ready AI Agent workflow with state, reliability, recovery, notification, and human override.",
    exam: "Production Workflow System",
    pass: "85 points",
    validity: "12 months",
    difficulty: "Intermediate",
    scarcity: "Medium volume",
    core: "Production",
    categories: [
      {
        title: "Agent Systems",
        items: [
          "Long Running Workflow",
          "Multi Tool Workflow",
          "Task Queue",
          "Async Execution",
          "Human In The Loop",
          "State Management",
          "Session Management"
        ]
      },
      {
        title: "Reliability",
        items: [
          "Failure Recovery",
          "Fallback Systems",
          "Retry Architecture",
          "Monitoring",
          "Execution Trace",
          "Logging Systems"
        ]
      },
      {
        title: "AI Engineering",
        items: [
          "Prompt System Design",
          "Context Engineering",
          "Memory Injection",
          "Tool Selection",
          "Cost Control",
          "Latency Optimization"
        ]
      },
      {
        title: "Infrastructure",
        items: [
          "Database Basics",
          "Redis Basics",
          "Queue Basics",
          "Docker Basics",
          "Deployment Basics"
        ]
      }
    ],
    tools: ["OpenAI Codex", "Claude Code", "OpenHands", "Hermes"],
    requirements: [
      "Build a Production Workflow",
      "Use 3 or more tools",
      "Support queue or long running tasks",
      "Add Notification System",
      "Add State Persistence",
      "Add Error Recovery",
      "Add Human Override",
      "Add Monitoring",
      "Write Deployment Guide"
    ],
    rejected: [
      "Local demo only",
      "No Error Recovery",
      "No State",
      "No deployment guide"
    ]
  },
  "level-3": {
    level: "Level 3",
    label: "L3 Architect",
    title: "AI Agent Systems Architect",
    badge: "Certified AI Agent Systems Architect",
    color: "Titan Gold",
    position: "Large scale AI Agent systems architect.",
    identity:
      "Level 3 verifies that a builder can design and operate production multi agent infrastructure with memory, monitoring, security, cost tracking, and benchmark evidence.",
    exam: "Production Multi Agent System",
    pass: "90 points, pass rate below 15%",
    validity: "6 months",
    difficulty: "Advanced",
    scarcity: "Scarce",
    core: "Multi Agent",
    categories: [
      {
        title: "Multi Agent",
        items: [
          "Agent Orchestration",
          "Role Based Agents",
          "Supervisor Agent",
          "Planner Agent",
          "Worker Agent",
          "Distributed Agent Systems"
        ]
      },
      {
        title: "Memory Systems",
        items: [
          "Vector Database",
          "Retrieval Systems",
          "Long Term Memory",
          "Context Persistence",
          "Shared Memory"
        ]
      },
      {
        title: "Infrastructure",
        items: [
          "Microservices",
          "Distributed Queue",
          "Scaling",
          "Monitoring Stack",
          "CI/CD",
          "Production Deployment",
          "Observability"
        ]
      },
      {
        title: "Security And Benchmark",
        items: [
          "Permission Systems",
          "Sandboxing",
          "Secrets Management",
          "Audit Logs",
          "Data Isolation",
          "Performance Evaluation",
          "Reliability Scoring"
        ]
      }
    ],
    tools: ["OpenAI Codex", "Claude Code", "MCP", "LangGraph", "Hermes", "OpenClaw"],
    requirements: [
      "Build a Production Multi Agent System",
      "Use 3 or more Agents",
      "Add Shared Memory",
      "Add Monitoring Dashboard",
      "Add Cost Tracking",
      "Add Security Layer",
      "Add State Recovery",
      "Deploy to Production",
      "Submit Benchmark Report",
      "Submit API Documentation"
    ],
    rejected: [
      "Prompt chain only",
      "No Shared Memory",
      "No Recovery",
      "No Monitoring",
      "No Benchmark",
      "No Security Layer"
    ]
  },
  "level-4": {
    level: "Level 4",
    label: "L4 Company",
    title: "Certified AI Agent Company",
    badge: "Certified AI Agent Company",
    color: "Obsidian Black Gold",
    position: "Enterprise grade AI Agent organization.",
    identity:
      "Level 4 verifies that a company, team, studio, or product organization can operate AI Agent systems with customers, infrastructure, security, documents, uptime, and market proof.",
    exam: "Company Review",
    pass: "Recommended 88 points or above",
    validity: "Quarterly review",
    difficulty: "Enterprise",
    scarcity: "Highly scarce",
    core: "Infrastructure",
    categories: [
      {
        title: "Company Infrastructure",
        items: [
          "Production Infrastructure",
          "SLA",
          "Incident Response",
          "Security Review",
          "Customer Support",
          "API Governance"
        ]
      },
      {
        title: "Team Operations",
        items: [
          "Engineering Management",
          "Deployment Pipeline",
          "Release Process",
          "Quality Control",
          "Documentation Systems"
        ]
      },
      {
        title: "Business Systems",
        items: [
          "Revenue Systems",
          "Sales Systems",
          "Client Delivery",
          "Contracts",
          "Operational Stability"
        ]
      },
      {
        title: "AI Infrastructure",
        items: [
          "Production Agent Stack",
          "Benchmark Systems",
          "Monitoring",
          "Scaling",
          "Multi Agent Operations"
        ]
      }
    ],
    tools: ["OpenAI Codex", "Claude Code", "MCP", "LangGraph", "Hermes", "OpenClaw"],
    requirements: [
      "Submit company website",
      "Submit product demo",
      "Submit company documents",
      "Submit API documentation",
      "Submit customer cases",
      "Submit revenue proof",
      "Submit Benchmark Report",
      "Submit Security documents",
      "Submit Uptime report"
    ],
    rejected: [
      "No real product",
      "No real customers",
      "No team profile",
      "No revenue proof",
      "No security review",
      "No uptime proof"
    ]
  },
  "level-5": {
    level: "Level 5",
    label: "L5 Fellow",
    title: "AIAA Association Fellow",
    badge: "AIAA Association Fellow",
    color: "Platinum White",
    position: "Global AI Agent standards authority.",
    identity:
      "Level 5 recognizes global influence, original contribution, ecosystem leadership, public trust, and the ability to shape AI Agent standards.",
    exam: "Council Review",
    pass: "Council Approval",
    validity: "Annual review",
    difficulty: "World class",
    scarcity: "Extremely scarce",
    core: "Standards",
    categories: [
      {
        title: "Global Systems Thinking",
        items: [
          "AI Governance",
          "Standards Design",
          "Protocol Thinking",
          "Ecosystem Architecture",
          "Public Infrastructure Design"
        ]
      },
      {
        title: "Technical Leadership",
        items: [
          "Advanced Multi Agent Systems",
          "Infrastructure Strategy",
          "Research Direction",
          "Open Source Leadership"
        ]
      },
      {
        title: "Public Influence",
        items: [
          "Global Speaking",
          "Industry Leadership",
          "Cross Organization Coordination",
          "Public Trust Building"
        ]
      },
      {
        title: "Recognition Review",
        items: [
          "Council Review",
          "Fellow Review",
          "Public Reputation Review",
          "Impact Review",
          "Open Source Review"
        ]
      }
    ],
    tools: ["Council Review", "Fellow Review", "Impact Review", "Open Source Review"],
    requirements: [
      "Show global influence",
      "Show open source influence",
      "Show technical originality",
      "Show public trust",
      "Show ecosystem contribution",
      "Show standards capability"
    ],
    rejected: [
      "Technical ability without influence",
      "No public work",
      "No ecosystem contribution",
      "No public trust record",
      "No Council approval"
    ]
  }
} as const;

const levelOrder = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;

export function generateStaticParams() {
  return levelOrder.map((level) => ({ level }));
}

export default async function CertificationLevelPage({
  params
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const data = levels[level as keyof typeof levels];

  if (!data) notFound();

  const currentIndex = levelOrder.indexOf(level as (typeof levelOrder)[number]);
  const previousLevel = currentIndex > 0 ? levelOrder[currentIndex - 1] : null;
  const nextLevel = currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050608] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.24),rgba(6,7,10,0.82)_46%,rgba(6,7,10,1))]" />
        <div className="absolute left-[10%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(91,111,158,0.18),transparent_62%)] blur-[140px]" />
        <div className="absolute right-[8%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(105,95,160,0.16),transparent_64%)] blur-[150px]" />

        <div className="section-shell relative z-10 pb-16 md:pb-24">
          <div className="glass-panel mx-auto max-w-6xl overflow-hidden rounded-[2.8rem] p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.32em] text-white/54">
                  Certification
                </div>
                <h1 className="mt-4 text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-white">
                  {data.level}
                </h1>
                <div className="mt-4 text-[clamp(1.45rem,2.8vw,2.6rem)] font-medium tracking-[-0.05em] text-white/92">
                  {data.title}
                </div>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                  {data.identity}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Label", data.label],
                  ["Badge", data.badge],
                  ["Color", data.color],
                  ["Validity", data.validity]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5">
                    <div className="text-[0.68rem] uppercase tracking-[0.24em] text-white/42">{label}</div>
                    <div className="mt-3 text-lg font-semibold text-white/88">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-16">
        <div className="section-shell">
          <div className="grid gap-5 md:grid-cols-4">
            {[
              ["Difficulty", data.difficulty],
              ["Scarcity", data.scarcity],
              ["Core capability", data.core],
              ["Passing standard", data.pass]
            ].map(([label, value]) => (
              <div key={label} className="glass-panel rounded-[2rem] p-6">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-white/42">{label}</div>
                <div className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-16">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="glass-panel rounded-[2.4rem] p-7 md:p-8">
                <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/45">
                  Position
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-white md:text-4xl">
                  {data.position}
                </h2>
                <p className="mt-5 text-base leading-8 text-white/62">{data.identity}</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {data.categories.map((category) => (
                <div key={category.title} className="glass-panel rounded-[2.2rem] p-6 md:p-7">
                  <h3 className="text-2xl font-semibold tracking-[-0.05em] text-white">
                    {category.title}
                  </h3>
                  <div className="mt-5 grid gap-2">
                    {category.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-full border border-white/8 bg-white/[0.035] px-4 py-2 text-sm text-white/68"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-16">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass-panel rounded-[2.4rem] p-7 md:p-8">
              <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/45">
                Exam
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-white">
                {data.exam}
              </h2>
              <p className="mt-5 text-base leading-8 text-white/62">
                This page defines what applicants must show before entering the public registry and ranking layer.
              </p>
            </div>

            <div className="glass-panel rounded-[2.4rem] p-7 md:p-8 lg:col-span-2">
              <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/45">
                Requirements
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {data.requirements.map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/8 bg-white/[0.035] px-5 py-4 text-white/72">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-16">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel rounded-[2.4rem] p-7 md:p-8">
              <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/45">
                Required tools
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {data.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-white/72">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[2.4rem] p-7 md:p-8">
              <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/45">
                Not accepted
              </div>
              <div className="mt-6 grid gap-3">
                {data.rejected.map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/8 bg-black/20 px-5 py-4 text-white/58">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-24 pt-10 md:pb-32 md:pt-16">
        <div className="section-shell">
          <div className="glass-panel flex flex-col gap-4 rounded-[2.4rem] p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.28em] text-white/45">
                Level navigation
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">
                Review adjacent certification levels
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {previousLevel && (
                <Link href={`/certification/${previousLevel}`} className="pill-button glass-panel">
                  Previous Level
                </Link>
              )}
              {nextLevel && (
                <Link href={`/certification/${nextLevel}`} className="pill-button bg-white text-black">
                  Next Level
                </Link>
              )}
              <Link href="/#standards" className="pill-button glass-panel">
                Back to Levels
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
