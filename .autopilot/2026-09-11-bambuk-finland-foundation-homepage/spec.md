# Спецификация: Bambuk Finland — foundation, global UI, homepage

## Задача

Finnish customers need a trustworthy first experience for bamboo flooring and related categories that belongs to the reference brand ecosystem but clearly functions as a Finnish distributor site. The current repository contains only research documents: no application, verified Finnish company identity, product master, commercial terms, installation scope, or legal content exists.

## Решение

This increment creates a production-shaped Next.js foundation at `/fi`, a reusable responsive global shell, and a concise Finnish homepage. It uses the reference-derived visual tokens and locally stored approved reference imagery, while all missing business facts are centralized as release-blocking inputs. The visible journey leads to `Pyydä tarjous`; no price, stock, warranty, certification, environmental claim, Lithuanian identity, reference-site link, or working submission endpoint is fabricated.

## Пользовательские истории

| # | Метка | История | Приёмка |
|---|---|---|---|
| 1 | R08–R10 | As a developer, I can install and run a strict TypeScript Next.js App Router project with Tailwind | documented commands succeed; `/` redirects to `/fi`; `/fi` renders |
| 2 | R10–R11 | As a visitor, I see the warm beige/cream, condensed-type, green-action visual language of the reference | tokens match `docs/design-system.md`; no competing visual identity |
| 3 | R12–R13 | As a developer, I can compose pages from shared layout, navigation, breadcrumb, card, gallery, CTA, and typography components | homepage contains no duplicated component implementations; Breadcrumbs consumes the shared route model |
| 4 | R12.1 | As a keyboard user, I can reach and operate desktop and mobile navigation with visible focus | semantic buttons/links, Escape close, focus management and labelled controls work |
| 5 | R14–R18 | As a Finnish visitor, I understand the product families, installation offering, references, and next action from a concise homepage | section order follows architecture; `Pyydä tarjous` is primary; supported secondary CTA wording is used |
| 6 | R15.1 | As a visitor with little content/data available, I see honest empty/pending states rather than fake product or business facts | featured product area explains assortment data is pending and presents quote action; no fake cards/specs |
| 7 | R23–R25 | As a prospect, I am never shown manufacturer prices or guessed stock | price/availability components default to hidden/quote and no numeric values appear |
| 8 | R37–R40 | As a mobile, tablet, or desktop visitor, I receive a layout designed for my viewport | drawer/header/grids/gallery/CTA adapt structurally at defined breakpoints; no zoom restriction |
| 9 | R39–R40 | As the project owner, I can compare the build to retained visual evidence | visual QA uses the full-page screenshot and live CSS tokens; differences are documented |
| 10 | R05–R06 | As the project owner, I can see every missing launch input in one place | `docs/implementation-inputs.md` lists owner, status, placeholder behavior, release impact |
| 11 | R09–R10, R35 | As a search engine, I receive correct Finnish foundation metadata | canonical and OG use configurable site URL; root redirect and semantic headings work; no unsupported structured data |
| 12 | R43–R46 | As the project owner, I receive a verified increment rather than an unchecked scaffold | typecheck/lint/build and focused UI checks pass; no console/build errors found |

## Реализационные решения

### Stack

- Use the current stable Next.js App Router with React, strict TypeScript, Tailwind CSS, ESLint, and the project package manager lockfile. This is the required stack and keeps styling/data boundaries explicit.
- Use Server Components by default. The mobile navigation is a small Client Component because it owns interaction and focus behavior.
- Use Next.js built-in font/image/metadata APIs. Font files are loaded through the framework; image sources are local so the visitor never requests the reference domain.

### Route and locale

- `/` performs a permanent framework redirect to `/fi`.
- `/fi` is the only published locale in this increment. Do not render inactive EN/SV switches.
- Navigation labels represent the approved future information architecture, but this increment does not generate those pages. Homepage actions that would otherwise be broken point to meaningful on-page sections; no placeholder route is made indexable. Do not generate the complete later sitemap.

### Data and content boundaries

- `siteConfig` owns non-secret public project configuration and explicitly typed missing company/manufacturer/contact fields.
- `navigation` owns the shared route tree used by header and footer.
- `homepage` owns localized section headings, short neutral copy, category presentation order, image relations, and CTA destinations.
- `categories` contains category placeholders only, marked `status: pendingAssortment`; category presence is architecture, not a claim that it is sold in Finland.
- `products` stays empty in this increment. `ProductCard` accepts a typed product view model but no fake product records are created.
- `ProductCommercialState` is independently configurable per product with `price: hidden | quote | published` and `availability: unknown | onRequest | inStock | outOfStock | madeToOrder`; published values require explicit amount/currency/basis or source/update data. The presenter never derives one from manufacturer content.
- Images selected from the authorized reference material are downloaded/copied locally with a source-rights note in `docs/implementation-inputs.md`. If a suitable asset cannot be resolved confidently, use a CSS/material placeholder rather than an invented image.

### Placeholder behavior

- Missing business fields are `null`, never plausible filler strings in application data.
- UI does not print bracket placeholders as if they were customer content. Where the shell requires identity/contact context, it displays a clearly marked development notice such as `Yritystiedot täydennetään ennen julkaisua`.
- A release-readiness guard/test fails for production when required company, relationship, contact, domain, or legal inputs remain missing.
- Forms are not submitted in this increment. CTA destinations use a development-safe quotation shell or on-page CTA with the missing endpoint documented.

### Homepage content

The implementation follows this concise order:

1. Fixed warm translucent header with neutral project wordmark and prominent `Pyydä tarjous`.
2. Full-bleed hero: `Bambulattiat ja bambuterassit Suomeen`, `Tutustu tuotteisiin`, `Pyydä tarjous`; no manufacturer relationship claim is rendered until approved.
3. Short “Bambulattiat” introduction using only neutral taxonomy language, not performance/environmental claims.
4. Architecture-derived category card grid; cards are visibly marked as assortment-pending where necessary.
5. Reference-style visual gallery section using approved local imagery.
6. “Miksi bambu?” section limited to decision topics (appearance, product-specific technical data, installation planning) without unsupported benefit claims.
7. Featured-products empty state because no Finnish assortment is confirmed; reusable ProductCard is demonstrated in tests/story fixture only, not visitor content.
8. Installation service section describing only that a service is planned/offered per brief, while scope, preparation, included work, price, and area are explicitly pending; links to quote.
9. Guidance cards for product choice, technical data, installation/maintenance, with later routes not expanded into SEO pages now.
10. Final quote CTA and footer with release-blocking company/contact notices.

All Finnish wording uses the exact labels in `docs/content-map.md` where that document defines them. Other copy must be short, idiomatic Finnish and factual; implementation QA checks naturalness, usefulness, repetition, and SEO padding explicitly.

### Responsive and accessibility behavior

- Desktop header approximates the reference 100 px proportions; mobile uses a compact 60 px header.
- At large desktop, categories use two columns, gallery four, guides three. Tablet reduces gallery/guides and navigation; phone uses one-column content where readability requires it and two-column gallery where reference treatment remains usable.
- Mobile navigation is a modal drawer with backdrop, body scroll lock, focus trap/return, Escape close, nested disclosure buttons, and a visible quote action.
- Breadcrumbs is a reusable semantic `nav` with an ordered list generated from the shared route model; it is available to later inner pages and hidden on the homepage where it would add no orientation value.
- Touch targets are at least 44 px, zoom remains enabled, decorative images use empty alt, meaningful images use Finnish alt, motion honors reduced-motion preferences.

### SEO foundation

- Central metadata builder receives title, description, path, image, and indexability.
- `metadataBase` uses `NEXT_PUBLIC_SITE_URL` only when configured; development uses a documented localhost fallback and production readiness fails if absent.
- Homepage has unique Finnish metadata, canonical `/fi`, Open Graph locale `fi_FI`, one H1 and semantic sections.
- No Organization/LocalBusiness or Product structured data is emitted because verified legal/product facts are absent.
- Later sitemap/robots requirements remain deferred to their dictated SEO stage; no thin placeholder pages enter sitemap.

### Verification

- The recorded precondition is reading `AGENTS.md`, `docs/reference-site-audit.md`, `docs/finland-site-architecture.md`, `docs/design-system.md`, `docs/component-inventory.md`, and `docs/content-map.md` in full before repository/content/code changes; the implementation instructions passed this gate.
- `npm run lint`, `npm run typecheck`, and `npm run build` are required.
- Add focused tests for configuration/release guard, navigation integrity, and render states where the chosen test stack supports them without disproportionate setup.
- Run the site and capture desktop/mobile screenshots for side-by-side inspection against `.firecrawl/home-full-page.png`; fix clear hierarchy, spacing, crop, grid, and navigation mismatches.
- Search visitor-rendered output/source for Lithuanian company details, reference-domain links, numeric prices, unsupported claims, and bracket placeholders.
- After Foundation: run dependency install, lint/typecheck, root redirect, `/fi` render, token/font/image and metadata checks; fix before Global UI.
- After Global UI: verify shared component imports, keyboard desktop/mobile navigation, focus/escape behavior, breadcrumbs, responsive primitives and footer/header states; fix before Homepage.
- After Homepage: run lint/typecheck/build, desktop/mobile render capture, link/heading/accessibility smoke checks and the complete content audit; fix all current-scope failures.
- Content audit asks explicitly: Is the Finnish idiomatic? Is each section useful? Is anything repeated? Is there SEO filler? Is every claim sourced or omitted? Are manufacturer/distributor roles separate? Are Lithuanian business details/prices absent? Is `Pyydä tarjous` obvious?

## Границы и швы

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `config` | locale, base URL, feature flags, missing public business inputs | `siteConfig`, `getReleaseReadiness()` | environment fallback and readiness rules |
| `content` | typed navigation, homepage, categories, empty products | `navigation`, `homepageContent`, `categories`, product selectors | source-file organization and validation |
| `ui` | tokens and reusable visual primitives | Button, Container, Section, headings, Notice, CTA | variant class composition |
| `navigation` | desktop/mobile interaction and hierarchy over shared route data | SiteHeader, DesktopNavigation, MobileNavigation, Breadcrumbs | drawer/disclosure/focus state and crumb derivation |
| `catalog-presenters` | category/product/gallery presentation | CategoryCard, ProductCard, ProductGrid, GalleryGrid | responsive media/card details |
| `seo` | page metadata normalization | `createPageMetadata(input)` | URL joining and noindex behavior |
| `homepage-route` | `/fi` composition only | rendered homepage | section assembly and page-specific metadata |

Primary test seams: `getReleaseReadiness()`, shared content registries, and the rendered `/fi` route. Components consume these public boundaries and do not reach into raw files or environment variables.

## Вне рамок

| Требование | Почему не сейчас |
|---|---|
| R19, R21–R22 — full catalog/data/filter/pagination implementation | Explicit development order says start with Foundation + Global UI + Homepage; only schemas/presenters needed by the homepage are established |
| R20 — product detail route/template | Next dictated stage after catalog |
| R26–R28 — complete `/fi/asennus` page | Installation receives a homepage first-class section now; detailed route waits for confirmed service inputs and its stage |
| R29–R30 — consolidated product-information pages | Later dictated stage; navigation/content entry points only now |
| R31 — complete references/gallery route | Homepage gallery is included; full section is later |
| R32–R34 — operational contact/quote/sample/install forms | No endpoint, privacy copy, company data, or sample policy exists; destination adapter/forms are later |
| R35–R36 — full commercial-page SEO, sitemap, robots and product data | Foundation metadata only; actual pages/data must exist first |
| R44 — stages after Homepage | Preserved in manifest for future increments in the exact dictated order |

## Открытые места

`docs/implementation-inputs.md` must record at minimum: Finnish company/display/legal details; business/VAT IDs; address/phone/email/hours; approved manufacturer/brand relationship wording and logo rules; final domain; confirmed assortment and product master; product descriptions/specifications/documents/images; prices/VAT/availability/lead times; installation provider/scope/methods/inclusions/exclusions/preparation/area/pricing; delivery/returns; sample policy; warranty/certification/environmental claims and source records; privacy/cookies/legal text; form provider/destination/response process; image rights/credits; analytics/consent choices; launch language decision.

Each item has a status, current UI behavior, owner/source needed, and release impact. Missing values remain `null` in configuration or absent from content datasets.

## Покрытие манифеста

| Требование | Раздел спецификации |
|---|---|
| R01 | Preconditions completed before this spec; Verification |
| R02 | Images; Verification |
| R03 | Route and locale; Outside scope |
| R04 | Problem; Open items |
| R05 | Placeholder behavior; Open items |
| R06 | Story 10; Open items |
| R07 | Outside scope; delivery increments |
| R08 | Stack; Story 1 |
| R09 | Route and locale; Story 1 |
| R10 | Stack, responsive, SEO; Stories 1–2, 8, 11 |
| R11 | Story 2; Homepage content |
| R12 | Story 3; Boundaries |
| R13 | Story 3; Boundaries |
| R14 | Homepage content; Story 5 |
| R15 | Homepage content; Story 5 |
| R16 | Homepage content |
| R17 | Homepage content; Story 5 |
| R18 | Homepage content; Story 5 |
| R19 | Outside scope; catalog-presenter boundary |
| R20 | Outside scope |
| R21 | Data boundaries; Outside scope |
| R22 | Data boundaries; Outside scope |
| R23 | Stories 6–7; Placeholder behavior |
| R24 | Story 7; Placeholder behavior |
| R25 | Story 7; Placeholder behavior |
| R26 | Homepage installation section; Outside scope |
| R27 | Homepage content item 8 |
| R28 | Placeholder behavior; Open items |
| R29 | Homepage guide entry points; Outside scope |
| R30 | Outside scope |
| R31 | Homepage gallery; Outside scope |
| R32 | Homepage CTA shell; Outside scope |
| R33 | Outside scope |
| R34 | Placeholder behavior; Outside scope |
| R35 | SEO foundation; Outside scope |
| R36 | Route/SEO decisions; Outside scope |
| R37 | Responsive behavior; Story 8 |
| R38 | Responsive behavior; Story 8 |
| R39 | Verification; Story 9 |
| R40 | Story 2; Story 9 |
| R41 | Explicitly excluded from visual objective |
| R42 | Homepage content; Verification |
| R43 | Verification; acceptance gate |
| R44 | Outside scope; current dictated order |
| R45 | Increment boundary; Outside scope |
| R46 | Verification |
| R47 | Entire current specification scope |
