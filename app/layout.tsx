import type { Metadata } from "next";
import { LenisProvider } from "@/components/lenis-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIAA",
  description: "Global AI Agent certification institution."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
