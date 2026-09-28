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
    for (const shell of [header, footer]) {
      expect(shell).toContain("+358 50 508 0808");
      expect(shell).toContain("ma–pe 8.00–18.00");
      expect(shell).not.toMatch(
        /virallinen|valtuutettu|jakelija|jälleenmyyjä|distributor/i,
      );
      expect(shell).not.toContain("bambukogrindys.lt");
    }
    expect(header).not.toContain("Osaühing IKB");
    expect(footer).toContain("Osaühing IKB");
    expect(header).toContain('href="tel:+358505080808"');
    expect(footer).toContain('href="tel:+358505080808"');
    expect(footer).toContain("Emme ota vastaan kävijöitä");
    expect(footer).toContain("Kohdekäynnistä työn arviointia ja näytteiden esittelyä varten");
    expect(footer).toContain("Sivuston suunnittelu ja toteutus:");
    expect(footer).toContain('<a href="https://verzo.pro/">verzo.pro</a>');
    expect(footer).not.toContain("mailto:");
    expect(breadcrumbs).toContain("Koti");
    expect(breadcrumbs).toContain("Asennus");
    expect(header).not.toMatch(/bambukogrindys\.lt|Ostoskori|Kirjaudu|EUR/);
  });
});
