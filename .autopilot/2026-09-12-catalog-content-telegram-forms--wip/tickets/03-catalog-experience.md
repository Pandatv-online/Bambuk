# 03 — Каталог, категории и фильтры

**Требования:** R19, R07, R11, R12, R13
**Blocked by:** 01
**Зона:** `app/fi/tuotteet/`, `components/catalog/listing/`, `lib/catalog/query*`, `tests/catalog-query*`, `tests/catalog-routes*`
**Волна:** 2
**Status:** ready

## Что должно заработать

Покупатель открывает `/fi/tuotteet`, выбирает категорию/коллекцию и фильтры, видит активные условия и листает страницы без потери состояния. На мобильном фильтры работают как доступная панель.

## Из брифа, дословно

> «нужно доделать каталог и фильтрация»

## Критерии приёмки

- [ ] Catalog hub and controlled category/collection routes render from shared registries
- [ ] URL facets parse/canonicalize safely; invalid values are ignored; reset and zero-result states are useful
- [ ] 24-item server pagination retains filters; stable default order and supported name/price sorting work
- [ ] Cards show only actual images/facts, user-confirmed stock/sample state and exact source-snapshot prices
- [ ] Desktop sidebar and mobile dialog are keyboard accessible with visible focus and no horizontal overflow
- [ ] Query and representative rendered-route tests pass

