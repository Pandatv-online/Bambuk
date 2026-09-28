import type { Metadata } from "next";

import { QuoteForm } from "@/components/forms";
import { Container, Heading, Section } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

import styles from "@/components/forms/inquiry-form.module.css";

type QuoteSearchParams = Readonly<{
  tuote?: string | readonly string[];
  lahde?: string | readonly string[];
  asennus?: string | readonly string[];
}>;

const companyName = siteConfig.company.legalName ?? siteConfig.company.displayName;

export const metadata: Metadata = createPageMetadata({
  title: companyName ? `Pyydä tarjous | ${companyName}` : "Pyydä tarjous",
  description: companyName
    ? `Pyydä kirjallinen tarjous tuotteista tai asennuksesta ${companyName}:ltä.`
    : "Pyydä kirjallinen tarjous tuotteista tai asennuksesta.",
  path: "/fi/pyyda-tarjous",
  indexable: true,
});

const first = (value: string | readonly string[] | undefined): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const internalPath = (value: string | null, fallback: string): string =>
  value?.startsWith("/fi/") ? value : fallback;

export default async function QuotePage({
  searchParams,
}: Readonly<{ searchParams: Promise<QuoteSearchParams> }>) {
  const query = await searchParams;
  const productId = first(query.tuote);
  const installation = first(query.asennus) === "true";

  return (
    <main>
      <Section tone="cream">
        <Container>
          <nav aria-label="Murupolku" className={styles.breadcrumbs}>
            <a href="/fi">Koti</a> <span aria-hidden="true">/</span> <span aria-current="page">Pyydä tarjous</span>
          </nav>
          <Heading as="h1" size="display">Pyydä tarjous</Heading>
          <p className={styles.introduction}>Pyydä kirjallinen tarjous tuotteista, asennuksesta tai molemmista. Hinta, ALV-käsittely, toimitusalue ja asennuksen sisältö vahvistetaan tarjouksessa.</p>
        </Container>
      </Section>
      <Section tone="page">
        <Container>
          <QuoteForm
            inquiryType={installation ? "installation" : undefined}
            installationInterest={installation}
            productIds={productId ? [productId] : []}
            sourceUrl={internalPath(first(query.lahde), "/fi/pyyda-tarjous")}
          />
        </Container>
      </Section>
    </main>
  );
}
