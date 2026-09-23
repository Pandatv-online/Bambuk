# 11 — Переиспользование worker'ов Vitest

**Требования:** R01–R25, R27i–R30i
**Blocked by:** 10
**Зона:** `vitest.config.ts`, `tests/catalog-import.test.ts`, `tests/inquiry-forms-interactions.test.tsx`, `tests/integration-routes-seo.test.tsx`, `tests/gallery-interactions.test.tsx`, `tests/product-pages-gallery.test.tsx`
**Волна:** 7
**Status:** blocked

## Причина

В чистом последовательном run пяти файлов из ticket 10 Vitest создал четыре изолированных worker'а; запуск каждого занял около 13,46 с. Из-за этого один worker превысил внутренний timeout до старта `inquiry-forms-interactions`, а 15-секундный таймаут gallery сработал во время cold environment. Тот же gallery-файл с `--no-isolate` проходит 3/3 за 28,38 с без изменения assertions или UI.

## Критерии приёмки

- [ ] Конфигурация Vitest переиспользует worker между test files, сохраняя изоляцию DOM между test cases через существующий cleanup.
- [ ] Ticket 10 focused set завершает работу с фактическим exit 0 без увеличения test timeout и без отключения assertions.
- [ ] Полный `npm test` завершает работу с фактическим exit 0; если это невозможно вне кода проекта, тикет фиксирует точный внешний блокер.
- [ ] Изменение не затрагивает runtime-код сайта, публичные данные и release guards.

## Итог

`isolate: false` ускорял suite, но нарушал независимость module/DOM state и был откатан.
Документированный безопасный кандидат `pool: "vmThreads"` с `fileParallelism: false`
сохраняет fresh VM context на файл, однако focused-набор завершился 23/26: три
существующих interaction tests превысили 15 секунд из-за worker/transform starvation.
Таймауты и assertions менять запрещено, поэтому `vitest.config.ts` полностью возвращён
к baseline, а тикет остаётся blocked внешней производительностью QA-среды.
