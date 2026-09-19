import type { InformationSource } from "./types";

export const informationSources = [
  {
    id: "manufacturing-process-snapshot",
    labelFi: "Valmistajan tuotantoprosessin arkistoitu kuvaus",
    internalLocator:
      ".firecrawl/bambukogrindys.lt-lt-bambuko-grindu-gamybos-procesas.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "faq-snapshot",
    labelFi: "Valmistajan arkistoitu kysymys–vastausaineisto",
    internalLocator: ".firecrawl/bambukogrindys.lt-lt-duk.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "structure-patterns-snapshot",
    labelFi: "Valmistajan arkistoitu rakenne- ja kuvio-opas",
    internalLocator:
      ".firecrawl/bambukogrindys.lt-lt-bambuko-grindu-rastai-ir-struktura.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "edge-profiles-snapshot",
    labelFi: "Valmistajan arkistoitu reunaprofiiliopas",
    internalLocator:
      ".firecrawl/bambukogrindys.lt-lt-bambuko-grindu-lentu-briaunos.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "colors-snapshot",
    labelFi: "Valmistajan arkistoitu väriopas",
    internalLocator:
      ".firecrawl/bambukogrindys.lt-lt-bambuko-masyvo-grindu-spalvos.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "finishes-snapshot",
    labelFi: "Valmistajan arkistoitu pintakäsittelyopas",
    internalLocator:
      ".firecrawl/bambukogrindys.lt-lt-apdailos-medziagos-ir-lakas.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "installation-methods-snapshot",
    labelFi: "Valmistajan arkistoitu asennustapaopas",
    internalLocator:
      ".firecrawl/bambukogrindys.lt-lt-grindu-dangos-klojimo-budai.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "installation-care-snapshot",
    labelFi: "Valmistajan arkistoitu asennus- ja hoito-ohje",
    internalLocator:
      ".firecrawl/bambukogrindys.lt-lt-grindu-klojimo--prieziuros-instrukcija.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
  {
    id: "underfloor-heating-snapshot",
    labelFi: "Valmistajan arkistoitu lattialämmitysopas",
    internalLocator: ".firecrawl/bambukogrindys.lt-lt-sildomos-grindys.md",
    capturedAt: "2026-09-11",
    status: "research-snapshot",
  },
] as const satisfies readonly InformationSource[];
