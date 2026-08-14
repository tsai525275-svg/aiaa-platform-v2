import type { Metadata } from "next";
import { LenisProvider } from "@/components/lenis-provider";
import { AIAANoTranslate } from "@/components/aiaa-no-translate";
import "./globals.css";
import { OAuthHashHandler } from "@/components/oauth-hash-handler";

export const metadata: Metadata = {
  title: "社團搜尋自動化系統",
  description: "輸入關鍵字，自動搜尋社團、排序結果並匯出 Excel 可用的 CSV。",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <OAuthHashHandler />
        <AIAANoTranslate />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
