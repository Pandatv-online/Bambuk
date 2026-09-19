import type { InquiryTransport } from "./types";
import {
  formatInquiryMessage,
  TELEGRAM_MESSAGE_MAX_CHARACTERS,
} from "./message";

type TelegramEnvironment = Readonly<{
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}>;

export type TelegramTransportOptions = Readonly<{
  env?: TelegramEnvironment;
  fetch?: typeof fetch;
  timeoutMs?: number;
}>;

export function createTelegramInquiryTransport(
  options: TelegramTransportOptions = {},
): InquiryTransport {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? 8_000;

  return async (inquiry) => {
    const token = env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = env.TELEGRAM_CHAT_ID?.trim();
    if (!token || !chatId) {
      return { ok: false, code: "temporarily_unavailable" };
    }

    const message = formatInquiryMessage(inquiry);
    if (message.length > TELEGRAM_MESSAGE_MAX_CHARACTERS) {
      return { ok: false, code: "delivery_failed" };
    }

    try {
      const response = await fetchImpl(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
            link_preview_options: { is_disabled: true },
          }),
          signal: AbortSignal.timeout(timeoutMs),
        },
      );
      if (!response.ok) return { ok: false, code: "delivery_failed" };

      const payload: unknown = await response.json();
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("ok" in payload) ||
        payload.ok !== true ||
        !("result" in payload) ||
        typeof payload.result !== "object" ||
        payload.result === null ||
        !("message_id" in payload.result) ||
        (typeof payload.result.message_id !== "number" &&
          typeof payload.result.message_id !== "string")
      ) {
        return { ok: false, code: "delivery_failed" };
      }

      return { ok: true, referenceId: String(payload.result.message_id) };
    } catch (error) {
      return {
        ok: false,
        code:
          error instanceof Error &&
          (error.name === "TimeoutError" || error.name === "AbortError")
            ? "timeout"
            : "delivery_failed",
      };
    }
  };
}

export const sendInquiry: InquiryTransport = (inquiry) =>
  createTelegramInquiryTransport()(inquiry);
