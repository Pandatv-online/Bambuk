import evidence from "./supplemental-media-2026-09-23.json";

import type { CatalogCategory } from "@/lib/catalog/types";

export type CatalogCategoryMedia = Readonly<{
  src: `/images/categories/${string}`;
  sourceUrl: string;
  evidenceUrl: string;
  observedAt: string;
  rightsId: string;
}>;

export function getCatalogCategoryMedia(
  category: CatalogCategory,
): CatalogCategoryMedia | null {
  const record = evidence.categories.find((item) => item.sourceId === category.id);
  if (!record) return null;
  const source = new URL(record.imageUrl);
  const filename = source.pathname.split("/").at(-1);
  if (
    source.protocol !== "https:" ||
    source.hostname !== "www.bambukogrindys.lt" ||
    !filename?.match(new RegExp(`^catalog_${category.id}_[a-zA-Z0-9_-]+\\.(?:jpe?g|png)$`, "u")) ||
    record.sourceUrl !== category.source.url
  ) {
    throw new Error(`Invalid category media evidence for ${category.id}.`);
  }
  return {
    src: `/images/categories/${filename}`,
    sourceUrl: record.imageUrl,
    evidenceUrl: record.evidenceUrl,
    observedAt: evidence.extractedAt,
    rightsId: `manufacturer-reference-category-${category.id}`,
  };
}
