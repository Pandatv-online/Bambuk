import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import FinnishHomepage, { metadata } from "../app/fi/page";
import { getQuoteEligibleCatalogProducts } from "../data/catalog";
import { getGalleryPresentationItems } from "../data/gallery";
import { homepageContent } from "../data/homepage";

describe("Finnish homepage", () => {
  it("renders the approved section order and an honest quotation path", () => {
    const html = renderToStaticMarkup(FinnishHomepage());
    const featuredProducts = getQuoteEligibleCatalogProducts().slice(0, 5);
    const galleryItems = getGalleryPresentationItems();

    expect(html).toContain(homepageContent.title);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('href="/fi/pyyda-tarjous"');
    expect(html).toContain('href="/fi/tuotteet"');
    for (const id of ["2", "21", "5", "3", "7", "6", "26"]) {
      expect(html).toContain(
        encodeURIComponent(`/images/categories/catalog_${id}_1s150.jpg`),
      );
    }
    const categorySection = html.slice(
      html.indexOf('id="tuoteryhmat"'),
      html.indexOf('id="galleria"'),
    );
    expect(categorySection.match(/homepage-catalog-card__media/g)).toHaveLength(7);
    expect(categorySection).not.toContain('data-nimg="fill"');
    for (const product of featuredProducts) {
      expect(html).toContain(`data-product-id="${product.id}"`);
    }
    expect(galleryItems).not.toHaveLength(0);
    expect(html).toContain(galleryItems[0]!.alt);
    expect(html).toContain('srcSet="/_next/image?url=%2Fimages%2Fhome');
    expect(html).not.toContain("bambukogrindys.lt");
    expect(html).not.toMatch(/\[[A-Z][A-Z\s/]+\]/);

    const orderedSections = [
      'id="alku"',
      'id="bambulattiat"',
      'id="tuoteryhmat"',
      'id="galleria"',
      'id="tietoa"',
      'id="tuotevalikoima"',
      'id="asennus"',
      'id="oppaat"',
      'id="yhteys"',
    ];
    const positions = orderedSections.map((needle) => html.indexOf(needle));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((left, right) => left - right)).toEqual(positions);
  });

  it("exports canonical, Open Graph and readiness-derived noindex metadata", () => {
    expect(metadata.alternates?.canonical?.toString()).toBe(
      "http://localhost:3000/fi",
    );
    expect(metadata.openGraph).toMatchObject({
      locale: "fi_FI",
      url: "http://localhost:3000/fi",
    });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders source-backed commercial data without unsupported trust claims", () => {
    const html = renderToStaticMarkup(FinnishHomepage());

    expect(html).toMatch(/\d+[,.]\d{2}\s?€/);
    expect(html).toContain("Tarkistettu 12.9.2026");
    expect(html).not.toMatch(/sertifika|arvostelu|hiilijalanjälki/i);
    expect(html).not.toMatch(/LT-\d|Vilnius|Kaunas|Lithuan/i);
  });
});
