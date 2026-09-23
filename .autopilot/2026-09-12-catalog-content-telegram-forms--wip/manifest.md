# Манифест требований

Источник: `2026-09-12-brief.md` (с дополнением от 2026-09-23). Строку из этого списка может снять **только пользователь**.

| ID | Из брифа (дословно) | Статус | Основание | Где |
|---|---|---|---|---|
| R01 | «название и реквизиты финской компании- Osaühing IKB» | done | Подтверждённые registry/VAT/registered-address facts published with compact provenance | ticket 12 · 6d661cb |
| R02 | «эстонская фирма, будет работать в Эстонии и в Финляндии» | done | Contact surface explicitly identifies Estonian operator serving FI/EE without relationship claim | ticket 12 · 6d661cb |
| R03 | «ПН-ПТ 8:00-18:00» | in-ticket | Публикуются как подтверждённые часы контакта | tickets 02, 09 |
| R04 | «+358505080808» | in-ticket | Публикуется как подтверждённый финский телефон | tickets 02, 09 |
| R05 | «не нужно указывать об дистрибьюторских отношениях» | in-ticket | Публичный relationship descriptor полностью исключается | tickets 02, 09 |
| R06 | «домен в в процессе покупки (дам имя позже)» | done | Canonical config has `https://bamboopro.fi`; deployment/DNS remain outside scope | ticket 12 · 6d661cb |
| R07 | «ассортимент … сделать как на сайте исходнике» | in-ticket | Импорт LT-каталога как снапшот, без создания отсутствующих записей | tickets 01, 03 |
| R08 | «характеристики … сделать как на сайте исходнике» | in-ticket | Каждое значение хранит source URL/date и принадлежит одному продукту | tickets 01, 05 |
| R09 | «документы … сделать как на сайте исходнике» | in-ticket | Импортируются только реально обнаруженные документы и применимость | tickets 01, 05 |
| R10 | «изображения товаров сделать как на сайте исходнике» | in-ticket | Локальные изображения с rightsId/source URL | tickets 01, 05, 07 |
| R11 | «финские цены такие же как на оригинальном сайте» | done | Числа/единицы берутся из live reference snapshot, VAT scope не выдумывается | tickets 01, 03, 05, 12 · 6d661cb |
| R12 | «все в наличии» | done | Все импортированные активные позиции получают подтверждённый пользователем статус inStock | tickets 01, 03, 05, 12 · 6d661cb |
| R13 | «есть образцы» | done | Действие запроса образца доступно для импортированных товаров | tickets 01, 03, 05, 12 · 6d661cb |
| R14 | «Можно приехать и посмотреть» | done | Осмотр образцов согласуется по телефону; registered address не выдан за showroom | tickets 02, 08, 12 · 6d661cb |
| R15 | «содержание, территорию и условия монтажа» | placeholder | Страница/форма создаются, но scope, area, methods и terms остаются явно неподтверждёнными | spec § Installation placeholder |
| R16 | «доставка включена в стоимость» | done | Публикуется дословный факт с оговоркой, что применимость подтверждается в предложении | tickets 01, 05, 12 · 6d661cb |
| R17 | «гарантия 5 лет» | dropped | пользователь, 2026-09-23: «гарантия 12 месяцев» | — |
| R18 | «обработчик формы и процесс работы с заявками лучше сделать для телграм бота» | done | Telegram transport and safe local-env setup are implemented; privacy disclosure is separately tracked by G06 | tickets 04, 12 · 6d661cb |
| R19 | «нужно доделать каталог и фильтрация» | in-ticket | Каталог, URL-фильтры, empty/reset states | ticket 03 |
| R20 | «страницы товаров» | in-ticket | Data-driven template для всех импортированных типов | ticket 05 |
| R21 | «информационные страницы» | in-ticket | Полезные source-based страницы без неподтверждённых claims | ticket 06 |
| R22 | «отдельная галерея» | in-ticket | Отдельный route, фильтрация и lightbox на подтверждённых local assets | ticket 07 |
| R23 | «контакты» | in-ticket | Osaühing IKB, телефон, часы, visit-by-agreement и Telegram contact form | tickets 04, 08 |
| R24 | «запрос предложения» | in-ticket | Отдельная валидируемая Telegram-backed форма | tickets 04, 08 |
| R25 | «запрос … образца» | in-ticket | Отдельная валидируемая форма с product context | tickets 04, 08 |
| R26 | «Остальное позже когда будет информация» | deferred | По прямому указанию пользователя всё вне перечисленных страниц/функций остаётся следующим этапом | spec § Out of scope |
| R27i | *(подразумевается)* visitor-facing цены, доставка и гарантия требуют корректной VAT/объектной/географической формулировки | done | Неизвестные границы показываются явно и сохраняют review/noindex | tickets 01, 06, 09, 12 · 6d661cb |
| R28i | *(подразумевается)* Telegram-интеграция должна безопасно работать без опубликованных credentials | done | Token and chat target are documented as server-only local env; application retains explicit unconfigured state | tickets 04, 12 · 6d661cb |
| R29i | *(подразумевается)* визит «посмотреть» требует адреса или честного способа договориться | placeholder | Публикуется только «sovi käynti puhelimitse» до передачи адреса | spec § Company and contact |
| R30i | *(подразумевается)* полные реквизиты требуют Business ID/VAT, юридического/визитного адреса и email | placeholder | Registry facts can fill code/VAT/registered address; email and visit/showroom permission remain absent | spec § Company facts; release checklist |
| D01 → R19/R20 | Next.js route ownership: category, collection and product outcomes share one catch-all owner | in-ticket | Ticket 03 owns controlled path/query links; ticket 05 owns the single `[...segments]` renderer | tickets 03, 05; spec § Routes and catalog UX |
| G01 | «bamboopro.fi» | done | User-provided public domain is configured; deployment is not implied | ticket 12 · 6d661cb |
| G02 | «Use this token to access the HTTP API: [REDACTED:TELEGRAM_BOT_TOKEN]» | placeholder | The supplied secret is not usable after disclosure; owner must put a newly rotated value in ignored `.env.local` | ticket 12 safe setup · 6d661cb |
| G03 | «Id: [REDACTED:TELEGRAM_CHAT_ID]» | placeholder | Owner must supply the intended chat target locally; its value is never committed or logged | ticket 12 safe setup · 6d661cb |
| G04 | «необходимая информация пор компанию - <https://www.teatmik.ee/ru/personlegal/10161031-Osa%C3%BChing-IKB>» | done | Teatmik source is recorded as dated compact provenance; no raw scrape or unrelated company data is published | ticket 12 · 6d661cb |
| G05 | «гарантия 12 месяцев» | done | 12-month warranty replaces the earlier duration through a shared commercial boundary | ticket 12 · 6d661cb |
| G06 | «Данные клиентов хранятся 12 месяцев, нужно написать соответствующую политику конфиденциальности» | done | Finnish notice covers actual inquiry data, 12-month operator retention and Telegram recipient; legal review remains a release gate | ticket 13 |
