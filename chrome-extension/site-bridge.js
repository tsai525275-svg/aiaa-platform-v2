function sendToPage(type, data = {}) {
  window.postMessage({ source: "aiaa-group-finder-extension", type, ...data }, "*");
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data?.source !== "aiaa-group-finder-page") return;
  if (event.data.type === "PING") sendToPage("EXTENSION_READY");
  if (event.data.type === "START_SEARCH") {
    chrome.runtime.sendMessage({
      type: "START_SEARCH",
      keywords: event.data.keywords,
      count: event.data.count
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "SEARCH_STATUS") sendToPage("SEARCH_STATUS", { status: message.status });
  if (message?.type === "SEARCH_RESULTS") sendToPage("SEARCH_RESULTS", { results: message.results, requested: message.requested, exhausted: message.exhausted });
  if (message?.type === "SEARCH_BLOCKED") sendToPage("SEARCH_BLOCKED", { status: message.status, results: message.results });
});

sendToPage("EXTENSION_READY");
