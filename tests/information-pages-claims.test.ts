import { describe, expect, it } from "vitest";

import { auditInformationContent } from "@/data/content/audit";
import { getInformationAuditInput } from "@/data/content/pages";

describe("information content claim guard", () => {
  it("rejects business leakage, unsupported claims and unresolved technical numbers", () => {
    const { hub, pages } = getInformationAuditInput();

    expect(auditInformationContent(hub, pages)).toEqual([]);

    const contaminated = {
      ...pages[0],
      summary:
        "UAB lupaa Suomessa sertifioidun asennuksen hintaan 49 €/m² ja 27 °C raja-arvon.",
    };
    const issues = auditInformationContent(hub, [contaminated]);

    expect(issues.map((issue) => issue.code)).toContain(
      "forbidden-visitor-content",
    );
    expect(issues.map((issue) => issue.rule)).toEqual(
      expect.arrayContaining([
        "lithuanian-business",
        "unsupported-claim",
        "technical-number",
        "installation-price",
      ]),
    );
  });

  it("scans the hub and every visitor-facing page field", () => {
    const { hub, pages } = getInformationAuditInput();
    const [page] = pages;
    const placeholder = "[PENDING CONTENT]";
    const hubFields = ["eyebrow", "title", "summary", "metaDescription"] as const;
    const pageFields = ["eyebrow", "title", "summary", "metaDescription"] as const;

    for (const field of hubFields) {
      const issues = auditInformationContent(
        { ...hub, [field]: placeholder },
        [page],
      );
      expect(issues).toContainEqual({
        pageSlug: "hub",
        code: "forbidden-visitor-content",
        rule: "placeholder",
      });
    }

    for (const field of pageFields) {
      const issues = auditInformationContent(hub, [
        { ...page, [field]: placeholder },
      ]);
      expect(issues).toContainEqual({
        pageSlug: page.slug,
        code: "forbidden-visitor-content",
        rule: "placeholder",
      });
    }
  });

  it("rejects relationship and installation claims in rendered nested content", () => {
    const { hub, pages } = getInformationAuditInput();
    const [page] = pages;
    const [section] = page.sections;
    const [statement] = section.statements;
    const [relatedCategoryLink] = page.relatedCategoryLinks ?? [];
    const contaminated = {
      ...page,
      relatedCategoryLinks: [
        {
          ...relatedCategoryLink,
          label: "Valtuutettu jälleenmyyjä Suomessa",
        },
      ],
      sections: [
        {
          ...section,
          statements: [
            {
              ...statement,
              text: "Asennamme kaikki bambulattiat aina liimaamalla.",
            },
          ] as const,
        },
      ] as const,
    };
    const issues = auditInformationContent(hub, [contaminated]);

    expect(issues).toContainEqual({
      pageSlug: page.slug,
      code: "forbidden-visitor-content",
      rule: "relationship-claim",
    });
    expect(issues).toContainEqual({
      pageSlug: page.slug,
      code: "forbidden-visitor-content",
      rule: "installation-scope",
    });

    const subtleClaims = auditInformationContent(hub, [
      {
        ...page,
        relatedCategoryLinks: [
          {
            ...relatedCategoryLink,
            label: "Osaühing IKB on bambutuotteiden valmistaja",
          },
        ],
        sections: [
          {
            ...section,
            statements: [
              {
                ...statement,
                text: "Liima-asennus kuuluu aina palveluun.",
              },
            ] as const,
          },
        ] as const,
      },
    ]);

    expect(subtleClaims.map((issue) => issue.rule)).toEqual(
      expect.arrayContaining(["relationship-claim", "installation-scope"]),
    );
  });
});
