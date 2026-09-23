# 13 — Политика конфиденциальности и раскрытие в формах

**Требования:** R18, R23, R24, R25, R24.1, R28i, R30i, G02, G03, G06
**Blocked by:** 12
**Зона:** `app/fi/tietosuoja/`, `data/` (privacy content only), `components/forms/`, `components/navigation/site-footer.tsx`, `data/navigation.ts`, `docs/` (retention procedure only), `tests/privacy*`, `tests/inquiry-forms*`, `tests/global-navigation*`
**Волна:** 9
**Status:** ready

## Что должно заработать

У форм и footer появляется доступная ссылка на финскую `/fi/tietosuoja`.
Страница естественным финским языком описывает контролёра, реально собираемые
поля и контекст заявок, Telegram delivery when configured, права субъекта и
срок хранения 12 месяцев. Утверждение о сроке хранения подкреплено понятной
операционной процедурой для самого оператора: собственная база обращений не
создаётся, а Telegram notifications/рабочие копии удаляются вручную не позднее
срока. До independent legal review и проверки provider-transfer details release
guard остаётся закрытым.

## Из брифа, дословно

> «обработчик формы и процесс работы с заявками лучше сделать для телграм бота.»

> «контакты, запрос предложения и образца»

> «Id: [REDACTED:TELEGRAM_CHAT_ID]»

> «Данные клиентов хранятся 12 месяцев, нужно написать соответствующую политику конфиденциальности»

## Разделы спецификации

Истории 9–10, 12–16 и 17; «Telegram delivery», «Политика
конфиденциальности и жизненный цикл обращения», «Доступность, SEO и тесты»,
«Открытые места».

## Критерии приёмки

- [ ] `/fi/tietosuoja` — controlled Finnish page with unique metadata,
  canonical via shared boundary, semantic H1 `Tietosuojaseloste` and current
  review/noindex behavior. It is linked by footer and every inquiry form with
  accessible Finnish link text; route/navigation changes do not expose a raw
  reference-site URL.
- [ ] Policy copy exactly reflects the final schema and server behavior:
  controller facts from `siteConfig`; inquiry purpose; Art. 6(1)(b) pre-contract
  basis for those purposes; actual mandatory/optional fields and consequences;
  data categories; recipients including Telegram only when enabled; 12-month
  operator retention; rights and right to complain; no marketing profiling or
  automated decisions. It does not invent email, cookies, analytics, IP
  retention, a showroom, provider region or transfer safeguards.
- [ ] Policy clearly distinguishes the operator's 12-month deletion obligation
  from third-party provider retention. A concise internal retention procedure
  tells the operator when and where to delete Telegram notification/working
  copies; it does not pretend code can delete a provider's historic data or
  create a hidden persistence layer.
- [ ] Forms retain current validation, privacy-safe error/retry behavior and
  server-only transport boundary. They do not send a message during tests and
  do not display/store token/chat ID. Unconfigured transport remains honest and
  does not claim inquiry delivery.
- [ ] Tests render the policy and every form/footer link, assert 12-month copy
  and actual schema-aligned data categories, and check no secret/provider call
  is introduced. Run focused tests, typecheck and lint; report any known full
  suite environment blocker exactly.

## Ограничения

- Использовать `siteConfig`/metadata/release seam delivered by ticket 12;
  не менять его public shape without a reported interface conflict.
- Legal review, a public controller email, verified Telegram transfer details,
  deployment and a live form submission are not silently marked complete.
- Перед любым source edit исполнитель читает все пять обязательных docs и
  релевантную локальную документацию Next.js; если text would contradict actual
  form behavior or those docs, return `BLOCKED` with the mismatch.
