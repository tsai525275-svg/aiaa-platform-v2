"use client";

import { useMemo, useState } from "react";

type GroupItem = {
  name: string;
  platform: string;
  region: string;
  url: string;
  tags: string[];
  members: string;
  desc: string;
};

const seedGroups: GroupItem[] = [
  { name: "台北親子生活交流", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/taipei.parents.life", tags: ["親子", "台北", "育兒"], members: "48K", desc: "親子活動、育兒資訊與家庭生活交流。" },
  { name: "台中二手好物交易", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/taichung.secondhand.market", tags: ["二手", "台中", "交易"], members: "85K", desc: "二手家具、家電、書籍與生活用品交易。" },
  { name: "高雄咖啡烘焙同好會", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/kaohsiung.coffee.roast", tags: ["咖啡", "高雄", "烘焙"], members: "21K", desc: "咖啡豆、手沖、烘焙與店家交流。" },
  { name: "台灣投資理財討論區", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/tw.investment.forum", tags: ["投資", "理財", "股票"], members: "120K", desc: "股票、ETF、資產配置與理財分享。" },
  { name: "台北攝影創作社", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/taipei.photo.creators", tags: ["攝影", "台北", "創作"], members: "37K", desc: "人像、街拍、器材與作品交流。" },
  { name: "台灣寵物交流社", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/tw.pet.community", tags: ["寵物", "狗", "貓"], members: "64K", desc: "毛孩照護、認養、疾病與日常分享。" },
  { name: "健身重訓交流圈", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/fitness.training.club", tags: ["健身", "重訓", "增肌"], members: "92K", desc: "訓練菜單、飲食與健身進度分享。" },
  { name: "台灣旅遊秘境分享", platform: "facebook", region: "tw", url: "https://www.facebook.com/groups/tw.travel.secret", tags: ["旅遊", "秘境", "景點"], members: "58K", desc: "國內旅遊、住宿、景點與行程推薦。" },
  { name: "香港親子玩樂社", platform: "facebook", region: "hk", url: "https://www.facebook.com/groups/hk.parents.fun", tags: ["親子", "香港", "活動"], members: "33K", desc: "香港親子活動、學校資訊與家庭攻略。" },
  { name: "Singapore Food Hunters", platform: "facebook", region: "sea", url: "https://www.facebook.com/groups/singapore.food.hunters", tags: ["美食", "新加坡", "餐廳"], members: "71K", desc: "東南亞美食、餐廳與開箱推薦。" }
];

function tokenize(text: string) {
  return text.toLowerCase().trim().split(/[\s,，、;；/|]+/).filter(Boolean);
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState("all");
  const [region, setRegion] = useState("all");
  const [groups, setGroups] = useState<GroupItem[]>(seedGroups);

  const results = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];

    return groups
      .map((group) => {
        const haystack = [group.name, group.desc, group.url, ...group.tags].join(" ").toLowerCase();
        let score = 0;
        for (const token of tokenize(q)) {
          if (haystack.includes(token)) score += 7;
          if (group.name.toLowerCase().includes(token)) score += 5;
          if (group.desc.toLowerCase().includes(token)) score += 3;
          if (group.tags.some((tag) => tag.toLowerCase().includes(token))) score += 4;
        }
        if (platform !== "all" && group.platform === platform) score += 6;
        if (region !== "all" && group.region === region) score += 6;
        if (group.name.toLowerCase().includes(q)) score += 10;
        if (group.desc.toLowerCase().includes(q)) score += 4;
        score += Math.min(Number(group.members.replace(/[^\d]/g, "")) || 0, 200000) / 30000;
        return { ...group, score };
      })
      .filter((group) => group.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [groups, keyword, platform, region]);

  const downloadCsv = () => {
    const rows = [
      ["排名", "相關度", "社團名稱", "平台", "地區", "網址", "成員數", "標籤", "描述"],
      ...results.map((group, index) => [
        String(index + 1),
        group.score.toFixed(1),
        group.name,
        group.platform,
        group.region,
        group.url,
        group.members,
        group.tags.join(" | "),
        group.desc
      ])
    ];
    const csv = "\ufeff" + rows.map((row) => row.map((cell) => escapeCsv(cell)).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `group-finder-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importJson = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as Partial<GroupItem>[];
    const next = Array.isArray(parsed)
      ? parsed
          .filter((item) => item?.name && item?.url)
          .map((item) => ({
            name: String(item.name),
            platform: String(item.platform ?? "all"),
            region: String(item.region ?? "global"),
            url: String(item.url),
            tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
            members: String(item.members ?? "0"),
            desc: String(item.desc ?? "")
          }))
      : [];
    if (next.length) setGroups((prev) => [...prev, ...next]);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(29,78,216,0.12),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(124,58,237,0.1),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-5">
        <section className="rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.26em] text-blue-600">Group Finder System</p>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
            <div>
              <h1 className="max-w-4xl text-[clamp(2.6rem,6vw,5.6rem)] font-semibold leading-[0.93] tracking-[-0.06em]">
                社團搜尋自動化系統
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                輸入任意關鍵字，自動比對多種社團主題、排序相關結果，並可匯出成 Excel 可直接開啟的 CSV。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["可部署成網站", "支援多主題", "可擴充資料源"].map((item) => (
                  <span key={item} className="rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-blue-900">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5">
              <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">流程</div>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                <li>1. 輸入關鍵字</li>
                <li>2. 自動搜尋與比對</li>
                <li>3. 整理社團網址與資訊</li>
                <li>4. 下載 CSV / Excel</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr]">
          <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
            關鍵字
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="例如：親子、咖啡、投資、台中、攝影、二手" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
            平台
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
              <option value="all">全部平台</option>
              <option value="facebook">Facebook 社團</option>
              <option value="discord">Discord 社群</option>
              <option value="reddit">Reddit Community</option>
              <option value="line">LINE 社群</option>
              <option value="telegram">Telegram 群組</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
            地區
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
              <option value="all">全部地區</option>
              <option value="tw">台灣</option>
              <option value="hk">香港</option>
              <option value="global">國際</option>
              <option value="sea">東南亞</option>
            </select>
          </label>
          <div className="flex items-end gap-3">
            <button onClick={downloadCsv} disabled={!results.length} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
              下載 CSV
            </button>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-wrap gap-2">
            {["親子", "咖啡", "投資", "攝影", "二手", "旅遊", "寵物", "健身"].map((item) => (
              <button key={item} onClick={() => setKeyword(item)} className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm font-bold text-slate-500">{keyword ? `關鍵字「${keyword}」的結果` : "尚未搜尋"}</div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.26em] text-blue-600">搜尋結果</p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                {keyword ? `找到 ${results.length} 筆結果` : "請先輸入關鍵字"}
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">已自動按相關度排序</p>
            </div>
            <div className="text-right text-sm font-bold text-blue-700">{groups.length} 筆資料 · {new Set(groups.map((group) => group.platform)).size} 種平台</div>
          </div>

          <div className="overflow-auto rounded-[18px] border border-slate-200 bg-white">
            <table className="min-w-[980px] w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-[0.78rem] uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-4 py-4">相關度</th>
                  <th className="px-4 py-4">社團名稱</th>
                  <th className="px-4 py-4">平台</th>
                  <th className="px-4 py-4">地區</th>
                  <th className="px-4 py-4">網址</th>
                  <th className="px-4 py-4">標籤</th>
                </tr>
              </thead>
              <tbody>
                {!keyword ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center text-slate-500">
                      輸入關鍵字後按下搜尋
                    </td>
                  </tr>
                ) : results.length ? (
                  results.slice(0, 50).map((group, index) => (
                    <tr key={`${group.url}-${index}`} className="border-t border-slate-100 align-top hover:bg-blue-50/40">
                      <td className="px-4 py-4 font-bold text-blue-700">#{index + 1}<br /><span className="text-xs text-slate-400">{group.score.toFixed(1)}</span></td>
                      <td className="px-4 py-4"><div className="font-semibold">{group.name}</div><div className="mt-1 text-sm leading-6 text-slate-500">{group.desc}</div></td>
                      <td className="px-4 py-4"><span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{group.platform}</span><div className="mt-2 text-sm text-slate-500">{group.members} 成員</div></td>
                      <td className="px-4 py-4 text-sm text-slate-600">{group.region}</td>
                      <td className="px-4 py-4 text-sm"><a href={group.url} target="_blank" rel="noreferrer" className="break-all text-blue-700">{group.url}</a></td>
                      <td className="px-4 py-4">{group.tags.map((tag) => <span key={tag} className="mr-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{tag}</span>)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center text-slate-500">
                      沒有找到符合條件的社團
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 rounded-[24px] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.26em] text-blue-600">資料匯入</p>
            <h3 className="text-2xl font-semibold tracking-[-0.04em]">匯入你自己的社團清單</h3>
            <p className="mt-3 text-slate-600">你可以直接貼 JSON，或上傳 `.json` 檔。系統會把新資料加入搜尋索引。</p>
          </div>
          <div className="grid gap-3">
            <textarea id="jsonInput" className="min-h-[180px] rounded-[18px] border border-slate-200 bg-white p-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder='貼上 JSON 陣列，例如 [{"name":"...","platform":"facebook",...}]' />
            <div className="flex flex-wrap gap-3">
              <input id="fileInput" type="file" accept=".json,application/json" className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" onChange={async (e) => importJson(e.target.files?.[0] ?? null)} />
              <button onClick={() => {
                const el = document.getElementById("jsonInput") as HTMLTextAreaElement | null;
                if (!el?.value.trim()) return;
                try {
                  const parsed = JSON.parse(el.value) as Partial<GroupItem>[];
                  const next = Array.isArray(parsed)
                    ? parsed.filter((item) => item?.name && item?.url).map((item) => ({
                        name: String(item.name),
                        platform: String(item.platform ?? "all"),
                        region: String(item.region ?? "global"),
                        url: String(item.url),
                        tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
                        members: String(item.members ?? "0"),
                        desc: String(item.desc ?? "")
                      }))
                    : [];
                  if (next.length) setGroups((prev) => [...prev, ...next]);
                } catch {}
              }} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold">
                匯入資料
              </button>
              <button onClick={() => setGroups(seedGroups)} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold">
                還原範例
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
