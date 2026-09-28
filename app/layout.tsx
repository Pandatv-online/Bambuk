import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getMetadataBase } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
