import { describe, expect, it } from "vitest";

import { catalogCategories, getCatalogProductById } from "@/data/catalog";
import {
  createCatalogUrl,
  getCatalogFacets,
  getCatalogProductPath,
  parseCatalogQuery,
  queryProducts,
} from "@/lib/catalog/query";

describe("catalog query boundary", () => {
  it("excludes unmapped source-locale attribute values from visitor facets", () => {
    const sourceProduct = getCatalogProductById("47");
    expect(sourceProduct?.attributes.color).toBeTruthy();
    if (!sourceProduct?.attributes.color) return;

    const productWithUnmappedColor = {
      ...sourceProduct,
      attributes: {
        ...sourceProduct.attributes,
        color: { ...sourceProduct.attributes.color, value: "Nežinoma" },
      },
    };
    const facets = getCatalogFacets({
      categories: catalogCategories,
      products: [productWithUnmappedColor],
    });

    expect(facets.colors).toEqual([]);
    expect(JSON.stringify(facets)).not.toContain("Nežinoma");
  });

  it("keeps supported repeated facets and canonicalizes unsafe values", () => {
    const parsed = parseCatalogQuery({
      kategoria: ["sisalattiat", "ei-ole"],
      mallisto: "klassikko",
      vari: ["luonnollinen", "luonnollinen", "<script>"],
      saatavuus: "varastossa",
      jarjestys: "nimi",
      sivu: "02",
      tuntematon: "arvo",
    });

    expect(parsed.query).toEqual({
      categorySlugs: ["sisalattiat"],
      collectionSlugs: ["klassikko"],
      colorValues: ["luonnollinen"],
      surfaceValues: [],
      finishValues: [],
      availability: "inStock",
      sort: "name-asc",
      page: 2,
    });
    expect(parsed.canonicalSearchParams).toBe(
      "kategoria=sisalattiat&mallisto=klassikko&vari=luonnollinen&saatavuus=varastossa&jarjestys=nimi&sivu=2",
    );
    expect(parsed.ignoredParameters).toEqual([
      "kategoria=ei-ole",
      "vari=<script>",
      "tuntematon",
    ]);
  });

  it("queries only the 66 quote-eligible records with stable server pagination", () => {
    const allProducts = queryProducts(parseCatalogQuery({}).query);
    const lastPage = queryProducts(parseCatalogQuery({ sivu: "99" }).query);
    const floors = queryProducts(
      parseCatalogQuery({ kategoria: "sisalattiat" }).query,
    );
    const prices = queryProducts(
      parseCatalogQuery({ jarjestys: "hinta" }).query,
    );

    expect(allProducts.totalItems).toBe(66);
    expect(allProducts.totalPages).toBe(3);
    expect(allProducts.items).toHaveLength(24);
    expect(lastPage.page).toBe(3);
    expect(lastPage.items).toHaveLength(18);
    expect(floors.totalItems).toBe(20);
    expect(floors.items.every((product) => product.collectionId !== null)).toBe(true);
    expect(prices.items[0]?.pricing).toMatchObject({
      status: "published",
      amount: 6,
    });
    expect(prices.items.at(-1)?.pricing.status).toBe("published");
  });

  it("retains filter state in pagination URLs and builds controlled product paths", () => {
    const parsed = parseCatalogQuery({
      kategoria: "sisalattiat",
      vari: "luonnollinen",
      jarjestys: "nimi-laskeva",
      sivu: "2",
    });
    const product = getCatalogProductById("47");

    expect(createCatalogUrl(parsed.query, { page: 3 })).toBe(
      "/fi/tuotteet?kategoria=sisalattiat&vari=luonnollinen&jarjestys=nimi-laskeva&sivu=3",
    );
    expect(createCatalogUrl(parsed.query, { page: 1 })).not.toContain("sivu=");
    expect(product && getCatalogProductPath(product)).toBe(
      "/fi/tuotteet/sisalattiat/klassikko/massiivibambulattia-luonnollinen-savy-treffert-uv-lakka-47",
    );
  });
});
