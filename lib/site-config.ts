export type SiteLocale = "fi";

export type FeatureFlags = Readonly<{
  account: boolean;
  availability: boolean;
  calculator: boolean;
  cart: boolean;
  checkout: boolean;
  newsletter: boolean;
  price: boolean;
  samples: boolean;
}>;

export type SiteConfig = Readonly<{
  locale: SiteLocale;
  siteUrl: string | null;
  company: Readonly<{
    displayName: string | null;
    legalName: string | null;
    registrationCountry: "EE" | null;
    servedMarkets: readonly ("FI" | "EE")[];
    businessId: string | null;
    vatId: string | null;
    address: string | null;
  }>;
  manufacturer: Readonly<{
    displayName: string | null;
    legalName: string | null;
    relationshipWording: string | null;
    logoUsageRules: string | null;
  }>;
  contact: Readonly<{
    email: string | null;
    phone: string | null;
    phoneHref: `tel:${string}` | null;
    hours: string | null;
    visitLocationPublicationApproved: boolean;
    visitWording: string | null;
  }>;
  legal: Readonly<{
    privacyNotice: string | null;
    cookieNotice: string | null;
    deliveryTerms: string | null;
  }>;
  service: Readonly<{
    installationScope: string | null;
    serviceArea: string | null;
  }>;
  formDestination: string | null;
  featureFlags: FeatureFlags;
}>;

export type RequiredSiteConfigField =
  | "siteUrl"
  | "company.displayName"
  | "company.legalName"
  | "company.businessId"
  | "company.vatId"
  | "company.address"
  | "contact.email"
  | "contact.phone"
  | "contact.hours"
  | "contact.visitLocationPublicationApproved"
  | "legal.privacyNotice"
  | "legal.deliveryTerms"
  | "formDestination";

export type ReleaseReadiness = Readonly<{
  environment: "development" | "production";
  ready: boolean;
  unresolvedFields: readonly RequiredSiteConfigField[];
}>;

const normalizePublicUrl = (value: string | undefined): string | null => {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.origin
      : null;
  } catch {
    return null;
  }
};

export const siteConfig: SiteConfig = {
  locale: "fi",
  siteUrl: normalizePublicUrl(process.env.NEXT_PUBLIC_SITE_URL),
  company: {
    displayName: companyRegistryRecord.displayName,
    legalName: companyRegistryRecord.displayName,
    registrationCountry: "EE",
    servedMarkets: ["FI", "EE"],
    businessId: companyRegistryRecord.registryCode,
    vatId: companyRegistryRecord.vatId,
    address: companyRegistryRecord.registeredAddress,
  },
  manufacturer: {
    displayName: null,
    legalName: null,
    relationshipWording: null,
    logoUsageRules: null,
  },
  contact: {
    email: null,
    phone: "+358 50 508 0808",
    phoneHref: "tel:+358505080808",
    hours: "ma–pe 8.00–18.00",
    visitLocationPublicationApproved: false,
    visitWording: "Sovi käynti etukäteen puhelimitse",
  },
  legal: {
    privacyNotice: null,
    cookieNotice: null,
    deliveryTerms: null,
  },
  service: {
    installationScope: null,
    serviceArea: null,
  },
  formDestination: null,
  featureFlags: {
    account: false,
    availability: false,
    calculator: false,
    cart: false,
    checkout: false,
    newsletter: false,
    price: false,
    samples: false,
  },
};

const releaseFieldReaders: Readonly<
  Record<RequiredSiteConfigField, (config: SiteConfig) => string | boolean | null>
> = {
  siteUrl: (config) => config.siteUrl,
  "company.displayName": (config) => config.company.displayName,
  "company.legalName": (config) => config.company.legalName,
  "company.businessId": (config) => config.company.businessId,
  "company.vatId": (config) => config.company.vatId,
  "company.address": (config) => config.company.address,
  "contact.email": (config) => config.contact.email,
  "contact.phone": (config) => config.contact.phone,
  "contact.hours": (config) => config.contact.hours,
  "contact.visitLocationPublicationApproved": (config) =>
    config.contact.visitLocationPublicationApproved,
  "legal.privacyNotice": (config) => config.legal.privacyNotice,
  "legal.deliveryTerms": (config) => config.legal.deliveryTerms,
  formDestination: (config) => config.formDestination,
};

export function getReleaseReadiness(
  config: SiteConfig = siteConfig,
  environment: "development" | "production" =
    process.env.NODE_ENV === "production" ? "production" : "development",
): ReleaseReadiness {
  const unresolvedFields = (
    Object.entries(releaseFieldReaders) as [
      RequiredSiteConfigField,
      (candidate: SiteConfig) => string | boolean | null,
    ][]
  )
    .filter(([, read]) => {
      const value = read(config);
      return typeof value === "string" ? !value.trim() : !value;
    })
    .map(([field]) => field);

  return {
    environment,
    ready: environment === "development" || unresolvedFields.length === 0,
    unresolvedFields,
  };
}
import { companyRegistryRecord } from "@/data/company";
