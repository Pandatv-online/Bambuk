export type LocalPath = `/${string}`;

export type NavigationItem = Readonly<{
  id: string;
  label: string;
  href: LocalPath;
  children?: readonly NavigationItem[];
}>;

export type CategoryStatus = "pendingAssortment" | "published";

export type Category = Readonly<{
  id: string;
  name: string;
  slug: string;
  href: LocalPath;
  status: CategoryStatus;
  image: Readonly<{
    src: LocalPath;
    alt: string;
    rightsId: string;
  }> | null;
}>;

export type ProductPriceState = "hidden" | "quote" | "published";
export type ProductAvailability =
  | "unknown"
  | "onRequest"
  | "inStock"
  | "outOfStock"
  | "madeToOrder";

export type PublishedPrice = Readonly<{
  amountMinor: number;
  currency: "EUR";
  basis: string;
  vatDisplay: string;
  sourceId: string;
  updatedAt: string;
}>;

type ProductPrice =
  | Readonly<{
      price: Exclude<ProductPriceState, "published">;
      publishedPrice?: never;
    }>
  | Readonly<{
      price: "published";
      publishedPrice: PublishedPrice;
    }>;

type ProductAvailabilityState =
  | Readonly<{
      availability: "unknown";
      availabilitySourceId?: never;
      availabilityUpdatedAt?: never;
    }>
  | Readonly<{
      availability: Exclude<ProductAvailability, "unknown">;
      availabilitySourceId: string;
      availabilityUpdatedAt: string;
    }>;

export type ProductCommercialState = Readonly<
  ProductPrice & ProductAvailabilityState
>;

export type ProductSpecification = Readonly<{
  key: string;
  label: string;
  value: string;
  unit?: string;
  sourceId: string;
}>;

export type Product = Readonly<{
  id: string;
  status: "draft" | "published" | "archived";
  slug: string;
  sku: string;
  name: string;
  categoryId: string;
  manufacturerId: string;
  commercial: ProductCommercialState;
  specifications: readonly ProductSpecification[];
}>;

export type HomepageContent = Readonly<{
  locale: "fi";
  status: "foundation" | "published";
  title: string;
  metaDescription: string;
  primaryCta: Readonly<{ label: "Pyydä tarjous"; href: LocalPath }>;
  featuredProducts: Readonly<{
    heading: string;
    pendingMessage: string;
  }>;
  developmentNotice: string;
}>;
