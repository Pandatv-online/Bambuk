import { describe, expect, it } from "vitest";

import {
  categories,
  createDefaultCommercialState,
  navigation,
  products,
} from "../data";

describe("shared content registries", () => {
  it("keeps routes controlled and commercial data honest by default", () => {
    const ids = navigation.flatMap((item) => [
      item.id,
      ...(item.children?.map((child) => child.id) ?? []),
    ]);

    expect(new Set(ids).size).toBe(ids.length);
    expect(
      navigation.every((item) => item.href === "/fi" || item.href.startsWith("/fi#")),
    ).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.every((category) => category.status === "pendingAssortment"))
      .toBe(true);
    expect(products).toEqual([]);
    expect(createDefaultCommercialState()).toEqual({
      price: "quote",
      availability: "unknown",
    });
  });
});
