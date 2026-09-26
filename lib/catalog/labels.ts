const categoryNames: Readonly<Record<number, readonly [string, string]>> = {
  0: ["Tuotteet", "tuotteet"],
  2: ["Bambulattiat", "sisalattiat"],
  3: ["Bambulevyt", "bambulevyt"],
  5: ["Jalkalistat ja porrasosat", "jalkalistat-ja-porrasosat"],
  6: ["Lattian asennustuotteet", "lattian-asennustuotteet"],
  7: ["Bambusisustus", "bambusisustus"],
  21: ["Ulkotuotteet", "ulkotuotteet"],
  26: ["Lattian hoitotuotteet", "lattian-hoitotuotteet"],
  32: ["Bambuterassilaudat", "terassilaudat"],
  34: ["Terassin asennustarvikkeet", "asennustarvikkeet"],
  36: ["Terassin hoitotuotteet", "hoitotuotteet"],
  38: ["Väriharmonia", "variharmonia"],
  39: ["Luonnon kosketus", "luonnon-kosketus"],
  40: ["Antiikki", "antiikki"],
  41: ["Bambu", "bambu"],
  43: ["Bambukalustelevyt", "kalustelevyt"],
  47: ["Bambusäleet", "bambusaleet"],
  48: ["Bambutapetit", "bambutapetit"],
  55: ["Klassikko", "klassikko"],
  59: ["Bambuseinäkkeet", "bambuseinakkeet"],
  61: ["Ulkoverhous- ja räystäslaudat", "ulkoverhous-ja-raystaslaudat"],
  65: ["Kalanruoto", "kalanruoto"],
};

const specificationLabels: Readonly<Record<string, string>> = {
  Apdaila: "Viimeistely",
  Aukštis: "Korkeus",
  "Bazinė grindlentės spalva": "Lattialaudan perussävy",
  "Bazinė grindų spalva": "Lattian perussävy",
  "Briaunos tipas": "Reunaprofiili",
  "Drėgmės kiekis": "Kosteuspitoisuus",
  "Formaldehido emisija": "Formaldehydipäästö",
  "Grindinis šildymas": "Lattialämmitys",
  "Grindų paviršiaus spalva": "Lattian pintasävy",
  "Grindų skaičiuoklė": "Lattialaskuri",
  "Grindų spalva": "Lattian sävy",
  Ilgis: "Pituus",
  "Kaina iš viso": "Kokonaishinta",
  "Klojimo būdas": "Asennustapa",
  "m² pakuotėse": "Pakkausten pinta-ala",
  Matmenys: "Mitat",
  "Matmenys (mm)": "Mitat (mm)",
  Montavimas: "Asennus",
  "Pakuotės dydis": "Pakkauskoko",
  "Pakuotės kaina": "Pakkauksen hinta",
  "Paviršiaus apdaila": "Pinnan viimeistely",
  "Paviršiaus dengimas": "Pintakäsittely",
  Plotis: "Leveys",
  "Prekė užsakoma, tiekimo terminas - <br>": "Tilaustuote, toimitusaika",
  Produktas: "Tuote",
  "Rakinimo tipas": "Lukitustapa",
  "Reikalingas m² kiekis": "Tarvittava pinta-ala",
  Sandėlyje: "Varastossa",
  Spalva: "Sävy",
  Storis: "Paksuus",
  Struktūra: "Rakenne",
  "Struktūra / konstrukcija": "Rakenne",
  Svoris: "Paino",
  Tankumas: "Tiheys",
};

export const getCategoryLabel = (sourceId: number) => categoryNames[sourceId] ?? null;

export const getSpecificationLabel = (sourceLabel: string): string | null =>
  specificationLabels[sourceLabel] ?? null;

const exactProductNames: Readonly<Record<string, string>> = {
  "Natūralios bambuko masyvo grindys - Karbonizuota spalva - UV Treffert lakas":
    "Massiivibambulattia – karbonisoitu sävy, Treffert UV-lakka",
  "Bambuko terasinės grindys - dassoXTR' R137 - Espresso spalva":
    "Bambuterassilauta – dassoXTR' R137, Espresso-sävy",
  "Bambuko terasinės grindys - dassoCTECH' V137- Coffee spalva":
    "Bambuterassilauta – dassoCTECH' V137, Coffee-sävy",
  "Vertikalaus / šoninio presavimo bambuko plokštė - 3 sluoksniai - Natūrali spalva":
    "Sivupuristettu bambulevy – 3-kerroksinen, luonnollinen sävy",
  "Bambuko masyvo grindjuostė - Natūrali spalva - UV Treffert Lakas":
    "Massiivibambu-jalkalista – luonnollinen sävy, Treffert UV-lakka",
  "Bambuko masyvo grindjuostė - Karbonizuota spalva - UV Treffert Lakas":
    "Massiivibambu-jalkalista – karbonisoitu sävy, Treffert UV-lakka",
  "Bambuko masyvo laiptų briauna - Natūrali spalva - UV Treffert Lakas":
    "Massiivibambu-porrasnokka – luonnollinen sävy, Treffert UV-lakka",
  "Moso bambuko skersiniai - Natūrali spalva":
    "Moso-bambusäle – luonnollinen sävy",
  "Moso bambukų sienelė - Juodinta spalva":
    "Moso-bambuseinäke – mustattu sävy",
  "Bambuko tapetai - Deginta žalsva spalva":
    "Bambutapetti – poltettu vihreä sävy",
  "Adesiver 2K Premium epoksidiniai poliuretaniniai klijai grindims 12,5 kg":
    "Adesiver 2K Premium -epoksipolyuretaanilattialiima, 12,5 kg",
  "Universalus lakuotų medinių grindų ploviklis":
    "Yleispuhdistusaine lakatuille puulattioille",
  "Wakol PU 280 hidroizoliacinis poliuretaninis gruntas 11 kg":
    "WAKOL PU 280 -vedeneristävä polyuretaanipohjuste, 11 kg",
  "WOCA terasos alyva - Bespalvė - 2.5l.":
    "WOCA-terassiöljy – väritön, 2,5 l",
  "Vertikalaus / šoninio presavimo bambuko plokštė 5 sluoksniai, karbonizuota spalva":
    "Sivupuristettu bambulevy – 5-kerroksinen, karbonisoitu sävy",
  "CHIMIVER KLIJŲ ŠUKOS - N° 5": "Chimiver-liimakampa N° 5",
  "Chimiver klijų šukos N-5": "Chimiver-liimakampa N-5",
};

const segmentTranslations: readonly (readonly [RegExp, string])[] = [
  [/^Natūralios bambuko masyvo grindys/iu, "Massiivibambulattia"],
  [/^Karbonizuotos bambuko masyvo grindys/iu, "Karbonisoitu massiivibambulattia"],
  [/^Dažytos šukuotos bambuko masyvo grindys/iu, "Värjätty ja harjattu massiivibambulattia"],
  [/^Dažytos bambuko masyvo grindys/iu, "Värjätty massiivibambulattia"],
  [/^Grandytos, šukuotos bambuko masyvo grindys/iu, "Kaavittu ja harjattu massiivibambulattia"],
  [/^Grandytos bambuko masyvo grindys/iu, "Kaavittu massiivibambulattia"],
  [/^Lengvos pjūklo apdailos bambuko masyvo grindys/iu, "Kevyesti sahattu massiivibambulattia"],
  [/^Bambuko trisluoksnės parketlentės/iu, "Kolmikerroksinen bambuparkettilauta"],
  [/^Bambuko masyvo grindjuostė$/iu, "Massiivibambu-jalkalista"],
  [/^Bambuko masyvo laiptų briauna$/iu, "Massiivibambu-porrasnokka"],
  [/^Bambuko terasinės grindys$/iu, "Bambuterassilauta"],
  [/^Pradžios \/ Užbaigimo terasinė lenta$/iu, "Terassin aloitus-/lopetuslauta"],
  [/^Bambuko stoginės \/ verandos grindys$/iu, "Bambuverantalauta"],
  [/^Bambuko dailylentės$/iu, "Bambu-ulkoverhouslauta"],
  [/^Bambuko pakalimai stogui$/iu, "Bambu-räystäslauta"],
  [/^Terasos tvirtinimo elementas$/iu, "Terassikiinnike"],
  [/^Pakalimų tvirtinimo elementas$/iu, "Räystäslaudan kiinnike"],
  [/^XTR presuoto bambuko lagės$/iu, "XTR-puristebamburunko"],
  [/^Horizontalaus \/ plokščio presavimo bambuko plokštė/iu, "Vaakapuristettu bambulevy"],
  [/^Vertikalaus \/ šoninio presavimo bambuko plokštė/iu, "Sivupuristettu bambulevy"],
  [/^Presuoto bambuko plokštė$/iu, "Puristebambulevy"],
  [/^Moso bambuko skersiniai$/iu, "Moso-bambusäle"],
  [/^Moso bambukų sienelė$/iu, "Moso-bambuseinäke"],
  [/^Bambuko tapetai$/iu, "Bambutapetti"],
  [/^Spalvos retušavimo pieštukas/iu, "Värin retusointikynä"],
  [/^Retušavimo pieštukas/iu, "Retusointikynä"],
  [/^OSMO Vaškas skersgalių sandarinimui$/iu, "OSMO-päätyvaha"],
  [/^FAXE pigmentinė terasos alyva$/iu, "FAXE-pigmentoitu terassiöljy"],
  [/^FAXE terasos valiklis$/iu, "FAXE-terassipuhdistusaine"],
  [/"EGLUTĖ"/gu, "kalanruoto"],
  [/^Eglutė 90° kampu$/iu, "90° kalanruoto"],
  [/^Balinta kakavos spalva$/iu, "vaalea kaakaosävy"],
  [/^Tamsi viskio spalva$/iu, "tumma viskisävy"],
  [/^Karbonizuota antikos spalva$/iu, "karbonisoitu antiikkisävy"],
  [/^Miško spalva$/iu, "metsänsävy"],
  [/^Antikos perlo spalva$/iu, "antiikkihelmisävy"],
  [/^Šviesi vanilla spalva$/iu, "vaalea Vanilla-sävy"],
  [/^Bambuko spalva$/iu, "bambusävy"],
  [/^Natūrali spalva$/iu, "luonnollinen sävy"],
  [/^Karbonizuota spalva$/iu, "karbonisoitu sävy"],
  [/^Šviesiai karbonizuota spalva$/iu, "vaaleasti karbonisoitu sävy"],
  [/^Tamsiai karbonizuota spalva$/iu, "tummaksi karbonisoitu sävy"],
  [/^Juodinta spalva$/iu, "mustattu sävy"],
  [/^Dažyta spalva$/iu, "värjätty sävy"],
  [/^Deginta žalsva spalva$/iu, "poltettu vihreä sävy"],
  [/^Natūrali žalia spalva$/iu, "luonnonvihreä sävy"],
  [/^(.+) spalva$/iu, "$1-sävy"],
  [/^(\d+) sluoksniai$/iu, "$1-kerroksinen"],
  [/^UV Treffert lakas$/iu, "Treffert UV-lakka"],
  [/^Bona naturals? lakas$/iu, "Bona Naturals -lakka"],
  [/^Bona matinis lakas$/iu, "Bona-mattalakka"],
  [/^UV Treffert Lakas\/ Alyva$/iu, "Treffert UV-lakka / öljy"],
  [/^Vaškas$/iu, "vaha"],
  [/^1 iš 2$/iu, "osa 1/2"],
  [/^2 iš 2 pozicija$/iu, "osa 2/2"],
  [/^Alyvuojamos$/iu, "öljyttävä"],
  [/^Be padengimo$/iu, "pintakäsittelemätön"],
  [/^Paviršius be padengimo$/iu, "pintakäsittelemätön pinta"],
  [/^Pradžios \/ Pabaigos elementas$/iu, "aloitus-/lopetuskiinnike"],
  [/^Pagrindinis elementas(?:_[12]var)?$/iu, "peruskiinnike"],
];

const cleanSourceName = (name: string): string =>
  name
    .replace(/\\_/g, "_")
    .replace(/\s*\|\s*\d+(?:[.,]\d+)?\s*€\/(?:pak\.|vnt\.?).*$/iu, "")
    .replace(/\s+/g, " ")
    .trim();

const translateSegment = (segment: string): string => {
  let result = segment.trim();
  for (const [pattern, replacement] of segmentTranslations) {
    result = result.replace(pattern, replacement);
  }
  return result
    .replace(/\b2\.5l\.?\b/gu, "2,5 l")
    .replace(/\b0\.375 l\.?\b/gu, "0,375 l")
    .trim();
};

export const translateProductName = (sourceName: string): string => {
  const cleaned = cleanSourceName(sourceName);
  const exact = exactProductNames[cleaned];
  if (exact) return exact;

  const translated = cleaned.split(/\s+-\s+/u).map(translateSegment);
  if (translated.length === 1) return translated[0] ?? "";
  return `${translated[0]} – ${translated.slice(1).join(", ")}`;
};

export const slugifyFinnish = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fi")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
