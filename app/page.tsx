"use client";

import { useEffect, useMemo, useState } from "react";

type ResultRow = {
  keyword: string;
  title: string;
  url: string;
};

export default function Page() {
  const [keywords, setKeywords] = useState("越南房地產");
  const [count, setCount] = useState(100);
  const [status, setStatus] = useState("尚未連線");
  const [results, setResults] = useState<ResultRow[]>([]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.source !== "aiaa-group-finder") return;
      if (event.data.type === "EXTENSION_READY") setStatus("擴充功能已連線");
      if (event.data.type === "SEARCH_RESULTS") {
        setStatus(event.data.status || "已收到結果");
        setResults(Array.isArray(event.data.results) ? event.data.results : []);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const downloadCsv = () => {
    if (!results.length) return;
    const csv = [
      ["keyword", "title", "url"],
      ...results.map((r) => [r.keyword, r.title, r.url])
    ]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `group-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const keywordList = useMemo(
    () =>
      keywords
        .split(/[\n,，、;；|]+/)
        .map((v) => v.trim())
        .filter(Boolean),
    [keywords]
  );

  const startSearch = async () => {
    setStatus("搜尋中...");
    setResults([]);
    await (window as any).chrome.runtime.sendMessage({
      type: "START_SEARCH",
      keywords,
      count
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-5">
        <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">GROUP FINDER SYSTEM</p>
          <h1 className="text-5xl font-black leading-none tracking-[-0.06em] text-slate-950 md:text-7xl">社團搜尋自動化系統</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            這是給 Chrome 擴充功能控制的正式版：輸入關鍵字、指定要找幾個社團，按搜尋後由擴充功能真的去開 Google 搜尋頁並抓回結果。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">擴充功能控制瀏覽器</span>
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">可指定數量</span>
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">可匯出 CSV</span>
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">狀態：{status}</span>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_auto_auto]">
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="輸入關鍵字，例如：越南房地產, Bất động sản Việt Nam"
              className="min-h-[72px] rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none transition focus:border-blue-400"
            />
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
              className="min-h-[72px] rounded-2xl border border-slate-200 px-5 text-lg outline-none transition focus:border-blue-400"
            />
            <button
              type="button"
              onClick={startSearch}
              className="min-h-[72px] rounded-2xl bg-gradient-to-r from-blue-900 to-violet-600 px-6 text-lg font-bold text-white"
            >
              搜尋
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!results.length}
              className="min-h-[72px] rounded-2xl bg-slate-900 px-6 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              下載 CSV
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["越南房地產", "Bất động sản Việt Nam", "親子", "咖啡", "投資", "攝影", "二手", "旅遊"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setKeywords(item)}
                className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {item}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">可用逗號、空白、換行輸入多個關鍵字。</p>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] text-blue-700">搜尋結果</p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                {results.length ? `找到 ${results.length} 筆結果` : "尚未有結果"}
              </h2>
            </div>
            <div className="text-right text-sm font-semibold text-slate-600">
              {keywordList.length ? `關鍵字：${keywordList.join("、")}` : "等待輸入關鍵字"}
            </div>
          </div>
          <div className="overflow-auto rounded-3xl border border-slate-200">
            <table className="min-w-[920px] w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">關鍵字</th>
                  <th className="px-5 py-4">標題</th>
                  <th className="px-5 py-4">網址</th>
                </tr>
              </thead>
              <tbody>
                {results.length ? (
                  results.map((r, i) => (
                    <tr key={`${r.url}-${i}`} className="border-t border-slate-100 align-top">
                      <td className="px-5 py-5 font-black text-slate-950">{i + 1}</td>
                      <td className="px-5 py-5 text-slate-700">{r.keyword}</td>
                      <td className="px-5 py-5 text-slate-950">{r.title}</td>
                      <td className="px-5 py-5">
                        <a href={r.url} target="_blank" rel="noreferrer" className="break-all text-blue-700 underline">
                          {r.url}
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-16 text-center text-slate-500" colSpan={4}>
                      按下搜尋後，擴充功能會真的去控制瀏覽器搜尋 Google
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}


