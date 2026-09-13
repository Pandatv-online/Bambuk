# 02 — Osaühing IKB в общей оболочке

**Требования:** R01, R02, R03, R04, R05, R06, R14, R29i, R30i
**Blocked by:** 01
**Зона:** `lib/site-config.ts`, `data/navigation.ts`, `components/navigation/`, `app/fi/layout.tsx`, `docs/implementation-inputs.md`, `tests/site-config*`, `tests/global-navigation*`
**Волна:** 2
**Status:** ready

## Что должно заработать

В шапке, мобильном меню и подвале отображается Osaühing IKB, телефон и часы. Можно позвонить и договориться о визите; несуществующие адрес/email/requisites не показываются, relationship wording отсутствует.

## Из брифа, дословно

> «Osaühing IKB (эстонская фирма, будет работать в Эстонии и в Финляндии)»
> «ПН-ПТ 8:00-18:00 +358505080808»
> «не нужно указывать об дистрибьюторских отношениях»

## Критерии приёмки

- [ ] Config содержит подтверждённые company/contact facts и nullable missing legal inputs
- [ ] Header/mobile/footer routes point only to implemented Finnish pages and contain no reference links
- [ ] Public copy never calls the company Finnish legal entity/distributor/authorized/official
- [ ] Visit wording requires advance phone agreement and shows no address
- [ ] Release readiness/noindex remain blocked for domain/legal/address/email/privacy/Telegram inputs, not relationship wording
- [ ] `docs/implementation-inputs.md` accurately separates supplied, pending and deferred facts
