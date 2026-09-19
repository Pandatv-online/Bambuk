import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import FinnishHomepage, { metadata as homepageMetadata } from "@/app/fi/page";
import GalleryPage, { metadata as galleryMetadata } from "@/app/fi/galleria/page";
import QuotePage, { metadata as quoteMetadata } from "@/app/fi/pyyda-tarjous/page";
import InformationPage, {
  generateMetadata as generateInformationMetadata,
} from "@/app/fi/tietoa-bambusta/[slug]/page";
import InformationHubPage, { metadata as informationHubMetadata } from "@/app/fi/tietoa-bambusta/page";
import SampleRequestPage, { metadata as sampleMetadata } from "@/app/fi/tilaa-mallipala/page";
import FinnishCatalogCatchAllPage, {
  generateMetadata as generateCatalogMetadata,
} from "@/app/fi/tuotteet/[...segments]/page";
import FinnishCatalogPage, { metadata as catalogMetadata } from "@/app/fi/tuotteet/page";
import ContactPage, { metadata as contactMetadata } from "@/app/fi/yhteystiedot/page";
import { getQuoteEligibleCatalogProducts } from "@/data/catalog";
import { getCatalogRouteParams } from "@/components/catalog/product";
import { getPublishedInformationPages } from "@/data/content";
import { galleryItems } from "@/data/gallery/registry";
import { navigation } from "@/data/navigation";
import type { NavigationItem } from "@/data/types";
import { createPageMetadata } from "@/lib/seo";

const fullRouteScanTimeout = 120_000;

const flattenNavigation = (items: readonly NavigationItem[]): readonly NavigationItem[] =>
  items.flatMap((item) => [item, ...(item.children ? flattenNavigation(item.children) : [])]);

const forbiddenVisitorText = [
  /bambukogrindys\.lt|bambuko\s+grindys|\bUAB\b|\+370\b|\bVilnius\b|\bKaunas\b|\bLietuva\b|\bLithuania\b/iu,
  /\b(?:virallinen|valtuutettu|jakelija|jälleenmyyjä|maahantuoja)\b|authorized\s+(?:dealer|distributor)|official\s+(?:dealer|distributor)/iu,
  /\[[^\]]+\]/iu,
  /hiilineutraali|co₂[- ]?neutraali|ympäristöystävällinen|ekologinen|sertifikaatti\w*|\b(?:FSC|PEFC|BREEAM|LEED)\b|myrkytön|päästötön|elinikäinen|markkinajohtaja|paras\s+(?:valinta|laatu)|asennuspalvelu(?:mme|amme)|asentajamme|asennamme|asennusalue(?:emme|\s+on)|asennuksen\s+hinta\s+on/iu,
] as const;

const visitorUrlValues = (html: string): readonly string[] =>
  [...html.matchAll(/\s(?:href|src|srcset|action|poster)=(?:"([^"]*)"|'([^']*)')/giu)]
    .flatMap((match) => (match[1] ?? match[2] ?? "").split(","))
    .map((value) => value.trim().split(/\s+/u)[0] ?? "")
    .filter(Boolean);

const isLocalVisitorUrl = (value: string): boolean =>
  /^(?:\/|#|mailto:|tel:|data:|blob:|\?)/u.test(value);

type BrowserQaJourneyConfig = Readonly<{
  viewports: readonly Readonly<{ width: number }>[];
  formRoutes: readonly string[];
  requiredFormStates: readonly string[];
}>;

const loadBrowserQaJourneyConfig = async (): Promise<BrowserQaJourneyConfig> => {
  // The Node-only ESM harness intentionally has no TypeScript declaration file.
  // @ts-expect-error -- plain .mjs module exports the testable QA plan.
  const qaHarness = await import("@/scripts/browser-qa.mjs");
  return qaHarness.browserQaJourneyConfig as BrowserQaJourneyConfig;
};

const visitorCopy = (html: string): string => [
  html.replace(/<[^>]*>/gu, " "),
  ...[...html.matchAll(/\s(?:alt|aria-label|title|placeholder)=(?:"([^"]*)"|'([^']*)')/giu)]
    .map((match) => match[1] ?? match[2] ?? ""),
].join(" ");

describe("integration routes and SEO", () => {
  it("connects the homepage and shared navigation to shipped local routes", () => {
    const html = renderToStaticMarkup(<FinnishHomepage />);
    const productIds = getQuoteEligibleCatalogProducts().slice(0, 3).map((product) => product.id);
    const items = flattenNavigation(navigation);

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('href="/fi/tuotteet"');
    expect(html).toContain('href="/fi/galleria"');
    expect(html).toContain('href="/fi/pyyda-tarjous"');
    for (const productId of productIds) {
      expect(html).toContain(`data-product-id="${productId}"`);
    }
    expect(items).not.toHaveLength(0);
    expect(items.every((item) => item.href === "/fi" || item.href.startsWith("/fi/") || item.href.startsWith("/fi#"))).toBe(true);
    for (const item of items.filter((item) => item.href.includes("#"))) {
      const anchor = item.href.split("#")[1];
      expect(html).toContain(`id="${anchor}"`);
    }
    expect(html).not.toMatch(/bambukogrindys\.lt|Vilnius|Kaunas|\[[A-Z][A-Z\s/]+\]/iu);
  });

  it("keeps metadata noindex by default and when a review route requests it", () => {
    const omittedIndexability = createPageMetadata({
      title: "Testisivu",
      description: "Testikuvaus.",
      path: "/fi/testi",
    });

    expect(omittedIndexability.robots).toEqual({ index: false, follow: false });
    expect(homepageMetadata.robots).toEqual({ index: false, follow: false });
    expect(homepageMetadata.alternates?.canonical?.toString()).toBe(
      "http://localhost:3000/fi",
    );
    expect(homepageMetadata.openGraph).toMatchObject({
      locale: "fi_FI",
      url: "http://localhost:3000/fi",
    });
  });

  it("makes browser QA cover each completed journey at every required viewport", async () => {
    const browserQaJourneyConfig = await loadBrowserQaJourneyConfig();
    const script = readFileSync(
      fileURLToPath(new URL("../scripts/browser-qa.mjs", import.meta.url)),
      "utf8",
    );

    for (const expected of [
      'width: 390',
      'width: 768',
      'width: 1200',
      'width: 1440',
      '"/fi/tuotteet"',
      '"/fi/galleria"',
      '"/fi/yhteystiedot"',
      '"/fi/pyyda-tarjous"',
      '"/fi/tilaa-mallipala"',
      'Avaa kuva:',
      'Suodata tuotteita',
      "browserQaJourneyConfig",
      '"pending"',
      '"field-error"',
      '"unavailable"',
      '"retry"',
      '"success"',
      "exerciseFormState",
    ]) {
      expect(script).toContain(expected);
    }

    expect(browserQaJourneyConfig.viewports.map(({ width }) => width)).toEqual([
      390,
      768,
      1200,
      1440,
    ]);
    expect(browserQaJourneyConfig.formRoutes).toEqual([
      "/fi/yhteystiedot",
      "/fi/pyyda-tarjous",
      "/fi/tilaa-mallipala",
    ]);
    expect(browserQaJourneyConfig.requiredFormStates).toEqual([
      "pending",
      "field-error",
      "unavailable",
      "retry",
      "success",
    ]);
  });

  it("renders and scans every shipped Finnish route against the review-state visitor contract", async () => {
    const routes = [
      {
        path: "/fi",
        html: renderToStaticMarkup(<FinnishHomepage />),
        metadata: homepageMetadata,
      },
      {
        path: "/fi/tuotteet",
        html: renderToStaticMarkup(
          await FinnishCatalogPage({ searchParams: Promise.resolve({}) }),
        ),
        metadata: catalogMetadata,
      },
      {
        path: "/fi/tietoa-bambusta",
        html: renderToStaticMarkup(<InformationHubPage />),
        metadata: informationHubMetadata,
      },
      {
        path: "/fi/galleria",
        html: renderToStaticMarkup(<GalleryPage />),
        metadata: galleryMetadata,
      },
      {
        path: "/fi/yhteystiedot",
        html: renderToStaticMarkup(<ContactPage />),
        metadata: contactMetadata,
      },
      {
        path: "/fi/pyyda-tarjous",
        html: renderToStaticMarkup(
          await QuotePage({ searchParams: Promise.resolve({}) }),
        ),
        metadata: quoteMetadata,
      },
      {
        path: "/fi/tilaa-mallipala",
        html: renderToStaticMarkup(
          await SampleRequestPage({ searchParams: Promise.resolve({}) }),
        ),
        metadata: sampleMetadata,
      },
      ...await Promise.all(getCatalogRouteParams().map(async ({ segments }) => ({
        path: `/fi/tuotteet/${segments.join("/")}`,
        html: renderToStaticMarkup(
          await FinnishCatalogCatchAllPage({ params: Promise.resolve({ segments: [...segments] }) }),
        ),
        metadata: await generateCatalogMetadata({ params: Promise.resolve({ segments: [...segments] }) }),
      }))),
      ...await Promise.all(getPublishedInformationPages().map(async ({ slug, path }) => ({
        path,
        html: renderToStaticMarkup(
          await InformationPage({ params: Promise.resolve({ slug }) }),
        ),
        metadata: await generateInformationMetadata({ params: Promise.resolve({ slug }) }),
      }))),
    ];

    expect(routes.length).toBeGreaterThan(10);
    expect(new Set(routes.map(({ path }) => path)).size).toBe(routes.length);

    for (const { html, metadata, path } of routes) {
      expect(html, path).toMatch(/<h1(?:\s|>)/u);
      for (const forbidden of forbiddenVisitorText) {
        expect(`${visitorCopy(html)} ${visitorUrlValues(html).join(" ")}`, `${path} matched ${forbidden}`).not.toMatch(forbidden);
      }
      for (const value of visitorUrlValues(html)) {
        expect(value, `${path} exposes non-local visitor URL ${value}`).toSatisfy(isLocalVisitorUrl);
      }
      expect(metadata.robots, `${path} must remain review-state noindex`).toEqual({
        index: false,
        follow: false,
      });
    }
  }, fullRouteScanTimeout);

  it("records the shipped review gallery separately from its unresolved rights and release inputs", () => {
    const implementationInputs = readFileSync(
      fileURLToPath(new URL("../docs/implementation-inputs.md", import.meta.url)),
      "utf8",
    );

    expect(galleryItems).toHaveLength(8);
    expect(galleryItems.every(({ src, alt, rightsId }) =>
      src.startsWith("/images/") && alt.length > 0 && rightsId.startsWith("reference-gallery-"),
    )).toBe(true);
    expect(implementationInputs).toContain("8 nonempty local records");
    expect(implementationInputs).toContain("Remaining gallery rights and release blockers");
  });
});
