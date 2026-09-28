import type { Metadata } from "next";

import { CatalogShell } from "@/components/catalog/listing";
import { Container, Heading } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  parseCatalogQuery,
  queryProducts,
  type CatalogSearchParams,
} from "@/lib/catalog/query";

import styles from "@/components/catalog/listing/catalog-listing.module.css";

export async function generateMetadata({
  searchParams,
}: Readonly<{ searchParams: Promise<CatalogSearchParams> }>): Promise<Metadata> {
  const parsed = parseCatalogQuery(await searchParams);
  return createPageMetadata({
    title: siteConfig.company.displayName
      ? `Tuotteet | ${siteConfig.company.displayName}`
      : "Tuotteet",
    description: "Tutustu Suomen valikoiman bambulattioihin, bambulevyihin, sisustustuotteisiin sekä lattian asennus- ja hoitotuotteisiin.",
    path: "/fi/tuotteet",
    indexable: parsed.canonicalSearchParams === "" && parsed.ignoredParameters.length === 0,
  });
}

export default async function FinnishCatalogPage({
  searchParams,
}: Readonly<{ searchParams: Promise<CatalogSearchParams> }>) {
  const parsed = parseCatalogQuery(await searchParams);
  const result = queryProducts(parsed.query);

  return (
    <main className={styles.page}>
      <Container>
        <nav aria-label="Murupolku" className={styles.breadcrumb}>
          <a href="/fi">Koti</a> <span aria-hidden="true">/</span> <span aria-current="page">Tuotteet</span>
        </nav>
        <header className={styles.intro}>
          <Heading as="h1" size="display">Tuotteet</Heading>
          <p>Selaa aktiivista Suomen valikoimaa tuoteryhmän, malliston, sävyn, pinnan tai viimeistelyn mukaan. Hinta- ja saatavuustiedot näkyvät vain, kun niiden tila on vahvistettu.</p>
        </header>
        <CatalogShell query={parsed.query} result={result} />
      </Container>
    </main>
  );
}
