import type { LocalPath } from "../types";

export type GalleryScene =
  | "sisatila"
  | "terassi"
  | "materiaali"
  | "yksityiskohta";

export type GalleryFilterId = "kaikki" | GalleryScene;

type GallerySourceUrl = `https://${string}`;

export type GallerySource = Readonly<{
  url: GallerySourceUrl;
  register: "docs/implementation-inputs.md";
}>;

export type GalleryRecord = Readonly<{
  id: string;
  src: LocalPath;
  width: number;
  height: number;
  alt: string;
  caption: string;
  rightsId: string;
  source: GallerySource;
  scenes: readonly GalleryScene[];
  productIds: readonly string[];
}>;

export type GalleryPresentationItem = Readonly<
  Pick<
    GalleryRecord,
    "id" | "src" | "width" | "height" | "alt" | "caption" | "scenes"
  >
>;

export type GallerySceneFilter = Readonly<{
  id: GalleryFilterId;
  label: string;
}>;

export type GalleryPageContent = Readonly<{
  status: "review" | "published";
  title: string;
  metaTitle: string;
  metaDescription: string;
  introduction: string;
}>;
