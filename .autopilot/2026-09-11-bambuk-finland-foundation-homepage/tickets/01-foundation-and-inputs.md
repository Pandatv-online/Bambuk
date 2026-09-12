# 01 — Runnable foundation and missing-input register

**Requirements:** R01, R02, R03, R04, R05, R06, R07, R08, R09, R10, R21, R22, R23, R24, R25, R28, R34, R35, R36, R43, R44, R45, R46, R47
**Blocked by:** none
**Zone:** project configuration, `app/`, `data/`, `lib/`, `styles/`, `docs/implementation-inputs.md`
**Wave:** 1
**Status:** ready

## What must work

The empty repository becomes a strict, runnable Next.js 16.3.4 project on the locally available Node 22.22.3. `/` redirects to `/fi`; `/fi` renders a minimal foundation surface. Design tokens, typography loading, local image policy, typed site/content/product-commercial boundaries, SEO metadata helper, and production readiness checks exist before page work. Every absent implementation input is documented with an honest placeholder behavior and release impact.

## From the brief, verbatim

> “First, inspect the repository and determine what implementation inputs are still missing.”
>
> “If something is missing, create a clearly marked placeholder and document it in: docs/implementation-inputs.md”
>
> “Set up: Next.js / TypeScript / Tailwind CSS / Finnish /fi route structure / reusable layout / typography / design tokens / responsive breakpoints / image handling / SEO foundation”
>
> “Do not display fake prices. The same applies to stock and availability.”

## Specification sections

Stories 1, 6, 7, 10, 11 and 12; Stack; Route and locale; Data and content boundaries; Placeholder behavior; SEO foundation; Verification; Open items.

## Acceptance criteria

- [ ] Node version is pinned to the available 22.22.3; package scripts include dev, lint, typecheck, build; dependencies lock successfully.
- [ ] Strict TypeScript Next.js App Router + Tailwind builds; `/` redirects to `/fi`; `/fi` renders without console/build errors.
- [ ] Reference design colors, spacing, fonts, radii, container width and responsive breakpoints are represented as maintainable tokens/base styles without copying legacy CSS wholesale.
- [ ] Typed config/content/product contracts keep missing facts null/absent; commercial state makes prices and availability independently configurable and defaults to quote/unknown.
- [ ] SEO helper handles Finnish title/description/path/OG/indexability and configurable site URL without emitting unsupported entity/product data.
- [ ] `docs/implementation-inputs.md` lists every prohibited-to-invent input with status, required owner/source, placeholder behavior and release impact, including image provenance.
- [ ] A production-readiness seam identifies required unresolved inputs; it does not block development build but is testable/documented.
- [ ] Foundation checks pass before ticket 02 starts.

