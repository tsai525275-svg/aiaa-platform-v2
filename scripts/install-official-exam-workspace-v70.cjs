const fs = require("fs");
const path = require("path");

const root = process.cwd();
const sourceRoot = path.join(__dirname, "..", "patch");
const writes = [
  ["components/aiaa-v61-exam-workspace.tsx", "components/aiaa-v61-exam-workspace.tsx"],
  ["components/aiaa-v61-exam-center.tsx", "components/aiaa-v61-exam-center.tsx"],
  ["app/member/exam/page.tsx", "app/member/exam/page.tsx"],
  ["app/member/exam/[level]/page.tsx", "app/member/exam/[level]/page.tsx"]
];

for (const [src, dest] of writes) {
  const from = path.join(sourceRoot, src);
  const to = path.join(root, dest);
  if (!fs.existsSync(from)) {
    console.error(`Missing patch file: ${from}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`Updated ${dest}`);
}

const report = [
  "AIAA V70 official exam workspace installed.",
  "Level 1 UI: 30 multiple choice questions and 1 practical evidence task.",
  "Level 2 UI: 40 multiple choice questions and 2 production evidence tasks.",
  "Level 3 UI: 50 multiple choice questions, 3 practical tasks, and 1 architecture review.",
  "Level 4 UI: company questionnaire, document evidence, and demo review.",
  "Level 5 UI: Fellow impact review. No normal multiple choice exam.",
  "Visible check: exam pages show AIAA Exam Workspace V70 at the top.",
  "Next: run npm run build, commit, push, and wait for Vercel Ready."
].join("\n");
fs.writeFileSync(path.join(root, "AIAA_PATCH_V70_REPORT.txt"), report, "utf8");
console.log(report);
