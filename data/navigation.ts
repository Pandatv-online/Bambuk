import type { NavigationItem } from "./types";
import { catalogCategories } from "./catalog";
import { getPublishedInformationPages } from "./content";
import { getCatalogCategoryPath } from "@/lib/catalog/query";

const productNavigation: readonly NavigationItem[] = catalogCategories.flatMap(
  (category) => {
    if (category.parentId !== "0") return [];
    const href = getCatalogCategoryPath(category.id);
    return href
      ? [{ id: `product-category-${category.id}`, label: category.nameFi, href }]
      : [];
  },
);

const informationNavigation: readonly NavigationItem[] = getPublishedInformationPages().map(
  (page) => ({
    id: `information-${page.slug}`,
    label: page.title,
    href: page.path,
  }),
);

export const navigation: readonly NavigationItem[] = [
  {
    id: "products",
    label: "Tuotteet",
    href: "/fi/tuotteet",
    children: productNavigation,
  },
  { id: "installation", label: "Asennus", href: "/fi#asennus" },
  {
    id: "information",
    label: "Tietoa bambusta",
    href: "/fi/tietoa-bambusta",
    children: informationNavigation,
  },
  { id: "gallery", label: "Galleria", href: "/fi/galleria" },
  { id: "contact", label: "Yhteystiedot", href: "/fi/yhteystiedot" },
];
