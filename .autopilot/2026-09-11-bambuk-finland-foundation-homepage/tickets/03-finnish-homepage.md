# 03 — Concise Finnish homepage and visual QA

**Requirements:** R02, R05, R06, R11, R13, R14, R15, R16, R17, R18, R23, R24, R25, R27, R28, R31, R35, R36, R37, R38, R39, R40, R41, R42, R43, R46, R47
**Blocked by:** 02
**Zone:** `/fi` homepage composition/content, local homepage imagery, homepage tests and QA evidence
**Wave:** 3
**Status:** ready

## What must work

The Finnish homepage presents the brand ecosystem, bamboo-flooring range, architecture-level categories, visual references, careful decision topics, featured-product empty state, installation as a first-class service, guidance, and a dominant quotation path. It uses concise natural Finnish and only local authorized imagery. Desktop/mobile hierarchy is compared against the retained screenshot/CSS and corrected where clearly inconsistent.

## From the brief, verbatim

> “The homepage should be concise.”
>
> “Prioritize: Brand / Bamboo flooring / Product categories / Main benefits / Featured products / Installation service / References / CTA”
>
> “Primary CTA: Pyydä tarjous”
>
> “same brand language, simpler Finnish UX.”

## Specification sections

Stories 5–9, 11–12; Homepage content; Images; Responsive and accessibility behavior; SEO foundation; Verification.

## Acceptance criteria

- [ ] `/fi` follows the specified homepage order and uses `Pyydä tarjous` as the primary action with only approved secondary wording.
- [ ] Finnish copy is idiomatic, concise, useful and non-repetitive; the page contains no SEO filler or unsupported durability/environmental/technical/warranty/certification claim.
- [ ] No Finnish legal/company/contact/relationship fact, price, stock, service scope/area/price, delivery/sample/legal policy, Lithuanian business detail, or reference-domain visitor link is invented or leaked.
- [ ] Category/featured/installation pending states are honest and useful; no fake product record is rendered.
- [ ] Local reference-authorized images use consistent responsive proportions, Finnish alt text and documented provenance; visual hierarchy matches the retained brand language.
- [ ] Homepage has one H1, semantic sections, Finnish metadata/canonical/OG foundation, and no unsupported structured data.
- [ ] Phone/tablet/desktop layouts are captured or browser-inspected; header, grids, gallery, CTA, spacing and typography are corrected against reference evidence.
- [ ] Final lint, typecheck and production build pass; link/console/content scans show no current-scope error.

