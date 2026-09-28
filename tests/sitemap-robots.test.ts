import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getCatalogRouteParams } from "@/components/catalog/product";
import { getPublishedInformationPages } from "@/data/content";

describe("published search routes", () => {
  it("lists all published canonical pages once, including catalog additions", () => {
    const entries = sitemap();
    const urls = entries.map(({ url }) => url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain("http://localhost:3000/fi");
    expect(urls).toContain("http://localhost:3000/fi/galleria");
    expect(urls).toContain("http://localhost:3000/fi/tietosuoja");
    for (const { segments } of getCatalogRouteParams()) {
      expect(urls).toContain(`http://localhost:3000/fi/tuotteet/${segments.join("/")}`);
    }
    for (const { path } of getPublishedInformationPages()) {
      expect(urls).toContain(`http://localhost:3000${path}`);
    }
    expect(urls.every((url) => !url.includes("?"))).toBe(true);
  });

  it("allows page crawling and advertises the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: "http://localhost:3000/sitemap.xml",
    });
  });
});
