import type { Metadata } from "next";

import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import { getPrivacyNoticeByPath } from "@/data/privacy";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

import styles from "@/components/forms/inquiry-form.module.css";

const privacyNotice = getPrivacyNoticeByPath("/fi/tietosuoja");

if (!privacyNotice) {
  throw new Error("Privacy notice route is not registered");
}

const registeredPrivacyNotice = privacyNotice;

const companyName = siteConfig.company.legalName ?? siteConfig.company.displayName;

export const metadata: Metadata = createPageMetadata({
  title: companyName
    ? `${registeredPrivacyNotice.title} | ${companyName}`
    : registeredPrivacyNotice.title,
  description: registeredPrivacyNotice.metaDescription,
  path: registeredPrivacyNotice.path,
  indexable: true,
});

export default function PrivacyPolicyPage() {
  const { company, contact } = siteConfig;

  return (
    <main>
      <Section tone="cream">
        <Container>
          <nav aria-label="Murupolku" className={styles.breadcrumbs}>
            <a href="/fi">Koti</a> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">{registeredPrivacyNotice.title}</span>
          </nav>
          <Eyebrow>{registeredPrivacyNotice.eyebrow}</Eyebrow>
          <Heading as="h1" size="display">
            {registeredPrivacyNotice.title}
          </Heading>
          <p className={styles.introduction}>
            Tämä seloste koskee tällä sivustolla lähetettäviä yhteydenotto-,
            tarjous- ja näytepyyntölomakkeita.
          </p>
        </Container>
      </Section>
      <Section tone="page">
        <Container>
          <section aria-labelledby="rekisterinpitaja">
            <Heading as="h2" id="rekisterinpitaja" size="page">
              Rekisterinpitäjä
            </Heading>
            <dl className={styles.contactDetails}>
              {companyName ? <div><dt>Yritys</dt><dd>{companyName}</dd></div> : null}
              {company.businessId ? <div><dt>Rekisterikoodi</dt><dd>{company.businessId}</dd></div> : null}
              {company.vatId ? <div><dt>ALV-tunnus</dt><dd>{company.vatId}</dd></div> : null}
              {company.address ? <div><dt>Rekisteröity osoite</dt><dd>{company.address}</dd></div> : null}
              {contact.phone && contact.phoneHref ? (
                <div><dt>Puhelin</dt><dd><a href={contact.phoneHref}>{contact.phone}</a></dd></div>
              ) : null}
            </dl>
          </section>
          {registeredPrivacyNotice.sections.map((section) => (
            <section aria-labelledby={section.id} key={section.id}>
              <Heading as="h2" id={section.id} size="page">
                {section.title}
              </Heading>
              {section.blocks.map((block, index) => block.type === "paragraph" ? (
                <p key={`${section.id}-${index}`}>{block.text}</p>
              ) : (
                <ul key={`${section.id}-${index}`}>
                  {block.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ))}
            </section>
          ))}
        </Container>
      </Section>
    </main>
  );
}
