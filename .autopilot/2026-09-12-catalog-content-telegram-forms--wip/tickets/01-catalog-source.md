# 01 — Каталог как проверяемые данные

**Требования:** R07, R08, R09, R10, R11, R12, R13, R16, R17, R27i
**Blocked by:** —
**Зона:** `data/catalog/`, `lib/catalog/`, `scripts/catalog/`, `public/images/products/`, `public/documents/products/`, `tests/catalog-import*`, `docs/catalog-import-report.md`
**Волна:** 1
**Status:** ready

## Что должно заработать

Текущий LT-каталог становится валидируемым локальным реестром: уникальные товары и категории, финские названия, точные source-bound характеристики/цены, локальные изображения и документы. Пропуски видны в отчёте, а не маскируются выдуманными данными.

## Из брифа, дословно

> «ассортимент, характеристики, документы и изображения товаров сделать как на сайте исходнике»
> «финские цены такие же как на оригинальном сайте, все в наличии и есть образцы»

## Критерии приёмки

- [ ] Импортирует `.firecrawl/catalog-products-2026-09-12.json`, сверяет 108 уникальных live records и объясняет расхождение с 130 URL audit-снимка
- [ ] Typed model поддерживает разные категории/specifications и provenance каждого значения
- [ ] Финские названия/labels естественны; brand/model tokens сохранены; slug не используется как источник факта
- [ ] Цена и basis совпадают со snapshot; stock/sample/delivery/warranty отражают только подтверждения пользователя с оговорками из spec
- [ ] Все использованные изображения локальны и имеют source/rights record; документы локальны либо affected record явно not-ready
- [ ] Report перечисляет source/normalized/skipped/media/document counts и причины пропусков
- [ ] Unit tests покрывают representative product types, duplicates, missing fields and invalid relations

