import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const devtoolsOrigin = process.env.CHROME_DEVTOOLS_URL ?? "http://127.0.0.1:9222";
const siteUrl = process.env.QA_SITE_URL ?? "http://localhost:3000/fi";
export const browserQaJourneyConfig = Object.freeze({
  viewports: Object.freeze([
    Object.freeze({ name: "phone", width: 390, height: 844, mobile: true }),
    Object.freeze({ name: "tablet", width: 768, height: 1024, mobile: true }),
    Object.freeze({ name: "desktop", width: 1200, height: 900, mobile: false }),
    Object.freeze({ name: "wide", width: 1440, height: 1000, mobile: false }),
  ]),
  journeys: Object.freeze({
    catalog: "/fi/tuotteet",
    gallery: "/fi/galleria",
  }),
  formRoutes: Object.freeze([
    "/fi/yhteystiedot",
    "/fi/pyyda-tarjous",
    "/fi/tilaa-mallipala",
  ]),
  requiredFormStates: Object.freeze([
    "pending",
    "field-error",
    "unavailable",
    "retry",
    "success",
  ]),
});

export async function runBrowserQa() {
  const requestedViewports = new Set(
    (process.env.QA_VIEWPORTS ?? "").split(",").map((name) => name.trim()).filter(Boolean),
  );
  const viewports = requestedViewports.size
    ? browserQaJourneyConfig.viewports.filter(({ name }) => requestedViewports.has(name))
    : browserQaJourneyConfig.viewports;
  const captureFullPage = process.env.QA_SCREENSHOT_MODE !== "viewport";
  const commandTimeoutMs = Number(process.env.QA_CDP_TIMEOUT_MS ?? 15_000);
  const journeyPaths = browserQaJourneyConfig.journeys;

  if (!viewports.length) throw new Error("QA_VIEWPORTS did not match a configured viewport.");

  let target;
  let socket;
  let commandId = 0;
  const pending = new Map();
  const consoleErrors = [];

  function call(method, params = {}) {
    if (!socket) throw new Error("Chrome DevTools socket is not connected.");
    const id = ++commandId;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Chrome DevTools command timed out: ${method}`));
      }, commandTimeoutMs);
      pending.set(id, { resolve, reject, timeout });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  try {
  let response;
  try {
    response = await fetch(
      `${devtoolsOrigin}/json/new?${encodeURIComponent("about:blank")}`,
      { method: "PUT", signal: AbortSignal.timeout(commandTimeoutMs) },
    );
  } catch (error) {
    const code = error instanceof Error && "cause" in error && error.cause instanceof Error
      ? error.cause.message
      : error instanceof Error
        ? error.message
        : String(error);
    throw new Error(`Browser QA is blocked: Chrome DevTools endpoint ${devtoolsOrigin} is unavailable (${code}).`);
  }
  if (!response.ok) throw new Error(`Unable to create Chrome target: HTTP ${response.status}`);
  target = await response.json();
  socket = new WebSocket(target.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Chrome DevTools connection timed out.")),
      commandTimeoutMs,
    );
    socket.addEventListener("open", () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
    socket.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(new Error("Chrome DevTools connection failed."));
    }, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timeout } = pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(timeout);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
      return;
    }
    if (message.method === "Runtime.exceptionThrown") {
      consoleErrors.push(message.params.exceptionDetails.text);
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      consoleErrors.push(
        message.params.args.map((argument) => argument.value ?? argument.description).join(" "),
      );
    }
  });

  await call("Page.enable");
  await call("Runtime.enable");

  const evaluate = async (expression) => {
    const response = await call("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression,
    });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.text ?? "Browser expression failed.");
    }
    return response.result.value;
  };

  const waitForPage = async (url, label) => {
    const navigation = await call("Page.navigate", { url });
    if (navigation.errorText) {
      throw new Error(`Navigation failed for ${label}: ${navigation.errorText}`);
    }
    const readiness = await evaluate(`(async () => {
      const deadline = Date.now() + ${commandTimeoutMs - 500};
      while (document.readyState !== 'complete') {
        if (Date.now() > deadline) throw new Error('Document load timed out');
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      await document.fonts.ready;
      return { href: location.href, readyState: document.readyState };
    })()`);
    if (readiness.readyState !== "complete" || !readiness.href.startsWith(url)) {
      throw new Error(`Navigation was not established for ${label}.`);
    }
  };

  const inspectJourney = async (path, label) => {
    const url = new URL(path, siteUrl).toString();
    await waitForPage(url, label);
    return evaluate(`(() => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const externalUrls = [...document.querySelectorAll('a[href], img[src]')]
        .map((node) => node.href || node.currentSrc || node.src)
        .filter((value) => value && /^https?:/u.test(value) && !value.startsWith(location.origin));
      return {
        path: location.pathname,
        h1Count: document.querySelectorAll('h1').length,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        externalUrls,
        formVisible: [...document.querySelectorAll('form[action="/api/inquiries"]')].some(visible),
      };
    })()`);
  };

  const exerciseFormState = async (path, state, label) => {
    const inspection = await inspectJourney(path, `${label} ${state}`);
    if (!inspection.formVisible) return { path, state, observed: "form-missing" };

    const observed = await evaluate(`(async () => {
      const scenario = ${JSON.stringify(state)};
      const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFor = async (check, description) => {
        const deadline = Date.now() + ${commandTimeoutMs - 500};
        while (!check()) {
          if (Date.now() > deadline) throw new Error('Timed out while waiting for ' + description);
          await sleep(25);
        }
      };
      const form = document.querySelector('form[action="/api/inquiries"]');
      if (!(form instanceof HTMLFormElement)) throw new Error('Inquiry form was not found.');
      const setValue = (name, value) => {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = value;
      };
      setValue('name', 'Browser QA');
      setValue('email', 'browser-qa@example.test');
      setValue('message', 'Browser QA form-state check.');
      setValue('productId', 'browser-qa-product');
      const originalFetch = window.fetch;
      let requestCount = 0;
      let releasePending;
      const json = (body, status = 200) => new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      });
      window.fetch = async (input, init) => {
        const requestUrl = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
        if (!requestUrl.endsWith('/api/inquiries')) return originalFetch(input, init);
        requestCount += 1;
        if (scenario === 'pending') {
          return new Promise((resolve) => {
            releasePending = () => resolve(json({ ok: false, code: 'temporarily_unavailable' }, 503));
          });
        }
        if (scenario === 'field-error') {
          return json({
            ok: false,
            code: 'validation_error',
            fieldErrors: { name: ['Palvelin ilmoitti nimivirheen.'] },
          }, 400);
        }
        if (scenario === 'unavailable' || (scenario === 'retry' && requestCount === 1)) {
          return json({ ok: false, code: 'temporarily_unavailable' }, 503);
        }
        return json({ ok: true, referenceId: 'browser-qa-reference' });
      };
      const submit = () => form.requestSubmit();
      try {
        await sleep(100);
        submit();
        if (scenario === 'pending') {
          await waitFor(() => form.getAttribute('aria-busy') === 'true', 'pending state');
          const disabled = form.querySelector('button[type="submit"]')?.disabled === true;
          releasePending?.();
          await waitFor(() => form.getAttribute('aria-busy') === 'false', 'pending release');
          return { state: scenario, pendingVisible: true, pendingDisabled: disabled, requestCount };
        }
        if (scenario === 'field-error') {
          await waitFor(
            () => Boolean(form.querySelector('[role="alert"]')) && form.querySelector('[name="name"]')?.getAttribute('aria-invalid') === 'true',
            'server field error',
          );
          return { state: scenario, errorSummary: true, invalidName: true, requestCount };
        }
        if (scenario === 'unavailable') {
          await waitFor(
            () => (form.textContent ?? '').includes('Lomaketta ei voida lähettää juuri nyt.'),
            'temporary unavailability',
          );
          return { state: scenario, retryAvailable: form.querySelector('button[type="submit"]')?.disabled === false, requestCount };
        }
        if (scenario === 'retry') {
          await waitFor(
            () => (form.textContent ?? '').includes('Lomaketta ei voida lähettää juuri nyt.'),
            'retry availability',
          );
          const retainedName = form.querySelector('[name="name"]')?.value === 'Browser QA';
          submit();
          await waitFor(
            () => document.body.textContent?.includes('Kiitos yhteydenotostasi'),
            'retry success',
          );
          return { state: scenario, retainedName, retrySucceeded: true, requestCount };
        }
        await waitFor(
          () => document.body.textContent?.includes('Kiitos yhteydenotostasi'),
          'success state',
        );
        return { state: scenario, successVisible: true, requestCount };
      } finally {
        releasePending?.();
        window.fetch = originalFetch;
      }
    })()`);

    return { ...inspection, observed };
  };

  const results = [];

  for (const viewport of viewports) {
    consoleErrors.length = 0;
    await call("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await waitForPage(`${siteUrl}#qa-${viewport.name}`, viewport.name);

    await call("Runtime.evaluate", {
      awaitPromise: true,
      expression: `(async () => {
        const previousBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(480, innerHeight * 0.75)) {
          scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = previousBehavior;
        await new Promise((resolve) => setTimeout(resolve, 500));
        return true;
      })()`,
    });

    const auditResponse = await call("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const anchors = [...document.querySelectorAll('a[href]')];
        const localHashTargets = anchors
          .map((anchor) => new URL(anchor.href))
          .filter((url) => url.origin === location.origin && url.pathname === location.pathname && url.hash)
          .map((url) => url.hash.slice(1));
        const externalUrls = [...anchors, ...document.querySelectorAll('img[src]')]
          .map((node) => node.href || node.currentSrc || node.src)
          .filter((value) => value && /^https?:/u.test(value) && !value.startsWith(location.origin));
        const isVisible = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return false;
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        return {
          href: location.href,
          innerWidth,
          scrollY,
          scrollWidth: document.documentElement.scrollWidth,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          h1Count: document.querySelectorAll('h1').length,
          brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
          pendingImages: [...document.images].filter((image) => !image.complete).length,
          missingHashTargets: [...new Set(localHashTargets.filter((id) => !document.getElementById(id)))],
          externalUrls,
          stylesheetCount: document.styleSheets.length,
          fontsStatus: document.fonts.status,
          mobileNavigationVisible: isVisible('.mobile-navigation'),
          desktopNavigationVisible: isVisible('.desktop-navigation'),
          quoteActions: [...document.querySelectorAll('a, button')]
            .filter((element) => element.textContent?.trim() === 'Pyydä tarjous').length,
        };
      })()`,
    });
    const audit = auditResponse.result.value;
    const metrics = await call("Page.getLayoutMetrics");
    const content = metrics.cssContentSize;
    let screenshotMode = captureFullPage ? "full" : "viewport";
    let screenshot;

    try {
      screenshot = await call(
        "Page.captureScreenshot",
        captureFullPage
          ? {
              format: "png",
              captureBeyondViewport: true,
              clip: {
                x: 0,
                y: 0,
                width: Math.min(content.width, viewport.width),
                height: content.height,
                scale: 1,
              },
            }
          : { format: "png", captureBeyondViewport: false },
      );
    } catch (error) {
      if (!captureFullPage) throw error;
      screenshotMode = "viewport-fallback";
      screenshot = await call("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
    }

    const screenshotPath = `/tmp/bambuk-home-${viewport.width}-${screenshotMode}.png`;
    await writeFile(screenshotPath, screenshot.data, "base64");

    const catalog = await inspectJourney(journeyPaths.catalog, `${viewport.name} catalog`);
    const catalogInteraction = await evaluate(`(async () => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const trigger = [...document.querySelectorAll('button')]
        .find((button) => button.textContent?.trim() === 'Suodata tuotteita');
      const mobileFiltersVisible = visible(trigger);
      if (mobileFiltersVisible) {
        trigger.click();
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      const dialog = document.querySelector('dialog#catalog-filter-dialog');
      const dialogOpened = mobileFiltersVisible ? dialog?.open === true : true;
      const visibleFilterForm = [...document.querySelectorAll('form[action="/fi/tuotteet"]')].some(visible);
      if (dialog?.open) document.querySelector('[aria-label="Sulje suodattimet"]')?.click();
      return {
        mobileFiltersVisible,
        dialogOpened,
        visibleFilterForm,
        productPath: document.querySelector('article[data-product-id] a[href]')?.getAttribute('href') ?? null,
      };
    })()`);
    const product = catalogInteraction.productPath
      ? await inspectJourney(catalogInteraction.productPath, `${viewport.name} product`)
      : null;
    const productInteraction = product
      ? await evaluate(`(() => ({
          specificationRows: document.querySelectorAll('dl dt').length,
          galleryImages: document.querySelectorAll('section[aria-label="Tuotekuvat"] img').length,
        }))()`)
      : null;

    const gallery = await inspectJourney(journeyPaths.gallery, `${viewport.name} gallery`);
    const galleryInteraction = await evaluate(`(async () => {
      const trigger = document.querySelector('button[aria-label^="Avaa kuva:"]');
      if (!trigger) return { lightboxOpened: false };
      trigger.click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const dialog = document.querySelector('[role="dialog"][aria-label="Kuvagalleria"]');
      const lightboxOpened = Boolean(dialog);
      document.querySelector('[aria-label="Sulje kuvagalleria"]')?.click();
      return { lightboxOpened };
    })()`);

    const forms = [];
    for (const path of browserQaJourneyConfig.formRoutes) {
      const form = await inspectJourney(path, `${viewport.name} ${path}`);
      const states = [];
      for (const state of browserQaJourneyConfig.requiredFormStates) {
        states.push(await exerciseFormState(path, state, `${viewport.name} ${path}`));
      }
      forms.push({ ...form, states });
    }

    results.push({
      viewport,
      audit,
      catalog,
      catalogInteraction,
      product,
      productInteraction,
      gallery,
      galleryInteraction,
      forms,
      consoleErrors: [...consoleErrors],
      screenshotMode,
      screenshotPath,
    });
  }

  const failures = results.flatMap(({
    viewport,
    audit,
    catalog,
    catalogInteraction,
    product,
    productInteraction,
    gallery,
    galleryInteraction,
    forms,
    consoleErrors: errors,
  }) => {
    const desktopExpected = viewport.width >= 1200;
    return [
      audit.horizontalOverflow && "horizontal overflow",
      audit.scrollY !== 0 && `capture did not return to page top (${audit.scrollY}px)`,
      audit.h1Count !== 1 && `expected one H1, found ${audit.h1Count}`,
      audit.brokenImages > 0 && `${audit.brokenImages} broken image(s)`,
      audit.pendingImages > 0 && `${audit.pendingImages} pending image(s)`,
      audit.missingHashTargets.length > 0 && "missing hash target(s)",
      audit.externalUrls.length > 0 && "external visitor URL(s)",
      audit.stylesheetCount < 1 && "stylesheet was not loaded",
      audit.fontsStatus !== "loaded" && `fonts status is ${audit.fontsStatus}`,
      audit.desktopNavigationVisible !== desktopExpected && "wrong desktop navigation mode",
      audit.mobileNavigationVisible === desktopExpected && "wrong mobile navigation mode",
      catalog.h1Count !== 1 && "catalog did not have one H1",
      catalog.horizontalOverflow && "catalog has horizontal overflow",
      catalog.externalUrls.length > 0 && "catalog has external visitor URL(s)",
      !catalogInteraction.visibleFilterForm && "catalog filters were not visible",
      !catalogInteraction.dialogOpened && "catalog mobile filters did not open",
      !product && "catalog did not expose a product route",
      product?.h1Count !== 1 && "product did not have one H1",
      product?.horizontalOverflow && "product has horizontal overflow",
      !productInteraction || productInteraction.specificationRows < 1 && "product specifications were not rendered",
      !productInteraction || productInteraction.galleryImages < 1 && "product gallery was not rendered",
      gallery.h1Count !== 1 && "gallery did not have one H1",
      gallery.horizontalOverflow && "gallery has horizontal overflow",
      !galleryInteraction.lightboxOpened && "gallery lightbox did not open",
      forms.some((form) => form.h1Count !== 1) && "a form route did not have one H1",
      forms.some((form) => !form.formVisible) && "a form route did not expose its form",
      forms.some((form) => form.horizontalOverflow) && "a form route has horizontal overflow",
      forms.some((form) => form.externalUrls.length > 0) && "a form route has external visitor URL(s)",
      forms.some((form) => form.states.length !== browserQaJourneyConfig.requiredFormStates.length)
        && "a form route did not exercise every required state",
      forms.some((form) => form.states.some((result) => result.observed?.state !== result.state))
        && "a form state did not complete",
      forms.some((form) => form.states.some((result) => result.observed?.pendingVisible === false))
        && "pending state was not visible",
      forms.some((form) => form.states.some((result) => result.observed?.pendingDisabled === false))
        && "pending form submit control was not disabled",
      forms.some((form) => form.states.some((result) => result.observed?.invalidName === false))
        && "server field error was not rendered",
      forms.some((form) => form.states.some((result) => result.observed?.retryAvailable === false))
        && "temporary unavailability did not permit retry",
      forms.some((form) => form.states.some((result) => result.observed?.retrySucceeded === false))
        && "retry did not reach success",
      forms.some((form) => form.states.some((result) => result.observed?.retainedName === false))
        && "retry did not preserve entered values",
      forms.some((form) => form.states.some((result) => result.observed?.successVisible === false))
        && "success state was not rendered",
      errors.length > 0 && `${errors.length} console error(s)`,
    ].filter(Boolean).map((failure) => `${viewport.name}: ${failure}`);
  });

  const report = {
    coverage: {
      complete: failures.length === 0,
      viewports: viewports.map(({ width }) => width),
      formRoutes: browserQaJourneyConfig.formRoutes,
      requiredFormStates: browserQaJourneyConfig.requiredFormStates,
    },
    results,
  };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) throw new Error(`Browser QA failed:\n${failures.join("\n")}`);
  return report;
} finally {
  for (const { timeout } of pending.values()) clearTimeout(timeout);
  pending.clear();
  if (socket) socket.close();
  if (target?.id) {
    await fetch(`${devtoolsOrigin}/json/close/${target.id}`, {
      signal: AbortSignal.timeout(commandTimeoutMs),
    }).catch(() => undefined);
  }
}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await runBrowserQa();
  } catch (error) {
    console.error(JSON.stringify({
      coverage: {
        complete: false,
        viewports: browserQaJourneyConfig.viewports.map(({ width }) => width),
        formRoutes: browserQaJourneyConfig.formRoutes,
        requiredFormStates: browserQaJourneyConfig.requiredFormStates,
      },
      status: "blocked-or-failed",
      reason: error instanceof Error ? error.message : String(error),
    }, null, 2));
    process.exitCode = 1;
  }
}
