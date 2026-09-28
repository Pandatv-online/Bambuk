import type { MetadataRoute } from "next";

import { getCatalogRouteParams } from "@/components/catalog/product";
import { getPublishedInformationPages } from "@/data/content";
import { galleryPage } from "@/data/gallery";
import { homepageContent } from "@/data/homepage";
import { privacyNotice } from "@/data/privacy";
import { getMetadataBase } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...(homepageContent.status === "published" ? ["/fi"] : []),
    "/fi/tuotteet",
    ...getCatalogRouteParams().map(({ segments }) =>
      `/fi/tuotteet/${segments.join("/")}`,
    ),
    "/fi/tietoa-bambusta",
    ...getPublishedInformationPages().map(({ path }) => path),
    ...(galleryPage.status === "published" ? ["/fi/galleria"] : []),
    "/fi/yhteystiedot",
    "/fi/pyyda-tarjous",
    "/fi/tilaa-mallipala",
    privacyNotice.path,
  ];
  const base = getMetadataBase();

  return [...new Set(paths)].map((path) => ({
    url: new URL(path, base).toString(),
  }));
}
