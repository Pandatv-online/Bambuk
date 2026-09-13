# 09 — Интеграция, SEO и итоговая проверка

**Требования:** R01–R25, R27i–R30i
**Blocked by:** 02, 03, 04, 05, 06, 07, 08
**Зона:** `app/fi/page.tsx`, `data/homepage.ts`, `data/navigation.ts`, `lib/seo.ts`, `styles/globals.css`, `tests/integration*`, `scripts/browser-qa.mjs`, `docs/implementation-inputs.md`
**Волна:** 5
**Status:** ready

## Что должно заработать

Все новые страницы связаны с главной и навигацией, имеют согласованную финскую подачу и проходят responsive/content/SEO/build QA. Сайт остаётся честно noindex до поступления launch-данных.

## Из брифа, дословно

> «нужно доделать каталог … страницы товаров; информационные страницы; отдельная галерея;контакты, запрос предложения и образца»
> «Остальное позже когда будет информация»

## Критерии приёмки

- [ ] Homepage featured products/categories/gallery/CTAs use live registries and implemented routes without new claims
- [ ] Navigation/footer/breadcrumbs share controlled routes and have no dead/reference-domain links
- [ ] Every commercial page has unique Finnish title/description/canonical/OG, one H1 and noindex; no unsupported Offer/Organization/review data
- [ ] Content scan finds no Lithuanian company details, relationship wording, bracket placeholders, remote visitor assets/links or invented facts
- [ ] Browser QA at 390/768/1200/1440 covers nav, catalog filters, product specs/gallery/lightbox and forms with no overflow/console errors
- [ ] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all pass
- [ ] Implementation input ledger and import report match the shipped state and remaining blockers
