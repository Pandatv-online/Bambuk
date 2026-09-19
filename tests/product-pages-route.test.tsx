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
