export type OperationsMode = "read-only" | "recommendation-only" | "human-gated";

export type PaperclipAgent = {
  name: string;
  role: string;
  focus: string;
  status: "active" | "ready" | "blocked";
};

export type AutomationMaturity = {
  level: number;
  label: string;
  detail: string;
  active?: boolean;
};

export const operationsModes: OperationsMode[] = ["read-only", "recommendation-only", "human-gated"];

export const blockedProductionActions = [
  "approve",
  "reject",
  "issue certificate",
  "payment mutation",
  "real email send",
  "production mutation"
] as const;

export const paperclipAgents: PaperclipAgent[] = [
  {
    name: "CEO",
    role: "Workflow CEO",
    focus: "Coordinate department briefs, consolidate recommendations, keep write authority blocked.",
    status: "active"
  },
  {
    name: "CTO",
    role: "Technical operations owner",
    focus: "Review architecture boundaries, automation safety, and rollout sequencing.",
    status: "active"
  },
  {
    name: "Certification Reviewer",
    role: "Application analysis",
    focus: "Assess evidence sufficiency and prepare precheck recommendations only.",
    status: "active"
  },
  {
    name: "Codex Engineering Manager",
    role: "Engineering safety gate",
    focus: "Verify build health, dry-run safety, permission boundaries, and clean release discipline.",
    status: "active"
  },
  {
    name: "Exam Reviewer",
    role: "Exam and evidence analysis",
    focus: "Review score, AI assistance disclosure, and practical evidence quality without writing state.",
    status: "active"
  },
  {
    name: "QA and Risk Controller",
    role: "Risk oversight",
    focus: "Track notification backlog, anomaly cases, and blocked-action compliance.",
    status: "active"
  }
];

export const automationMaturityLevels: AutomationMaturity[] = [
  { level: 0, label: "Manual", detail: "Human-only review and coordination." },
  { level: 1, label: "Read-only reporting", detail: "System can inspect state and report operational facts." },
  { level: 2, label: "Recommendation + human decision", detail: "Paperclip and Codex can prepare recommendations, but writes remain human-gated.", active: true },
  { level: 3, label: "Controlled test write", detail: "Safe test-only write paths with explicit approval and verification." },
  { level: 4, label: "Human-approved production write", detail: "Production mutations only after exact human instruction and guardrail verification." },
  { level: 5, label: "Limited autonomous operation", detail: "Strictly bounded automation with audited guardrails and revocation path." }
];

export const operationsHighlights = [
  {
    title: "Workflow mode",
    value: "Read-only + recommendation-only + human-gated",
    copy: "The operations layer can observe, summarize, and recommend. It cannot approve, reject, mutate payment, or issue certificates by itself."
  },
  {
    title: "Current maturity",
    value: "Level 2",
    copy: "AIAA is operating at recommendation + human decision stage. Test-only controlled writes exist separately and do not unlock unrestricted production mutation."
  },
  {
    title: "Write policy",
    value: "Blocked in UI",
    copy: "No production write buttons are exposed here. Dangerous actions are visible only as disabled controls with documentation links."
  }
] as const;

export const operationsDocumentLinks = [
  {
    title: "Automation Workflow 001",
    href: "https://github.com/tsai525275-svg/aiaa-platform-v2/blob/main/docs/operations/aiaa-operations-automation-workflow-001.md",
    copy: "The governing read-only workflow and command-center policy."
  },
  {
    title: "Paperclip 6 Agents Rules",
    href: "https://github.com/tsai525275-svg/aiaa-platform-v2/blob/main/docs/operations/paperclip-6-agents-training-and-workflow-rules-001.md",
    copy: "Role boundaries, recommendation-only responsibilities, and blocked actions."
  },
  {
    title: "Decision Brief 001",
    href: "https://github.com/tsai525275-svg/aiaa-platform-v2/blob/main/docs/operations/pending-application-decision-brief-001.md",
    copy: "Human decision preparation for the current application queue."
  }
] as const;
