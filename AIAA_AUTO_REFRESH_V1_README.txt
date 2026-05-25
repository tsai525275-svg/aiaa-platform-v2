AIAA auto refresh v1

This package adds a zero cost refresh path.

What it adds
1. Supabase SQL tables for daily snapshots and ranking item profiles.
2. scripts/sync-rankings.mjs for GitHub API refresh and Supabase upsert.
3. GitHub Actions workflow for daily automatic refresh.
4. Item detail pages read Supabase ranking_item_profiles first, then fall back to live GitHub API.
5. package.json adds npm run sync:rankings.

What refreshes automatically
GitHub Stars Ranking: stars, forks, open issues, language, pushed date, updated date, README based summary, capabilities, why ranked.
GitHub Trending Ranking: momentum score, daily snapshot, summary, capabilities.
GitHub Builders Ranking: contributors, avatar, profile URL, contribution count, builder score.
Agent Framework Ranking: GitHub metrics, framework score, summary, scope, why ranked.

What remains manual in v1
AI Agent Product Ranking. It has no public GitHub source yet, so it stays as AIAA review data.
