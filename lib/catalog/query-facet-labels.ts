const colorLabels: Readonly<Record<string, string>> = {
  "Natūrali": "Luonnollinen",
  "Karbonizuota": "Karbonisoitu",
  "Balinta kakava": "Vaalea kaakao",
  "Vanilla": "Vanilla",
  "Tamsi viskio": "Tumma viski",
  "Šviesiai karbonizuota": "Vaaleasti karbonisoitu",
  "Karbonizuota antika": "Karbonisoitu antiikki",
  "Miško spalvos": "Metsänsävy",
  "Tamsiai karbonizuota": "Tummaksi karbonisoitu",
  "Deginta žalsva": "Poltettu vihreä",
  "Merbau": "Merbau",
  "Antikos perlas": "Antiikkihelmi",
  "Pagal alyvos spalvą": "Öljyn sävyn mukaan",
  "Sedona": "Sedona",
  "Skaidri": "Kirkas",
  "Šviesi vanilla": "Vaalea Vanilla",
  "Bambukas": "Bambu",
  "Espresso": "Espresso",
};

const surfaceLabels: Readonly<Record<string, string>> = {
  "Natūralus bambuko stiebas": "Luonnollinen bambuvarsi",
  "Paruoštas lakavimui / alyvavimui": "Valmis lakattavaksi tai öljyttäväksi",
  "Paruošta lakavimui / alyvavimui": "Valmis lakattavaksi tai öljyttäväksi",
};

const finishLabels: Readonly<Record<string, string>> = {
  "UV Treffert lakas": "Treffert UV-lakka",
  "Lengvai šukuotos, dažytos, UV lakuotos":
    "Kevyesti harjattu, värjätty ja UV-lakattu",
  "Šukuotos, dažytos, UV lakuotos": "Harjattu, värjätty ja UV-lakattu",
  "Grandytos, šukuotos": "Kaavittu ja harjattu",
  "Grandytos, šukuotos (1 iš 2)": "Kaavittu ja harjattu (osa 1/2)",
  "Lengva pjūklo (2 iš 2)": "Kevyesti sahattu (osa 2/2)",
  "Bona naturals lakas": "Bona Naturals -lakka",
  "Rankų darbo grandytos, lengvai šukuotos":
    "Käsinkaavittu ja kevyesti harjattu",
  "Rankų darbo grandytos (1 iš 2)": "Käsinkaavittu (osa 1/2)",
  "Lygi": "Sileä",
  "Bona matinis lakas": "Bona-mattalakka",
  "Dažytos, lakuotos": "Värjätty ja lakattu",
  "Natūralus bambuko stiebas": "Luonnollinen bambuvarsi",
  "Lengvai grandytos ir šukuotos": "Kevyesti kaavittu ja harjattu",
};

export type CatalogAttributeFacet = "color" | "surface" | "finish";

export function getCatalogAttributeLabel(
  facet: CatalogAttributeFacet,
  sourceValue: string,
): string | null {
  const labels =
    facet === "color"
      ? colorLabels
      : facet === "surface"
        ? surfaceLabels
        : finishLabels;
  return labels[sourceValue] ?? null;
}

export function toCatalogFacetValue(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fi")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
