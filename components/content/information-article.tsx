import Link from "next/link";

import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import type { PublishedInformationPage } from "@/data/content";

import styles from "./information-pages.module.css";

export type InformationArticleProps = Readonly<{
  page: PublishedInformationPage;
  relatedPages: readonly PublishedInformationPage[];
}>;

export function InformationArticle({
  page,
  relatedPages,
}: InformationArticleProps) {
  return (
    <main className={styles.page}>
      <Container>
        <nav className={styles.breadcrumbs} aria-label="Murupolku">
          <ol>
            <li>
              <Link href="/fi">Koti</Link>
            </li>
            <li>
              <Link href={{ pathname: "/fi/tietoa-bambusta" }}>
                Tietoa bambusta
              </Link>
            </li>
            <li aria-current="page">{page.title}</li>
          </ol>
        </nav>
      </Container>

      <Section tone="page">
        <Container>
          <header className={styles.intro}>
            <Eyebrow>{page.eyebrow}</Eyebrow>
            <Heading as="h1" size="display">
              {page.title}
            </Heading>
            <p>{page.summary}</p>
          </header>

          <div className={styles.articleLayout}>
            <div className={styles.content}>
              {page.sections.map((section) => (
                <section
                  className={styles.contentSection}
                  key={section.id}
                  aria-labelledby={section.id}
                >
                  <Heading as="h2" id={section.id} size="section">
                    {section.title}
                  </Heading>
                  {section.statements.map((statement, index) => (
                    <div className={styles.statement} key={`${section.id}-${index}`}>
                      <p>{statement.text}</p>
                      <p className={styles.applicability}>
                        <strong>Soveltuvuus:</strong> {statement.applicability}
                      </p>
                    </div>
                  ))}
                </section>
              ))}

              <aside className={styles.sourcePanel} aria-labelledby="lahdepohja">
                <Heading as="h2" id="lahdepohja" size="compact">
                  Lähdepohja
                </Heading>
                <p>
                  Sisältö on toimitettu valmistajan arkistoidusta aineistosta. Lähteet
                  ovat tutkimusvedoksia, eivät Osaühing IKB:n omia teknisiä lupauksia.
                </p>
                <ul>
                  {page.sources.map((source) => (
                    <li key={source.label}>{source.label}</li>
                  ))}
                </ul>
              </aside>
            </div>

            <aside className={styles.sidePanel} aria-labelledby="muut-oppaat">
              {page.relatedCategoryLinks.length ? (
                <div>
                  <Heading as="h2" size="compact">
                    Aiheeseen liittyvä tuoteryhmä
                  </Heading>
                  <ul>
                    {page.relatedCategoryLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          className={styles.sideLink}
                          href={{ pathname: link.href }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Heading as="h2" id="muut-oppaat" size="compact">
                Muut oppaat
              </Heading>
              <ul>
                {relatedPages.map((relatedPage) => (
                  <li key={relatedPage.slug}>
                    <Link
                      className={styles.sideLink}
                      href={{ pathname: relatedPage.path }}
                    >
                      {relatedPage.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </Section>
    </main>
  );
}
