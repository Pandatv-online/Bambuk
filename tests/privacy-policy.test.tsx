import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PrivacyPolicyPage, {
  metadata as privacyMetadata,
} from "@/app/fi/tietosuoja/page";
import { privacyNotice } from "@/data/privacy";
import { siteConfig } from "@/lib/site-config";
import { INQUIRY_RETENTION_MONTHS } from "@/lib/inquiries/retention";

describe("privacy policy route", () => {
  it("renders the controlled Finnish notice with the actual inquiry data categories", () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />);

    expect(privacyNotice.path).toBe("/fi/tietosuoja");
    expect(privacyNotice.retentionMonths).toBe(INQUIRY_RETENTION_MONTHS);
    expect(privacyNotice.dataCategories).toEqual([
      "Nimi",
      "Valittu yhteydenottokanava sekä puhelinnumero ja/tai sähköpostiosoite",
      "Viestin sisältö ja pyynnön tiedot",
      "Tuote-, näyte- ja asennuskonteksti",
      "Lomakkeen tyyppi, lähdesivu ja lähetyksen yksilöivä tunniste",
      "Lomakkeen avaamishetken tekninen aikaleima",
    ]);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Tietosuojaseloste");
    expect(html).toContain("Osaühing IKB");
    expect(html).toContain(siteConfig.company.address);
    expect(html).toContain("12 kuukautta");
    expect(html).toContain("Palvelin tarkistaa sen avulla lähetyksen ajoituksen");
    expect(html).toContain("Aikaleimaa ei lisätä Telegram-ilmoitukseen");
    expect(html).toContain("GDPR:n 6 artiklan 1 kohdan b alakohdan");
    expect(html).toContain("Telegram Bot API");
    expect(html).toContain("ei ole asetettu käyttöön");
    expect(html).toContain("Poistettava viimeistään");
    expect(html).toContain("ei käytetä markkinointiin");
    expect(html).toContain("profilointia eikä automaattista päätöksentekoa");
    expect(html).not.toContain("bambukogrindys.lt");
    expect(html).not.toMatch(/eväste|analytiikka|ip-osoite/iu);

    expect(privacyMetadata.title).toBe("Tietosuojaseloste | Osaühing IKB");
    expect(privacyMetadata.description).toContain(
      "yhteydenotto-, tarjous- ja näytepyyntölomakkeiden",
    );
    expect(privacyMetadata.alternates?.canonical?.toString()).toBe(
      "http://localhost:3000/fi/tietosuoja",
    );
    expect(privacyMetadata.robots).toEqual({ index: false, follow: false });
  });

  it("records an operator-only retention procedure without claiming provider deletion", () => {
    const procedure = readFileSync(
      new URL("../docs/inquiry-retention-procedure.md", import.meta.url),
      "utf8",
    );

    expect(procedure).toContain("12 kuukautta");
    expect(procedure).toContain("Telegram-ilmoitukset");
    expect(procedure).toContain("ei luo omaa tietokantaa");
    expect(procedure).toContain("ei ole toimintoa, joka poistaa");
    expect(procedure).toContain("Telegramin tai muun palveluntarjoajan");
    expect(procedure).not.toMatch(/automaattinen.*poisto/iu);
  });
});
