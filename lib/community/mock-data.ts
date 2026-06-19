export type CommunityRole = "guest" | "registered user" | "applicant" | "certified member" | "moderator" | "admin";

export type CommunityCategory = {
  slug: string;
  name: string;
  description: string;
  visibility: "public" | "member-only";
  postingPolicy: string;
  moderators: string[];
  postCount: number;
  lastActive: string;
};

export type CommunityComment = {
  id: string;
  author: string;
  role: CommunityRole;
  postedAt: string;
  body: string;
  moderationStatus: "visible" | "flagged";
};

export type CommunityPost = {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  role: CommunityRole;
  postedAt: string;
  status: "active" | "pinned" | "review-only";
  tags: string[];
  replies: number;
  views: number;
  reportCount: number;
  certifiedBadge?: string;
  links?: Array<{ label: string; href: string }>;
  comments: CommunityComment[];
};

export const communityRules = [
  "Do not share API keys, credentials, or private tokens.",
  "Do not impersonate AIAA staff or make fake certification claims.",
  "Do not harass, spam, or post malicious code.",
  "Reported content enters moderation review; no automatic deletion or banning in this MVP.",
  "Production write moderation remains human-approved."
] as const;

export const communityRoles: Array<{ role: CommunityRole; label: string; capabilities: string[] }> = [
  { role: "guest", label: "Guest", capabilities: ["Read public categories", "Search public discussions"] },
  { role: "registered user", label: "Registered User", capabilities: ["Create post UI", "Reply UI", "Report content"] },
  { role: "applicant", label: "Applicant", capabilities: ["Discuss certification preparation", "Share project progress"] },
  { role: "certified member", label: "Certified Member", capabilities: ["Showcase approved work", "Answer community questions"] },
  { role: "moderator", label: "Moderator", capabilities: ["Review reports", "Issue moderation notices"] },
  { role: "admin", label: "Admin", capabilities: ["Audit moderation actions", "Own policy visibility"] }
];

export const communityCategories: CommunityCategory[] = [
  {
    slug: "announcements",
    name: "Announcements",
    description: "Official AIAA announcements, release notes, and policy notices.",
    visibility: "public",
    postingPolicy: "Admin / moderator posts only. Replies may be limited per notice.",
    moderators: ["CEO", "CTO"],
    postCount: 2,
    lastActive: "2 hours ago"
  },
  {
    slug: "certification-qa",
    name: "Certification Q&A",
    description: "Questions about certification flow, evidence sufficiency, and policy interpretation.",
    visibility: "public",
    postingPolicy: "Registered members, applicants, and moderators can open topics.",
    moderators: ["Certification Reviewer"],
    postCount: 4,
    lastActive: "18 minutes ago"
  },
  {
    slug: "level-1-study",
    name: "Level 1 Study",
    description: "Study notes, common mistakes, and evidence preparation for Level 1.",
    visibility: "public",
    postingPolicy: "Applicants and members can post. Replies are recommendation-only.",
    moderators: ["Exam Reviewer"],
    postCount: 6,
    lastActive: "11 minutes ago"
  },
  {
    slug: "level-2-study",
    name: "Level 2 Study",
    description: "Advanced practical evidence, debugging depth, and architecture discussion.",
    visibility: "member-only",
    postingPolicy: "Members only. Public visitors can see the category label but not the thread list.",
    moderators: ["Exam Reviewer"],
    postCount: 2,
    lastActive: "3 hours ago"
  },
  {
    slug: "level-3-study",
    name: "Level 3 Study",
    description: "Systems architecture and production readiness discussion.",
    visibility: "member-only",
    postingPolicy: "Members only. Human moderation remains required for risky claims.",
    moderators: ["CTO"],
    postCount: 1,
    lastActive: "1 day ago"
  },
  {
    slug: "project-showcase",
    name: "AI Agent Project Showcase",
    description: "Share public agent demos, GitHub repos, and lessons learned.",
    visibility: "public",
    postingPolicy: "Registered users may share public projects. Fake certification claims are prohibited.",
    moderators: ["Certification Reviewer", "QA and Risk Controller"],
    postCount: 3,
    lastActive: "27 minutes ago"
  },
  {
    slug: "enterprise-use-cases",
    name: "Enterprise Use Cases",
    description: "Operational deployment discussion for enterprise teams and system builders.",
    visibility: "member-only",
    postingPolicy: "Members only until human decision expands access.",
    moderators: ["CTO", "QA and Risk Controller"],
    postCount: 2,
    lastActive: "5 hours ago"
  },
  {
    slug: "general-discussion",
    name: "General Discussion",
    description: "Cross-topic AIAA community discussion that does not fit a narrower category.",
    visibility: "public",
    postingPolicy: "Registered users and applicants may post.",
    moderators: ["CEO"],
    postCount: 5,
    lastActive: "9 minutes ago"
  }
];

export const communityPosts: CommunityPost[] = [
  {
    slug: "welcome-to-aiaa-community-mvp",
    categorySlug: "announcements",
    title: "Welcome to the AIAA community MVP",
    excerpt: "This area is live as a read-safe MVP. Posting, replying, and reporting are UI-ready while moderation remains human-gated.",
    body: [
      "The AIAA community forum MVP is designed to support transparent discussion around certification, evidence quality, and AI Agent project building.",
      "This release is intentionally safe: no automatic moderation, no production write loop, and no fake certification display. Human review remains required for any moderation decision."
    ],
    author: "AIAA Operations",
    role: "admin",
    postedAt: "Today, 08:10",
    status: "pinned",
    tags: ["announcement", "mvp", "policy"],
    replies: 3,
    views: 184,
    reportCount: 0,
    comments: [
      {
        id: "c-announce-1",
        author: "Workflow CEO",
        role: "moderator",
        postedAt: "Today, 08:24",
        body: "Reminder: recommendations are visible, but all sensitive actions remain blocked until human approval.",
        moderationStatus: "visible"
      }
    ]
  },
  {
    slug: "what-counts-as-level-1-practical-evidence",
    categorySlug: "certification-qa",
    title: "What counts as Level 1 practical evidence?",
    excerpt: "A concise checklist for demo, README, repo, and AI Assistance Declaration coverage.",
    body: [
      "For Level 1, practical evidence should show an actual working AI Agent workflow rather than prompt-only screenshots.",
      "The strongest submissions usually include a GitHub repository, a clear README, reproducible execution steps, evidence summary, and a short demo or video."
    ],
    author: "Ops Applicant",
    role: "applicant",
    postedAt: "Today, 10:15",
    status: "active",
    tags: ["level-1", "evidence", "faq"],
    replies: 5,
    views: 92,
    reportCount: 0,
    links: [
      { label: "Certification process", href: "/certification/process" },
      { label: "Level 1 page", href: "/certification/level-1" }
    ],
    comments: [
      {
        id: "c-evidence-1",
        author: "Exam Reviewer Desk",
        role: "moderator",
        postedAt: "Today, 10:32",
        body: "If the submission is demo-only or missing reproducible evidence, it should not be treated as review-ready.",
        moderationStatus: "visible"
      },
      {
        id: "c-evidence-2",
        author: "Certified Builder Lin",
        role: "certified member",
        postedAt: "Today, 10:44",
        body: "A short execution log and a note about what AI helped with made my submission much easier to review.",
        moderationStatus: "visible"
      }
    ]
  },
  {
    slug: "share-your-level-1-debugging-habits",
    categorySlug: "level-1-study",
    title: "Share your Level 1 debugging habits",
    excerpt: "Members are comparing how they show retry logic, failure handling, and test evidence without over-claiming automation.",
    body: [
      "Debugging evidence is part of trust. Teams should show how they verified outputs, handled errors, and confirmed that the AI-assisted workflow actually ran.",
      "The goal is not memorization. The goal is engineering judgment, execution quality, and reproducible evidence."
    ],
    author: "Build Journal",
    role: "registered user",
    postedAt: "Today, 11:05",
    status: "active",
    tags: ["study", "debugging", "ai-assisted"],
    replies: 7,
    views: 133,
    reportCount: 1,
    comments: [
      {
        id: "c-study-1",
        author: "QA Risk Desk",
        role: "moderator",
        postedAt: "Today, 11:18",
        body: "One reply in this thread was reported and is under moderation review. The thread remains visible while human review is pending.",
        moderationStatus: "flagged"
      }
    ]
  },
  {
    slug: "public-agent-showcase-onboarding",
    categorySlug: "project-showcase",
    title: "Public agent showcase onboarding",
    excerpt: "How to share a public project without implying an unverified certification result.",
    body: [
      "Project showcase posts are encouraged, but they must separate public project quality from AIAA certification status.",
      "Only verified data may claim a passed level. Everything else should be framed as a public build log, demo, or discussion post."
    ],
    author: "Community Desk",
    role: "moderator",
    postedAt: "Yesterday, 16:40",
    status: "review-only",
    tags: ["showcase", "policy", "trust"],
    replies: 2,
    views: 74,
    reportCount: 0,
    comments: []
  }
];

export function getCategoryBySlug(slug: string) {
  return communityCategories.find((category) => category.slug === slug) ?? null;
}

export function getPostBySlug(slug: string) {
  return communityPosts.find((post) => post.slug === slug) ?? null;
}

export function getPostsByCategory(slug: string) {
  return communityPosts.filter((post) => post.categorySlug === slug);
}
