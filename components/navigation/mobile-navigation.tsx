"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { NavigationItem } from "@/data";
import { navigation } from "@/data";
import { siteConfig } from "@/lib/site-config";

import { Button } from "../ui/button";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type MobileNavigationProps = Readonly<{
  items?: readonly NavigationItem[];
}>;

function MobileBranch({
  item,
  onNavigate,
}: Readonly<{ item: NavigationItem; onNavigate: () => void }>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenId = useId();

  return (
    <li>
      <div className="mobile-navigation__row">
        <a href={item.href} onClick={onNavigate}>
          {item.label}
        </a>
        {item.children?.length ? (
          <button
            type="button"
            aria-controls={childrenId}
            aria-expanded={isExpanded}
            aria-label={`${item.label}: alavalikko`}
            onClick={() => setIsExpanded((value) => !value)}
          >
            <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
          </button>
        ) : null}
      </div>
      {item.children?.length && isExpanded ? (
        <ul id={childrenId} className="mobile-navigation__children">
          {item.children.map((child) => (
            <MobileBranch item={child} key={child.id} onNavigate={onNavigate} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function MobileNavigation({ items = navigation }: MobileNavigationProps) {
  const { company, contact } = siteConfig;
  const [isOpen, setIsOpen] = useState(false);
  const dialogId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => setIsOpen(false);
  const open = () => {
    if (window.matchMedia?.("(min-width: 75rem)").matches) return;
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const desktopQuery = window.matchMedia?.("(min-width: 75rem)");
    let movedToDesktop = false;

    if (desktopQuery?.matches) return;

    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(focusableSelector);
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !drawer) return;
      const elements = Array.from(
        drawer.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleDesktopBreakpoint = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      movedToDesktop = true;
      setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery?.addEventListener("change", handleDesktopBreakpoint);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery?.removeEventListener("change", handleDesktopBreakpoint);
      document.body.style.overflow = previousOverflow;
      if (!movedToDesktop) trigger?.focus();
    };
  }, [isOpen]);

  return (
    <div className="mobile-navigation">
      <button
        ref={triggerRef}
        className="mobile-navigation__trigger"
        type="button"
        aria-controls={dialogId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Avaa valikko"
        onClick={open}
      >
        <span aria-hidden="true" className="mobile-navigation__menu-icon" />
      </button>
      {isOpen ? (
        <div className="mobile-navigation__layer">
          <button
            type="button"
            className="mobile-navigation__backdrop"
            aria-label="Sulje valikko taustaa napsauttamalla"
            onClick={close}
          />
          <div
            ref={drawerRef}
            id={dialogId}
            className="mobile-navigation__drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
          >
            <div className="mobile-navigation__heading">
              <p id={`${dialogId}-title`}>Valikko</p>
              <button type="button" aria-label="Sulje valikko" onClick={close}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <nav aria-label="Mobiilinavigaatio">
              <ul className="mobile-navigation__list">
                {items.map((item) => (
                  <MobileBranch item={item} key={item.id} onNavigate={close} />
                ))}
              </ul>
            </nav>
            <address>
              <strong>{company.displayName}</strong>
              {contact.phone && contact.phoneHref ? (
                <p>
                  <a href={contact.phoneHref}>{contact.phone}</a>
                  <br />
                  <span>{contact.hours}</span>
                </p>
              ) : null}
              <p>{contact.visitWording}</p>
            </address>
            <Button href="/fi#yhteys" onClick={close}>
              Pyydä tarjous
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
