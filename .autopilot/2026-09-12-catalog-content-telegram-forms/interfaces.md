# Общие интерфейсы сборки

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `company-config` | Osaühing IKB facts, nullable legal fields, release readiness | `siteConfig`, `getReleaseReadiness()` | env/defaults and missing-field policy |
| `catalog-source` | raw reference extraction and normalization | `importReferenceCatalog(raw) -> ImportResult` | source parsing, translation mapping and rejection report |
| `catalog-data` | categories, collections, products and provenance | typed registries and selectors | storage layout and raw source records |
| `catalog-query` | URL facets, sorting and pagination | `parseCatalogQuery()`, `queryProducts()` | normalization and facet counting |
| `catalog-ui` | catalog/category/product presentation | CatalogShell, filters, cards, grids, product-detail presenters | responsive composition |
| `content-data` | Finnish information-page and FAQ records | route-keyed published content selectors | source translation/provenance files |
| `gallery-data-ui` | rights-recorded media and scene filters | gallery selectors and accessible lightbox | focus/scroll/modal state |
| `inquiry-schema` | contact/quote/sample normalization and validation | typed schemas and field errors | coercion, honeypot and anti-repeat fields |
| `inquiry-transport` | outbound Telegram delivery | `sendInquiry(inquiry)` | Telegram API, timeout, escaping and credentials |
| `inquiry-ui` | forms and status states | reusable form variants | client submission state |
| `routes-seo` | route registry, metadata and noindex policy | navigation/breadcrumbs/canonical metadata | route resolution and release gating |

Primary test seams: `importReferenceCatalog`, `queryProducts`, product/content selectors, `getReleaseReadiness`, inquiry schemas/transport adapter and rendered route outcomes. Tests mock outbound Telegram; they never send a real message.

## Правила проекта

- Next.js 16 App Router, React 19, TypeScript 5.9 strict, Tailwind CSS 4. Server Components by default.
- Use Node `22.22.3` from `.nvmrc`. Commands: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.
- Read `AGENTS.md` and all five mandatory docs before editing. Use exact Finnish wording from the content map where available.
- Product data never lives in JSX. Missing values remain absent/null and must not be invented or copied between SKUs.
- Reference URLs, Lithuanian company details and remote reference-site requests must not appear in visitor HTML.
- Local assets need `rightsId`, source URL and applicability. Every discovered public product document is downloaded or the affected record is marked not ready.
- Osaühing IKB is an Estonian company serving Finland and Estonia. Publish no distributor/manufacturer relationship claim.
- Confirmed public facts: phone `+358 50 508 0808`, `ma–pe 8.00–18.00`, all imported active products in stock, samples available, delivery included subject to offer applicability, warranty 5 years subject to written terms.
- Domain, company IDs, address, email, privacy/legal text, VAT scope, installation scope/area/terms and Telegram credentials remain explicit missing inputs.
- Never request, store or print Telegram secret values. `.env.example` contains names only; tests always mock outbound network.
- Do not install a dependency. If a required dependency is missing, return `BLOCKED` with the exact need.
- Preserve unrelated user changes, especially the pre-existing `next-env.d.ts` modification.

## Ownership discipline

- Edit only the ticket zone. If a necessary file belongs to another ticket, report it rather than editing across the boundary.
- Do not edit `.autopilot/state.js`, the manifest, interfaces or dashboard; only the orchestrator owns those.
- Do not commit. Return changed files, checks, requirement coverage and concerns in at most 25 lines.

## Из таска 01 — каталог

- `importReferenceCatalog(raw): CatalogImportResult` — единственная точка normalizer/validation для raw Firecrawl snapshot; missing source fields stay nullable and invalid relations are rejected.
- `catalogCategories`, `catalogProducts`, `catalogImportReport` — generated typed registries and reconciliation report.
- `getCatalogCategoryById(id)`, `getCatalogProductById(id)`, `getReadyCatalogProducts()`, `getQuoteEligibleCatalogProducts()` — public selectors; quote-eligible returns active records only and nobody may bypass it with raw filtering.
- `ProductPricing = HiddenPricing | PublishedPricing`; the published arm requires string `sourceUrl` and `extractedAt`, while hidden provenance remains nullable. `CatalogSource.url/extractedAt` and `CatalogProduct.nameFi/nameSource/categoryId` remain nullable when source facts are missing; `brand` is null without an explicit source field.
- Issues include `invalid-source-date`, `invalid-price-provenance`, `duplicate-normalized-slug`; a slug collision invalidates every participant deterministically.
- Current generated snapshot: 108 traceable internal products, 66 active/quote-eligible, 42 report-only `notReady`, 294 local image files and 0 discovered product documents.

## Из таска 02 — компания и оболочка

- `siteConfig.company.registrationCountry: "EE" | null` and `servedMarkets: readonly ("FI" | "EE")[]` distinguish the Estonian operator from served markets.
- `siteConfig.contact.phoneHref: tel:${string} | null` and `visitWording: string | null` are the shared public contact values.
- `getReleaseReadiness(config?, environment?) -> ReleaseReadiness` keeps domain/address/IDs/email/privacy/form configuration as blockers; relationship wording is intentionally not required or public.
- Shared header, mobile navigation and footer render Osaühing IKB, `+358 50 508 0808`, `ma–pe 8.00–18.00` and visit-by-phone wording from config.

## Из таска 03 — каталог и фильтры

- `parseCatalogQuery(searchParams, source?) -> ParsedCatalogQuery` normalizes known repeated facets, sort and page values.
- `queryProducts(query, source?) -> CatalogQueryResult` is the only public filtering/sorting/pagination seam and defaults to the 66 active quote-eligible records.
- `getCatalogFacets(source?) -> CatalogFacets` derives available filters from the provided active source.
- `createCatalogUrl(query, patch?) -> /fi/tuotteet${string}` preserves/canonicalizes URL state.
- `getCatalogCategoryPath(id, categories?)` and `getCatalogProductPath(product, categories?)` return a controlled local path or null.
- `CatalogShell`, `CatalogFilters`, `CatalogProductCard` own the responsive listing UI; product detail rendering remains ticket 05.
- `getCatalogAttributeLabel(facet, sourceValue) -> string | null`; unmapped source-locale values return null and are excluded from public facets.

## Из таска 04 — Telegram-заявки

- `parseInquiryPayload(payload, options?) -> InquiryValidationResult`, `contactInquirySchema`, `quoteInquirySchema` and `sampleInquirySchema` provide the shared validation seam.
- `sendInquiry(inquiry) -> Promise<InquiryDeliveryResult>` is the sole public transport surface; Telegram credentials, formatter, timeout and transport constructor remain internal.
- `POST /api/inquiries` accepts JSON/form-data and returns typed responses; it stops oversized streamed bodies early and keeps multipart boundaries intact.

## Из таска 05 — страницы товаров

- `resolveCatalogRoute(segments) -> ResolvedCatalogRoute | null` and `getCatalogRouteParams()` are the controlled catch-all route seam.
- `CategoryDetailPage`, `ProductDetailPage` and `ProductGallery` render data-driven outcomes; the catch-all has `dynamicParams = false` and owns static params/metadata.

## Из таска 06 — информационные страницы

- `getPublishedInformationHub()`, `getPublishedInformationPages()` and route-keyed published slug/path selectors expose only visitor-safe published records.
- `PublishedInformationPage.relatedCategoryLinks` contains visitor-safe category links; raw registries, source locators, audit and provenance/review fields stay internal.

## Из таска 07 — галерея

- `getGalleryPresentationItems(scene?)`, `getGalleryItemsByScene()` and `getGalleryOgImage()` are the public gallery seam; presentation records omit rights, source and product provenance.
- Raw gallery records stay internal and carry `GallerySource.url: https://${string}` plus rights metadata for every local asset.

## Из таска 08 — контактные формы

- Public forms barrel exports only `ContactForm`, `QuoteForm` and `SampleRequestForm`; the low-level generic form remains internal.
- Form variants use `POST /api/inquiries`, typed responses and shared `siteConfig` contact/company values; no UI code owns Telegram credentials or duplicated company facts.
