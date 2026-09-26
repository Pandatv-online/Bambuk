import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import FinnishCatalogCatchAllPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/fi/tuotteet/[...segments]/page";
import { getCatalogRouteParams } from "@/components/catalog/product";

const pageProps = (segments: string[]) => ({ params: Promise.resolve({ segments }) });

describe("Finnish catalog catch-all page", () => {
  it("renders category and collection outcomes through the shared owner", async () => {
    const category = renderToStaticMarkup(
      await FinnishCatalogCatchAllPage(pageProps(["sisalattiat"])),
    );
    const collection = renderToStaticMarkup(
      await FinnishCatalogCatchAllPage(pageProps(["sisalattiat", "klassikko"])),
    );

    expect(category.match(/<h1/g)).toHaveLength(1);
    expect(category).toContain("Bambulattiat");
    expect(category).toContain('href="/fi/tuotteet/sisalattiat/klassikko"');
    expect(collection.match(/<h1/g)).toHaveLength(1);
    expect(collection).toContain("Klassikko");
    expect(collection).toContain("6 tuotetta");
  });

  it("renders the original décor category thumbnails and six pictured products", async () => {
    const html = renderToStaticMarkup(
      await FinnishCatalogCatchAllPage(pageProps(["bambusisustus"])),
    );

    expect(html).toContain("Bambusisustus");
    expect(html).toContain("6 tuotetta");
    expect(html.match(/data-product-id=/g)).toHaveLength(6);
    for (const id of ["47", "59", "48"]) {
      expect(html).toContain(
        encodeURIComponent(`/images/categories/catalog_${id}_1s150.jpg`),
      );
    }
    for (const id of ["180", "185", "322", "325", "326", "327"]) {
      expect(html).toContain(`data-product-id="${id}"`);
      expect(html).toContain(`product_${id}_1.jpg`);
    }
    expect(html).not.toContain('data-product-id="258"');
    expect(html).not.toContain('data-product-id="615"');
    expect(html).not.toContain("bambukogrindys.lt");
  });

  it("renders all 17 observed terrace products with local images and quote pricing", async () => {
    const html = renderToStaticMarkup(
      await FinnishCatalogCatchAllPage(pageProps(["ulkotuotteet", "terassilaudat"])),
    );

    expect(html).toContain("Bambuterassilaudat");
    expect(html).toContain("17 tuotetta");
    expect(html.match(/data-product-id=/g)).toHaveLength(17);
    for (const id of ["443", "463", "461", "464", "462", "465", "466", "467", "469", "468", "735", "471", "470", "540", "541", "567", "568"]) {
      expect(html).toContain(`data-product-id="${id}"`);
      expect(html).toContain(`product_${id}_1.jpg`);
    }
    expect(html).toContain("Pyydä tarjous");
    expect(html).not.toContain("76,90");
    expect(html).not.toContain("bambukogrindys.lt");
  });

  it("shows sourced dimensions on product cards and both installation products without LT prices", async () => {
    const terrace = renderToStaticMarkup(
      await FinnishCatalogCatchAllPage(pageProps(["ulkotuotteet", "terassilaudat"])),
    );
    const installation = renderToStaticMarkup(
      await FinnishCatalogCatchAllPage(pageProps(["lattian-asennustuotteet"])),
    );

    expect(terrace).toContain("Pituus:");
    expect(terrace).toContain("Leveys:");
    expect(terrace).toContain("Paksuus:");
    expect(terrace).toContain("1850 mm");
    expect(installation).toContain("3 tuotetta");
    for (const id of ["187", "559"]) {
      expect(installation).toContain(`data-product-id="${id}"`);
    }
    expect(installation).toContain("product_187_1.jpg");
    expect(installation).toContain("product_559_1.png");
    expect(installation).not.toContain("280,00");
    expect(installation).not.toContain("90,00");
  });

  it("publishes all controlled params and returns notFound for an unknown route", async () => {
    expect(generateStaticParams()).toEqual(getCatalogRouteParams());
    await expect(
      FinnishCatalogCatchAllPage(pageProps(["tuntematon"])),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/u);
  });

  it("builds canonical Open Graph noindex metadata for a product without an Offer", async () => {
    const segments = [
      "sisalattiat",
      "klassikko",
      "massiivibambulattia-luonnollinen-savy-treffert-uv-lakka-47",
    ];
    const metadata = await generateMetadata(pageProps(segments));
    const serialized = JSON.stringify(metadata);

    expect(metadata.title).toContain("Massiivibambulattia");
    expect(metadata.alternates?.canonical?.toString()).toBe(
      `http://localhost:3000/fi/tuotteet/${segments.join("/")}`,
    );
    expect(metadata.openGraph).toMatchObject({
      locale: "fi_FI",
      type: "website",
      url: `http://localhost:3000/fi/tuotteet/${segments.join("/")}`,
    });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(serialized).not.toContain("Offer");
    expect(serialized).not.toContain("bambukogrindys.lt");
  });
});
