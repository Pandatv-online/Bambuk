import { describe, expect, it, vi } from "vitest";

import { createTelegramInquiryTransport } from "@/lib/inquiries/telegram";

describe("Telegram inquiry transport", () => {
  it("returns temporarily_unavailable without reading or exposing missing credentials", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const transport = createTelegramInquiryTransport({
      env: {},
      fetch: fetchMock,
    });

    await expect(
      transport({
        type: "contact",
        name: "Maija Meikäläinen",
        email: "maija@example.fi",
        phone: null,
        preferredContact: "email",
        message: "Kysymys",
        sourceUrl: "/fi/yhteystiedot",
        idempotencyKey: "contact-12345678",
        startedAt: 1_700_000_000_000,
      }),
    ).resolves.toEqual({ ok: false, code: "temporarily_unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends one HTML-escaped structured message and returns its message reference", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({ ok: true, result: { message_id: 451 } }),
    );
    const transport = createTelegramInquiryTransport({
      env: {
        TELEGRAM_BOT_TOKEN: "test-token",
        TELEGRAM_CHAT_ID: "test-chat",
      },
      fetch: fetchMock,
      timeoutMs: 500,
    });

    await expect(
      transport({
        type: "quote",
        name: "Matti <script>",
        email: null,
        phone: "+358 50 123 4567",
        preferredContact: "phone",
        message: "Tarjous & asennus",
        sourceUrl: "/fi/tuotteet/lattia?x=<unsafe>",
        idempotencyKey: "quote-12345678",
        startedAt: 1_700_000_000_000,
        inquiryType: "both",
        productIds: ["53", "443"],
        approximateArea: 42.5,
        quantity: null,
        municipality: "Espoo",
        postcode: "02100",
        timing: "syksy",
        installationInterest: true,
      }),
    ).resolves.toEqual({ ok: true, referenceId: "451" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe("https://api.telegram.org/bottest-token/sendMessage");
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      chat_id: "test-chat",
      parse_mode: "HTML",
    });
    expect(body.text).toContain("<b>Tarjouspyyntö</b>");
    expect(body.text).toContain("Matti &lt;script&gt;");
    expect(body.text).toContain("53, 443");
    expect(body.text).toContain("Tarjous &amp; asennus");
    expect(body.text).not.toContain("<script>");
    expect(String(body.text).length).toBeLessThanOrEqual(4_096);
  });

  it("returns delivery_failed when Telegram rejects or malforms the response", async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("denied", { status: 403 }))
      .mockResolvedValueOnce(Response.json({ ok: false }));
    const transport = createTelegramInquiryTransport({
      env: {
        TELEGRAM_BOT_TOKEN: "test-token",
        TELEGRAM_CHAT_ID: "test-chat",
      },
      fetch: fetchMock,
    });
    const inquiry = {
      type: "contact",
      name: "Maija",
      email: "maija@example.fi",
      phone: null,
      preferredContact: "email",
      message: "Kysymys",
      sourceUrl: "/fi/yhteystiedot",
      idempotencyKey: "contact-87654321",
      startedAt: 1_700_000_000_000,
    } as const;

    await expect(transport(inquiry)).resolves.toEqual({
      ok: false,
      code: "delivery_failed",
    });
    await expect(transport(inquiry)).resolves.toEqual({
      ok: false,
      code: "delivery_failed",
    });
  });

  it("aborts a slow request at the configured timeout", async () => {
    const fetchMock = vi.fn<typeof fetch>((_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
      }),
    );
    const transport = createTelegramInquiryTransport({
      env: {
        TELEGRAM_BOT_TOKEN: "test-token",
        TELEGRAM_CHAT_ID: "test-chat",
      },
      fetch: fetchMock,
      timeoutMs: 5,
    });

    await expect(
      transport({
        type: "sample",
        name: "Liisa",
        email: "liisa@example.fi",
        phone: null,
        preferredContact: "email",
        message: null,
        sourceUrl: "/fi/tilaa-mallipala",
        idempotencyKey: "sample-12345678",
        startedAt: 1_700_000_000_000,
        productId: "53",
        fulfillmentPreference: "toimitus",
      }),
    ).resolves.toEqual({ ok: false, code: "timeout" });
    expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
  });
});
