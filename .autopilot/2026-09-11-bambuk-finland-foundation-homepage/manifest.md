# Манифест требований

Источник: `2026-09-11-brief.md`. Строку из этого списка может снять **только пользователь**.

| ID | Из брифа (дословно) | Статус | Основание | Где |
|---|---|---|---|---|
| R01 | «Read ALL of the following files before doing anything» | done | Preconditions read before implementation | commit dc648c3 |
| R02 | «The reference-site materials under .firecrawl/ are also available for visual and structural reference.» | done | Desktop/mobile hierarchy compared against retained reference evidence | ticket 03 checkpoint |
| R03 | «Do not start by generating all pages.» | done | Only root redirect and `/fi` are generated | commit dc648c3 |
| R04 | «First, inspect the repository and determine what implementation inputs are still missing.» | done | Repository inspected and input register written | commit dc648c3 |
| R05 | «The following information must NOT be invented» | placeholder | All listed user/business facts are absent and release-blocking | spec § Placeholder behavior, Open items |
| R06 | «If something is missing, create a clearly marked placeholder and document it in: docs/implementation-inputs.md» | placeholder | Missing-input register is a required build artifact | spec § Story 10, Open items |
| R07 | «Build the website incrementally.» | done | Foundation, global UI and homepage delivered as three reviewed checkpoints | tickets 01–03 |
| R08 | «Next.js / TypeScript / Tailwind CSS» | done | Strict required stack builds | commit dc648c3 |
| R09 | «Finnish /fi route structure» | done | Root redirects to Finnish route | commit dc648c3 |
| R10 | «reusable layout / typography / design tokens / responsive breakpoints / image handling / SEO foundation» | done | Shared shell, tokens, media and metadata foundations build successfully | tickets 01–03 |
| R11 | «Do not introduce a different visual identity. Follow docs/design-system.md.» | done | Warm reference-aligned hierarchy verified at responsive viewports | ticket 03 checkpoint |
| R12 | «Implement the reusable global components first» | done | Shared global UI, navigation, catalog and media components implemented | commit 8022776 |
| R13 | «The components should be reusable rather than duplicated between pages.» | done | Public component barrels and registry-driven composition verified | commit 8022776 |
| R14 | «Implement the Finnish homepage according to: docs/finland-site-architecture.md and docs/content-map.md» | done | Documented homepage sequence and content rules implemented | ticket 03 checkpoint |
| R15 | «The homepage should be concise.» | done | Focused Finnish section copy passed content review | ticket 03 checkpoint |
| R16 | «Prioritize: Brand / Bamboo flooring / Product categories / Main benefits / Featured products / Installation service / References / CTA» | done | Required homepage topics are represented in the documented order | ticket 03 checkpoint |
| R17 | «Primary CTA: Pyydä tarjous» | done | Primary label is consistent; unavailable submission remains honestly disabled | ticket 03 checkpoint |
| R18 | «Secondary actions may include: Tutustu tuotteisiin / Pyydä näyte / Asennuspalvelu» | done | Only approved secondary action wording remains | ticket 03 checkpoint |
| R19 | «Implement the catalog architecture.» | deferred | Full catalog is the next dictated stage | spec § Outside scope |
| R20 | «Create a reusable product page template.» | deferred | Follows catalog stage | spec § Outside scope |
| R21 | «Product information must come from structured data. Do NOT hard-code individual product information into JSX.» | done | Empty typed data registry and selector established | commit dc648c3 |
| R22 | «Use typed flexible specifications.» | done | Flexible specification and product contracts established | commit dc648c3 |
| R23 | «Do NOT copy manufacturer prices.» | done | No price data copied or rendered | commit dc648c3 |
| R24 | «if prices are not yet supplied: hide price; show \"Pyydä tarjous\"; or use a clearly documented placeholder state.» | done | Commercial state defaults to quote-only | commit dc648c3 |
| R25 | «The same applies to stock and availability.» | done | Availability defaults to unknown and requires source data | commit dc648c3 |
| R26 | «Implement: /fi/asennus» | deferred | Detailed page is its dictated later stage | spec § Outside scope |
| R27 | «Installation is a primary service, not an informational footnote.» | done | Installation has a first-class homepage section without invented scope or pricing | ticket 03 checkpoint |
| R28 | «Only use confirmed information. Unknown information should remain a placeholder.» | placeholder | Service/business facts remain null and documented | spec § Placeholder behavior, Open items |
| R29 | «Implement the simplified information architecture from the documentation. Do NOT recreate all 555 reference URLs.» | deferred | Later information stage; no bulk route generation now | spec § Outside scope |
| R30 | «Consolidate repetitive SEO content.» | deferred | Applies when information routes are implemented | spec § Outside scope |
| R31 | «Implement a clean project/gallery section. Prioritize visual presentation over long descriptions.» | deferred | Homepage gallery now; full route later | spec § Outside scope |
| R32 | «Implement: contact page / quotation form / sample request flow where applicable / installation enquiry» | deferred | No endpoint/privacy/business inputs; later form stage | spec § Outside scope |
| R33 | «Forms must be componentized. Do not invent form endpoints.» | deferred | Form layer is not built in current increment | spec § Outside scope |
| R34 | «use a development-safe placeholder and document it» | placeholder | CTA destination cannot submit and is registered | spec § Placeholder behavior, Outside scope |
| R35 | «Implement SEO for actual commercial pages.» | done | `/fi` has Finnish canonical/OG metadata and readiness-driven noindex | ticket 03 checkpoint |
| R36 | «Do NOT create SEO filler. Do NOT generate hundreds of thin pages.» | done | Only the useful implemented route exists; no thin route generation | ticket 03 checkpoint |
| R37 | «The site must work properly on: mobile / tablet / desktop» | done | Browser QA passed at 390, 768, 1200 and 1440 px | ticket 03 checkpoint |
| R38 | «Do not simply shrink the desktop layout.» | done | Navigation and grids change structure across responsive breakpoints | tickets 02–03 |
| R39 | «Use the retained .firecrawl/ screenshots and captures as reference.» | done | Retained screenshots/CSS informed hierarchy, spacing and imagery QA | ticket 03 checkpoint |
| R40 | «same brand language, simpler Finnish UX.» | done | Warm visual language and simplified quote journey passed review | ticket 03 checkpoint |
| R41 | «pixel-perfect reproduction of every legacy behavior.» | done | Legacy behavior was intentionally not reproduced; documented design boundaries were followed | ticket 03 checkpoint |
| R42 | «Content QA» | done | Claims, Finnish, repetition, links and leaked business details were reviewed and repaired | ticket 03 checkpoint |
| R43 | «A phase is complete only when» | done | Acceptance suite and dual reviews are clean | tickets 01–03 |
| R44 | «Implement in this order» | done | Current increment followed Foundation → Global UI → Homepage | tickets 01–03 |
| R45 | «Do not attempt to implement everything in one huge operation.» | done | Work was split into three reviewed tickets | tickets 01–03 |
| R46 | «After completing each major stage, run the appropriate checks and fix problems before moving on.» | done | Each ticket received tests, build checks and repair review | tickets 01–03 |
| R47 | «Start with Foundation + Global UI + Homepage.» | done | Requested three-stage increment is implemented | tickets 01–03 |

## Ticket mapping

- **T01 — Foundation and inputs:** R01, R02, R03, R04, R05, R06, R07, R08, R09, R10, R21, R22, R23, R24, R25, R28, R34, R35, R36, R43, R44, R45, R46, R47.
- **T02 — Global UI:** R10, R11, R12, R13, R17, R18, R37, R38, R40, R43, R46, R47.
- **T03 — Finnish homepage:** R02, R05, R06, R11, R13, R14, R15, R16, R17, R18, R23, R24, R25, R27, R28, R31, R35, R36, R37, R38, R39, R40, R41, R42, R43, R46, R47.

Deferred rows R19, R20, R26, R29, R30, R32, and R33 remain in the later dictated implementation order. R31 is partially delivered as a homepage gallery in T03; the full gallery route remains deferred.
