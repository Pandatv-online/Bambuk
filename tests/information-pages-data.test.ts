import { describe, expect, it } from "vitest";

import * as contentApi from "@/data/content";
import {
  getPublishedInformationHub,
  getPublishedInformationPageByPath,
  getPublishedInformationPageBySlug,
  getPublishedInformationPages,
} from "@/data/content";

const documentedPaths = [
  "/fi/tietoa-bambusta",
  "/fi/tietoa-bambusta/valmistus",
  "/fi/tietoa-bambusta/rakenne-varit-ja-pinnat",
  "/fi/tietoa-bambusta/asennus-ja-hoito",
  "/fi/tietoa-bambusta/lattialammitys",
  "/fi/tietoa-bambusta/ukk",
] as const;

describe("information content registry", () => {
  it("publishes the documented hub and five consolidated routes with provenance", () => {
    const informationHub = getPublishedInformationHub();
    const pages = getPublishedInformationPages();

    expect(informationHub).toBeDefined();
    expect([informationHub.path, ...pages.map((page) => page.path)]).toEqual(
      documentedPaths,
    );
    expect(getPublishedInformationPageBySlug("valmistus")?.path).toBe(
      "/fi/tietoa-bambusta/valmistus",
    );
    expect(
      getPublishedInformationPageByPath("/fi/tietoa-bambusta/ukk")?.slug,
    ).toBe("ukk");
    expect(getPublishedInformationPageBySlug("tuntematon")).toBeUndefined();

    for (const page of pages) {
      expect(page.sections.length).toBeGreaterThan(0);

      for (const section of page.sections) {
        expect(section.statements.length).toBeGreaterThan(0);
        for (const statement of section.statements) {
          expect(statement.applicability.trim()).not.toBe("");
        }
      }

      for (const source of page.sources) {
        expect(source.label).not.toBe("");
      }

      expect(page.sources.length).toBeGreaterThan(0);
    }
  });

  it("keeps category links explicit and source-backed", () => {
    const relations = getPublishedInformationPages().flatMap(
      (page) => page.relatedCategoryLinks ?? [],
    );

    expect(relations.length).toBeGreaterThan(0);
    for (const relation of relations) {
      expect(relation.href).toMatch(/^\/fi\/tuotteet\//);
    }
  });

  it("keeps raw registries, source lookup and audit out of the public barrel", () => {
    expect(contentApi).not.toHaveProperty("informationPages");
    expect(contentApi).not.toHaveProperty("informationSources");
    expect(contentApi).not.toHaveProperty("getInformationSourceById");
    expect(contentApi).not.toHaveProperty("auditInformationContent");
  });

  it("projects published content without internal provenance or review keys", () => {
    const visitorContent = {
      hub: getPublishedInformationHub(),
      pages: getPublishedInformationPages(),
    };
    const serialized = JSON.stringify(visitorContent);

    for (const internalKey of [
      "sourceIds",
      "reviewNotes",
      "internalLocator",
      "capturedAt",
      "labelFi",
      "categoryId",
    ]) {
      expect(serialized).not.toContain(`"${internalKey}"`);
    }

    expect(visitorContent.hub).not.toHaveProperty("status");
    for (const page of visitorContent.pages) {
      expect(Object.keys(page).sort()).toEqual([
        "eyebrow",
        "metaDescription",
        "path",
        "relatedCategoryLinks",
        "sections",
        "slug",
        "sources",
        "summary",
        "title",
      ]);
      expect(page.sources.length).toBeGreaterThan(0);
      for (const source of page.sources) {
        expect(Object.keys(source)).toEqual(["label"]);
      }
      for (const section of page.sections) {
        expect(Object.keys(section).sort()).toEqual(["id", "statements", "title"]);
        for (const statement of section.statements) {
          expect(Object.keys(statement).sort()).toEqual([
            "applicability",
            "text",
          ]);
        }
      }
      for (const link of page.relatedCategoryLinks) {
        expect(Object.keys(link).sort()).toEqual(["href", "label"]);
      }
    }
  });
});
