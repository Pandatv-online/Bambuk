import { describe, expect, expectTypeOf, it } from "vitest";

import rawCatalog from "../.firecrawl/catalog-products-2026-09-12.json";
import { importReferenceCatalog } from "../lib/catalog/import-reference-catalog";
import type { ProductPricing } from "../lib/catalog";

const catalogImportTimeout = 15_000;

describe("reference catalog import", () => {
  it("requires complete provenance in the published pricing type", () => {
    type PublishedPriceFields = {
      status: "published";
      amount: 60.5;
      currency: "EUR";
      basis: "€/m²";
      vatDisplay: null;
      checkedAt: "2026-09-12";
      checkedLabelFi: "Tarkistettu 12.9.2026";
      vatConfirmationFi: "ALV-käsittely vahvistetaan tarjouksessa";
    };

    expectTypeOf<PublishedPriceFields & {
      sourceUrl: null;
      extractedAt: "2026-09-12";
    }>().not.toMatchTypeOf<ProductPricing>();
    expectTypeOf<PublishedPriceFields & {
      sourceUrl: "https://www.bambukogrindys.lt/lt/katalogas/product/53/";
      extractedAt: null;
    }>().not.toMatchTypeOf<ProductPricing>();
  });

  it("normalizes the complete source set without mixing representative product facts", () => {
    const result = importReferenceCatalog(rawCatalog);

    expect(result.report).toMatchObject({
      auditSnapshotProducts: 130,
      sourceProducts: 108,
      uniqueSourceProducts: 108,
      auditDifference: 22,
      normalizedProducts: 108,
      sourceCategories: 22,
      normalizedCategories: 22,
      sourceImageReferences: 356,
      uniqueSourceImages: 294,
      sourceDocuments: 0,
    });
    expect(result.products).toHaveLength(108);

    const floor = result.products.find((product) => product.id === "53");
    const decking = result.products.find((product) => product.id === "443");
    const panel = result.products.find((product) => product.id === "682");
    const adhesive = result.products.find((product) => product.id === "187");

    expect(floor).toMatchObject({
      nameFi: "Massiivibambulattia – karbonisoitu sävy, Treffert UV-lakka",
      categoryId: "55",
      sku: "N/KARB/UV_915",
      pricing: { status: "published", amount: 60.5, basis: "€/m²" },
    });
    expect(decking).toMatchObject({
      nameFi: "Bambuterassilauta – dassoXTR' R137, Espresso-sävy",
      categoryId: "43",
      sku: "X20-SG2-5TG-PSR",
    });
    expect(panel).toMatchObject({
      nameFi:
        "Sivupuristettu bambulevy – 3-kerroksinen, luonnollinen sävy",
      categoryId: "43",
    });
    expect(adhesive).toMatchObject({
      nameFi: "Adesiver 2K Premium -epoksipolyuretaanilattialiima, 12,5 kg",
      categoryId: "6",
      specifications: [],
    });
    expect(floor?.specifications.length).toBeGreaterThan(0);
    expect(floor?.availability).toEqual({
      status: "inStock",
      confirmedBy: "user",
      confirmedAt: "2026-09-12",
    });
  }, catalogImportTimeout);

  it("does not repair missing or conflicting source facts without provenance", () => {
    const products = importReferenceCatalog(rawCatalog).products;

    expect(products.find((product) => product.id === "200")).toMatchObject({
      status: "notReady",
      nameFi: null,
      nameSource: null,
      readinessIssues: expect.arrayContaining(["missing-name", "missing-source-url"]),
      source: { url: null, sourceId: "200" },
    });
    expect(products.find((product) => product.id === "461")).toMatchObject({
      status: "notReady",
      nameFi: null,
      nameSource: null,
    });
    expect(products.find((product) => product.id === "443")).toMatchObject({
      categoryId: "43",
      source: {
        url: "https://www.bambukogrindys.lt/lt/katalogas/product/443/bambuko-terasines-grindys-dassoxtr-r137-espresso-spalva/",
      },
    });
    expect(products.find((product) => product.id === "452")?.categoryId).toBe("6");
    expect(products.find((product) => product.id === "607")?.categoryId).toBe("0");
    expect(products.find((product) => product.id === "615")?.categoryId).toBe("59");
    expect(products.find((product) => product.id === "53")?.brand).toBeNull();
  });

  it("rejects duplicate product IDs and emits unique Finnish slugs", () => {
    const input = structuredClone(rawCatalog);
    const original = input.data.products[0]!;
    input.data.products.push(structuredClone(original));

    const result = importReferenceCatalog(input);

    expect(result.products).toHaveLength(108);
    expect(result.report.skippedProducts).toBe(1);
    expect(new Set(result.products.map((product) => product.slugFi)).size).toBe(108);
    expect(result.report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-product-id", sourceId: "47" }),
      ]),
    );
  });

  it("rejects and reports duplicate normalized Finnish slugs", () => {
    const input = structuredClone(rawCatalog);
    input.data.products.push({
      ...structuredClone(input.data.products[0]!),
      sourceId: 999,
      sourceUrl:
        "https://www.bambukogrindys.lt/lt/katalogas/product/999/distinct-source-record/",
    });

    const result = importReferenceCatalog(input);
    const duplicate = result.products.find((product) => product.id === "999");
    const collisionIds = result.products
      .filter((product) =>
        product.readinessIssues.includes("duplicate-normalized-slug"),
      )
      .map((product) => product.id)
      .sort();

    expect(duplicate).toMatchObject({
      status: "notReady",
      readinessIssues: expect.arrayContaining(["duplicate-normalized-slug"]),
    });
    expect(result.report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "duplicate-normalized-slug",
          sourceId: "999",
        }),
      ]),
    );
    expect(collisionIds).toEqual(["173", "174", "47", "682", "683", "999"]);

    input.data.products.reverse();
    const reversedCollisionIds = importReferenceCatalog(input).products
      .filter((product) =>
        product.readinessIssues.includes("duplicate-normalized-slug"),
      )
      .map((product) => product.id)
      .sort();
    expect(reversedCollisionIds).toEqual(collisionIds);
    expect(new Set(result.products.map((product) => product.slugFi)).size).toBe(109);
  });

  it("retains records whose required source facts are missing as not ready", () => {
    const input = structuredClone(rawCatalog);
    input.data.products.push({
      ...structuredClone(input.data.products[0]!),
      sourceId: 999,
      name: "",
      sourceUrl:
        "https://www.bambukogrindys.lt/lt/katalogas/product/999/missing-source-name/",
    });

    const result = importReferenceCatalog(input);

    expect(result.products).toHaveLength(109);
    expect(result.report.skippedProducts).toBe(0);
    expect(result.products.find((product) => product.id === "999")).toMatchObject({
      status: "notReady",
      nameFi: null,
      nameSource: null,
    });
    expect(result.report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "missing-name", sourceId: "999" }),
      ]),
    );
  });

  it("rejects unsafe media, non-document files and invalid relations", () => {
    const input = structuredClone(rawCatalog) as unknown as {
      data: { products: Record<string, unknown>[] };
    };
    input.data.products.push({
      ...structuredClone(input.data.products[0]!),
      sourceId: 999,
      sourceUrl:
        "https://www.bambukogrindys.lt/lt/katalogas/product/999/valid-test-product/",
      images: [
        {
          url: "https://www.bambukogrindys.lt/uploads/e_catalog/not-an-image.exe",
          caption: null,
        },
      ],
      documents: [
        {
          url: "https://www.bambukogrindys.lt/uploads/e_catalog/not-a-document.jpg",
          title: "Asennusohje",
        },
      ],
      relatedProducts: [47, 999, 123456],
    });

    const result = importReferenceCatalog(input);
    const product = result.products.find((item) => item.id === "999");

    expect(product).toMatchObject({
      status: "notReady",
      images: [],
      documents: [],
      relatedProductIds: ["47"],
    });
    expect(result.report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-image", sourceId: "999" }),
        expect.objectContaining({ code: "invalid-document", sourceId: "999" }),
        expect.objectContaining({ code: "invalid-relation", sourceId: "999" }),
      ]),
    );
  });

  it("rejects and reports invalid specification units", () => {
    const input = structuredClone(rawCatalog) as unknown as {
      data: { products: Record<string, unknown>[] };
    };
    input.data.products.push({
      ...structuredClone(input.data.products[0]!),
      sourceId: 999,
      name: "Test product with invalid unit",
      sourceUrl:
        "https://www.bambukogrindys.lt/lt/katalogas/product/999/invalid-unit/",
      specifications: [
        { label: "Ilgis", value: "10", unit: "parsec" },
        { label: "Plotis", value: "20", unit: 123 },
      ],
    });

    const result = importReferenceCatalog(input);
    const product = result.products.find((item) => item.id === "999");

    expect(product).toMatchObject({
      status: "notReady",
      specifications: [],
      readinessIssues: expect.arrayContaining(["invalid-specification-unit"]),
    });
    expect(result.report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-specification-unit",
          sourceId: "999",
        }),
      ]),
    );
  });

  it("rejects and reports orphan category-parent relations", () => {
    const input = structuredClone(rawCatalog);
    const category = input.data.categories.find((item) => item.sourceId === 26)!;
    category.parentId = 123456;

    const result = importReferenceCatalog(input);

    expect(result.categories.some((item) => item.id === "26")).toBe(false);
    expect(result.report).toMatchObject({
      normalizedCategories: 21,
      skippedCategories: 1,
    });
    expect(result.report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "orphan-category-parent",
          sourceId: "26",
        }),
      ]),
    );
  });

  it("keeps representative category records independently translated", () => {
    const products = importReferenceCatalog(rawCatalog).products;
    const names = Object.fromEntries(
      products.map((product) => [product.id, product.nameFi]),
    );

    expect(names).toMatchObject({
      145: "Massiivibambu-jalkalista – karbonisoitu sävy, Treffert UV-lakka",
      160: "Massiivibambu-porrasnokka – luonnollinen sävy, Treffert UV-lakka",
      180: "Moso-bambusäle – luonnollinen sävy",
      200: null,
      322: "Moso-bambuseinäke – mustattu sävy",
      325: "Bambutapetti – poltettu vihreä sävy",
      536: null,
    });
  });

  it("keeps user-confirmed commerce separate from source price provenance", () => {
    const result = importReferenceCatalog(rawCatalog);
    const product = result.products.find(
      (item) => item.id === "53",
    );

    expect(product).toMatchObject({
      pricing: {
        amount: 60.5,
        currency: "EUR",
        basis: "€/m²",
        vatDisplay: null,
        checkedLabelFi: "Tarkistettu 12.9.2026",
        vatConfirmationFi: "ALV-käsittely vahvistetaan tarjouksessa",
      },
      delivery: {
        included: true,
        labelFi: "Toimitus sisältyy hintaan",
        noteFi: "Toimitusalue ja soveltaminen vahvistetaan tarjouksessa",
      },
      warranty: {
        durationMonths: 12,
        labelFi: "Takuu 12 kuukautta",
        noteFi: "Takuun kohde ja ehdot vahvistetaan kirjallisessa tarjouksessa",
      },
      sample: {
        available: true,
        labelFi: "Näyte saatavilla",
        actionLabelFi: "Pyydä näyte",
      },
    });

    const sourceCommerceLabels = new Set([
      "Grindų skaičiuoklė",
      "Reikalingas m² kiekis",
      "Sandėlyje",
      "m² pakuotėse",
      "Pakuotės kaina",
      "Kaina iš viso",
      "Prekė užsakoma, tiekimo terminas - <br>",
      "Produktas",
    ]);
    expect(
      result.products.flatMap((item) => item.specifications).filter(
        (specification) => sourceCommerceLabels.has(specification.sourceLabel),
      ),
    ).toEqual([]);
  });

  it("hides prices without a source URL or valid raw extraction date", () => {
    const current = importReferenceCatalog(rawCatalog);
    expect(current.products.find((product) => product.id === "200")).toMatchObject({
      status: "notReady",
      pricing: {
        status: "hidden",
        sourceUrl: null,
        extractedAt: "2026-09-12",
      },
      readinessIssues: expect.arrayContaining(["invalid-price-provenance"]),
    });

    const invalidDateInput = structuredClone(rawCatalog);
    invalidDateInput.data.extractedAt = "not-a-date";
    const invalidDate = importReferenceCatalog(invalidDateInput);
    expect(invalidDate.report.extractedAt).toBeNull();
    expect(invalidDate.products.find((product) => product.id === "53")).toMatchObject({
      status: "notReady",
      source: { extractedAt: null },
      pricing: {
        status: "hidden",
        sourceUrl:
          "https://www.bambukogrindys.lt/lt/katalogas/product/53/naturalios-bambuko-masyvo-grindys-karbonizuota-spalva-uv-treffert-lakas/",
        extractedAt: null,
      },
      readinessIssues: expect.arrayContaining([
        "invalid-source-date",
        "invalid-price-provenance",
      ]),
    });
  });

  it("does not expose untranslated Lithuanian product-name fragments", () => {
    const products = importReferenceCatalog(rawCatalog).products;
    const untranslated = products.filter(
      (product) =>
        product.nameFi !== null &&
        /[\u0105čęėįšųūž]|\b(?:bambuko|grindys|spalva|sluoksniai|terasos|alyva|lakas|paviršius|plokštė|iš|pozicija|hidroizoliacinis|poliuretaninis|gruntas)\b/iu.test(
          product.nameFi,
        ),
    );

    expect(untranslated.map((product) => product.id)).toEqual([]);
  });
});
