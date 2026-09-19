// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm, SampleRequestForm } from "@/components/forms";
import { siteConfig } from "@/lib/site-config";

const formInteractionTimeout = 15_000;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function completeContactForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nimi *"), "Maija Meikäläinen");
  await user.type(screen.getByLabelText("Sähköpostiosoite"), "maija@example.fi");
  await user.type(screen.getByLabelText("Viesti *"), "Tarvitsen lisätietoja.");
}

describe("inquiry form interaction states", () => {
  it("maps server field errors to an accessible summary and focuses the first invalid control", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: false,
          code: "validation_error",
          fieldErrors: { name: ["Anna nimi."], contact: ["Anna puhelinnumero tai sähköpostiosoite."] },
        }),
        { status: 400, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm sourceUrl="/fi/yhteystiedot" />);

    await completeContactForm(user);
    await user.click(screen.getByRole("button", { name: "Lähetä pyyntö" }));

    const summary = await screen.findByRole("alert");
    expect(summary.textContent).toContain("Tarkista lomakkeen tiedot");
    expect(summary.textContent).toContain("Anna nimi.");
    expect(screen.getByLabelText("Nimi *").getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(screen.getByLabelText("Nimi *"));
    expect((screen.getByLabelText("Sähköpostiosoite") as HTMLInputElement).value).toBe("maija@example.fi");
  }, formInteractionTimeout);

  it("blocks a second click while pending and presents a success result only after a successful response", async () => {
    const user = userEvent.setup();
    let resolveResponse: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm sourceUrl="/fi/yhteystiedot" />);

    await completeContactForm(user);
    const submit = screen.getByRole("button", { name: "Lähetä pyyntö" });
    await user.click(submit);

    expect((await screen.findByRole("status")).textContent).toContain("Lähetetään viestiä…");
    expect((submit as HTMLButtonElement).disabled).toBe(true);
    await user.click(submit);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveResponse?.(
      new Response(JSON.stringify({ ok: true, referenceId: "125" }), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("Kiitos yhteydenotostasi");
    });
    expect(screen.getByRole("status").textContent).toContain("Viestin tunniste: 125");
  }, formInteractionTimeout);

  it("uses a natural neutral success message when company names are still unconfigured", async () => {
    const user = userEvent.setup();
    const mutableConfig = siteConfig as {
      company: { displayName: string | null; legalName: string | null };
    };
    const originalCompany = mutableConfig.company;
    mutableConfig.company = { ...originalCompany, displayName: null, legalName: null };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 201,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    try {
      render(<ContactForm sourceUrl="/fi/yhteystiedot" />);
      await completeContactForm(user);
      await user.click(screen.getByRole("button", { name: "Lähetä pyyntö" }));

      const success = await screen.findByRole("status");
      expect(success.textContent).toContain("Viestisi on välitetty. Otamme yhteyttä");
      expect(success.textContent).not.toContain("välitetty .");
    } finally {
      mutableConfig.company = originalCompany;
    }
  }, formInteractionTimeout);

  it("keeps a sample request intact and gives the phone fallback when Telegram is unconfigured", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, code: "temporarily_unavailable" }), {
        status: 503,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<SampleRequestForm productId="47" sourceUrl="/fi/tilaa-mallipala" />);

    await user.type(screen.getByLabelText("Nimi *"), "Liisa Laine");
    await user.type(screen.getByLabelText("Puhelinnumero"), "+358 50 123 4567");
    await user.click(screen.getByRole("button", { name: "Lähetä pyyntö" }));

    const unavailable = await screen.findByRole("alert");
    expect(unavailable.textContent).toContain("ei voida lähettää juuri nyt");
    expect(unavailable.textContent).not.toContain("välitetty");
    expect(screen.getByRole("link", { name: `Soita ${siteConfig.contact.phone}` }).getAttribute("href")).toBe(siteConfig.contact.phoneHref);
    expect((screen.getByLabelText("Tuotetunniste *") as HTMLInputElement).value).toBe("47");
  }, formInteractionTimeout);
});
