import type { NavigationItem } from "./types";

export const navigation: readonly NavigationItem[] = [
  {
    id: "products",
    label: "Tuotteet",
    href: "/fi#tuoteryhmat",
    children: [
      { id: "interior-floors", label: "Bambulattiat", href: "/fi#tuoteryhmat" },
      { id: "outdoor-products", label: "Ulkotuotteet", href: "/fi#tuoteryhmat" },
      { id: "panels", label: "Bambulevyt", href: "/fi#tuoteryhmat" },
    ],
  },
  { id: "installation", label: "Asennus", href: "/fi#asennus" },
  { id: "information", label: "Tietoa bambusta", href: "/fi#tietoa" },
  { id: "gallery", label: "Galleria", href: "/fi#galleria" },
  { id: "about", label: "Meistä", href: "/fi#yritystiedot" },
  { id: "contact", label: "Yhteystiedot", href: "/fi#yhteys" },
];
