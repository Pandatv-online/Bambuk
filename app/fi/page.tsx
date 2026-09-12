import type { Metadata } from "next";

import { CategoryGrid } from "@/components/catalog";
import { GalleryGrid } from "@/components/gallery";
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
import { categories, homepageContent } from "@/data";
import { createPageMetadata } from "@/lib/seo";
import { getReleaseReadiness } from "@/lib/site-config";

const homepageIsIndexable =
  homepageContent.status === "published" && getReleaseReadiness().ready;
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
          <CategoryGrid categories={categories} />
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
          <GalleryGrid items={homepageContent.gallery.items} />
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
          <Notice className="home-featured__notice">
            <p>{homepageContent.featuredProducts.pendingMessage}</p>
            <Button href={homepageContent.primaryCta.href} variant="secondary">
              {homepageContent.primaryCta.label}
            </Button>
          </Notice>
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
            {homepageContent.guides.items.map((guide, index) => (
              <article className="guide-card" key={guide.title}>
                <span className="guide-card__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Heading as="h3" size="compact">
                  {guide.title}
                </Heading>
                <p>{guide.body}</p>
                {guide.link ? (
                  <Button href={guide.link.href} variant="text">
                    {guide.link.label}
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <div id="yritystiedot">
        <div id="yhteys">
          <CallToAction
            title={homepageContent.finalCta.title}
            action={{
              label: homepageContent.finalCta.action.label,
              disabled: true,
            }}
            secondaryAction={homepageContent.secondaryCta}
          >
            <p>{homepageContent.finalCta.body}</p>
            <p className="home-final-cta__notice">
              {homepageContent.developmentNotice}
            </p>
          </CallToAction>
        </div>
      </div>
    </main>
  );
}
