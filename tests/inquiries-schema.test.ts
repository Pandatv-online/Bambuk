import { describe, expect, it } from "vitest";

import { parseInquiryPayload } from "@/lib/inquiries";

const startedAt = Date.now() - 5_000;

describe("inquiry schemas", () => {
  it("normalizes contact JSON and form payloads while requiring a contact channel", () => {
    const valid = parseInquiryPayload(
      {
        type: "contact",
        name: "  Maija Meikäläinen  ",
        email: " MAIJA@example.fi ",
        phone: "",
        preferredContact: "email",
        message: " Kysymys tuotteesta. ",
        website: "",
        startedAt: String(startedAt),
        sourceUrl: "/fi/yhteystiedot",
        idempotencyKey: "contact-12345678",
      },
      { now: startedAt + 5_000 },
    );

    expect(valid).toEqual({
      success: true,
      data: {
        type: "contact",
        name: "Maija Meikäläinen",
        email: "maija@example.fi",
        phone: null,
        preferredContact: "email",
        message: "Kysymys tuotteesta.",
        sourceUrl: "/fi/yhteystiedot",
        idempotencyKey: "contact-12345678",
        startedAt,
      },
    });

    const missingContact = parseInquiryPayload(
      new FormData(),
      { now: startedAt + 5_000 },
    );
    expect(missingContact).toMatchObject({
      success: false,
      code: "validation_error",
      fieldErrors: {
        type: expect.any(Array),
        name: expect.any(Array),
        contact: expect.any(Array),
      },
    });
  });

  it("validates sample-specific context, timing and the no-attachment boundary", () => {
    const sample = new FormData();
    sample.set("name", "Liisa");
    sample.set("email", "liisa@example.fi");
    sample.set("preferredContact", "email");
    sample.set("startedAt", String(startedAt));
    sample.set("sourceUrl", "/fi/tilaa-mallipala");
    sample.set("idempotencyKey", "sample-87654321");
    sample.set("productId", "53");
    sample.set("fulfillmentPreference", "toimitus");

    expect(
      parseInquiryPayload({
        ...Object.fromEntries(sample),
        type: "sample",
      }, { now: startedAt + 5_000 }),
    ).toMatchObject({
      success: true,
      data: {
        type: "sample",
        productId: "53",
        fulfillmentPreference: "toimitus",
      },
    });

    sample.set("fulfillmentPreference", "sovittu käynti");
    expect(parseInquiryPayload({ ...Object.fromEntries(sample), type: "sample" }, { now: startedAt + 5_000 })).toMatchObject({
      success: true,
      data: { fulfillmentPreference: "sovittu-kaynti" },
    });

    sample.set("type", "sample");
    sample.set("attachment", new File(["private"], "plan.txt"));
    expect(parseInquiryPayload(sample, { now: startedAt + 5_000 })).toMatchObject({
      success: false,
      code: "validation_error",
      fieldErrors: { attachment: expect.any(Array) },
    });
    expect(
      parseInquiryPayload(
        { ...Object.fromEntries(sample), attachment: undefined, startedAt: startedAt + 4_500 },
        { now: startedAt + 5_000 },
      ),
    ).toMatchObject({
      success: false,
      fieldErrors: { startedAt: expect.any(Array) },
    });
  });

  it("treats every non-empty honeypot value as spam", () => {
    expect(
      parseInquiryPayload(
        {
          type: "contact",
          name: "Maija",
          email: "maija@example.fi",
          preferredContact: "email",
          message: "Kysymys",
          website: "x".repeat(201),
          startedAt,
          sourceUrl: "/fi/yhteystiedot",
          idempotencyKey: "contact-87654321",
        },
        { now: startedAt + 5_000 },
      ),
    ).toEqual({ success: false, code: "spam_detected", fieldErrors: {} });
  });

  it("rejects a field combination that cannot fit one Telegram message", () => {
    expect(
      parseInquiryPayload(
        {
          type: "contact",
          name: "Maija",
          email: "maija@example.fi",
          preferredContact: "email",
          message: "m".repeat(3_000),
          website: "",
          startedAt,
          sourceUrl: `/${"s".repeat(1_000)}`,
          idempotencyKey: "contact-87654321",
        },
        { now: startedAt + 5_000 },
      ),
    ).toMatchObject({
      success: false,
      code: "validation_error",
      fieldErrors: { message: expect.any(Array) },
    });
  });

  it("measures the final HTML-escaped Telegram message", () => {
    expect(
      parseInquiryPayload(
        {
          type: "contact",
          name: "Maija",
          email: "maija@example.fi",
          preferredContact: "email",
          message: "&".repeat(900),
          website: "",
          startedAt,
          sourceUrl: "/fi/yhteystiedot",
          idempotencyKey: "contact-87654321",
        },
        { now: startedAt + 5_000 },
      ),
    ).toMatchObject({
      success: false,
      code: "validation_error",
      fieldErrors: { message: expect.any(Array) },
    });
  });
});
