const $ = (id) => document.getElementById(id);

const PAGE_SOURCE = "tongbalance-maps-finder-page";
const EXTENSION_SOURCE = "tongbalance-maps-finder-extension";
let rows = [];
let connected = false;
let resumable = false;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function splitKeywords(value) {
  return String(value || "")
    .replace(/\s+(?:OR|或)\s+/gi, "\n")
    .split(/[\n,，、;；|]+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function setConnection(isConnected) {
  connected = isConnected;
  const element = $("maps-connection");
  element.textContent = isConnected ? "● 已連線" : "● 未連線";
  element.className = isConnected
    ? "rounded bg-white/20 px-4 py-2 text-sm font-bold text-white"
    : "rounded bg-red-700/80 px-4 py-2 text-sm font-bold text-white";
}

function setResumable(value) {
  resumable = Boolean(value);
  $("maps-search").textContent = resumable ? "▶ 繼續搜尋" : "開始搜尋";
}

function formatDistance(value) {
  if (value === null || value === undefined || value === "") return "未提供";
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(2)} 公里` : "未提供";
}

function render(items) {
  rows = Array.isArray(items) ? items : [];
  $("maps-export").disabled = rows.length === 0;
  $("maps-body").innerHTML = rows.length
    ? rows.map((row, index) => {
      const url = row.mapsUrl || row.url || "";
      return `<tr>
        <td class="px-4 py-3 text-center font-bold">#${index + 1}</td>
        <td class="px-4 py-3 font-semibold">${escapeHtml(row.name || "未提供")}</td>
        <td class="px-4 py-3">${escapeHtml(row.category || "未提供")}</td>
        <td class="px-4 py-3">${escapeHtml(row.address || "未提供")}</td>
        <td class="px-4 py-3">${escapeHtml(row.phone || "未提供")}</td>
        <td class="px-4 py-3">${escapeHtml(formatDistance(row.distanceKm))}</td>
        <td class="px-4 py-3">${url ? `<a class="break-all text-blue-700 underline" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>` : "未提供"}</td>
        <td class="px-4 py-3">${escapeHtml(row.keyword || "")}</td>
      </tr>`;
    }).join("")
    : '<tr><td colspan="8" class="px-4 py-20 text-center text-slate-400">沒有取得結果</td></tr>';
}

function post(type, payload = {}) {
  window.postMessage({ source: PAGE_SOURCE, type, ...payload }, "*");
}

function ping() {
  post("PING_MAPS");
}

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data?.source !== EXTENSION_SOURCE) return;
  const message = event.data;
  if (message.type === "MAPS_EXTENSION_READY") {
    setConnection(true);
    setResumable(message.resumable);
    if (message.inputs) restoreInputs(message.inputs);
    if (message.results?.length) {
      render(message.results);
      $("maps-title").textContent = message.resumable ? "已恢復上次搜尋進度" : "上次搜尋結果";
    }
    $("maps-status").textContent = message.resumable ? "有尚未完成的搜尋，可按繼續搜尋" : "可以開始搜尋";
  }
  if (message.type === "MAPS_STATUS") {
    $("maps-title").textContent = "搜尋中…";
    $("maps-status").textContent = message.status || "搜尋中…";
    if (message.results) render(message.results);
  }
  if (message.type === "MAPS_BLOCKED") {
    render(message.results || []);
    setResumable(true);
    $("maps-title").textContent = "等待 Google 真人驗證";
    $("maps-status").textContent = message.status || "請完成真人驗證後按繼續搜尋";
  }
  if (message.type === "MAPS_RESULTS") {
    render(message.results || []);
    setResumable(false);
    $("maps-title").textContent = "真實 Google Maps 搜尋結果";
    $("maps-status").textContent = message.exhausted
      ? `Google Maps 已沒有更多符合半徑且不重複的結果：要求 ${message.requested}，實際找到 ${rows.length}`
      : `完成，共找到 ${rows.length} 家店`;
  }
  if (message.type === "MAPS_ERROR") {
    setResumable(Boolean(message.resumable));
    $("maps-title").textContent = "搜尋發生問題";
    $("maps-status").textContent = message.status || "搜尋失敗";
  }
});

function currentInputs() {
  return {
    country: $("maps-country").value.trim(),
    city: $("maps-city").value.trim(),
    district: $("maps-district").value.trim(),
    radiusKm: Math.max(1, Math.min(500, Number($("maps-radius").value) || 30)),
    count: Math.max(1, Math.min(1000, Number($("maps-count").value) || 1)),
    keywords: $("maps-keywords").value.trim()
  };
}

function restoreInputs(inputs) {
  if (!inputs) return;
  $("maps-country").value = inputs.country || "";
  $("maps-city").value = inputs.city || "";
  $("maps-district").value = inputs.district || "";
  $("maps-radius").value = inputs.radiusKm || 30;
  $("maps-count").value = inputs.count || 100;
  $("maps-keywords").value = inputs.keywords || "";
}

$("maps-search").addEventListener("click", () => {
  if (!connected) {
    alert("Google 地圖店家搜尋擴充功能尚未連線，請到 chrome://extensions 重新載入 maps-extension，再重新整理本頁。");
    ping();
    return;
  }
  if (resumable) {
    setResumable(false);
    $("maps-title").textContent = "繼續搜尋中…";
    $("maps-status").textContent = "正從已保存的進度繼續搜尋";
    post("RESUME_MAPS_SEARCH");
    return;
  }
  const inputs = currentInputs();
  if (!inputs.country && !inputs.city && !inputs.district) {
    alert("請至少輸入國家、城市或地區其中一項");
    return;
  }
  const keywords = splitKeywords(inputs.keywords);
  if (!keywords.length) {
    alert("請至少輸入一個店家或行業關鍵字");
    return;
  }
  $("maps-radius").value = inputs.radiusKm;
  $("maps-count").value = inputs.count;
  render([]);
  $("maps-title").textContent = "搜尋中…";
  $("maps-status").textContent = `正在建立 ${keywords.length} 個關鍵字、合計 ${inputs.count} 家的搜尋工作`;
  post("START_MAPS_SEARCH", { inputs });
});

$("maps-reset").addEventListener("click", () => {
  post("RESET_MAPS_SEARCH");
  $("maps-country").value = "越南";
  $("maps-city").value = "";
  $("maps-district").value = "";
  $("maps-radius").value = "30";
  $("maps-count").value = "100";
  $("maps-keywords").value = "";
  rows = [];
  setResumable(false);
  $("maps-export").disabled = true;
  $("maps-title").textContent = "尚未搜尋";
  $("maps-status").textContent = "可以開始搜尋";
  $("maps-body").innerHTML = '<tr><td colspan="8" class="px-4 py-20 text-center text-slate-400">等待搜尋資料</td></tr>';
  $("maps-keywords").focus();
});

$("maps-nav-search").addEventListener("click", () => {
  $("maps-search-panel").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("maps-keywords").focus(), 300);
});
$("maps-nav-results").addEventListener("click", () => $("maps-results-panel").scrollIntoView({ behavior: "smooth" }));
$("maps-nav-excel").addEventListener("click", () => {
  if (!rows.length) $("maps-status").textContent = "目前沒有可匯出的店家結果";
  else $("maps-export").click();
});

$("maps-export").addEventListener("click", async () => {
  if (!rows.length) return;
  if (!window.ExcelJS) {
    alert("Excel 元件載入失敗，請檢查網路後重新整理頁面");
    return;
  }
  const button = $("maps-export");
  const oldText = button.textContent;
  button.disabled = true;
  button.textContent = "製作 Excel 中…";
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "通衡科技 Google 地圖店家搜尋系統";
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("Google地圖店家搜尋結果", { views: [{ state: "frozen", ySplit: 1 }] });
    worksheet.columns = [
      { header: "排名", key: "rank", width: 9 },
      { header: "搜尋關鍵字", key: "keyword", width: 24 },
      { header: "店家名稱", key: "name", width: 36 },
      { header: "店家行業", key: "category", width: 25 },
      { header: "地址", key: "address", width: 52 },
      { header: "電話", key: "phone", width: 22 },
      { header: "距離（公里）", key: "distanceKm", width: 16 },
      { header: "緯度", key: "lat", width: 16 },
      { header: "經度", key: "lng", width: 16 },
      { header: "Google Maps 網址", key: "mapsUrl", width: 60 },
      { header: "資料取得時間", key: "collectedAt", width: 22 }
    ];
    rows.forEach((row, index) => {
      const url = row.mapsUrl || row.url || "";
      worksheet.addRow({
        rank: index + 1,
        keyword: row.keyword || "",
        name: row.name || "未提供",
        category: row.category || "未提供",
        address: row.address || "未提供",
        phone: String(row.phone || "未提供"),
        distanceKm: row.distanceKm !== null && row.distanceKm !== undefined && row.distanceKm !== "" && Number.isFinite(Number(row.distanceKm)) ? Number(row.distanceKm) : "未提供",
        lat: row.lat !== null && row.lat !== undefined && row.lat !== "" && Number.isFinite(Number(row.lat)) ? Number(row.lat) : "未提供",
        lng: row.lng !== null && row.lng !== undefined && row.lng !== "" && Number.isFinite(Number(row.lng)) ? Number(row.lng) : "未提供",
        mapsUrl: url ? { text: url, hyperlink: url } : "未提供",
        collectedAt: row.collectedAt || ""
      });
    });
    worksheet.autoFilter = { from: "A1", to: `K${rows.length + 1}` };
    const header = worksheet.getRow(1);
    header.height = 28;
    header.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF15803D" } };
      cell.font = { name: "Microsoft JhengHei", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      row.height = 38;
      row.eachCell((cell) => {
        cell.font = { name: "Microsoft JhengHei", size: 10, color: { argb: "FF0F172A" } };
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
        if (rowNumber % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
      });
      row.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
      row.getCell(10).font = { name: "Microsoft JhengHei", size: 10, color: { argb: "FF2563EB" }, underline: true };
      row.getCell(6).numFmt = "@";
    });
    worksheet.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `Google地圖店家搜尋結果-${new Date().toISOString().slice(0, 10)}.xlsx`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
  } catch (error) {
    alert(`Excel 產生失敗：${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = oldText;
  }
});

ping();
setTimeout(ping, 1000);
setTimeout(() => {
  if (!connected) setConnection(false);
}, 2400);

