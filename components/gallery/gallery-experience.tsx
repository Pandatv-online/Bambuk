"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  GalleryFilterId,
  GalleryPresentationItem,
  GallerySceneFilter,
} from "@/data/gallery";

import styles from "./gallery-experience.module.css";

export type GalleryExperienceProps = Readonly<{
  filters: readonly GallerySceneFilter[];
  items: readonly GalleryPresentationItem[];
}>;

export function GalleryExperience({ filters, items }: GalleryExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryFilterId>("kaikki");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const filteredItems = useMemo(
    () =>
      activeFilter === "kaikki"
        ? items
        : items.filter((item) => item.scenes.includes(activeFilter)),
    [activeFilter, items],
  );
  const isOpen = activeIndex !== null;
  const activeItem = activeIndex === null ? null : filteredItems[activeIndex] ?? null;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [isOpen]);

  const close = () => setActiveIndex(null);
  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => {
      if (current === null || filteredItems.length === 0) return current;
      return (current + direction + filteredItems.length) % filteredItems.length;
    });
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[data-lightbox-focus]"),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={styles.experience}>
      <div aria-label="Suodata kuvia" className={styles.filters} role="group">
        {filters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter.id}
            className={styles.filter}
            key={filter.id}
            onClick={() => {
              setActiveIndex(null);
              setActiveFilter(filter.id);
            }}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className={styles.count}>
        {filteredItems.length} {filteredItems.length === 1 ? "kuva" : "kuvaa"}
      </p>

      {filteredItems.length > 0 ? (
        <div className={styles.grid}>
          {filteredItems.map((item, index) => (
            <figure className={styles.card} key={item.id}>
              <button
                aria-label={`Avaa kuva: ${item.alt}`}
                className={styles.openButton}
                onClick={(event) => {
                  returnFocusRef.current = event.currentTarget;
                  setActiveIndex(index);
                }}
                type="button"
              >
                <Image
                  alt={item.alt}
                  className={styles.image}
                  height={item.height}
                  sizes="(min-width: 75rem) 18rem, (min-width: 48rem) 33vw, 50vw"
                  src={item.src}
                  width={item.width}
                />
              </button>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <p>Tässä ryhmässä ei ole vielä vahvistettuja kuvia.</p>
          <button
            className={styles.reset}
            onClick={() => setActiveFilter("kaikki")}
            type="button"
          >
            Näytä kaikki kuvat
          </button>
        </div>
      )}

      {activeItem ? (
        <div
          aria-label="Kuvagalleria"
          aria-modal="true"
          className={styles.backdrop}
          onKeyDown={handleDialogKeyDown}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          role="dialog"
        >
          <div className={styles.lightbox}>
            <button
              aria-label="Sulje kuvagalleria"
              className={styles.close}
              data-lightbox-focus
              onClick={close}
              ref={closeButtonRef}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
            <figure className={styles.lightboxFigure}>
              <Image
                alt={activeItem.alt}
                className={styles.lightboxImage}
                height={activeItem.height}
                preload
                sizes="(min-width: 75rem) 70rem, 94vw"
                src={activeItem.src}
                width={activeItem.width}
              />
              <figcaption>
                <span>{activeItem.caption}</span>
                <span aria-live="polite">
                  {activeIndex! + 1} / {filteredItems.length}
                </span>
              </figcaption>
            </figure>
            <div className={styles.lightboxActions}>
              <button
                aria-label="Edellinen kuva"
                data-lightbox-focus
                onClick={() => move(-1)}
                type="button"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                aria-label="Seuraava kuva"
                data-lightbox-focus
                onClick={() => move(1)}
                type="button"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
