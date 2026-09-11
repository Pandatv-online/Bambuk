# Манифест требований

Источник: `2026-09-11-brief.md`. Строку из этого списка может снять **только пользователь**.

| ID | Из брифа (дословно) | Статус | Основание | Где |
|---|---|---|---|---|
| R01 | «Read ALL of the following files before doing anything» | in-ticket | Preconditions completed and preserved in verification | spec § Verification |
| R02 | «The reference-site materials under .firecrawl/ are also available for visual and structural reference.» | in-ticket | Reference is a required QA input | spec § Images, Verification |
| R03 | «Do not start by generating all pages.» | in-ticket | Only `/fi` plus development-safe CTA destinations may exist | spec § Route and locale |
| R04 | «First, inspect the repository and determine what implementation inputs are still missing.» | in-ticket | Empty application repository confirmed; input register required | spec § Problem, Open items |
| R05 | «The following information must NOT be invented» | placeholder | All listed user/business facts are absent and release-blocking | spec § Placeholder behavior, Open items |
| R06 | «If something is missing, create a clearly marked placeholder and document it in: docs/implementation-inputs.md» | placeholder | Missing-input register is a required build artifact | spec § Story 10, Open items |
| R07 | «Build the website incrementally.» | in-ticket | Current increment ends after homepage | spec § Outside scope |
| R08 | «Next.js / TypeScript / Tailwind CSS» | in-ticket | Required stack | spec § Stack |
| R09 | «Finnish /fi route structure» | in-ticket | Root redirects to Finnish route | spec § Route and locale |
| R10 | «reusable layout / typography / design tokens / responsive breakpoints / image handling / SEO foundation» | in-ticket | Foundation boundaries specified | spec § Stack, Responsive, SEO |
| R11 | «Do not introduce a different visual identity. Follow docs/design-system.md.» | in-ticket | Reference-derived token and QA gate | spec § Story 2, Homepage content |
| R12 | «Implement the reusable global components first» | in-ticket | Shared component boundary defined | spec § Story 3, Boundaries |
| R13 | «The components should be reusable rather than duplicated between pages.» | in-ticket | Component ownership defined | spec § Boundaries |
| R14 | «Implement the Finnish homepage according to: docs/finland-site-architecture.md and docs/content-map.md» | in-ticket | Homepage sequence specified | spec § Homepage content |
| R15 | «The homepage should be concise.» | in-ticket | Ten focused sections with short neutral copy | spec § Homepage content |
| R16 | «Prioritize: Brand / Bamboo flooring / Product categories / Main benefits / Featured products / Installation service / References / CTA» | in-ticket | All required topics mapped | spec § Homepage content |
| R17 | «Primary CTA: Pyydä tarjous» | in-ticket | Primary action in header, hero, installation and closing CTA | spec § Homepage content |
| R18 | «Secondary actions may include: Tutustu tuotteisiin / Pyydä näyte / Asennuspalvelu» | in-ticket | Approved labels only | spec § Story 5, Homepage content |
| R19 | «Implement the catalog architecture.» | deferred | Full catalog is the next dictated stage | spec § Outside scope |
| R20 | «Create a reusable product page template.» | deferred | Follows catalog stage | spec § Outside scope |
| R21 | «Product information must come from structured data. Do NOT hard-code individual product information into JSX.» | in-ticket | Empty typed data boundary established now; full data later | spec § Data boundaries |
| R22 | «Use typed flexible specifications.» | in-ticket | Type contract prepared without product facts | spec § Data boundaries |
| R23 | «Do NOT copy manufacturer prices.» | in-ticket | No price data or rendering in visitor content | spec § Placeholder behavior |
| R24 | «if prices are not yet supplied: hide price; show \"Pyydä tarjous\"; or use a clearly documented placeholder state.» | in-ticket | Quote-only presenter default | spec § Stories 6–7 |
| R25 | «The same applies to stock and availability.» | in-ticket | Availability absent/hidden | spec § Stories 6–7 |
| R26 | «Implement: /fi/asennus» | deferred | Detailed page is its dictated later stage | spec § Outside scope |
| R27 | «Installation is a primary service, not an informational footnote.» | in-ticket | First-class homepage installation section | spec § Homepage content item 8 |
| R28 | «Only use confirmed information. Unknown information should remain a placeholder.» | placeholder | Service/business facts remain null and documented | spec § Placeholder behavior, Open items |
| R29 | «Implement the simplified information architecture from the documentation. Do NOT recreate all 555 reference URLs.» | deferred | Later information stage; no bulk route generation now | spec § Outside scope |
| R30 | «Consolidate repetitive SEO content.» | deferred | Applies when information routes are implemented | spec § Outside scope |
| R31 | «Implement a clean project/gallery section. Prioritize visual presentation over long descriptions.» | deferred | Homepage gallery now; full route later | spec § Outside scope |
| R32 | «Implement: contact page / quotation form / sample request flow where applicable / installation enquiry» | deferred | No endpoint/privacy/business inputs; later form stage | spec § Outside scope |
| R33 | «Forms must be componentized. Do not invent form endpoints.» | deferred | Form layer is not built in current increment | spec § Outside scope |
| R34 | «use a development-safe placeholder and document it» | placeholder | CTA destination cannot submit and is registered | spec § Placeholder behavior, Outside scope |
| R35 | «Implement SEO for actual commercial pages.» | in-ticket | Foundation metadata for actual `/fi`; full stage deferred | spec § SEO foundation |
| R36 | «Do NOT create SEO filler. Do NOT generate hundreds of thin pages.» | in-ticket | Only actual homepage is indexable | spec § Route and locale, SEO foundation |
| R37 | «The site must work properly on: mobile / tablet / desktop» | in-ticket | Responsive acceptance specified | spec § Responsive behavior |
| R38 | «Do not simply shrink the desktop layout.» | in-ticket | Structural mobile navigation/grid changes specified | spec § Responsive behavior |
| R39 | «Use the retained .firecrawl/ screenshots and captures as reference.» | in-ticket | Visual comparison required | spec § Verification |
| R40 | «same brand language, simpler Finnish UX.» | in-ticket | Core design acceptance | spec § Stories 2, 9 |
| R41 | «pixel-perfect reproduction of every legacy behavior.» | in-ticket | Explicitly excluded by the brief’s “Not:” | spec § Solution |
| R42 | «Content QA» | in-ticket | Rendered-content audit required | spec § Homepage content, Verification |
| R43 | «A phase is complete only when» | in-ticket | Acceptance commands and content/design checks | spec § Verification |
| R44 | «Implement in this order» | in-ticket | Current increment honors the first three stages; rest deferred in order | spec § Outside scope |
| R45 | «Do not attempt to implement everything in one huge operation.» | in-ticket | Flight is explicitly bounded | spec § Outside scope |
| R46 | «After completing each major stage, run the appropriate checks and fix problems before moving on.» | in-ticket | Per-ticket checks and final suite required | spec § Verification |
| R47 | «Start with Foundation + Global UI + Homepage.» | in-ticket | Defines entire current build scope | spec § Solution |

## Ticket mapping

- **T01 — Foundation and inputs:** R01, R02, R03, R04, R05, R06, R07, R08, R09, R10, R21, R22, R23, R24, R25, R28, R34, R35, R36, R43, R44, R45, R46, R47.
- **T02 — Global UI:** R10, R11, R12, R13, R17, R18, R37, R38, R40, R43, R46, R47.
- **T03 — Finnish homepage:** R02, R05, R06, R11, R13, R14, R15, R16, R17, R18, R23, R24, R25, R27, R28, R31, R35, R36, R37, R38, R39, R40, R41, R42, R43, R46, R47.

Deferred rows R19, R20, R26, R29, R30, R32, and R33 remain in the later dictated implementation order. R31 is partially delivered as a homepage gallery in T03; the full gallery route remains deferred.
