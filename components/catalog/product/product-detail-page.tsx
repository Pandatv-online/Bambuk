import Link from "next/link";

import { Button, Container, Heading } from "@/components/ui";
import type { CatalogProduct, ProductSpecification } from "@/lib/catalog/types";

import type { CatalogProductRoute } from "./catalog-route";
import { ProductGallery } from "./product-gallery";
import styles from "./product-page.module.css";

const priceFormatter = new Intl.NumberFormat("fi-FI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type SpecificationGroup = Readonly<{
  title: string;
  specifications: readonly ProductSpecification[];
}>;

const groupDefinitions = [
  {
    title: "Mitat ja pakkaus",
    pattern: /^(pituus|leveys|korkeus|paksuus|mitat|pakkaus|paino|tilavuus|maara)/u,
  },
  {
    title: "Pinta ja ulkonäkö",
    pattern: /^(savy|vari|pinta|viimeistely|pintakasittely|reunaprofiili)/u,
  },
  {
    title: "Asennus ja käyttö",
    pattern: /^(asennus|asennustapa|lukitus|lattialammitys|kaytto)/u,
  },
] as const;

function specificationGroups(
  specifications: readonly ProductSpecification[],
): readonly SpecificationGroup[] {
  const unique = specifications.filter(
    (specification, index, all) =>
      all.findIndex(
        (candidate) =>
          candidate.labelFi === specification.labelFi &&
          candidate.value === specification.value,
      ) === index,
  );
  const assigned = new Set<string>();
  const groups = groupDefinitions.flatMap((definition) => {
    const matches = unique.filter((specification) => {
      const isMatch = definition.pattern.test(specification.key);
      if (isMatch) assigned.add(specification.key);
      return isMatch;
    });
    return matches.length
      ? [{ title: definition.title, specifications: matches }]
      : [];
  });
  const technical = unique.filter((specification) => !assigned.has(specification.key));
  return technical.length
    ? [...groups, { title: "Tekniset tiedot", specifications: technical }]
    : groups;
}

function inquiryHref(
  base: "/fi/pyyda-tarjous" | "/fi/tilaa-mallipala",
  product: CatalogProduct,
  path: string,
): `${typeof base}?${string}` {
  const query = new URLSearchParams({ tuote: product.id, lahde: path });
  if (product.categoryId) query.set("kategoria", product.categoryId);
  if (product.collectionId) query.set("mallisto", product.collectionId);
  return `${base}?${query.toString()}`;
}

function formatSourceDate(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  return match ? `${Number(match[3])}.${Number(match[2])}.${match[1]}` : null;
}

export function ProductDetailPage({
  route,
}: Readonly<{ route: CatalogProductRoute }>) {
  const { product } = route;
  const groups = specificationGroups(product.specifications);
  const documents = product.documents.filter(
    (document) =>
      document.file !== null &&
      document.titleFi !== null &&
      document.applicability.includes(product.id),
  );
  const sourceDate = product.source.extractedAt
    ? formatSourceDate(product.source.extractedAt)
    : null;
  const quoteHref = inquiryHref("/fi/pyyda-tarjous", product, route.path);
  const sampleHref = inquiryHref("/fi/tilaa-mallipala", product, route.path);

  return (
    <main className={styles.page}>
      <Container>
        <CatalogBreadcrumbs route={route} />
        <div className={styles.productLayout}>
          <ProductGallery images={product.images} productName={product.nameFi ?? "Tuote"} />
          <div className={styles.productSummary}>
            <p className={styles.categoryLabel}>{route.category.nameFi}</p>
            <Heading as="h1" size="display">
              {product.nameFi}
            </Heading>
            {product.sku ? <p className={styles.sku}>Tuotekoodi: {product.sku}</p> : null}
            {sourceDate ? (
              <p className={styles.sourceDate}>Tuotetietojen lähdeaineisto: {sourceDate}</p>
            ) : null}
            {product.summaryFi ? <p className={styles.lead}>{product.summaryFi}</p> : null}
            <CommercialSummary product={product} />
            <div className={styles.actions}>
              <Button href={quoteHref}>Pyydä tarjous</Button>
              <Button href={sampleHref} variant="secondary">
                {product.sample.actionLabelFi}
              </Button>
            </div>
          </div>
        </div>

        {groups.length ? (
          <section aria-labelledby="technical-heading" className={styles.detailSection}>
            <Heading as="h2" id="technical-heading" size="section">
              Tekniset tiedot
            </Heading>
            <div className={styles.specificationGroups}>
              {groups.map((group) => (
                <section className={styles.specificationGroup} key={group.title}>
                  <h3>{group.title}</h3>
                  <dl>
                    {group.specifications.map((specification) => (
                      <div key={`${specification.key}:${specification.value}`}>
                        <dt>{specification.labelFi}</dt>
                        <dd>{specification.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </section>
        ) : null}

        {product.descriptionFi ? (
          <section aria-labelledby="description-heading" className={styles.detailSection}>
            <Heading as="h2" id="description-heading" size="section">
              Tuotekuvaus
            </Heading>
            <p>{product.descriptionFi}</p>
          </section>
        ) : null}

        {documents.length ? (
          <section aria-labelledby="documents-heading" className={styles.detailSection}>
            <Heading as="h2" id="documents-heading" size="section">
              Dokumentit
            </Heading>
            <ul className={styles.documentList}>
              {documents.map((document) => (
                <li key={document.id}>
                  <a download href={document.file ?? undefined}>
                    {document.titleFi}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </main>
  );
}

function CatalogBreadcrumbs({ route }: Readonly<{ route: CatalogProductRoute }>) {
  return (
    <nav aria-label="Murupolku" className={styles.breadcrumbs}>
      <ol>
        <li><a href="/fi">Koti</a></li>
        <li><Link href="/fi/tuotteet">Tuotteet</Link></li>
        {route.breadcrumbs.map((item) => (
          <li key={item.href}><a href={item.href}>{item.label}</a></li>
        ))}
        <li><span aria-current="page">{route.product.nameFi}</span></li>
      </ol>
    </nav>
  );
}

function CommercialSummary({ product }: Readonly<{ product: CatalogProduct }>) {
  return (
    <div className={styles.commercialSummary}>
      {product.pricing.status === "published" ? (
        <div className={styles.price}>
          <strong>{priceFormatter.format(product.pricing.amount)} {product.pricing.basis}</strong>
          <span>{product.pricing.checkedLabelFi}</span>
          <span>{product.pricing.vatDisplay ?? product.pricing.vatConfirmationFi}</span>
        </div>
      ) : (
        <p className={styles.quotePrice}><strong>Hinta tarjouksen mukaan</strong></p>
      )}
      <dl className={styles.commercialFacts}>
        <div><dt>Saatavuus</dt><dd>Varastossa</dd></div>
        <div><dt>Näyte</dt><dd>{product.sample.labelFi}</dd></div>
        <div><dt>Toimitus</dt><dd><strong>{product.delivery.labelFi}</strong><span>{product.delivery.noteFi}</span></dd></div>
        <div><dt>Takuu</dt><dd><strong>{product.warranty.labelFi}</strong><span>{product.warranty.noteFi}</span></dd></div>
      </dl>
    </div>
  );
}
