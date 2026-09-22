import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getReleaseReadiness, siteConfig } from "../lib/site-config";

describe("getReleaseReadiness", () => {
  it("keeps the safe environment example limited to the public origin and empty secret names", () => {
    const example = readFileSync(new URL("../.env.example", import.meta.url), "utf8");

    expect(example).toMatch(/^NEXT_PUBLIC_SITE_URL=https:\/\/bamboopro\.fi$/mu);
    expect(example).toMatch(/^TELEGRAM_BOT_TOKEN=$/mu);
    expect(example).toMatch(/^TELEGRAM_CHAT_ID=$/mu);
  });

  it("publishes only the confirmed Osaühing IKB company and contact facts", () => {
    expect(siteConfig.company).toMatchObject({
      displayName: "Osaühing IKB",
      legalName: "Osaühing IKB",
      registrationCountry: "EE",
      servedMarkets: ["FI", "EE"],
      businessId: "10161031",
      vatId: "EE100414305",
      address: "Mere pst 2, 40231 Sillamäe linn",
    });
    expect(siteConfig.contact).toEqual({
      email: null,
      phone: "+358 50 508 0808",
      phoneHref: "tel:+358505080808",
      hours: "ma–pe 8.00–18.00",
      visitLocationPublicationApproved: false,
      visitWording: "Sovi käynti etukäteen puhelimitse",
    });
  });

  it("allows development while identifying unresolved production inputs", () => {
    const development = getReleaseReadiness(siteConfig, "development");
    const production = getReleaseReadiness(siteConfig, "production");

    expect(development.ready).toBe(true);
    expect(production.ready).toBe(false);
    expect(production.unresolvedFields).not.toContain("company.address");
    expect(production.unresolvedFields).not.toContain("company.vatId");
    expect(production.unresolvedFields).toContain("contact.email");
    expect(production.unresolvedFields).toContain(
      "contact.visitLocationPublicationApproved",
    );
    expect(production.unresolvedFields).toContain("legal.privacyNotice");
    expect(production.unresolvedFields).toContain("legal.deliveryTerms");
    expect(production.unresolvedFields).toContain("formDestination");
    expect(production.unresolvedFields).toContain("siteUrl");
    expect(production.unresolvedFields).not.toContain(
      "manufacturer.relationshipWording",
    );
  });
});
