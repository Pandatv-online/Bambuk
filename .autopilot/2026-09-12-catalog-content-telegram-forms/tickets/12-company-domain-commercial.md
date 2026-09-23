# 12 — Оператор, домен и единая коммерческая граница

**Требования:** R01, R02, R06, R11, R12, R13, R14, R16, R17, R18, R27i, R28i, R30i, G01, G02, G03, G04, G05
**Blocked by:** —
**Зона:** `lib/site-config.ts`, `lib/seo.ts`, `data/` (company/commercial provenance only), `data/catalog/`, `.env.example`, `docs/implementation-inputs.md`, `docs/` (операционная setup/provenance документация), `tests/site-config*`, `tests/seo*`, `tests/*commercial*`
**Волна:** 8
**Status:** ready

## Что должно заработать

Сайт использует `https://bamboopro.fi` как контролируемый public origin и
показывает Osaühing IKB с переданными реестровыми данными как оператора, не
выдавая зарегистрированный адрес за showroom. Для всех visitor-facing
commercial surfaces единым источником указан срок `Takuu 12 kuukautta` — без
остатка прежнего пяти-year текста, без выдуманных гарантийных условий. Telegram
transport остаётся готовым к server-only local configuration, но приложение,
тесты и документация не получают настоящий token/chat ID.

## Из брифа, дословно

> «название и реквизиты финской компании- Osaühing IKB (эстонская фирма, будет работать в Эстонии и в Финляндии)»

> «домен в в процессе покупки (дам имя позже)»

> «финские цены такие же как на оригинальном сайте, все в наличии и есть образцы. Можно приехать и посмотреть»

> «доставка включена в стоимость, гарантия 5 лет»

> «bamboopro.fi»

> «необходимая информация пор компанию - <https://www.teatmik.ee/ru/personlegal/10161031-Osa%C3%BChing-IKB>»

> «гарантия 12 месяцев»

## Разделы спецификации

Истории 1–10 и 17; «Оператор и provenance», «Домен и выпуск», «Каталог,
коммерческие состояния и гарантия», «Telegram delivery», «Доступность, SEO и
тесты», «Открытые места».

## Критерии приёмки

- [ ] `siteConfig` и release readiness содержат только подтверждённые данные
  Osaühing IKB: registry code `10161031`, VAT `EE100414305`, зарегистрированный
  адрес `Mere pst 2, 40231 Sillamäe linn`, телефон и часы. Для новых registry
  полей есть компактная dated provenance-запись на пользовательский Teatmik URL;
  не добавляются raw scrape, финансы или иной нерелевантный company data.
- [ ] Contact-facing presentation использует эти факты, но registered address
  не назван showroom/visit address; нет distributor/manufacturer relationship
  claim. Missing email и permission to publish a visit location по-прежнему
  остаются release blockers, а не visitor-facing bracket placeholders.
- [ ] `NEXT_PUBLIC_SITE_URL=https://bamboopro.fi` documented as name/value in
  the safe example; shared metadata returns this canonical/OG origin when
  configured and never turns localhost into a production public origin. Домен
  не снимает `review`/`noindex` или не создаёт deploy/DNS action.
- [ ] Все опубликованные commercial presenters читают единое 12-month warranty
  boundary. Публичный scan не находит прежний warranty duration; никаких
  product-specific scope/start/exclusion/procedure facts не изобретается.
- [ ] Existing exact source price/unit, all-active `inStock`, sample and
  delivery-included states остаются сохранены; offer-stage VAT, geography,
  delivery exceptions и warranty terms не становятся фактом.
- [ ] `.env.example` и setup documentation содержат только names
  `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` и public site URL. Они объясняют, что
  владелец сам добавляет **новый ротированный** token/ID в ignored `.env.local`;
  не содержат secret, chat ID, request body или curl/API call.
- [ ] Tests cover exact company/release/canonical behavior, 12-month warranty
  boundary and no-secret env example. Focused tests, typecheck and lint pass;
  broader Vitest behavior is reported faithfully without unsafe config edits.

## Ограничения

- Не редактировать forms, privacy route/content или footer policy link: это
  ticket 13. Не менять catalog routes/filters or product source snapshot unless
  a failing warranty/commercial test proves their shared data boundary needs it.
- Не делать HTTP request к Telegram и не открывать/печатать `.env.local`.
- Перед любым source edit исполнитель читает все пять обязательных docs и
  релевантную локальную документацию Next.js; при противоречии возвращает
  `BLOCKED`, не выбирая молча.
