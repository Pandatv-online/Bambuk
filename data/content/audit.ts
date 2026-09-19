import { informationSources } from "./sources";
import type { InformationHub, InformationPage } from "./types";

export type InformationContentRule =
  | "lithuanian-business"
  | "unsupported-claim"
  | "technical-number"
  | "installation-price"
  | "installation-scope"
  | "placeholder"
  | "relationship-claim";

export type InformationContentIssue = Readonly<{
  pageSlug: string;
  code:
    | "forbidden-visitor-content"
    | "missing-applicability"
    | "missing-source";
  rule?: InformationContentRule;
}>;

const forbiddenVisitorRules: readonly Readonly<{
  rule: InformationContentRule;
  pattern: RegExp;
}>[] = [
  {
    rule: "lithuanian-business",
    pattern:
      /\bUAB\b|Kaunas|Alytus|Vilnius|Liettua|bambukogrindys\.lt/iu,
  },
  {
    rule: "unsupported-claim",
    pattern:
      /sertifi\w*|ympäristöystävälli\w*|ekologi\w*|hiilineutraali\w*|paloluok\w*|formaldehyd\w*|elinikäinen|\bparas\b|\bkovin\b/iu,
  },
  {
    rule: "technical-number",
    pattern:
      /\b\d+(?:[.,]\d+)?\s*(?:°\s*c|%|mm\b|m²\s*k\/w|mg\/l)/iu,
  },
  {
    rule: "installation-price",
    pattern:
      /(?:€|\beuroa?\b).{0,24}(?:\/\s*m²|neliö)|asenn\w*.{0,40}(?:€|\beuroa?\b)/iu,
  },
  {
    rule: "installation-scope",
    pattern:
      /\b(?:asennamme|tarjoamme\s+asenn\w*|toteutamme\s+asenn\w*|(?:asennuspalvelu(?:mme)?|palvelumme)\s+(?:sisältää|kattaa)|palvelualue(?:emme)?\s+(?:on|kattaa)|(?:uiva|liima|kiinnitys)[-\s]?asennus\s+(?:kuuluu|sisältyy|onnistuu|tehdään))\b/iu,
  },
  {
    rule: "placeholder",
    pattern: /\[[^\]\r\n]+\]/u,
  },
  {
    rule: "relationship-claim",
    pattern:
      /\b(?:virallinen|valtuutettu|jakelija|jälleenmyyjä|maahantuoja|authorized\s+distributor|official\s+distributor)\b|osaühing\s+ikb.{0,64}\b(?:valmistaja|brändi|manufacturer)\b|\b(?:valmistaja|brändi|manufacturer)\b.{0,64}osaühing\s+ikb/iu,
  },
];

function getHubVisitorText(hub: InformationHub): string {
  return [hub.eyebrow, hub.title, hub.summary, hub.metaDescription].join("\n");
}

function getVisitorText(page: InformationPage): string {
  return [
    page.eyebrow,
    page.title,
    page.summary,
    page.metaDescription,
    ...page.sections.flatMap((section) => [
      section.title,
      ...section.statements.flatMap((statement) => [
        statement.text,
        statement.applicability,
      ]),
    ]),
    ...(page.relatedCategoryLinks ?? []).map((link) => link.label),
    ...page.sourceIds.flatMap((sourceId) => {
      const source = informationSources.find(({ id }) => id === sourceId);
      return source ? [source.labelFi] : [];
    }),
  ].join("\n");
}

export function auditInformationContent(
  hub: InformationHub,
  pages: readonly InformationPage[],
): readonly InformationContentIssue[] {
  const sourceIds = new Set(informationSources.map((source) => source.id));
  const issues: InformationContentIssue[] = [];

  for (const { rule, pattern } of forbiddenVisitorRules) {
    if (pattern.test(getHubVisitorText(hub))) {
      issues.push({
        pageSlug: "hub",
        code: "forbidden-visitor-content",
        rule,
      });
    }
  }

  for (const page of pages) {
    const visitorText = getVisitorText(page);

    for (const { rule, pattern } of forbiddenVisitorRules) {
      if (pattern.test(visitorText)) {
        issues.push({
          pageSlug: page.slug,
          code: "forbidden-visitor-content",
          rule,
        });
      }
    }

    for (const section of page.sections) {
      for (const statement of section.statements) {
        if (!statement.applicability.trim()) {
          issues.push({
            pageSlug: page.slug,
            code: "missing-applicability",
          });
        }

        if (
          statement.sourceIds.length === 0 ||
          statement.sourceIds.some((sourceId) => !sourceIds.has(sourceId))
        ) {
          issues.push({ pageSlug: page.slug, code: "missing-source" });
        }
      }
    }
  }

  return issues;
}
