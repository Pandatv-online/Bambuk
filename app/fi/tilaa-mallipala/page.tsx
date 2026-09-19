import type { Metadata } from "next";

import { SampleRequestForm } from "@/components/forms";
import { Container, Heading, Section } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

import styles from "@/components/forms/inquiry-form.module.css";

type SampleSearchParams = Readonly<{
  tuote?: string | readonly string[];
  lahde?: string | readonly string[];
}>;

const companyName = siteConfig.company.legalName ?? siteConfig.company.displayName;

export const metadata: Metadata = createPageMetadata({
  title: companyName ? `Tilaa mallipala | ${companyName}` : "Tilaa mallipala",
  description: companyName
    ? `Pyydä mallipalaa ja sovi toimitustavasta ${companyName}:n kanssa.`
    : "Pyydä mallipalaa ja sovi toimitustavasta.",
  path: "/fi/tilaa-mallipala",
  indexable: false,
});

const first = (value: string | readonly string[] | undefined): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const internalPath = (value: string | null, fallback: string): string =>
  value?.startsWith("/fi/") ? value : fallback;

export default async function SampleRequestPage({
  searchParams,
}: Readonly<{ searchParams: Promise<SampleSearchParams> }>) {
  const query = await searchParams;

  return (
    <main>
      <Section tone="cream">
        <Container>
          <nav aria-label="Murupolku" className={styles.breadcrumbs}>
            <a href="/fi">Koti</a> <span aria-hidden="true">/</span> <span aria-current="page">Tilaa mallipala</span>
          </nav>
          <Heading as="h1" size="display">Tilaa mallipala</Heading>
          <p className={styles.introduction}>Valitse tuote ja toivottu toimitustapa. Näytteen toimitus ja mahdolliset ehdot vahvistetaan ennen lähetystä.</p>
        </Container>
      </Section>
      <Section tone="page">
        <Container>
          <SampleRequestForm
            productId={first(query.tuote) ?? ""}
            sourceUrl={internalPath(first(query.lahde), "/fi/tilaa-mallipala")}
          />
        </Container>
      </Section>
    </main>
  );
}
