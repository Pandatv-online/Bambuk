# 05 — Универсальные страницы товаров

**Требования:** R20, R08, R09, R10, R11, R12, R13, R16, R17
**Blocked by:** 01, 03
**Зона:** `app/fi/tuotteet/[...segments]/`, `components/catalog/product/`, `tests/product-pages*`
**Волна:** 3
**Status:** ready

## Что должно заработать

Каждый импортированный продукт открывается по финскому data-driven URL и показывает галерею, цену, наличие, характеристики, документы и CTA без hard-coded SKU logic.

## Из брифа, дословно

> «страницы товаров»
> «характеристики, документы и изображения товаров сделать как на сайте исходнике»

## Критерии приёмки

- [ ] Controlled resolver distinguishes category/collection/product and returns notFound for unknown routes
- [ ] Template renders only populated category-specific spec groups and never borrows values
- [ ] Gallery supports thumbnail keyboard interaction and meaningful local alt text
- [ ] Price snapshot date, VAT pending wording, stock/sample/delivery/warranty guardrails match spec
- [ ] Only locally available applicable documents are downloadable; missing-document product cannot appear ready
- [ ] Quote and sample CTAs carry product context; metadata has one H1/canonical/OG/noindex and no Offer JSON-LD
- [ ] Representative category tests and full generated-route build pass

