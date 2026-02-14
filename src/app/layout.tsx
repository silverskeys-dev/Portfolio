import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { PROFILE } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${PROFILE.name} — ${PROFILE.title}`,
  description:
    "Modern, minimal portfolio for a 3D Artist and Game Developer — assets, games, and contact.",
  icons: {
    icon: [
      { url: PROFILE.logoSrc, type: "image/png" },
      { url: PROFILE.logoSrc, sizes: "32x32", type: "image/png" },
    ],
    shortcut: [{ url: PROFILE.logoSrc, type: "image/png" }],
    apple: [{ url: PROFILE.logoSrc, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} min-h-dvh bg-[#0d0d0f] text-zinc-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
