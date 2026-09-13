# 03 — Каталог, категории и фильтры

**Требования:** R19, R07, R11, R12, R13, D01
**Blocked by:** 01
**Зона:** `app/fi/tuotteet/`, `components/catalog/listing/`, `lib/catalog/query*`, `tests/catalog-query*`, `tests/catalog-routes*`
**Волна:** 2
**Status:** done

## Что должно заработать

Покупатель открывает `/fi/tuotteet`, выбирает категорию/коллекцию и фильтры, видит активные условия и листает страницы без потери состояния. На мобильном фильтры работают как доступная панель.

## Из брифа, дословно

> «нужно доделать каталог и фильтрация»

## Критерии приёмки

- [x] Catalog hub renders from shared registries and emits controlled category/collection paths; per D01 the actual nested outcomes render in ticket 05's single catch-all route
- [x] URL facets parse/canonicalize safely; invalid values are ignored; reset and zero-result states are useful
- [x] 24-item server pagination retains filters; stable default order and supported name/price sorting work
- [x] Cards show only actual images/facts, user-confirmed stock/sample state and exact source-snapshot prices
- [x] Desktop sidebar and mobile dialog are keyboard accessible with visible focus and no horizontal overflow
- [x] Query and representative rendered-route tests pass
