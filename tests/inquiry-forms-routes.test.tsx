import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import * as forms from "@/components/forms";
import { SiteFooter } from "@/components/navigation";
import ContactPage, {
  metadata as contactMetadata,
} from "@/app/fi/yhteystiedot/page";
import QuotePage, {
  metadata as quoteMetadata,
} from "@/app/fi/pyyda-tarjous/page";
import SampleRequestPage, {
  metadata as sampleMetadata,
} from "@/app/fi/tilaa-mallipala/page";
import { siteConfig } from "@/lib/site-config";

describe("inquiry form routes", () => {
  it("renders the three Finnish routes with reusable server-post forms and release-safe metadata", async () => {
    const companyName = siteConfig.company.legalName ?? siteConfig.company.displayName;
    const contact = renderToStaticMarkup(<ContactPage />);
    const quote = renderToStaticMarkup(
      await QuotePage({
        searchParams: Promise.resolve({
          tuote: "47",
          lahde: "/fi/tuotteet/sisalattiat/klassikko/testituote",
          asennus: "true",
        }),
      }),
    );
    const sample = renderToStaticMarkup(
      await SampleRequestPage({
        searchParams: Promise.resolve({
          tuote: "47",
          lahde: "/fi/tuotteet/sisalattiat/klassikko/testituote",
        }),
      }),
    );
    const footer = renderToStaticMarkup(<SiteFooter />);

    for (const html of [contact, quote, sample]) {
      expect(html.match(/<h1/g)).toHaveLength(1);
      expect(html).toContain('action="/api/inquiries"');
      expect(html).toContain('method="post"');
      expect(html).toContain('name="startedAt"');
      expect(html).toContain('name="idempotencyKey"');
      expect(html).toContain('name="website"');
      expect(html).toContain("Tietojen käyttö tässä vaiheessa");
      expect(html).toContain('href="/fi/tietosuoja"');
      expect(html).toContain("Lue tietosuojaseloste");
      expect(html).not.toContain("bambukogrindys.lt");
      expect(html).not.toMatch(/TELEGRAM_(?:BOT_TOKEN|CHAT_ID)/u);
    }

    expect(contact).toContain(companyName);
    expect(contact).toContain(
      "Virossa rekisteröity Osaühing IKB palvelee asiakkaita Suomessa ja Virossa.",
    );
    expect(contact).toContain(`href="${siteConfig.contact.phoneHref}"`);
    expect(contact).toContain("ma–pe 8.00–18.00");
    expect(contact).toContain("Rekisterikoodi");
    expect(contact).toContain("10161031");
    expect(contact).toContain("EE100414305");
    expect(contact).toContain("Mere pst 2, 40231 Sillamäe linn");
    expect(contact).toContain("Rekisteröity osoite");
    expect(contact).not.toContain("Näyttelytila");
    expect(contact).toContain("Sovi käynti etukäteen puhelimitse");
    expect(contact).not.toContain("mailto:");

    expect(quote).toContain('value="47"');
    expect(quote).toMatch(/name="inquiryType" checked="" value="installation"/u);
    expect(quote).toContain('value="/fi/tuotteet/sisalattiat/klassikko/testituote"');
    expect(sample).toContain('value="47"');
    expect(sample).toContain("Emme pyydä osoitetta tässä vaiheessa");
    expect(footer).toContain('href="/fi/tietosuoja"');
    expect(footer).toContain("Tietosuojaseloste");

    for (const metadata of [contactMetadata, quoteMetadata, sampleMetadata]) {
      expect(metadata.robots).toEqual({ index: false, follow: false });
      expect(metadata.openGraph).toMatchObject({ locale: "fi_FI" });
    }
    expect(contactMetadata.title).toBe(companyName ? `Yhteystiedot | ${companyName}` : "Yhteystiedot");
    expect(quoteMetadata.title).toBe(companyName ? `Pyydä tarjous | ${companyName}` : "Pyydä tarjous");
    expect(sampleMetadata.title).toBe(companyName ? `Tilaa mallipala | ${companyName}` : "Tilaa mallipala");
  });

  it("exposes only the three typed form variants from the public forms barrel", () => {
    expect(Object.keys(forms).sort()).toEqual([
      "ContactForm",
      "QuoteForm",
      "SampleRequestForm",
    ]);
  });

  it("does not use a supplied external source URL as visitor form context", async () => {
    const html = renderToStaticMarkup(
      await QuotePage({
        searchParams: Promise.resolve({ lahde: "https://external.example/form" }),
      }),
    );

    expect(html).toContain('name="sourceUrl" value="/fi/pyyda-tarjous"');
    expect(html).not.toContain("external.example");
  });
});
