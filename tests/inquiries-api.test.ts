import { describe, expect, it, vi } from "vitest";

import {
  createInquiryPostHandler,
  type InquiryTransport,
} from "@/lib/inquiries";

const now = 1_700_000_010_000;
const common = {
  type: "contact",
  name: "Maija",
  email: "maija@example.fi",
  phone: "",
  preferredContact: "email",
  message: "Kysymys",
  website: "",
  startedAt: now - 5_000,
  sourceUrl: "/fi/yhteystiedot",
  idempotencyKey: "contact-12345678",
};

const jsonRequest = (body: unknown, headers?: HeadersInit) =>
  new Request("https://example.fi/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

describe("POST /api/inquiries", () => {
  it("delivers valid JSON once and rejects an immediate duplicate", async () => {
    const transport = vi.fn<InquiryTransport>().mockResolvedValue({
      ok: true,
      referenceId: "451",
    });
    const post = createInquiryPostHandler({ transport, now: () => now });

    const first = await post(jsonRequest(common));
    const duplicate = await post(jsonRequest(common));

    expect(first.status).toBe(201);
    await expect(first.json()).resolves.toEqual({ ok: true, referenceId: "451" });
    expect(duplicate.status).toBe(409);
    await expect(duplicate.json()).resolves.toEqual({
      ok: false,
      code: "duplicate_submission",
    });
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("normalizes multipart form data through the same quote schema", async () => {
    const transport = vi.fn<InquiryTransport>().mockResolvedValue({
      ok: true,
      referenceId: "452",
    });
    const post = createInquiryPostHandler({ transport, now: () => now });
    const form = new FormData();
    Object.entries({
      ...common,
      type: "quote",
      idempotencyKey: "quote-12345678",
      inquiryType: "both",
      approximateArea: "25.5",
      postcode: "00100",
      installationInterest: "on",
    }).forEach(([key, value]) => form.set(key, String(value)));
    form.append("productIds", "53");
    form.append("productIds", "443");

    const response = await post(
      new Request("https://example.fi/api/inquiries", { method: "POST", body: form }),
    );

    expect(response.status).toBe(201);
    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "quote",
        productIds: ["53", "443"],
        approximateArea: 25.5,
        installationInterest: true,
      }),
    );
  });

  it("preserves a mixed-case multipart boundary while parsing", async () => {
    const transport = vi.fn<InquiryTransport>().mockResolvedValue({ ok: true });
    const post = createInquiryPostHandler({ transport, now: () => now });
    const boundary = "AaB03xCaseSensitive";
    const fields = Object.entries(common)
      .map(
        ([name, value]) =>
          `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
      )
      .join("");
    const request = new Request("https://example.fi/api/inquiries", {
      method: "POST",
      headers: {
        "content-type": `Multipart/Form-Data; boundary=${boundary}`,
      },
      body: `${fields}--${boundary}--\r\n`,
    });

    const response = await post(request);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(transport).toHaveBeenCalledTimes(1);
    expect(transport).toHaveBeenCalledWith(
      expect.objectContaining({ type: "contact", name: "Maija" }),
    );
  });

  it("rejects field errors, honeypots and oversized bodies before delivery", async () => {
    const transport = vi.fn<InquiryTransport>();
    const post = createInquiryPostHandler({ transport, now: () => now });
    const invalid = await post(jsonRequest({ ...common, email: "", phone: "" }));
    const spam = await post(jsonRequest({ ...common, website: "filled" }));
    const oversized = await post(
      jsonRequest(common, { "content-length": "40000" }),
    );

    expect(invalid.status).toBe(400);
    await expect(invalid.json()).resolves.toMatchObject({
      ok: false,
      code: "validation_error",
      fieldErrors: { contact: expect.any(Array) },
    });
    expect(spam.status).toBe(400);
    await expect(spam.json()).resolves.toEqual({ ok: false, code: "spam_detected" });
    expect(oversized.status).toBe(413);
    await expect(oversized.json()).resolves.toEqual({
      ok: false,
      code: "payload_too_large",
    });
    expect(transport).not.toHaveBeenCalled();
  });

  it("stops streaming an oversized body without relying on Content-Length", async () => {
    const transport = vi.fn<InquiryTransport>();
    const post = createInquiryPostHandler({
      transport,
      now: () => now,
      maxBodyBytes: 1_024,
    });
    let pulls = 0;
    let cancelled = false;
    const totalChunks = 100;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new TextEncoder().encode("x".repeat(512)));
        if (pulls === totalChunks) controller.close();
      },
      cancel() {
        cancelled = true;
      },
    });
    const init: RequestInit & { duplex: "half" } = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      duplex: "half",
    };
    const request = new Request("https://example.fi/api/inquiries", init);

    expect(request.headers.get("content-length")).toBeNull();
    const response = await post(request);

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: "payload_too_large",
    });
    expect(cancelled).toBe(true);
    expect(pulls).toBeLessThan(totalChunks);
    expect(transport).not.toHaveBeenCalled();
  });

  it("returns typed availability/failure states and permits a safe retry", async () => {
    const transport = vi.fn<InquiryTransport>()
      .mockResolvedValueOnce({ ok: false, code: "temporarily_unavailable" })
      .mockResolvedValueOnce({ ok: false, code: "timeout" })
      .mockResolvedValueOnce({ ok: true, referenceId: "453" });
    const post = createInquiryPostHandler({ transport, now: () => now });

    const unavailable = await post(jsonRequest(common));
    const timeout = await post(jsonRequest(common));
    const retry = await post(jsonRequest(common));

    expect(unavailable.status).toBe(503);
    await expect(unavailable.json()).resolves.toEqual({
      ok: false,
      code: "temporarily_unavailable",
    });
    expect(timeout.status).toBe(504);
    await expect(timeout.json()).resolves.toEqual({ ok: false, code: "timeout" });
    expect(retry.status).toBe(201);
    expect(transport).toHaveBeenCalledTimes(3);
  });

  it("converts an unexpected transport rejection to a typed retryable failure", async () => {
    const transport = vi.fn<InquiryTransport>()
      .mockRejectedValueOnce(new Error("secret-bearing provider error"))
      .mockResolvedValueOnce({ ok: true, referenceId: "454" });
    const post = createInquiryPostHandler({ transport, now: () => now });

    const failure = await post(jsonRequest(common));
    const retry = await post(jsonRequest(common));

    expect(failure.status).toBe(502);
    await expect(failure.json()).resolves.toEqual({
      ok: false,
      code: "delivery_failed",
    });
    expect(retry.status).toBe(201);
  });
});
