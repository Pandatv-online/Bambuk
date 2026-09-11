import type { Metadata } from "next";

import { homepageContent } from "@/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: homepageContent.title,
  description: homepageContent.metaDescription,
  path: "/fi",
  indexable: false,
});

export default function FinnishFoundationPage() {
  return (
    <main className="foundation-surface">
      <div className="foundation-surface__content">
        <p className="foundation-surface__eyebrow">Suomenkielinen sivusto</p>
        <h1>{homepageContent.title}</h1>
        <p className="foundation-surface__notice" id="yhteys" role="status">
          {homepageContent.developmentNotice}
        </p>
        <section
          aria-labelledby="featured-products-heading"
          className="foundation-surface__products"
        >
          <h2 id="featured-products-heading">
            {homepageContent.featuredProducts.heading}
          </h2>
          <p>{homepageContent.featuredProducts.pendingMessage}</p>
          <a
            className="foundation-surface__action"
            href={homepageContent.primaryCta.href}
          >
            {homepageContent.primaryCta.label}
          </a>
        </section>
      </div>
    </main>
  );
}
