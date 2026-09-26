import Link from "next/link";

import { catalogCategories } from "@/data/catalog";
import type { CatalogFacetOption, CatalogQuery, CatalogQueryResult } from "@/lib/catalog/query";
import { createCatalogUrl } from "@/lib/catalog/query";

import { CatalogCategoryCard } from "../catalog-category-link";
import { CatalogFilterDialog } from "./catalog-filter-dialog";
import { CatalogFilters } from "./catalog-filters";
import styles from "./catalog-listing.module.css";
import { CatalogProductCard } from "./catalog-product-card";

const optionLabels = (
  values: readonly string[],
  options: readonly CatalogFacetOption[],
): readonly string[] =>
  values.flatMap((value) => options.find((option) => option.value === value)?.label ?? []);

export function CatalogShell({
  query,
  result,
}: Readonly<{ query: CatalogQuery; result: CatalogQueryResult }>) {
  const activeLabels = [
    ...optionLabels(query.categorySlugs, result.facets.categories),
    ...optionLabels(query.collectionSlugs, result.facets.collections),
    ...optionLabels(query.colorValues, result.facets.colors),
    ...optionLabels(query.surfaceValues, result.facets.surfaces),
    ...optionLabels(query.finishValues, result.facets.finishes),
    ...(query.availability ? ["Varastossa"] : []),
  ];
  const rootCategories = catalogCategories.filter((category) => category.parentId === "0");

  return (
    <>
      <section aria-labelledby="catalog-categories-title" className={styles.categorySection}>
        <h2 id="catalog-categories-title">Tuoteryhmät</h2>
        <div className={styles.categoryGrid}>
          {rootCategories.map((category) => {
            const count = result.facets.categories.find(
              (option) => option.value === category.slugFi,
            )?.count;
            return (
              <CatalogCategoryCard
                category={category}
                key={category.id}
                subtitle={count ? `${count} tuotetta` : "Tutustu tuoteryhmään"}
              />
            );
          })}
        </div>
      </section>

      <div className={styles.catalogToolbar}>
        <div>
          <h2>Kaikki tuotteet</h2>
          <p aria-live="polite">{result.totalItems} tuotetta</p>
        </div>
        <CatalogFilterDialog>
          <CatalogFilters facets={result.facets} query={query} />
        </CatalogFilterDialog>
      </div>

      {activeLabels.length ? (
        <section aria-label="Aktiiviset suodattimet" className={styles.activeFilters}>
          <strong>Aktiiviset suodattimet</strong>
          <ul>{activeLabels.map((label) => <li key={label}>{label}</li>)}</ul>
          <Link href="/fi/tuotteet">Poista kaikki</Link>
        </section>
      ) : null}

      <div className={styles.catalogLayout}>
        <div className={styles.results}>
          {result.totalItems ? (
            <div className={styles.productGrid}>
              {result.items.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>Näillä suodattimilla ei löytynyt tuotteita</h3>
              <p>Kokeile väljempiä valintoja tai tyhjennä kaikki suodattimet.</p>
              <Link href="/fi/tuotteet">Tyhjennä suodattimet</Link>
            </div>
          )}
          {result.totalPages > 1 ? (
            <nav aria-label="Tuotesivut" className={styles.pagination}>
              {result.hasPreviousPage ? (
                <a href={createCatalogUrl(query, { page: result.page - 1 })}>Edellinen</a>
              ) : null}
              <ol>
                {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((page) => (
                  <li key={page}>
                    {page === result.page ? (
                      <span aria-current="page">{page}</span>
                    ) : (
                      <a href={createCatalogUrl(query, { page })}>{page}</a>
                    )}
                  </li>
                ))}
              </ol>
              {result.hasNextPage ? (
                <a href={createCatalogUrl(query, { page: result.page + 1 })}>Seuraava</a>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </>
  );
}
