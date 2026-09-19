"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import type { CatalogImage } from "@/lib/catalog/types";

import styles from "./product-page.module.css";

export function ProductGallery({
  images,
  productName,
}: Readonly<{
  images: readonly CatalogImage[];
  productName: string;
}>) {
  const orderedImages = [...images].sort((left, right) => left.order - right.order);
  const [selectedSrc, setSelectedSrc] = useState(orderedImages[0]?.src ?? null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedImage =
    orderedImages.find((image) => image.src === selectedSrc) ?? orderedImages[0];

  if (!selectedImage) {
    return (
      <div
        aria-label={`${productName}: kuva ei ole saatavilla`}
        className={styles.galleryPlaceholder}
        role="img"
      />
    );
  }

  return (
    <section aria-label="Tuotekuvat" className={styles.gallery}>
      <div className={styles.galleryMain}>
        <Image
          alt={selectedImage.altFi}
          fill
          preload
          sizes="(min-width: 61.25rem) 34rem, 100vw"
          src={selectedImage.src}
        />
      </div>
      {orderedImages.length > 1 ? (
        <div aria-label="Valitse tuotekuva" className={styles.thumbnails} role="group">
          {orderedImages.map((image, index) => (
            <button
              aria-label={`Näytä kuva ${index + 1}: ${image.altFi}`}
              aria-pressed={image.src === selectedImage.src}
              className={styles.thumbnail}
              key={image.src}
              onClick={() => setSelectedSrc(image.src)}
              onKeyDown={(event) => {
                const lastIndex = orderedImages.length - 1;
                const nextIndex =
                  event.key === "ArrowRight"
                    ? (index + 1) % orderedImages.length
                    : event.key === "ArrowLeft"
                      ? (index - 1 + orderedImages.length) % orderedImages.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? lastIndex
                          : null;
                if (nextIndex === null) return;
                event.preventDefault();
                const nextImage = orderedImages[nextIndex];
                if (nextImage) setSelectedSrc(nextImage.src);
                thumbnailRefs.current[nextIndex]?.focus();
              }}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              tabIndex={image.src === selectedImage.src ? 0 : -1}
              type="button"
            >
              <Image alt="" fill sizes="5.5rem" src={image.src} />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
