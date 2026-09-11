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
## Current Autopilot run

The current increment builds the Next.js foundation, reusable global UI, and Finnish homepage. Requirements, specification, and work tracking live in `.autopilot/`; progress is shown in `.autopilot/dashboard.html`.

## Verified commands

Run `nvm use` first; this project pins Node 22.22.3 in `.nvmrc`.

- `npm install` — install the locked dependencies.
- `npm run dev` — start local development.
- `npm test` — run Vitest.
- `npm run typecheck` — run strict TypeScript checks.
- `npm run lint` — run ESLint.
- `npm run build` — create the production build.

ESLint 9.39.1 is intentionally pinned because the Next.js 16.3.4 React plugin crashes under ESLint 10. The production script uses supported webpack mode because Turbopack cannot bind its worker port in this environment.

If work is interrupted, resume from `.autopilot/state.js` and the active run directory rather than restarting or re-asking resolved questions.
<!-- autopilot:end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
