import { describe, expect, it } from "vitest";
import { stat } from "node:fs/promises";
import path from "node:path";

import {
  catalogCategories,
  catalogImportReport,
  catalogProducts,
  getCatalogCategoryById,
  getCatalogProductById,
  getQuoteEligibleCatalogProducts,
  getReadyCatalogProducts,
} from "../data/catalog";

describe("generated catalog registry", () => {
  it("exposes typed selectors over the reconciled local snapshot", () => {
    expect(catalogCategories).toHaveLength(22);
    expect(catalogProducts).toHaveLength(108);
    expect(getCatalogCategoryById("32")?.nameFi).toBe("Bambuterassilaudat");
    expect(getCatalogCategoryById("38")?.nameFi).toBe("Väriharmonia");
    expect(getCatalogProductById("443")?.categoryId).toBe("43");
    expect(getCatalogProductById("53")?.pricing.extractedAt).toBe("2026-09-12");
    expect(getReadyCatalogProducts().every((product) => product.status === "active"))
      .toBe(true);
    expect(
      catalogProducts.flatMap((product) => product.images).every(
        (image) => image.src.startsWith("/images/products/") &&
          !image.src.startsWith("http"),
      ),
    ).toBe(true);
    expect(catalogImportReport).toMatchObject({
      sourceProducts: 108,
      normalizedProducts: 108,
      mappedLocalImages: 294,
      sourceDocuments: 0,
    });
  });

  it("verifies every visitor image mapping against a non-empty local file", async () => {
    expect(catalogImportReport.verifiedLocalImages).toBe(294);
    const imagePaths = [
      ...new Set(
        catalogProducts.flatMap((product) =>
          product.images.map((image) => image.src),
        ),
      ),
    ];
    const sizes = await Promise.all(
      imagePaths.map(async (src) =>
        (await stat(path.join(process.cwd(), "public", src))).size,
      ),
    );

    expect(imagePaths).toHaveLength(294);
    expect(sizes.every((size) => size > 0)).toBe(true);
  });

  it("retains price-not-ready records for the quote-only catalog path", () => {
    const quoteEligible = getQuoteEligibleCatalogProducts();
    const priceNotReady = catalogProducts.filter(
      (product) =>
        product.status === "notReady" &&
        product.readinessIssues.includes("invalid-price"),
    );

    expect(catalogProducts).toHaveLength(108);
    expect(quoteEligible).toEqual(
      catalogProducts.filter((product) => product.status === "active"),
    );
    expect(quoteEligible.every((product) => product.status === "active")).toBe(true);
    expect(quoteEligible.some((product) => product.id === "187")).toBe(false);
    expect(quoteEligible.some((product) => product.id === "200")).toBe(false);
    expect(priceNotReady).toHaveLength(14);
    expect(
      priceNotReady.every(
        (product) =>
          product.pricing.status === "hidden" &&
          product.source.sourceId === product.id &&
          getCatalogProductById(product.id) === product,
      ),
    ).toBe(true);
  });
});
