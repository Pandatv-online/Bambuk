import { describe, expect, it } from "vitest";

import { createPageMetadata, getMetadataBase } from "../lib/seo";
import type { SiteConfig } from "../lib/site-config";

const configuredSite = {
  siteUrl: "https://bamboopro.fi",
} as SiteConfig;

describe("createPageMetadata", () => {
  it("does not use localhost as a production public origin", () => {
    expect(() =>
      getMetadataBase(
        { siteUrl: "http://localhost:3000" } as SiteConfig,
        "production",
      ),
    ).toThrow("production metadata requires NEXT_PUBLIC_SITE_URL");
  });

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

    expect(metadata.alternates?.canonical?.toString()).toBe("https://bamboopro.fi/fi");
    expect(metadata.openGraph).toMatchObject({
      locale: "fi_FI",
      type: "website",
      url: "https://bamboopro.fi/fi",
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});
