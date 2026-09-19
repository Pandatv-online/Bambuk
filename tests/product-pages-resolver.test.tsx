import { describe, expect, it } from "vitest";

import {
  getCatalogRouteParams,
  resolveCatalogRoute,
} from "@/components/catalog/product";

describe("controlled catalog catch-all resolver", () => {
  it("resolves category, collection and active product paths and rejects unknown routes", () => {
    expect(resolveCatalogRoute(["sisalattiat"])?.kind).toBe("category");
    expect(resolveCatalogRoute(["sisalattiat", "klassikko"])?.kind).toBe(
      "collection",
    );

    const product = resolveCatalogRoute([
      "sisalattiat",
      "klassikko",
      "massiivibambulattia-luonnollinen-savy-treffert-uv-lakka-47",
    ]);
    expect(product).toMatchObject({ kind: "product" });
    expect(product?.kind === "product" ? product.product.id : null).toBe("47");
    expect(resolveCatalogRoute(["sisalattiat", "ei-ole"])).toBeNull();
  });

  it("generates one controlled catch-all param for every category and active product", () => {
    const params = getCatalogRouteParams();
    const serialized = params.map(({ segments }) => segments.join("/"));

    expect(new Set(serialized).size).toBe(serialized.length);
    expect(serialized).toContain("sisalattiat");
    expect(serialized).toContain("sisalattiat/klassikko");
    expect(serialized).toContain(
      "sisalattiat/klassikko/massiivibambulattia-luonnollinen-savy-treffert-uv-lakka-47",
    );
    expect(serialized.filter((path) => path.endsWith("-47"))).toHaveLength(1);
  });
});
