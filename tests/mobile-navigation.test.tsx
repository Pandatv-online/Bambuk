// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { MobileNavigation } from "@/components/navigation";

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  });
});

describe("MobileNavigation", () => {
  it("shows the confirmed company contact and phone-only visit path", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);

    await user.click(screen.getByRole("button", { name: "Avaa valikko" }));

    expect(screen.getByText("Osaühing IKB")).toBeTruthy();
    expect(screen.getByRole("link", { name: "+358 50 508 0808" })).toHaveProperty(
      "href",
      "tel:+358505080808",
    );
    expect(screen.getByText("ma–pe 8.00–18.00")).toBeTruthy();
    expect(
      screen.getByText(/Emme ota vastaan kävijöitä/u),
    ).toBeTruthy();
    expect(document.body.textContent).toContain("Kohdekäynnistä työn arviointia");
    expect(document.body.textContent).not.toMatch(
      /virallinen|valtuutettu|jakelija|jälleenmyyjä|distributor/i,
    );
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it("operates as a modal disclosure and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "Avaa valikko" });

    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    await user.click(trigger);
    const closeButton = screen.getByRole("button", { name: "Sulje valikko" });
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.activeElement).toBe(closeButton);
    expect(document.body.style.overflow).toBe("hidden");

    const products = screen.getByRole("button", {
      name: "Tuotteet: alavalikko",
    });
    await user.click(products);
    expect(products.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Bambulattiat" })).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
  });

  it("traps focus and closes from the labelled backdrop", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "Avaa valikko" });
    await user.click(trigger);

    const quote = screen.getByRole("link", { name: "Pyydä tarjous" });
    const closeButton = screen.getByRole("button", { name: "Sulje valikko" });
    expect(document.activeElement).toBe(closeButton);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(quote);
    await user.tab();
    expect(document.activeElement).toBe(closeButton);

    await user.click(
      screen.getByRole("button", {
        name: "Sulje valikko taustaa napsauttamalla",
      }),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes and unlocks scrolling when the desktop breakpoint becomes active", async () => {
    const user = userEvent.setup();
    let breakpointListener: ((event: MediaQueryListEvent) => void) | undefined;
    const query = {
      matches: false,
      addEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        breakpointListener = listener;
      },
      removeEventListener: () => undefined,
    } as unknown as MediaQueryList;

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: () => query,
    });

    render(<MobileNavigation />);
    await user.click(screen.getByRole("button", { name: "Avaa valikko" }));
    expect(document.body.style.overflow).toBe("hidden");

    act(() => breakpointListener?.({ matches: true } as MediaQueryListEvent));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });
});
