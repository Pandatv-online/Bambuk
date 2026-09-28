import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CategoryDetailPage,
  getCatalogRouteParams,
  ProductDetailPage,
  resolveCatalogRoute,
} from "@/components/catalog/product";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

type CatalogCatchAllProps = Readonly<{
  params: Promise<{ segments: string[] }>;
}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getCatalogRouteParams()];
}

export async function generateMetadata({
  params,
}: CatalogCatchAllProps): Promise<Metadata> {
  const { segments } = await params;
  const route = resolveCatalogRoute(segments);
  if (!route) notFound();

  const title = `${
    route.kind === "product" ? route.product.nameFi ?? "Tuote" : route.category.nameFi
  }${siteConfig.company.displayName ? ` | ${siteConfig.company.displayName}` : ""}`;
  const description =
    route.kind === "product"
      ? route.product.summaryFi ??
        `Tutustu tuotteeseen ${route.product.nameFi ?? "tuote"} ja pyydä tarjous tai näyte.`
      : `Tutustu tuoteryhmän ${route.category.nameFi} aktiiviseen valikoimaan ja pyydä tarjous.`;
  const image =
    route.kind === "product"
      ? [...route.product.images].sort((left, right) => left.order - right.order)[0]
          ?.src
      : undefined;

  return createPageMetadata({
    title,
    description,
    path: route.path,
    image,
    indexable: true,
  });
}

export default async function FinnishCatalogCatchAllPage({
  params,
}: CatalogCatchAllProps) {
  const { segments } = await params;
  const route = resolveCatalogRoute(segments);
  if (!route) notFound();

  return route.kind === "product" ? (
    <ProductDetailPage route={route} />
  ) : (
    <CategoryDetailPage route={route} />
  );
}
