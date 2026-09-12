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
  status: "foundation" | "review" | "published";
  title: string;
  metaDescription: string;
  primaryCta: Readonly<{ label: "Pyydä tarjous"; href: LocalPath }>;
  secondaryCta: Readonly<{ label: "Tutustu tuotteisiin"; href: LocalPath }>;
  hero: Readonly<{
    eyebrow: string;
    summary: string;
    image: NonNullable<Category["image"]>;
  }>;
  introduction: Readonly<{
    heading: string;
    body: string;
    link: Readonly<{ label: string; href: LocalPath }>;
  }>;
  categorySection: Readonly<{
    eyebrow: string;
    heading: string;
    introduction: string;
  }>;
  gallery: Readonly<{
    eyebrow: string;
    heading: string;
    introduction: string;
    items: readonly Readonly<{
      id: string;
      alt: string;
      image: NonNullable<Category["image"]>;
    }>[];
  }>;
  decisionTopics: Readonly<{
    eyebrow: string;
    heading: string;
    introduction: string;
    items: readonly Readonly<{
      title: string;
      body: string;
    }>[];
  }>;
  featuredProducts: Readonly<{
    eyebrow: string;
    heading: string;
    pendingMessage: string;
  }>;
  installation: Readonly<{
    eyebrow: string;
    heading: string;
    body: string;
    pendingMessage: string;
    image: NonNullable<Category["image"]>;
    action: Readonly<{ label: "Pyydä tarjous"; href: LocalPath }>;
  }>;
  guides: Readonly<{
    eyebrow: string;
    heading: string;
    items: readonly Readonly<{
      title: string;
      body: string;
      link?: Readonly<{
        label: "Tutustu tuotteisiin" | "Pyydä näyte" | "Asennuspalvelu";
        href: LocalPath;
      }>;
    }>[];
  }>;
  finalCta: Readonly<{
    title: string;
    body: string;
    action: Readonly<{ label: "Pyydä tarjous"; status: "pending" }>;
  }>;
  developmentNotice: string;
}>;
