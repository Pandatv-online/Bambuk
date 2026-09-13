import {
  catalogCategories,
  getQuoteEligibleCatalogProducts,
} from "@/data/catalog";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog/types";

import {
  getCatalogAttributeLabel,
  toCatalogFacetValue,
  type CatalogAttributeFacet,
} from "./query-facet-labels";

export const CATALOG_PAGE_SIZE = 24;

export type CatalogSearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

export type CatalogSort =
  | "catalog"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

export type CatalogQuery = Readonly<{
  categorySlugs: readonly string[];
  collectionSlugs: readonly string[];
  colorValues: readonly string[];
  surfaceValues: readonly string[];
  finishValues: readonly string[];
  availability: "inStock" | null;
  sort: CatalogSort;
  page: number;
}>;

export type ParsedCatalogQuery = Readonly<{
  query: CatalogQuery;
  canonicalSearchParams: string;
  ignoredParameters: readonly string[];
}>;

export type CatalogFacetOption = Readonly<{
  value: string;
  label: string;
  count: number;
  sourceValues: readonly string[];
}>;

export type CatalogFacets = Readonly<{
  categories: readonly CatalogFacetOption[];
  collections: readonly CatalogFacetOption[];
  colors: readonly CatalogFacetOption[];
  surfaces: readonly CatalogFacetOption[];
  finishes: readonly CatalogFacetOption[];
}>;

export type CatalogQuerySource = Readonly<{
  products: readonly CatalogProduct[];
  categories: readonly CatalogCategory[];
}>;

export type CatalogQueryResult = Readonly<{
  items: readonly CatalogProduct[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: typeof CATALOG_PAGE_SIZE;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  facets: CatalogFacets;
}>;

const defaultSource = (): CatalogQuerySource => ({
  products: getQuoteEligibleCatalogProducts(),
  categories: catalogCategories,
});

const getDescendantIds = (
  categoryId: string,
  categories: readonly CatalogCategory[],
): ReadonlySet<string> => {
  const ids = new Set([categoryId]);
  let added = true;
  while (added) {
    added = false;
    for (const category of categories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        added = true;
      }
    }
  }
  return ids;
};

const categoryOptions = (
  source: CatalogQuerySource,
): readonly CatalogFacetOption[] =>
  source.categories
    .filter((category) => category.parentId !== null)
    .map((category) => {
      const ids = getDescendantIds(category.id, source.categories);
      return {
        value: category.slugFi,
        label: category.nameFi,
        count: source.products.filter(
          (product) => product.categoryId !== null && ids.has(product.categoryId),
        ).length,
        sourceValues: [category.id],
      };
    })
    .filter((option) => option.count > 0);

const collectionOptions = (
  source: CatalogQuerySource,
): readonly CatalogFacetOption[] => {
  const activeCollectionIds = new Set(
    source.products.flatMap((product) =>
      product.collectionId ? [product.collectionId] : [],
    ),
  );
  return source.categories
    .filter((category) => activeCollectionIds.has(category.id))
    .map((category) => ({
      value: category.slugFi,
      label: category.nameFi,
      count: source.products.filter(
        (product) => product.collectionId === category.id,
      ).length,
      sourceValues: [category.id],
    }));
};

const attributeOptions = (
  facet: CatalogAttributeFacet,
  source: CatalogQuerySource,
): readonly CatalogFacetOption[] => {
  const options = new Map<string, { label: string; sourceValues: string[]; count: number }>();
  for (const product of source.products) {
    const sourceValue = product.attributes[facet]?.value;
    if (!sourceValue) continue;
    const label = getCatalogAttributeLabel(facet, sourceValue);
    if (!label) continue;
    const value = toCatalogFacetValue(label);
    const current = options.get(value);
    if (current) {
      current.count += 1;
      if (!current.sourceValues.includes(sourceValue)) current.sourceValues.push(sourceValue);
    } else {
      options.set(value, { label, sourceValues: [sourceValue], count: 1 });
    }
  }
  return [...options.entries()]
    .map(([value, option]) => ({ value, ...option }))
    .sort((left, right) => left.label.localeCompare(right.label, "fi"));
};

export function getCatalogFacets(
  source: CatalogQuerySource = defaultSource(),
): CatalogFacets {
  return {
    categories: categoryOptions(source),
    collections: collectionOptions(source),
    colors: attributeOptions("color", source),
    surfaces: attributeOptions("surface", source),
    finishes: attributeOptions("finish", source),
  };
}

const valuesOf = (
  input: string | readonly string[] | undefined,
): readonly string[] =>
  typeof input === "string" ? [input] : input ?? [];

const readFacet = (
  key: string,
  input: string | readonly string[] | undefined,
  options: readonly CatalogFacetOption[],
  ignored: string[],
): readonly string[] => {
  const valid = new Set(options.map((option) => option.value));
  const selected = new Set<string>();
  for (const value of valuesOf(input)) {
    if (valid.has(value)) selected.add(value);
    else ignored.push(`${key}=${value}`);
  }
  return options.map((option) => option.value).filter((value) => selected.has(value));
};

const sortValues: Readonly<Record<string, CatalogSort>> = {
  oletus: "catalog",
  nimi: "name-asc",
  "nimi-laskeva": "name-desc",
  hinta: "price-asc",
  "hinta-laskeva": "price-desc",
};

const serializeCatalogQuery = (query: CatalogQuery): string => {
  const canonical = new URLSearchParams();
  for (const value of query.categorySlugs) canonical.append("kategoria", value);
  for (const value of query.collectionSlugs) canonical.append("mallisto", value);
  for (const value of query.colorValues) canonical.append("vari", value);
  for (const value of query.surfaceValues) canonical.append("pinta", value);
  for (const value of query.finishValues) canonical.append("viimeistely", value);
  if (query.availability) canonical.set("saatavuus", "varastossa");
  const canonicalSort = Object.entries(sortValues).find(
    ([, value]) => value === query.sort,
  )?.[0];
  if (canonicalSort && query.sort !== "catalog") {
    canonical.set("jarjestys", canonicalSort);
  }
  if (query.page > 1) canonical.set("sivu", String(query.page));
  return canonical.toString();
};

export function parseCatalogQuery(
  searchParams: CatalogSearchParams,
  source: CatalogQuerySource = defaultSource(),
): ParsedCatalogQuery {
  const facets = getCatalogFacets(source);
  const ignored: string[] = [];
  const categorySlugs = readFacet(
    "kategoria",
    searchParams.kategoria,
    facets.categories,
    ignored,
  );
  const collectionSlugs = readFacet(
    "mallisto",
    searchParams.mallisto,
    facets.collections,
    ignored,
  );
  const colorValues = readFacet("vari", searchParams.vari, facets.colors, ignored);
  const surfaceValues = readFacet(
    "pinta",
    searchParams.pinta,
    facets.surfaces,
    ignored,
  );
  const finishValues = readFacet(
    "viimeistely",
    searchParams.viimeistely,
    facets.finishes,
    ignored,
  );

  const availabilityValues = valuesOf(searchParams.saatavuus);
  const availability = availabilityValues.includes("varastossa")
    ? "inStock"
    : null;
  for (const value of availabilityValues) {
    if (value !== "varastossa") ignored.push(`saatavuus=${value}`);
  }

  const requestedSort = valuesOf(searchParams.jarjestys)[0];
  const sort = requestedSort ? sortValues[requestedSort] : "catalog";
  if (requestedSort && !sort) ignored.push(`jarjestys=${requestedSort}`);

  const requestedPage = valuesOf(searchParams.sivu)[0];
  const parsedPage = requestedPage && /^\d{1,5}$/u.test(requestedPage)
    ? Number.parseInt(requestedPage, 10)
    : 1;
  const page = parsedPage >= 1 ? parsedPage : 1;
  if (requestedPage && (parsedPage < 1 || !/^\d{1,5}$/u.test(requestedPage))) {
    ignored.push(`sivu=${requestedPage}`);
  }

  const knownKeys = new Set([
    "kategoria",
    "mallisto",
    "vari",
    "pinta",
    "viimeistely",
    "saatavuus",
    "jarjestys",
    "sivu",
  ]);
  for (const key of Object.keys(searchParams)) {
    if (!knownKeys.has(key)) ignored.push(key);
  }

  const query: CatalogQuery = {
    categorySlugs,
    collectionSlugs,
    colorValues,
    surfaceValues,
    finishValues,
    availability,
    sort: sort ?? "catalog",
    page,
  };

  return {
    query,
    canonicalSearchParams: serializeCatalogQuery(query),
    ignoredParameters: ignored,
  };
}

export function createCatalogUrl(
  query: CatalogQuery,
  patch: Readonly<Partial<Pick<CatalogQuery, "page" | "sort">>> = {},
): `/fi/tuotteet${string}` {
  const search = serializeCatalogQuery({ ...query, ...patch });
  return `/fi/tuotteet${search ? `?${search}` : ""}`;
}

const safeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export function getCatalogCategoryPath(
  categoryId: string,
  categories: readonly CatalogCategory[] = catalogCategories,
): `/fi/tuotteet${string}` | null {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const segments: string[] = [];
  const visited = new Set<string>();
  let current = byId.get(categoryId);
  if (!current) return null;

  while (current.parentId !== null) {
    if (visited.has(current.id) || !safeSlugPattern.test(current.slugFi)) return null;
    visited.add(current.id);
    segments.unshift(current.slugFi);
    current = byId.get(current.parentId);
    if (!current) return null;
  }

  return `/fi/tuotteet${segments.length ? `/${segments.join("/")}` : ""}`;
}

export function getCatalogProductPath(
  product: CatalogProduct,
  categories: readonly CatalogCategory[] = catalogCategories,
): `/fi/tuotteet${string}` | null {
  if (
    product.status !== "active" ||
    !product.nameFi ||
    !product.categoryId ||
    !safeSlugPattern.test(product.slugFi)
  ) {
    return null;
  }
  const categoryPath = getCatalogCategoryPath(product.categoryId, categories);
  return categoryPath ? `${categoryPath}/${product.slugFi}` : null;
}

const optionSourceValues = (
  selected: readonly string[],
  options: readonly CatalogFacetOption[],
): ReadonlySet<string> =>
  new Set(
    options
      .filter((option) => selected.includes(option.value))
      .flatMap((option) => option.sourceValues),
  );

const comparePrice = (left: CatalogProduct, right: CatalogProduct): number => {
  if (left.pricing.status === "hidden") {
    return right.pricing.status === "hidden" ? 0 : 1;
  }
  if (right.pricing.status === "hidden") return -1;
  return left.pricing.amount - right.pricing.amount;
};

export function queryProducts(
  query: CatalogQuery,
  source: CatalogQuerySource = defaultSource(),
): CatalogQueryResult {
  const facets = getCatalogFacets(source);
  const categoryIds = optionSourceValues(query.categorySlugs, facets.categories);
  const expandedCategoryIds = new Set<string>();
  for (const categoryId of categoryIds) {
    for (const id of getDescendantIds(categoryId, source.categories)) {
      expandedCategoryIds.add(id);
    }
  }
  const collectionIds = optionSourceValues(
    query.collectionSlugs,
    facets.collections,
  );
  const colors = optionSourceValues(query.colorValues, facets.colors);
  const surfaces = optionSourceValues(query.surfaceValues, facets.surfaces);
  const finishes = optionSourceValues(query.finishValues, facets.finishes);

  const filtered = source.products.filter((product) => {
    if (
      expandedCategoryIds.size > 0 &&
      (!product.categoryId || !expandedCategoryIds.has(product.categoryId))
    ) {
      return false;
    }
    if (
      collectionIds.size > 0 &&
      (!product.collectionId || !collectionIds.has(product.collectionId))
    ) {
      return false;
    }
    if (
      colors.size > 0 &&
      (!product.attributes.color || !colors.has(product.attributes.color.value))
    ) {
      return false;
    }
    if (
      surfaces.size > 0 &&
      (!product.attributes.surface || !surfaces.has(product.attributes.surface.value))
    ) {
      return false;
    }
    if (
      finishes.size > 0 &&
      (!product.attributes.finish || !finishes.has(product.attributes.finish.value))
    ) {
      return false;
    }
    return query.availability === null || product.availability.status === query.availability;
  });

  const ordered = filtered.map((product, index) => ({ product, index }));
  if (query.sort !== "catalog") {
    ordered.sort((left, right) => {
      let comparison = 0;
      if (query.sort === "name-asc" || query.sort === "name-desc") {
        comparison = (left.product.nameFi ?? "").localeCompare(
          right.product.nameFi ?? "",
          "fi",
        );
        if (query.sort === "name-desc") comparison *= -1;
      } else {
        comparison = comparePrice(left.product, right.product);
        if (
          query.sort === "price-desc" &&
          left.product.pricing.status === "published" &&
          right.product.pricing.status === "published"
        ) {
          comparison *= -1;
        }
      }
      return comparison || left.index - right.index;
    });
  }

  const totalItems = ordered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / CATALOG_PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * CATALOG_PAGE_SIZE;
  const items = ordered
    .slice(start, start + CATALOG_PAGE_SIZE)
    .map(({ product }) => product);

  return {
    items,
    totalItems,
    totalPages,
    page,
    pageSize: CATALOG_PAGE_SIZE,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
    facets,
  };
}
