import Image from "next/image";

import { getCatalogCategoryMedia } from "@/data/catalog";
import { getCatalogCategoryPath } from "@/lib/catalog/query";
import type { CatalogCategory } from "@/lib/catalog/types";

import styles from "./catalog-category-link.module.css";

export function CatalogCategoryCard({
  category,
  subtitle,
}: Readonly<{ category: CatalogCategory; subtitle: string }>) {
  const href = getCatalogCategoryPath(category.id);
  if (!href) return null;
  const media = getCatalogCategoryMedia(category);

  return (
    <a className={styles.card} href={href}>
      {media ? (
        <span className={styles.media}>
          <Image
            alt=""
            width={150}
            height={112}
            sizes="(max-width: 32rem) 112px, 150px"
            src={media.src}
          />
        </span>
      ) : null}
      <span className={styles.text}>
        <strong>{category.nameFi}</strong>
        <span>{subtitle}</span>
      </span>
    </a>
  );
}
