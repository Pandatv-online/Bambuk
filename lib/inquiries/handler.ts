import { parseInquiryPayload } from "./schema";
import { sendInquiry } from "./telegram";
import type {
  InquiryDeliveryResult,
  InquiryFieldErrors,
  InquiryTransport,
} from "./types";

const DEFAULT_MAX_BODY_BYTES = 32 * 1_024;
const DEFAULT_IDEMPOTENCY_TTL_MS = 2 * 60 * 1_000;

type InquiryDeliveryFailureCode = Extract<
  InquiryDeliveryResult,
  { ok: false }
>["code"];

export type InquiryApiResponse =
  | Readonly<{ ok: true; referenceId?: string }>
  | Readonly<{
      ok: false;
      code:
        | "validation_error"
        | "spam_detected"
        | "payload_too_large"
        | "unsupported_media_type"
        | "invalid_request"
        | "duplicate_submission"
        | InquiryDeliveryFailureCode;
      fieldErrors?: InquiryFieldErrors;
    }>;

export type InquiryPostHandlerOptions = Readonly<{
  transport?: InquiryTransport;
  now?: () => number;
  maxBodyBytes?: number;
  idempotencyTtlMs?: number;
}>;

type BodyReadResult =
  | Readonly<{ ok: true; payload: Record<string, unknown> | FormData }>
  | Readonly<{
      ok: false;
      code: "payload_too_large" | "unsupported_media_type" | "invalid_request";
    }>;

const json = (body: InquiryApiResponse, status: number): Response =>
  Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });

type BodyBytesResult =
  | Readonly<{ ok: true; bytes: Uint8Array }>
  | Readonly<{ ok: false; code: "payload_too_large" | "invalid_request" }>;

async function readBodyBytes(
  request: Request,
  maximumBytes: number,
): Promise<BodyBytesResult> {
  if (!request.body) return { ok: true, bytes: new Uint8Array() };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value.byteLength > maximumBytes - byteLength) {
        await reader.cancel("Inquiry request body exceeds the byte limit")
          .catch(() => undefined);
        return { ok: false, code: "payload_too_large" };
      }
      chunks.push(value);
      byteLength += value.byteLength;
    }
  } catch {
    return { ok: false, code: "invalid_request" };
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, bytes };
}

const parseFormBody = async (
  request: Request,
  contentType: string,
  bytes: Uint8Array,
): Promise<FormData> => {
  const requestBody = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(requestBody).set(bytes);
  const boundedRequest = new Request(request.url, {
    method: "POST",
    headers: { "content-type": contentType },
    body: requestBody,
  });
  return boundedRequest.formData();
};

async function readPayload(
  request: Request,
  maximumBytes: number,
): Promise<BodyReadResult> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (!Number.isFinite(parsedLength) || parsedLength < 0) {
      return { ok: false, code: "invalid_request" };
    }
    if (parsedLength > maximumBytes) {
      return { ok: false, code: "payload_too_large" };
    }
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase() ?? "";
    const body = await readBodyBytes(request, maximumBytes);
    if (!body.ok) return body;

    if (mediaType === "application/json") {
      const payload: unknown = JSON.parse(new TextDecoder().decode(body.bytes));
      if (
        typeof payload !== "object" ||
        payload === null ||
        Array.isArray(payload)
      ) {
        return { ok: false, code: "invalid_request" };
      }
      return { ok: true, payload: payload as Record<string, unknown> };
    }

    if (
      mediaType === "application/x-www-form-urlencoded" ||
      mediaType === "multipart/form-data"
    ) {
      return {
        ok: true,
        payload: await parseFormBody(request, contentType, body.bytes),
      };
    }
    return { ok: false, code: "unsupported_media_type" };
  } catch {
    return { ok: false, code: "invalid_request" };
  }
}

const statusForDelivery = (result: InquiryDeliveryResult): number => {
  if (result.ok) return 201;
  if (result.code === "temporarily_unavailable") return 503;
  if (result.code === "timeout") return 504;
  return 502;
};

export function createInquiryPostHandler(
  options: InquiryPostHandlerOptions = {},
): (request: Request) => Promise<Response> {
  const transport = options.transport ?? sendInquiry;
  const now = options.now ?? Date.now;
  const maxBodyBytes = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  const idempotencyTtlMs =
    options.idempotencyTtlMs ?? DEFAULT_IDEMPOTENCY_TTL_MS;
  const acceptedKeys = new Map<string, number>();

  return async (request) => {
    const body = await readPayload(request, maxBodyBytes);
    if (!body.ok) {
      const status = body.code === "payload_too_large"
        ? 413
        : body.code === "unsupported_media_type"
          ? 415
          : 400;
      return json({ ok: false, code: body.code }, status);
    }

    const currentTime = now();
    const validation = parseInquiryPayload(body.payload, { now: currentTime });
    if (!validation.success) {
      return json(
        validation.code === "spam_detected"
          ? { ok: false, code: validation.code }
          : {
              ok: false,
              code: validation.code,
              fieldErrors: validation.fieldErrors,
            },
        400,
      );
    }

    for (const [key, expiresAt] of acceptedKeys) {
      if (expiresAt <= currentTime) acceptedKeys.delete(key);
    }
    if ((acceptedKeys.get(validation.data.idempotencyKey) ?? 0) > currentTime) {
      return json({ ok: false, code: "duplicate_submission" }, 409);
    }
    acceptedKeys.set(
      validation.data.idempotencyKey,
      currentTime + idempotencyTtlMs,
    );

    let result: InquiryDeliveryResult;
    try {
      result = await transport(validation.data);
    } catch {
      acceptedKeys.delete(validation.data.idempotencyKey);
      return json({ ok: false, code: "delivery_failed" }, 502);
    }
    if (!result.ok) {
      acceptedKeys.delete(validation.data.idempotencyKey);
      return json(result, statusForDelivery(result));
    }
    return json(result, 201);
  };
}

export const inquiryRequestLimits = {
  maximumBodyBytes: DEFAULT_MAX_BODY_BYTES,
  idempotencyTtlMs: DEFAULT_IDEMPOTENCY_TTL_MS,
} as const;
