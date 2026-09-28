import type { LocalPath } from "./types";
import { INQUIRY_RETENTION_MONTHS } from "@/lib/inquiries/retention";

export type PrivacyNoticePath = "/fi/tietosuoja";

type PrivacyTextBlock =
  | Readonly<{ type: "paragraph"; text: string }>
  | Readonly<{ type: "list"; items: readonly string[] }>;

export type PrivacyNoticeSection = Readonly<{
  id: string;
  title: string;
  blocks: readonly PrivacyTextBlock[];
}>;

export type PrivacyNotice = Readonly<{
  path: PrivacyNoticePath;
  eyebrow: string;
  title: "Tietosuojaseloste";
  metaDescription: string;
  retentionMonths: typeof INQUIRY_RETENTION_MONTHS;
  dataCategories: readonly [string, ...string[]];
  sections: readonly PrivacyNoticeSection[];
}>;

const dataCategories = [
  "Nimi",
  "Valittu yhteydenottokanava sekä puhelinnumero ja/tai sähköpostiosoite",
  "Viestin sisältö ja pyynnön tiedot",
  "Tuote-, näyte- ja asennuskonteksti",
  "Lomakkeen tyyppi, lähdesivu ja lähetyksen yksilöivä tunniste",
  "Lomakkeen avaamishetken tekninen aikaleima",
] as const;

export const privacyNotice = {
  path: "/fi/tietosuoja",
  eyebrow: "Henkilötietojen käsittely",
  title: "Tietosuojaseloste",
  metaDescription:
    "Tietosuojaseloste yhteydenotto-, tarjous- ja näytepyyntölomakkeiden henkilötietojen käsittelystä.",
  retentionMonths: INQUIRY_RETENTION_MONTHS,
  dataCategories,
  sections: [
    {
      id: "tarkoitus-ja-oikeusperuste",
      title: "Mihin tietoja käytetään",
      blocks: [
        {
          type: "paragraph",
          text: "Käsittelemme tietoja, jotta voimme vastata yhteydenottoon, valmistella tuote-, asennus- tai näytetarjousta ja hoitaa sovitun pyynnön jatkotoimet.",
        },
        {
          type: "paragraph",
          text: "Käsittelyn oikeusperuste on GDPR:n 6 artiklan 1 kohdan b alakohdan mukainen rekisteröidyn pyynnöstä toteutettava toimenpide ennen sopimuksen tekemistä.",
        },
      ],
    },
    {
      id: "kerattavat-tiedot",
      title: "Kerättävät tiedot ja pakolliset kentät",
      blocks: [
        {
          type: "paragraph",
          text: "Lomakkeissa käsitellään vain pyynnön hoitamiseen tarvittavia tietoja:",
        },
        { type: "list", items: dataCategories },
        {
          type: "paragraph",
          text: "Kaikissa lomakkeissa nimi, vähintään yksi yhteystieto sekä toivottu yhteydenottotapa ovat pakollisia. Yhteydenottolomakkeessa myös viesti on pakollinen. Tarjouspyynnössä valitaan pyynnön aihe ja näytepyynnössä tuote sekä toivottu näytteen toimitus- tai esittelytapa. Jos pakollisia tietoja ei anneta, pyyntöä ei voida lähettää tai käsitellä.",
        },
        {
          type: "paragraph",
          text: "Tarjouspyynnön tuotetunnisteet, pinta-ala, määrä, kunta, postinumero, ajankohta ja asennuskiinnostus sekä tarjous- ja näytepyynnön lisätiedot ovat vapaaehtoisia. Näytepyyntölomake ei pyydä toimitusosoitetta tässä vaiheessa.",
        },
        {
          type: "paragraph",
          text: "Lomake välittää palvelimelle avaamishetken teknisen aikaleiman. Palvelin tarkistaa sen avulla lähetyksen ajoituksen automaattisten lähetysten torjumiseksi. Aikaleimaa ei lisätä Telegram-ilmoitukseen.",
        },
      ],
    },
    {
      id: "vastaanottajat-ja-toimitus",
      title: "Vastaanottajat ja pyynnön toimittaminen",
      blocks: [
        {
          type: "paragraph",
          text: "Tietoja käsittelevät vain rekisterinpitäjän henkilöt, joilla on niitä työtehtäviensä vuoksi tarve käsitellä.",
        },
        {
          type: "paragraph",
          text: `Jos Telegram-toimitus on asetettu käyttöön, palvelin välittää jäsennellyn ilmoituksen Telegram Bot API -palvelun kautta rekisterinpitäjälle. Ilmoituksessa näkyy Poistettava viimeistään -päivä, joka on ${INQUIRY_RETENTION_MONTHS} kuukautta vastaanotosta. Jos toimitusta ei ole asetettu käyttöön, lomake ilmoittaa tilapäisestä esteestä eikä väitä, että pyyntö olisi välitetty.`,
        },
        {
          type: "paragraph",
          text: "Telegramin oma säilytysaika, käsittelyalue ja mahdolliset tiedonsiirron suojatoimet määräytyvät palveluntarjoajan käytäntöjen mukaan. Rekisterinpitäjä poistaa omat ilmoituskopionsa erillisen säilytysmenettelyn mukaisesti.",
        },
      ],
    },
    {
      id: "sailytysaika",
      title: "Säilytysaika ja poistaminen",
      blocks: [
        {
          type: "paragraph",
          text: `Rekisterinpitäjä säilyttää pyynnön ja omat työskentelykopionsa enintään ${INQUIRY_RETENTION_MONTHS} kuukautta pyynnön vastaanottamisesta. Tämän jälkeen ne poistetaan, ellei pidempi säilytys ole tarpeen lakisääteisen velvoitteen tai oikeudellisen vaateen laatimisen, esittämisen tai puolustamisen vuoksi.`,
        },
        {
          type: "paragraph",
          text: "Sovellus ei luo omaa tietokantaa yhteydenotoista. Lähetyksen yksilöivää tunnistetta käytetään palvelimen muistissa vain välittömän kaksoislähetyksen estämiseen. Rekisterinpitäjä poistaa Telegram-ilmoitukset ja muut omat työskentelykopiot erillisen säilytysmenettelyn mukaisesti; sovellus ei poista palveluntarjoajan historiallisia tietoja automaattisesti.",
        },
      ],
    },
    {
      id: "oikeudet",
      title: "Oikeutesi",
      blocks: [
        {
          type: "paragraph",
          text: "Voit pyytää pääsyä tietoihisi, niiden oikaisemista tai poistamista sekä käsittelyn rajoittamista. Voit myös vastustaa käsittelyä ja pyytää tietojen siirtämistä soveltuvan lain mukaisesti.",
        },
        {
          type: "paragraph",
          text: "Voit tehdä pyynnön rekisterinpitäjälle julkaistuun puhelinnumeroon soittamalla tai postitse rekisteröityyn osoitteeseen. Sinulla on myös oikeus tehdä valitus toimivaltaiselle valvontaviranomaiselle.",
        },
      ],
    },
    {
      id: "ei-markkinointia",
      title: "Ei markkinointia tai automaattisia päätöksiä",
      blocks: [
        {
          type: "paragraph",
          text: "Lomakkeella annettuja tietoja ei käytetä markkinointiin. Käsittelyyn ei liity profilointia eikä automaattista päätöksentekoa.",
        },
      ],
    },
  ],
} as const satisfies PrivacyNotice;

export function getPrivacyNoticeByPath(path: LocalPath): PrivacyNotice | null {
  return path === privacyNotice.path ? privacyNotice : null;
}
