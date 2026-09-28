import type { Metadata } from "next";

import { GalleryExperience } from "@/components/gallery";
import { Breadcrumbs } from "@/components/navigation";
import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import {
  galleryPage,
  gallerySceneFilters,
  getGalleryOgImage,
  getGalleryPresentationItems,
} from "@/data/gallery";
import { createPageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

const galleryIsIndexable = galleryPage.status === "published";

export const metadata: Metadata = createPageMetadata({
  title: galleryPage.metaTitle,
  description: galleryPage.metaDescription,
  path: "/fi/galleria",
  image: getGalleryOgImage(),
  indexable: galleryIsIndexable,
});

export default function GalleryPage() {
  return (
    <main className={styles.page}>
      <Section className={styles.hero} tone="cream">
        <Container>
          <Breadcrumbs currentPath="/fi/galleria" />
          <div className={styles.heroContent}>
            <Eyebrow>Kuvagalleria</Eyebrow>
            <Heading as="h1" size="display">
              {galleryPage.title}
            </Heading>
            <p>{galleryPage.introduction}</p>
          </div>
        </Container>
      </Section>

      <Section className={styles.gallery} tone="page">
        <Container>
          <GalleryExperience
            filters={gallerySceneFilters}
            items={getGalleryPresentationItems()}
          />
        </Container>
      </Section>
    </main>
  );
}
