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
  status: "published",
  title: "Galleria",
  metaTitle: "Galleria – sisätilat ja terassit",
  metaDescription:
    "Tutustu paikallisesti tallennettuihin kuviin sisätiloista, lattioista ja terasseista. Kuvien tuote- ja projektisuhteita ei ole päätelty.",
  introduction:
    "Kuvat havainnollistavat lattiasävyjä, pintoja, sisätiloja ja terasseja. Tuote-, asiakas- ja projektitiedot lisätään vain vahvistettuina.",
};

const homepageGalleryIds = new Set([
  "gallery-311",
  "gallery-312",
  "gallery-339",
  "gallery-147",
  "gallery-6-587",
  "gallery-6-123",
  "gallery-6-607",
  "gallery-6-641",
]);

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

export function getHomepageGalleryPresentationItems(): readonly GalleryPresentationItem[] {
  return getGalleryPresentationItems().filter((item) => homepageGalleryIds.has(item.id));
}

export function getGalleryOgImage(): GalleryPresentationItem["src"] | undefined {
  return getGalleryPresentationItems()[0]?.src;
}
