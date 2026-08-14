function sendToPage(type, data = {}) {
  window.postMessage({ source: "aiaa-group-finder-extension", type, ...data }, "*");
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data?.source !== "aiaa-group-finder-page") return;
  if (event.data.type === "PING") {
    chrome.storage.local.get("searchCheckpoint").then(({ searchCheckpoint }) => {
      sendToPage("EXTENSION_READY", {
        resumable: Boolean(searchCheckpoint),
        results: searchCheckpoint?.results || []
      });
    });
  }
  if (event.data.type === "START_SEARCH") {
    chrome.runtime.sendMessage({
      type: "START_SEARCH",
      keywords: event.data.keywords,
      count: event.data.count
    });
  }
  if (event.data.type === "PAUSE_SEARCH") chrome.runtime.sendMessage({ type: "PAUSE_SEARCH" });
  if (event.data.type === "RESUME_SEARCH") chrome.runtime.sendMessage({ type: "RESUME_SEARCH" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "SEARCH_STATUS") sendToPage("SEARCH_STATUS", { status: message.status });
  if (message?.type === "SEARCH_RESULTS") sendToPage("SEARCH_RESULTS", { results: message.results, requested: message.requested, exhausted: message.exhausted });
  if (message?.type === "SEARCH_BLOCKED") sendToPage("SEARCH_BLOCKED", { status: message.status, results: message.results });
  if (message?.type === "SEARCH_PAUSED") sendToPage("SEARCH_PAUSED", { status: message.status, results: message.results });
});

sendToPage("EXTENSION_READY");
