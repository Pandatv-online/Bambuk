import { galleryItems } from "./registry";
import type {
  GalleryFilterId,
  GalleryPageContent,
  GalleryPresentationItem,
  GallerySceneFilter,
} from "./types";

export type {
  GalleryFilterId,
  GalleryPageContent,
  GalleryPresentationItem,
  GalleryScene,
  GallerySceneFilter,
} from "./types";

export const galleryPage: GalleryPageContent = {
  status: "review",
  title: "Galleria",
  metaTitle: "Galleria – bambulattiat sisätiloissa",
  metaDescription:
    "Tutustu paikallisesti tallennettuihin kuviin lattioista, materiaaleista ja sisätiloista. Kuvien tuote- ja projektisuhteita ei ole päätelty.",
  introduction:
    "Kuvat havainnollistavat lattiasävyjä, pintoja ja erilaisia sisätiloja. Tuote-, asiakas- ja projektitiedot lisätään vain vahvistettuina.",
};

export const gallerySceneFilters: readonly GallerySceneFilter[] = [
  { id: "kaikki", label: "Kaikki kuvat" },
  { id: "sisatila", label: "Sisätilat" },
  { id: "terassi", label: "Terassit" },
  { id: "materiaali", label: "Materiaalit" },
  { id: "yksityiskohta", label: "Yksityiskohdat" },
];

function getGalleryItemsByScene(scene: GalleryFilterId = "kaikki") {
  if (scene === "kaikki") return galleryItems;

  return galleryItems.filter((item) => item.scenes.includes(scene));
}

export function getGalleryPresentationItems(
  scene: GalleryFilterId = "kaikki",
): readonly GalleryPresentationItem[] {
  return getGalleryItemsByScene(scene).map(
    ({ id, src, width, height, alt, caption, scenes }) => ({
      id,
      src,
      width,
      height,
      alt,
      caption,
      scenes,
    }),
  );
}

export function getGalleryOgImage(): GalleryPresentationItem["src"] | undefined {
  return getGalleryPresentationItems()[0]?.src;
}
