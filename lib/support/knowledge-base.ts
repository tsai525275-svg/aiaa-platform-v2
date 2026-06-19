export type SupportAudience = "guest" | "member" | "applicant" | "certified member" | "admin";

export type SupportArticle = {
  slug: string;
  title: string;
  audience: SupportAudience[];
  summary: string;
  tags: string[];
  body: string[];
};

export type SupportSuggestedQuestion = {
  id: string;
  question: string;
  answer: string;
  sources: string[];
  safety: "safe" | "escalate";
};

export const supportArticles: SupportArticle[] = [
  {
    slug: "what-is-aiaa",
    title: "What is AIAA?",
    audience: ["guest", "member", "applicant", "certified member"],
    summary: "AIAA is the AI Agent Identity Authority. It connects certification, records, registry signals, and ranking visibility into a trust layer for the AI Agent economy.",
    tags: ["overview", "aiaa", "identity"],
    body: [
      "AIAA is designed to verify AI Agent capability through evidence, review stages, and public trust signals.",
      "It does not certify memorization. It focuses on engineering judgment, execution quality, reproducible evidence, and operational trust."
    ]
  },
  {
    slug: "levels-1-to-5",
    title: "What is the difference between Level 1 and Level 5?",
    audience: ["guest", "member", "applicant", "certified member"],
    summary: "Level 1 focuses on operator capability, while higher levels increase expectations for engineering depth, architecture, company review, and council-level trust.",
    tags: ["levels", "certification", "study"],
    body: [
      "Level 1 centers on AI Agent operation, practical evidence, and clear execution proof.",
      "Level 2 and Level 3 raise the bar for engineering, architecture, and production readiness.",
      "Level 4 is a company-oriented review path, and Level 5 is council review rather than a normal automated progression."
    ]
  },
  {
    slug: "application-process",
    title: "How do I apply?",
    audience: ["guest", "member", "applicant"],
    summary: "Create a member profile, submit an application with evidence, pass precheck, complete the exam, and then wait for human review decisions.",
    tags: ["apply", "process", "member"],
    body: [
      "Applicants should prepare a GitHub repository, README or evidence summary, and any available demo or video before expecting review readiness.",
      "Application approval, rejection, revision requests, and certificate decisions remain human-gated."
    ]
  },
  {
    slug: "ai-assistance-declaration",
    title: "What is the AI Assistance Declaration?",
    audience: ["member", "applicant", "certified member"],
    summary: "Candidates may use AI tools, but must disclose what AI helped with, what they personally verified, and whether they can explain the final submission.",
    tags: ["ai-assisted", "exam", "policy"],
    body: [
      "AIAA exams are AI assisted. The system does not ban AI tools such as ChatGPT, Claude, Codex, Cursor, or GitHub Copilot.",
      "Candidates must disclose the tools used, what AI helped with, what they personally verified, and confirm they can explain the submission."
    ]
  },
  {
    slug: "payment-and-certificate-boundary",
    title: "How do payment and certificate decisions work?",
    audience: ["member", "applicant", "certified member"],
    summary: "Payment and certificate issuance are not controlled by the public support assistant. They require human decision gates and policy checks.",
    tags: ["payment", "certificate", "safety"],
    body: [
      "The support assistant may explain the payment flow and certificate requirements, but it cannot mark payment as complete or issue a certificate.",
      "Any case that appears ready for payment or certificate issuance must be escalated to a human owner."
    ]
  },
  {
    slug: "community-usage",
    title: "How do I use the community forum safely?",
    audience: ["guest", "member", "applicant", "certified member"],
    summary: "Use the forum for discussion, learning, and public project sharing. Do not share secrets or make fake certification claims.",
    tags: ["community", "rules", "safety"],
    body: [
      "The forum supports public and member-only discussion areas with human moderation.",
      "Do not share API keys, do not impersonate AIAA staff, and do not claim a certification result unless the data is verified."
    ]
  }
];

export const suggestedQuestions: SupportSuggestedQuestion[] = [
  {
    id: "q-1",
    question: "AIAA 是什麼？",
    answer: "AIAA 是 AI Agent Identity Authority，重點是用認證、registry、records 與 public trust signals 建立 AI Agent 的信任層，而不是只看單一 demo。",
    sources: ["what-is-aiaa"],
    safety: "safe"
  },
  {
    id: "q-2",
    question: "Level 1 到 Level 5 有什麼差別？",
    answer: "Level 1 偏重 operator 能力與實作證據；更高等級逐步要求更深的工程、系統設計、公司審查與 council review。Level 4 與 Level 5 不屬於一般自動通過路徑。",
    sources: ["levels-1-to-5"],
    safety: "safe"
  },
  {
    id: "q-3",
    question: "我可以用 AI 工具考試嗎？",
    answer: "可以。AIAA 允許 AI-assisted exam，但你必須完整填寫 AI Assistance Declaration，說明使用哪些工具、AI 幫了什麼、你自己驗證了什麼，並且你必須能解釋提交內容。",
    sources: ["ai-assistance-declaration"],
    safety: "safe"
  },
  {
    id: "q-4",
    question: "你可以幫我直接通過審核嗎？",
    answer: "不可以。AI support 只能提供說明與建議，不能 approve application、reject application、issue certificate，也不能改動 production data。這類問題需要人工審核流程。",
    sources: ["payment-and-certificate-boundary", "application-process"],
    safety: "escalate"
  },
  {
    id: "q-5",
    question: "如果我看起來已經可以付款或發證怎麼辦？",
    answer: "系統可以說明付款與發證條件，但不能代替人類做決策。若案例看起來已達條件，應該升級給人類 owner 進行人工確認。",
    sources: ["payment-and-certificate-boundary"],
    safety: "escalate"
  },
  {
    id: "q-6",
    question: "社群討論區可以做什麼？",
    answer: "你可以在 community 討論認證、Level 1 到 Level 5 學習、AI Agent project showcase、enterprise use cases 與一般問題，但不能分享 API key、不能冒充 AIAA 官方，也不能假冒認證。",
    sources: ["community-usage"],
    safety: "safe"
  }
];

export function matchSuggestedQuestion(input: string) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  return (
    suggestedQuestions.find((item) => normalized.includes(item.question.toLowerCase())) ??
    suggestedQuestions.find((item) =>
      item.question
        .toLowerCase()
        .split(/\s+/)
        .some((token) => token.length > 2 && normalized.includes(token))
    ) ??
    null
  );
}
