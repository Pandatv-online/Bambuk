import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/navigation";
import { navigation } from "@/data";

describe("the shared site navigation", () => {
  it("drives the header, footer, and breadcrumbs from one route registry", () => {
    const header = renderToStaticMarkup(<SiteHeader />);
    const footer = renderToStaticMarkup(<SiteFooter />);
    const breadcrumbs = renderToStaticMarkup(
      <Breadcrumbs currentPath="/fi#asennus" />,
    );

    for (const item of navigation) {
      expect(header).toContain(`href="${item.href}"`);
      expect(footer).toContain(`href="${item.href}"`);
    }

    expect(header).toContain("Pyydä tarjous");
    expect(breadcrumbs).toContain("Koti");
    expect(breadcrumbs).toContain("Asennus");
    expect(header).not.toMatch(/bambukogrindys\.lt|Ostoskori|Kirjaudu|EUR/);
  });
});
