# Общие интерфейсы сборки

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `company-config` | подтверждённые поля Osaühing IKB, public origin и release readiness | `siteConfig`, `getReleaseReadiness(config?, environment?)` | env parsing, missing-field policy и provenance storage |
| `commercial-content` | единый опубликованный срок гарантии и source-bound commercial copy | typed commercial state для cards/product/detail/CTA | место хранения и legacy text cleanup |
| `privacy-content` | финский policy text, 12-month retention и form disclosure | route-keyed content/metadata selector | copy composition и legal-review gate |
| `inquiry-schema` | реальные поля inquiry, validation и минимизация данных | typed schema/field errors | honeypot/anti-repeat normalisation |
| `inquiry-transport` | server-only Telegram delivery result | `sendInquiry(inquiry) -> result` | credentials, escaping, timeout, provider network |
| `routes-seo` | navigation, footer/form policy links и noindex metadata | route registry and `createPageMetadata` | route resolution/indexability detail |
| `catalog-data-ui` | products, filters, product pages, info and gallery | typed selectors/presenters | import evidence, rendering layout and per-SKU provenance |

Primary test seams are `siteConfig`/`getReleaseReadiness`,
`createPageMetadata`, commercial state, inquiry schema/transport and rendered
route outcomes. Tests mock any provider boundary and never hold a live secret.

## Правила проекта

- Next.js 16 App Router, React 19, strict TypeScript and Tailwind CSS 4. Use
  Node `22.22.3` from `.nvmrc`.
- Before editing application code, content, styles, configuration, routes or
  assets, read `AGENTS.md` and all five governing documents in full:
  `docs/reference-site-audit.md`, `docs/finland-site-architecture.md`,
  `docs/design-system.md`, `docs/component-inventory.md` and
  `docs/content-map.md`. Read the relevant guide under `node_modules/next/dist/docs/`
  before using a Next.js API or convention.
- Commands: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.
  Preserve the baseline Vitest isolation/pool configuration. Narrow focused
  tests are acceptable evidence when the known environment worker blocker
  recurs; never use `isolate: false` as a workaround.
- Product data remains outside JSX. Missing facts stay null/absent; provenance
  is product-specific. Reference URLs, raw extracts, Lithuanian business data
  and remote source requests never enter visitor HTML.
- Osaühing IKB is the public Estonian site operator for FI/EE customers. Do not
  claim distributor/manufacturer relationships. Confirmed facts are registry
  code `10161031`, VAT `EE100414305`, registered address `Mere pst 2, 40231
  Sillamäe linn`, phone `+358 50 508 0808`, hours `ma–pe 8.00–18.00`, domain
  `https://bamboopro.fi`, 12-month warranty, active-stock/sample status and
  delivery included subject to its existing offer guard.
- The registered address is not a showroom or visit address. Email, visit
  permission, installation scope/area/terms, warranty scope and VAT/delivery
  boundaries remain explicit placeholders.
- Telegram values are secret operational configuration. Do not ask for, print,
  store, commit, test with, or send the redacted token/chat ID. `.env.example`
  contains names only. The user puts freshly rotated values in ignored
  `.env.local`; tests mock all outbound provider traffic.
- Privacy text must accurately reflect the final form schema, state that the
  operator deletes inquiry data and operational copies after 12 months, and
  remain release-review-gated until the Telegram transfer and legal text are
  verified. Do not invent analytics, cookies, IP collection, marketing or a
  provider-region claim.
- No deploy, DNS change, live Telegram message, dependency installation or
  changes outside the assigned ticket zone. A missing dependency returns
  `BLOCKED` with the exact need. Preserve unrelated working-tree changes.

## Existing public seams retained

- `siteConfig`, `getReleaseReadiness(config?, environment?)` and exported types
  remain the only company/release boundary.
- `createPageMetadata(input, config?)` remains the metadata boundary.
- `sendInquiry(inquiry) -> Promise<InquiryDeliveryResult>` remains the only
  outbound inquiry transport boundary.
- `parseInquiryPayload(payload, options?)` and the three public form presenters
  remain the inquiry validation/UI boundary.
- Catalog route, query and selector seams stay unchanged unless an acceptance
  criterion proves a commercial-content change needs them.

## Из таска 12 — оператор, домен и коммерческая граница

- `siteConfig` сохраняет единую публичную идентичность Osaühing IKB, включая
  registry/VAT/registered-address provenance, а `getReleaseReadiness(config?,
  environment?)` удерживает нераскрытые email, visit permission, privacy review
  и live Telegram setup как blockers.
- `getMetadataBase(config?, environment?) -> URL` — единственная metadata-origin
  boundary; configured public origin is `https://bamboopro.fi`, production never
  falls back to localhost.
- `PublishedWarranty` является единым typed commercial value для 12-month
  wording; presentation does not own a second warranty duration.
- Server env names remain `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`; values
  are never part of data/config/test public interfaces.

## Из таска 13 — политика и раскрытие в формах

- `privacyNotice` и `getPrivacyNoticeByPath(path: LocalPath)` — единственный
  route-keyed source финского privacy copy, schema-aligned categories and the
  explicit 12-month operator-retention boundary.
- `footerLegalNavigation` владеет visitor-facing legal link; public forms reuse
  the same controlled `/fi/tietosuoja` route rather than hard-code a second
  policy URL.
- `sendInquiry(inquiry)` stays unchanged. Internal `TelegramTransportOptions`
  accepts optional `now?: () => number` solely to format a manual deletion
  deadline in the operator notification; no persistence/deletion API is exposed.
