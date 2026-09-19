import { describe, expect, it } from "vitest";

import {
  catalogCategories,
  getQuoteEligibleCatalogProducts,
} from "../data/catalog";
import { getGalleryPresentationItems } from "../data/gallery";
import { navigation } from "../data/navigation";
import {
  getCatalogCategoryPath,
  getCatalogProductPath,
} from "../lib/catalog/query";

describe("shared content registries", () => {
  it("keeps live routes and presentation records controlled", () => {
    const navigationItems = navigation.flatMap((item) => [
      item.id,
      ...(item.children?.map((child) => child.id) ?? []),
    ]);
    const productNavigation = navigation.find((item) => item.id === "products");
    const quoteEligibleProducts = getQuoteEligibleCatalogProducts();
    const galleryItems = getGalleryPresentationItems();

    expect(new Set(navigationItems).size).toBe(navigationItems.length);
    expect(
      navigation.every(
        (item) =>
          item.href === "/fi" ||
          item.href.startsWith("/fi/") ||
          item.href.startsWith("/fi#"),
      ),
    ).toBe(true);
    expect(navigation.map((item) => item.href)).toEqual(
      expect.arrayContaining([
        "/fi/tuotteet",
        "/fi/tietoa-bambusta",
        "/fi/galleria",
        "/fi/yhteystiedot",
      ]),
    );

    const topLevelCategories = catalogCategories.filter(
      (category) => category.parentId === "0",
    );
    expect(productNavigation?.children).toHaveLength(topLevelCategories.length);
    for (const category of topLevelCategories) {
      expect(productNavigation?.children).toContainEqual(
        expect.objectContaining({
          id: `product-category-${category.id}`,
          href: getCatalogCategoryPath(category.id),
        }),
      );
    }

    expect(quoteEligibleProducts).not.toHaveLength(0);
    expect(quoteEligibleProducts.every((product) => product.status === "active")).toBe(
      true,
    );
    expect(
      quoteEligibleProducts.every(
        (product) => getCatalogProductPath(product)?.startsWith("/fi/tuotteet/") === true,
      ),
    ).toBe(true);

    expect(galleryItems).not.toHaveLength(0);
    expect(new Set(galleryItems.map((item) => item.id)).size).toBe(galleryItems.length);
    expect(galleryItems.every((item) => item.src.startsWith("/images/"))).toBe(true);
  });
});
