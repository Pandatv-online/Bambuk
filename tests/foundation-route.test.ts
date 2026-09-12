import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import FinnishHomepage, { metadata } from "../app/fi/page";

describe("Finnish homepage", () => {
  it("renders the approved section order and an honest quotation path", () => {
    const html = renderToStaticMarkup(FinnishHomepage());

    expect(html).toContain("Tietoa bambulattioista ja bambuterasseista");
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Suomen tuotevalikoimaa ei ole vielä vahvistettu");
    expect(html).toContain('href="/fi#yhteys"');
    expect(html).toContain("Pyydä tarjous");
    expect(html).toContain("disabled");
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

  it("does not render commercial or unsupported trust data", () => {
    const html = renderToStaticMarkup(FinnishHomepage());

    expect(html).not.toMatch(/\d+[,.]\d{2}\s?€/);
    expect(html).not.toMatch(/takuu|sertifika|arvostelu|hiilijalanjälki/i);
    expect(html).not.toMatch(/LT-\d|Vilnius|Kaunas|Lithuan/i);
  });
});
