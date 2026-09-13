import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "../..");
const compiler = path.join(projectRoot, "node_modules/.bin/tsc");
const temporaryBuild = await mkdtemp(path.join(tmpdir(), "bambuk-catalog-import-"));

execFileSync(
  compiler,
  [
    "lib/catalog/import-reference-catalog.ts",
    "--noCheck",
    "--module",
    "commonjs",
    "--moduleResolution",
    "node",
    "--target",
    "ES2022",
    "--outDir",
    temporaryBuild,
    "--rootDir",
    projectRoot,
    "--esModuleInterop",
    "true",
    "--skipLibCheck",
    "true",
  ],
  { cwd: projectRoot, stdio: "inherit" },
);

const require = createRequire(import.meta.url);
const { importReferenceCatalog } = require(
  path.join(temporaryBuild, "lib/catalog/import-reference-catalog.js"),
);
const rawPath = path.join(projectRoot, ".firecrawl/catalog-products-2026-09-12.json");
const raw = JSON.parse(await readFile(rawPath, "utf8"));
const result = importReferenceCatalog(raw);

const dataDirectory = path.join(projectRoot, "data/catalog");
await mkdir(dataDirectory, { recursive: true });

const downloadAssets = process.argv.includes("--download-assets");
const images = [
  ...new Map(
    result.products
      .flatMap((product) => product.images)
      .map((image) => [image.src, image]),
  ).values(),
];
const documents = [
  ...new Map(
    result.products
      .flatMap((product) => product.documents)
      .filter((document) => document.file)
      .map((document) => [document.file, document]),
  ).values(),
];

const download = async (sourceUrl, visitorPath, expectedType) => {
  const target = path.join(projectRoot, "public", visitorPath.slice(1));
  await mkdir(path.dirname(target), { recursive: true });
  try {
    if ((await stat(target)).size > 0) return "existing";
  } catch {
    // The target is downloaded below.
  }

  const response = await fetch(sourceUrl, {
    headers: { "user-agent": "Bambuk-Finland-catalog-import/2026-09-12" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${response.status} ${sourceUrl}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith(expectedType)) {
    throw new Error(`Unexpected ${contentType || "unknown content type"}: ${sourceUrl}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength === 0) throw new Error(`Empty response: ${sourceUrl}`);
  const temporaryTarget = `${target}.download`;
  await writeFile(temporaryTarget, bytes);
  await rename(temporaryTarget, target);
  return "downloaded";
};

const runPool = async (items, worker) => {
  const queue = [...items];
  const results = [];
  const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) results.push(await worker(item));
    }
  });
  await Promise.all(workers);
  return results;
};

let imageResults = [];
let documentResults = [];
if (downloadAssets) {
  imageResults = await runPool(images, (image) =>
    download(image.sourceUrl, image.src, "image/"),
  );
  documentResults = await runPool(documents, (document) =>
    download(document.sourceUrl, document.file, "application/pdf"),
  );
}

const localFileExists = async (visitorPath) => {
  try {
    return (await stat(path.join(projectRoot, "public", visitorPath.slice(1)))).size > 0;
  } catch {
    return false;
  }
};
const verifiedLocalImages = (
  await Promise.all(images.map((image) => localFileExists(image.src)))
).filter(Boolean).length;
const verifiedLocalDocuments = (
  await Promise.all(documents.map((document) => localFileExists(document.file)))
).filter(Boolean).length;
const finalizedResult = {
  ...result,
  report: {
    ...result.report,
    verifiedLocalImages,
    verifiedLocalDocuments,
  },
};
await writeFile(
  path.join(dataDirectory, "catalog.generated.json"),
  `${JSON.stringify(finalizedResult, null, 2)}\n`,
  "utf8",
);

const issueCounts = Object.entries(
  result.report.issues.reduce((counts, issue) => {
    counts[issue.code] = (counts[issue.code] ?? 0) + 1;
    return counts;
  }, {}),
).sort(([left], [right]) => left.localeCompare(right));
const notReadyRows = result.products
  .filter((product) => product.status === "notReady")
  .map(
    (product) =>
      `| ${product.id} | ${(product.nameFi ?? "— (missing in source)").replaceAll("|", "\\|")} | ${product.readinessIssues.map((issue) => `\`${issue}\``).join(", ")} | ${product.pricing.status} |`,
  );
const missingFromAudit = result.report.auditDifference;
const extractionDateLabel = result.report.extractedAt ?? "missing/invalid source date";
const report = `# Catalog import report

Generated from the LT catalog extraction dated ${extractionDateLabel}.

## Reconciliation

The 2026-09-11 URL audit found 130 unique LT product URLs. The current structured extraction dated 2026-09-12 contains ${result.report.uniqueSourceProducts} unique live product records. The ${missingFromAudit}-record difference is retained as a source-snapshot discrepancy: URL discovery proves that a route was observed, not that a current structured product record exists or is approved. No missing audit record was fabricated into the registry.

## Counts

| Measure | Count |
|---|---:|
| Source product rows | ${result.report.sourceProducts} |
| Unique source product IDs | ${result.report.uniqueSourceProducts} |
| Normalized products | ${result.report.normalizedProducts} |
| Skipped products | ${result.report.skippedProducts} |
| Not-ready products | ${result.report.notReadyProducts} |
| Source categories | ${result.report.sourceCategories} |
| Normalized categories | ${result.report.normalizedCategories} |
| Skipped categories | ${result.report.skippedCategories} |
| Source image references | ${result.report.sourceImageReferences} |
| Unique source images | ${result.report.uniqueSourceImages} |
| Local image mappings | ${result.report.mappedLocalImages} |
| Local image files verified | ${verifiedLocalImages} |
| Source documents | ${result.report.sourceDocuments} |
| Local document mappings | ${result.report.mappedLocalDocuments} |
| Local document files verified | ${verifiedLocalDocuments} |

## Readiness and omissions

Missing fields remain null and make their record not ready; they are never reconstructed from slugs, neighboring records or conflicting captures. Duplicate IDs are skipped. A price is publishable only with complete amount/currency/basis plus a valid product source URL and raw extraction date. Invalid prices, provenance, specification units, media, documents and relations are omitted and reported. The extraction exposed no product documents, so no document file was inferred from unrelated pages.

${issueCounts.length > 0 ? issueCounts.map(([code, count]) => `- \`${code}\`: ${count}`).join("\n") : "- No import issues."}

Not-ready records remain only in the internal normalized catalog and report for traceability. Public ready and quote-eligible selectors exclude them; their source IDs preserve internal lookup and provenance.

| Source ID | Finnish name | Readiness reason | Price state |
|---:|---|---|---|
${notReadyRows.length > 0 ? notReadyRows.join("\n") : "| — | — | — | — |"}

Commercial confirmations are separate from the reference snapshot: every normalized product carries the user-confirmed in-stock and sample states, delivery included subject to offer applicability, and a five-year warranty subject to written scope and terms. VAT treatment remains an offer-stage confirmation.
`;
await writeFile(path.join(projectRoot, "docs/catalog-import-report.md"), report, "utf8");

console.log(
  JSON.stringify({
    products: result.products.length,
    categories: result.categories.length,
    images: images.length,
    documents: documents.length,
    downloadedImages: imageResults.filter((value) => value === "downloaded").length,
    existingImages: imageResults.filter((value) => value === "existing").length,
    downloadedDocuments: documentResults.filter((value) => value === "downloaded").length,
    existingDocuments: documentResults.filter((value) => value === "existing").length,
    notReadyProducts: result.report.notReadyProducts,
  }),
);
