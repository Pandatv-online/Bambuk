export type CatalogLocale = "lt";

export type CatalogSource = Readonly<{
  url: string | null;
  sourceId: string;
  extractedAt: string | null;
  locale: CatalogLocale;
}>;

export type SourcedValue = Readonly<{
  value: string;
  source: CatalogSource;
}>;

export type CatalogCategory = Readonly<{
  id: string;
  parentId: string | null;
  nameFi: string;
  nameSource: string;
  slugFi: string;
  source: CatalogSource;
}>;

export type ProductSpecification = Readonly<{
  key: string;
  labelFi: string;
  sourceLabel: string;
  value: string;
  unit: string | null;
  source: CatalogSource;
}>;

export type ProductPricing =
  | Readonly<{
      status: "hidden";
      amount: null;
      currency: null;
      basis: null;
      vatDisplay: null;
      checkedAt: "2026-09-12";
      checkedLabelFi: "Tarkistettu 12.9.2026";
      vatConfirmationFi: "ALV-käsittely vahvistetaan tarjouksessa";
      sourceUrl: string | null;
      extractedAt: string | null;
    }>
  | Readonly<{
      status: "published";
      amount: number;
      currency: "EUR";
      basis: "€/m²" | "€/kpl" | "€/m" | "€/pakkaus";
      vatDisplay: string | null;
      checkedAt: "2026-09-12";
      checkedLabelFi: "Tarkistettu 12.9.2026";
      vatConfirmationFi: "ALV-käsittely vahvistetaan tarjouksessa";
      sourceUrl: string;
      extractedAt: string;
    }>;

export type CatalogImage = Readonly<{
  src: `/images/products/${string}`;
  altFi: string;
  order: number;
  rightsId: string;
  sourceUrl: string;
  applicableProductIds: readonly string[];
}>;

export type CatalogDocument = Readonly<{
  id: string;
  titleFi: string | null;
  sourceTitle: string;
  file: `/documents/products/${string}` | null;
  sourceUrl: string;
  applicability: readonly string[];
}>;

export type PublishedWarranty = Readonly<{
  durationMonths: 12;
  labelFi: "Takuu 12 kuukautta";
  scope: "pendingContract";
  noteFi: "Takuun kohde ja ehdot vahvistetaan kirjallisessa tarjouksessa";
}>;

export type CatalogProduct = Readonly<{
  id: string;
  status: "active" | "notReady";
  readinessIssues: readonly string[];
  slugFi: string;
  sku: string | null;
  nameFi: string | null;
  nameSource: string | null;
  summaryFi: string | null;
  descriptionFi: string | null;
  categoryId: string | null;
  collectionId: string | null;
  brand: string | null;
  attributes: Readonly<{
    color: SourcedValue | null;
    surface: SourcedValue | null;
    finish: SourcedValue | null;
    dimensions: readonly SourcedValue[];
    package: readonly SourcedValue[];
    installation: readonly SourcedValue[];
  }>;
  specifications: readonly ProductSpecification[];
  pricing: ProductPricing;
  availability: Readonly<{
    status: "inStock";
    confirmedBy: "user";
    confirmedAt: "2026-09-12";
  }>;
  delivery: Readonly<{
    included: true;
    labelFi: "Toimitus sisältyy hintaan";
    applicability: "pendingOfferConfirmation";
    noteFi: "Toimitusalue ja soveltaminen vahvistetaan tarjouksessa";
  }>;
  warranty: PublishedWarranty;
  sample: Readonly<{
    available: true;
    labelFi: "Näyte saatavilla";
    actionLabelFi: "Pyydä näyte";
  }>;
  images: readonly CatalogImage[];
  documents: readonly CatalogDocument[];
  relatedProductIds: readonly string[];
  source: CatalogSource;
}>;

export type CatalogImportIssue = Readonly<{
  code:
    | "invalid-root"
    | "duplicate-category-id"
    | "duplicate-product-id"
    | "duplicate-normalized-slug"
    | "duplicate-source-slug"
    | "invalid-category"
    | "orphan-category"
    | "missing-name"
    | "missing-source-url"
    | "invalid-price"
    | "invalid-price-provenance"
    | "invalid-source-date"
    | "invalid-specification-unit"
    | "orphan-category-parent"
    | "invalid-image"
    | "invalid-document"
    | "invalid-relation";
  sourceId: string | null;
  detail: string;
}>;

export type CatalogImportReport = Readonly<{
  extractedAt: string | null;
  auditSnapshotProducts: 130;
  sourceProducts: number;
  uniqueSourceProducts: number;
  auditDifference: number;
  normalizedProducts: number;
  skippedProducts: number;
  sourceCategories: number;
  normalizedCategories: number;
  skippedCategories: number;
  sourceImageReferences: number;
  uniqueSourceImages: number;
  mappedLocalImages: number;
  verifiedLocalImages: number;
  sourceDocuments: number;
  mappedLocalDocuments: number;
  verifiedLocalDocuments: number;
  notReadyProducts: number;
  issues: readonly CatalogImportIssue[];
}>;

export type CatalogImportResult = Readonly<{
  categories: readonly CatalogCategory[];
  products: readonly CatalogProduct[];
  report: CatalogImportReport;
}>;
