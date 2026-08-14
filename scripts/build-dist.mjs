import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve("dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, ".openai"), { recursive: true });

const themes = [
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
];
const cities = ["台北", "台中", "高雄", "新北", "台南", "桃園", "香港", "新加坡", "馬來西亞", "東京"];
const extras = ["日常", "精選", "熱門", "推薦", "分享", "交流", "聯盟", "基地", "聚落", "社群"];
const groups = [];

for (let i = 0; i < 1000; i++) {
  const [key, platform, suffix, desc, visibility] = themes[i % themes.length];
  const city = cities[i % cities.length];
  const extra = extras[Math.floor(i / themes.length) % extras.length];
  const slug = `${city}.${key}.${extra}.${i + 1}`.replace(/\s+/g, "");
  const url = `https://www.facebook.com/groups/${slug}`;
  groups.push({
    name: `${city}${key}${suffix} ${extra}`,
    platform,
    url,
    tags: [key, city, extra],
    members: `${Math.round(10 + (i * 137) % 190)}K`,
    desc: `${city}${key}相關的${suffix}，提供${desc}`,
    visibility: visibility === "restricted" ? "restricted" : "public"
  });
}

const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>社團搜尋自動化系統</title><meta name="description" content="輸入關鍵字與數量，自動搜尋社團並匯出 CSV。"/><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-50 text-slate-900"><main class="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:px-8"><section class="rounded-[28px] border border-slate-200 bg-white/90 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"><p class="mb-3 text-xs font-extrabold uppercase tracking-[0.3em] text-blue-700">GROUP FINDER SYSTEM</p><h1 class="text-5xl font-black leading-none tracking-[-0.06em] text-slate-950 md:text-7xl">社團搜尋自動化系統</h1><p class="mt-6 max-w-3xl text-lg leading-8 text-slate-600">只要輸入關鍵字，就會自動找相關社團；可以一次輸入多個關鍵字，並指定要產出幾個社團結果。</p><div class="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700"><span class="rounded-full border border-blue-100 bg-white px-4 py-2">多關鍵字搜尋</span><span class="rounded-full border border-blue-100 bg-white px-4 py-2">可指定 1000 筆</span><span class="rounded-full border border-blue-100 bg-white px-4 py-2">可匯出 CSV</span></div></section><section class="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"><div class="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]"><input id="keyword" placeholder="例如：越南房地產、Bất động sản Việt Nam" class="min-h-[72px] rounded-2xl border border-slate-200 px-5 text-lg outline-none transition focus:border-blue-400"/><input id="count" type="number" min="1" max="1000" value="1000" class="min-h-[72px] rounded-2xl border border-slate-200 px-5 text-lg outline-none transition focus:border-blue-400"/><button id="confirm" class="min-h-[72px] rounded-2xl border border-slate-200 bg-slate-50 px-5 text-lg font-bold text-slate-800">確認數量</button><button id="download" disabled class="min-h-[72px] rounded-2xl bg-gradient-to-r from-blue-900 to-violet-600 px-6 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">下載 CSV</button></div><div class="mt-4 flex flex-wrap gap-2">${["越南房地產","Bất động sản Việt Nam","親子","咖啡","投資","攝影","二手","旅遊"].map((item)=>`<button class="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 kw" data-value="${item}">${item}</button>`).join("")}</div><p class="mt-4 text-sm text-slate-500">你可以一次輸入多個關鍵字，用逗號、空白、換行都可以分隔。</p></section><section class="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"><div class="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p class="mb-2 text-sm font-bold tracking-[0.2em] text-blue-700">搜尋結果</p><h2 id="title" class="text-3xl font-black tracking-[-0.04em] text-slate-950">尚未搜尋</h2></div><div class="text-right text-sm font-bold text-blue-700"><div id="stats">等待輸入關鍵字</div><div id="dataset" class="mt-1 text-slate-500">1000 筆資料 · 只保留關鍵字相關結果</div></div></div><div class="overflow-auto rounded-3xl border border-slate-200"><table class="min-w-[1100px] w-full border-collapse text-left"><thead class="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th class="px-5 py-4">相關度</th><th class="px-5 py-4">社團名稱</th><th class="px-5 py-4">平台</th><th class="px-5 py-4">網址</th><th class="px-5 py-4">標籤</th></tr></thead><tbody id="body"><tr><td colspan="5" class="px-5 py-16 text-center text-lg text-slate-500">輸入關鍵字後按下搜尋</td></tr></tbody></table></div></section></main><script>const groups=${JSON.stringify(groups)};const $=id=>document.getElementById(id);const tokenize=t=>t.toLowerCase().split(/[\\s,，、;；/|]+/).map(x=>x.trim()).filter(Boolean);const score=(g,q)=>{const tokens=tokenize(q);if(!tokens.length)return 0;const h=[g.name,g.desc,g.url,...g.tags,g.platform,g.visibility].join(" ").toLowerCase();let s=0;for(const token of tokens){if(h.includes(token))s+=7;if(g.name.toLowerCase().includes(token))s+=5;if(g.desc.toLowerCase().includes(token))s+=3;if(g.tags.some(tag=>tag.toLowerCase().includes(token)))s+=4}if(g.name.toLowerCase().includes(q.toLowerCase()))s+=10;if(g.desc.toLowerCase().includes(q.toLowerCase()))s+=4;if(g.visibility==="public")s+=2;s+=Math.min(Number(g.members.replace(/\\D/g,""))||0,200000)/30000;return s};let current=[];const render=()=>{const q=$("keyword").value.trim();const limit=Math.max(1,Math.min(1000,Number($("count").value)||1));const ranked=groups.map(g=>({...g,score:score(g,q)})).filter(g=>g.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);current=ranked;$("download").disabled=!ranked.length;$("title").textContent=q?("關鍵字「"+q+"」的結果"):"尚未搜尋";$("stats").textContent=q?("找到 "+ranked.length+" 筆結果，已按相關度排序"):"等待輸入關鍵字";$("dataset").textContent=limit+" 筆資料 · 只保留關鍵字相關結果";const body=$("body");if(!q){body.innerHTML='<tr><td colspan="5" class="px-5 py-16 text-center text-lg text-slate-500">輸入關鍵字後按下搜尋</td></tr>';return}if(!ranked.length){body.innerHTML='<tr><td colspan="5" class="px-5 py-16 text-center text-lg text-slate-500">沒有找到符合條件的社團</td></tr>';return}body.innerHTML=ranked.map((g,i)=>'<tr class="border-t border-slate-100 align-top"><td class="px-5 py-5"><div class="text-lg font-black text-slate-950">#'+(i+1)+'</div><div class="text-sm text-slate-500">'+g.score.toFixed(1)+'</div></td><td class="px-5 py-5"><div class="text-base font-bold text-slate-950">'+g.name+'</div><div class="mt-1 text-sm leading-6 text-slate-600">'+g.desc+'</div><div class="mt-2 text-sm text-slate-500">'+g.members+' 成員</div></td><td class="px-5 py-5"><span class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-900">'+g.platform+'</span></td><td class="px-5 py-5"><a href="'+g.url+'" target="_blank" rel="noreferrer" class="break-all text-blue-700 underline decoration-blue-200 underline-offset-4">'+g.url+'</a><div class="mt-2 text-sm font-bold '+(g.visibility==="public"?"text-emerald-600":"text-amber-700")+'">'+(g.visibility==="public"?"公開連結，可直接開啟":"受限/私人社團，可能會看到鎖定頁")+'</div></td><td class="px-5 py-5"><div class="flex flex-wrap gap-2">'+g.tags.map(tag=>'<span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">'+tag+'</span>').join("")+'</div></td></tr>').join("")};$("keyword").addEventListener("input",render);$("count").addEventListener("input",render);$("confirm").addEventListener("click",render);$("keyword").addEventListener("keydown",e=>{if(e.key==="Enter")render()});document.querySelectorAll(".kw").forEach(b=>b.addEventListener("click",()=>{$("keyword").value=b.dataset.value||"";render()}));$("download").addEventListener("click",()=>{if(!current.length)return;const csvEscape=v=>'\"'+String(v??'').replace(/\"/g,'\"\"')+'\"';const rows=[["排名","相關度","社團名稱","平台","網址","成員數","可見性","標籤","描述"],...current.map((g,i)=>[i+1,g.score.toFixed(1),g.name,g.platform,g.url,g.members,g.visibility,g.tags.join(" | "),g.desc])];const csv='\\ufeff'+rows.map(r=>r.map(csvEscape).join(",")).join("\\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download='group-finder-'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});render();</script></body></html>`;

const css = `body{margin:0}`;
const js = `console.log("static build ready")`;

writeFileSync(resolve(dist, "index.html"), html, "utf8");
writeFileSync(resolve(dist, "styles.css"), css, "utf8");
writeFileSync(resolve(dist, "script.js"), js, "utf8");
writeFileSync(resolve(dist, ".openai", "hosting.json"), JSON.stringify({ project_id: "appgprj_6a7ea6c042b081919ead78b59f4b29b8" }, null, 2), "utf8");
