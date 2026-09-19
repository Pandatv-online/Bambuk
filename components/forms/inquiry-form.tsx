"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type { InquiryApiResponse } from "@/lib/inquiries";
import { siteConfig } from "@/lib/site-config";

import styles from "./inquiry-form.module.css";

type InquiryFormKind = "contact" | "quote" | "sample";
type FormErrorCode = Exclude<InquiryApiResponse, { ok: true }>["code"] | "network_error";

type InquiryFormProps = Readonly<{
  kind: InquiryFormKind;
  sourceUrl: string;
  productId?: string;
  productIds?: readonly string[];
  inquiryType?: "products" | "installation" | "both";
  installationInterest?: boolean;
}>;

type FormState =
  | Readonly<{ kind: "idle" }>
  | Readonly<{ kind: "pending" }>
  | Readonly<{ kind: "success"; referenceId?: string }>
  | Readonly<{
      kind: "error";
      code: FormErrorCode;
      fieldErrors: Readonly<Record<string, readonly string[]>>;
    }>;

type InputErrorProps = Readonly<{
  field: string;
  errors: Readonly<Record<string, readonly string[]>>;
  formId: string;
}>;

const fieldLabels: Readonly<Record<string, string>> = {
  name: "Nimi",
  email: "Sähköpostiosoite",
  phone: "Puhelinnumero",
  contact: "Yhteystiedot",
  preferredContact: "Toivottu yhteydenottotapa",
  message: "Viesti",
  inquiryType: "Tarjouksen aihe",
  productIds: "Tuotetunnisteet",
  approximateArea: "Arvioitu pinta-ala",
  quantity: "Määrä",
  municipality: "Kunta",
  postcode: "Postinumero",
  timing: "Toivottu ajankohta",
  installationInterest: "Asennus",
  productId: "Tuotetunniste",
  fulfillmentPreference: "Näytteen toimitustapa",
};

const errorTarget: Readonly<Record<string, string>> = {
  contact: "email",
  type: "name",
  sourceUrl: "name",
  idempotencyKey: "name",
  startedAt: "name",
};

const createSubmissionKey = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `inquiry-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};

const responseMessage = (code: FormErrorCode): string => {
  switch (code) {
    case "temporarily_unavailable":
      return "Lomaketta ei voida lähettää juuri nyt. Soita meille, niin sovitaan seuraavasta vaiheesta.";
    case "timeout":
      return "Lähetys katkesi ennen vahvistusta. Tietosi säilyvät lomakkeessa; yritä uudelleen tai soita meille.";
    case "duplicate_submission":
      return "Sama lähetys on jo käsittelyssä. Jos tarvitset varmistuksen, soita meille.";
    case "spam_detected":
      return "Lähetystä ei voitu käsitellä. Tarkista tiedot ja yritä uudelleen.";
    case "payload_too_large":
      return "Lomakkeen sisältö on liian laaja. Lyhennä viestiä ja yritä uudelleen.";
    case "unsupported_media_type":
    case "invalid_request":
      return "Lomakkeen lähetys ei onnistunut. Tarkista tiedot ja yritä uudelleen.";
    case "delivery_failed":
    case "network_error":
    default:
      return "Lomaketta ei voitu lähettää. Tietosi säilyvät lomakkeessa; yritä uudelleen tai soita meille.";
  }
};

function FieldError({ errors, field, formId }: InputErrorProps) {
  const messages = errors[field] ?? [];
  if (!messages.length) return null;

  return (
    <p className={styles.fieldError} id={`${formId}-${field}-error`}>
      {messages.join(" ")}
    </p>
  );
}

function Field({
  children,
  inputId,
  label,
  required,
}: Readonly<{
  children: ReactNode;
  inputId: string;
  label: string;
  required?: boolean;
}>) {
  return (
    <div className={styles.field}>
      <label htmlFor={inputId}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

function ErrorSummary({
  errors,
  formId,
}: Readonly<{
  errors: Readonly<Record<string, readonly string[]>>;
  formId: string;
}>) {
  const entries = Object.entries(errors).filter(([, messages]) => messages.length);
  if (!entries.length) return null;

  return (
    <section className={styles.errorSummary} aria-labelledby={`${formId}-error-title`} role="alert">
      <h2 id={`${formId}-error-title`}>Tarkista lomakkeen tiedot</h2>
      <ul>
        {entries.map(([field, messages]) => {
          const target = errorTarget[field] ?? field;
          return (
            <li key={field}>
              <a href={`#${formId}-${target}`}>
                {fieldLabels[field] ?? "Lomakkeen tieto"}: {messages.join(" ")}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ContactFields({
  errors,
  formId,
}: Readonly<{
  errors: Readonly<Record<string, readonly string[]>>;
  formId: string;
}>) {
  const describe = (field: string) =>
    errors[field]?.length ? `${formId}-${field}-error` : undefined;

  return (
    <fieldset className={styles.fieldset}>
      <legend>Yhteystiedot</legend>
      <div className={styles.twoColumns}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`}>Nimi <span aria-hidden="true">*</span></label>
          <input
            aria-describedby={describe("name")}
            aria-invalid={Boolean(errors.name?.length)}
            autoComplete="name"
            id={`${formId}-name`}
            name="name"
            required
            type="text"
          />
          <FieldError errors={errors} field="name" formId={formId} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-phone`}>Puhelinnumero</label>
          <input
            aria-describedby={describe("phone")}
            aria-invalid={Boolean(errors.phone?.length)}
            autoComplete="tel"
            id={`${formId}-phone`}
            inputMode="tel"
            name="phone"
            type="tel"
          />
          <FieldError errors={errors} field="phone" formId={formId} />
        </div>
      </div>
      <div className={styles.twoColumns}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-email`}>Sähköpostiosoite</label>
          <input
            aria-describedby={describe("email") ?? describe("contact")}
            aria-invalid={Boolean(errors.email?.length || errors.contact?.length)}
            autoComplete="email"
            id={`${formId}-email`}
            name="email"
            type="email"
          />
          <FieldError errors={errors} field="email" formId={formId} />
          <FieldError errors={errors} field="contact" formId={formId} />
        </div>
        <fieldset
          aria-describedby={describe("preferredContact")}
          aria-invalid={Boolean(errors.preferredContact?.length)}
          className={styles.choiceFieldset}
        >
          <legend>Toivottu yhteydenottotapa <span aria-hidden="true">*</span></legend>
          <div className={styles.choices}>
            <label><input defaultChecked name="preferredContact" type="radio" value="either" /> Kumpi tahansa</label>
            <label><input name="preferredContact" type="radio" value="phone" /> Puhelin</label>
            <label><input name="preferredContact" type="radio" value="email" /> Sähköposti</label>
          </div>
          <FieldError errors={errors} field="preferredContact" formId={formId} />
        </fieldset>
      </div>
      <p className={styles.help}>Anna vähintään puhelinnumero tai sähköpostiosoite.</p>
    </fieldset>
  );
}

function QuoteFields({
  errors,
  formId,
  initialInquiryType,
  initialInstallationInterest,
  initialProductIds,
}: Readonly<{
  errors: Readonly<Record<string, readonly string[]>>;
  formId: string;
  initialInquiryType?: "products" | "installation" | "both";
  initialInstallationInterest?: boolean;
  initialProductIds: string;
}>) {
  const describe = (field: string) =>
    errors[field]?.length ? `${formId}-${field}-error` : undefined;

  return (
    <fieldset className={styles.fieldset}>
      <legend>Projektin tiedot</legend>
      <fieldset
        aria-describedby={describe("inquiryType")}
        aria-invalid={Boolean(errors.inquiryType?.length)}
        className={styles.choiceFieldset}
      >
        <legend>Tarjouksen aihe <span aria-hidden="true">*</span></legend>
        <div className={styles.choices}>
          <label><input defaultChecked={(initialInquiryType ?? "products") === "products"} name="inquiryType" type="radio" value="products" /> Tuotteet</label>
          <label><input defaultChecked={initialInquiryType === "installation"} name="inquiryType" type="radio" value="installation" /> Asennus</label>
          <label><input defaultChecked={initialInquiryType === "both"} name="inquiryType" type="radio" value="both" /> Tuotteet ja asennus</label>
        </div>
        <FieldError errors={errors} field="inquiryType" formId={formId} />
      </fieldset>
      <div className={styles.twoColumns}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-productIds`}>Tuotetunnisteet</label>
          <input
            aria-describedby={describe("productIds")}
            aria-invalid={Boolean(errors.productIds?.length)}
            defaultValue={initialProductIds}
            id={`${formId}-productIds`}
            name="productIds"
            type="text"
          />
          <p className={styles.help}>Voit erottaa useat tunnisteet pilkulla.</p>
          <FieldError errors={errors} field="productIds" formId={formId} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-approximateArea`}>Arvioitu pinta-ala (m²)</label>
          <input
            aria-describedby={describe("approximateArea")}
            aria-invalid={Boolean(errors.approximateArea?.length)}
            id={`${formId}-approximateArea`}
            min="0.01"
            name="approximateArea"
            step="0.1"
            type="number"
          />
          <FieldError errors={errors} field="approximateArea" formId={formId} />
        </div>
      </div>
      <div className={styles.twoColumns}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-quantity`}>Määrä tai muu tarkenne</label>
          <input
            aria-describedby={describe("quantity")}
            aria-invalid={Boolean(errors.quantity?.length)}
            id={`${formId}-quantity`}
            name="quantity"
            type="text"
          />
          <FieldError errors={errors} field="quantity" formId={formId} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-timing`}>Toivottu ajankohta</label>
          <input
            aria-describedby={describe("timing")}
            aria-invalid={Boolean(errors.timing?.length)}
            id={`${formId}-timing`}
            name="timing"
            type="text"
          />
          <FieldError errors={errors} field="timing" formId={formId} />
        </div>
      </div>
      <div className={styles.twoColumns}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-municipality`}>Kunta</label>
          <input
            aria-describedby={describe("municipality")}
            aria-invalid={Boolean(errors.municipality?.length)}
            autoComplete="address-level2"
            id={`${formId}-municipality`}
            name="municipality"
            type="text"
          />
          <FieldError errors={errors} field="municipality" formId={formId} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-postcode`}>Postinumero</label>
          <input
            aria-describedby={describe("postcode")}
            aria-invalid={Boolean(errors.postcode?.length)}
            autoComplete="postal-code"
            id={`${formId}-postcode`}
            inputMode="numeric"
            name="postcode"
            pattern="[0-9]{5}"
            type="text"
          />
          <FieldError errors={errors} field="postcode" formId={formId} />
        </div>
      </div>
      <label className={styles.checkbox}>
        <input defaultChecked={initialInstallationInterest} name="installationInterest" type="checkbox" />
        Haluan tietoa myös asennuksesta.
      </label>
      <FieldError errors={errors} field="installationInterest" formId={formId} />
    </fieldset>
  );
}

function SampleFields({
  errors,
  formId,
  initialProductId,
}: Readonly<{
  errors: Readonly<Record<string, readonly string[]>>;
  formId: string;
  initialProductId: string;
}>) {
  const describe = (field: string) =>
    errors[field]?.length ? `${formId}-${field}-error` : undefined;

  return (
    <fieldset className={styles.fieldset}>
      <legend>Näytetoive</legend>
      <div className={styles.field}>
        <label htmlFor={`${formId}-productId`}>Tuotetunniste <span aria-hidden="true">*</span></label>
        <input
          aria-describedby={describe("productId")}
          aria-invalid={Boolean(errors.productId?.length)}
          defaultValue={initialProductId}
          id={`${formId}-productId`}
          name="productId"
          required
          type="text"
        />
        <p className={styles.help}>Tuotetunniste välittyy pyynnön mukana, kun avaat lomakkeen tuotteen sivulta.</p>
        <FieldError errors={errors} field="productId" formId={formId} />
      </div>
      <fieldset
        aria-describedby={describe("fulfillmentPreference")}
        aria-invalid={Boolean(errors.fulfillmentPreference?.length)}
        className={styles.choiceFieldset}
      >
        <legend>Näytteen toimitustapa <span aria-hidden="true">*</span></legend>
        <div className={styles.choices}>
          <label><input defaultChecked name="fulfillmentPreference" type="radio" value="toimitus" /> Toimitus</label>
          <label><input name="fulfillmentPreference" type="radio" value="sovittu käynti" /> Sovittu käynti</label>
        </div>
        <FieldError errors={errors} field="fulfillmentPreference" formId={formId} />
      </fieldset>
      <p className={styles.help}>Emme pyydä osoitetta tässä vaiheessa. Toimitustapa ja mahdolliset ehdot vahvistetaan ennen lähetystä.</p>
    </fieldset>
  );
}

function InquiryForm({
  inquiryType,
  installationInterest,
  kind,
  productId,
  productIds = [],
  sourceUrl,
}: InquiryFormProps) {
  const reactId = useId();
  const formId = `inquiry-${kind}-${reactId.replace(/:/gu, "")}`;
  const [startedAt] = useState(() => String(Date.now()));
  const [idempotencyKey] = useState(createSubmissionKey);
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const fieldErrors = state.kind === "error" ? state.fieldErrors : {};
  const phoneFallback = siteConfig.contact.phone;
  const phoneFallbackHref = siteConfig.contact.phoneHref;
  const companyName = siteConfig.company.legalName ?? siteConfig.company.displayName;

  useEffect(() => {
    if (state.kind !== "error") return;
    const firstField = Object.keys(state.fieldErrors)[0];
    if (!firstField) return;
    const target = errorTarget[firstField] ?? firstField;
    document.getElementById(`${formId}-${target}`)?.focus();
  }, [formId, state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "pending") return;

    setState({ kind: "pending" });
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
        headers: { accept: "application/json" },
      });
      const payload: unknown = await response.json().catch(() => null);
      if (
        response.ok &&
        typeof payload === "object" &&
        payload !== null &&
        "ok" in payload &&
        payload.ok === true
      ) {
        const referenceId = "referenceId" in payload && typeof payload.referenceId === "string"
          ? payload.referenceId
          : undefined;
        setState({ kind: "success", referenceId });
        return;
      }

      const failure = payload as Exclude<InquiryApiResponse, { ok: true }> | null;
      setState({
        kind: "error",
        code: failure?.code ?? "delivery_failed",
        fieldErrors: failure?.code === "validation_error" && failure.fieldErrors
          ? failure.fieldErrors
          : {},
      });
    } catch {
      setState({ kind: "error", code: "network_error", fieldErrors: {} });
    }
  }

  if (state.kind === "success") {
    return (
      <div className={styles.success} role="status" tabIndex={-1}>
        <h2>Kiitos yhteydenotostasi</h2>
        <p>
          {companyName
            ? `Viestisi on välitetty ${companyName}. Otamme yhteyttä valitsemaasi kanavaa käyttäen.`
            : "Viestisi on välitetty. Otamme yhteyttä valitsemaasi kanavaa käyttäen."}
        </p>
        {state.referenceId ? <p>Viestin tunniste: {state.referenceId}</p> : null}
      </div>
    );
  }

  return (
    <form
      action="/api/inquiries"
      aria-busy={state.kind === "pending"}
      className={styles.form}
      method="post"
      onSubmit={submit}
      ref={formRef}
    >
      <input name="type" type="hidden" value={kind} />
      <input name="sourceUrl" type="hidden" value={sourceUrl} />
      <input name="startedAt" type="hidden" value={startedAt} />
      <input name="idempotencyKey" type="hidden" value={idempotencyKey} />
      <div aria-hidden="true" className={styles.honeypot}>
        <label htmlFor={`${formId}-website`}>Verkkosivusto</label>
        <input autoComplete="off" id={`${formId}-website`} name="website" tabIndex={-1} type="text" />
      </div>

      {state.kind === "error" ? <ErrorSummary errors={fieldErrors} formId={formId} /> : null}
      {state.kind === "pending" ? <p className={styles.pending} role="status">Lähetetään viestiä…</p> : null}

      <ContactFields errors={fieldErrors} formId={formId} />
      {kind === "contact" ? (
        <Field inputId={`${formId}-message`} label="Viesti" required>
          <textarea
            aria-describedby={fieldErrors.message?.length ? `${formId}-message-error` : undefined}
            aria-invalid={Boolean(fieldErrors.message?.length)}
            id={`${formId}-message`}
            name="message"
            required
            rows={6}
          />
          <FieldError errors={fieldErrors} field="message" formId={formId} />
        </Field>
      ) : null}
      {kind === "quote" ? (
        <>
          <QuoteFields
            errors={fieldErrors}
            formId={formId}
            initialInquiryType={inquiryType}
            initialInstallationInterest={installationInterest}
            initialProductIds={productIds.join(", ")}
          />
          <Field inputId={`${formId}-message`} label="Lisätiedot">
            <textarea
              aria-describedby={fieldErrors.message?.length ? `${formId}-message-error` : undefined}
              aria-invalid={Boolean(fieldErrors.message?.length)}
              id={`${formId}-message`}
              name="message"
              rows={6}
            />
            <FieldError errors={fieldErrors} field="message" formId={formId} />
          </Field>
        </>
      ) : null}
      {kind === "sample" ? (
        <>
          <SampleFields errors={fieldErrors} formId={formId} initialProductId={productId ?? ""} />
          <Field inputId={`${formId}-message`} label="Lisätiedot">
            <textarea
              aria-describedby={fieldErrors.message?.length ? `${formId}-message-error` : undefined}
              aria-invalid={Boolean(fieldErrors.message?.length)}
              id={`${formId}-message`}
              name="message"
              rows={5}
            />
            <FieldError errors={fieldErrors} field="message" formId={formId} />
          </Field>
        </>
      ) : null}

      <aside className={styles.dataUse}>
        <h2>Tietojen käyttö tässä vaiheessa</h2>
        <p>Käytämme antamiasi tietoja vain tähän yhteydenottoon. Hyväksyttyä tietosuojaselostetta ei ole vielä julkaistu, joten lomake ei ole tuotantokäyttöön valmis.</p>
      </aside>

      {state.kind === "error" && !Object.keys(fieldErrors).length ? (
        <div className={styles.unavailable} role="alert">
          <p>{responseMessage(state.code)}</p>
          {phoneFallback && phoneFallbackHref ? (
            <a href={phoneFallbackHref}>Soita {phoneFallback}</a>
          ) : null}
        </div>
      ) : null}
      <button className={styles.submit} disabled={state.kind === "pending"} type="submit">
        {state.kind === "pending" ? "Lähetetään…" : "Lähetä pyyntö"}
      </button>
    </form>
  );
}

export function ContactForm(props: Readonly<{ sourceUrl: string }>) {
  return <InquiryForm kind="contact" {...props} />;
}

export function QuoteForm(
  props: Omit<InquiryFormProps, "kind" | "productId">,
) {
  return <InquiryForm kind="quote" {...props} />;
}

export function SampleRequestForm(
  props: Omit<InquiryFormProps, "kind" | "productIds" | "inquiryType" | "installationInterest">,
) {
  return <InquiryForm kind="sample" {...props} />;
}
