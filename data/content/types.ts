export type InformationPageSlug =
  | "valmistus"
  | "rakenne-varit-ja-pinnat"
  | "asennus-ja-hoito"
  | "lattialammitys"
  | "ukk";

export type InformationPagePath =
  `/fi/tietoa-bambusta/${InformationPageSlug}`;

export type InformationSourceId =
  | "manufacturing-process-snapshot"
  | "faq-snapshot"
  | "structure-patterns-snapshot"
  | "edge-profiles-snapshot"
  | "colors-snapshot"
  | "finishes-snapshot"
  | "installation-methods-snapshot"
  | "installation-care-snapshot"
  | "underfloor-heating-snapshot";

export type InformationSource = Readonly<{
  id: InformationSourceId;
  labelFi: string;
  internalLocator: `.firecrawl/${string}`;
  capturedAt: `${number}-${number}-${number}`;
  status: "research-snapshot";
}>;

export type InformationStatement = Readonly<{
  text: string;
  applicability: string;
  sourceIds: readonly [InformationSourceId, ...InformationSourceId[]];
}>;

export type InformationSection = Readonly<{
  id: string;
  title: string;
  statements: readonly [InformationStatement, ...InformationStatement[]];
}>;

export type InformationCategoryLink = Readonly<{
  categoryId: string;
  label: string;
  href: `/fi/tuotteet/${string}`;
  sourceIds: readonly [InformationSourceId, ...InformationSourceId[]];
}>;

export type InformationPage = Readonly<{
  slug: InformationPageSlug;
  path: InformationPagePath;
  status: "published" | "draft";
  eyebrow: string;
  title: string;
  summary: string;
  metaDescription: string;
  sections: readonly [InformationSection, ...InformationSection[]];
  sourceIds: readonly [InformationSourceId, ...InformationSourceId[]];
  relatedCategoryLinks?: readonly InformationCategoryLink[];
  reviewNotes?: readonly string[];
}>;

export type PublishedInformationSource = Readonly<{
  label: string;
}>;

export type PublishedInformationStatement = Readonly<{
  text: string;
  applicability: string;
}>;

export type PublishedInformationSection = Readonly<{
  id: string;
  title: string;
  statements: readonly PublishedInformationStatement[];
}>;

export type PublishedInformationCategoryLink = Readonly<{
  label: string;
  href: `/fi/tuotteet/${string}`;
}>;

export type PublishedInformationPage = Readonly<{
  slug: InformationPageSlug;
  path: InformationPagePath;
  eyebrow: string;
  title: string;
  summary: string;
  metaDescription: string;
  sections: readonly PublishedInformationSection[];
  sources: readonly PublishedInformationSource[];
  relatedCategoryLinks: readonly PublishedInformationCategoryLink[];
}>;

export type InformationHub = Readonly<{
  path: "/fi/tietoa-bambusta";
  status: "published" | "draft";
  eyebrow: string;
  title: string;
  summary: string;
  metaDescription: string;
}>;

export type PublishedInformationHub = Readonly<{
  path: "/fi/tietoa-bambusta";
  eyebrow: string;
  title: string;
  summary: string;
  metaDescription: string;
}>;
