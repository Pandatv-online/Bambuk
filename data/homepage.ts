import type { HomepageContent } from "./types";

export const homepageContent: HomepageContent = {
  locale: "fi",
  status: "review",
  title: "Tietoa bambulattioista ja bambuterasseista",
  metaDescription:
    "Tutustu bambulattioiden, bambuterassien ja muiden bambutuotteiden suunniteltuihin tuoteryhmiin. Suomen valikoima ja palvelutiedot vahvistetaan ennen julkaisua.",
  primaryCta: {
    label: "Pyydä tarjous",
    href: "/fi#yhteys",
  },
  secondaryCta: {
    label: "Tutustu tuotteisiin",
    href: "/fi#tuoteryhmat",
  },
  hero: {
    eyebrow: "Bambutuotteiden tuoteryhmät",
    summary:
      "Tutustu suunniteltuihin tuoteryhmiin ja valinnan lähtökohtiin. Suomen valikoima ja palvelutiedot vahvistetaan ennen julkaisua.",
    image: {
      src: "/images/home/hero-natural.jpg",
      alt: "Puunsävyinen lattia valoisassa ruokailutilassa",
      rightsId: "reference-home-slide-18",
    },
  },
  introduction: {
    heading: "Bambulattiat",
    body:
      "Kun vertailet bambulattioita, aloita tilasta ja siitä, millaista ilmettä etsit. Tuotteen rakenne, väri, pinta, viimeistely ja mitat tarkistetaan aina tuotekohtaisista tiedoista. Sisätilojen lattiat, ulkotilojen terassilaudat, levyt, listat sekä asennus- ja hoitotuotteet muodostavat omat tuoteryhmänsä, eikä yhden ryhmän tietoja voi soveltaa toiseen. Tältä sivulta saat yleiskuvan suunnitellusta rakenteesta ja näet, mitä tietoja valinnassa kannattaa verrata. Suomen valikoima julkaistaan vasta, kun tuotteet, niiden tekniset tiedot ja kaupalliset ehdot on vahvistettu. Siihen asti voit tutustua tuoteryhmiin ja valmistella kohteesi lähtötiedot huolellisesti yhteydenottoa varten.",
    link: { label: "Tutustu tuotteisiin", href: "/fi#tuoteryhmat" },
  },
  categorySection: {
    eyebrow: "Tuotteet",
    heading: "Tuoteryhmät",
    introduction:
      "Tutustu suunniteltuun tuoteryhmärakenteeseen. Suomen valikoima julkaistaan vasta hyväksyttyjen tuotetietojen perusteella.",
  },
  gallery: {
    eyebrow: "Kuvagalleria",
    heading: "Materiaaleja ja sisätiloja",
    introduction:
      "Kuvat havainnollistavat erilaisia sisätiloja, lattiasävyjä ja pintojen ilmettä. Kuvien tuote- ja projektitiedot lisätään vasta vahvistettuina.",
    items: [
      {
        id: "project-01",
        alt: "Keittiö, jossa on lämminsävyinen puulattia",
        image: {
          src: "/images/home/project-01.jpg",
          alt: "Keittiö, jossa on lämminsävyinen puulattia",
          rightsId: "reference-gallery-311",
        },
      },
      {
        id: "project-02",
        alt: "Vaalea makuuhuone ja tumma puunsävyinen lattia",
        image: {
          src: "/images/home/project-02.jpg",
          alt: "Vaalea makuuhuone ja tumma puunsävyinen lattia",
          rightsId: "reference-gallery-312",
        },
      },
      {
        id: "project-03",
        alt: "Olohuone ja luonnollisen sävyinen puulattia",
        image: {
          src: "/images/home/project-03.jpg",
          alt: "Olohuone ja luonnollisen sävyinen puulattia",
          rightsId: "reference-gallery-339",
        },
      },
      {
        id: "project-04",
        alt: "Sisätila, jossa on hillityn harmaa puulattia",
        image: {
          src: "/images/home/project-04.jpg",
          alt: "Sisätila, jossa on hillityn harmaa puulattia",
          rightsId: "reference-gallery-147",
        },
      },
      {
        id: "project-05",
        alt: "Valoisa huone ja pitkälautainen lattia",
        image: {
          src: "/images/home/project-05.jpg",
          alt: "Valoisa huone ja pitkälautainen lattia",
          rightsId: "reference-gallery-148",
        },
      },
      {
        id: "project-06",
        alt: "Ruokailutila ja lämmin puulattia",
        image: {
          src: "/images/home/project-06.jpg",
          alt: "Ruokailutila ja lämmin puulattia",
          rightsId: "reference-gallery-149",
        },
      },
      {
        id: "project-07",
        alt: "Moderni sisätila ja vaalea puulattia",
        image: {
          src: "/images/home/project-07.jpg",
          alt: "Moderni sisätila ja vaalea puulattia",
          rightsId: "reference-gallery-333",
        },
      },
      {
        id: "project-08",
        alt: "Avara sisätila ja ruskeasävyinen lattia",
        image: {
          src: "/images/home/project-08.jpg",
          alt: "Avara sisätila ja ruskeasävyinen lattia",
          rightsId: "reference-gallery-330",
        },
      },
    ],
  },
  decisionTopics: {
    eyebrow: "Valinnan tueksi",
    heading: "Miksi bambu?",
    introduction:
      "Sopiva tuote löytyy vertaamalla ilmettä, tuotekohtaisia tietoja ja asennuksen lähtökohtia.",
    items: [
      {
        title: "Ilme",
        body: "Väri, kuvio, pinta ja viimeistely määritellään tuotekohtaisesti.",
      },
      {
        title: "Tekniset tiedot",
        body: "Mitat, rakenne ja muut tekniset tiedot näytetään vain lähteistettyinä.",
      },
      {
        title: "Kohteen suunnittelu",
        body: "Tuote ja asennustapa tarkistetaan kohteen lähtötietojen perusteella.",
      },
    ],
  },
  featuredProducts: {
    eyebrow: "Tuotevalikoima",
    heading: "Tuotevalikoima",
    pendingMessage:
      "Suomen tuotevalikoimaa ei ole vielä vahvistettu. Tuotteita ei julkaista ennen hyväksyttyjä tuotetietoja.",
  },
  installation: {
    eyebrow: "Asennuspalvelu",
    heading: "Asennus osana kokonaisuutta",
    body:
      "Tuotteen valinta ja asennuksen suunnittelu kuuluvat samaan asiakaspolkuun. Kysy tarjouksen yhteydessä myös asennuksesta.",
    pendingMessage:
      "Palvelun sisältö, valmistelut, hinnoittelu ja palvelualue vahvistetaan ennen julkaisua.",
    image: {
      src: "/images/home/installation.jpg",
      alt: "Lattialaudan mittausta asennusta varten",
      rightsId: "reference-news-installation-17",
    },
    action: { label: "Pyydä tarjous", href: "/fi#yhteys" },
  },
  guides: {
    eyebrow: "Tietoa bambusta",
    heading: "Tietoa valinnan tueksi",
    items: [
      {
        title: "Tuotteen valinta",
        body: "Vertaa tuoteryhmiä ja rajaa vaihtoehtoja kohteen mukaan.",
        link: { label: "Tutustu tuotteisiin", href: "/fi#tuoteryhmat" },
      },
      {
        title: "Tekniset tiedot",
        body: "Tarkista tuotekohtaiset ominaisuudet ja dokumentit ennen päätöstä.",
      },
      {
        title: "Asennus ja hoito",
        body: "Suunnittele asennus ja tuotekohtainen hoito osana kokonaisuutta.",
        link: { label: "Asennuspalvelu", href: "/fi#asennus" },
      },
    ],
  },
  finalCta: {
    title: "Kerro meille kohteestasi",
    body:
      "Tarjouskanava avataan, kun suomalaiset yhteystiedot ja lomakkeen vastaanottaja on vahvistettu.",
    action: { label: "Pyydä tarjous", status: "pending" },
  },
  developmentNotice: "Yritystiedot täydennetään ennen julkaisua.",
};
