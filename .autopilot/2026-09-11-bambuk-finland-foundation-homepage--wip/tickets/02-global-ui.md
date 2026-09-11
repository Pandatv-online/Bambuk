# 02 — Reusable global UI and accessible navigation

**Requirements:** R10, R11, R12, R13, R17, R18, R37, R38, R40, R43, R46, R47
**Blocked by:** 01
**Zone:** `components/`, shared layout composition, global component tests
**Wave:** 2
**Status:** ready

## What must work

The site has a reusable warm reference-aligned shell: header, desktop navigation, accessible mobile drawer, footer, Breadcrumbs, buttons, CTA, Container, Section, typography primitives, ProductCard, CategoryCard, and image/gallery components. All navigation consumes one shared registry. Mobile behavior is structurally adapted instead of merely scaled down.

## From the brief, verbatim

> “Implement the reusable global components first: Header / Desktop navigation / Mobile navigation / Footer / Breadcrumbs / Buttons / CTA / Container / Section / Typography primitives / Product cards / Category cards / Image/gallery components”
>
> “The components should be reusable rather than duplicated between pages.”
>
> “Do not simply shrink the desktop layout.”

## Specification sections

Stories 2–4 and 8; Responsive and accessibility behavior; Boundaries and seams; Verification.

## Acceptance criteria

- [ ] Every named global component exists behind a small typed interface; page code does not duplicate its markup/styles.
- [ ] Desktop navigation/header follow the warm, condensed reference hierarchy and expose a clear `Pyydä tarjous` action.
- [ ] Mobile drawer supports nested disclosures, focus trap/return, Escape/backdrop close, scroll lock, accessible names and at least 44 px touch targets.
- [ ] Header/footer/Breadcrumbs share the route registry; no inactive locale, cart, account, currency or external reference-site link appears.
- [ ] ProductCard renders quote-only state without fake product data; CategoryCard and gallery components handle local image/placeholder media accessibly.
- [ ] Component layouts and visible focus states work at phone, tablet and desktop breakpoints and respect reduced motion.
- [ ] Lint/typecheck/build and focused navigation/component tests pass before ticket 03 starts.

