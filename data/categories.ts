import type { Category } from "./types";

export const categories = [
  {
    id: "interior-floors",
    name: "Bambulattiat",
    slug: "sisalattiat",
    imageFile: "category-flooring.jpg",
    imageAlt: "Bambulattioiden tuoteryhmän materiaalikuva",
    rightsId: "reference-category-2",
  },
  {
    id: "outdoor-products",
    name: "Ulkotuotteet",
    slug: "ulkotuotteet",
    imageFile: "category-outdoor.jpg",
    imageAlt: "Ulkotuotteiden tuoteryhmän terassikuva",
    rightsId: "reference-category-21",
  },
  {
    id: "skirting-and-stairs",
    name: "Jalkalistat ja porrasosat",
    slug: "jalkalistat-ja-porrasosat",
    imageFile: "category-details.jpg",
    imageAlt: "Jalkalistojen ja porrasosien materiaalikuva",
    rightsId: "reference-category-5",
  },
  {
    id: "panels",
    name: "Bambulevyt",
    slug: "bambulevyt",
    imageFile: null,
    imageAlt: null,
    rightsId: null,
  },
  {
    id: "decor",
    name: "Bambusisustus",
    slug: "bambusisustus",
    imageFile: "category-decor.jpg",
    imageAlt: "Bambusisustuksen tuoteryhmän materiaalikuva",
    rightsId: "reference-category-7",
  },
  {
    id: "installation-products",
    name: "Lattian asennustuotteet",
    slug: "lattian-asennustuotteet",
    imageFile: "category-installation.jpg",
    imageAlt: "Lattian asennustuotteiden tuoteryhmän materiaalikuva",
    rightsId: "reference-category-6",
  },
  {
    id: "care-products",
    name: "Lattian hoitotuotteet",
    slug: "lattian-hoitotuotteet",
    imageFile: "category-care.jpg",
    imageAlt: "Lattian hoitotuotteiden tuoteryhmän materiaalikuva",
    rightsId: "reference-category-26",
  },
].map(
  (category): Category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    href: "/fi#tuoteryhmat",
    status: "pendingAssortment",
    image:
      category.imageFile && category.imageAlt && category.rightsId
        ? {
            src: `/images/home/${category.imageFile}`,
            alt: category.imageAlt,
            rightsId: category.rightsId,
          }
        : null,
  }),
);
