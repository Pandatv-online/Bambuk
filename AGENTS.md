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

This is a Finnish, quote-led site built with Next.js 16.3.4 App Router, React 19.3, TypeScript 5.9 strict and Tailwind 4.3. The configured operator is `Osaühing IKB`, registered in EE and serving FI/EE; manufacturer fields and relationship wording are null, so no relationship claim is rendered. The public implementation now covers `/fi`, catalog/listing and static catalog details, information guides, gallery/lightbox, contact/quote/sample pages, and `POST /api/inquiries`; `/` permanently redirects to `/fi`.

### Verified commands

Node 22.22.3 is required by `.nvmrc` and `package.json` engines; do not assume `nvm` exists in a noninteractive shell. `npm test` (87 passed), `npm run typecheck`, `npm run lint`, and `npm run build` (webpack) have passed. Use `npm install` for the lockfile dependency set and `npm run dev` for local work.

### Structure and public boundaries

- `data/catalog/catalog.generated.json` is the catalog snapshot; `data/catalog/index.ts` exports registries/selectors. `lib/catalog/import-reference-catalog.ts` is the normalization boundary; `lib/catalog/query.ts` owns query parsing, facets, filtering, sort, pagination and controlled paths.
- `components/catalog/product/catalog-route.ts` resolves static catch-all category/product routes; `app/fi/tuotteet/[...segments]/page.tsx` has `dynamicParams = false`. Product/category presenters, cards and filters remain data-driven.
- `data/content/pages.ts` keeps provenance-bearing authoring records private and exposes only published projections through `data/content`; `data/gallery/registry.ts` retains media source/rights records while `data/gallery` exposes safe gallery projections.
- `lib/site-config.ts` owns `siteConfig` and `getReleaseReadiness`; `lib/seo.ts` owns `createPageMetadata`/`getMetadataBase`. The inquiry seam is `parseInquiryPayload`, typed schemas, `sendInquiry`, and `createInquiryPostHandler`; the forms barrel exposes only `ContactForm`, `QuoteForm`, and `SampleRequestForm`.
- Key routes are `app/fi/tuotteet/page.tsx`, `app/fi/tietoa-bambusta/`, `app/fi/galleria/`, `app/fi/yhteystiedot/`, `app/fi/pyyda-tarjous/`, and `app/fi/tilaa-mallipala/`; shared navigation is generated from catalog/content data in `data/navigation.ts`.

### Conventions and gotchas

- The catalog has 22 categories and 108 normalized products: 66 `active`/quote-eligible and 42 `notReady`; it has 294 local product images, no mapped documents, and explicit provenance/readiness issues. Do not bypass active selectors or derive facts from a slug or similar SKU.
- Product cards/details presently render the record's published-price, in-stock, sample, delivery and warranty fields directly; 44 records have `pricing.status === "published"`. These are snapshot data, despite feature flags being false, so release requires commercial revalidation rather than a UI-only toggle.
- Product URLs are derived only by `getCatalogCategoryPath`/`getCatalogProductPath`; filtering goes only through `parseCatalogQuery` and `queryProducts`. Keep raw source URLs, rights metadata and review fields out of visitor projections/HTML.
- Guide and gallery status/metadata, catalog metadata and form metadata are noindex; `createPageMetadata` defaults to noindex. There are no sitemap, robots, structured-data, installation, about, privacy, search or error-route implementations yet.
- All forms post to `/api/inquiries`; the API limits bodies, validates timing/honeypot/idempotency, rejects files, and uses process-local duplicate suppression. Telegram transport is server-only, timeout-bounded and must stay behind its adapter; outbound delivery is always mocked in tests.

### Environment and QA

Environment names only: `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CHROME_DEVTOOLS_URL`, `QA_SITE_URL`, `QA_VIEWPORTS`, `QA_SCREENSHOT_MODE`, and `QA_CDP_TIMEOUT_MS`. Never commit or print their values. `scripts/browser-qa.mjs` needs a running site plus Chrome DevTools, covers four viewports, catalog/gallery journeys and simulated form states, and writes captures under `/tmp`.

### Tests and handoff

Vitest coverage is organized under `tests/` for site config/SEO/navigation, catalog import/query/routes/product galleries, content claims/routes, gallery data/interactions/routes, inquiries/API/transport/forms, and integration routes. Production readiness remains blocked until all required company, domain, contact, legal and form fields are configured; current pages intentionally stay non-indexable. Preserve existing uncommitted work (including `next-env.d.ts`), keep facts outside JSX, and rerun only the checks proportionate to an edited surface.
<!-- autopilot:end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
