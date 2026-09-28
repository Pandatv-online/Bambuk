import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import InformationHubPage, {
  metadata as hubMetadata,
} from "@/app/fi/tietoa-bambusta/page";
import InformationPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/fi/tietoa-bambusta/[slug]/page";
import { getPublishedInformationPages } from "@/data/content";

describe("Finnish information routes", () => {
  it("renders six source-aware routes with one H1 and unique indexable metadata", async () => {
    const hubHtml = renderToStaticMarkup(<InformationHubPage />);
    const pages = getPublishedInformationPages();
    const params = generateStaticParams();
    const titles = new Set([hubMetadata.title]);

    expect(hubHtml.match(/<h1/g)).toHaveLength(1);
    expect(hubHtml.match(/class="[^\"]*information-card/g)).toHaveLength(5);
    expect(params).toEqual(pages.map(({ slug }) => ({ slug })));
    expect(hubMetadata.robots).toEqual({ index: true, follow: true });

    for (const page of pages) {
      const routeParams = Promise.resolve({ slug: page.slug });
      const html = renderToStaticMarkup(
        await InformationPage({ params: routeParams }),
      );
      const metadata = await generateMetadata({ params: routeParams });

      expect(html.match(/<h1/g)).toHaveLength(1);
      expect(html).toContain("Soveltuvuus:");
      expect(html).toContain("Lähdepohja");
      expect(html).not.toContain("bambukogrindys.lt");
      expect(metadata.robots).toEqual({ index: true, follow: true });
      expect(metadata.alternates?.canonical?.toString()).toContain(page.path);
      expect(titles.has(metadata.title)).toBe(false);
      titles.add(metadata.title);
    }

    expect(titles.size).toBe(6);
  });
});
