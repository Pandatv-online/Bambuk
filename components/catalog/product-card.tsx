import type { LocalPath, ProductCommercialState } from "@/data";

import type { MediaAsset } from "../media/responsive-media";
import { ResponsiveMedia } from "../media/responsive-media";
import { Button } from "../ui/button";

export type ProductCardViewModel = Readonly<{
  id: string;
  name: string;
  href: LocalPath;
  categoryLabel?: string;
  image: MediaAsset | null;
  commercial: ProductCommercialState;
}>;

export type ProductCardProps = Readonly<{
  product: ProductCardViewModel;
  quoteHref?: LocalPath;
}>;

function ProductPrice({ commercial }: Readonly<{ commercial: ProductCommercialState }>) {
  if (commercial.price === "hidden") return null;
  if (commercial.price === "quote") {
    return <p className="product-card__price">Hinta pyynnöstä</p>;
  }

  const publishedPrice = commercial.publishedPrice;
  if (!publishedPrice) return null;

  const amount = new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: publishedPrice.currency,
  }).format(publishedPrice.amountMinor / 100);
  const updatedAt = new Intl.DateTimeFormat("fi-FI", {
    dateStyle: "short",
  }).format(new Date(publishedPrice.updatedAt));

  return (
    <p className="product-card__price">
      <span>
        {amount} / {publishedPrice.basis}
      </span>
      <span className="product-card__price-qualifier">{publishedPrice.vatDisplay}</span>
      <span className="product-card__price-updated">
        Päivitetty <time dateTime={publishedPrice.updatedAt}>{updatedAt}</time>
      </span>
    </p>
  );
}

export function ProductCard({ product, quoteHref = "/fi#yhteys" }: ProductCardProps) {
  return (
    <article className="product-card">
      <a href={product.href} className="product-card__identity">
        <ResponsiveMedia
          className="product-card__media"
          image={product.image}
          placeholderAlt={`${product.name}: kuva tulossa`}
          sizes="(min-width: 75rem) 23rem, (min-width: 48rem) 33vw, 100vw"
        />
        {product.categoryLabel ? (
          <span className="product-card__category">{product.categoryLabel}</span>
        ) : null}
        <h3>{product.name}</h3>
      </a>
      <ProductPrice commercial={product.commercial} />
      <Button href={quoteHref} variant="secondary">
        Pyydä tarjous
      </Button>
    </article>
  );
}

export function ProductGrid({
  products,
}: Readonly<{ products: readonly ProductCardViewModel[] }>) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
