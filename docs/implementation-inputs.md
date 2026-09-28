# Finnish implementation inputs

Status: implementation register, originally reviewed 2026-09-23. The table below is a historical snapshot; the 2026-09-28 owner decisions immediately below supersede its contact, sample, delivery, form and indexing rows. Remaining missing manufacturer facts and image permissions are still not supplied.

## Owner decisions, 2026-09-28

- The corporate email will be added later. The published contact channels are the telephone and working inquiry forms.
- Visitors are not received at the registered address. By the owner's 2026-09-28 clarification, staff can arrange a visit to the customer's site to assess work and show samples. Samples can also be mailed or occasionally shown at trade fairs. The sample form distinguishes postal delivery from a site visit, and neither route promises an unscheduled visit.
- Delivery is arranged for each order; a fixed delivery price, area or schedule is not claimed.
- The owner reports that the inquiry flow has been checked and works. Telegram delivery credentials are configured in the Cloudflare worker; the public config records the destination type, never the secret values.
- The owner approved indexing the entire current site. Published route metadata and sitemap now include the home, 22 category routes, active product routes, published information pages, gallery, contact, quote, sample and privacy pages. Catalog filter/search URLs remain `noindex`; `notReady` products remain excluded. Adding a new active product to the catalog requires a build and deployment before search engines can discover its page.
- The reported Samsung Chrome screenshot error was transient. The site has no screenshot prohibition or screen-capture policy to remove. Native screenshots now work for the owner.
- The owner did not provide a separate confirmation of terrace-gallery production image rights or the manufacturer identity. Those provenance records remain open and should be resolved independently of crawl metadata.

| Input | Status | Owner / source required | Current placeholder behavior | Release impact |
|---|---|---|---|---|
| Company identity, registration country and served markets | Supplied | Project owner | `Osaühing IKB`, an Estonian company serving Finland and Estonia | Does not block release |
| Registry code and VAT ID | Supplied | Project owner’s Teatmik URL; compact record checked 2026-09-23 | `10161031`; `EE100414305` | Does not block release |
| Registered address | Supplied | Project owner’s Teatmik URL; compact record checked 2026-09-23 | `Mere pst 2, 40231 Sillamäe linn`, labelled only as registered address | Does not by itself permit visits |
| Visit location and publication permission | Missing | Company owner | No visit address or showroom claim is published | Blocks release |
| Phone and contact hours | Supplied | Project owner | `+358 50 508 0808`; `ma–pe 8.00–18.00` | Does not block release |
| Visit arrangement | Supplied | Project owner | Visitors see `Sovi käynti etukäteen puhelimitse`; no location is implied | Does not block release |
| Contact email | Missing | Company sales owner | Value remains `null`; no email link is shown | Blocks release |
| Manufacturer/brand legal and display names | Missing | Manufacturer agreement/contact | Values remain `null` | Blocks release |
| Public distributor/manufacturer relationship wording | Explicitly excluded | Project owner | No relationship claim is stored or rendered | Does not block release |
| Manufacturer and distributor logo rules/files | Missing | Both brand owners | No logo lockup; neutral development surface | Blocks branded release |
| Public canonical origin | Supplied | Project owner | `https://bamboopro.fi` is configured through `NEXT_PUBLIC_SITE_URL`; development alone may use localhost | Does not approve deployment or DNS |
| Launch language decision beyond Finnish | Pending | Finnish content owner | Only `/fi`; no language switch | Does not block FI-only release |
| Imported catalog scope and Finnish assortment review | Partially supplied | Reference snapshot plus Finnish assortment owner | 108 traceable internal products: 82 active/quote-eligible and 26 report-only `notReady` | Blocks the 26 not-ready records and any unapproved assortment changes |
| Product master, SKUs and product relations | Partially supplied | Validated reference extraction plus current manufacturer product master | Imported records retain nullable source facts; invalid or incomplete relations remain report-only | Blocks affected records, not the validated active subset |
| Finnish product descriptions and specifications | Partially supplied | Reference extraction plus manufacturer sources and Finnish technical review | Only source-backed imported facts may render; missing fields remain null | Blocks affected facts/products |
| Technical documents, versions and SKU applicability | Missing | Manufacturer document owner | Source crawl discovered 0 product documents; no download or document-backed claim is published | Blocks affected documents and claims |
| Product image files and metadata | Partially supplied | Validated reference extraction plus manufacturer/distributor asset owner | 352 product images and 21 category thumbnails are stored locally; rights/applicability metadata remains record-bound | Blocks missing or unregistered media only |
| Source price snapshot, Finnish VAT basis and update owner | Partially supplied | Valid reference extraction plus Finnish commercial owner/system | A source price snapshot is retained only when provenance is valid; public pricing stays gated while Finnish VAT scope is pending | Blocks published Finnish prices only |
| Stock, availability and lead-time detail | Partially supplied | Project owner plus Finnish operations/inventory source | Every active imported product is confirmed `inStock`; quantities, lead times and update ownership remain pending | Blocks unsupported quantity/lead-time claims only |
| Sample availability, cost and delivery policy | Partially supplied | Project owner plus Finnish sales/operations | Every active imported product is eligible for a sample; cost, delivery geography/method and handling/visit terms remain pending | Blocks the unresolved sample flow details, not availability or eligibility |
| Installation provider and service scope | Missing | Finnish service owner | Scope remains `null`; no operational promise | Blocks installation release |
| Installation methods and product applicability | Missing | Manufacturer documents and Finnish installer | No method claims | Blocks affected service content |
| Installation inclusions, exclusions and preparation | Missing | Finnish service owner and legal review | No process/scope detail | Blocks installation release |
| Installation service area and pricing | Missing | Finnish service/commercial owner | Values remain `null`; quote-only intent | Blocks installation release |
| Delivery and return terms | Partially supplied | Project owner plus Finnish operations and legal owner | Delivery is included where the written offer applies; geography, exceptions, returns and VAT treatment remain pending | Blocks generic delivery claims and commerce release |
| Warranty wording and applicability | Partially supplied | Project owner plus manufacturer/Finnish seller documentation | Warranty is 12 months; scope, applicable products and written terms remain pending | Blocks unsupported scope/detail, not the confirmed duration |
| Certifications and environmental/performance claims | Missing | Applicable source, SKU scope and Finnish reviewer | No claims, badges or structured data | Blocks affected claim/product |
| Privacy, cookie and other Finnish legal text | Partially supplied | Finnish legal/privacy owner; Telegram transfer details from privacy/technical owners | Finnish form-privacy draft at `/fi/tietosuoja` remains `noindex`; an internal 12-month manual retention procedure exists. Cookie and other legal text are still pending; no analytics consent UI is enabled. `siteConfig.legal.privacyNotice` remains `null`. | Independent legal review and verification of Telegram processing, retention and transfer details block production forms and release; analytics requires a separate vendor/consent decision |
| Telegram inquiry configuration and response process | Missing | Company sales/privacy/technical owners | Only `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are named in `.env.example`; the owner adds newly rotated values to ignored `.env.local`; no submission may claim success while unconfigured | Blocks forms and release |
| Image reuse rights, credits, product relations and alt text | Partially confirmed | Project brief authorizes reference-site materials; asset owner must still confirm any required credits and product/project relations | Homepage uses a controlled eight-image local gallery subset; captions avoid unverified product/project attribution | Blocks unregistered assets and product-specific attribution |
| Finnish project/gallery assets and permissions | Partially confirmed | Distributor/project rights owner | The review-state gallery has 8 interior records and 58 terrace records from the owner-requested reference album; each has a local file, source URL, rights ID and visual-only Finnish alt text | Blocks production publication, product/project attribution and any required credits until the rights owner confirms them |
| Analytics vendors and consent decision | Missing | Finnish business/privacy owner | No analytics or trackers load | Does not block tracker-free release |

## Foundation controls

- `siteConfig` centralizes the confirmed Osaühing IKB identity, registry facts, Estonia/Finland market scope, phone, hours and phone-arranged visit wording alongside nullable legal inputs and independently disabled feature flags.
- `getReleaseReadiness()` reports unresolved required fields. Development remains runnable; production readiness stays false for the missing email, permission to publish a visit location, unreviewed privacy draft, delivery terms and configured inquiry destination. Legal review and Telegram transfer verification remain separate release gates; relationship wording is intentionally not a release input.
- `NEXT_PUBLIC_SITE_URL` is the only environment-provided public origin. It contains no secret and is documented in `.env.example`.
- The foundation `/fi` surface is `noindex` until the release-blocking identity, domain, legal, and operational inputs are supplied and reviewed.
- Next.js remote image sources are disabled. Only local files with recorded provenance may be added under `public/`.
- Open Sans is self-hosted from the official Google Fonts distribution under the bundled SIL Open Font License; the local variable subset covers Finnish text and keeps builds network-independent.
- The catalog currently contains 108 traceable internal products: 82 active/quote-eligible and 26 report-only `notReady`, backed by 352 local product images, 21 category thumbnails and 0 discovered product documents. Supplemental media evidence and its applicable source IDs are recorded in `data/catalog/supplemental-media-2026-09-23.json`. The 17 terrace products are backed by live category evidence in `data/catalog/supplemental-products-2026-09-23.json`; their LT prices are withheld pending Finnish approval.
- Active imported products are confirmed `inStock` and sample-eligible; delivery is included subject to written-offer applicability, and warranty duration is 12 months. Quantity, lead-time, sample cost, delivery geography/method, handling/visit terms and warranty scope/terms remain pending.
- Valid source price snapshots remain provenance data rather than approved Finnish offers while VAT scope is unresolved. Offer, Review and organization structured data stay gated; Organization/LocalBusiness data also remains blocked until legal identifiers and address are confirmed.

## Integrated review state

- The review-state homepage, navigation and footer use the controlled catalog, information and gallery registries. Completed visitor paths are `/fi/tuotteet`, its generated category/product pages, `/fi/tietoa-bambusta` and its published pages, `/fi/galleria`, `/fi/yhteystiedot`, `/fi/pyyda-tarjous` and `/fi/tilaa-mallipala`.
- Every completed commercial/content route uses the shared metadata boundary and remains `noindex, nofollow`. Metadata uses `https://bamboopro.fi` when `NEXT_PUBLIC_SITE_URL` is supplied and a local origin only during development; no sitemap, robots publication or `hreflang` is enabled in this review state.
- No Organization, LocalBusiness, Offer, Review or AggregateRating structured data is emitted. Reference URLs, source records and asset provenance remain internal and are not rendered as visitor links.
- The homepage renders root categories, a deterministic three-product catalog excerpt and a controlled eight-image gallery subset with four interior and four terrace scenes. The full gallery holds 66 local review records. They have registered `reference-gallery-*` rights IDs; captions and alt text make no product, customer or project attribution. The excerpt is not labelled as a recommendation, sale or offer; product price snapshots and commercial conditions retain their record-level wording.
- Contact, quote and sample forms post to `/api/inquiries`. Without configured Telegram environment values they preserve the entered values and report typed temporary unavailability; no response-time promise is published.
- Browser QA is configured for 390, 768, 1200 and 1440 px. It checks the shared navigation, catalog filters, a catalog-derived product page and specifications, gallery lightbox, and all three form routes. It requires a running site plus a Chrome DevTools endpoint and must be rerun before release.

## Remaining gallery rights and release blockers

- The 66 review records do not establish Finnish project ownership, product/SKU relation, customer permission or photographer credit. Those facts remain unconfirmed and are intentionally absent from visitor copy.
- The project owner explicitly requested terrace photos from the reference album on 2026-09-25. This supports adding them to the noindex review gallery; production reuse, any product-specific placement and required credits still need confirmation from the asset and distributor/project rights owners.
- Gallery review state does not lift the site-wide release blockers: email, permission to publish a visit location, legal review of the privacy draft and Telegram transfer details, delivery terms, manufacturer identity inputs, and configured Telegram inquiry transport remain unresolved. The gallery and all related routes therefore remain `noindex, nofollow`.

## Homepage image provenance

Permission basis for this register: the project owner states that the reference-site partner has authorized reuse for the Finnish distributor website and explicitly supplied the retained materials for visual use. Every file is served locally; the source path below is internal provenance and is never rendered as a visitor link. Product and project relations remain unconfirmed.

| Rights ID | Local file | Reference source path | Finnish alt-text status |
|---|---|---|---|
| `reference-home-slide-18` | `/images/home/hero-natural.jpg` | `/uploads/it0160/slide_18.png` | Added; no SKU/project claim |
| `reference-home-slide-47` | `/images/home/hero-terrace.jpg` | `/uploads/it0160/slide_47.png` | First active slide on the English reference homepage, checked 2026-09-26; visual description only; source URL has a `.png` suffix but serves JPEG bytes |
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

## Terrace album provenance (review state)

The requested [reference album](https://www.bambukogrindys.lt/lt/galerija/item/6/) spans four pages and contains 95 images. The 58 visually identifiable terrace, deck and outdoor-walkway scenes in `data/gallery/terrace-album.ts` are the selected review subset. Facade-only frames and a repeated frame were excluded. For each listed ID, local `/images/gallery/terraces/gal-6-{id}.webp` was converted from `/uploads/it0003/gal_6_{id}m.jpg` on 2026-09-25; the registry stores the exact source URL and `reference-gallery-6-{id}` rights ID. Finnish captions describe visible scenes only. No product, customer, country or installer is attributed.

- Page 1: 587, 586, 588, 589, 593, 590, 123, 167, 168, 169, 170, 171, 173, 174, 591, 592, 595, 600, 601.
- Page 2: 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 618, 619, 631.
- Page 3: 632, 637, 638, 640, 641, 642, 643, 644, 645, 649, 650, 651, 652, 654, 655, 656, 657, 658, 659, 660.
- Page 4: 665, 666.
