import {
  catalogCategories,
  getQuoteEligibleCatalogProducts,
} from "@/data/catalog";
import {
  getCatalogCategoryPath,
  getCatalogProductPath,
} from "@/lib/catalog/query";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog/types";

const catalogPrefix = "/fi/tuotteet/";

export type CatalogRouteBreadcrumb = Readonly<{
  label: string;
  href: `/fi/tuotteet${string}`;
}>;

export type CatalogCategoryRoute = Readonly<{
  kind: "category" | "collection";
  path: `/fi/tuotteet${string}`;
  category: CatalogCategory;
  childCategories: readonly CatalogCategory[];
  products: readonly CatalogProduct[];
  breadcrumbs: readonly CatalogRouteBreadcrumb[];
}>;

export type CatalogProductRoute = Readonly<{
  kind: "product";
  path: `/fi/tuotteet${string}`;
  product: CatalogProduct;
  category: CatalogCategory;
  breadcrumbs: readonly CatalogRouteBreadcrumb[];
}>;

export type ResolvedCatalogRoute = CatalogCategoryRoute | CatalogProductRoute;

const pathSegments = (path: `/fi/tuotteet${string}`): readonly string[] =>
  path.startsWith(catalogPrefix)
    ? path.slice(catalogPrefix.length).split("/").filter(Boolean)
    : [];

const sameSegments = (
  left: readonly string[],
  right: readonly string[],
): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const categoryAncestors = (
  category: CatalogCategory,
): readonly CatalogCategory[] => {
  const byId = new Map(catalogCategories.map((item) => [item.id, item]));
  const ancestors: CatalogCategory[] = [];
  const visited = new Set<string>();
  let current: CatalogCategory | undefined = category;

  while (current && current.parentId !== null) {
    if (visited.has(current.id)) return [];
    visited.add(current.id);
    ancestors.unshift(current);
    current = byId.get(current.parentId);
  }

  return current ? ancestors : [];
};

const categoryBreadcrumbs = (
  category: CatalogCategory,
): readonly CatalogRouteBreadcrumb[] =>
  categoryAncestors(category).flatMap((item) => {
    const href = getCatalogCategoryPath(item.id);
    return href ? [{ label: item.nameFi, href }] : [];
  });

const descendantCategoryIds = (categoryId: string): ReadonlySet<string> => {
  const ids = new Set([categoryId]);
  let found = true;
  while (found) {
    found = false;
    for (const category of catalogCategories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        found = true;
      }
    }
  }
  return ids;
};

export function resolveCatalogRoute(
  segments: readonly string[],
): ResolvedCatalogRoute | null {
  const products = getQuoteEligibleCatalogProducts();

  for (const product of products) {
    const path = getCatalogProductPath(product);
    if (!path || !sameSegments(pathSegments(path), segments)) continue;
    const category = catalogCategories.find((item) => item.id === product.categoryId);
    if (!category) return null;
    return {
      kind: "product",
      path,
      product,
      category,
      breadcrumbs: categoryBreadcrumbs(category),
    };
  }

  for (const category of catalogCategories) {
    const path = getCatalogCategoryPath(category.id);
    if (!path || !sameSegments(pathSegments(path), segments)) continue;
    const descendantIds = descendantCategoryIds(category.id);
    const categoryProducts = products.filter(
      (product) =>
        product.categoryId !== null && descendantIds.has(product.categoryId),
    );
    return {
      kind: products.some((product) => product.collectionId === category.id)
        ? "collection"
        : "category",
      path,
      category,
      childCategories: catalogCategories.filter(
        (item) => item.parentId === category.id,
      ),
      products: categoryProducts,
      breadcrumbs: categoryBreadcrumbs(category),
    };
  }

  return null;
}

export function getCatalogRouteParams(): readonly Readonly<{
  segments: string[];
}>[] {
  const categoryParams = catalogCategories.flatMap((category) => {
    const path = getCatalogCategoryPath(category.id);
    const segments = path ? pathSegments(path) : [];
    return segments.length ? [{ segments: [...segments] }] : [];
  });
  const productParams = getQuoteEligibleCatalogProducts().flatMap((product) => {
    const path = getCatalogProductPath(product);
    const segments = path ? pathSegments(path) : [];
    return segments.length ? [{ segments: [...segments] }] : [];
  });

  return [...categoryParams, ...productParams];
}
