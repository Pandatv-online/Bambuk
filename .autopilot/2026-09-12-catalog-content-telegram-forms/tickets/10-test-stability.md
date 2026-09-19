# 10 — Стабильность финальной QA

**Требования:** R01–R25, R27i–R30i
**Blocked by:** 09
**Зона:** `tests/catalog-import.test.ts`, `tests/inquiry-forms-interactions.test.tsx`, `tests/integration-routes-seo.test.tsx`, `tests/gallery-interactions.test.tsx`, `tests/product-pages-gallery.test.tsx`
**Волна:** 6
**Status:** ready

## Причина

После приёмки чистый `npm test` завис/превысил timeout: одна каталожная, четыре form/integration/gallery/product interaction assertions. Ранее набор зеленил на 87 tests, поэтому нужна детерминированная QA-диагностика, а не снятие assertions.

## Критерии приёмки

- [ ] Выявлена и названа причина: environment/process contention, test-harness defect или application regression.
- [ ] Если причина в зоне тестов, assertion усилен/стабилизирован без сужения проверяемого поведения.
- [ ] Если причина в app code или external environment, настоящий таск возвращает `BLOCKED` с точным путём; чужой код не меняется.
- [ ] Exact focused set and full `npm test` complete with actual exit status.
