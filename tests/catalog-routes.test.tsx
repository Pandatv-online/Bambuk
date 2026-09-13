import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import FinnishCatalogPage, { metadata } from "@/app/fi/tuotteet/page";

describe("Finnish catalog hub", () => {
  it("renders the controlled category registry and first 24 quote-eligible products", async () => {
    const html = renderToStaticMarkup(
      await FinnishCatalogPage({ searchParams: Promise.resolve({}) }),
    );

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Kaikki tuotteet");
    expect(html).toContain("66 tuotetta");
    expect(html.match(/data-product-id=/g)).toHaveLength(24);
    expect(html).toContain('href="/fi/tuotteet/sisalattiat"');
    expect(html).toContain("Varastossa");
    expect(html).toContain("Näyte saatavilla");
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('href="/fi/tuotteet?sivu=2"');
    expect(html).toContain("Oletusjärjestys");
    expect(html).not.toContain("Suositeltu järjestys");
    expect(html).not.toContain("bambukogrindys.lt");
    expect(metadata.title).toBe("Tuotteet | Osaühing IKB");
    expect(JSON.stringify(metadata)).not.toContain("Bambuk Finland");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders active filters, retained pagination and a useful zero-result reset", async () => {
    const filtered = renderToStaticMarkup(
      await FinnishCatalogPage({
        searchParams: Promise.resolve({
          kategoria: "sisalattiat",
          mallisto: "klassikko",
          vari: "luonnollinen",
        }),
      }),
    );
    const empty = renderToStaticMarkup(
      await FinnishCatalogPage({
        searchParams: Promise.resolve({
          kategoria: "sisalattiat",
          vari: "espresso",
        }),
      }),
    );

    expect(filtered).toContain("Aktiiviset suodattimet");
    expect(filtered).toContain("Bambulattiat");
    expect(filtered).toContain("Klassikko");
    expect(filtered).toContain("Luonnollinen");
    expect(filtered).toMatch(
      /<input[^>]*name="kategoria"[^>]*checked=""[^>]*value="sisalattiat"/,
    );
    expect(empty).toContain("Näillä suodattimilla ei löytynyt tuotteita");
    expect(empty).toContain('href="/fi/tuotteet"');
    expect(empty).not.toMatch(/data-product-id=/);
  });
});
