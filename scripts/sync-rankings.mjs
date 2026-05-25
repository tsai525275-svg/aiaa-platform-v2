const repos = [
  "Significant-Gravitas/AutoGPT",
  "langchain-ai/langgraph",
  "crewAIInc/crewAI",
  "All-Hands-AI/OpenHands",
  "browser-use/browser-use",
  "microsoft/autogen",
  "run-llama/llama_index",
  "FlowiseAI/Flowise",
  "microsoft/semantic-kernel",
  "langgenius/dify"
];

const frameworkProfiles = new Map([
  ["langchain-ai/langgraph", { scope: "Agent Orchestration", whyIncluded: "Included because it helps developers build structured AI Agent workflows and orchestration systems." }],
  ["crewAIInc/crewAI", { scope: "Multi Agent Framework", whyIncluded: "Included because it focuses on multi agent collaboration, task delegation, and agent workflow execution." }],
  ["microsoft/autogen", { scope: "Multi Agent Framework", whyIncluded: "Included because it supports multi agent architecture and developer controlled agent systems." }],
  ["microsoft/semantic-kernel", { scope: "Enterprise Agent Framework", whyIncluded: "Included because it supports production agent architecture, tool calling, and enterprise integration." }],
  ["run-llama/llama_index", { scope: "Data Agent Framework", whyIncluded: "Included because retrieval, data access, and tool backed context are core parts of agent systems." }],
  ["FlowiseAI/Flowise", { scope: "Agent Workflow Builder", whyIncluded: "Included because it helps teams build agent workflows through a visual development interface." }],
  ["langgenius/dify", { scope: "Agent App Platform", whyIncluded: "Included because it provides agent application infrastructure and production workflow tooling." }],
  ["browser-use/browser-use", { scope: "Browser Agent Toolkit", whyIncluded: "Included because browser operation is an important agent infrastructure capability." }],
  ["langchain-ai/langchain", { scope: "Agent Tooling Framework", whyIncluded: "Included because it provides foundational tooling used across many agent based systems." }],
  ["Significant-Gravitas/AutoGPT", { scope: "Autonomous Agent Framework", whyIncluded: "Included as an early autonomous agent framework reference with major public ecosystem signal." }]
]);

const frameworkRepos = Array.from(frameworkProfiles.keys());
const snapshotDate = new Date().toISOString().slice(0, 10);
const supabaseUrl = mustEnv("SUPABASE_URL").replace(/\/+$/, "");
const serviceRoleKey = mustEnv("SUPABASE_SERVICE_ROLE_KEY");
const githubToken = process.env.GITHUB_TOKEN;

function mustEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing`);
  return value;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function githubHeaders(userAgent) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": userAgent,
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (githubToken) headers.Authorization = `Bearer ${githubToken}`;
  return headers;
}

async function githubJson(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders("AIAA Auto Refresh V1")
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub ${path} failed with ${response.status}: ${message}`);
  }

  return response.json();
}

async function githubText(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      ...githubHeaders("AIAA Auto Refresh V1"),
      Accept: "application/vnd.github.raw"
    }
  });

  if (!response.ok) return "";
  return response.text();
}

function cleanMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shortText(text, max = 320) {
  const cleaned = cleanMarkdown(text);
  if (!cleaned) return "";
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max).replace(/\s+\S*$/, "").trim()}.`;
}

function makeSummary(repo, readme) {
  const readmeSummary = shortText(readme, 280);
  if (readmeSummary) return readmeSummary;
  if (repo.description) return repo.description;
  return `${repo.name} is a tracked public repository in the AI Agent ecosystem.`;
}

function makeWhatItDoes(repo, readme, scope) {
  const text = cleanMarkdown(readme).toLowerCase();

  if (text.includes("browser")) return `${repo.name} helps agents operate browsers, interact with websites, and execute web based tasks.`;
  if (text.includes("workflow")) return `${repo.name} helps teams design, run, and manage AI Agent workflows.`;
  if (text.includes("multi-agent") || text.includes("multi agent")) return `${repo.name} supports multi agent coordination, role based task execution, and agent collaboration.`;
  if (text.includes("rag") || text.includes("retrieval")) return `${repo.name} supports retrieval, data access, and context infrastructure for AI systems.`;
  if (scope) return `${repo.name} is tracked as ${scope.toLowerCase()} for AI Agent systems.`;
  return repo.description ?? `${repo.name} provides public software infrastructure relevant to AI Agent development.`;
}

function inferCapabilities(repo, scope, readme) {
  const text = `${scope ?? ""} ${repo.description ?? ""} ${readme}`.toLowerCase();
  const capabilities = new Set(["Open source repository", "Public GitHub signal"]);

  if (text.includes("agent")) capabilities.add("AI Agent workflow");
  if (text.includes("tool")) capabilities.add("Tool calling");
  if (text.includes("browser")) capabilities.add("Browser automation");
  if (text.includes("multi-agent") || text.includes("multi agent")) capabilities.add("Multi agent coordination");
  if (text.includes("workflow")) capabilities.add("Workflow orchestration");
  if (text.includes("memory")) capabilities.add("Memory support");
  if (text.includes("rag") || text.includes("retrieval")) capabilities.add("Retrieval and data access");
  if (repo.language) capabilities.add(repo.language);

  return Array.from(capabilities).slice(0, 8);
}

function daysSince(dateText) {
  const then = new Date(dateText).getTime();
  if (!Number.isFinite(then)) return 365;
  return Math.max(0, Math.floor((Date.now() - then) / 86400000));
}

function momentumScore(repo) {
  const pushedDays = daysSince(repo.pushed_at);
  const updatedDays = daysSince(repo.updated_at);
  const recencyScore = Math.max(0, 100 - pushedDays * 3);
  const updateScore = Math.max(0, 60 - updatedDays * 2);
  const starScore = Math.min(100, repo.stargazers_count / 1500);
  const forkScore = Math.min(60, repo.forks_count / 700);
  const issueScore = Math.min(40, repo.open_issues_count / 20);
  return Math.round(recencyScore + updateScore + starScore + forkScore + issueScore);
}

function frameworkScore(repo, contributorSample) {
  const activityDays = daysSince(repo.pushed_at);
  const activityScore = Math.max(0, 120 - activityDays * 2);
  const starScore = Math.min(160, repo.stargazers_count / 800);
  const forkScore = Math.min(90, repo.forks_count / 350);
  const contributorScore = Math.min(80, contributorSample * 4);
  const issueScore = Math.min(50, repo.open_issues_count / 15);
  return Math.round(activityScore + starScore + forkScore + contributorScore + issueScore);
}

async function fetchRepo(fullName, frameworkMeta = null) {
  const repo = await githubJson(`/repos/${fullName}`);
  const readme = await githubText(`/repos/${fullName}/readme`);
  const contributors = await githubJson(`/repos/${fullName}/contributors?per_page=30`).catch(() => []);
  const contributorSample = Array.isArray(contributors) ? contributors.filter((item) => item.type === "User").length : 0;
  const scope = frameworkMeta?.scope ?? "AI Agent Repository";
  const summary = makeSummary(repo, readme);

  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    language: repo.language,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    ownerLogin: repo.owner.login,
    ownerAvatarUrl: repo.owner.avatar_url,
    scope,
    summary,
    whatItDoes: makeWhatItDoes(repo, readme, scope),
    whyIncluded: frameworkMeta?.whyIncluded ?? "Included because AIAA tracks this repository as part of the public AI Agent software ecosystem.",
    capabilities: inferCapabilities(repo, scope, readme),
    contributorSample,
    momentumScore: momentumScore(repo),
    frameworkScore: frameworkScore(repo, contributorSample),
    sourceHash: `${repo.pushed_at}|${repo.updated_at}|${repo.stargazers_count}|${repo.forks_count}|${summary.slice(0, 80)}`,
    raw: repo
  };
}


function normalizeForSupabase(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return rows;

  const keys = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  return rows.map((row) => {
    const normalized = {};
    for (const key of keys) {
      normalized[key] = Object.prototype.hasOwnProperty.call(row, key) ? row[key] : null;
    }
    return normalized;
  });
}

async function upsert(table, onConflict, rows) {
  if (!rows.length) return { table, rows: 0 };

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(normalizeForSupabase(rows))
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${table} upsert failed with ${response.status}: ${message}`);
  }

  return { table, rows: rows.length };
}

function repoSnapshotRow(item, rankingKey, rank, score) {
  return {
    snapshot_date: snapshotDate,
    ranking_key: rankingKey,
    rank: String(rank).padStart(2, "0"),
    repo_id: item.id,
    repo_name: item.name,
    repo_full_name: item.fullName,
    repo_url: item.url,
    owner_login: item.ownerLogin,
    owner_avatar_url: item.ownerAvatarUrl,
    scope: item.scope,
    summary: item.summary,
    why_included: item.whyIncluded,
    stars: item.stars,
    forks: item.forks,
    open_issues: item.openIssues,
    language: item.language,
    pushed_at: item.pushedAt,
    updated_at: item.updatedAt,
    score,
    raw: item.raw
  };
}

function profileRow(item, rankingKey, rank, score) {
  return {
    ranking_key: rankingKey,
    item_slug: slugify(item.name),
    item_type: rankingKey === "agent-frameworks" ? "framework" : "repo",
    name: item.name,
    full_name: item.fullName,
    external_url: item.url,
    avatar_url: item.ownerAvatarUrl,
    rank: String(rank).padStart(2, "0"),
    summary: item.summary,
    what_it_does: item.whatItDoes,
    why_ranked: item.whyIncluded,
    capabilities: item.capabilities,
    best_for: rankingKey === "agent-frameworks" ? "Developers and teams comparing AI Agent frameworks." : "Developers, operators, and researchers tracking public AI Agent software.",
    source_url: item.url,
    source_hash: item.sourceHash,
    stars: item.stars,
    forks: item.forks,
    open_issues: item.openIssues,
    language: item.language,
    pushed_at: item.pushedAt,
    updated_at: item.updatedAt,
    last_refreshed_at: new Date().toISOString(),
    raw: item.raw
  };
}

async function buildRepoRows() {
  const rows = [];
  for (const repo of repos) {
    rows.push(await fetchRepo(repo));
  }
  return rows;
}

async function buildFrameworkRows() {
  const rows = [];
  for (const repo of frameworkRepos) {
    rows.push(await fetchRepo(repo, frameworkProfiles.get(repo)));
  }
  return rows;
}

async function buildBuilderRows() {
  const builderMap = new Map();

  for (const repoFullName of repos) {
    const contributors = await githubJson(`/repos/${repoFullName}/contributors?per_page=30`).catch(() => []);

    if (!Array.isArray(contributors)) continue;

    for (const contributor of contributors) {
      if (!contributor.login || contributor.type !== "User") continue;

      const current = builderMap.get(contributor.login) ?? {
        login: contributor.login,
        avatarUrl: contributor.avatar_url,
        profileUrl: contributor.html_url,
        repoCount: 0,
        totalContributions: 0,
        repositories: []
      };

      if (!current.repositories.includes(repoFullName)) {
        current.repositories.push(repoFullName);
        current.repoCount += 1;
      }

      current.totalContributions += contributor.contributions ?? 0;
      current.builderScore = Math.round(current.repoCount * 120 + current.totalContributions);
      builderMap.set(contributor.login, current);
    }
  }

  return Array.from(builderMap.values())
    .sort((a, b) => b.builderScore - a.builderScore)
    .slice(0, 30)
    .map((item, index) => ({ ...item, rank: String(index + 1).padStart(2, "0") }));
}

function builderSnapshotRow(item) {
  return {
    snapshot_date: snapshotDate,
    rank: item.rank,
    login: item.login,
    avatar_url: item.avatarUrl,
    profile_url: item.profileUrl,
    repo_count: item.repoCount,
    total_contributions: item.totalContributions,
    repositories: item.repositories,
    builder_score: item.builderScore,
    raw: item
  };
}

function builderProfileRow(item) {
  return {
    ranking_key: "github-builders",
    item_slug: slugify(item.login),
    item_type: "builder",
    name: item.login,
    full_name: item.login,
    external_url: item.profileUrl,
    avatar_url: item.avatarUrl,
    rank: item.rank,
    summary: `${item.login} is ranked by public GitHub contribution signals across tracked AI Agent repositories.`,
    what_it_does: `${item.login} contributes to repositories that AIAA tracks in the AI Agent software ecosystem.`,
    why_ranked: "Included because this GitHub account appears in contributor data for tracked AI Agent repositories.",
    capabilities: ["AI Agent repository contribution", "Open source activity", "Public builder signal", "GitHub ecosystem presence"],
    best_for: "Teams looking for public builders active in AI Agent repositories.",
    source_url: item.profileUrl,
    source_hash: `${item.totalContributions}|${item.builderScore}|${item.repositories.join(",")}`,
    last_refreshed_at: new Date().toISOString(),
    raw: item
  };
}

async function main() {
  console.log(`AIAA auto refresh started for ${snapshotDate}`);

  const [repoRows, frameworkRows, builderRows] = await Promise.all([
    buildRepoRows(),
    buildFrameworkRows(),
    buildBuilderRows()
  ]);

  const starRows = repoRows
    .slice()
    .sort((a, b) => b.stars - a.stars)
    .map((item, index) => repoSnapshotRow(item, "github-stars", index + 1, item.stars));

  const trendingRows = repoRows
    .slice()
    .sort((a, b) => b.momentumScore - a.momentumScore)
    .map((item, index) => repoSnapshotRow(item, "github-trending", index + 1, item.momentumScore));

  const frameworkSnapshotRows = frameworkRows
    .slice()
    .sort((a, b) => b.frameworkScore - a.frameworkScore)
    .map((item, index) => repoSnapshotRow(item, "agent-frameworks", index + 1, item.frameworkScore));

  const profileRows = [
    ...repoRows.slice().sort((a, b) => b.stars - a.stars).map((item, index) => profileRow(item, "github-stars", index + 1, item.stars)),
    ...repoRows.slice().sort((a, b) => b.momentumScore - a.momentumScore).map((item, index) => profileRow(item, "github-trending", index + 1, item.momentumScore)),
    ...frameworkRows.slice().sort((a, b) => b.frameworkScore - a.frameworkScore).map((item, index) => profileRow(item, "agent-frameworks", index + 1, item.frameworkScore)),
    ...builderRows.map(builderProfileRow)
  ];

  const writes = await Promise.all([
    upsert("github_repo_daily_snapshots", "snapshot_date,ranking_key,repo_full_name", [...starRows, ...trendingRows, ...frameworkSnapshotRows]),
    upsert("github_builder_daily_snapshots", "snapshot_date,login", builderRows.map(builderSnapshotRow)),
    upsert("ranking_item_profiles", "ranking_key,item_slug", profileRows)
  ]);

  console.log(JSON.stringify({ ok: true, snapshotDate, writes }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
