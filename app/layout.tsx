import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getMetadataBase } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
