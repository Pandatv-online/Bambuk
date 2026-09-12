# Finnish implementation inputs

Status: foundation register, last reviewed 2026-09-11. Nothing marked `missing` is approved for visitor-facing publication. Application values remain `null` or absent until the named owner supplies a verifiable source.

| Input | Status | Owner / source required | Current placeholder behavior | Release impact |
|---|---|---|---|---|
| Finnish display and legal company names | Missing | Finnish business owner and trade register | Development notice; no company name is rendered | Blocks release |
| Finnish Business ID and VAT ID | Missing | Finnish business owner and trade register | Values remain `null` | Blocks release |
| Finnish postal/visiting address | Missing | Finnish business owner | Value remains `null`; no map | Blocks release |
| Finnish phone, email and contact hours | Missing | Finnish sales owner | Values remain `null`; no contact links | Blocks release |
| Manufacturer/brand legal and display names | Missing | Manufacturer agreement/contact | Values remain `null` | Blocks release |
| Approved distributor relationship wording | Missing | Finnish company and manufacturer | No relationship claim is rendered | Blocks release |
| Manufacturer and distributor logo rules/files | Missing | Both brand owners | No logo lockup; neutral development surface | Blocks branded release |
| Final public domain | Missing | Finnish business/technical owner | Metadata uses localhost during development | Blocks release |
| Launch language decision beyond Finnish | Pending | Finnish content owner | Only `/fi`; no language switch | Does not block FI-only release |
| Confirmed Finnish category assortment | Missing | Finnish assortment owner | Categories are `pendingAssortment`; no availability claim | Blocks catalog release |
| Product master, SKUs and product relations | Missing | Current manufacturer product master | Product registry is empty | Blocks catalog release |
| Finnish product descriptions and specifications | Missing | Manufacturer sources plus Finnish technical review | No product facts render | Blocks product release |
| Technical documents, versions and SKU applicability | Missing | Manufacturer document owner | No downloads or technical claims | Blocks affected products |
| Product image files and metadata | Missing | Manufacturer/distributor asset owner | Product media is absent | Blocks affected products |
| Finnish price, VAT basis and update owner | Missing | Finnish commercial owner/system | Price defaults to `quote`; no number | Blocks published prices only |
| Stock, availability, lead time and update owner | Missing | Finnish operations/inventory source | Availability defaults to `unknown` and is not claimed | Blocks availability display only |
| Sample eligibility, cost and delivery policy | Missing | Finnish sales/operations | Samples feature is disabled | Blocks sample flow |
| Installation provider and service scope | Missing | Finnish service owner | Scope remains `null`; no operational promise | Blocks installation release |
| Installation methods and product applicability | Missing | Manufacturer documents and Finnish installer | No method claims | Blocks affected service content |
| Installation inclusions, exclusions and preparation | Missing | Finnish service owner and legal review | No process/scope detail | Blocks installation release |
| Installation service area and pricing | Missing | Finnish service/commercial owner | Values remain `null`; quote-only intent | Blocks installation release |
| Delivery and return terms | Missing | Finnish operations and legal owner | No commercial terms page or checkout | Blocks commerce release |
| Warranty wording and applicability | Missing | Manufacturer/Finnish seller documentation | No warranty claim | Blocks affected claim/product |
| Certifications and environmental/performance claims | Missing | Applicable source, SKU scope and Finnish reviewer | No claims, badges or structured data | Blocks affected claim/product |
| Privacy, cookie and other Finnish legal text | Missing | Finnish legal/privacy owner | No legal assertion or consent UI | Blocks release/forms/analytics as applicable |
| Form provider, destination and response process | Missing | Finnish sales/privacy/technical owners | No submission endpoint; CTAs remain on-page | Blocks forms and release |
| Image reuse rights, credits, product relations and alt text | Partially confirmed | Project brief authorizes reference-site materials; asset owner must still confirm any required credits and product/project relations | Homepage uses only the local assets registered below; captions avoid unverified product/project attribution | Blocks unregistered assets and product-specific attribution |
| Finnish project/gallery assets and permissions | Missing | Distributor/project rights owner | Gallery records remain absent | Blocks gallery content only |
| Analytics vendors and consent decision | Missing | Finnish business/privacy owner | No analytics or trackers load | Does not block tracker-free release |

## Foundation controls

- `siteConfig` centralizes public nullable business inputs and independently disabled feature flags.
- `getReleaseReadiness()` reports unresolved required fields. Development remains runnable; production readiness is false until core identity, contact, legal, form and domain inputs exist.
- `NEXT_PUBLIC_SITE_URL` is the only environment-provided public origin. It contains no secret and is documented in `.env.example`.
- The foundation `/fi` surface is `noindex` until the release-blocking identity, domain, legal, and operational inputs are supplied and reviewed.
- Next.js remote image sources are disabled. Only local files with recorded provenance may be added under `public/`.
- Open Sans is self-hosted from the official Google Fonts distribution under the bundled SIL Open Font License; the local variable subset covers Finnish text and keeps builds network-independent.
- Products stay absent until an applicable source is approved. Numeric price, stock, Offer, Product, Review and organization structured data are not emitted by this foundation.

## Homepage image provenance

Permission basis for this register: the project owner states that the reference-site partner has authorized reuse for the Finnish distributor website and explicitly supplied the retained materials for visual use. Every file is served locally; the source path below is internal provenance and is never rendered as a visitor link. Product and project relations remain unconfirmed.

| Rights ID | Local file | Reference source path | Finnish alt-text status |
|---|---|---|---|
| `reference-home-slide-18` | `/images/home/hero-natural.jpg` | `/uploads/it0160/slide_18.png` | Added; no SKU/project claim |
| `reference-category-2` | `/images/home/category-flooring.jpg` | `/uploads/e_catalog/catalog_2_1s150.jpg` | Added; architecture-level category |
| `reference-category-21` | `/images/home/category-outdoor.jpg` | `/uploads/e_catalog/catalog_21_1s150.jpg` | Added; architecture-level category |
| `reference-category-5` | `/images/home/category-details.jpg` | `/uploads/e_catalog/catalog_5_1s150.jpg` | Added; architecture-level category |
| `reference-category-7` | `/images/home/category-decor.jpg` | `/uploads/e_catalog/catalog_7_1s150.jpg` | Added; architecture-level category |
| `reference-category-6` | `/images/home/category-installation.jpg` | `/uploads/e_catalog/catalog_6_1s150.jpg` | Added; architecture-level category |
| `reference-category-26` | `/images/home/category-care.jpg` | `/uploads/e_catalog/catalog_26_1s150.jpg` | Added; architecture-level category |
| `reference-gallery-311` | `/images/home/project-01.jpg` | `/uploads/it0003/gal_7_311m.jpg` | Added; visual description only |
| `reference-gallery-312` | `/images/home/project-02.jpg` | `/uploads/it0003/gal_7_312m.jpg` | Added; visual description only |
| `reference-gallery-339` | `/images/home/project-03.jpg` | `/uploads/it0003/gal_7_339m.jpg` | Added; visual description only |
| `reference-gallery-147` | `/images/home/project-04.jpg` | `/uploads/it0003/gal_7_147m.jpg` | Added; visual description only |
| `reference-gallery-148` | `/images/home/project-05.jpg` | `/uploads/it0003/gal_7_148m.jpg` | Added; visual description only |
| `reference-gallery-149` | `/images/home/project-06.jpg` | `/uploads/it0003/gal_7_149m.jpg` | Added; visual description only |
| `reference-gallery-333` | `/images/home/project-07.jpg` | `/uploads/it0003/gal_7_333m.jpg` | Added; visual description only |
| `reference-gallery-330` | `/images/home/project-08.jpg` | `/uploads/it0003/gal_7_330m.jpg` | Added; visual description only |
| `reference-news-installation-17` | `/images/home/installation.jpg` | `/uploads/it0025/news_5_17s.jpg` | Added; process image only |
