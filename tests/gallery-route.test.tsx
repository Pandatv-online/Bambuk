import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import GalleryPage, { metadata } from "@/app/fi/galleria/page";

describe("Finnish gallery route", () => {
  it("renders one heading, local images and no visitor-facing provenance links", () => {
    const html = renderToStaticMarkup(<GalleryPage />);

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Galleria");
    expect(html).toContain("66 kuvaa");
    expect(html).toContain("%2Fimages%2Fhome%2Fproject-01.jpg");
    expect(html).toContain("%2Fimages%2Fgallery%2Fterraces%2Fgal-6-587.webp");
    expect(html).not.toContain("/uploads/it0003/");
    expect(html).not.toContain("bambukogrindys.lt");
    expect(html).not.toMatch(/asiakkaan|projekti:\s|tuote:\s/iu);
  });

  it("exports canonical, Open Graph and indexable metadata", () => {
    expect(metadata.alternates?.canonical?.toString()).toBe(
      "http://localhost:3000/fi/galleria",
    );
    expect(metadata.openGraph).toMatchObject({
      locale: "fi_FI",
      url: "http://localhost:3000/fi/galleria",
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });
});
