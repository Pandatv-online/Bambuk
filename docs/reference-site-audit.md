# Reference-site audit: bambukogrindys.lt

Audit date: 2026-09-11  
Reference: <https://www.bambukogrindys.lt/>  
Scope: the public Lithuanian, English, and Russian site, with the Lithuanian branch used as the canonical content sample.

## Audit method and evidence

This audit is based on a crawl/map of the live site, targeted captures of every major page type and category, representative product pages, raw HTML and CSS inspection, a full-page desktop screenshot, and a live 390 × 844 mobile-browser inspection. The crawl found 555 unique public URLs: 184 LT routes (130 products, 23 categories, 31 other), 185 EN routes (130 products, 21 categories, 34 other), 184 RU routes (130 products, 22 categories, 32 other), and two root-level routes.

The source evidence is retained in `.firecrawl/`:

- `urls-full.json`: complete discovered URL inventory.
- `home-full-page.png`: full-page desktop reference capture.
- `home-branding-images.json`: extracted brand tokens and image inventory.
- `main.css`: live stylesheet captured during the audit.
- `bambukogrindys.lt-*.md`: cleaned captures of major categories, information pages, forms, and representative products.
- `home-raw.html` and `contact-raw.html`: form, metadata, header, footer, and navigation evidence.

“Observed” below means verified in live markup, CSS, a capture, or a browser session. “Inferred” means an implementation recommendation derived from that evidence. Product prices, stock, lead times, claims, and specifications are snapshots only and must not be republished without current manufacturer approval.

## 1. Sitemap

### 1.1 Route and language model

The reference site uses parallel locale prefixes:

- `/lt/...` — Lithuanian
- `/en/...` — English
- `/ru/...` — Russian

The same catalog is largely replicated across all three branches: 130 product URLs were discovered per locale. Product and category paths contain a numeric ID and a localized slug. The root routes to the principal site experience. There are also unlinked or semi-linked utility routes for search, cart, sign-in, registration, password recovery, and privacy.

### 1.2 Primary pages and information architecture

| Reference URL | Page type | Parent | Purpose / important components | Finnish site? |
|---|---|---|---|---|
| `/lt` | Home | Root | Fixed header, image hero/slider, brand introduction, seven catalog category cards, project gallery, benefits, special-offer products, news, footer | Yes; same hierarchy, Finland-specific copy and CTAs |
| `/lt/apie-mus` | About | Root | Lithuanian company story, mission, vision, business claims | Yes, but completely rewritten for the Finnish distributor and transparent manufacturer relationship |
| `/lt/katalogas` | Catalog hub | Root | Category tree, catalog sidebar, recommended product, search/filter taxonomy | Yes |
| `/lt/galerija` | Gallery | Root | Interior/product project images and lightbox presentation | Yes, using approved assets and Finland projects when available |
| `/lt/aktualijos` | News index | Root | Three-column editorial/news cards | Optional at launch; use only with an editorial owner |
| `/lt/aktualijos/i/[id]/[slug]` | Article | News | Image, title, date/body, related navigation | Optional; migrate only useful, approved content |
| `/lt/kontaktai` | Contact | Root | Lithuanian offices, company IDs, map/contact form | Yes, with Finnish details only |
| `/lt/search/?search_query=…` | Search results | Utility | GET search, grouped results for catalog and information content | Yes |
| `/lt/katalogas/cart/` | Cart | Commerce | Basket and a three-step order/delivery/payment flow | No at initial launch; quote-first journey replaces it |
| `/lt/elogin/` | Account login | Utility | Customer sign-in | No at initial launch |
| `/lt/eregister/` | Account registration | Utility | Private/business account, company and delivery fields, CAPTCHA, terms | No at initial launch |
| `/lt/epriminti/` | Password recovery | Utility | Account recovery | No at initial launch |
| `/lt/privacy-policy/` | Legal | Root | Privacy information | Yes, but Finnish legal copy must be supplied/reviewed |

### 1.3 Catalog taxonomy

The live catalog is a multi-level tree. Parent hubs show child category cards; leaf categories show products. “Special offers” is an overlay/merchandising view rather than a durable product parent.

| Reference URL | Page type | Parent category | Purpose / important components | Finnish site? |
|---|---|---|---|---|
| `/lt/katalogas/category/2/vidaus-grindys` | Parent category | Catalog | Interior flooring collection cards | Yes |
| `/lt/katalogas/category/55/bambuko-grindu-kolekcija-klasika` | Product collection | Interior floors | “Classic” product grid | Yes |
| `/lt/katalogas/category/38/grindu-kolekcija-spalvu-harmonija` | Product collection | Interior floors | “Color Harmony” product grid | Yes |
| `/lt/katalogas/category/40/bambuko-grindu-kolekcija-antika` | Product collection | Interior floors | “Antique” product grid | Yes |
| `/lt/katalogas/category/41/bambuko-grindu-kolekcija-bambukas` | Product collection | Interior floors | “Bamboo” product grid | Yes |
| `/lt/katalogas/category/39/grindu-kolekcija-paliesta-gamtos` | Product collection | Interior floors | “Touched by Nature” product grid | Yes |
| `/lt/katalogas/category/65/bambuko-grindu-kolekcija-eglute` | Product collection | Interior floors | Herringbone product grid | Yes |
| `/lt/katalogas/category/21/lauko-gaminiai` | Parent category | Catalog | Outdoor-product category cards | Yes |
| `/lt/katalogas/category/32/bambuko-terasos-grindys` | Product category | Outdoor | Bamboo decking boards | Yes |
| `/lt/katalogas/category/61/bambuko-dailylentes-pakalimai` | Product category | Outdoor | Exterior cladding / soffit boards | Yes |
| `/lt/katalogas/category/34/terasos-montavimo-reikmenys` | Product category | Outdoor | Clips and installation accessories | Yes |
| `/lt/katalogas/category/36/terasos-prieziuros-priemones` | Product category | Outdoor | Terrace maintenance products | Yes |
| `/lt/katalogas/category/5/grindjuostes-ir-laiptu-briaunos` | Product category | Catalog | Skirting boards and stair nosings | Yes |
| `/lt/katalogas/category/44/laiptai` | Product category | Catalog | Stair elements | Yes if current Finnish assortment is confirmed |
| `/lt/katalogas/category/3/bambuko-plokstes` | Parent category | Catalog | Bamboo panel category cards | Yes |
| `/lt/katalogas/category/43/bambuko-baldines-plokstes` | Product category | Bamboo panels | Furniture panels | Yes |
| `/lt/katalogas/category/7/bambuko-dekoras` | Parent category | Catalog | Decorative bamboo category cards | Yes |
| `/lt/katalogas/category/47/bambuko-skersiniai` | Product category | Bamboo décor | Bamboo slats/poles | Yes if supplied in Finland |
| `/lt/katalogas/category/59/bambuko-sieneles` | Product category | Bamboo décor | Decorative bamboo screens | Yes if supplied in Finland |
| `/lt/katalogas/category/48/bambuko-tapetai` | Product category | Bamboo décor | Bamboo wallpaper | Yes if supplied in Finland |
| `/lt/katalogas/category/6/grindu-klojimo-priemones` | Product category | Catalog | Flooring primers, adhesives, installation products | Yes |
| `/lt/katalogas/category/26/grindu-prieziuros-priemones` | Product category | Catalog | Floor cleaning and maintenance | Yes |
| `/lt/katalogas/category/58/specialus-pasiulymai` | Merchandising collection | Catalog | Sale/special-offer subset | Optional; only when real Finnish offers exist |

The catalog also exposes alternate taxonomy pages (`/lt/katalogas/line/2`, `/line/4`, `/line/5`, `/trademark/7`, `/trademark/12`) and brand/line filters in the sidebar. Observed names include Bambuko Grindys, DZIURSKIP, CHIMIVER, Dasso, WAKOL, WOCA, Holse & Wibroe, and FAXE. These are useful facets, not primary navigation. Include only brands actually distributed in Finland.

The footer contains legacy category routes and labels not aligned with the current primary tree, including earlier bamboo/oak, outdoor-cladding, bamboo-stem, stair, and placeholder links. They should not be copied. The Finnish taxonomy must be generated from one controlled category dataset so navigation, filters, breadcrumbs, and footer cannot drift apart.

### 1.4 Product pages

All discovered catalog products use the template `/[locale]/katalogas/product/[numeric-id]/[localized-slug]`. There are 130 Lithuanian product URLs and matching EN/RU sets. The audit inspected representative products from every major type:

| Reference example | Product type | Important page-specific content |
|---|---|---|
| `/lt/katalogas/product/53/naturalios-bambuko-masyvo-grindys-karbonizuota-spalva-uv-treffert-lakas` | Interior floor | Image gallery, SKU, dimensions, pack, stock, price basis, area/package calculator, sample request, technical table, related items |
| `/lt/katalogas/product/443/bambuko-terasines-grindys-dassoxtr-r137-espresso-spalva` | Decking | Profile/coating/color/dimensions/laying method, price basis, stock/lead time |
| `/lt/katalogas/product/145/bambuko-masyvo-grindjuoste-karbonizuota-spalva-uv-treffert-lakas-13-00-vnt-1830-mm-80-mm-14-mm` | Skirting | Per-piece pricing, finish, dimensions, installation method |
| `/lt/katalogas/product/160/bambuko-masyvo-laiptu-briauna-naturali-spalva-uv-treffert-lakas-28-00-vnt-1820-mm-110-mm-1424-mm` | Stair nose | Per-piece pricing, surface/coating, dimensions |
| `/lt/katalogas/product/682/vertikalaus-soninio-presavimo-bambuko-plokste-3-sluoksniai-naturali-spalva` | Panel | Construction, surface readiness, dimensions, per-piece price |
| `/lt/katalogas/product/180/moso-bambuko-skersiniai-naturali-spalva-o-50-x-2800-mm` | Decorative slat | Size, finish, unit price, installation/use text |
| `/lt/katalogas/product/322/moso-bambuku-sienele-juodinta-spalva` | Screen | Gallery, dimensions, installation/use text |
| `/lt/katalogas/product/325/bambuko-tapetai-deginta-zalsva-spalva` | Wallpaper | Color, dimensions, per-metre pricing, installation text |
| `/lt/katalogas/product/187/adesiver-2k-premium-epoksidiniai-poliuretaniniai-klijai-grindims-12-5-kg` | Adhesive | Pack/weight, application and technical information |
| `/lt/katalogas/product/260/universalus-lakuotu-mediniu-grindu-ploviklis` | Floor care | Pack size, application, related products |
| `/lt/katalogas/product/536/woca-terasos-alyva-bespalve-2-5l-70-00-pak` | Terrace care | Volume, color, application, unit price |
| `/lt/katalogas/product/200/terasos-tvirtinimo-elementas-pradzios-pabaigos-elementas` | Installation accessory | Compatible use, quantity/unit presentation |
| `/lt/katalogas/product/272/naturalios-bambuko-masyvo-grindys-naturali-spalva-uv-treffert-lakas-nemokamas-pavyzdys` | Sample | Sample-specific product relation and zero-price commerce behavior |

The remaining product URLs are variations within these templates. The exact 555-URL map is retained in `.firecrawl/urls-full.json`, rather than copying three duplicate locale inventories into this document. The Finnish build must import only the manufacturer-confirmed Finnish assortment; URL discovery is not evidence that a product is still sold.

### 1.5 Product-information pages

| Reference URL | Page type | Parent | Purpose | Finnish site? |
|---|---|---|---|---|
| `/lt/bambuko-grindu-ir-terasu-privalumai` | Technical/benefits | About products | Benefits and performance/environmental claims | Yes after claim-by-claim verification |
| `/lt/bambuko-grindu-gamybos-procesas` | Education | About products | Manufacturing process | Yes, manufacturer-sourced |
| `/lt/grindu-siluminis-laidumas` | Technical | About products | Thermal conductivity | Yes after document/SKU verification |
| `/lt/janka-kietumo-skale` | Technical | About products | Janka comparison | Yes with source and scope |
| `/lt/bambuko-masyvo-grindu-spalvos` | Product education | About products | Available colors | Yes, generated from active assortment |
| `/lt/bambuko-grindu-rastai-ir-struktura` | Product education | About products | Grain patterns and construction | Yes |
| `/lt/bambuko-grindu-lentu-briaunos` | Product education | About products | Edge profiles | Yes |
| `/lt/konstrukcija` | Technical | About products | Product construction | Yes |
| `/lt/grindu-risikliai-ir-klijai` | Technical | About products | Binders and adhesives | Yes after manufacturer review |
| `/lt/apdailos-medziagos-ir-lakas` | Technical | About products | Finishes and lacquer | Yes after product-level review |
| `/lt/grindu-dangos-klojimo-budai` | Installation education | About products | Laying methods | Yes; connect to professional service |
| `/lt/bambuko-grindys-spaudoje-2` | Press | About products | Press excerpts/mentions | Optional; only with usage rights and relevance |
| `/lt/duk` | FAQ | About products | Fourteen question/answer topics | Yes as reviewed accordion content |

### 1.6 Additional information and service content

| Reference URL | Page type | Parent | Purpose | Finnish site? |
|---|---|---|---|---|
| `/lt/sildomos-grindys` | Technical guide | Additional information | Suitability and constraints for underfloor heating | Yes, but only verified product/method statements |
| `/lt/grindu-klojimo--prieziuros-instrukcija` | Installation/maintenance guide | Additional information | Detailed installation and care rules | Yes after reconciliation and Finnish technical review |
| `/lt/grindu-kliju-naudojimo-instrukcija` | Product instruction | Additional information | Adhesive instructions | Yes, linked to exact supported products |
| `/lt/grunto-naudojimo-instrukcija` | Product instruction | Additional information | Primer instructions | Yes, linked to exact supported products |
| `/lt/aktualijos/i/17/vidaus-grindu-ir-lauko-terasos-montavimo-paslaugos/` | Service article | News | Interior floor and outdoor terrace installation service | Replace with a first-class Finnish installation page; do not reuse Lithuanian pricing |

The detailed instructions contain at least one item requiring manufacturer reconciliation: temperature limits differ between the FAQ/instruction material (26 °C versus 27 °C in different contexts). No number should be published in Finnish until its exact product, construction, and source document are confirmed.

### 1.7 Current homepage-linked editorial articles

The live homepage exposes article-template routes including terrace ideas, choosing decking, terrace preparation, terrace cost factors, a “Northern Panda” feature, wall finishing, installation services, and a publicity notice (article IDs 40, 39, 38, 37, 31, 36, 17, and 35). The map and homepage are not perfectly synchronized, which indicates an actively edited or legacy CMS. The Finnish launch should not depend on a news section; useful evergreen topics should become reviewed guides.

## 2. Navigation analysis

### Header

Observed desktop header:

- Fixed, translucent beige header over the homepage hero; a denser beige state is used on inner/scrolled pages.
- Left-aligned brand mark.
- Primary navigation across the header.
- LT/EN/RU language controls.
- Account icon/link.
- EUR/USD/RUB/GBP currency selector.
- Cart icon with quantity.
- Search field with autocomplete behavior.

### Main navigation and dropdowns

Observed hierarchy:

1. About us
2. Catalog
   - Interior floors
     - Classic
     - Color Harmony
     - Antique
     - Bamboo
     - Touched by Nature
     - Herringbone
   - Outdoor products
     - Bamboo decking
     - Bamboo cladding / soffits
     - Terrace installation accessories
     - Terrace maintenance products
   - Skirting boards and stair nosings
   - Bamboo panels → furniture panels
   - Bamboo décor → slats, screens, wallpaper
   - Flooring installation products
   - Flooring maintenance products
3. About products
   - Benefits
   - Manufacturing process
   - Thermal conductivity
   - Janka hardness
   - Colors
   - Patterns and structure
   - Edges
   - Construction
   - Binders and adhesives
   - Finishes and lacquer
   - Laying methods
   - Press
   - FAQ
4. Floors in stock
5. Gallery
6. Additional information
   - Heated floors
   - Flooring installation/maintenance instructions
   - Adhesive instructions
   - Primer instructions
7. Contacts

Desktop dropdowns support three levels and use hover/focus-like flyouts. The catalog page adds secondary sidebar navigation for category, product line, trademark, and a recommended product.

### Footer navigation

The footer repeats primary informational and catalog links, includes a newsletter email form, Instagram and Facebook links, an award/environmental image, copyright, and developer credit. Its taxonomy includes stale/legacy items. The Finnish footer should be data-driven from the approved route registry and include distributor identity, manufacturer relationship, contact, service area, legal links, and newsletter only if consent/compliance is implemented.

### Mobile navigation

At 390 × 844 the desktop navigation is replaced by three compact controls: cart, settings/language, and hamburger. The menu opens as an almost full-width drawer over a dimmed backdrop; its hierarchy is displayed expanded with indentation. Search is inside the drawer. Language, currency, and account controls are in a separate settings panel. The header stays fixed.

For Finland, preserve the familiar drawer and hierarchy but make “Pyydä tarjous” permanently visible or easily reachable. Remove currency/account/cart controls unless their functions are implemented. Nested sections should be collapsible with accessible buttons to reduce the very long mobile menu.

## 3. Page anatomy and behavior

### Homepage, observed order

1. Fixed header.
2. Full-bleed photographic hero/slider.
3. “About bamboo flooring” introduction.
4. “E-catalog” with seven large category cards in a staggered desktop grid.
5. “Bamboo flooring in interiors” eight-image gallery mosaic.
6. “Advantages of pressed bamboo flooring” information section.
7. “Special offers” four-product row.
8. “News” three-column card grid.
9. Dense footer and cookie notice.

The Finnish homepage should keep this rhythm. “Special offers” becomes “Suositut tuotteet” or “Ajankohtaiset tuotteet” unless confirmed offers exist. “News” may become installation/technical guidance cards so the section has a maintained purpose.

### Category and catalog pages

- Breadcrumb/title region.
- Desktop left sidebar with category/line/trademark facets and recommendation.
- Parent categories: large image cards for child categories.
- Leaf categories: three-column product cards with product image, title, price/status where available, and hover treatment.
- Content area becomes full width on small screens; sidebars disappear.

### Product page

- Breadcrumbs and catalog context.
- Main image plus thumbnail gallery/lightbox.
- Product name and SKU.
- Common facts: weight, stock, category, pricing basis, lead time, color, length, width, thickness, and package data when applicable.
- Flooring calculator: requested square metres, stock, package count/coverage, package/total price, displayed unit price, and a 3% waste option.
- Sample request link.
- Product inquiry modal with product, quantity, name, email, telephone, and question.
- Tabbed description/stock area; the reference has duplicate “Description” labels, a defect not to reproduce.
- Category-specific technical table and long-form description.
- Previous/next and related products, including matching samples/accessories.
- Mobile fixed bottom add-to-cart control.

The Finnish product template should retain the depth of information but prioritize `Pyydä tarjous`, `Tilaa mallipala`, and `Kysy asennuksesta`. Price, stock, calculator, and online purchase are optional data-driven capabilities, never hard-coded assumptions.

### Search

The search form uses GET with `search_query` and autocomplete. Results are grouped across catalog, “About products,” and additional information, with numbered result, title, and excerpt. The Finnish search index must cover products, collections, technical guides, FAQ, gallery projects, and installation service; results should be grouped by type.

### Cart and account

The reference supports a conventional cart and a three-step checkout/delivery/payment flow, multiple currencies, customer accounts, private/business registration, delivery address, terms acceptance, and CAPTCHA. This is real reference functionality but conflicts with the requested Finnish quote-first launch. It is intentionally excluded from MVP, not silently forgotten.

### Forms

- Product inquiry: product, quantity, name, required email, phone, required question/message.
- Contact: required first name, surname, phone, required email, message, CAPTCHA/security code.
- Newsletter: email.
- Search: query with autocomplete.
- Registration/account forms: personal/company/contact/delivery details and consent.

Finnish forms should minimize data collection, show a privacy notice/consent basis, support server-side validation and anti-spam, and route to a confirmed Finnish sales destination. The quotation form architecture is specified in `finland-site-architecture.md`.

## 4. Content findings and risk controls

### Reusable manufacturer content

- Product/category names and approved manufacturer descriptions.
- Product dimensions, construction, finish, surface, color, pack, installation method, care relations, and technical documents when tied to a source/version.
- Manufacturing-process explanation.
- Technical education, FAQ, and installation/care instructions after reconciliation and Finnish review.
- Approved product and project imagery with documented rights.

### Lithuania-specific content to replace

- Lithuanian company history, mission/vision, market-position and price claims.
- Lithuanian office addresses, phone, email, company/VAT IDs, personnel, maps, service areas, delivery and return terms.
- Lithuanian installation prices and availability.
- Lithuanian news/publicity, unless independently relevant and approved.
- Account/checkout legal language and currencies.

### Claims requiring explicit evidence before publication

The reference contains durability, fire, biological resistance, formaldehyde, carbon/environmental, certification, guarantee/warranty, and “best/largest/lowest price” style statements. These are not automatically transferable to Finland or to every SKU. Each publishable claim needs a source document, applicable product/SKU, market/language approval, and verification date. Do not publish fake reviews, ratings, certifications, warranties, or environmental claims.

## 5. Audit conclusions

- The reference is a content-rich catalog and technical-information site with commerce attached; it is not merely a brochure homepage.
- Its strongest brand signals are the warm beige/cream palette, condensed typography, generous photography, green actions, dense catalog taxonomy, and detailed product facts.
- Its weakest structural points are duplicated/legacy taxonomy, oversized mobile menu, inconsistent metadata, stale footer links, and commerce prominence that does not suit a Finnish quote-led journey.
- The Finnish site should preserve the page rhythm, catalog depth, image treatment, technical content, and product-card logic while replacing the legal/business layer and conversion model.
- The initial Finnish release should be a catalog + installation service + quotation/sample platform. Checkout, account, stock, and displayed prices remain disabled until Finnish commercial data and operations are supplied.
