import type { Metadata } from "next";

import { siteConfig, type SiteConfig } from "./site-config";

export type PageMetadataInput = Readonly<{
  title: string;
  description: string;
  path: `/${string}`;
  image?: `/${string}`;
  indexable?: boolean;
}>;

export const DEVELOPMENT_SITE_URL = "http://localhost:3000";

export function getMetadataBase(config: SiteConfig = siteConfig): URL {
  return new URL(config.siteUrl ?? DEVELOPMENT_SITE_URL);
}

export function createPageMetadata(
  input: PageMetadataInput,
  config: SiteConfig = siteConfig,
): Metadata {
  const metadataBase = getMetadataBase(config);
  const canonical = new URL(input.path, metadataBase);
  const indexable = input.indexable ?? true;
  const images = input.image
    ? [
        {
          url: new URL(input.image, metadataBase).toString(),
          alt: input.title,
        },
      ]
    : undefined;

  return {
    metadataBase,
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "fi_FI",
      title: input.title,
      description: input.description,
      url: canonical.toString(),
      images,
    },
    robots: {
      index: indexable,
      follow: indexable,
    },
  };
}
