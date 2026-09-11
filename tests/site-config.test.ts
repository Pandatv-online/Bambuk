import { describe, expect, it } from "vitest";

import { getReleaseReadiness, siteConfig } from "../lib/site-config";

describe("getReleaseReadiness", () => {
  it("allows development while identifying unresolved production inputs", () => {
    const development = getReleaseReadiness(siteConfig, "development");
    const production = getReleaseReadiness(siteConfig, "production");

    expect(development.ready).toBe(true);
    expect(production.ready).toBe(false);
    expect(production.unresolvedFields).toContain("company.legalName");
    expect(production.unresolvedFields).toContain("company.vatId");
    expect(production.unresolvedFields).toContain("manufacturer.legalName");
    expect(production.unresolvedFields).toContain("contact.email");
    expect(production.unresolvedFields).toContain("contact.hours");
    expect(production.unresolvedFields).toContain("siteUrl");
  });
});
