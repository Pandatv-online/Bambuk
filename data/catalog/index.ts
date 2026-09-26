import generatedCatalog from "./catalog.generated.json";
export { getCatalogCategoryMedia } from "./category-media";
export type { CatalogCategoryMedia } from "./category-media";
import type {
  CatalogCategory,
  CatalogImportReport,
  CatalogProduct,
} from "../../lib/catalog";

const catalog = generatedCatalog as unknown as Readonly<{
  categories: readonly CatalogCategory[];
  products: readonly CatalogProduct[];
  report: CatalogImportReport;
}>;

export const catalogCategories = catalog.categories;
export const catalogProducts = catalog.products;
export const catalogImportReport = catalog.report;

export const getCatalogCategoryById = (
  id: string,
): CatalogCategory | undefined =>
  catalogCategories.find((category) => category.id === id);

export const getCatalogProductById = (
  id: string,
): CatalogProduct | undefined =>
  catalogProducts.find((product) => product.id === id);

export const getReadyCatalogProducts = (): readonly CatalogProduct[] =>
  catalogProducts.filter((product) => product.status === "active");

export const getQuoteEligibleCatalogProducts = (): readonly CatalogProduct[] =>
  getReadyCatalogProducts();

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
  PublishedWarranty,
  ProductSpecification,
  SourcedValue,
} from "../../lib/catalog";
