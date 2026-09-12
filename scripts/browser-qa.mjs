import { writeFile } from "node:fs/promises";

const devtoolsOrigin = process.env.CHROME_DEVTOOLS_URL ?? "http://127.0.0.1:9222";
const siteUrl = process.env.QA_SITE_URL ?? "http://localhost:3000/fi";
const configuredViewports = [
  { name: "phone", width: 390, height: 844, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "desktop", width: 1200, height: 900, mobile: false },
  { name: "wide", width: 1440, height: 1000, mobile: false },
];
const requestedViewports = new Set(
  (process.env.QA_VIEWPORTS ?? "").split(",").map((name) => name.trim()).filter(Boolean),
);
const viewports = requestedViewports.size
  ? configuredViewports.filter(({ name }) => requestedViewports.has(name))
  : configuredViewports;
const captureFullPage = process.env.QA_SCREENSHOT_MODE !== "viewport";
const commandTimeoutMs = Number(process.env.QA_CDP_TIMEOUT_MS ?? 15_000);

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
  const response = await fetch(
    `${devtoolsOrigin}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT", signal: AbortSignal.timeout(commandTimeoutMs) },
  );
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
  const results = [];

  for (const viewport of viewports) {
    consoleErrors.length = 0;
    await call("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    const navigation = await call("Page.navigate", {
      url: `${siteUrl}#qa-${viewport.name}`,
    });
    if (navigation.errorText) {
      throw new Error(`Navigation failed for ${viewport.name}: ${navigation.errorText}`);
    }

    const readiness = await call("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const deadline = Date.now() + ${commandTimeoutMs - 500};
        while (document.readyState !== 'complete') {
          if (Date.now() > deadline) throw new Error('Document load timed out');
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        await document.fonts.ready;
        return { href: location.href, readyState: document.readyState };
      })()`,
    });
    if (
      readiness.result.value.readyState !== "complete" ||
      !readiness.result.value.href.startsWith(siteUrl)
    ) {
      throw new Error(`Navigation was not established for ${viewport.name}.`);
    }

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
          .filter((value) => value && !value.startsWith(location.origin) && !value.startsWith('data:'));
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
    results.push({ viewport, audit, consoleErrors: [...consoleErrors], screenshotMode, screenshotPath });
  }

  const failures = results.flatMap(({ viewport, audit, consoleErrors: errors }) => {
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
      errors.length > 0 && `${errors.length} console error(s)`,
    ].filter(Boolean).map((failure) => `${viewport.name}: ${failure}`);
  });

  console.log(JSON.stringify(results, null, 2));
  if (failures.length) throw new Error(`Browser QA failed:\n${failures.join("\n")}`);
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
