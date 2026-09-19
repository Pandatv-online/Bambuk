import type {
  InformationHub,
  InformationPage,
  InformationPagePath,
  InformationPageSlug,
  PublishedInformationHub,
  PublishedInformationPage,
} from "./types";
import { informationSources } from "./sources";

const informationHub = {
  path: "/fi/tietoa-bambusta",
  status: "published",
  eyebrow: "Valinnan tueksi",
  title: "Tietoa bambusta",
  summary:
    "Tiivis tietopaketti bambutuotteiden valmistuksesta, rakenteista, pinnoista, asennuksesta, hoidosta ja lattialämmityksestä. Tuotekohtaiset tiedot tarkistetaan aina tuotteen omista asiakirjoista.",
  metaDescription:
    "Lue lähdepohjaiset oppaat bambutuotteiden valmistuksesta, rakenteista, pinnoista, asennuksesta, hoidosta ja lattialämmityksestä.",
} as const satisfies InformationHub;

const informationPages = [
  {
    slug: "valmistus",
    path: "/fi/tietoa-bambusta/valmistus",
    status: "published",
    eyebrow: "Materiaalista tuotteeksi",
    title: "Bambutuotteiden valmistus",
    summary:
      "Valmistustapa vaikuttaa tuotteen rakenteeseen ja ulkonäköön. Tämä yleiskuva ei korvaa tuotekohtaista teknistä asiakirjaa.",
    metaDescription:
      "Yleiskuva bambulattioiden valmistusvaiheista ja siitä, miksi tuotekohtainen rakenne on tarkistettava erikseen.",
    sourceIds: [
      "manufacturing-process-snapshot",
      "faq-snapshot",
      "structure-patterns-snapshot",
    ],
    relatedCategoryLinks: [
      {
        categoryId: "2",
        label: "Bambulattiat",
        href: "/fi/tuotteet/sisalattiat",
        sourceIds: ["manufacturing-process-snapshot", "faq-snapshot"],
      },
    ],
    sections: [
      {
        id: "raaka-aineen-valmistelu",
        title: "Raaka-aineen valmistelu",
        statements: [
          {
            text: "Arkistoidussa valmistajan kuvauksessa bambun varsi halkaistaan pitkittäisiksi suikaleiksi. Suikaleet oikaistaan ja kuivataan ennen seuraavia työvaiheita.",
            applicability:
              "Yleinen valmistusprosessin kuvaus; yksittäisen tuotteen raaka-aine ja työvaiheet tarkistetaan sen omasta aineistosta.",
            sourceIds: ["faq-snapshot"],
          },
        ],
      },
      {
        id: "rakenteen-muodostaminen",
        title: "Rakenteen muodostaminen",
        statements: [
          {
            text: "Valmistajan aineisto kuvaa suikaleiden liittämistä ja puristamista levyksi. Suikaleiden suunta ja käsittelytapa muodostavat erilaisia rakenteita.",
            applicability:
              "Koskee aineistossa kuvattuja bambulattiarakenteita yleisellä tasolla, ei kaikkia valikoiman tuotteita.",
            sourceIds: ["faq-snapshot", "structure-patterns-snapshot"],
          },
        ],
      },
      {
        id: "viimeistely-ja-liitos",
        title: "Viimeistely ja liitos",
        statements: [
          {
            text: "Puristettu aihio työstetään käyttötarkoituksen mukaiseen muotoon. Lattialaudan liitos ja pintakäsittely määräytyvät tuotteen rakenteen mukaan.",
            applicability:
              "Tuotteen liitos, pinta ja asennustapa vahvistetaan tuotesivulta ja ajantasaisesta teknisestä ohjeesta.",
            sourceIds: ["manufacturing-process-snapshot", "faq-snapshot"],
          },
        ],
      },
    ],
  },
  {
    slug: "rakenne-varit-ja-pinnat",
    path: "/fi/tietoa-bambusta/rakenne-varit-ja-pinnat",
    status: "published",
    eyebrow: "Ulkonäkö ja rakenne",
    title: "Rakenteet, värit ja pinnat",
    summary:
      "Suikaleiden suunta, materiaalin käsittely, reunaprofiili ja pintakäsittely vaikuttavat valmiin pinnan ilmeeseen.",
    metaDescription:
      "Tutustu bambulattioiden rakenteisiin, väreihin, reunaprofiileihin ja pintakäsittelyihin ilman tuotekohtaisia yleistyksiä.",
    sourceIds: [
      "structure-patterns-snapshot",
      "edge-profiles-snapshot",
      "colors-snapshot",
      "finishes-snapshot",
      "faq-snapshot",
    ],
    relatedCategoryLinks: [
      {
        categoryId: "2",
        label: "Bambulattiat",
        href: "/fi/tuotteet/sisalattiat",
        sourceIds: ["structure-patterns-snapshot", "colors-snapshot"],
      },
    ],
    sections: [
      {
        id: "suikaleiden-suunta",
        title: "Vaaka- ja pystyrakenne",
        statements: [
          {
            text: "Vaakarakenteessa bambusuikaleiden leveä pinta jää näkyviin. Pystyrakenteessa suikaleet asetetaan kyljelleen, jolloin pinnan linjat ovat kapeampia.",
            applicability:
              "Ulkonäköä kuvaava ero koskee vain tuotteita, joiden rakenne on ilmoitettu vaaka- tai pystyrakenteeksi.",
            sourceIds: ["structure-patterns-snapshot", "faq-snapshot"],
          },
        ],
      },
      {
        id: "puristettu-kuiturakenne",
        title: "Puristettu kuiturakenne",
        statements: [
          {
            text: "Valmistajan aineistossa puristettu kuiturakenne tehdään käsittelemällä bambusuikaleet kuiduiksi ja puristamalla ne aihioksi, josta laudan muoto työstetään.",
            applicability:
              "Yleinen rakennetyypin kuvaus; se ei määritä yksittäisen tuotteen koostumusta tai suorituskykyä.",
            sourceIds: ["structure-patterns-snapshot"],
          },
        ],
      },
      {
        id: "vari-ja-pinta",
        title: "Väri ja pintakäsittely",
        statements: [
          {
            text: "Arkistoitu väriopas erottaa vaalean luonnollisen sävyn ja lämpökäsittelyllä tummennetun, karamellinsävyisen pinnan. Lakka tai öljy voi tuoda valikoimaan muita sävyjä.",
            applicability:
              "Sävy ja pintakäsittely tarkistetaan aina tuotekohtaisesti; näytön väri ei ole tuotenäyte.",
            sourceIds: ["colors-snapshot", "finishes-snapshot"],
          },
        ],
      },
      {
        id: "reunaprofiili",
        title: "Reunaprofiili",
        statements: [
          {
            text: "Suora reuna muodostaa yhtenäisemmän pinnan, kun taas viistetty reuna korostaa lautojen välistä saumaa.",
            applicability:
              "Koskee vain lattialautoja, joiden tuotetiedoissa kyseinen reunaprofiili on vahvistettu.",
            sourceIds: ["edge-profiles-snapshot"],
          },
        ],
      },
    ],
  },
  {
    slug: "asennus-ja-hoito",
    path: "/fi/tietoa-bambusta/asennus-ja-hoito",
    status: "published",
    eyebrow: "Suunnittelu ja ylläpito",
    title: "Asennus ja hoito",
    summary:
      "Asennustapa ja hoito valitaan tuotteen rakenteen, pintakäsittelyn ja kohteen olosuhteiden mukaan.",
    metaDescription:
      "Yleiset bambulattian asennuksen ja hoidon lähtökohdat sekä asiat, jotka vahvistetaan hankekohtaisessa tarjouksessa.",
    sourceIds: [
      "installation-methods-snapshot",
      "installation-care-snapshot",
      "finishes-snapshot",
    ],
    relatedCategoryLinks: [
      {
        categoryId: "2",
        label: "Bambulattiat",
        href: "/fi/tuotteet/sisalattiat",
        sourceIds: ["installation-methods-snapshot", "installation-care-snapshot"],
      },
    ],
    reviewNotes: [
      "Arkistoitujen ohjeiden numeeriset olosuhde- ja asennusarvot on jätetty julkaisematta, kunnes tuotekohtainen ajantasaisuus on vahvistettu.",
    ],
    sections: [
      {
        id: "asennustavan-valinta",
        title: "Asennustapa valitaan tuotteelle",
        statements: [
          {
            text: "Valmistajan aineisto käsittelee uivaa asennusta, kiinnittämistä ja alustaan liimaamista. Sopivaa menetelmää ei voi päätellä pelkästä materiaalin nimestä.",
            applicability:
              "Menetelmä koskee tuotetta vain, jos se on sallittu kyseisen tuotteen ajantasaisessa asennusohjeessa.",
            sourceIds: ["installation-methods-snapshot"],
          },
        ],
      },
      {
        id: "alusta-ja-valmistelu",
        title: "Alusta ja valmistelu",
        statements: [
          {
            text: "Asennusohjeen yleinen lähtökohta on puhdas, kuiva ja tasainen alusta. Mittaus- ja valmistelutapa riippuu alustasta, tuotteesta ja valitusta asennusmenetelmästä.",
            applicability:
              "Yleinen suunnitteluperiaate; hyväksyttävät arvot ja työvaiheet vahvistetaan tuotteen ohjeesta ja kohteen arviossa.",
            sourceIds: ["installation-methods-snapshot", "installation-care-snapshot"],
          },
        ],
      },
      {
        id: "hoito-pinnan-mukaan",
        title: "Hoito pinnan mukaan",
        statements: [
          {
            text: "Lakattu ja öljytty pinta tarvitsevat omalle pintakäsittelylleen sopivat puhdistus- ja huolto-ohjeet. Hoitotuote valitaan tuotteen pintatiedon perusteella.",
            applicability:
              "Koskee sisälattioita yleisellä tasolla; tarkka hoito-ohje ja yhteensopiva hoitotuote tarkistetaan tuotekohtaisesti.",
            sourceIds: ["installation-care-snapshot", "finishes-snapshot"],
          },
        ],
      },
      {
        id: "tarjous-vahvistaa-kohteen",
        title: "Kohteen tiedot vahvistetaan tarjouksessa",
        statements: [
          {
            text: "Asennuksen toteutustapa, työvaiheet, kohteen valmistelu, palvelualue, hinta ja ehdot vahvistetaan kirjallisessa tarjouksessa.",
            applicability:
              "Kaikki asennuskohteet; sivu ei lupaa tiettyä menetelmää, aluetta, hintaa tai sopimusehtoa.",
            sourceIds: ["installation-methods-snapshot", "installation-care-snapshot"],
          },
        ],
      },
    ],
  },
  {
    slug: "lattialammitys",
    path: "/fi/tietoa-bambusta/lattialammitys",
    status: "published",
    eyebrow: "Tuotekohtainen suunnittelu",
    title: "Bambulattia ja lattialämmitys",
    summary:
      "Lattialämmityksen yhteensopivuus tarkistetaan tuotteesta, lattiarakenteesta ja lämmitysjärjestelmästä ennen asennusta.",
    metaDescription:
      "Mitä bambulattian ja lattialämmityksen yhteensopivuudesta pitää tarkistaa ilman ristiriitaisia lämpötilalukuja.",
    sourceIds: [
      "underfloor-heating-snapshot",
      "installation-care-snapshot",
      "faq-snapshot",
    ],
    relatedCategoryLinks: [
      {
        categoryId: "2",
        label: "Bambulattiat",
        href: "/fi/tuotteet/sisalattiat",
        sourceIds: ["underfloor-heating-snapshot", "faq-snapshot"],
      },
    ],
    reviewNotes: [
      "Arkistoitujen lähteiden kesken ristiriitaiset pintalämpötilarajat on tarkoituksella jätetty julkaisematta.",
      "Arkistoidut lämmönjohtavuusluvut on jätetty julkaisematta ilman tuotteen rakennetta ja testiraporttia.",
    ],
    sections: [
      {
        id: "yhteensopivuus",
        title: "Yhteensopivuus tarkistetaan tuotteesta",
        statements: [
          {
            text: "Kaikkia bambulattioita ei käsitellä yhtenä tuoteryhmänä lattialämmitystä suunniteltaessa. Tuotteen rakenne, paksuus ja asennustapa on tarkistettava sen omista teknisistä tiedoista.",
            applicability:
              "Vain tuotteet, joiden ajantasainen tekninen aineisto nimenomaisesti sallii käytön kyseisen lattialämmitysjärjestelmän kanssa.",
            sourceIds: ["underfloor-heating-snapshot", "faq-snapshot"],
          },
        ],
      },
      {
        id: "jarjestelman-tiedot",
        title: "Tarvittavat lähtötiedot",
        statements: [
          {
            text: "Ennen materiaalivalintaa selvitetään lämmitysjärjestelmä, alusta, lattiarakenne ja suunniteltu asennusmenetelmä. Näiden perusteella tarkistetaan tuotteen soveltuvuus ja voimassa oleva ohje.",
            applicability:
              "Hankekohtainen tarkistus; sivu ei määritä järjestelmälle lämpötila- tai kosteusarvoja.",
            sourceIds: ["underfloor-heating-snapshot", "installation-care-snapshot"],
          },
        ],
      },
      {
        id: "ei-yleista-raja-arvoa",
        title: "Ei yleistä raja-arvoa",
        statements: [
          {
            text: "Tällä sivulla ei julkaista yleistä pintalämpötilan raja-arvoa. Oikea arvo pyydetään kyseisen tuotteen ajantasaisesta ohjeesta ja vahvistetaan kohteen suunnittelussa.",
            applicability:
              "Kaikki lattialämmityskohteet, kunnes tuotekohtainen ohje ja järjestelmän ehdot on tarkistettu.",
            sourceIds: ["installation-care-snapshot", "faq-snapshot"],
          },
        ],
      },
    ],
  },
  {
    slug: "ukk",
    path: "/fi/tietoa-bambusta/ukk",
    status: "published",
    eyebrow: "Usein kysyttyä",
    title: "Kysymyksiä bambulattioista",
    summary:
      "Vastaukset auttavat alkuun. Tuotekohtaiset ominaisuudet, asennus ja kaupalliset ehdot tarkistetaan aina erikseen.",
    metaDescription:
      "Selkeät vastaukset bambulattian rakenteesta, väristä, asennuksesta, hoidosta ja lattialämmityksestä.",
    sourceIds: [
      "faq-snapshot",
      "structure-patterns-snapshot",
      "colors-snapshot",
      "installation-methods-snapshot",
      "installation-care-snapshot",
      "finishes-snapshot",
      "underfloor-heating-snapshot",
    ],
    relatedCategoryLinks: [
      {
        categoryId: "2",
        label: "Bambulattiat",
        href: "/fi/tuotteet/sisalattiat",
        sourceIds: ["faq-snapshot"],
      },
    ],
    sections: [
      {
        id: "mita-bambulattia-on",
        title: "Mitä bambulattia on?",
        statements: [
          {
            text: "Bambulattian valmistuksessa bamburaaka-aine työstetään suikaleiksi tai kuiduiksi ja kootaan lattialaudan rakenteeksi. Rakenne voi vaihdella tuotteittain.",
            applicability:
              "Yleinen määritelmä; tarkka kerros- ja materiaalirakenne luetaan tuotteen teknisistä tiedoista.",
            sourceIds: ["faq-snapshot", "structure-patterns-snapshot"],
          },
        ],
      },
      {
        id: "rakenne-erot",
        title: "Miten vaaka- ja pystyrakenne eroavat?",
        statements: [
          {
            text: "Ero syntyy suikaleiden asennosta: vaakarakenteessa leveä pinta näkyy, pystyrakenteessa suikaleiden kapeat sivut muodostavat tiheämmän linjan.",
            applicability:
              "Ulkonäköä kuvaava vastaus vaaka- ja pystyrakenteisille tuotteille; se ei vertaile suorituskykyä.",
            sourceIds: ["faq-snapshot", "structure-patterns-snapshot"],
          },
        ],
      },
      {
        id: "vari-erot",
        title: "Mitä luonnollinen ja tummennettu sävy tarkoittavat?",
        statements: [
          {
            text: "Luonnollinen bambusävy on vaalea. Tummennettu, karamellinsävyinen ilme syntyy raaka-aineen lämpökäsittelyssä, ja pintakäsittely voi muuttaa lopullista sävyä.",
            applicability:
              "Värisanasto koskee aineistossa kuvattuja lattioita; tuotteen ilmoitettu sävy ja pinta ratkaisevat.",
            sourceIds: ["faq-snapshot", "colors-snapshot"],
          },
        ],
      },
      {
        id: "asennus",
        title: "Miten bambulattia asennetaan?",
        statements: [
          {
            text: "Valmistajan yleisaineisto tuntee useita asennustapoja. Sallittu menetelmä valitaan aina tuotteen liitoksen, alustan ja kohteen olosuhteiden perusteella.",
            applicability:
              "Tuotekohtainen asennusohje ja hankkeen kirjallinen tarjous ovat määrääviä.",
            sourceIds: ["installation-methods-snapshot"],
          },
        ],
      },
      {
        id: "hoito",
        title: "Miten lattiaa hoidetaan?",
        statements: [
          {
            text: "Hoito valitaan pintakäsittelyn mukaan. Lakattua ja öljyttyä pintaa ei pidä käsitellä samalla oletusohjeella.",
            applicability:
              "Sisälattioiden yleisohje; tuotteen hoito-ohje ja hoitotuotteen yhteensopivuus tarkistetaan ennen käyttöä.",
            sourceIds: ["installation-care-snapshot", "finishes-snapshot"],
          },
        ],
      },
      {
        id: "lattialammitys",
        title: "Sopiiko bambulattia lattialämmityksen päälle?",
        statements: [
          {
            text: "Soveltuvuus riippuu tuotteesta ja järjestelmästä. Yhteensopivuus, asennustapa ja käyttöehdot vahvistetaan ennen materiaalin tilaamista.",
            applicability:
              "Vain tuotteet ja järjestelmät, joiden yhteensopivuus on vahvistettu ajantasaisista asiakirjoista.",
            sourceIds: ["underfloor-heating-snapshot", "faq-snapshot"],
          },
        ],
      },
    ],
  },
] as const satisfies readonly InformationPage[];

function toPublishedInformationPage(
  page: InformationPage,
): PublishedInformationPage | undefined {
  if (page.status !== "published") return undefined;

  return {
    slug: page.slug,
    path: page.path,
    eyebrow: page.eyebrow,
    title: page.title,
    summary: page.summary,
    metaDescription: page.metaDescription,
    sections: page.sections.map((section) => ({
      id: section.id,
      title: section.title,
      statements: section.statements.map((statement) => ({
        text: statement.text,
        applicability: statement.applicability,
      })),
    })),
    sources: page.sourceIds.flatMap((sourceId) => {
      const source = informationSources.find(({ id }) => id === sourceId);
      return source ? [{ label: source.labelFi }] : [];
    }),
    relatedCategoryLinks: (page.relatedCategoryLinks ?? []).map((link) => ({
      label: link.label,
      href: link.href,
    })),
  };
}

export function getPublishedInformationHub(): PublishedInformationHub {
  if (informationHub.status !== "published") {
    throw new Error("The information hub is not published.");
  }

  return {
    path: informationHub.path,
    eyebrow: informationHub.eyebrow,
    title: informationHub.title,
    summary: informationHub.summary,
    metaDescription: informationHub.metaDescription,
  };
}

/** @internal Test seam for validating source-bound authoring records. */
export function getInformationAuditInput(): Readonly<{
  hub: InformationHub;
  pages: readonly InformationPage[];
}> {
  return { hub: informationHub, pages: informationPages };
}

export function getPublishedInformationPages(): readonly PublishedInformationPage[] {
  return informationPages.flatMap((page) => {
    const publishedPage = toPublishedInformationPage(page);
    return publishedPage ? [publishedPage] : [];
  });
}

export function getPublishedInformationPageBySlug(
  slug: string,
): PublishedInformationPage | undefined {
  const page = informationPages.find((candidate) => candidate.slug === slug);
  return page ? toPublishedInformationPage(page) : undefined;
}

export function getPublishedInformationPageByPath(
  path: string,
): PublishedInformationPage | undefined {
  const page = informationPages.find((candidate) => candidate.path === path);
  return page ? toPublishedInformationPage(page) : undefined;
}

export function isInformationPageSlug(
  slug: string,
): slug is InformationPageSlug {
  return getPublishedInformationPageBySlug(slug) !== undefined;
}

export function createInformationPagePath(
  slug: InformationPageSlug,
): InformationPagePath {
  return `/fi/tietoa-bambusta/${slug}`;
}
