import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InformationArticle } from "@/components/content";
import {
  getPublishedInformationPageBySlug,
  getPublishedInformationPages,
} from "@/data/content";
import { createPageMetadata } from "@/lib/seo";

type InformationPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedInformationPages().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: InformationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPublishedInformationPageBySlug(slug);

  if (!page) notFound();

  return createPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
    indexable: false,
  });
}

export default async function InformationPage({ params }: InformationPageProps) {
  const { slug } = await params;
  const page = getPublishedInformationPageBySlug(slug);

  if (!page) notFound();

  return (
    <InformationArticle
      page={page}
      relatedPages={getPublishedInformationPages().filter(
        (candidate) => candidate.slug !== page.slug,
      )}
    />
  );
}
