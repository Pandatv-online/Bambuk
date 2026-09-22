СДЕЛАНО: importReferenceCatalog normalizes all 108 unique source records and 22 categories.
СДЕЛАНО: completeness, duplicates, missing facts, invalid media/relations and commercial-state seams are green.
СДЕЛАНО: 294 unique product images are downloaded and verified; source exposes zero documents.
ФАЙЛЫ: lib/catalog, data/catalog, scripts/catalog and both catalog-import tests are implemented.
ФАЙЛЫ: public/images/products contains 294 non-empty local JPG files.
ФАЙЛЫ: docs/catalog-import-report.md and catalog.generated.json were generated after verification.
РЕШЕНИЯ: supplemental captures reconcile only same-ID missing names/URLs and known wrong category assignments.
РЕШЕНИЯ: raw missing/partial prices remain hidden and mark 14 products not-ready; no basis is inferred.
РЕШЕНИЯ: Finnish slugs include source ID for uniqueness and never provide product facts.
ТУПИКИ: sandbox DNS blocked asset fetch; approved escalated run downloaded all 294 files successfully.
ТУПИКИ: source slugs repeat for distinct IDs, so uniqueness is enforced on generated Finnish slugs instead.
ТУПИКИ: Node cannot directly resolve extensionless TS imports; generator compiles importer to a temporary CommonJS build.
ДАЛЬШЕ: rerun generator once, then catalog-import tests, typecheck and lint after latest translation change.
ДАЛЬШЕ: run full npm test and npm run build; inspect failures without touching files outside ticket 01.
ДАЛЬШЕ: inspect final git diff/status, report exact counts and any remaining name/readiness concern.
