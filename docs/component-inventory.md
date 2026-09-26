# Component inventory

Status: architecture specification derived from the reference site. Component names are proposed for the future Next.js implementation; no application code exists yet.

## 1. Global shell

| Component | Reference behavior | Finnish adaptation / data needs |
|---|---|---|
| `SiteHeader` | Fixed translucent desktop header; warm inner-page state | Manufacturer/distributor relationship, primary quote CTA, no account/cart until enabled |
| `BrandLockup` | Single logo | BAMBU mark without operator name in the header; footer and contact identify the site operator separately; use distributor relationship wording only when approved |
| `DesktopNavigation` | Three-level hover dropdowns | Data-driven accessible disclosure menus, current-page state |
| `MobileHeader` | 60 px logo, cart/settings/menu icons | Menu + locale + quote/contact; commerce icon feature-gated |
| `MobileNavigationDrawer` | Near-full-screen drawer, dim backdrop, expanded hierarchy, embedded search | Collapsible nested groups, focus trap, escape/overlay close |
| `LocaleSwitcher` | LT/EN/RU | FI primary; EN/SV only after human-reviewed content exists |
| `CurrencySwitcher` | EUR/USD/RUB/GBP | Omit for Finnish launch; EUR is implicit |
| `SearchTrigger` / `SearchForm` | Header query/autocomplete | Finnish full-site search grouped by content type |
| `Breadcrumbs` | Visible desktop, hidden in smaller layouts | Keep visible or compact on mobile for hierarchy and SEO |
| `CookieNotice` | Bottom-left notice | Finnish consent implementation tied to actual analytics/vendors |
| `SiteFooter` | Dense category/info columns, newsletter, social, awards | Data-driven approved routes, Finnish legal/company/contact, manufacturer attribution |

## 2. Homepage and editorial components

| Component | Reference behavior | Finnish adaptation |
|---|---|---|
| `HeroSlider` | Full-bleed photographic slider below header | Retain imagery scale; first slide states Finnish distributor and quote CTA; static hero acceptable for performance |
| `SectionHeading` | Condensed light uppercase editorial heading | Preserve style; natural Finnish line breaks |
| `IntroSection` | About-bamboo copy | Manufacturer-approved facts and link to bamboo information hub |
| `CategoryCard` | Large image, translucent title band | Same image treatment; routes from category data |
| `CategoryGrid` | Seven cards, two-column/staggered desktop | Same rhythm; order reflects Finnish journey |
| `GalleryTile` / `GalleryMosaic` | Four-column image grid/lightbox | Approved manufacturer images + Finland project metadata and filters |
| `BenefitSection` | Long benefits copy | Claims registry controls what can render |
| `FeaturedProductSection` | Four “special offer” products | Curated/featured products; never imply a discount without real offer data |
| `GuideCard` / `GuideGrid` | Three-column news cards | Installation and technical guides first; news optional |
| `CallToActionBand` | Green-linked action blocks | `Pyydä tarjous`, `Tilaa mallipala`, `Kysy asennuksesta` |

## 3. Catalog components

| Component | Responsibilities | Data source |
|---|---|---|
| `CatalogSidebar` | Category tree, collections, optional brands/lines | Category/collection registry |
| `CatalogMobileFilters` | Drawer/sheet for filters | Facet configuration |
| `CategoryHero` | Title, description, image, breadcrumb | Category content |
| `ChildCategoryGrid` | Parent-hub cards | Category relations |
| `ProductGrid` | Responsive product listing and empty state | Product query/filter result |
| `ProductCard` | Image, name, collection/category, selected facts, price/availability only if confirmed, CTAs | Product record |
| `ProductBadge` | New/featured/offer/state | Explicit controlled merchandising value; no inferred badges |
| `FilterGroup` | Category, collection, color, surface, finish, dimensions, installation | Product facets with normalized values |
| `SortControl` | Relevance/name/price if price exists | URL query state |
| `Pagination` | Crawlable listing navigation | Query/page data |
| `CatalogEmptyState` | Clear reset/contact path | Static Finnish copy |
| `RelatedProducts` | Compatible/related items | Explicit product relations, never name matching alone |

## 4. Product-detail components

| Component | Responsibilities |
|---|---|
| `ProductGallery` | Main media, thumbnails, zoom/lightbox, alt text, focal crops |
| `ProductIdentity` | Product name, SKU, manufacturer/brand, category, collection |
| `ProductPriceBlock` | Optional amount/unit/VAT note/status; quote-only fallback |
| `AvailabilityBlock` | Optional confirmed stock or lead time with timestamp/source |
| `ProductKeyFacts` | Color, surface, finish, dimensions, package and installation method |
| `SpecificationTable` | Ordered flexible label/value/unit rows; category-specific data |
| `ProductDescription` | Reviewed Finnish rich text with semantic headings |
| `DocumentDownloads` | Technical data sheets, declarations, instructions, version/language/file type |
| `FloorAreaCalculator` | Optional pack and waste calculation based only on exact pack coverage and declared defaults |
| `SampleRequestAction` | Link product/sample relationship into sample form |
| `QuoteAction` | Prepopulate product and quantity in quotation form |
| `InstallationAction` | Prepopulate product/category in installation inquiry |
| `ProductTabs` | Description, technical data, installation, care, documents; unique labels |
| `RelatedAccessories` | Explicit compatible installation/care products |
| `ProductStructuredData` | Valid Product JSON-LD without fake offers/reviews |
| `MobileProductActionBar` | Sticky quote/sample/contact actions; checkout only if enabled |

## 5. Installation-service components

| Component | Responsibilities |
|---|---|
| `ServiceHero` | Finnish professional-installation proposition and quote CTA |
| `InstallationTypeCards` | Interior floors and terraces; only supported services |
| `ProcessSteps` | Inquiry → survey/assessment → offer → preparation → installation → handover; labels must be operationally confirmed |
| `PreparationChecklist` | Manufacturer/installer-approved substrate/site/customer prerequisites |
| `MethodSection` | Supported floating/glued/other methods tied to applicable products |
| `IncludedNotIncluded` | Explicit scope placeholders until Finnish operations confirm |
| `ServiceArea` | Confirmed municipalities/regions or case-by-case statement |
| `PricingPolicy` | Actual rate/starting price or “Pyydä tarjous”; never inherit Lithuanian prices |
| `InstallationQuoteForm` | Project type, product interest, area, address/postcode, timing, substrate, message, files/photos, contact and privacy |

## 6. Information, gallery, and FAQ

| Component | Responsibilities |
|---|---|
| `InformationHub` | Cards/sections for benefits, manufacturing, technical data, heating, installation, care, FAQ |
| `RichContent` | Safe semantic manufacturer content, figures, tables, cautions, sources |
| `TechnicalCallout` | Important limitation/warning with source/version |
| `ClaimFootnote` | Optional claim source and applicability |
| `FAQAccordion` | Reviewed questions/answers, keyboard accessible, URL anchors |
| `DocumentCard` | File name, version/date, language, type, size |
| `GalleryFilters` | Interior/terrace/product/collection/project filters |
| `GalleryLightbox` | Accessible modal, caption, project/product links |
| `ProjectCard` | Image, location at appropriate granularity, product/collection, photographer/rights |

## 7. Conversion and form components

| Component | Responsibilities |
|---|---|
| `QuoteForm` | Customer/contact, project, products, area, installation interest, timing, message, attachments, privacy |
| `SampleRequestForm` | Product/sample IDs, address/contact, delivery note and consent; commercial rules externally configured |
| `ContactForm` | Minimal contact details, subject, message and privacy notice |
| `FormField` | Label, help, error, autocomplete, required state |
| `FileUpload` | Validated image/PDF types, limits, privacy warning |
| `FormStatus` | Pending, success, validation/server error; preserves entered data |
| `AntiSpam` | Honeypot/rate limit/provider abstraction; do not expose unnecessary CAPTCHA by default |
| `ContactDetails` | Finnish legal name, business ID, VAT, address, phone, email, hours |
| `MapEmbed` | Consent/performance-aware map or plain map link |

Forms must work without client-only validation, include accessible errors and clear data handling, and send only to a confirmed Finnish endpoint. No destination is invented in architecture.

## 8. Search, commerce, and utilities

| Component | Launch status | Notes |
|---|---|---|
| `SearchResults` | Include | Group products, categories, guides, FAQ, and projects |
| `SearchAutocomplete` | Include if index quality permits | Keyboard-operable; no query leakage to third parties without disclosure |
| `CartDrawer`, `CartPage` | Deferred | Reference-equivalent behavior only after commercial scope approval |
| `CheckoutSteps` | Deferred | Requires Finnish delivery, payment, tax, return, and legal inputs |
| `AccountForms` | Deferred | No user accounts without a real customer need |
| `NewsletterForm` | Optional | Requires consent copy, provider, double-opt-in decision, and privacy documentation |

## 9. SEO and system components

- `SeoMetadata`: title, description, canonical, Open Graph, robots directives.
- `OrganizationStructuredData`: Finnish distributor identity only.
- `BrandReference`: names the manufacturer/brand without merging organizations.
- `BreadcrumbStructuredData`: hierarchy matching visible breadcrumbs.
- `FAQStructuredData`: only visible, reviewed FAQ content and only where search-engine policy permits.
- `ServiceStructuredData`: Finnish installation service and confirmed area.
- `ProductStructuredData`: exact product facts; Offer only with real Finnish price/availability.
- `SitemapGenerator`: published canonical pages only.
- `RobotsFile`: index control for search, form success, preview, and future account/cart routes.
- `AnalyticsConsent`: vendor-neutral consent state; no tracker until configured.
- `ErrorBoundary`, `NotFoundPage`, `LoadingState`: brand-consistent system states.

## 10. Component governance

- Navigation, footer, breadcrumbs, sitemap, and internal search share the same route/category registries.
- Components never embed product facts, prices, claims, company details, or service scope in JSX.
- Optional fields disappear cleanly; absence renders an inquiry CTA, not fabricated fallback text.
- All interactive components meet keyboard, focus, label, error, and reduced-motion requirements.
- Component variants are explicit and small; do not create a one-off component for each product category.
