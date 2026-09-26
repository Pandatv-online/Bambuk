# Finland distributor site architecture

Status: proposed architecture for approval before implementation.  
Primary market/language: Finland / Finnish.  
Future optional languages: English and Swedish.

## 1. Product and business position

The site represents **[OUR COMPANY NAME]**, an authorized Finnish distributor. It is not a Finnish branch of the Lithuanian company and must never imply shared legal identity.

Every relevant page should make these roles understandable:

| Role | Owns / supplies | How the site presents it |
|---|---|---|
| Manufacturer / original brand | Product brand, approved product facts, technical documents, manufacturer warranties/certifications where applicable | Named as manufacturer/brand, linked to factual product content, never shown as the Finnish contracting company unless legally true |
| `[OUR COMPANY NAME]` | Finnish sales relationship, offers, invoicing, local contact, delivery terms and customer service | Site owner and Finnish distributor identified in Contact, footer, forms, and legal metadata; the header mark does not display the operator name |
| Finnish installation service | Survey, quotation, service scope, areas and installation delivery | A first-class service under `[OUR COMPANY NAME]` or its disclosed installation partner, once confirmed |

Required launch placeholders:

- `[OUR COMPANY NAME]`
- `[FINNISH BUSINESS ID]`
- `[FINNISH VAT ID]`
- `[FINNISH ADDRESS]`
- `[FINNISH PHONE]`
- `[FINNISH EMAIL]`
- `[MANUFACTURER / BRAND NAME AND APPROVED RELATIONSHIP WORDING]`
- `[SERVICE AREA]`
- `[INSTALLATION SCOPE TO BE CONFIRMED]`
- `[INSTALLATION PRICING TO BE CONFIRMED]`
- `[DELIVERY TERMS TO BE CONFIRMED]`
- `[LEGAL TEXT PENDING FINNISH REVIEW]`

Placeholders must remain visibly marked in non-production content and must block production release where legally or operationally necessary.

## 2. What stays similar and what changes

| Preserve from reference | Adapt for Finland |
|---|---|
| Warm natural visual system, condensed typography, green actions | Finnish distributor logo/name and explicit role statement |
| Homepage rhythm and image-led category presentation | Finnish customer value proposition and quote/sample/install CTAs |
| Full catalog hierarchy and collection concept | Only products/categories confirmed for the Finnish assortment |
| Rich product facts, specifications, images, documents and related products | Natural Finnish terminology; price/stock/lead time supplied by Finnish operations |
| Technical-information depth and FAQ topics | Reconciled source claims and Finland-appropriate wording |
| Gallery and product/project relations | Approved manufacturer assets plus Finnish projects when available |
| Search across products and information | Finnish stemming/synonyms and grouped result types |
| Responsive drawer and compact fixed header | Accessible collapsible nesting and persistent quote path |
| Installation content and product-installation links | Dedicated Finnish service journey, areas, scope, preparation and quote form |
| Breadcrumb and category logic | Clean Finnish URLs, canonical and hreflang strategy |
| Cart/account as known future capability | Deferred from launch; quote-first primary conversion |

## 3. Proposed Finnish sitemap

Locale-prefixed URLs are recommended from day one because EN and SV are anticipated. `/` redirects to `/fi` using a stable language choice; it must not create multiple indexable copies. If the business decides Finnish will permanently live at root, this can be changed before implementation, not after indexing.

### Primary routes

| Proposed URL | Page | Purpose / primary action |
|---|---|---|
| `/fi` | Home | Discover range and brand; request quote |
| `/fi/tuotteet` | Catalog hub | Browse all product families |
| `/fi/asennus` | Installation service | Understand service; request installation quote |
| `/fi/galleria` | Gallery | Validate aesthetic/project fit; open product/project |
| `/fi/tietoa-bambusta` | Information hub | Product, technical, installation and care education |
| `/fi/meista` | About distributor | Understand Finnish company and manufacturer relationship |
| `/fi/yhteystiedot` | Contact | Finnish sales/contact details and message form |
| `/fi/pyyda-tarjous` | Quote | Submit product/project/installation inquiry |
| `/fi/tilaa-mallipala` | Sample request | Request confirmed sample products |
| `/fi/haku` | Search | Find products and guidance |

### Catalog routes

| Proposed URL | Parent | Page type |
|---|---|---|
| `/fi/tuotteet/sisalattiat` | Products | Parent category |
| `/fi/tuotteet/sisalattiat/klassikko` | Interior floors | Collection |
| `/fi/tuotteet/sisalattiat/variharmonia` | Interior floors | Collection |
| `/fi/tuotteet/sisalattiat/antiikki` | Interior floors | Collection |
| `/fi/tuotteet/sisalattiat/bambu` | Interior floors | Collection |
| `/fi/tuotteet/sisalattiat/luonnon-kosketus` | Interior floors | Collection |
| `/fi/tuotteet/sisalattiat/kalanruoto` | Interior floors | Collection |
| `/fi/tuotteet/ulkotuotteet` | Products | Parent category |
| `/fi/tuotteet/ulkotuotteet/terassilaudat` | Outdoor | Product category |
| `/fi/tuotteet/ulkotuotteet/ulkoverhous-ja-raystaslaudat` | Outdoor | Product category |
| `/fi/tuotteet/ulkotuotteet/asennustarvikkeet` | Outdoor | Product category |
| `/fi/tuotteet/ulkotuotteet/hoitotuotteet` | Outdoor | Product category |
| `/fi/tuotteet/jalkalistat-ja-porrasosat` | Products | Product category |
| `/fi/tuotteet/bambulevyt` | Products | Parent category |
| `/fi/tuotteet/bambulevyt/kalustelevyt` | Bamboo panels | Product category |
| `/fi/tuotteet/bambusisustus` | Products | Parent category |
| `/fi/tuotteet/bambusisustus/bambusaleet` | Bamboo décor | Product category |
| `/fi/tuotteet/bambusisustus/bambuseinakkeet` | Bamboo décor | Product category |
| `/fi/tuotteet/bambusisustus/bambutapetit` | Bamboo décor | Product category |
| `/fi/tuotteet/lattian-asennustuotteet` | Products | Product category |
| `/fi/tuotteet/lattian-hoitotuotteet` | Products | Product category |
| `/fi/tuotteet/[category]/[product-slug]` | Leaf category | Product detail |

Names of manufacturer collections should be confirmed before translation. If a collection has a protected official name, preserve it and add a Finnish explanatory label rather than freely renaming it.

### Information routes

The reference depth should remain available; a hub makes it easier to navigate without deleting important material.

| Proposed URL | Reference content |
|---|---|
| `/fi/tietoa-bambusta/edut` | Flooring/decking benefits, verified claims only |
| `/fi/tietoa-bambusta/valmistus` | Manufacturing process |
| `/fi/tietoa-bambusta/rakenne-ja-kuviot` | Construction, patterns, edges |
| `/fi/tietoa-bambusta/varit-ja-pinnat` | Colors, surfaces, finishes |
| `/fi/tietoa-bambusta/kovuus` | Janka information and scope |
| `/fi/tietoa-bambusta/lammoparameetrit` | Thermal conductivity data and documents |
| `/fi/tietoa-bambusta/lattialammitys` | Underfloor-heating applicability and conditions |
| `/fi/tietoa-bambusta/asennustavat` | Product installation methods; links to service |
| `/fi/tietoa-bambusta/hoito-ja-huolto` | Care and maintenance guidance |
| `/fi/tietoa-bambusta/liimat-pohjusteet-ja-pintakasittelyt` | Adhesives, binders, primers, lacquer/finishes |
| `/fi/tietoa-bambusta/ohjeet-ja-dokumentit` | Versioned manuals and technical downloads |
| `/fi/tietoa-bambusta/ukk` | Reviewed FAQ accordion |

### Installation route structure

`/fi/asennus` is the main service landing page and includes:

1. Service promise and `Pyydä asennustarjous` CTA.
2. Supported work types: interior bamboo floor and bamboo terrace, only as operationally confirmed.
3. Process: inquiry, information/site assessment, written scope/offer, preparation, installation, handover — wording pending operational confirmation.
4. Preparation and substrate/site requirements from manufacturer-approved instructions.
5. Applicable installation methods, linked to compatible product records.
6. What is included / not included using `[INSTALLATION SCOPE TO BE CONFIRMED]` until signed off.
7. What the customer prepares, based on confirmed process rather than assumptions.
8. Pricing: either verified amounts and basis or `[INSTALLATION PRICING TO BE CONFIRMED]` with quote CTA.
9. Service area: `[SERVICE AREA]`.
10. Installation/project gallery.
11. Quote form pre-tagged with `service=installation`.

Interior/terrace child pages can be introduced later if there is enough distinct verified content. Avoid thin SEO doorway pages.

### Legal and utility routes

- `/fi/tietosuoja` — privacy notice after Finnish review.
- `/fi/evasteet` — cookie/vendor details based on actual implementation.
- `/fi/toimitusehdot` — only if sales/delivery terms are ready.
- `/fi/saavutettavuus` — recommended accessibility statement.
- `/fi/kiitos` — form confirmation, `noindex`.
- Custom `404` and error state.

Search query results, preview/draft routes, form confirmations, and future account/cart/checkout routes should be excluded from indexing.

## 4. Navigation architecture

### Desktop header

Recommended top-level order:

1. Tuotteet
2. Asennus
3. Tietoa bambusta
4. Galleria
5. Meistä
6. Yhteystiedot
7. `Pyydä tarjous` primary action

Search and locale controls remain utilities. The header shows the BAMBU mark without the operator name; Contact and footer identify the Finnish site operator. The deep product hierarchy lives under Tuotteet; information leaf pages live under Tietoa bambusta.

### Mobile

- Fixed compact header with logo, quote/contact shortcut, and menu.
- Drawer: search first, then primary links; Tuotteet and Tietoa bambusta use accessible nested disclosure controls.
- Locale control at the bottom or in a compact utility section.
- No empty cart, account, currency, EN, or SV control.

### Footer

Five logical groups: products, information, installation/customer service, company/legal, and Finnish contact. Include explicit manufacturer/distributor attribution. Footer links come from the same route registry as header, sitemap, and breadcrumbs.

## 5. Finnish customer journey

```text
Search / advertisement
        ↓
Relevant landing page or homepage
        ↓
Category / collection
        ↓
Product detail with technical evidence
        ↓
Installation guidance and related service
        ↓
Quote or sample request
        ↓
Finnish sales follow-up
        ↓
Confirmed product sale and/or installation
```

Primary conversion: `Pyydä tarjous`.  
Secondary conversions: `Ota yhteyttä`, `Tilaa mallipala`, `Kysy asennuksesta`.

CTA context must travel into the form: product ID, collection/category, desired area/quantity, installation interest, and source URL. This removes repeated work for the customer and sales team.

## 6. Homepage architecture

Order follows the reference homepage, with purposeful Finland adaptations:

1. **Header** — BAMBU mark, navigation, search, quote CTA; operator identity remains accessible through Contact and footer.
2. **Hero** — approved interior/terrace photograph, natural Finnish proposition, `Tutustu tuotteisiin` and `Pyydä tarjous`.
3. **About bamboo flooring** — concise factual introduction and link to information hub.
4. **Main product categories** — reference-style image card grid in the approved Finnish assortment order.
5. **Bamboo in interiors and projects** — reference-style gallery mosaic.
6. **Bamboo flooring advantages** — only verified manufacturer facts, with technical-source links.
7. **Featured products** — data-selected products, replacing unsupported “special offers.”
8. **Professional installation in Finland** — prominent service section with process preview and quote CTA. This is a Finland-specific elevation of the reference service article.
9. **Technical information and guides** — three-card reference-style editorial grid; replaces an unmaintained news feed at launch.
10. **Contact/quote CTA** — Finnish contact and next step.
11. **Footer** — approved taxonomy, relationship, Finnish company/legal/contact.

This preserves the reference’s visual sequence while inserting installation and conversion at the level required by the Finnish business model.

## 7. Product and content data architecture

### Initial source-of-truth recommendation

Use typed, file-based content under `/data` for the initial build. It is reviewable in version control, prevents facts from hiding inside components, and avoids adding a CMS before editorial roles/workflow are known. Add a headless CMS only when non-developer editing, approvals, inventory integration, or multilingual volume justifies it.

Proposed structure:

```text
/data
  /products              one record per product
  /categories            ordered category tree
  /collections           manufacturer collections
  /content               information pages and FAQ
  /projects              gallery/project metadata
  /documents             technical document metadata
  /company               Finnish distributor and manufacturer entities
  /services              installation scope/areas/process
  /seo                    shared metadata and redirects
```

Use TypeScript records or validated JSON/YAML with a schema. Rich content may be MDX only when components and sanitization are controlled.

### Product model

Every product supports these normalized fields; most are optional because product types differ:

```text
id, status, slugByLocale, sku
nameByLocale, summaryByLocale, descriptionByLocale
manufacturerId, brandId, categoryId, collectionId
color, surface, finish
dimensions: length, width, thickness, unit, tolerances
package: area, quantity, weight, unit
pricing: status, amount, currency, basis, vatDisplay, updatedAt
availability: status, quantity, leadTime, updatedAt
installation: methodIds, notesByLocale
maintenance: summaryByLocale, relatedProductIds
specifications: ordered { key, labelByLocale, value, unit, sourceId }
documents: { id, title, language, version, date, file, applicableSkus }
images: { src, altByLocale, captionByLocale, order, focalPoint, rightsId }
galleryProjectIds, relatedProductIds, accessoryProductIds, sampleProductId
claims: { textByLocale, sourceId, applicableSkus, status, verifiedAt }
seo: titleByLocale, descriptionByLocale, ogImage
```

`pricing.status` supports `hidden`, `quote`, and `published`; no zero or placeholder amount renders as a real price. `availability.status` supports `unknown`, `onRequest`, `inStock`, `outOfStock`, and `madeToOrder`, with Finnish labels approved by operations. Flexible specifications allow panels, floors, decking, adhesives, and care products to share one template without UI edits.

### Other core entities

- `Manufacturer`: legal/display name, brand, approved relationship wording, source/contact links.
- `DistributorCompany`: Finnish legal/display name, business/VAT IDs, address, contact, service hours, invoicing/legal data.
- `Category` and `Collection`: localized name/description, image, parent, order, enabled locales.
- `Service`: supported work, process, inclusions, exclusions, area, pricing policy, source/approval status.
- `Claim`: text, source document, applicable SKUs/categories, geography, status, verifier/date.
- `Document`: version/date/language/file/applicable products and supersession status.
- `Project`: approved images, product relations, location, description, rights/credit.
- `MarketPolicy`: Finnish delivery, samples, returns, VAT display and lead-time wording.

## 8. Content and localization rules

- Finnish is authored for Finnish customers, not rendered as a literal Lithuanian translation.
- Use `bambulattia` as the broad customer term. Use `bambuparketti` only when the product’s construction and Finnish trade usage justify “parketti.”
- Use `bambuterassi`, `bambuterassilauta`, `lattian asennus`, `bambulattian asennus`, and `lattialämmitys` naturally.
- “Kestävä” can mean durable or sustainable in Finnish; make the intended meaning explicit and evidence-backed.
- Never translate a manufacturer collection name, certification, technical unit, or installation condition without source validation.
- EN/SV pages are not published until complete and human-reviewed. Do not show empty locale links.

See `content-map.md` for page-level content ownership and terminology.

## 9. SEO architecture

Every indexable page supports:

- Unique Finnish title and meta description.
- Self-referencing canonical URL.
- Open Graph title, description, image, URL, locale and site name.
- One semantic H1 and ordered heading hierarchy.
- Crawlable clean URL and meaningful internal links.
- Optional `hreflang` for `fi`, `en`, and `sv` only when equivalent pages exist; `x-default` decision before launch.
- Breadcrumbs in UI and `BreadcrumbList` JSON-LD.

Structured data:

- `Organization` or appropriate `LocalBusiness`: Finnish distributor, with manufacturer relationship stated in content rather than merged identity.
- `Product`: name, SKU, brand/manufacturer, images, description and exact properties. Add `Offer` only when Finnish price, currency, VAT presentation, URL and availability are real/current.
- `Service`: Finnish installation service and confirmed area/provider.
- `FAQPage`: only for visible, reviewed questions/answers and only when eligible.
- `WebSite`/search action where implementation matches.
- No fabricated `Review`, `AggregateRating`, certification or award data.

Technical SEO deliverables:

- Generated `sitemap.xml` containing published canonical pages only.
- `robots.txt` linking sitemap and excluding search results, form confirmations, drafts/previews, and future customer/cart flows as appropriate.
- Redirect registry for changed slugs.
- Image metadata, responsive assets and descriptive filenames/alt text.
- Pagination/canonical behavior for catalog listings and filters; uncontrolled filter URLs should not create an indexable crawl space.

## 10. Technical architecture for implementation

Required stack: Next.js App Router, TypeScript, Tailwind CSS.

Proposed project layout:

```text
/app
  /[locale]
    /(marketing)
    /tuotteet
    /asennus
    /galleria
    /tietoa-bambusta
    /meista
    /yhteystiedot
    /pyyda-tarjous
    /tilaa-mallipala
    /haku
  /api
/components
  /layout /navigation /catalog /product /forms /content /gallery /seo /ui
/data
/lib
  /content /catalog /forms /i18n /seo /structured-data /validation
/public
  /images /documents /fonts
/styles
/docs
```

Implementation principles:

- Server Components by default; client components only for actual interaction.
- Static generation/revalidation for catalog/content where appropriate.
- Zod or equivalent schema validation at the data boundary and again for forms.
- Route/page code reads data through `/lib`, never directly scatters file parsing.
- Images use the Next.js image pipeline with explicit sizes and focal handling.
- Form transport is an adapter, so email/CRM can be selected without rewriting UI.
- Feature flags gate price, stock, sample logistics, newsletter, cart and checkout.
- Test coverage prioritizes schemas, routes, calculators, forms, metadata and navigation accessibility.
- No CMS/database until its editorial or integration benefit is defined.

## 11. Delivery stages and gates

| Stage | Output | Acceptance gate |
|---|---|---|
| 1. Reference audit | This audit and evidence | User reviews scope/findings |
| 2. Information architecture | This document and content map | Sitemap, company roles, conversion model approved |
| 3. Design system | `design-system.md` | Desktop/mobile visual tokens approved |
| 4. Homepage | Reference-aligned home | Side-by-side visual/content review; no unverified claims |
| 5. Catalog | Category tree, filters, search/listing | Assortment and taxonomy source approved |
| 6. Product pages | Flexible product template/data | Representative product types render without special-case UI |
| 7. Installation | Service page and inquiry | Finnish scope, requirements, area and pricing wording approved |
| 8. Gallery | Filterable projects/lightbox | Rights, captions and relations approved |
| 9. Contact/forms | Quote, sample and contact flows | Destinations, privacy, spam control and error flows verified |
| 10. SEO | Metadata, structured data, sitemap, robots | Validation and no fake offers/reviews |
| 11. Responsive | Mobile/tablet/desktop polish | Navigation/forms/product pages keyboard and device tested |
| 12. Performance/QA | Final audit | Core Web Vitals, accessibility, broken links, visual regression, content release checklist |

No implementation stage starts until the preceding content/data dependencies are known. After every major stage, compare the result against the retained reference screenshot, live behavior evidence, design tokens, and this architecture.

## 12. Decisions required before coding

1. Finnish distributor legal/display name, logo and approved wording of the manufacturer relationship.
2. Confirmed Finnish launch assortment and whether every reference category is sold.
3. Product master data and technical-document source/version.
4. Whether price and stock appear at launch; if yes, source, VAT basis and update owner.
5. Sample availability, cost, delivery and geographic rules.
6. Installation provider, supported services/methods, inclusions/exclusions, service area and pricing policy.
7. Finnish sales/form destinations and response expectations.
8. Delivery, return, privacy, cookie and other legal text.
9. Approved image/logo rights and Finnish project imagery.
10. Launch languages: FI only is recommended; EN/SV follow after reviewed content.
11. Final domain and analytics/consent choices.

These are content and operating inputs, not reasons to alter the approved component/data architecture.
