const $ = (id) => document.getElementById(id);

async function refresh() {
  const { lastStatus = "等待輸入關鍵字", lastResults = [] } = await chrome.storage.local.get(["lastStatus", "lastResults"]);
  $("status").textContent = lastStatus;
  $("output").textContent = JSON.stringify(lastResults.slice(0, 30), null, 2);
}

$("start").addEventListener("click", async () => {
  const keywords = $("keywords").value.trim();
  const count = Math.max(1, Math.min(1000, Number($("count").value) || 1));
  await chrome.runtime.sendMessage({ type: "START_SEARCH", keywords, count });
  await refresh();
});

$("copy").addEventListener("click", async () => {
  const { lastResults = [] } = await chrome.storage.local.get(["lastResults"]);
  await navigator.clipboard.writeText(JSON.stringify(lastResults, null, 2));
});

$("clear").addEventListener("click", async () => {
  await chrome.storage.local.remove(["lastStatus", "lastResults"]);
  await refresh();
});

refresh();
