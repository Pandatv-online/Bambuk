import type { Category } from "./types";

export const categories = [
  { id: "interior-floors", name: "Bambulattiat", slug: "sisalattiat" },
  { id: "outdoor-products", name: "Ulkotuotteet", slug: "ulkotuotteet" },
  {
    id: "skirting-and-stairs",
    name: "Jalkalistat ja porrasosat",
    slug: "jalkalistat-ja-porrasosat",
  },
  { id: "panels", name: "Bambulevyt", slug: "bambulevyt" },
  { id: "decor", name: "Bambusisustus", slug: "bambusisustus" },
  {
    id: "installation-products",
    name: "Lattian asennustuotteet",
    slug: "lattian-asennustuotteet",
  },
  {
    id: "care-products",
    name: "Lattian hoitotuotteet",
    slug: "lattian-hoitotuotteet",
  },
].map(
  (category): Category => ({
    ...category,
    href: "/fi#tuoteryhmat",
    status: "pendingAssortment",
    image: null,
  }),
);
