# 08 — Контакты, предложение и образец

**Требования:** R14, R18, R23, R24, R25, R29i, R30i
**Blocked by:** 02, 04, 05
**Зона:** `app/fi/yhteystiedot/`, `app/fi/pyyda-tarjous/`, `app/fi/tilaa-mallipala/`, `components/forms/`, `tests/inquiry-forms*`
**Волна:** 4
**Status:** ready

## Что должно заработать

Посетитель может позвонить, отправить контактный запрос, запросить предложение или образец. Формы сохраняют введённое при ошибке, показывают понятный результат и безопасный телефонный fallback.

## Из брифа, дословно

> «контакты, запрос предложения и образца»
> «Можно приехать и посмотреть»

## Критерии приёмки

- [ ] Three routes reuse form fields/states and add only type-specific inputs from spec
- [ ] Quote accepts product context and installation interest; sample accepts product and delivery/agreed-visit preference
- [ ] Server field errors, error summary/focus, pending/double-submit, success and unavailable states are accessible and natural Finnish
- [ ] Unconfigured Telegram never claims success and exposes phone fallback
- [ ] Contact page shows only Osaühing IKB, phone, hours and visit-by-phone wording; no fabricated address/email
- [ ] Temporary data-use acknowledgement is honest and release readiness remains blocked without approved privacy notice

