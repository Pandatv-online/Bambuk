# 07 — Отдельная галерея

**Требования:** R22, R10
**Blocked by:** 01
**Зона:** `app/fi/galleria/`, `data/gallery/`, `components/gallery/`, `tests/gallery*`
**Волна:** 3
**Status:** ready

## Что должно заработать

На `/fi/galleria` посетитель фильтрует проверенные локальные изображения по наблюдаемому типу сцены и открывает их в доступном lightbox без выдуманных проектов или SKU-связей.

## Из брифа, дословно

> «отдельная галерея»

## Критерии приёмки

- [ ] Gallery records contain local src, rightsId, source and neutral Finnish alt/caption
- [ ] Scene filters work and empty state is clear; no customer/project/product attribution is inferred
- [ ] Lightbox supports keyboard navigation, Escape/backdrop/close, focus trap/return and scroll lock
- [ ] Responsive grid keeps image proportions and respects reduced motion
- [ ] Metadata/noindex and interaction tests pass

