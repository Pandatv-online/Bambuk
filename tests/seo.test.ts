import { describe, expect, it } from "vitest";

import { createPageMetadata } from "../lib/seo";
import type { SiteConfig } from "../lib/site-config";

const configuredSite = {
  siteUrl: "https://example.fi",
} as SiteConfig;

describe("createPageMetadata", () => {
  it("normalizes a Finnish canonical and Open Graph metadata", () => {
    const metadata = createPageMetadata(
      {
        title: "Bambulattiat Suomeen",
        description: "Tutustu valikoimaan ja pyydä tarjous.",
        path: "/fi",
        image: "/images/social/home.jpg",
        indexable: true,
      },
      configuredSite,
    );

    expect(metadata.alternates?.canonical?.toString()).toBe("https://example.fi/fi");
    expect(metadata.openGraph).toMatchObject({
      locale: "fi_FI",
      type: "website",
      url: "https://example.fi/fi",
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});
