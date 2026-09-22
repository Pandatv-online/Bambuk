import type { Metadata } from "next";

import { ContactForm } from "@/components/forms";
import { Container, Heading, Section } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

import styles from "@/components/forms/inquiry-form.module.css";

const companyName = siteConfig.company.legalName ?? siteConfig.company.displayName;
const marketLabels = { FI: "Suomessa", EE: "Virossa" } as const;

const formatServedMarkets = (markets: readonly ("FI" | "EE")[]): string =>
  markets.map((market) => marketLabels[market]).join(" ja ");

export const metadata: Metadata = createPageMetadata({
  title: companyName ? `Yhteystiedot | ${companyName}` : "Yhteystiedot",
  description: companyName
    ? `Ota yhteyttä ${companyName}:hen tai sovi näytteiden katselusta puhelimitse.`
    : "Ota yhteyttä tai sovi näytteiden katselusta puhelimitse.",
  path: "/fi/yhteystiedot",
  indexable: false,
});

// The anti-spam start timestamp must be fresh even when JavaScript is unavailable.
export const dynamic = "force-dynamic";

export default function ContactPage() {
  const { company, contact } = siteConfig;
  const servedMarkets = formatServedMarkets(company.servedMarkets);

  return (
    <main>
      <Section tone="cream">
        <Container>
          <nav aria-label="Murupolku" className={styles.breadcrumbs}>
            <a href="/fi">Koti</a> <span aria-hidden="true">/</span> <span aria-current="page">Yhteystiedot</span>
          </nav>
          <Heading as="h1" size="display">Yhteystiedot</Heading>
          {company.displayName && servedMarkets ? (
            <p>
              {company.registrationCountry === "EE" ? "Virossa rekisteröity " : ""}
              {company.displayName} palvelee asiakkaita {servedMarkets}.
            </p>
          ) : null}
          <dl className={styles.contactDetails}>
            <div><dt>Yritys</dt><dd>{company.displayName}</dd></div>
            {company.businessId ? <div><dt>Rekisterikoodi</dt><dd>{company.businessId}</dd></div> : null}
            {company.vatId ? <div><dt>ALV-tunnus</dt><dd>{company.vatId}</dd></div> : null}
            {company.address ? <div><dt>Rekisteröity osoite</dt><dd>{company.address}</dd></div> : null}
            {contact.phone && contact.phoneHref ? <div><dt>Puhelin</dt><dd><a href={contact.phoneHref}>{contact.phone}</a></dd></div> : null}
            {contact.hours ? <div><dt>Yhteydenottoajat</dt><dd>{contact.hours}</dd></div> : null}
            {contact.visitWording ? <div><dt>Näytteiden katselu</dt><dd>{contact.visitWording}</dd></div> : null}
          </dl>
        </Container>
      </Section>
      <Section tone="page">
        <Container>
          <Heading as="h2" size="page">Lähetä viesti</Heading>
          <p className={styles.introduction}>Kerro, miten voimme auttaa. Voit jättää joko puhelinnumeron tai sähköpostiosoitteen.</p>
          <ContactForm sourceUrl="/fi/yhteystiedot" />
        </Container>
      </Section>
    </main>
  );
}
