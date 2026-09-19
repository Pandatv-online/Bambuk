export type InquiryType = "contact" | "quote" | "sample";
export type PreferredContact = "email" | "phone" | "either";

export type InquiryCommon = Readonly<{
  name: string;
  email: string | null;
  phone: string | null;
  preferredContact: PreferredContact;
  message: string | null;
  sourceUrl: string;
  idempotencyKey: string;
  startedAt: number;
}>;

export type ContactInquiry = InquiryCommon &
  Readonly<{ type: "contact"; message: string }>;

export type QuoteInquiry = InquiryCommon &
  Readonly<{
    type: "quote";
    inquiryType: "products" | "installation" | "both";
    productIds: readonly string[];
    approximateArea: number | null;
    quantity: string | null;
    municipality: string | null;
    postcode: string | null;
    timing: string | null;
    installationInterest: boolean;
  }>;

export type SampleInquiry = InquiryCommon &
  Readonly<{
    type: "sample";
    productId: string;
    fulfillmentPreference: "toimitus" | "sovittu-kaynti";
  }>;

export type Inquiry = ContactInquiry | QuoteInquiry | SampleInquiry;
export type InquiryFieldErrors = Readonly<Record<string, readonly string[]>>;

export type InquiryValidationResult =
  | Readonly<{ success: true; data: Inquiry }>
  | Readonly<{
      success: false;
      code: "validation_error" | "spam_detected";
      fieldErrors: InquiryFieldErrors;
    }>;

export type InquiryDeliveryResult =
  | Readonly<{ ok: true; referenceId?: string }>
  | Readonly<{
      ok: false;
      code: "temporarily_unavailable" | "delivery_failed" | "timeout";
    }>;

export type InquiryTransport = (
  inquiry: Inquiry,
) => Promise<InquiryDeliveryResult>;
