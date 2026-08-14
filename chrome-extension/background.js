const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const PAGE_INTERVAL_MS = 12000;
const MAX_PAGE_RETRIES = 2;

function buildQuery(keyword) {
  return `site:facebook.com/groups ${keyword.trim()}`;
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

async function collectLinksFromTab(tabId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const seen = new Set();
      const links = [];
      for (const a of document.querySelectorAll("a[href]")) {
        let href = a.href;
        try {
          const wrapped = new URL(href);
          const target = wrapped.searchParams.get("q") || wrapped.searchParams.get("url");
          if (target?.includes("facebook.com/groups/")) href = target;
        } catch {}
        if (!href.includes("facebook.com/groups/")) continue;
        const match = href.match(/https?:\/\/(?:www\.)?facebook\.com\/groups\/[^/?&#\s]+/i);
        if (!match) continue;
        const clean = match[0].replace("http://", "https://");
        if (seen.has(clean)) continue;
        seen.add(clean);
        links.push({ title: (a.textContent || "").trim(), href: clean });
      }
      return links;
    }
  });
  return result?.result ?? [];
}

async function waitUntilLoaded(tabId) {
  for (let i = 0; i < 100; i++) {
    const current = await chrome.tabs.get(tabId);
    if (current.status === "complete") return current;
    await sleep(200);
  }
  return chrome.tabs.get(tabId);
}

async function navigateAndCollect(tabId, query, start = 0) {
  await chrome.tabs.update(tabId, { url: makeSearchUrl(query, start) });
  const current = await waitUntilLoaded(tabId);
  if (/google\.[^/]+\/sorry\//.test(current.url || "")) {
    await chrome.tabs.update(tabId, { active: true });
    return { captcha: true, links: [] };
  }
  return { captcha: false, links: await collectLinksFromTab(tabId) };
}

async function collectPageWithRetry(tabId, query, start, sourceTabId, pageNumber) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_PAGE_RETRIES; attempt++) {
    try {
      return await navigateAndCollect(tabId, query, start);
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_PAGE_RETRIES) break;
      const waitMs = PAGE_INTERVAL_MS * (attempt + 1);
      await notify(sourceTabId, {
        type: "SEARCH_STATUS",
        status: `第 ${pageNumber} 頁暫時失敗，${waitMs / 1000} 秒後重試（${attempt + 1}/${MAX_PAGE_RETRIES}）`
      });
      await sleep(waitMs);
    }
  }
  throw lastError;
}

async function notify(tabId, message) {
  if (!tabId) return;
  try { await chrome.tabs.sendMessage(tabId, message); } catch {}
}

async function runSearch(keywords, count, sourceTabId) {
  const normalizedKeywords = keywords
    .replace(/\s+(?:或|OR)\s+/gi, "\n")
    .replace(/([\u3400-\u9fff])\s+(?=[A-Za-zÀ-ỹ])/g, "$1\n");
  const tokens = normalizedKeywords.split(/[\n,，、;；|]+/).map((t) => t.trim()).filter(Boolean);
  const queries = (tokens.length ? tokens : [keywords.trim()].filter(Boolean)).map(buildQuery);
  const seen = new Set();
  const results = [];

  for (const query of queries) {
    const searchTab = await chrome.tabs.create({ url: "about:blank", active: false });
    let captcha = false;
    try {
      for (let start = 0, pageNumber = 1; results.length < count && start < 1000; start += 10, pageNumber++) {
        await notify(sourceTabId, { type: "SEARCH_STATUS", status: `正在自動翻第 ${pageNumber} 頁：已找到 ${results.length} / ${count}` });
        const page = await collectPageWithRetry(searchTab.id, query, start, sourceTabId, pageNumber);
        if (page.captcha) {
          captcha = true;
          await chrome.storage.local.set({ lastStatus: "Google 要求真人驗證，搜尋已暫停", lastResults: results });
          await notify(sourceTabId, {
            type: "SEARCH_BLOCKED",
            status: "Google 要求真人驗證：請在新分頁勾選「我不是機器人」，完成後回來重新按開始搜尋。",
            results
          });
          return;
        }
        if (!page.links.length) break;
        for (const link of page.links) {
          if (seen.has(link.href)) continue;
          seen.add(link.href);
          results.push({ keyword: query.replace(/^site:facebook\.com\/groups\s+/, ""), title: link.title || "Facebook 社團", url: link.href });
          if (results.length >= count) break;
        }
        if (results.length < count) {
          await notify(sourceTabId, { type: "SEARCH_STATUS", status: `第 ${pageNumber} 頁完成：已找到 ${results.length} / ${count}，12 秒後翻下一頁` });
          await sleep(PAGE_INTERVAL_MS);
        }
      }
    } finally {
      if (!captcha && searchTab?.id) chrome.tabs.remove(searchTab.id).catch(() => {});
    }
    if (results.length >= count) break;
  }

  await chrome.storage.local.set({
    lastStatus: results.length >= count ? `已抓到設定的 ${results.length} 筆結果` : `Google 已無更多不重複結果，共 ${results.length} 筆`,
    lastResults: results
  });
  await notify(sourceTabId, { type: "SEARCH_RESULTS", results, requested: count, exhausted: results.length < count });
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
