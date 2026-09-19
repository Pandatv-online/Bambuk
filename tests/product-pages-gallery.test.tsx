// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductGallery } from "@/components/catalog/product";
import { getCatalogProductById } from "@/data/catalog";

const productGalleryInteractionTimeout = 15_000;

describe("product gallery", () => {
  it("moves thumbnail selection and focus with arrow keys", async () => {
    const product = getCatalogProductById("47");
    if (!product?.nameFi) throw new Error("Missing representative product");
    const user = userEvent.setup();

    render(<ProductGallery images={product.images} productName={product.nameFi} />);
    const thumbnails = screen.getAllByRole("button", { name: /Näytä kuva/u });
    thumbnails[0]?.focus();
    await user.keyboard("{ArrowRight}");

    expect(document.activeElement).toBe(thumbnails[1]);
    expect(thumbnails[1]?.getAttribute("aria-pressed")).toBe("true");
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(thumbnails[0]);
    expect(thumbnails[0]?.getAttribute("aria-pressed")).toBe("true");
  }, productGalleryInteractionTimeout);
});
