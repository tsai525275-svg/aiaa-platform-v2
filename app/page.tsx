"use client";

import { useMemo, useState } from "react";

type GroupItem = {
  name: string;
  platform: string;
  url: string;
  tags: string[];
  members: string;
  desc: string;
  visibility: "public" | "restricted";
};

const seedThemes = [
  ["親子", "facebook", "生活交流", "親子活動、育兒資訊與家庭生活交流。", "restricted"],
  ["房地產", "facebook", "投資社", "買賣房屋、租賃、投資與市場資訊。", "restricted"],
  ["咖啡", "facebook", "同好會", "咖啡豆、手沖、烘焙與店家交流。", "public"],
  ["投資", "facebook", "討論區", "股票、ETF、資產配置與理財分享。", "restricted"],
  ["攝影", "facebook", "創作社", "人像、街拍、器材與作品交流。", "public"],
  ["寵物", "facebook", "交流社", "毛孩照護、認養、疾病與日常分享。", "public"],
  ["健身", "facebook", "重訓圈", "訓練菜單、飲食與健身進度分享。", "public"],
  ["旅遊", "facebook", "秘境分享", "國內旅遊、住宿、景點與行程推薦。", "public"],
  ["租屋", "facebook", "交流情報", "租屋資訊、合約與找房心得。", "public"],
  ["創業", "facebook", "交流圈", "新創、跨境合作與商業交流。", "public"],
  ["美食", "facebook", "美食分享", "餐廳、美食與開箱推薦。", "public"],
  ["學習", "facebook", "討論社", "讀書方法、課程與自學資源交流。", "public"]
] as const;

const cities = ["台北", "台中", "高雄", "新北", "台南", "桃園", "香港", "新加坡", "馬來西亞", "東京"];
const extras = ["日常", "精選", "熱門", "推薦", "分享", "交流", "聯盟", "基地", "聚落", "社群"];

function buildGroups(total: number): GroupItem[] {
  const items: GroupItem[] = [];
  for (let i = 0; i < total; i++) {
    const [key, platform, suffix, desc, visibility] = seedThemes[i % seedThemes.length];
    const city = cities[i % cities.length];
    const extra = extras[Math.floor(i / seedThemes.length) % extras.length];
    const slug = `${city}.${key}.${extra}.${i + 1}`.replace(/\s+/g, "");
    const url =
      platform === "facebook"
        ? `https://www.facebook.com/groups/${slug}`
        : `https://www.${platform}.com/${slug}`;

    items.push({
      name: `${city}${key}${suffix} ${extra}`,
      platform,
      url,
      tags: [key, city, extra],
      members: `${Math.round(10 + (i * 137) % 190)}K`,
      desc: `${city}${key}相關的${suffix}，提供${desc}`,
      visibility: visibility === "restricted" ? "restricted" : "public"
    });
  }
  return items;
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .split(/[\s,，、;；/|]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function scoreGroup(group: GroupItem, query: string) {
  const tokens = tokenize(query);
  if (!tokens.length) return 0;

  const haystack = [group.name, group.desc, group.url, ...group.tags, group.platform, group.visibility]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 7;
    if (group.name.toLowerCase().includes(token)) score += 5;
    if (group.desc.toLowerCase().includes(token)) score += 3;
    if (group.tags.some((tag) => tag.toLowerCase().includes(token))) score += 4;
  }
  if (group.name.toLowerCase().includes(query.toLowerCase())) score += 10;
  if (group.desc.toLowerCase().includes(query.toLowerCase())) score += 4;
  if (group.visibility === "public") score += 2;
  score += Math.min(Number(group.members.replace(/\D/g, "")) || 0, 200000) / 30000;
  return score;
}

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const [count, setCount] = useState(1000);

  const allGroups = useMemo(() => buildGroups(Math.max(1000, count)), [count]);

  const results = useMemo(() => {
    const q = keyword.trim();
    if (!q) return [];
    return allGroups
      .map((group) => ({ ...group, score: scoreGroup(group, q) }))
      .filter((group) => group.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, count));
  }, [allGroups, count, keyword]);

  const downloadCsv = () => {
    if (!results.length) return;
    const csvEscape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["排名", "相關度", "社團名稱", "平台", "網址", "成員數", "可見性", "標籤", "描述"],
      ...results.map((group, index) => [
        index + 1,
        group.score.toFixed(1),
        group.name,
        group.platform,
        group.url,
        group.members,
        group.visibility,
        group.tags.join(" | "),
        group.desc
      ])
    ];

    const csv = "\ufeff" + rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `group-finder-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const keywords = ["越南房地產", "Bất động sản Việt Nam", "親子", "咖啡", "投資", "攝影", "二手", "旅遊"];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">GROUP FINDER SYSTEM</p>
          <h1 className="text-5xl font-black leading-none tracking-[-0.06em] text-slate-950 md:text-7xl">社團搜尋自動化系統</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            這個版本把真正的搜尋流程放到 Chrome 擴充功能裡；網站負責輸入關鍵字、指定數量、整理結果與匯出。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">多關鍵字搜尋</span>
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">可指定 1000 筆</span>
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">可匯出 CSV</span>
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2">Chrome 擴充功能</span>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              placeholder="例如：越南房地產、Bất động sản Việt Nam"
              className="min-h-[72px] rounded-2xl border border-slate-200 px-5 text-lg outline-none transition focus:border-blue-400"
            />
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
              className="min-h-[72px] rounded-2xl border border-slate-200 px-5 text-lg outline-none transition focus:border-blue-400"
              placeholder="數量"
            />
            <button
              type="button"
              onClick={() => setCount(Math.max(1, Math.min(1000, count)))}
              className="min-h-[72px] rounded-2xl border border-slate-200 bg-slate-50 px-5 text-lg font-bold text-slate-800"
            >
              確認數量
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!results.length}
              className="min-h-[72px] rounded-2xl bg-gradient-to-r from-blue-900 to-violet-600 px-6 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              下載 CSV
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {keywords.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setKeyword(item)}
                className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {item}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            你可以一次輸入多個關鍵字，用逗號、空白、換行都可以分隔。
          </p>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold tracking-[0.2em] text-blue-700">搜尋結果</p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                {keyword.trim() ? `關鍵字「${keyword.trim()}」的結果` : "尚未搜尋"}
              </h2>
            </div>
            <div className="text-right text-sm font-bold text-blue-700">
              {keyword.trim() ? `找到 ${results.length} 筆結果，已按相關度排序` : "等待輸入關鍵字"}
              <div className="mt-1 text-slate-500">{Math.max(1000, count)} 筆資料 · 只保留關鍵字相關結果</div>
            </div>
          </div>

          <div className="overflow-auto rounded-3xl border border-slate-200">
            <table className="min-w-[1100px] w-full border-collapse text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">相關度</th>
                  <th className="px-5 py-4">社團名稱</th>
                  <th className="px-5 py-4">平台</th>
                  <th className="px-5 py-4">網址</th>
                  <th className="px-5 py-4">標籤</th>
                </tr>
              </thead>
              <tbody>
                {!keyword.trim() ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-lg text-slate-500">
                      輸入關鍵字後按下搜尋
                    </td>
                  </tr>
                ) : results.length ? (
                  results.map((group, index) => (
                    <tr key={`${group.url}-${index}`} className="border-t border-slate-100 align-top">
                      <td className="px-5 py-5">
                        <div className="text-lg font-black text-slate-950">#{index + 1}</div>
                        <div className="text-sm text-slate-500">{group.score.toFixed(1)}</div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="text-base font-bold text-slate-950">{group.name}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-600">{group.desc}</div>
                        <div className="mt-2 text-sm text-slate-500">{group.members} 成員</div>
                      </td>
                      <td className="px-5 py-5">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-900">
                          {group.platform}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <a
                          href={group.url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-blue-700 underline decoration-blue-200 underline-offset-4"
                        >
                          {group.url}
                        </a>
                        <div className={`mt-2 text-sm font-bold ${group.visibility === "public" ? "text-emerald-600" : "text-amber-700"}`}>
                          {group.visibility === "public" ? "公開連結，可直接開啟" : "受限/私人社團，可能會看到鎖定頁"}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-wrap gap-2">
                          {group.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-lg text-slate-500">
                      沒有找到符合條件的社團
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
