const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildQuery(keyword) {
  const q = keyword.trim();
  return `site:facebook.com/groups ${q}`;
}

function makeSearchUrl(query, start = 0) {
  const url = new URL("https://www.google.com/search");
  url.searchParams.set("q", query);
  url.searchParams.set("num", "10");
  if (start > 0) url.searchParams.set("start", String(start));
  url.searchParams.set("hl", "zh-TW");
  url.searchParams.set("pws", "0");
  return url.toString();
}

async function openAndCollect(query, start = 0) {
  const tab = await chrome.tabs.create({ url: makeSearchUrl(query, start), active: false });
  try {
    for (let i = 0; i < 40; i++) {
      const current = await chrome.tabs.get(tab.id);
      if (current.status === "complete") break;
      await sleep(250);
    }
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const seen = new Set();
        const links = [];
        for (const a of document.querySelectorAll('a[href]')) {
          const href = a.href;
          if (!href.includes("facebook.com/groups/")) continue;
          const clean = href.split("&")[0];
          if (seen.has(clean)) continue;
          seen.add(clean);
          links.push({
            title: (a.textContent || "").trim(),
            href: clean
          });
        }
        return links;
      }
    });
    return result?.result ?? [];
  } finally {
    if (tab?.id) chrome.tabs.remove(tab.id).catch(() => {});
  }
}

async function runSearch(keywords, count) {
  const tokens = keywords
    .split(/[\n,，、;；|]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const finalTokens = tokens.length ? tokens : [keywords.trim()].filter(Boolean);
  const queries = finalTokens.map(buildQuery);
  const collected = [];
  const seen = new Set();

  for (const query of queries) {
    for (let start = 0; collected.length < count && start < 1000; start += 10) {
      const links = await openAndCollect(query, start);
      if (!links.length) break;
      for (const link of links) {
        if (seen.has(link.href)) continue;
        seen.add(link.href);
        collected.push({
          keyword: query,
          title: link.title || "Google 搜尋結果",
          url: link.href
        });
        if (collected.length >= count) break;
      }
      await sleep(300);
    }
    if (collected.length >= count) break;
  }

  await chrome.storage.local.set({
    lastStatus: `已找到 ${collected.length} 筆 Google 社團結果`,
    lastResults: collected
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "START_SEARCH") {
    chrome.storage.local.set({
      lastStatus: "開始搜尋中..."
    });
    runSearch(message.keywords || "", Number(message.count) || 1);
    return true;
  }
});
