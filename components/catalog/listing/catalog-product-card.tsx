import Image from "next/image";

import { catalogCategories } from "@/data/catalog";
import type { CatalogProduct } from "@/lib/catalog/types";
import { getCatalogProductPath } from "@/lib/catalog/query";

import styles from "./catalog-listing.module.css";

const priceFormatter = new Intl.NumberFormat("fi-FI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function CatalogProductCard({ product }: Readonly<{ product: CatalogProduct }>) {
  const href = getCatalogProductPath(product);
  const image = [...product.images].sort((left, right) => left.order - right.order)[0];
  const category = catalogCategories.find((item) => item.id === product.categoryId);

  return (
    <article className={styles.productCard} data-product-id={product.id}>
      {href ? (
        <a className={styles.productIdentity} href={href}>
          <ProductMedia image={image} name={product.nameFi ?? "Tuote"} />
          {category ? <span className={styles.productCategory}>{category.nameFi}</span> : null}
          <h3>{product.nameFi}</h3>
        </a>
      ) : (
        <div className={styles.productIdentity}>
          <ProductMedia image={image} name={product.nameFi ?? "Tuote"} />
          <h3>{product.nameFi}</h3>
        </div>
      )}
      <div className={styles.commercialFacts}>
        {product.pricing.status === "published" ? (
          <p className={styles.price}>
            <strong>
              {priceFormatter.format(product.pricing.amount)} {product.pricing.basis}
            </strong>
            <small>{product.pricing.checkedLabelFi}</small>
            <small>{product.pricing.vatDisplay ?? product.pricing.vatConfirmationFi}</small>
          </p>
        ) : (
          <p className={styles.price}><strong>Pyydä tarjous</strong></p>
        )}
        <ul className={styles.statusList}>
          <li>Varastossa</li>
          <li>{product.sample.labelFi}</li>
        </ul>
      </div>
      <div className={styles.cardActions}>
        <a href={`/fi/pyyda-tarjous?tuote=${encodeURIComponent(product.id)}`}>Pyydä tarjous</a>
        <a href={`/fi/tilaa-mallipala?tuote=${encodeURIComponent(product.id)}`}>{product.sample.actionLabelFi}</a>
      </div>
    </article>
  );
}

function ProductMedia({
  image,
  name,
}: Readonly<{ image: CatalogProduct["images"][number] | undefined; name: string }>) {
  if (!image) {
    return (
      <div aria-label={`${name}: kuva ei ole saatavilla`} className={styles.productPlaceholder} role="img">
        <span aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className={styles.productMedia}>
      <Image alt={image.altFi} fill sizes="(min-width: 61.25rem) 19rem, (min-width: 48rem) 45vw, 100vw" src={image.src} />
    </div>
  );
}
