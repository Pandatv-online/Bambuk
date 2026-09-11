import type { Category } from "@/data";

import { ResponsiveMedia } from "../media/responsive-media";

export type CategoryCardProps = Readonly<{
  category: Category;
}>;

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="category-card">
      <a href={category.href} className="category-card__link">
        <ResponsiveMedia
          className="category-card__media"
          image={category.image}
          placeholderAlt={`${category.name}: kuva tulossa`}
          sizes="(min-width: 75rem) 36rem, (min-width: 48rem) 50vw, 100vw"
        />
        <span className="category-card__content">
          <span className="category-card__name">{category.name}</span>
          {category.status === "pendingAssortment" ? (
            <span className="category-card__status">Valikoima vahvistetaan</span>
          ) : null}
        </span>
      </a>
    </article>
  );
}

export function CategoryGrid({
  categories,
}: Readonly<{ categories: readonly Category[] }>) {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <CategoryCard category={category} key={category.id} />
      ))}
    </div>
  );
}
