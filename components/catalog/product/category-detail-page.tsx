import Link from "next/link";

import { CatalogCategoryCard } from "@/components/catalog/catalog-category-link";
import { CatalogProductCard } from "@/components/catalog/listing";
import { Container, Heading } from "@/components/ui";

import type { CatalogCategoryRoute } from "./catalog-route";
import styles from "./product-page.module.css";

export function CategoryDetailPage({
  route,
}: Readonly<{ route: CatalogCategoryRoute }>) {
  return (
    <main className={styles.page}>
      <Container>
        <nav aria-label="Murupolku" className={styles.breadcrumbs}>
          <ol>
            <li><a href="/fi">Koti</a></li>
            <li><Link href="/fi/tuotteet">Tuotteet</Link></li>
            {route.breadcrumbs.map((item, index) => {
              const isCurrent = index === route.breadcrumbs.length - 1;
              return (
                <li key={item.href}>
                  {isCurrent ? (
                    <span aria-current="page">{item.label}</span>
                  ) : (
                    <a href={item.href}>{item.label}</a>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <header className={styles.categoryHeader}>
          <p className={styles.categoryLabel}>
            {route.kind === "collection" ? "Mallisto" : "Tuoteryhmä"}
          </p>
          <Heading as="h1" size="display">{route.category.nameFi}</Heading>
          <p>{route.products.length} tuotetta Suomen aktiivisessa valikoimassa.</p>
        </header>

        {route.childCategories.length ? (
          <section aria-labelledby="subcategories-heading" className={styles.detailSection}>
            <Heading as="h2" id="subcategories-heading" size="section">
              Tuoteryhmät ja mallistot
            </Heading>
            <div className={styles.childCategoryGrid}>
              {route.childCategories.map((category) => (
                <CatalogCategoryCard
                  category={category}
                  key={category.id}
                  subtitle="Katso tuotteet"
                />
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="products-heading" className={styles.detailSection}>
          <div className={styles.productSectionHeading}>
            <Heading as="h2" id="products-heading" size="section">Tuotteet</Heading>
            <p>{route.products.length} tuotetta</p>
          </div>
          {route.products.length ? (
            <div className={styles.productGrid}>
              {route.products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>Tuotteita ei ole julkaistu</h3>
              <p>Voit kysyä valikoimasta ja saatavuudesta suoraan myynniltä.</p>
              <a href="/fi/pyyda-tarjous">Pyydä tarjous</a>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
