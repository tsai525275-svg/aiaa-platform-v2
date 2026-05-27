import type { Metadata } from "next";
import { LenisProvider } from "@/components/lenis-provider";
import { AIAANoTranslate } from "@/components/aiaa-no-translate";
import "./globals.css";
import { OAuthHashHandler } from "@/components/oauth-hash-handler";

export const metadata: Metadata = {
  title: "AIAA Online",
  description: "AIAA Online, AI Agent Identity Authority.",
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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <OAuthHashHandler />
        <AIAANoTranslate />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}