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
| Not-ready products | 24 |
| Source categories | 22 |
| Normalized categories | 22 |
| Skipped categories | 0 |
| Source image references | 417 |
| Unique source images | 354 |
| Local image mappings | 355 |
| Local image files verified | 355 |
| Supplemental category images verified | 21 |
| Source documents | 0 |
| Local document mappings | 0 |
| Local document files verified | 0 |

## Readiness and omissions

The 2026-09-12 extraction is preserved unchanged. Product media missing from it was supplemented with source-linked captures dated 2026-09-23: 38 products gained local images, and 21 category thumbnails were recovered. Live category/detail evidence also corrected the assignments of source products 258, 452, 694, 615. Source product 178 still has no observed image, so its placeholder remains. Supplemental sources and applicable IDs are recorded in `data/catalog/supplemental-media-2026-09-23.json`.

The live LT terrace-board category dated 2026-09-23 supplied source-linked titles, canonical product links, and category membership for 17 existing product IDs. The corresponding Finnish listings are quote-only until Finnish commercial data is approved; the LT prices remain in the untouched raw extraction and are not published for these products. Evidence is recorded in `data/catalog/supplemental-products-2026-09-23.json`.

The LT installation-product pages checked on 2026-09-25 restored products 187 and 559 to the Finnish quote catalog. Product 187 has two source-linked local images. The image shown on the source page for the 11 kg WAKOL product depicts a 2.5 kg canister, so product 559 uses a manufacturer image from the official WAKOL PU 280 page showing an 11.0 kg canister. Evidence is recorded in `data/catalog/supplemental-installation-products-2026-09-25.json`.

Missing fields remain null and make their record not ready; they are never reconstructed from slugs, neighboring records or conflicting captures. Duplicate IDs are skipped. A price is publishable only with complete amount/currency/basis plus a valid product source URL and raw extraction date. Invalid prices, provenance, specification units, media, documents and relations are omitted and reported. The extraction exposed no product documents, so no document file was inferred from unrelated pages.

- `duplicate-normalized-slug`: 4
- `invalid-price-provenance`: 7
- `missing-name`: 20
- `missing-source-url`: 7

Not-ready records remain only in the internal normalized catalog and report for traceability. Public ready and quote-eligible selectors exclude them; their source IDs preserve internal lookup and provenance.

| Source ID | Finnish name | Readiness reason | Price state |
|---:|---|---|---|
| 173 | Sivupuristettu bambulevy – 3-kerroksinen, luonnollinen sävy | `duplicate-normalized-slug` | hidden |
| 174 | Sivupuristettu bambulevy – 3-kerroksinen, karbonisoitu sävy | `duplicate-normalized-slug` | hidden |
| 200 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 209 | — (missing in source) | `missing-name` | published |
| 473 | — (missing in source) | `missing-name` | published |
| 475 | — (missing in source) | `missing-name` | published |
| 476 | — (missing in source) | `missing-name` | published |
| 480 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 499 | — (missing in source) | `missing-name` | published |
| 500 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 536 | — (missing in source) | `missing-name` | published |
| 538 | — (missing in source) | `missing-name` | published |
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
| 743 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |
| 789 | — (missing in source) | `missing-name`, `missing-source-url`, `invalid-price-provenance` | hidden |

Commercial confirmations are separate from the reference snapshot: every normalized product carries the user-confirmed in-stock and sample states, delivery included subject to offer applicability, and a 12-month warranty subject to written scope and terms. VAT treatment remains an offer-stage confirmation.
