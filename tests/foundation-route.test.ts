import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import FinnishFoundationPage from "../app/fi/page";

describe("Finnish foundation route", () => {
  it("renders a neutral assortment-pending state with a quote action", () => {
    const html = renderToStaticMarkup(FinnishFoundationPage());

    expect(html).toContain("Tietoa bambulattioista ja bambuterasseista");
    expect(html).not.toContain("Suomeen");
    expect(html).toContain("Suomen valikoimaa ei ole vielä vahvistettu");
    expect(html).toContain('href="/fi#yhteys"');
    expect(html).toContain("Pyydä tarjous");
  });
});
