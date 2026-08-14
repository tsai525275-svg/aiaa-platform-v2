const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildQuery(keyword) {
  return `site:facebook.com/groups ${keyword.trim()}`;
}

function makeSearchUrl(query, start = 0) {
  const url = new URL("https://www.google.com/search");
  url.searchParams.set("q", query);
  url.searchParams.set("num", "100");
  if (start > 0) url.searchParams.set("start", String(start));
  url.searchParams.set("hl", "zh-TW");
  url.searchParams.set("pws", "0");
  return url.toString();
}

async function collectLinksFromTab(tabId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const seen = new Set();
      const links = [];
      for (const a of document.querySelectorAll("a[href]")) {
        const href = a.href;
        if (!href.includes("facebook.com/groups/")) continue;
        const clean = href.split("&")[0];
        if (seen.has(clean)) continue;
        seen.add(clean);
        links.push({ title: (a.textContent || "").trim(), href: clean });
      }
      return links;
    }
  });
  return result?.result ?? [];
}

async function openAndCollect(query, start = 0) {
  const tab = await chrome.tabs.create({ url: makeSearchUrl(query, start), active: false });
  let keepOpen = false;
  try {
    for (let i = 0; i < 50; i++) {
      const current = await chrome.tabs.get(tab.id);
      if (current.status === "complete") break;
      await sleep(200);
    }
    const current = await chrome.tabs.get(tab.id);
    if (/google\.[^/]+\/sorry\//.test(current.url || "")) {
      keepOpen = true;
      await chrome.tabs.update(tab.id, { active: true });
      return { captcha: true, links: [] };
    }
    return { captcha: false, links: await collectLinksFromTab(tab.id) };
  } finally {
    if (tab?.id && !keepOpen) chrome.tabs.remove(tab.id).catch(() => {});
  }
}

async function notify(tabId, message) {
  if (!tabId) return;
  try { await chrome.tabs.sendMessage(tabId, message); } catch {}
}

async function runSearch(keywords, count, sourceTabId) {
  const tokens = keywords.split(/[\n,，、;；|]+/).map((t) => t.trim()).filter(Boolean);
  const queries = (tokens.length ? tokens : [keywords.trim()].filter(Boolean)).map(buildQuery);
  const seen = new Set();
  const results = [];

  for (const query of queries) {
    for (let start = 0; results.length < count && start < 1000; start += 100) {
      await notify(sourceTabId, { type: "SEARCH_STATUS", status: `正在 Google 搜尋：已找到 ${results.length} / ${count}` });
      const page = await openAndCollect(query, start);
      if (page.captcha) {
        await chrome.storage.local.set({ lastStatus: "Google 要求真人驗證，搜尋已暫停", lastResults: results });
        await notify(sourceTabId, {
          type: "SEARCH_BLOCKED",
          status: "Google 要求真人驗證：請在新分頁勾選「我不是機器人」，完成後回來重新按開始搜尋。",
          results
        });
        return;
      }
      const links = page.links;
      if (!links.length) break;
      for (const link of links) {
        if (seen.has(link.href)) continue;
        seen.add(link.href);
        results.push({
          keyword: query,
          title: link.title || "Google 搜尋結果",
          url: link.href
        });
        if (results.length >= count) break;
      }
      await sleep(2500 + Math.floor(Math.random() * 2000));
    }
    if (results.length >= count) break;
  }

  await chrome.storage.local.set({
    lastStatus: `已抓到 ${results.length} 筆結果`,
    lastResults: results
  });
  await notify(sourceTabId, { type: "SEARCH_RESULTS", results });
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "START_SEARCH") {
    chrome.storage.local.set({ lastStatus: "開始搜尋中..." });
    runSearch(message.keywords || "", Math.min(1000, Number(message.count) || 1), sender.tab?.id).catch(async (error) => {
      await notify(sender.tab?.id, { type: "SEARCH_STATUS", status: `搜尋失敗：${error.message}` });
    });
    return true;
  }
});
