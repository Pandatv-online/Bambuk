// @vitest-environment jsdom

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GalleryExperience } from "@/components/gallery";
import {
  gallerySceneFilters,
  getGalleryPresentationItems,
} from "@/data/gallery";

const galleryInteractionTimeout = 15_000;

const presentationItems = getGalleryPresentationItems();

describe("gallery experience", () => {
  it("filters scenes and gives a clear empty result", async () => {
    const user = userEvent.setup();
    render(
      <GalleryExperience filters={gallerySceneFilters} items={presentationItems} />,
    );

    expect(screen.getAllByRole("button", { name: /Avaa kuva:/u })).toHaveLength(8);
    await user.click(screen.getByRole("button", { name: "Terassit" }));

    expect(screen.queryAllByRole("button", { name: /Avaa kuva:/u })).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toContain(
      "Tässä ryhmässä ei ole vielä vahvistettuja kuvia.",
    );
  }, galleryInteractionTimeout);

  it("navigates, traps focus, closes and restores the page", async () => {
    const user = userEvent.setup();
    render(
      <GalleryExperience filters={gallerySceneFilters} items={presentationItems} />,
    );
    const opener = screen.getAllByRole("button", { name: /Avaa kuva:/u })[0];

    await user.click(opener!);
    const dialog = screen.getByRole("dialog", { name: "Kuvagalleria" });
    const close = screen.getByRole("button", { name: "Sulje kuvagalleria" });
    const next = screen.getByRole("button", { name: "Seuraava kuva" });

    expect(document.activeElement).toBe(close);
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByRole("img", { name: presentationItems[0]!.alt })).toBeTruthy();

    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByRole("img", { name: presentationItems[1]!.alt })).toBeTruthy();

    close.focus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(document.activeElement).toBe(next);

    await user.keyboard("{Escape}");
    expect(dialog.isConnected).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(opener);
  }, galleryInteractionTimeout);

  it("closes from backdrop and the explicit close button", async () => {
    const user = userEvent.setup();
    render(
      <GalleryExperience filters={gallerySceneFilters} items={presentationItems} />,
    );
    const opener = screen.getAllByRole("button", { name: /Avaa kuva:/u })[0]!;

    await user.click(opener);
    fireEvent.mouseDown(screen.getByRole("dialog", { name: "Kuvagalleria" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(opener);
    await user.click(screen.getByRole("button", { name: "Sulje kuvagalleria" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  }, galleryInteractionTimeout);
});
