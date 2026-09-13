# Спецификация: каталог, контент и Telegram-заявки Bambuk Finland

## Задача

Посетитель финского сайта пока видит только ознакомительную главную страницу: фактического ассортимента, фильтрации, карточек товаров, полезных информационных страниц и рабочих обращений нет. Osaühing IKB уже подтвердил обслуживание клиентов в Финляндии и Эстонии, телефон, часы, наличие товаров и образцов, привязку цен к исходному сайту, включённую доставку и пятилетнюю гарантию, но часть юридических и операционных границ ещё не передана.

## Решение

Сайт получает полный data-driven каталог из текущей LT-ветки исходного сайта, естественные финские названия, локальные изображения, source-bound характеристики и цены-снапшоты. Посетитель сможет фильтровать каталог, открыть подробную страницу товара, посмотреть отдельную галерею и полезные source-based материалы, связаться с Osaühing IKB, запросить предложение или образец. Формы отправляются сервером в Telegram при настроенных env и честно сообщают о временной недоступности без credentials. Весь сайт остаётся review/noindex до домена, полных реквизитов и юридических текстов.

## Пользовательские истории

| # | Метка | История | Приёмка |
|---|---|---|---|
| 1 | R01 | Как посетитель, я вижу Osaühing IKB как компанию сайта | Название одинаково в header/footer/contact/forms metadata; отсутствующие IDs не подменены |
| 2 | R02 | Как клиент из Финляндии или Эстонии, я понимаю обслуживаемые рынки | Нейтральная финская формулировка на contact/about surfaces без утверждения о финском юрлице |
| 3 | R03 | Как клиент, я вижу часы связи | `ma–pe 8.00–18.00` отображается единообразно |
| 4 | R04 | Как клиент, я могу позвонить | Телефон отображён и имеет корректный `tel:` link |
| 5 | R05 | Как владелец, я не публикую формулировку о дистрибьюторских отношениях | Ни UI, ни metadata/JSON-LD не содержат такого утверждения |
| 6 | R06 | Как владелец, я могу позже добавить домен без переписывания routes | Origin берётся из env; до него страницы noindex и localhost не попадает в публичный sitemap |
| 7 | R07 | Как покупатель, я просматриваю фактический ассортимент исходного каталога | Все обнаруженные текущие LT product IDs представлены один раз; отчёт сверяет количество и пропуски |
| 8 | R07.1 | Как покупатель, я вижу честное пустое/ошибочное состояние импорта | Неполная запись не превращается в товар; ingest report перечисляет skipped/invalid records |
| 9 | R08 | Как покупатель, я вижу характеристики именно выбранного товара | Specs — ordered typed label/value/unit с source URL/date; значения не переносятся между SKU |
| 10 | R09 | Как покупатель, я открываю реальные документы товара | Каждый обнаруженный публичный документ сохранён локально с названием/source/applicability; нескачанный документ блокирует готовность затронутой записи и виден в ingest report |
| 11 | R10 | Как покупатель, я вижу исходные изображения без внешних visitor-запросов | Assets сохранены локально, имеют alt/rightsId/source metadata и fallback |
| 12 | R11 | Как покупатель, я вижу ту же числовую цену и единицу, что на исходном сайте | Amount/currency/basis совпадают со снапшотом 2026-09-12; VAT не выдумывается; дата источника видима |
| 13 | R11.1 | Как покупатель, я не принимаю устаревшую цену за окончательную | Цена помечена датой проверки и подтверждается письменным предложением до заказа |
| 14 | R12 | Как покупатель, я вижу товары в наличии | Активные импортированные товары показывают `Varastossa` без выдуманного количества |
| 15 | R13 | Как покупатель, я могу запросить образец любого товара | CTA несёт product ID/name в sample form; отдельная sample-product запись не нужна |
| 16 | R14 | Как посетитель, я могу договориться посмотреть образцы | Contact copy предлагает согласовать визит по телефону; адрес не показывается до подтверждения |
| 17 | R15 | Как клиент монтажа, я не получаю выдуманных условий | Существующий teaser ведёт к installation-interest quote state; scope/area/methods/terms явно pending |
| 18 | R16 | Как покупатель, я вижу, что доставка включена в стоимость | Факт показан рядом с commercial summary; применимость подтверждается в предложении |
| 19 | R17 | Как покупатель, я вижу срок гарантии пять лет | Срок видим; объект, начало, исключения и процедура помечены как уточняемые до договора |
| 20 | R18 | Как менеджер, я получаю валидные заявки в Telegram | Server adapter отправляет нормализованный текст только при configured token/chat ID |
| 21 | R18.1 | Как посетитель, я получаю ясный результат отправки | Loading/success/field/server/unconfigured states доступны; double submit блокируется; значения сохраняются при ошибке |
| 22 | R18.2 | Как владелец, я не раскрываю Telegram credentials | Env server-only, значения не попадают в bundle/logs/errors; `.env.example` содержит только имена |
| 23 | R19 | Как покупатель, я просматриваю каталог по категориям и коллекциям | Hub + category pages используют единый tree и breadcrumbs |
| 24 | R19.1 | Как покупатель, я фильтрую товары | URL query поддерживает category/collection/color/surface/finish/availability и сброс; недоступные facets не показываются |
| 25 | R19.2 | Как пользователь мобильного устройства, я управляю фильтрами отдельно от списка | Доступный filters drawer/sheet, применённые значения и reset; desktop sidebar не просто сжат |
| 26 | R19.3 | Как покупатель, я не попадаю в пустой тупик | Zero results объясняет состояние и предлагает сброс/контакт |
| 27 | R20 | Как покупатель, я открываю стабильную финскую страницу товара | Route строится из typed record, имеет breadcrumbs, gallery, identity, price, availability, facts, specs, docs и CTAs |
| 28 | R20.1 | Как пользователь клавиатуры, я управляю product gallery | Thumbnails/lightbox имеют focus, Escape, return-focus и reduced-motion behavior |
| 29 | R20.2 | Как владелец, я добавляю/удаляю товар без JSX-правок | Route generation/selectors читают data records; UI не знает конкретные товары |
| 30 | R21 | Как покупатель, я читаю полезные сведения для выбора | Hub и consolidated pages сохраняют только source-supported manufacturing, construction, surfaces, installation/care and FAQ material |
| 31 | R21.1 | Как покупатель, я различаю сведения производителя и правила продавца | Source notes не превращаются в claims Osaühing IKB; противоречивые/непроверенные числа исключены |
| 32 | R22 | Как посетитель, я открываю отдельную галерею | `/fi/galleria` показывает local rights-recorded imagery с фильтрами и keyboard lightbox |
| 33 | R23 | Как клиент, я нахожу Osaühing IKB, телефон и часы | `/fi/yhteystiedot` содержит только подтверждённые контакты и честные missing fields |
| 34 | R24 | Как клиент, я запрашиваю предложение | `/fi/pyyda-tarjous` валидирует contact/project/product/installation context и отправляет через общий transport |
| 35 | R25 | Как клиент, я запрашиваю образец | `/fi/tilaa-mallipala` валидирует product/contact/visit-or-delivery context без выдуманных sample fees/terms |
| 36 | R24.1 | Как посетитель с ошибкой формы, я не теряю введённое | Field errors привязаны к labels; server failure сохраняет values и допускает безопасный retry |
| 37 | R27i | Как покупатель, я отличаю подтверждённое от уточняемого | VAT, warranty scope, delivery geography, return/legal terms явно не заявляются без данных |
| 38 | R28i | Как владелец, я могу подключить Telegram конфигурацией | Достаточно server env; UI/forms не меняются при подключении |
| 39 | R29i | Как посетитель, я не еду по выдуманному адресу | Visit action — только звонок/форма для согласования |
| 40 | R30i | Как владелец, я не выпускаю сайт без реквизитов | Readiness перечисляет Business ID/VAT/address/email/legal/domain и удерживает noindex |

## Компания и контакт

- Публичное имя: `Osaühing IKB`.
- Роль: эстонская компания, обслуживающая клиентов в Финляндии и Эстонии. Слова `virallinen`, `valtuutettu`, `jakelija`, `jälleenmyyjä` и аналогичные relationship claims не публикуются.
- Телефон: `+358 50 508 0808`; часы: `ma–pe 8.00–18.00` по локальному времени сайта.
- Посещение возможно только как `Sovi käynti etukäteen puhelimitse`; местоположение не называется.
- Business ID, VAT ID, юридический/визитный адрес и email остаются null и видны в release checklist, не в качестве bracket-плейсхолдеров посетителю.

## Источник каталога и импорт

- Канонический research source: текущая LT-ветка `https://www.bambukogrindys.lt/lt/katalogas`, extracted 2026-09-12.
- Полнота определяется множеством уникальных `/lt/katalogas/product/{id}/...` из live map/crawl; ожидаемое audit-значение — 130, но ingest report записывает фактический current count.
- Raw extraction хранится как внутреннее evidence; visitor не получает reference URL/link/network request.
- Normalizer принимает только фактически обнаруженные поля. Missing остаётся null/empty, URL slug не становится характеристикой.
- Финское имя — профессиональный перевод наблюдаемого имени. Официальные brand/model/collection tokens сохраняются; `bambuparketti` используется только при подтверждённой конструкции.
- Каждая record содержит `source: { url, sourceId, extractedAt, locale }`, а media/document/spec — собственную provenance/applicability связь.
- Import validator отклоняет duplicate IDs/slugs, invalid prices/units, remote visitor media and orphan category relations и пишет машинно-читаемый report.

## Product model

```text
Product = {
  id, status, slugFi, sku?, nameFi, nameSource, summaryFi?, descriptionFi?,
  categoryId, collectionId?, brand?,
  attributes: { color?, surface?, finish?, dimensions?, package?, installation? },
  specifications: { key, labelFi, sourceLabel, value, unit?, source }[],
  pricing: { status: published, amount, currency: EUR, basis, vatDisplay: null|sourceText,
             sourceUrl, extractedAt },
  availability: { status: inStock, confirmedBy: user, confirmedAt: 2026-09-12 },
  delivery: { included: true, applicability: pendingOfferConfirmation },
  warranty: { durationYears: 5, scope: pendingContract },
  sample: { available: true },
  images: { src, altFi, order, rightsId, sourceUrl }[],
  documents: { id, titleFi, sourceTitle, file?, sourceUrl, applicability }[],
  relatedProductIds: string[],
  source: { url, sourceId, extractedAt, locale: lt }
}
```

Product type remains flexible: floors, decking, skirting/stairs, panels, décor, installation accessories, adhesives and care products share the template but render only populated specification groups.

## Pricing, stock, delivery, samples and warranty

- Price amount and basis mirror the reference snapshot exactly and show `Tarkistettu 12.9.2026`.
- No automatic currency/VAT conversion. Missing VAT wording renders `ALV-käsittely vahvistetaan tarjouksessa`, not an invented percentage.
- `Varastossa` is user-confirmed for every imported active product; no quantity or lead time is shown.
- `Näyte saatavilla` and `Pyydä näyte` appear for every product.
- `Toimitus sisältyy hintaan` is shown with `Toimitusalue ja soveltaminen vahvistetaan tarjouksessa`.
- `Takuu 5 vuotta` is shown with `Takuun kohde ja ehdot vahvistetaan kirjallisessa tarjouksessa`.
- The site remains noindex/review while VAT basis, terms and company/legal data are unresolved.

## Routes and catalog UX

- `/fi/tuotteet` — catalog hub, category overview, filter summary and paginated product grid.
- `/fi/tuotteet/[...segments]` — category/collection or product resolution through controlled registries; canonical slugs come from data, never from raw LT slugs.
- Filter query: `kategoria`, `mallisto`, `vari`, `pinta`, `viimeistely`, `saatavuus`, `sivu`. Multiple values within a facet use repeated params; invalid values are ignored and canonicalized.
- Desktop uses a restrained sidebar; mobile uses a modal filters panel. Sorting defaults to controlled catalog order; only name and price sorts are exposed when data supports them.
- Pagination is server-rendered, 24 products/page, crawl-safe; filtered query pages remain noindex until final SEO policy.
- Product pages include gallery, identity, current source timestamp, commercial summary, key facts, flexible specs, documents, description and quote/sample CTAs. No calculator without exact package coverage.

## Information pages

Build one hub and useful consolidated routes rather than 555 thin copies:

- `/fi/tietoa-bambusta` — hub.
- `/fi/tietoa-bambusta/valmistus` — source-based manufacturing process.
- `/fi/tietoa-bambusta/rakenne-varit-ja-pinnat` — construction, patterns, edges, colors and finishes.
- `/fi/tietoa-bambusta/asennus-ja-hoito` — general source-based installation/care material with product-specific cautions and unresolved-number omissions.
- `/fi/tietoa-bambusta/lattialammitys` — only statements whose exact source/applicability is retained; conflicting 26/27 °C limits are not published.
- `/fi/tietoa-bambusta/ukk` — reviewed Finnish FAQ topics/answers, omitting unsupported environmental/certification claims and unresolved numbers.

Each page has one H1, source-aware sections, related products/categories where explicit, metadata through the shared boundary, and no SEO filler.

## Gallery

- `/fi/galleria` reuses registered local homepage imagery and may add locally downloaded reference assets only with `rightsId`/source record.
- Filters describe observable scene type only (`sisätila`, `terassi`, `materiaali`, `yksityiskohta`); no product/project/customer relation is inferred.
- Accessible lightbox traps/returns focus, closes by Escape/backdrop/button, exposes alt/caption, prevents background scroll and respects reduced motion.

## Forms and Telegram transport

- Routes: `/fi/yhteystiedot`, `/fi/pyyda-tarjous`, `/fi/tilaa-mallipala`.
- Shared server-validatable schemas and components; forms work without client-only validation.
- Common fields: name, phone, email, preferred contact, message, hidden honeypot, form-start timestamp, source URL. At least phone or email is required.
- Quote adds inquiry type, product IDs, approximate area/quantity, municipality/postcode, timing and installation interest.
- Sample adds product ID and fulfillment preference (`toimitus` or `sovittu käynti`); address is not requested until sample/delivery policy and privacy text are approved.
- API: `POST /api/inquiries`; JSON and form payloads normalize into a typed `Inquiry`.
- Transport interface: `sendInquiry(inquiry) -> { ok, referenceId? }`. Telegram implementation uses server-only `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`, HTML-escaped text, bounded timeout and no credential/body logging.
- Operational flow in this increment is deliberately one-way: one valid form submission becomes one structured Telegram message containing inquiry type, contact preference, product/project context and source URL; the responsible manager contacts the customer using the submitted phone/email. The bot does not invent customer replies, assignment, status or closure workflows.
- If env is absent, API returns a typed `temporarily_unavailable` response and UI keeps values, shows phone fallback, and never claims success.
- Server validation errors map to fields. Duplicate clicks are blocked client-side; a short idempotency key prevents immediate repeats per runtime where possible.
- No attachments, persistence, in-bot status/assignment workflow, analytics, marketing consent or promised response time in this run.
- A temporary plain-language data-use acknowledgement is displayed; absent approved privacy notice keeps production readiness false.

## SEO and release state

- All actual pages have Finnish title/description/canonical/OG and semantic headings.
- All routes remain `noindex, nofollow` until final domain, company IDs/address/email, privacy/legal text, VAT/terms scope and Telegram configuration are supplied/reviewed.
- No Organization/LocalBusiness JSON-LD until legal identifiers/address are confirmed. Product JSON-LD may describe factual product fields but omits `Offer` while VAT/legal scope is unresolved.
- Sitemap/robots and indexable filter policy remain deferred by R26.
- No reference-domain URL appears in visitor HTML; source URLs remain internal data/provenance only.

## Responsive and accessibility behavior

- Reuse the established warm/cream, condensed, photography-led system and shared shell.
- Catalog: 1 column phone, 2 tablet, 3 desktop; sidebar becomes mobile sheet; active filters remain visible.
- Product detail: stacked gallery/data on phone, split layout desktop; specification rows wrap labels/values without horizontal scroll.
- Forms use persistent labels, autocomplete, error summary and focus-to-first-error; controls remain at least 44 px.
- Gallery/lightbox and filter/modal interactions satisfy keyboard focus/return/Escape/backdrop/scroll-lock requirements.

## Границы и швы

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `company-config` | Osaühing IKB facts, nullable legal fields, release readiness | `siteConfig`, `getReleaseReadiness()` | env/defaults and missing-field policy |
| `catalog-source` | raw reference extraction and normalization | `importReferenceCatalog(raw) -> ImportResult` | source parsing, translation mapping and rejection report |
| `catalog-data` | categories, collections, products and provenance | typed registries and selectors | storage layout and raw source records |
| `catalog-query` | URL facets, sorting and pagination | `parseCatalogQuery()`, `queryProducts()` | normalization and facet counting |
| `catalog-ui` | catalog/category/product presentation | CatalogShell, filters, cards, grids, product-detail presenters | responsive composition |
| `content-data` | Finnish information-page and FAQ records | route-keyed published content selectors | source translation/provenance files |
| `gallery-data-ui` | rights-recorded media and scene filters | gallery selectors and accessible lightbox | focus/scroll/modal state |
| `inquiry-schema` | contact/quote/sample normalization and validation | typed schemas and field errors | coercion, honeypot and anti-repeat fields |
| `inquiry-transport` | outbound Telegram delivery | `sendInquiry(inquiry)` | Telegram API, timeout, escaping and credentials |
| `inquiry-ui` | forms and status states | reusable form variants | client submission state |
| `routes-seo` | route registry, metadata and noindex policy | navigation/breadcrumbs/canonical metadata | route resolution and release gating |

Primary test seams: `importReferenceCatalog`, `queryProducts`, product/content selectors, `getReleaseReadiness`, inquiry schemas/transport adapter and rendered route outcomes. Tests mock outbound Telegram; they never send a real message.

## Проверка

- Import completeness report reconciles unique source product IDs, normalized records, skipped records, local images and document mappings.
- Representative fixtures cover interior floor, decking, trim/stair, panel, décor, installation product and care product without sharing facts.
- Catalog filters/query/pagination are unit-tested and browser-tested on phone/tablet/desktop.
- Every generated product/category/info/gallery/contact/form route builds and has one H1, canonical/OG/noindex and valid links.
- Forms test field errors, phone-or-email rule, honeypot, double submit, missing env, Telegram success/failure/timeout with mocked network.
- Content scan rejects Lithuanian business details, relationship wording, bracket placeholders, visitor reference links, unsupported certifications/environmental claims and invented installation facts.
- Browser QA checks navigation, filters, product gallery/spec table, lightbox and all form states at 390, 768, 1200 and 1440 px with zero overflow/console errors.
- `npm test`, `npm run typecheck`, `npm run lint` and `npm run build` pass after each major ticket and finally.

## Вне рамок

| Требование | Почему не сейчас |
|---|---|
| R26 — «Остальное позже когда будет информация» | Отдельная installation page с operational scope, search, About, sitemap/robots, legal pages, analytics, checkout, account, cart, multilingual routes and performance launch audit ждут данных/следующих этапов |

## Открытые места

- R06: final public domain; `NEXT_PUBLIC_SITE_URL` remains empty and release is noindex.
- R15: installation content, methods, inclusions/exclusions, service area and terms; only inquiry interest/pending state is allowed.
- R29i: visit/showroom address; visitor is directed to agree by phone.
- R30i: Business ID, VAT ID, legal/visiting address, email, privacy/legal text.
- Telegram credentials: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` remain empty env names; integration is testable with mocked transport only.
- Warranty scope/terms, delivery geography/exceptions and VAT treatment remain explicit offer-stage confirmations, not invented policy.

## Покрытие манифеста

| Требование | Раздел спецификации |
|---|---|
| R01–R05 | Компания и контакт; истории 1–5 |
| R06 | SEO and release state; Открытые места |
| R07–R10 | Источник каталога и импорт; Product model; истории 7–11 |
| R11–R17 | Pricing, stock, delivery, samples and warranty; истории 12–19 |
| R18 | Forms and Telegram transport; истории 20–22 |
| R19 | Routes and catalog UX; истории 23–26 |
| R20 | Product model; Routes and catalog UX; истории 27–29 |
| R21 | Information pages; истории 30–31 |
| R22 | Gallery; история 32 |
| R23–R25 | Company and contact; Forms and Telegram transport; истории 33–36 |
| R26 | Вне рамок |
| R27i–R30i | Commercial guardrails; SEO/release; Открытые места; истории 37–40 |
