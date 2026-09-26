import {
  getCategoryLabel,
  getSpecificationLabel,
  slugifyFinnish,
  translateProductName,
} from "./labels";
import { publishedWarranty } from "../../data/commercial";
import type {
  CatalogCategory,
  CatalogDocument,
  CatalogImage,
  CatalogImportIssue,
  CatalogImportResult,
  CatalogProduct,
  CatalogSource,
  ProductPricing,
  ProductSpecification,
  SourcedValue,
} from "./types";

type UnknownRecord = Record<string, unknown>;

const AUDIT_SNAPSHOT_PRODUCTS = 130 as const;
const CONFIRMED_AT = "2026-09-12" as const;
const PRODUCT_ASSET_HOSTS = new Set([
  "bambukogrindys.lt",
  "www.bambukogrindys.lt",
]);
const WAKOL_559_OFFICIAL_IMAGE =
  "https://www.wakol.com/ix_pim_assets/image/PU_280_360x430px_Web_Spiegelung__16791.png";
const PRICE_BASES: Readonly<Record<string, string>> = {
  "€/m²": "€/m²",
  "€/vnt": "€/kpl",
  "€/vnt.": "€/kpl",
  "€/m": "€/m",
  "€/pak": "€/pakkaus",
  "€/pak.": "€/pakkaus",
};
const NON_TECHNICAL_SPECIFICATION_LABELS = new Set([
  "Grindų skaičiuoklė",
  "Reikalingas m² kiekis",
  "Sandėlyje",
  "m² pakuotėse",
  "Pakuotės kaina",
  "Kaina iš viso",
  "Prekė užsakoma, tiekimo terminas - <br>",
  "Produktas",
]);
const SPECIFICATION_UNITS: Readonly<Record<string, string>> = {
  "%": "%",
  "°C": "°C",
  g: "g",
  kg: "kg",
  "kg/m3": "kg/m³",
  "kg/m³": "kg/m³",
  l: "l",
  m: "m",
  "m²": "m²",
  ml: "ml",
  mm: "mm",
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | null =>
  typeof value === "string" ? value.trim() : null;

const asNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const asIsoDate = (value: unknown): string | null => {
  const candidate = asString(value);
  if (!candidate || !/^\d{4}-\d{2}-\d{2}$/u.test(candidate)) return null;
  const date = new Date(`${candidate}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === candidate
    ? candidate
    : null;
};

const asArray = (value: unknown): readonly unknown[] =>
  Array.isArray(value) ? value : [];

const sourceIdOf = (value: unknown): string | null => {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return String(value);
  }
  if (typeof value === "string" && /^\d+$/u.test(value)) return value;
  return null;
};

const canonicalUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !PRODUCT_ASSET_HOSTS.has(url.hostname)) {
      return null;
    }
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
};

const assetFilename = (url: string): string | null => {
  const normalized = canonicalUrl(url);
  if (!normalized) return null;
  const filename = new URL(normalized).pathname.split("/").at(-1) ?? "";
  return /^[a-zA-Z0-9._-]+$/u.test(filename) ? filename : null;
};

const createSource = (
  url: string | null,
  sourceId: string,
  extractedAt: string | null,
): CatalogSource => ({ url, sourceId, extractedAt, locale: "lt" });

const getCategoryId = (product: UnknownRecord): number | null => {
  const breadcrumbs = asArray(product.categoryBreadcrumb);
  const last = breadcrumbs.at(-1);
  if (!isRecord(last)) return null;
  const url = asString(last.url);
  if (!url) return null;
  const normalizedUrl = canonicalUrl(url);
  if (!normalizedUrl) return null;
  const pathname = new URL(normalizedUrl).pathname.replace(/\/$/u, "");
  if (pathname === "/lt/katalogas") return 0;
  const match = pathname.match(/\/category\/(\d+)/u);
  return match ? Number(match[1]) : null;
};

/** Merge newer, product-specific media evidence without changing the original extraction. */
export function applySupplementalMedia(raw: unknown, supplement: unknown): unknown {
  if (!isRecord(raw) || !isRecord(raw.data) || !isRecord(supplement)) {
    throw new Error("Catalog media evidence must contain catalog and supplement records.");
  }
  if (!asIsoDate(supplement.extractedAt) || !canonicalUrl(asString(supplement.source) ?? "")) {
    throw new Error("Catalog media evidence requires a dated approved source.");
  }

  const copy = structuredClone(raw) as UnknownRecord;
  const data = copy.data as UnknownRecord;
  const categories = new Map(
    asArray(data.categories)
      .filter(isRecord)
      .map((category) => [sourceIdOf(category.sourceId), category] as const),
  );
  const products = new Map(
    asArray(data.products)
      .filter(isRecord)
      .map((product) => [sourceIdOf(product.sourceId), product] as const),
  );
  const seen = new Set<string>();

  for (const correction of asArray(supplement.products)) {
    if (!isRecord(correction)) throw new Error("Invalid supplemental product record.");
    const id = sourceIdOf(correction.sourceId);
    const categoryId = sourceIdOf(correction.categoryId);
    const product = id ? products.get(id) : null;
    const category = categoryId ? categories.get(categoryId) : null;
    const evidenceUrl = asString(correction.evidenceUrl);
    const sourceUrl = asString(correction.sourceUrl);
    if (
      !id || seen.has(id) || !product || !category || !evidenceUrl ||
      !canonicalUrl(evidenceUrl) ||
      (sourceUrl && (!canonicalUrl(sourceUrl) ||
        !new URL(sourceUrl).pathname.includes(`/product/${id}/`)))
    ) {
      throw new Error(`Invalid supplemental evidence for product ${id ?? "unknown"}.`);
    }
    seen.add(id);

    const images = asArray(correction.images);
    if (images.length > 0) {
      if (asArray(product.images).length > 0) {
        throw new Error(`Supplemental evidence would replace existing images for ${id}.`);
      }
      product.images = images.map((image) => {
        const url = isRecord(image) ? asString(image.url) : null;
        const officialWakolImage = id === "559" && url === WAKOL_559_OFFICIAL_IMAGE;
        const normalized = url ? (officialWakolImage ? url : canonicalUrl(url)) : null;
        if (!normalized || (!officialWakolImage &&
          !new URL(normalized).pathname.match(new RegExp(`/product_${id}_[1-9]\\d*\\.(?:jpe?g|png|webp)$`, "u")))) {
          throw new Error(`Image evidence does not belong to product ${id}.`);
        }
        return officialWakolImage
          ? {
              url: normalized,
              localFilename: "product_559_1.png",
              rightsId: "wakol-official-product-559",
              caption: null,
            }
          : { url: normalized, caption: null };
      });
    }

    if (getCategoryId(product) !== Number(categoryId)) {
      const breadcrumbs: Array<{ name: string; url: string }> = [];
      const visited = new Set<string>();
      let current: UnknownRecord | undefined = category;
      while (current) {
        const currentId = sourceIdOf(current.sourceId);
        const parentId = sourceIdOf(current.parentId);
        if (!currentId || visited.has(currentId)) {
          throw new Error(`Invalid supplemental category ancestry for ${id}.`);
        }
        visited.add(currentId);
        if (currentId !== "0") {
          const name = asString(current.name);
          const url = asString(current.url);
          if (!name || !url || !canonicalUrl(url)) {
            throw new Error(`Invalid supplemental category source for ${id}.`);
          }
          breadcrumbs.unshift({ name, url });
        }
        current = parentId ? categories.get(parentId) : undefined;
      }
      product.categoryBreadcrumb = breadcrumbs;
    }
  }
  return copy;
}

/** Restore product evidence while withholding unapproved Finnish commercial data. */
export function applySupplementalProductEvidence(raw: unknown, supplement: unknown): unknown {
  if (!isRecord(supplement)) throw new Error("Invalid product evidence supplement.");
  const extractedAt = asIsoDate(supplement.extractedAt);
  const source = asString(supplement.source);
  const categoryMatch = source && canonicalUrl(source)
    ? new URL(source).pathname.match(/^\/lt\/katalogas\/category\/(32|6)\/[^/]+\/$/u)
    : null;
  if (!extractedAt || !categoryMatch) {
    throw new Error("Product evidence requires a dated approved category source.");
  }
  const corrections = asArray(supplement.products);
  if (corrections.length === 0) throw new Error("Product evidence is empty.");
  const corrected = applySupplementalMedia(raw, {
    extractedAt,
    source,
    products: corrections.map((candidate) => {
      if (!isRecord(candidate)) throw new Error("Invalid product evidence record.");
      return {
        sourceId: candidate.sourceId,
        categoryId: candidate.categoryId,
        sourceUrl: candidate.sourceUrl,
        evidenceUrl: source,
        images: candidate.images ?? [],
      };
    }),
  }) as UnknownRecord;
  const data = corrected.data as UnknownRecord;
  const products = new Map(
    asArray(data.products).filter(isRecord).map((product) => [sourceIdOf(product.sourceId), product]),
  );
  for (const candidate of corrections) {
    if (!isRecord(candidate)) throw new Error("Invalid product evidence record.");
    const id = sourceIdOf(candidate.sourceId);
    const categoryId = sourceIdOf(candidate.categoryId);
    const title = asString(candidate.nameSource);
    const url = asString(candidate.sourceUrl);
    const product = id ? products.get(id) : null;
    if (
      !id || !product || categoryId !== categoryMatch[1] || !title || !url ||
      candidate.commercialPublication !== "quoteOnly" ||
      !canonicalUrl(url) ||
      !new URL(url).pathname.match(new RegExp(`^/lt/katalogas/product/${id}/[^/]+/(?:${categoryId}/)?$`, "u"))
    ) {
      throw new Error(`Invalid live category evidence for product ${id ?? "unknown"}.`);
    }
    product.name = title;
    product.sourceUrl = url;
    product.evidenceExtractedAt = extractedAt;
    product.commercialPublication = "quoteOnly";
  }
  return corrected;
}

const createPricing = (
  product: UnknownRecord,
  sourceUrl: string | null,
  sourceId: string,
  extractedAt: string | null,
  issues: CatalogImportIssue[],
): ProductPricing => {
  if (product.commercialPublication === "quoteOnly") {
    return {
      status: "hidden",
      amount: null,
      currency: null,
      basis: null,
      vatDisplay: null,
      checkedAt: null,
      checkedLabelFi: null,
      vatConfirmationFi: "Hinta vahvistetaan tarjouksessa",
      sourceUrl,
      extractedAt,
    };
  }
  const amount = asNumber(product.priceAmount);
  const currency = asString(product.currency);
  const sourceBasis = asString(product.priceBasis);
  const basis = sourceBasis ? PRICE_BASES[sourceBasis] : null;
  const hasAnyPricePart = amount !== null || currency !== null || sourceBasis !== null;
  const validPriceParts =
    amount !== null &&
    amount > 0 &&
    currency === "EUR" &&
    typeof basis === "string";
  const validProvenance = sourceUrl !== null && extractedAt !== null;

  if (!validPriceParts || !validProvenance) {
    if (hasAnyPricePart) {
      issues.push({
        code: validPriceParts ? "invalid-price-provenance" : "invalid-price",
        sourceId,
        detail: validPriceParts
          ? "Price was omitted because its product source URL or raw extraction date is invalid."
          : "Price was omitted because amount, EUR currency and a supported basis were not all present.",
      });
    }
    return {
      status: "hidden",
      amount: null,
      currency: null,
      basis: null,
      vatDisplay: null,
      checkedAt: CONFIRMED_AT,
      checkedLabelFi: "Tarkistettu 12.9.2026",
      vatConfirmationFi: "ALV-käsittely vahvistetaan tarjouksessa",
      sourceUrl,
      extractedAt,
    };
  }

  return {
    status: "published",
    amount,
    currency: "EUR",
    basis: basis as "€/m²" | "€/kpl" | "€/m" | "€/pakkaus",
    vatDisplay: asString(product.vatWording),
    checkedAt: CONFIRMED_AT,
    checkedLabelFi: "Tarkistettu 12.9.2026",
    vatConfirmationFi: "ALV-käsittely vahvistetaan tarjouksessa",
    sourceUrl,
    extractedAt,
  };
};

const normalizeSpecifications = (
  product: UnknownRecord,
  source: CatalogSource,
  issues: CatalogImportIssue[],
): readonly ProductSpecification[] => {
  const keyCounts = new Map<string, number>();
  const normalized: ProductSpecification[] = [];

  for (const candidate of asArray(product.specifications)) {
    if (!isRecord(candidate)) continue;
    const sourceLabel = asString(candidate.label);
    const value = asString(candidate.value);
    if (!sourceLabel || !value) continue;
    if (NON_TECHNICAL_SPECIFICATION_LABELS.has(sourceLabel)) continue;
    const hasSourceUnit = candidate.unit !== null && candidate.unit !== undefined;
    const sourceUnit = asString(candidate.unit);
    const unit = sourceUnit ? SPECIFICATION_UNITS[sourceUnit] : null;
    if (hasSourceUnit && !unit) {
      issues.push({
        code: "invalid-specification-unit",
        sourceId: source.sourceId,
        detail: `Specification ${sourceLabel} was omitted because unit ${sourceUnit ?? "(invalid type)"} is unsupported.`,
      });
      continue;
    }
    const translated = getSpecificationLabel(sourceLabel);
    if (!translated) continue;
    const baseKey = slugifyFinnish(translated);
    const count = (keyCounts.get(baseKey) ?? 0) + 1;
    keyCounts.set(baseKey, count);
    normalized.push({
      key: count === 1 ? baseKey : `${baseKey}-${count}`,
      labelFi: translated,
      sourceLabel,
      value,
      unit,
      source,
    });
  }

  return normalized;
};

const firstAttribute = (
  specifications: readonly ProductSpecification[],
  labels: readonly string[],
): SourcedValue | null => {
  const match = specifications.find((specification) =>
    labels.includes(specification.sourceLabel),
  );
  return match ? { value: match.value, source: match.source } : null;
};

const attributeList = (
  specifications: readonly ProductSpecification[],
  labels: readonly string[],
): readonly SourcedValue[] =>
  specifications
    .filter((specification) => labels.includes(specification.sourceLabel))
    .map((specification) => ({
      value: specification.value,
      source: specification.source,
    }));

const normalizeImages = (
  product: UnknownRecord,
  sourceId: string,
  nameFi: string | null,
  issues: CatalogImportIssue[],
): readonly CatalogImage[] => {
  const seen = new Set<string>();
  const images: CatalogImage[] = [];

  for (const candidate of asArray(product.images)) {
    if (!isRecord(candidate)) continue;
    const sourceValue = asString(candidate.url);
    const officialWakolImage = sourceId === "559" && sourceValue === WAKOL_559_OFFICIAL_IMAGE;
    const sourceUrl = sourceValue
      ? (officialWakolImage ? sourceValue : canonicalUrl(sourceValue))
      : null;
    const filename = officialWakolImage
      ? "product_559_1.png"
      : sourceUrl ? assetFilename(sourceUrl) : null;
    if (!sourceUrl || !filename || !/\.(?:avif|jpe?g|png|webp)$/iu.test(filename)) {
      issues.push({
        code: "invalid-image",
        sourceId,
        detail: "Image was omitted because it was not an HTTPS asset on the approved source host.",
      });
      continue;
    }
    if (seen.has(sourceUrl)) continue;
    seen.add(sourceUrl);
    images.push({
      src: `/images/products/${filename}`,
      altFi: nameFi ? `${nameFi}, kuva ${images.length + 1}` : `Tuotekuva ${images.length + 1}`,
      order: images.length + 1,
      rightsId: officialWakolImage
        ? "wakol-official-product-559"
        : `manufacturer-reference-product-${sourceId}`,
      sourceUrl,
      applicableProductIds: [sourceId],
    });
  }

  return images;
};

const normalizeDocuments = (
  product: UnknownRecord,
  sourceId: string,
  issues: CatalogImportIssue[],
): readonly CatalogDocument[] => {
  const documents: CatalogDocument[] = [];
  for (const [index, candidate] of asArray(product.documents).entries()) {
    if (!isRecord(candidate)) continue;
    const value = asString(candidate.url) ?? asString(candidate.sourceUrl);
    const sourceUrl = value ? canonicalUrl(value) : null;
    const filename = sourceUrl ? assetFilename(sourceUrl) : null;
    const sourceTitle = asString(candidate.title) ?? asString(candidate.name) ?? "";
    if (!sourceUrl || !filename || !/\.pdf$/iu.test(filename) || !sourceTitle) {
      issues.push({
        code: "invalid-document",
        sourceId,
        detail: "Document is incomplete and makes the affected product not ready.",
      });
      continue;
    }
    documents.push({
      id: `${sourceId}-document-${index + 1}`,
      titleFi: null,
      sourceTitle,
      file: `/documents/products/${filename}`,
      sourceUrl,
      applicability: [sourceId],
    });
  }
  return documents;
};

const relationId = (candidate: unknown): string | null => {
  const direct = sourceIdOf(candidate);
  if (direct) return direct;
  if (!isRecord(candidate)) return null;
  return sourceIdOf(candidate.sourceId) ?? sourceIdOf(candidate.id);
};

export const importReferenceCatalog = (raw: unknown): CatalogImportResult => {
  const issues: CatalogImportIssue[] = [];
  if (!isRecord(raw) || !isRecord(raw.data)) {
    issues.push({ code: "invalid-root", sourceId: null, detail: "Expected a data object." });
    return {
      categories: [],
      products: [],
      report: {
        extractedAt: null,
        auditSnapshotProducts: AUDIT_SNAPSHOT_PRODUCTS,
        sourceProducts: 0,
        uniqueSourceProducts: 0,
        auditDifference: AUDIT_SNAPSHOT_PRODUCTS,
        normalizedProducts: 0,
        skippedProducts: 0,
        sourceCategories: 0,
        normalizedCategories: 0,
        skippedCategories: 0,
        sourceImageReferences: 0,
        uniqueSourceImages: 0,
        mappedLocalImages: 0,
        verifiedLocalImages: 0,
        sourceDocuments: 0,
        mappedLocalDocuments: 0,
        verifiedLocalDocuments: 0,
        notReadyProducts: 0,
        issues,
      },
    };
  }

  const data = raw.data;
  const extractedAt = asIsoDate(data.extractedAt);
  const rawCategories = asArray(data.categories);
  const rawProducts = asArray(data.products);
  let categories: CatalogCategory[] = [];
  const categoryIds = new Set<string>();

  for (const candidate of rawCategories) {
    if (!isRecord(candidate)) continue;
    const sourceId = sourceIdOf(candidate.sourceId);
    const numericId = sourceId ? Number(sourceId) : Number.NaN;
    const sourceName = asString(candidate.name);
    const sourceUrl = asString(candidate.url);
    const label = Number.isFinite(numericId) ? getCategoryLabel(numericId) : null;
    if (!sourceId || !sourceName || !sourceUrl || !canonicalUrl(sourceUrl) || !label) {
      issues.push({
        code: "invalid-category",
        sourceId,
        detail: "Category is missing an approved ID, source name, source URL or Finnish label.",
      });
      continue;
    }
    if (categoryIds.has(sourceId)) {
      issues.push({ code: "duplicate-category-id", sourceId, detail: "Duplicate category ID." });
      continue;
    }
    categoryIds.add(sourceId);
    categories.push({
      id: sourceId,
      parentId: sourceIdOf(candidate.parentId),
      nameFi: label[0],
      nameSource: sourceName,
      slugFi: label[1],
      source: createSource(canonicalUrl(sourceUrl)!, sourceId, extractedAt),
    });
  }

  let removedOrphanCategory = true;
  while (removedOrphanCategory) {
    removedOrphanCategory = false;
    for (const category of categories) {
      if (
        category.parentId !== null &&
        (category.parentId === category.id || !categoryIds.has(category.parentId))
      ) {
        issues.push({
          code: "orphan-category-parent",
          sourceId: category.id,
          detail: `Parent category ${category.parentId} is not present in the normalized category registry.`,
        });
        categoryIds.delete(category.id);
        removedOrphanCategory = true;
      }
    }
    if (removedOrphanCategory) {
      categories = categories.filter((category) => categoryIds.has(category.id));
    }
  }

  const rawProductIds = rawProducts
    .filter(isRecord)
    .map((product) => sourceIdOf(product.sourceId))
    .filter((id): id is string => id !== null);
  const uniqueProductIds = new Set(rawProductIds);
  const seenProductIds = new Set<string>();
  let products: CatalogProduct[] = [];

  for (const candidate of rawProducts) {
    if (!isRecord(candidate)) continue;
    const sourceId = sourceIdOf(candidate.sourceId);
    if (!sourceId) continue;
    if (seenProductIds.has(sourceId)) {
      issues.push({ code: "duplicate-product-id", sourceId, detail: "Duplicate product ID." });
      continue;
    }
    seenProductIds.add(sourceId);

    const rawName = asString(candidate.name);
    const nameSource = rawName && !/^Product \d+$/u.test(rawName) ? rawName : null;
    const rawUrl = asString(candidate.sourceUrl);
    const sourceUrl = rawUrl ? canonicalUrl(rawUrl) : null;
    const observedCategoryId = getCategoryId(candidate);
    const categoryId =
      observedCategoryId !== null && categoryIds.has(String(observedCategoryId))
        ? String(observedCategoryId)
        : null;
    const issueStart = issues.length;

    if (extractedAt === null) {
      issues.push({
        code: "invalid-source-date",
        sourceId,
        detail: "The raw extraction date is missing or is not a valid ISO calendar date.",
      });
    }

    if (nameSource === null) {
      issues.push({ code: "missing-name", sourceId, detail: "No product name in source evidence." });
    }
    if (sourceUrl === null) {
      issues.push({
        code: "missing-source-url",
        sourceId,
        detail: "No canonical product source URL in the extraction.",
      });
    }
    if (categoryId === null) {
      issues.push({
        code: "orphan-category",
        sourceId,
        detail: `Category ${observedCategoryId ?? "(missing)"} is not present in the category registry.`,
      });
    }

    const source = createSource(sourceUrl, sourceId, asIsoDate(candidate.evidenceExtractedAt) ?? extractedAt);
    const nameFi = nameSource ? translateProductName(nameSource) : null;
    const normalizedSlug = slugifyFinnish(nameFi ?? `tuote-${sourceId}`);
    const specifications = normalizeSpecifications(candidate, source, issues);
    const pricing = createPricing(candidate, sourceUrl, sourceId, extractedAt, issues);
    const images = normalizeImages(candidate, sourceId, nameFi, issues);
    const documents = normalizeDocuments(candidate, sourceId, issues);
    const relatedProductIds: string[] = [];
    for (const relation of asArray(candidate.relatedProducts)) {
      const relatedId = relationId(relation);
      if (!relatedId || relatedId === sourceId || !uniqueProductIds.has(relatedId)) {
        issues.push({
          code: "invalid-relation",
          sourceId,
          detail: `Related product ${relatedId ?? "(missing)"} is invalid.`,
        });
        continue;
      }
      if (!relatedProductIds.includes(relatedId)) relatedProductIds.push(relatedId);
    }

    const productIssues = issues
      .slice(issueStart)
      .filter((issue) => issue.sourceId === sourceId);
    const category = categoryId
      ? categories.find((item) => item.id === categoryId)
      : undefined;
    products.push({
      id: sourceId,
      status: productIssues.length === 0 ? "active" : "notReady",
      readinessIssues: productIssues.map((issue) => issue.code),
      slugFi: `${normalizedSlug}-${sourceId}`,
      sku: asString(candidate.sku)?.replace(/\\_/g, "_") ?? null,
      nameFi,
      nameSource,
      summaryFi: null,
      descriptionFi: null,
      categoryId,
      collectionId: category?.parentId === "2" ? categoryId : null,
      brand: asString(candidate.brand),
      attributes: {
        color: firstAttribute(specifications, [
          "Spalva",
          "Grindų spalva",
          "Grindų paviršiaus spalva",
          "Bazinė grindlentės spalva",
          "Bazinė grindų spalva",
        ]),
        surface: firstAttribute(specifications, ["Paviršiaus apdaila"]),
        finish: firstAttribute(specifications, ["Apdaila", "Paviršiaus dengimas"]),
        dimensions: attributeList(specifications, [
          "Ilgis",
          "Plotis",
          "Aukštis",
          "Storis",
          "Matmenys",
          "Matmenys (mm)",
        ]),
        package: attributeList(specifications, ["Pakuotės dydis", "Svoris"]),
        installation: attributeList(specifications, ["Klojimo būdas", "Montavimas"]),
      },
      specifications,
      pricing,
      availability: { status: "inStock", confirmedBy: "user", confirmedAt: CONFIRMED_AT },
      delivery: {
        included: true,
        labelFi: "Toimitus sisältyy hintaan",
        applicability: "pendingOfferConfirmation",
        noteFi: "Toimitusalue ja soveltaminen vahvistetaan tarjouksessa",
      },
      warranty: publishedWarranty,
      sample: {
        available: true,
        labelFi: "Näyte saatavilla",
        actionLabelFi: "Pyydä näyte",
      },
      images,
      documents,
      relatedProductIds,
      source,
    });
  }

  const normalizedSlugGroups = new Map<string, string[]>();
  for (const product of products) {
    if (!product.nameFi) continue;
    const normalizedSlug = slugifyFinnish(product.nameFi);
    const group = normalizedSlugGroups.get(normalizedSlug) ?? [];
    group.push(product.id);
    normalizedSlugGroups.set(normalizedSlug, group);
  }
  const collidingProductIds = new Set<string>();
  const collisionGroups = [...normalizedSlugGroups.entries()]
    .filter(([, sourceIds]) => sourceIds.length > 1)
    .map(([slug, sourceIds]) => [slug, [...sourceIds].sort()] as const)
    .sort(([left], [right]) => left.localeCompare(right));
  for (const [slug, sourceIds] of collisionGroups) {
    for (const sourceId of sourceIds) {
      collidingProductIds.add(sourceId);
      issues.push({
        code: "duplicate-normalized-slug",
        sourceId,
        detail: `Normalized slug ${slug} is shared by source products ${sourceIds.join(", ")}; the source-ID route suffix remains unique.`,
      });
    }
  }
  products = products.map<CatalogProduct>((product) =>
    collidingProductIds.has(product.id)
      ? {
          ...product,
          status: "notReady",
          readinessIssues: [
            ...product.readinessIssues,
            "duplicate-normalized-slug",
          ],
        }
      : product,
  );

  const sourceImageUrls = rawProducts
    .filter(isRecord)
    .flatMap((product) => asArray(product.images))
    .filter(isRecord)
    .map((image) => asString(image.url))
    .filter((url): url is string => url !== null);
  const uniqueSourceImages = new Set(
    sourceImageUrls.map(canonicalUrl).filter((url): url is string => url !== null),
  );
  const sourceDocuments = rawProducts
    .filter(isRecord)
    .reduce((count, product) => count + asArray(product.documents).length, 0);

  return {
    categories,
    products,
    report: {
      extractedAt,
      auditSnapshotProducts: AUDIT_SNAPSHOT_PRODUCTS,
      sourceProducts: rawProducts.length,
      uniqueSourceProducts: uniqueProductIds.size,
      auditDifference: AUDIT_SNAPSHOT_PRODUCTS - uniqueProductIds.size,
      normalizedProducts: products.length,
      skippedProducts: rawProducts.length - products.length,
      sourceCategories: rawCategories.length,
      normalizedCategories: categories.length,
      skippedCategories: rawCategories.length - categories.length,
      sourceImageReferences: sourceImageUrls.length,
      uniqueSourceImages: uniqueSourceImages.size,
      mappedLocalImages: new Set(products.flatMap((product) => product.images.map((image) => image.src))).size,
      verifiedLocalImages: 0,
      sourceDocuments,
      mappedLocalDocuments: new Set(
        products.flatMap((product) => product.documents.map((document) => document.file)),
      ).size,
      verifiedLocalDocuments: 0,
      notReadyProducts: products.filter((product) => product.status === "notReady").length,
      issues,
    },
  };
};

export type {
  CatalogCategory,
  CatalogDocument,
  CatalogImage,
  CatalogImportIssue,
  CatalogImportReport,
  CatalogImportResult,
  CatalogProduct,
  CatalogSource,
  ProductPricing,
  ProductSpecification,
  SourcedValue,
} from "./types";
