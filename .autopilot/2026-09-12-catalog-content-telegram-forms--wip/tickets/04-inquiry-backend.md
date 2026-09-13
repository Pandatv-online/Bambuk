# 04 — Безопасная доставка заявок в Telegram

**Требования:** R18, R28i, R23, R24, R25
**Blocked by:** 01
**Зона:** `app/api/inquiries/`, `lib/inquiries/`, `tests/inquiries*`, `.env.example`
**Волна:** 2
**Status:** ready

## Что должно заработать

Контактная, коммерческая и образцовая заявки проходят одну серверную валидацию и превращаются в одно структурированное Telegram-сообщение. Без env endpoint безопасно сообщает о временной недоступности.

## Из брифа, дословно

> «обработчик формы и процесс работы с заявками лучше сделать для телграм бота»

## Критерии приёмки

- [ ] Typed schemas normalize JSON/form payloads and require phone or email
- [ ] Honeypot, start timestamp, size bounds and short runtime idempotency prevent obvious abuse/duplicates
- [ ] Telegram adapter escapes HTML, uses bounded timeout and returns typed success/failure without logging secrets or body
- [ ] Structured message includes inquiry/contact/product-project/source context for manager follow-up
- [ ] Missing env returns `temporarily_unavailable`; `.env.example` names only token/chat ID
- [ ] Tests mock all network and cover validation, success, failure, timeout and duplicate submit

