import type {
  Inquiry,
  InquiryValidationResult,
  PreferredContact,
} from "./types";
import {
  formatInquiryMessage,
  TELEGRAM_MESSAGE_MAX_CHARACTERS,
} from "./message";

const MIN_COMPLETION_MS = 1_500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const POSTCODE_PATTERN = /^\d{5}$/u;
const KEY_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/u;

type UnknownPayload = Record<string, unknown> | FormData;

export type InquiryValidationOptions = Readonly<{ now?: number }>;

const toRecord = (input: UnknownPayload): Record<string, unknown> => {
  if (!(input instanceof FormData)) return input;

  const record: Record<string, unknown> = {};
  for (const [key, value] of input.entries()) {
    const current = record[key];
    record[key] = current === undefined
      ? value
      : Array.isArray(current)
        ? [...current, value]
        : [current, value];
  }
  return record;
};

const text = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
};

const optionalText = (value: unknown, maxLength: number): string | null => {
  if (value === undefined || value === null || value === "") return null;
  return text(value, maxLength);
};

const addError = (
  errors: Record<string, string[]>,
  field: string,
  message: string,
) => {
  (errors[field] ??= []).push(message);
};

const containsFile = (value: unknown): boolean =>
  typeof File !== "undefined" &&
  (value instanceof File || (Array.isArray(value) && value.some(containsFile)));

const parseBoolean = (value: unknown): boolean | null => {
  if (value === true || value === "true" || value === "1" || value === "on") {
    return true;
  }
  if (
    value === false ||
    value === "false" ||
    value === "0" ||
    value === "off" ||
    value === ""
  ) {
    return false;
  }
  return value === undefined || value === null ? false : null;
};

const parseStartedAt = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseProductIds = (value: unknown): readonly string[] | null => {
  const candidates = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : value === undefined || value === null
        ? []
        : [value];
  if (candidates.length > 20) return null;

  const ids = candidates
    .map((candidate) => text(candidate, 120))
    .filter((candidate): candidate is string => candidate !== null);
  if (ids.length !== candidates.filter((candidate) => candidate !== "").length) {
    return null;
  }
  return [...new Set(ids)];
};

const parseArea = (value: unknown): number | null | "invalid" => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 100_000
    ? parsed
    : "invalid";
};

const finish = (
  errors: Record<string, string[]>,
  inquiry: Inquiry | null,
): InquiryValidationResult => {
  if (
    inquiry !== null &&
    Object.keys(errors).length === 0 &&
    formatInquiryMessage(inquiry).length > TELEGRAM_MESSAGE_MAX_CHARACTERS
  ) {
    addError(errors, "message", "Lomakkeen sisältö on liian pitkä.");
  }

  return Object.keys(errors).length > 0 || inquiry === null
    ? { success: false, code: "validation_error", fieldErrors: errors }
    : { success: true, data: inquiry };
};

export function parseInquiryPayload(
  input: UnknownPayload,
  options: InquiryValidationOptions = {},
): InquiryValidationResult {
  const raw = toRecord(input);
  const errors: Record<string, string[]> = {};
  const now = options.now ?? Date.now();

  for (const [field, value] of Object.entries(raw)) {
    if (containsFile(value)) {
      addError(errors, field, "Liitetiedostoja ei tueta tässä lomakkeessa.");
    }
  }

  const honeypotValues = Array.isArray(raw.website)
    ? raw.website
    : [raw.website];
  if (
    honeypotValues.some((value) =>
      typeof value === "string"
        ? value.trim().length > 0
        : value !== undefined && value !== null,
    )
  ) {
    return { success: false, code: "spam_detected", fieldErrors: {} };
  }

  const type = text(raw.type, 20);
  if (type !== "contact" && type !== "quote" && type !== "sample") {
    addError(errors, "type", "Valitse lomakkeen tyyppi.");
  }

  const name = text(raw.name, 120);
  if (!name) addError(errors, "name", "Anna nimi.");

  const emailInput = optionalText(raw.email, 254);
  const email = emailInput?.toLowerCase() ?? null;
  if (raw.email && (!email || !EMAIL_PATTERN.test(email))) {
    addError(errors, "email", "Anna kelvollinen sähköpostiosoite.");
  }

  const phone = optionalText(raw.phone, 40);
  if (raw.phone && !phone) addError(errors, "phone", "Anna kelvollinen puhelinnumero.");
  if (!email && !phone) {
    addError(errors, "contact", "Anna puhelinnumero tai sähköpostiosoite.");
  }

  const preferred = text(raw.preferredContact, 20);
  const preferredContact: PreferredContact | null =
    preferred === "email" || preferred === "phone" || preferred === "either"
      ? preferred
      : null;
  if (!preferredContact) {
    addError(errors, "preferredContact", "Valitse yhteydenottotapa.");
  } else if (preferredContact === "email" && !email) {
    addError(errors, "email", "Sähköposti tarvitaan valittuun yhteydenottotapaan.");
  } else if (preferredContact === "phone" && !phone) {
    addError(errors, "phone", "Puhelinnumero tarvitaan valittuun yhteydenottotapaan.");
  }

  const message = optionalText(raw.message, 4_000);
  if (raw.message && !message) addError(errors, "message", "Viesti on liian pitkä.");

  const sourceUrl = text(raw.sourceUrl, 2_048);
  if (!sourceUrl || (!sourceUrl.startsWith("/") && !/^https?:\/\//u.test(sourceUrl))) {
    addError(errors, "sourceUrl", "Lähdesivu puuttuu tai on virheellinen.");
  }

  const idempotencyKey = text(raw.idempotencyKey, 128);
  if (!idempotencyKey || !KEY_PATTERN.test(idempotencyKey)) {
    addError(errors, "idempotencyKey", "Lähetystunniste puuttuu tai on virheellinen.");
  }

  const startedAt = parseStartedAt(raw.startedAt);
  if (
    startedAt === null ||
    startedAt > now + 5_000 ||
    now - startedAt < MIN_COMPLETION_MS ||
    now - startedAt > MAX_FORM_AGE_MS
  ) {
    addError(errors, "startedAt", "Lomakkeen ajoitus on virheellinen.");
  }

  if (
    Object.keys(errors).length > 0 ||
    !name ||
    !preferredContact ||
    !sourceUrl ||
    !idempotencyKey ||
    startedAt === null ||
    (type !== "contact" && type !== "quote" && type !== "sample")
  ) {
    return finish(errors, null);
  }

  const common = {
    name,
    email,
    phone,
    preferredContact,
    message,
    sourceUrl,
    idempotencyKey,
    startedAt,
  } as const;

  if (type === "contact") {
    if (!message) addError(errors, "message", "Kirjoita viesti.");
    return finish(errors, message ? { ...common, type, message } : null);
  }

  if (type === "quote") {
    const inquiryType = text(raw.inquiryType, 20);
    if (
      inquiryType !== "products" &&
      inquiryType !== "installation" &&
      inquiryType !== "both"
    ) {
      addError(errors, "inquiryType", "Valitse tarjouksen tyyppi.");
    }
    const productIds = parseProductIds(raw.productIds);
    if (!productIds) addError(errors, "productIds", "Tuotetunnisteet ovat virheellisiä.");
    const approximateArea = parseArea(raw.approximateArea);
    if (approximateArea === "invalid") {
      addError(errors, "approximateArea", "Anna kelvollinen pinta-ala.");
    }
    const quantity = optionalText(raw.quantity, 120);
    if (raw.quantity && !quantity) addError(errors, "quantity", "Määrä on liian pitkä.");
    const municipality = optionalText(raw.municipality, 120);
    if (raw.municipality && !municipality) {
      addError(errors, "municipality", "Kunnan nimi on liian pitkä.");
    }
    const postcode = optionalText(raw.postcode, 5);
    if (postcode && !POSTCODE_PATTERN.test(postcode)) {
      addError(errors, "postcode", "Anna viisinumeroinen postinumero.");
    }
    const timing = optionalText(raw.timing, 120);
    if (raw.timing && !timing) addError(errors, "timing", "Ajankohta on liian pitkä.");
    const installationInterest = parseBoolean(raw.installationInterest);
    if (installationInterest === null) {
      addError(errors, "installationInterest", "Asennusvalinta on virheellinen.");
    }
    return finish(
      errors,
      inquiryType === "products" || inquiryType === "installation" || inquiryType === "both"
        ? {
            ...common,
            type,
            inquiryType,
            productIds: productIds ?? [],
            approximateArea: approximateArea === "invalid" ? null : approximateArea,
            quantity,
            municipality,
            postcode,
            timing,
            installationInterest: installationInterest ?? false,
          }
        : null,
    );
  }

  const productId = text(raw.productId, 120);
  if (!productId) addError(errors, "productId", "Valitse tuote.");
  const fulfillmentInput = text(raw.fulfillmentPreference, 30);
  const fulfillmentPreference = fulfillmentInput;
  if (fulfillmentPreference !== "toimitus") {
    addError(errors, "fulfillmentPreference", "Valitse näytteen toimitustapa.");
  }
  return finish(
    errors,
    productId && fulfillmentPreference === "toimitus"
      ? { ...common, type, productId, fulfillmentPreference }
      : null,
  );
}

export type InquirySchema<TType extends Inquiry["type"]> = Readonly<{
  safeParse: (
    input: UnknownPayload,
    options?: InquiryValidationOptions,
  ) => InquiryValidationResult;
  type: TType;
}>;

const schemaFor = <TType extends Inquiry["type"]>(type: TType): InquirySchema<TType> => ({
  type,
  safeParse(input, options) {
    const raw = toRecord(input);
    return parseInquiryPayload({ ...raw, type }, options);
  },
});

export const contactInquirySchema = schemaFor("contact");
export const quoteInquirySchema = schemaFor("quote");
export const sampleInquirySchema = schemaFor("sample");
export const inquirySchema = { safeParse: parseInquiryPayload } as const;

export const inquiryValidationLimits = {
  minimumCompletionMs: MIN_COMPLETION_MS,
  maximumFormAgeMs: MAX_FORM_AGE_MS,
  maximumTelegramMessageCharacters: TELEGRAM_MESSAGE_MAX_CHARACTERS,
} as const;
