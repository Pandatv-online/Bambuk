# Interfaces and shared project contract

## Project rules

- Stack: Node 22.22.3 (available locally; `.nvmrc` must select it), Next.js 16.3.4 App Router, strict TypeScript, Tailwind CSS, ESLint, npm lockfile.
- Commands after foundation: `npm install`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and the project test command if introduced.
- Read `AGENTS.md` and all five mandatory `docs/*.md` sources before modifying project files.
- Do not touch `.firecrawl/` evidence, overwrite the existing planning docs, or expose the reference domain to visitors.
- Missing Finnish business/product/service facts remain null/absent, are documented in `docs/implementation-inputs.md`, and must return as `BLOCKED` rather than trigger invention.
- Do not install a missing third-party service or add an account-bound provider. A form destination remains an adapter/stub in its later stage.
- Server Components by default. Client Components only for interaction.

## Boundaries decided in the specification

| Module | Owns | Exposes | Hides |
|---|---|---|---|
| `config` | locale, base URL, feature flags, missing public business inputs | `siteConfig`, `getReleaseReadiness()` | environment fallback and readiness rules |
| `content` | typed navigation, homepage, categories, empty products | `navigation`, `homepageContent`, `categories`, product selectors | source-file organization and validation |
| `ui` | tokens and reusable visual primitives | Button, Container, Section, headings, Notice, CTA | variant class composition |
| `navigation` | desktop/mobile interaction and hierarchy over shared route data | SiteHeader, DesktopNavigation, MobileNavigation, Breadcrumbs | drawer/disclosure/focus state and crumb derivation |
| `catalog-presenters` | category/product/gallery presentation | CategoryCard, ProductCard, ProductGrid, GalleryGrid | responsive media/card details |
| `seo` | page metadata normalization | `createPageMetadata(input)` | URL joining and noindex behavior |
| `homepage-route` | `/fi` composition only | rendered homepage | section assembly and page-specific metadata |

Primary test seams: `getReleaseReadiness()`, shared content registries, and the rendered `/fi` route. Components consume these public boundaries and do not reach into raw files or environment variables.

## Cross-ticket decisions

- Visitor-facing primary CTA: `Pyydä tarjous`.
- Where a future route is not built, current homepage actions target a meaningful `/fi` section anchor; no thin placeholder route is made indexable.
- `ProductCommercialState` supports independently configured `price` (`hidden | quote | published`) and `availability` (`unknown | onRequest | inStock | outOfStock | madeToOrder`). Numeric price/stock values are absent in this increment.
- No Organization, LocalBusiness, Product, Offer, Review, or AggregateRating structured data is emitted without verified source data.
- Local images only. Reference-site URLs may appear in internal provenance documentation, never rendered HTML/network requests.

## From ticket 01 — foundation

- Runtime: Node 22.22.3 via `.nvmrc`; Next.js 16.3.4; npm lockfile.
- Commands: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`; run after `nvm use`.
- `siteConfig: SiteConfig` and `getReleaseReadiness(config?, environment?): ReleaseReadiness` are the only public configuration/readiness seam.
- `createPageMetadata(input: PageMetadataInput, config?: SiteConfig): Metadata` builds canonical and Open Graph metadata without unsupported entity/product data.
- `navigation: readonly NavigationItem[]`, `homepageContent: HomepageContent`, `categories: Category[]`, and `products: readonly Product[]` are the shared content registries.
- `getPublishedProducts(): readonly Product[]` is the catalog selection seam; it currently returns no unverified products.
- `createDefaultCommercialState(): ProductCommercialState` returns quote/unknown defaults; a published price or known availability requires sourced details.
- Missing launch inputs and their release impact are registered in `docs/implementation-inputs.md`.
- ESLint 9.39.1 is intentionally pinned because the Next.js 16.3.4 React plugin crashes under ESLint 10.
- Production build uses webpack in this environment because Turbopack cannot bind its internal worker port.
