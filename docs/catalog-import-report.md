# Catalog import report

Generated from the LT catalog extraction dated 2026-09-12.

## Reconciliation

The 2026-09-11 URL audit found 130 unique LT product URLs. The current structured extraction dated 2026-09-12 contains 108 unique live product records. The 22-record difference is retained as a source-snapshot discrepancy: URL discovery proves that a route was observed, not that a current structured product record exists or is approved. No missing audit record was fabricated into the registry.

## Counts

| Measure | Count |
|---|---:|
| Source product rows | 108 |
| Unique source product IDs | 108 |
| Normalized products | 108 |
| Skipped products | 0 |
| Not-ready products | 42 |
| Source categories | 22 |
| Normalized categories | 22 |
| Skipped categories | 0 |
| Source image references | 356 |
| Unique source images | 294 |
| Local image mappings | 294 |
| Local image files verified | 294 |
| Source documents | 0 |
| Local document mappings | 0 |
| Local document files verified | 0 |

## Readiness and omissions

Missing fields remain null and make their record not ready; they are never reconstructed from slugs, neighboring records or conflicting captures. Duplicate IDs are skipped. A price is publishable only with complete amount/currency/basis plus a valid product source URL and raw extraction date. Invalid prices, provenance, specification units, media, documents and relations are omitted and reported. The extraction exposed no product documents, so no document file was inferred from unrelated pages.

- `duplicate-normalized-slug`: 4
- `invalid-price`: 14
- `invalid-price-provenance`: 7
- `missing-name`: 35
- `missing-source-url`: 7

Not-ready records remain only in the internal normalized catalog and report for traceability. Public ready and quote-eligible selectors exclude them; their source IDs preserve internal lookup and provenance.

| Source ID | Finnish name | Readiness reason | Price state |
|---:|---|---|---|
| 173 | Sivupuristettu bambulevy – 3-kerroksinen, luonnollinen sävy | `duplicate-normalized-slug` | hidden |
| 174 | Sivupuristettu bambulevy – 3-kerroksinen, karbonisoitu sävy | `duplicate-normalized-slug` | hidden |
| 187 | Adesiver 2K Premium -epoksipolyuretaanilattialiima, 12,5 kg | `invalid-price` | hidden |
| 200 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 209 | — (missing in source) | `missing-name` | published |
| 461 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 462 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 463 | Bambuterassilauta – dassoXTR' V137, Espresso-sävy | `invalid-price` | hidden |
| 464 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 465 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 466 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 467 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 468 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 469 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 470 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 471 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 473 | — (missing in source) | `missing-name` | published |
| 475 | — (missing in source) | `missing-name` | published |
| 476 | — (missing in source) | `missing-name` | published |
| 480 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 499 | — (missing in source) | `missing-name` | published |
| 500 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 536 | — (missing in source) | `missing-name` | published |
| 538 | — (missing in source) | `missing-name` | published |
| 540 | — (missing in source) | `missing-name` | published |
| 541 | — (missing in source) | `missing-name` | published |
| 559 | WAKOL PU 280 -vedeneristävä polyuretaanipohjuste, 11 kg | `invalid-price` | hidden |
| 567 | — (missing in source) | `missing-name` | published |
| 568 | — (missing in source) | `missing-name` | published |
| 569 | — (missing in source) | `missing-name` | published |
| 581 | — (missing in source) | `missing-name` | published |
| 583 | — (missing in source) | `missing-name` | published |
| 585 | — (missing in source) | `missing-name` | published |
| 600 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 682 | Sivupuristettu bambulevy – 3-kerroksinen, luonnollinen sävy | `duplicate-normalized-slug` | hidden |
| 683 | Sivupuristettu bambulevy – 3-kerroksinen, karbonisoitu sävy | `duplicate-normalized-slug` | hidden |
| 710 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 716 | — (missing in source) | `missing-name` | published |
| 717 | — (missing in source) | `missing-name` | published |
| 735 | — (missing in source) | `missing-name`, `invalid-price` | hidden |
| 743 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 789 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |

Commercial confirmations are separate from the reference snapshot: every normalized product carries the user-confirmed in-stock and sample states, delivery included subject to offer applicability, and a 12-month warranty subject to written scope and terms. VAT treatment remains an offer-stage confirmation.
