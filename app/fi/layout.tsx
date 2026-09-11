import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "@/components/navigation";

export default function FinnishSiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Siirry sisältöön
      </a>
      <SiteHeader appearance="hero" />
      <div id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
