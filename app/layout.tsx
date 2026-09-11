import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { getMetadataBase } from "@/lib/seo";
import "@/styles/globals.css";

const openSans = localFont({
  display: "swap",
  src: "../public/fonts/open-sans-latin-variable.woff2",
  variable: "--font-open-sans",
  weight: "300 800",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fi" className={openSans.variable}>
      <body>{children}</body>
    </html>
  );
}
