"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AIAALanguage = "en" | "zh";

type I18nContextValue = {
  language: AIAALanguage;
  setLanguage: (language: AIAALanguage) => void;
  isZh: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "aiaa-language";

function readInitialLanguage(): AIAALanguage {
  if (typeof window === "undefined") return "en";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "zh") return stored;

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("zh")) return "zh";

  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AIAALanguage>("en");

  useEffect(() => {
    setLanguageState(readInitialLanguage());
  }, []);

  function setLanguage(nextLanguage: AIAALanguage) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.cookie = `${STORAGE_KEY}=${nextLanguage}; path=/; max-age=31536000; SameSite=Lax`;
  }

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
    document.documentElement.dataset.aiaaLanguage = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isZh: language === "zh"
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useAIAALanguage() {
  const value = useContext(I18nContext);

  if (!value) {
    return {
      language: "en" as AIAALanguage,
      setLanguage: () => undefined,
      isZh: false
    };
  }

  return value;
}
