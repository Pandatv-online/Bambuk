import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  ProductDetailPage,
  resolveCatalogRoute,
} from "@/components/catalog/product";

const resolveProduct = (segments: readonly string[]) => {
  const route = resolveCatalogRoute(segments);
  if (route?.kind !== "product") throw new Error("Expected a product route");
  return route;
};

describe("product detail presenter", () => {
  it("renders sourced product facts, commercial guardrails and contextual actions", () => {
    const route = resolveProduct([
      "sisalattiat",
      "klassikko",
      "massiivibambulattia-luonnollinen-savy-treffert-uv-lakka-47",
    ]);
    const html = renderToStaticMarkup(<ProductDetailPage route={route} />);

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(route.product.nameFi);
    expect(html).toContain("60,50 €/m²");
    expect(html).toContain("Tarkistettu 12.9.2026");
    expect(html).toContain("Tuotetietojen lähdeaineisto: 12.9.2026");
    expect(html).toContain("ALV-käsittely vahvistetaan tarjouksessa");
    expect(html).toContain("Varastossa");
    expect(html).toContain("Näyte saatavilla");
    expect(html).toContain("Toimitus sisältyy hintaan");
    expect(html).toContain("Takuu 12 kuukautta");
    expect(html).toContain("Tiheys");
    expect(html).toContain('href="/fi/pyyda-tarjous?tuote=47');
    expect(html).toContain('href="/fi/tilaa-mallipala?tuote=47');
    expect(html).not.toContain("bambukogrindys.lt");
    expect(html).not.toContain("application/ld+json");
  });

  it("omits empty specification, description and document sections", () => {
    const route = resolveProduct([
      "jalkalistat-ja-porrasosat",
      "massiivibambu-jalkalista-karbonisoitu-savy-treffert-uv-lakka-145",
    ]);
    const html = renderToStaticMarkup(<ProductDetailPage route={route} />);

    expect(html).toContain("Pyydä tarjous");
    expect(html).not.toContain("Tekniset tiedot");
    expect(html).not.toContain("Tuotekuvaus");
    expect(html).not.toContain("Dokumentit");
    expect(html).not.toContain("Tiheys");
  });
});
