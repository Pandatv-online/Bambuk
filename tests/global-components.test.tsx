import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CategoryCard, ProductCard } from "@/components/catalog";
import { GalleryGrid } from "@/components/gallery";
import { createDefaultCommercialState } from "@/data";

describe("global catalog and media presenters", () => {
  it("renders honest quote and placeholder states without remote media", () => {
    const product = renderToStaticMarkup(
      <ProductCard
        product={{
          id: "fixture",
          name: "Testituote",
          href: "/fi#yhteys",
          image: null,
          commercial: createDefaultCommercialState(),
        }}
      />,
    );
    const category = renderToStaticMarkup(
      <CategoryCard
        category={{
          id: "fixture",
          name: "Testiryhmä",
          slug: "testiryhma",
          href: "/fi#tuoteryhmat",
          status: "pendingAssortment",
          image: null,
        }}
      />,
    );
    const gallery = renderToStaticMarkup(
      <GalleryGrid
        items={[{ id: "fixture", image: null, alt: "Projektikuva tulossa" }]}
      />,
    );
    const publishedPrice = renderToStaticMarkup(
      <ProductCard
        product={{
          id: "priced-fixture",
          name: "Hinnoiteltu testituote",
          href: "/fi#yhteys",
          image: null,
          commercial: {
            price: "published",
            publishedPrice: {
              amountMinor: 12345,
              currency: "EUR",
              basis: "m²",
              vatDisplay: "Sisältää arvonlisäveron",
              sourceId: "fixture-source",
              updatedAt: "2026-09-11T00:00:00.000Z",
            },
            availability: "unknown",
          },
        }}
      />,
    );

    expect(product).toContain("Hinta pyynnöstä");
    expect(product).toContain("Pyydä tarjous");
    expect(category).toContain("Valikoima vahvistetaan");
    expect(gallery).toContain('role="img"');
    expect(publishedPrice).toContain("Sisältää arvonlisäveron");
    expect(publishedPrice).toContain("Päivitetty");
    expect(publishedPrice).toContain('dateTime="2026-09-11T00:00:00.000Z"');
    expect(`${product}${category}${gallery}`).not.toMatch(/https?:\/\//);
  });
});
