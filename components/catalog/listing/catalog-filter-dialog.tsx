"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import styles from "./catalog-listing.module.css";

export function CatalogFilterDialog({ children }: Readonly<{ children: ReactNode }>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => () => {
      document.body.style.removeProperty("overflow");
    },
    [],
  );

  const open = () => {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  };

  const close = () => dialogRef.current?.close();

  return (
    <div className={styles.mobileFilters}>
      <button
        aria-controls="catalog-filter-dialog"
        aria-haspopup="dialog"
        className={styles.mobileFilterTrigger}
        onClick={open}
        ref={triggerRef}
        type="button"
      >
        Suodata tuotteita
      </button>
      <dialog
        aria-labelledby="catalog-filter-title"
        className={styles.filterDialog}
        id="catalog-filter-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onClose={() => {
          document.body.style.removeProperty("overflow");
          triggerRef.current?.focus();
        }}
        ref={dialogRef}
      >
        <div className={styles.dialogPanel}>
          <header className={styles.dialogHeader}>
            <h2 id="catalog-filter-title">Suodata tuotteita</h2>
            <button aria-label="Sulje suodattimet" onClick={close} type="button">
              <span aria-hidden="true">×</span>
            </button>
          </header>
          {children}
        </div>
      </dialog>
    </div>
  );
}
