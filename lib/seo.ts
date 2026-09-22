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

type MetadataEnvironment = "development" | "production";

const metadataEnvironment = (): MetadataEnvironment =>
  process.env.NODE_ENV === "production" ? "production" : "development";

export function getMetadataBase(
  config: SiteConfig = siteConfig,
  environment: MetadataEnvironment = metadataEnvironment(),
): URL {
  if (environment === "production") {
    const siteUrl = config.siteUrl ? new URL(config.siteUrl) : null;
    if (!siteUrl || siteUrl.hostname === "localhost") {
      throw new Error("production metadata requires NEXT_PUBLIC_SITE_URL");
    }
    return siteUrl;
  }

  return new URL(config.siteUrl ?? DEVELOPMENT_SITE_URL);
}

export function createPageMetadata(
  input: PageMetadataInput,
  config: SiteConfig = siteConfig,
): Metadata {
  const metadataBase = getMetadataBase(config);
  const canonical = new URL(input.path, metadataBase);
  // Review is the safe default: a route must opt in after its release inputs are ready.
  const indexable = input.indexable ?? false;
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
