# Bambuk Finland website — agent rules

## Mandatory reading before any modification

Before changing application code, content, product data, styles, configuration, routes, or assets, read these files in full:

1. `docs/reference-site-audit.md`
2. `docs/finland-site-architecture.md`
3. `docs/design-system.md`
4. `docs/component-inventory.md`
5. `docs/content-map.md`

Do not begin implementation until the user approves the audit/architecture stage. If these documents conflict, stop and resolve the conflict rather than silently choosing one.

## Project purpose

Build the Finnish website for `[OUR COMPANY NAME]`, an authorized Finnish distributor of the manufacturer/brand represented by the reference site <https://www.bambukogrindys.lt/>. Preserve the reference’s visual DNA, information depth, catalog logic, and familiar customer journey while keeping the Lithuanian manufacturer/business and Finnish distributor legally and visually distinct.

## Required stack and structure

- Next.js App Router
- TypeScript with strict types
- Tailwind CSS
- Reusable accessible components
- Product/content data separated from presentation
- Preferred top-level directories: `/app`, `/components`, `/data`, `/lib`, `/public`, `/styles`, `/docs`
- Server Components by default; add client boundaries only for real interaction

## Non-negotiable data rules

- Never invent or infer products, specifications, dimensions, prices, availability, certifications, warranties, environmental claims, reviews, ratings, lead times, installation conditions or service coverage.
- Treat values visible on the reference website as research snapshots, not automatically approved Finnish data.
- Preserve manufacturer facts accurately and record their source/version/applicable SKU.
- Do not use a technical fact from one product on another product.
- Do not use a legacy URL slug as authoritative product data.
- Missing commercial information renders a quote/contact path, not a fabricated placeholder value.
- Placeholders such as `[OUR COMPANY NAME]` must never reach production.

## Identity and content rules

- `[OUR COMPANY NAME]` is the Finnish site operator, seller/contact and distributor.
- The manufacturer/original brand is a separate entity.
- Do not imply the Finnish company is the Lithuanian company or a legal branch unless explicit supplied facts say so.
- Replace all Lithuanian addresses, phones, emails, company/VAT data, sales/delivery/legal information and installation prices.
- Finnish copy must sound natural; never publish raw mechanical translation.
- Use `bambuparketti` only when the product construction supports that term.
- Claims must pass the source workflow in `docs/content-map.md`.

## Architecture rules

- Navigation, footer, breadcrumbs, sitemap and search share controlled route/category data.
- Product records live outside UI components and support category-specific flexible specifications.
- A product can be added/removed without editing product-card, listing or product-page UI code.
- Price, stock, calculator, samples, newsletter, cart, checkout and account are independently feature-gated.
- Initial conversion is quote/contact/sample, not checkout.
- Installation is a first-class service and must link bidirectionally with applicable products.
- A CMS/database is added only after a concrete editing, approval, multilingual or integration need is established.

## Design rules

- Use `docs/design-system.md` as the source of truth.
- Preserve warm beige/cream surfaces, condensed display typography, green actions, restrained borders/shadows, large photography, catalog density and reference-aligned section rhythm.
- Do not create a new visual identity or introduce unsupported badges/trust decoration.
- Use the retained `.firecrawl/home-full-page.png` and `.firecrawl/main.css` as reference evidence, not as code to copy wholesale.
- Do not copy inaccessible behavior such as disabling page zoom.
- All navigation, dialogs, galleries, forms and accordions must work with keyboard and visible focus.

## SEO rules

- Every indexable page has unique title, meta description, canonical, Open Graph, semantic H1 and clean URL.
- Generate sitemap and robots directives from published content state.
- Product JSON-LD may contain Offer only when Finnish price/availability is current and real.
- Never add fake Review or AggregateRating data.
- Organization/LocalBusiness structured data describes the Finnish distributor; do not merge it with the manufacturer.
- `hreflang` is emitted only for complete equivalent localized pages.

## Development stages and verification

Work in the twelve stages defined in `docs/finland-site-architecture.md`. After each major stage:

1. Check the result against the audit, design system and content map.
2. Compare desktop and mobile presentation with the retained reference evidence.
3. Validate data/claim provenance and distributor/manufacturer separation.
4. Test responsive behavior, keyboard accessibility and relevant forms/routes.
5. Report deviations and their usability/technical reason; do not silently redesign.

No implementation code existed when these rules were created. Preserve unrelated user changes in any future working tree.

<!-- autopilot:start -->
## Durable project memory (T3)

### Overview

Finnish, quote-led site on Next.js 16.3.4 App Router, React 19.3, strict TypeScript 5.9 and Tailwind 4.3. `Osaühing IKB` is the configured Estonian operator serving FI/EE; manufacturer identity and relationship wording remain null. `/` permanently redirects to `/fi`. The implemented visitor routes cover the homepage, catalog and static product details, information guides, gallery/lightbox, contact/quote/sample forms and `/fi/tietosuoja`; inquiries go to `POST /api/inquiries`.

### Commands and environment

Node 22.22.3 is pinned in `.nvmrc` and constrained by `package.json`; do not assume `nvm` exists in a noninteractive shell. Verified: `npm test` (93/93), `npm run typecheck`, `npm run lint`, and `npm run build` with `NEXT_PUBLIC_SITE_URL` set to the public origin. `npm run build` uses webpack and fails without `NEXT_PUBLIC_SITE_URL` because `getMetadataBase` rejects an absent or localhost production origin. `npm run dev` is the local development script.

Environment names only: `NEXT_PUBLIC_SITE_URL` supplies canonical/metadata origin; `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` enable server-side delivery; `CHROME_DEVTOOLS_URL`, `QA_SITE_URL`, `QA_VIEWPORTS`, `QA_SCREENSHOT_MODE`, and `QA_CDP_TIMEOUT_MS` configure browser QA. Do not print or commit secret values. `scripts/browser-qa.mjs` needs a running site and Chrome DevTools, exercises four viewports and writes captures under `/tmp`.

### Structure and public boundaries

- `data/catalog/catalog.generated.json` is the catalog snapshot; `data/catalog/index.ts` exports registries/selectors. `lib/catalog/import-reference-catalog.ts` is the normalization boundary; `lib/catalog/query.ts` owns query parsing, facets, filtering, sort, pagination and controlled paths.
- `components/catalog/product/catalog-route.ts` resolves static catch-all category/product routes; `app/fi/tuotteet/[...segments]/page.tsx` has `dynamicParams = false`. Product/category presenters, cards and filters remain data-driven.
- `data/content/pages.ts` keeps provenance-bearing authoring records private and exposes only published projections through `data/content`; `data/gallery/registry.ts` retains media source/rights records while `data/gallery` exposes safe gallery projections.
- `data/company.ts` holds registry provenance; `data/commercial.ts` supplies the single published 12-month warranty value. `lib/site-config.ts` owns `siteConfig` and `getReleaseReadiness`; `lib/seo.ts` owns `createPageMetadata` and `getMetadataBase`.
- `data/privacy.ts` owns `privacyNotice` and `getPrivacyNoticeByPath`; `app/fi/tietosuoja/page.tsx` renders its noindex policy. `data/navigation.ts` exports `footerLegalNavigation`, and all three forms link to the same controlled policy path.
- `parseInquiryPayload` and typed schemas validate the three forms; `createInquiryPostHandler` handles the API, and `sendInquiry` is the only outbound transport boundary. `lib/inquiries/retention.ts` owns the 12-month deadline calculation used by `lib/inquiries/message.ts`. `components/forms/index.ts` exposes `ContactForm`, `QuoteForm`, and `SampleRequestForm`.
- Key routes live under `app/fi/tuotteet/`, `app/fi/tietoa-bambusta/`, `app/fi/galleria/`, `app/fi/yhteystiedot/`, `app/fi/pyyda-tarjous/`, and `app/fi/tilaa-mallipala/`; shared navigation is generated from catalog/content data in `data/navigation.ts`.

### Conventions and gotchas

- The catalog has 22 categories and 108 normalized products: 66 `active`/quote-eligible and 42 `notReady`; it has 294 local product images, no mapped documents, and explicit provenance/readiness issues. Do not bypass active selectors or derive facts from a slug or similar SKU.
- Product cards/details render record-level published price, stock, sample, delivery and warranty fields; 44 records have `pricing.status === "published"`. These are snapshot data despite disabled feature flags, so commercial facts need revalidation before release.
- Product URLs are derived only by `getCatalogCategoryPath`/`getCatalogProductPath`; filtering goes only through `parseCatalogQuery` and `queryProducts`. Keep raw source URLs, rights metadata and review fields out of visitor projections/HTML.
- `createPageMetadata` defaults to noindex; catalog, guide, gallery, form and privacy routes remain noindex. Homepage indexing also depends on `getReleaseReadiness`. Sitemap, robots, structured data, dedicated installation/about/search and error routes are not implemented.
- The API limits bodies, validates timing/honeypot/idempotency, rejects files and suppresses duplicates in process memory. Telegram transport is server-only and timeout-bounded; tests mock outbound delivery.
- Privacy copy matches the form schema and states operator retention of inquiries and working copies for 12 months. Telegram notifications include a calculated deletion deadline. `docs/inquiry-retention-procedure.md` describes manual monthly deletion; the app has no inquiry database or automatic Telegram/provider deletion. Legal review and Telegram transfer details remain release blockers.

### Tests and handoff

Vitest coverage under `tests/` spans config/SEO/navigation, catalog import/query/routes, content/gallery, privacy, inquiries/API/transport/forms and integration routes. `getReleaseReadiness` still reports missing email, visit approval, privacy review, delivery terms and form destination for production; the configured public origin alone does not make pages indexable. Preserve unrelated working-tree changes, including `next-env.d.ts` and `.firecrawl/` research files.
<!-- autopilot:end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
