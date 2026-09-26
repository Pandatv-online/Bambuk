# Design system: Finnish distributor site

Source date: 2026-09-11  
Status: reference-derived specification; no new visual identity has been invented.

## 1. Design intent

The Finnish site should feel like a member of the same brand ecosystem: warm natural surfaces, condensed editorial typography, restrained green accents, large product/project imagery, and an information-dense catalog. Distributor identity must be clear without visually detaching the site from the manufacturer.

Tokens marked **observed** come from the live stylesheet, HTML, branding extraction, or screenshots. Tokens marked **recommended** normalize layered legacy CSS into a maintainable implementation while preserving its appearance.

## 2. Color tokens

| Token | Value | Evidence / use |
|---|---:|---|
| `brand.green` | `#7AB157` | Observed primary actions and accents |
| `brand.greenLink` | `#79BB59` | Observed links/active navigation; visually near-identical green variant |
| `brand.beige` | `#E5CBA6` | Observed secondary brand tone |
| `surface.page` | `#F3EDE7` | Observed main page background |
| `surface.cream` | `#FAF0E6` | Observed dropdown and warm panel surface |
| `surface.headerInner` | `rgba(216, 198, 171, 0.9)` | Observed inner/scrolled header |
| `surface.headerHero` | `rgba(250, 240, 230, 0.8)` | Observed home header over hero |
| `surface.white` | `#FFFFFF` | Cards, gallery borders, button inverse state |
| `text.strong` | `#000000` / `#1D1D1D` | Observed headings/strong text |
| `text.body` | `#404040` | Observed body copy |
| `text.brown` | `#806545` | Observed navigation and warm accents |
| `text.brownAlt` | `#8B6E45` | Observed secondary brown |
| `border.default` | `#DEDEDE` | Observed UI borders |
| `border.soft` | `#EAEAEA` | Observed separators |
| `border.control` | `#CCCCCC` | Observed form/control borders |

Recommended semantic mapping:

- Primary action: `brand.green` on white text.
- Primary action hover/focus: white background, green text and green border.
- Body surface: `surface.page`; elevated warm panels: `surface.cream` or white.
- Do not introduce a competing saturated accent. Error/success colors may be functional WCAG-compliant tokens, not brand colors.
- Confirm text/background contrast during implementation; light green should not be used for small text on white.

## 3. Typography

### Family

Observed global family: **Open Sans Condensed**, with 300, italic, and 700 weights loaded from Google Fonts. The stylesheet contains older Arial declarations, but a final global override makes Open Sans Condensed the actual site voice. The Finnish implementation self-hosts the original 300 and 700 upright WOFF2 faces for Latin and Latin Extended text. All site text inherits this family, with a generic sans-serif fallback while the local files load.

Recommended implementation:

- Preserve Open Sans Condensed for navigation, headings, labels, and display text.
- Use it for body copy only if Finnish diacritics, long words, readability, and font licensing/loading are verified.
- If a companion body face is necessary for accessibility, use regular Open Sans while retaining Open Sans Condensed for display; this is a controlled readability adaptation, not a rebrand.

### Type scale

| Role | Desktop | Mobile | Weight / treatment | Status |
|---|---:|---:|---|---|
| Display/editorial H1 | 48 px | 34–38 px | 300, uppercase where reference uses it, tracking about `-0.02em` | Observed desktop; mobile recommended |
| Page title H1 | 24 px | 24–28 px | 300/400, frequently uppercase | Observed |
| Content H2 | 24 px | 22 px | 300 | Observed/recommended |
| Compact section heading | 18 px | 18 px | 400/700 contextually | Observed |
| Primary navigation | approximately 17 px / `0.95vw` | 18 px drawer | uppercase, brown | Observed/recommended |
| Dropdown/navigation detail | 13 px | 16 px | regular | Observed/recommended |
| Body | 14 px reference | 16 px minimum | 400, line-height 1.5–1.65 | Observed/recommended accessibility adaptation |
| Meta/caption | 12–13 px | 13–14 px | regular | Recommended from observed small text |

Avoid forcing uppercase on long Finnish paragraphs. Preserve uppercase for short headings, buttons, and top-level navigation only.

## 4. Layout and spacing

- Desktop content maximum: **1200 px observed**. Use a `max-width: 1200px` container with fluid side padding.
- Legacy CSS also references 980 px; treat it as old code, not a new constraint.
- Base spacing unit: **4 px observed**.
- Recommended scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96 px.
- Reference section/layer padding starts around 30 px. Preserve its moderate whitespace but allow 64–96 px around homepage editorial sections on large screens when screenshots show comparable optical space.
- Desktop grids use percentage widths and gutters. Normalize with CSS Grid while matching:
  - Category cards: two columns, approximately 49% each.
- Product cards: three columns, approximately 32% each, on the reference. On 2026-09-24 the user requested denser Finnish catalog rows: four columns from 980 px and five from 1200 px. The Finnish hub uses a filter dialog at desktop widths so the cards retain readable width.
  - Gallery: four columns, approximately 24% each.
  - News/guides: three columns, approximately 31.3% each.

## 5. Shape, borders, and elevation

| Element | Reference treatment |
|---|---|
| Default radius | 5 px |
| Primary button radius | 7 px |
| News/editorial cards | 8 px radius with thick white image/card framing |
| Gallery images | 5 px radius, 10 px white border |
| Controls | 1 px gray border, compact radius |
| Header shadow | `0 0 5px rgba(0,0,0,.2)` |
| Cards | Little or no drop shadow; separation comes from image framing, background, and whitespace |
| Hover | Green color inversion and occasional dotted outline in legacy components |

Use visible keyboard focus rings instead of relying on dotted hover outlines.

## 6. Buttons and links

### Primary button

- Background: `#7AB157`.
- Text: white.
- Border: 1 px solid `#7AB157`.
- Radius: 7 px.
- Padding: approximately 5 px × 20–25 px in the reference; use at least a 44 px touch target in the Finnish implementation.
- Transition: approximately 200 ms.
- Hover/focus: white background, green text, green border.
- No drop shadow.

### Secondary button

Recommended reference-compatible style: transparent/white background, green border and green text; hover to soft cream or green fill. Use for `Tilaa mallipala`, while `Pyydä tarjous` remains primary.

### Text links

Green link color is observed. Underline body-content links by default; navigation links may use color/background changes. All focus states must be visible.

## 7. Images

- Photography is the dominant visual material: bamboo grain, room interiors, terraces, products on neutral backgrounds, and completed projects.
- The Finnish page background uses the reference's pale bamboo image `st_110.jpg` behind translucent section surfaces. The footer uses its bamboo image `st_134.png`, stored locally as an optimized WebP copy to reduce transfer size. Both source URLs are on `www.bambukogrindys.lt/uploads/skin/` and were inspected on 2026-09-24.
- Hero: full-bleed landscape image, approximately 1920-wide source behavior; mobile crop retains the focal product/interior.
- Category card image: about 180 px tall on desktop in the current catalog.
- Product card: about 200 px card height with a roughly 160 px image area in legacy CSS. The Finnish site may use a consistent 4:3 media box to avoid title/image collisions while retaining the compact density.
- Gallery: desktop four-column mosaic, about `32vh` high per tile in the reference; use approved focal points and `object-fit: cover`.
- News/guide photo: about `25vh`, with white framing.
- Product detail: approximately 35% gallery / 65% data on desktop; stacked on mobile. Main image around 300 px in the reference, thumbnails around 85 px.
- All images require meaningful Finnish alt text where informative, explicit decorative alt where not, responsive sizes, modern formats, and documented reuse rights.

## 8. Header, navigation, and footer

- Desktop header height: about 100 px; mobile header: about 60 px.
- Logo reference footprint: approximately 230 × 101 px desktop. The Finnish distributor mark and manufacturer relationship must fit without implying they are the same company.
- The user-directed Finnish mark reads **BAMBU** with a bamboo shoot integrated into the final letter and **LATTIA · TERASSI** beneath it. The dot separates two product areas; it is not a break inside a Finnish compound word. The favicon uses the shoot alone at small sizes. The header omits the operator name beside the mark; the footer and contact page identify Osaühing IKB separately.
- Desktop menu: condensed uppercase brown labels; active/hover item becomes green with white text; cream dropdowns; up to three levels.
- Mobile: fixed header, dim backdrop, near-full-width drawer, search within navigation, settings panel for locale. Replace the reference’s always-expanded deep tree with accessible collapsible groups.
- Footer: visually dense warm/beige area. Use clear columns for products, information, service, company/legal, and contact. Place the Finnish design/development credit at the right edge beneath the columns, with a bold action-green link to `https://verzo.pro/` for legibility over the bamboo background. Do not reproduce stale CMS links.

## 9. Responsive behavior

Observed stylesheet breakpoints:

- Below 1200 px: 60 px mobile header, desktop menu hidden, logo reduced, icon controls shown.
- Below 980 px: 96% content container, catalog sidebars hidden, product/category cards flow to one column in final overrides, gallery becomes two columns, guide/news grid becomes two columns, product gallery/details stack, breadcrumbs hide, hero becomes about 400 px, maps/iframes may hide.
- At or below 440 px: guide/news cards become one column; gallery remains two columns in the later CSS rules.

Recommended normalized breakpoints for Tailwind may use `sm/md/lg/xl`, but visual outcomes above must be matched. Do not copy the reference viewport rule that disables zoom (`user-scalable=no`); it is an accessibility defect.

## 10. Motion and interaction

- Reference motion is restrained: hero slider, hover fades/inversions, dropdowns, gallery lightbox, and short button transitions.
- Respect `prefers-reduced-motion`.
- Keep product image switching and lightbox keyboard-operable.
- Avoid autoplay content that hides critical messaging or creates layout movement.

## 11. Design QA acceptance criteria

- Side-by-side desktop comparison preserves header proportions, warm palette, condensed display typography, catalog density, image-led section rhythm, and green CTA language.
- Side-by-side mobile comparison preserves fixed compact header and drawer behavior while improving nesting/accessibility.
- The header shows the BAMBU mark without the operator name; the site operator is explicit in footer and contact content.
- Product pages retain technical depth and related/sample/install actions.
- No unverified badge, certification, review score, sustainability icon, price, availability, or warranty appears as decoration.
