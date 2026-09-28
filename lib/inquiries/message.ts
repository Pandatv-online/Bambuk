import type { Inquiry } from "./types";
import { getInquiryDeletionDeadline } from "./retention";

export const TELEGRAM_MESSAGE_MAX_CHARACTERS = 4_096;

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const label = (value: string | number | boolean): string =>
  escapeHtml(typeof value === "boolean" ? (value ? "kyllä" : "ei") : String(value));

const line = (title: string, value: string | number | boolean | null): string | null =>
  value === null || value === "" ? null : `<b>${title}:</b> ${label(value)}`;

export function formatInquiryMessage(
  inquiry: Inquiry,
  receivedAt: number = Date.now(),
): string {
  const title = inquiry.type === "contact"
    ? "Yhteydenotto"
    : inquiry.type === "quote"
      ? "Tarjouspyyntö"
      : "Näytepyyntö";
  const lines: Array<string | null> = [
    `<b>${title}</b>`,
    line("Nimi", inquiry.name),
    line("Puhelin", inquiry.phone),
    line("Sähköposti", inquiry.email),
    line("Toivottu yhteydenotto", inquiry.preferredContact),
  ];

  if (inquiry.type === "quote") {
    lines.push(
      line("Tarjouksen tyyppi", inquiry.inquiryType),
      line("Tuotetunnisteet", inquiry.productIds.join(", ") || null),
      line("Arvioitu pinta-ala (m²)", inquiry.approximateArea),
      line("Määrä", inquiry.quantity),
      line("Kunta", inquiry.municipality),
      line("Postinumero", inquiry.postcode),
      line("Ajankohta", inquiry.timing),
      line("Asennus kiinnostaa", inquiry.installationInterest),
    );
  } else if (inquiry.type === "sample") {
    const fulfillmentLabel = inquiry.fulfillmentPreference === "sovittu-kaynti"
      ? "Kohdekäynti (sovitaan erikseen)"
      : "Postitus";
    lines.push(
      line("Tuotetunniste", inquiry.productId),
      line("Näytteen toimitus tai esittely", fulfillmentLabel),
    );
  }

  lines.push(
    line("Viesti", inquiry.message),
    line("Lähdesivu", inquiry.sourceUrl),
    line("Lähetystunniste", inquiry.idempotencyKey),
    line("Poistettava viimeistään", getInquiryDeletionDeadline(receivedAt)),
  );
  return lines.filter((item): item is string => item !== null).join("\n");
}
