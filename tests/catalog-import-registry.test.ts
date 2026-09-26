import { describe, expect, it } from "vitest";
import { stat } from "node:fs/promises";
import path from "node:path";

import {
  catalogCategories,
  catalogImportReport,
  catalogProducts,
  getCatalogCategoryById,
  getCatalogCategoryMedia,
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
    expect(getCatalogProductById("443")?.categoryId).toBe("32");
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
      mappedLocalImages: 355,
      sourceDocuments: 0,
    });
  });

  it("verifies every visitor image mapping against a non-empty local file", async () => {
    expect(catalogImportReport.verifiedLocalImages).toBe(355);
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

    expect(imagePaths).toHaveLength(355);
    expect(sizes.every((size) => size > 0)).toBe(true);

    const categoryMedia = catalogCategories
      .filter((category) => category.parentId !== null)
      .map((category) => getCatalogCategoryMedia(category));
    expect(categoryMedia).toHaveLength(21);
    expect(categoryMedia.every((item) => item !== null)).toBe(true);
    const categorySizes = await Promise.all(categoryMedia.map(async (item) =>
      (await stat(path.join(process.cwd(), "public", item!.src))).size,
    ));
    expect(categorySizes.every((size) => size > 0)).toBe(true);
  });

  it("restores observed décor media and corrects only evidenced category assignments", () => {
    for (const id of ["180", "185", "322", "325", "326", "327"]) {
      const product = getCatalogProductById(id);
      expect(product?.status).toBe("active");
      expect(product?.images.length).toBeGreaterThan(0);
      expect(product?.images[0]?.sourceUrl).toContain(`product_${id}_`);
    }
    expect(getCatalogProductById("258")?.categoryId).toBe("26");
    expect(getCatalogProductById("452")?.categoryId).toBe("43");
    expect(getCatalogProductById("615")?.categoryId).toBe("65");
    expect(getCatalogProductById("694")?.categoryId).toBe("43");
    expect(getCatalogProductById("178")?.images).toEqual([]);
  });

  it("publishes source-confirmed installation products with quote pricing", () => {
    const quoteEligible = getQuoteEligibleCatalogProducts();

    expect(catalogProducts).toHaveLength(108);
    expect(quoteEligible).toEqual(
      catalogProducts.filter((product) => product.status === "active"),
    );
    expect(quoteEligible.every((product) => product.status === "active")).toBe(true);
    for (const id of ["187", "559"]) {
      const product = getCatalogProductById(id);
      expect(quoteEligible).toContain(product);
      expect(product).toMatchObject({
        categoryId: "6",
        status: "active",
        pricing: { status: "hidden" },
        source: { extractedAt: "2026-09-25" },
      });
    }
    expect(getCatalogProductById("187")?.images).toHaveLength(2);
    expect(getCatalogProductById("559")?.images).toMatchObject([{
      src: "/images/products/product_559_1.png",
      rightsId: "wakol-official-product-559",
      sourceUrl: "https://www.wakol.com/ix_pim_assets/image/PU_280_360x430px_Web_Spiegelung__16791.png",
      applicableProductIds: ["559"],
    }]);
    expect(quoteEligible.some((product) => product.id === "200")).toBe(false);
  });
});
