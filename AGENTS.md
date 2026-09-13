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
## Durable project memory (T1)

This repository implements the Finnish, quote-led distributor site for customers comparing bamboo flooring, decking, related products and installation. It is a Next.js 16.3.4 App Router application with React 19.3, strict TypeScript and Tailwind CSS 4. The Finnish distributor is the future seller/site operator; the manufacturer remains a separate entity. The current `/fi` homepage is a review-state foundation, not a launch-ready catalog or commerce site.

### Commands and verified baseline

Run `nvm use` first; `.nvmrc` pins Node 22.22.3.

- `npm install` — install the npm-lockfile dependency set.
- `npm run dev` — run the local Next.js server.
- `npm test` — run Vitest; verified: 7 files, 11 tests passing.
- `npm run typecheck` — run strict `tsc --noEmit`; verified passing.
- `npm run lint` — run ESLint; verified passing.
- `npm run build` — production build via webpack; verified passing.

### Working tree map

```text
app/                    root redirect, Finnish layout, and composed `/fi` homepage
components/ui/          reusable Button, CTA, layout, notice, and typography primitives
components/navigation/  shared header/footer, desktop disclosures, mobile dialog, breadcrumbs
components/catalog/     category and product cards/grids with pending and quote states
components/media/, gallery/  local responsive media and gallery presenters
data/                   typed navigation, homepage, category, and empty product registries
lib/                    nullable site configuration, release readiness, and metadata helpers
public/                 self-hosted font and registered local homepage images
styles/                 global tokens, layout, responsive, focus, and reduced-motion CSS
tests/                  Vitest seams for config, SEO, registries, route, presenters, and navigation
scripts/                Chrome DevTools browser QA harness for `/fi`
docs/                   governing audit/architecture/design/content and input provenance
```

### Public boundaries to preserve

- Configuration: `siteConfig`, `getReleaseReadiness(config?, environment?)`, and their exported types in `lib/site-config.ts`.
- Content: `navigation`, `homepageContent`, `categories`, `products`, `getPublishedProducts()`, `createDefaultCommercialState()`, and exported models from `data/index.ts`.
- SEO: `createPageMetadata(input, config?)` in `lib/seo.ts`; `/fi` composes data through this boundary.
- UI barrels expose shared primitives, navigation, category/product presenters, responsive media, and gallery components. Keep facts and route registries outside JSX.

### Sharp edges and release guards

- Development readiness is deliberately permissive, but production readiness is false while required Finnish identity, contact, legal, domain, manufacturer and form inputs are null. The homepage is also `status: "review"`, so `/fi` emits `noindex, nofollow`.
- `/` permanently redirects to `/fi`. Unbuilt journeys resolve to meaningful `/fi` anchors; pending categories are not links and the closing quote action is disabled because no form destination exists.
- `categories` are all `pendingAssortment`; `products` is empty. Default commerce is `price: "quote"` plus `availability: "unknown"`; published price/availability requires sourced values and timestamps.
- No organization, product, offer, review or rating JSON-LD exists. Do not turn reference-site snapshots, slugs, claims or Lithuanian business facts into live Finnish data.
- Remote image patterns are empty. Visitor media is local and typed with a `rightsId`; `ResponsiveMedia` uses Next.js `preload`, not deprecated `priority`. The brand lockup and transparent favicon remain development placeholders.
- ESLint 9.39.1 is pinned because the Next.js plugin fails under ESLint 10. `npm run build` intentionally uses webpack because Turbopack cannot bind its worker port in this environment.
- `scripts/browser-qa.mjs` needs both the running site and a Chrome DevTools endpoint; it checks four viewports, local links/media, console errors and overflow, then writes screenshots under `/tmp`.

### Autopilot handoff

Continue incrementally from this existing skeleton; do not re-scaffold it. Before code/content/style/config/route/asset changes, read the five mandatory docs above, then inspect the current code and tests. The active catalog/content/forms run is tracked under `.autopilot/2026-09-12-catalog-content-telegram-forms--wip/`; the completed foundation run is archived under `.autopilot/2026-09-11-bambuk-finland-foundation-homepage/`. Working code is authoritative and prior run artifacts are historical. Preserve unrelated working-tree changes and re-run checks proportional to the edited surface.
<!-- autopilot:end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
