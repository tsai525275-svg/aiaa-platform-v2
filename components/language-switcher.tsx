"use client";

import { useAIAALanguage } from "@/components/i18n-provider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useAIAALanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-slate-300 bg-white p-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.045)]" aria-label="Language switcher">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-2 transition ${language === "en" ? "bg-slate-950 text-white shadow-sm" : "hover:text-[var(--aiaa-blue)]"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("zh")}
        className={`rounded-full px-3 py-2 transition ${language === "zh" ? "bg-slate-950 text-white shadow-sm" : "hover:text-[var(--aiaa-blue)]"}`}
      >
        繁中
      </button>
    </div>
  );
}
