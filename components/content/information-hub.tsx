import Link from "next/link";

import { Container, Eyebrow, Heading, Notice, Section } from "@/components/ui";
import type {
  PublishedInformationHub,
  PublishedInformationPage,
} from "@/data/content";

import styles from "./information-pages.module.css";

export type InformationHubProps = Readonly<{
  hub: PublishedInformationHub;
  pages: readonly PublishedInformationPage[];
}>;

export function InformationHubView({ hub, pages }: InformationHubProps) {
  return (
    <main className={styles.page}>
      <Container>
        <nav className={styles.breadcrumbs} aria-label="Murupolku">
          <ol>
            <li>
              <Link href="/fi">Koti</Link>
            </li>
            <li aria-current="page">Tietoa bambusta</li>
          </ol>
        </nav>
      </Container>

      <Section tone="page">
        <Container>
          <header className={styles.intro}>
            <Eyebrow>{hub.eyebrow}</Eyebrow>
            <Heading as="h1" size="display">
              {hub.title}
            </Heading>
            <p>{hub.summary}</p>
          </header>
          <Notice className={styles.notice}>
            Näiden oppaiden lähdepohja on tallennettu sisäisesti. Yksittäisen tuotteen
            tekniset ehdot tarkistetaan aina sen ajantasaisesta aineistosta.
          </Notice>
          <div className={styles.grid}>
            {pages.map((page) => (
              <article className={`${styles.informationCard} information-card`} key={page.slug}>
                <Heading as="h2" size="section">
                  {page.title}
                </Heading>
                <p>{page.summary}</p>
                <Link
                  className={styles.cardLink}
                  href={{ pathname: page.path }}
                >
                  Lue opas
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
