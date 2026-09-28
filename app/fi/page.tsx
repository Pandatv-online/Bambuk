import type { Metadata } from "next";
import Image from "next/image";

import { CatalogProductCard } from "@/components/catalog/listing";
import { GalleryExperience } from "@/components/gallery";
import { ResponsiveMedia } from "@/components/media";
import {
  Button,
  CallToAction,
  Container,
  Eyebrow,
  Heading,
  Notice,
  Section,
} from "@/components/ui";
import { homepageContent } from "@/data";
import {
  catalogCategories,
  getCatalogCategoryMedia,
  getQuoteEligibleCatalogProducts,
} from "@/data/catalog";
import { getPublishedInformationPages } from "@/data/content";
import {
  gallerySceneFilters,
  getHomepageGalleryPresentationItems,
} from "@/data/gallery";
import { getCatalogCategoryPath } from "@/lib/catalog/query";
import { createPageMetadata } from "@/lib/seo";

const homepageCategories = catalogCategories.flatMap((category) => {
  if (category.parentId !== "0") return [];
  const href = getCatalogCategoryPath(category.id);
  return href ? [{
    id: category.id,
    href,
    label: category.nameFi,
    media: getCatalogCategoryMedia(category),
  }] : [];
});
const homepageProducts = getQuoteEligibleCatalogProducts().slice(0, 5);
const homepageGuides = getPublishedInformationPages().slice(0, 3);

const homepageIsIndexable = homepageContent.status === "published";
export const metadata: Metadata = createPageMetadata({
  title: homepageContent.title,
  description: homepageContent.metaDescription,
  path: "/fi",
  image: homepageContent.hero.image.src,
  indexable: homepageIsIndexable,
});

export default function FinnishHomepage() {
  return (
    <main className="home-page">
      <section id="alku" className="home-hero" aria-labelledby="home-title">
        <ResponsiveMedia
          className="home-hero__media"
          image={homepageContent.hero.image}
          placeholderAlt="Bambulattian materiaalikuva"
          preload
          sizes="100vw"
        />
        <div className="home-hero__shade" aria-hidden="true" />
        <Container className="home-hero__content">
          <Eyebrow>{homepageContent.hero.eyebrow}</Eyebrow>
          <Heading as="h1" id="home-title" size="display">
            {homepageContent.title}
          </Heading>
          <p className="home-hero__summary">{homepageContent.hero.summary}</p>
          <div className="home-hero__actions">
            <Button href={homepageContent.primaryCta.href}>
              {homepageContent.primaryCta.label}
            </Button>
            <Button href={homepageContent.secondaryCta.href} variant="secondary">
              {homepageContent.secondaryCta.label}
            </Button>
          </div>
        </Container>
      </section>

      <Section id="bambulattiat" className="home-introduction" tone="page">
        <Container className="home-introduction__inner">
          <Heading as="h2" size="page">
            {homepageContent.introduction.heading}
          </Heading>
          <div>
            <p>{homepageContent.introduction.body}</p>
            <Button href={homepageContent.introduction.link.href} variant="text">
              {homepageContent.introduction.link.label}
            </Button>
          </div>
        </Container>
      </Section>

      <Section id="tuoteryhmat" tone="cream">
        <Container>
          <header className="home-section-heading">
            <Eyebrow>{homepageContent.categorySection.eyebrow}</Eyebrow>
            <Heading as="h2" size="page">
              {homepageContent.categorySection.heading}
            </Heading>
            <p>{homepageContent.categorySection.introduction}</p>
          </header>
          <div className="homepage-catalog-grid">
            {homepageCategories.map((category) => (
              <a className="homepage-catalog-card" href={category.href} key={category.id}>
                {category.media ? (
                  <div className="homepage-catalog-card__media">
                    <Image
                      alt=""
                      width={800}
                      height={450}
                      sizes="(min-width: 61.25rem) 25vw, (min-width: 48rem) 50vw, 100vw"
                      src={category.media.src}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        maxHeight: "180px",
                        aspectRatio: "16 / 9",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : null}
                <div className="homepage-catalog-card__content">
                  <strong style={{ display: "block" }}>{category.label}</strong>
                  <small style={{ display: "block" }}>Tutustu tuoteryhmään</small>
                </div>
              </a>
            ))}
          </div>
          <Button href="/fi/tuotteet" variant="text">
            Näytä kaikki tuotteet
          </Button>
        </Container>
      </Section>

      <Section id="galleria" tone="page">
        <Container>
          <header className="home-section-heading">
            <Eyebrow>{homepageContent.gallery.eyebrow}</Eyebrow>
            <Heading as="h2" size="page">
              {homepageContent.gallery.heading}
            </Heading>
            <p>{homepageContent.gallery.introduction}</p>
          </header>
          <GalleryExperience
            filters={gallerySceneFilters}
            items={getHomepageGalleryPresentationItems()}
          />
          <Button href="/fi/galleria" variant="text">
            Avaa koko galleria
          </Button>
        </Container>
      </Section>

      <Section id="tietoa" className="home-decisions" tone="white">
        <Container>
          <header className="home-section-heading home-section-heading--centered">
            <Eyebrow>{homepageContent.decisionTopics.eyebrow}</Eyebrow>
            <Heading as="h2" size="page">
              {homepageContent.decisionTopics.heading}
            </Heading>
            <p>{homepageContent.decisionTopics.introduction}</p>
          </header>
          <div className="decision-grid">
            {homepageContent.decisionTopics.items.map((item) => (
              <article className="decision-card" key={item.title}>
                <span className="decision-card__mark" aria-hidden="true" />
                <Heading as="h3" size="compact">
                  {item.title}
                </Heading>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="tuotevalikoima" className="home-featured" tone="page">
        <Container>
          <header className="home-section-heading">
            <Eyebrow>{homepageContent.featuredProducts.eyebrow}</Eyebrow>
            <Heading as="h2" size="page">
              {homepageContent.featuredProducts.heading}
            </Heading>
          </header>
          <p className="homepage-product-introduction">
            {homepageContent.featuredProducts.pendingMessage}
          </p>
          <div className="homepage-product-grid">
            {homepageProducts.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
          <Button href="/fi/tuotteet" variant="text">
            Selaa koko valikoimaa
          </Button>
        </Container>
      </Section>

      <Section id="asennus" className="home-installation" tone="cream">
        <Container className="home-installation__inner">
          <ResponsiveMedia
            className="home-installation__media"
            image={homepageContent.installation.image}
            placeholderAlt="Asennustyön kuva"
            sizes="(min-width: 48rem) 50vw, 100vw"
          />
          <div className="home-installation__content">
            <Eyebrow>{homepageContent.installation.eyebrow}</Eyebrow>
            <Heading as="h2" size="page">
              {homepageContent.installation.heading}
            </Heading>
            <p>{homepageContent.installation.body}</p>
            <Notice>
              <p>{homepageContent.installation.pendingMessage}</p>
            </Notice>
            <Button href={homepageContent.installation.action.href}>
              {homepageContent.installation.action.label}
            </Button>
          </div>
        </Container>
      </Section>

      <Section id="oppaat" className="home-guides" tone="page">
        <Container>
          <header className="home-section-heading">
            <Eyebrow>{homepageContent.guides.eyebrow}</Eyebrow>
            <Heading as="h2" size="page">
              {homepageContent.guides.heading}
            </Heading>
          </header>
          <div className="guide-grid">
            {homepageGuides.map((guide, index) => (
              <article className="guide-card" key={guide.path}>
                <span className="guide-card__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Heading as="h3" size="compact">
                  {guide.title}
                </Heading>
                <p>{guide.summary}</p>
                <Button href={guide.path} variant="text">
                  Lue opas
                </Button>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <div id="yhteys">
        <CallToAction
          title={homepageContent.finalCta.title}
          action={{
            label: homepageContent.finalCta.action.label,
            href: homepageContent.primaryCta.href,
          }}
          secondaryAction={homepageContent.secondaryCta}
        >
          <p>{homepageContent.finalCta.body}</p>
          <p className="home-final-cta__notice">
            {homepageContent.developmentNotice}
          </p>
        </CallToAction>
      </div>
    </main>
  );
}
