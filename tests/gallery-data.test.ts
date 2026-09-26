import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import * as publicGallery from "@/data/gallery";
import {
  gallerySceneFilters,
  getGalleryPresentationItems,
  getHomepageGalleryPresentationItems,
} from "@/data/gallery";
import { galleryItems } from "@/data/gallery/registry";

describe("gallery data", () => {
  it("keeps every image local, rights-recorded and neutrally sourced", () => {
    expect(galleryItems).toHaveLength(66);

    for (const item of galleryItems) {
      expect(item.src).toMatch(
        /^\/images\/(?:home\/project-\d{2}\.jpg|gallery\/terraces\/gal-6-\d+\.webp)$/u,
      );
      expect(item.rightsId).toMatch(/^reference-gallery-(?:\d+|6-\d+)$/u);
      expect(item.source.url).toMatch(
        /^https:\/\/www\.bambukogrindys\.lt\/uploads\/it0003\/gal_[67]_\d+m\.jpg$/u,
      );
      expect(existsSync(join(process.cwd(), "public", item.src.slice(1)))).toBe(true);
      expect(item.alt.length).toBeGreaterThan(10);
      expect(item.caption.length).toBeGreaterThan(10);
      expect(item.productIds).toEqual([]);
      expect(`${item.alt} ${item.caption}`).not.toMatch(/\bpuu\w*/iu);
    }
  });

  it("filters by observable scene type and keeps a compact mixed homepage set", () => {
    expect(gallerySceneFilters.map(({ id }) => id)).toEqual([
      "kaikki",
      "sisatila",
      "terassi",
      "materiaali",
      "yksityiskohta",
    ]);
    expect(getGalleryPresentationItems("sisatila").length).toBeGreaterThan(0);
    expect(getGalleryPresentationItems("yksityiskohta").length).toBeGreaterThan(0);
    expect(getGalleryPresentationItems("terassi")).toHaveLength(58);
    expect(getGalleryPresentationItems("kaikki")).toHaveLength(galleryItems.length);
    const homepageItems = getHomepageGalleryPresentationItems();
    expect(homepageItems).toHaveLength(8);
    expect(homepageItems.filter((item) => item.scenes.includes("terassi"))).toHaveLength(4);
  });

  it("keeps raw provenance out of the public barrel and projects exact visitor-safe keys", () => {
    const projectedItems = getGalleryPresentationItems();

    expect(publicGallery).not.toHaveProperty("galleryItems");
    expect(publicGallery).not.toHaveProperty("getGalleryItemsByScene");

    for (const item of projectedItems) {
      expect(Object.keys(item).sort()).toEqual([
        "alt",
        "caption",
        "height",
        "id",
        "scenes",
        "src",
        "width",
      ]);
    }
  });
});
