import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = process.argv[4] ? resolve(process.argv[4]) : null;
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);

const routePath = "/victoria-to-vancouver-movers/";
const routeUrl = new URL(routePath, baseUrl).href;
const routeHtml = await readFile(resolve(root, routePath.slice(1), "index.html"), "utf8");
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });

function count(pattern, text = routeHtml) {
  return (text.match(pattern) ?? []).length;
}

function clean(value) {
  return String(value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function attr(tag, name) {
  return tag?.match(new RegExp(`${name}=["']([^"']*)["']`, "i"))?.[1] ?? "";
}

function rawSnapshot() {
  const title = clean(routeHtml.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const meta = (selector, value) => {
    const tag = (routeHtml.match(/<meta\b[^>]*>/gi) ?? []).find((item) => attr(item, selector) === value);
    return attr(tag, "content");
  };
  const link = (rel) => {
    const tag = (routeHtml.match(/<link\b[^>]*>/gi) ?? []).find((item) => attr(item, "rel") === rel);
    return attr(tag, "href");
  };
  return {
    bytes: Buffer.byteLength(routeHtml),
    title,
    ogTitle: meta("property", "og:title"),
    twitterTitle: meta("name", "twitter:title"),
    description: meta("name", "description"),
    canonical: link("canonical"),
    ogUrl: meta("property", "og:url"),
    h1Count: count(/<h1\b/gi),
    quotePanelCount: count(/class=["'][^"']*\bpcm-lead-panel\b/gi),
    primaryFormCount: count(/<form\b[^>]*class=["'][^"']*\bpcm-estimate-form\b/gi),
    pricingTableCount: count(/<table\b/gi),
    glanceHeadingCount: count(/Route at a Glance/gi),
    faqPageCount: count(/["']FAQPage["']/g),
    localSeoCount: count(/\bpcm-local-seo\b/g),
    undefinedCount: count(/\bundefined\b/g),
    footerCount: count(/<footer\b/gi),
    reactBootstrap: /<script\b[^>]*type=["']module["']/i.test(routeHtml),
    staticNav: /\/assets\/static-nav\.js/.test(routeHtml),
    staticChat: /\/assets\/static-chat\.js/.test(routeHtml),
    conversionRuntime: /\/assets\/conversion-boost\.js/.test(routeHtml),
    routeObserver: /new MutationObserver\(applyRouteCorrections\)/.test(routeHtml),
  };
}

async function domSnapshot(page) {
  return page.evaluate(() => {
    const text = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const headings = [...document.querySelectorAll("h1,h2,h3")];
    const faqHeadings = headings.filter((heading) => /Frequently Asked Questions|\bFAQ\b/i.test(text(heading.textContent)));
    const pricingHeadings = [...document.querySelectorAll("h2")].filter((heading) => /How much does it cost|Moving Cost Breakdown/i.test(text(heading.textContent)));
    const legacyHeadings = headings.filter((heading) => /Moving Cost Breakdown/i.test(text(heading.textContent)));
    const origins = [...document.querySelectorAll('input[name="from"]')];
    const destinations = [...document.querySelectorAll('input[name="to"]')];
    return {
      readyState: document.readyState,
      title: document.title,
      h1: text(document.querySelector("h1")?.textContent),
      h1Count: document.querySelectorAll("h1").length,
      quotePanelCount: document.querySelectorAll(".pcm-lead-panel").length,
      primaryFormCount: document.querySelectorAll("form.pcm-estimate-form").length,
      pricingHeadingCount: pricingHeadings.length,
      pricingTableCount: pricingHeadings.reduce((total, heading) => total + (heading.closest("section")?.querySelectorAll("table").length ?? 0), 0),
      legacyPricingCount: legacyHeadings.length,
      pricingRows: pricingHeadings[0]?.closest("section")?.querySelectorAll("tbody tr").length ?? 0,
      glanceCount: headings.filter((heading) => /Route at a Glance/i.test(text(heading.textContent))).length,
      faqHeadingCount: faqHeadings.length,
      faqSectionCount: new Set(faqHeadings.map((heading) => heading.closest("section")).filter(Boolean)).size,
      faqPageCount: [...document.querySelectorAll('script[type="application/ld+json"]')].filter((script) => /["']FAQPage["']/.test(script.textContent ?? "")).length,
      localSeoCount: document.querySelectorAll(".pcm-local-seo").length,
      undefinedCount: (document.body?.innerText.match(/\bundefined\b/g) ?? []).length,
      footerCount: document.querySelectorAll("footer").length,
      form: {
        origins: origins.map((input) => ({ value: input.value, placeholder: input.placeholder })),
        destinations: destinations.map((input) => ({ value: input.value, placeholder: input.placeholder })),
      },
      nav: {
        count: document.querySelectorAll("nav").length,
        mobileTrigger: Boolean(document.querySelector('button[aria-label="Open menu"]')),
      },
      chat: {
        launchers: document.querySelectorAll('button[aria-label="Open chat assistant"],button[aria-label="Close chat"]').length,
        panels: document.querySelectorAll('.pcm-static-chat-panel').length,
      },
    };
  });
}

async function probe(name, { disableRouteObserver = false, block = [] } = {}) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const origin = new URL(baseUrl).origin;
  const events = [];
  const consoleMessages = [];
  const pageErrors = [];
  const denied = [];
  const pending = new Map();
  const started = Date.now();
  const stamp = (event, detail = "") => events.push({ atMs: Date.now() - started, event, detail });

  await page.addInitScript(({ disableRouteObserver }) => {
    window.__pcmStep50Events = [];
    const record = (event) => window.__pcmStep50Events.push({ event, at: performance.now() });
    document.addEventListener("DOMContentLoaded", () => record("DOMContentLoaded"), { once: true });
    window.addEventListener("load", () => record("load"), { once: true });
    if (disableRouteObserver) {
      const NativeMutationObserver = window.MutationObserver;
      window.MutationObserver = class extends NativeMutationObserver {
        constructor(callback) {
          if (String(callback).includes("applyRouteCorrections")) {
            super(() => {});
            window.__pcmStep50RouteObserverDisabled = true;
          } else {
            super(callback);
          }
        }
      };
    }
  }, { disableRouteObserver });

  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    const localAsset = url.origin === origin ? url.pathname : "";
    const blockedLocal = block.some((pattern) => pattern.test(localAsset));
    if (url.origin !== origin || blockedLocal) {
      denied.push({ url: url.href, reason: url.origin !== origin ? "external" : "isolated-local-script" });
      await route.abort();
    } else {
      await route.continue();
    }
  });
  page.on("request", (request) => pending.set(request.url(), request.resourceType()));
  page.on("requestfinished", (request) => pending.delete(request.url()));
  page.on("requestfailed", (request) => pending.delete(request.url()));
  page.on("console", (message) => consoleMessages.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("domcontentloaded", () => stamp("DOMContentLoaded"));
  page.on("load", () => stamp("load"));

  let navigationError = null;
  let checkpoints = {};
  try {
    stamp("navigation-start", routeUrl);
    await page.goto(routeUrl, { waitUntil: "commit", timeout: 10000 });
    stamp("navigation-commit");
    await page.waitForLoadState("domcontentloaded", { timeout: 8000 });
    checkpoints.initial = await domSnapshot(page);
    await page.waitForTimeout(1000);
    checkpoints.oneSecond = await domSnapshot(page);
    await page.waitForTimeout(4200);
    checkpoints.fiveSeconds = await domSnapshot(page);
    checkpoints.browserEvents = await page.evaluate(() => window.__pcmStep50Events ?? []);
    checkpoints.routeObserverDisabled = await page.evaluate(() => Boolean(window.__pcmStep50RouteObserverDisabled));
  } catch (error) {
    navigationError = error.message;
  }

  const result = {
    name,
    disableRouteObserver,
    blockedScripts: block.map(String),
    events,
    navigationError,
    checkpoints,
    pendingRequests: [...pending].map(([url, type]) => ({ url, type })),
    deniedRequests: denied,
    consoleMessages,
    pageErrors,
  };
  await page.close().catch(() => {});
  return result;
}

const probes = [];
probes.push(await probe("generic-external-blocked"));
probes.push(await probe("route-observer-disabled", { disableRouteObserver: true }));
probes.push(await probe("conversion-blocked", { block: [/\/assets\/conversion-boost\.js$/] }));
probes.push(await probe("static-nav-blocked", { block: [/\/assets\/static-nav\.js$/] }));
probes.push(await probe("static-chat-blocked", { block: [/\/assets\/static-chat\.js$/] }));

async function exactQa(viewport) {
  const page = await browser.newPage({ viewport });
  const auditedOrigin = new URL(baseUrl).origin;
  await page.route("**/*", async (routeRequest) => {
    const url = new URL(routeRequest.request().url());
    if (url.origin !== auditedOrigin) await routeRequest.abort(); else await routeRequest.continue();
  });
  const messages = [];
  page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  await page.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(5200);
  const layout = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const h1Style = getComputedStyle(h1);
    const quote = document.querySelector(".pcm-top-estimate");
    const glance = document.querySelector(".pcm-step50-glance__grid");
    const table = document.querySelector(".pcm-route-cost table");
    const tableWrap = document.querySelector(".pcm-route-cost__table-wrap");
    const bodyStyle = getComputedStyle(document.querySelector('[data-pcm-static-route="victoria-to-vancouver-movers"]'));
    const faqQuestion = document.querySelector(".pcm-step50-faq h3");
    const launcher = document.querySelector('button[aria-label="Open chat assistant"]');
    const sticky = document.querySelector(".pcm-sticky-cta");
    const overlap = (a, b) => a && b && !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    return {
      viewport: [innerWidth, innerHeight],
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      brokenLocalImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0 && new URL(image.src).origin === location.origin).map((image) => image.src),
      h1: { family: h1Style.fontFamily, size: h1Style.fontSize, lineHeight: h1Style.lineHeight, weight: h1Style.fontWeight },
      bodyFamily: bodyStyle.fontFamily,
      faqFamily: faqQuestion ? getComputedStyle(faqQuestion).fontFamily : "",
      quoteColumns: quote ? getComputedStyle(quote).gridTemplateColumns : "",
      glanceColumns: glance ? getComputedStyle(glance).gridTemplateColumns : "",
      tableMinWidth: table ? getComputedStyle(table).minWidth : "",
      tableInternalScroll: Boolean(tableWrap && tableWrap.scrollWidth > tableWrap.clientWidth),
      clippedControls: [...document.querySelectorAll("input,select,button,a")].filter((element) => { const box = element.getBoundingClientRect(); return box.width > 0 && (box.right > document.documentElement.clientWidth + 1 || box.left < -1); }).length,
      chatStickyOverlap: overlap(launcher?.getBoundingClientRect(), sticky?.getBoundingClientRect()),
      forms: [...document.querySelectorAll('form[data-pcm-step50-form="1"]')].map((form) => ({ from: form.querySelector('[name="from"]')?.value, to: form.querySelector('[name="to"]')?.value })),
      chatContext: document.querySelector(".pcm-static-chat-bubble")?.textContent ?? "",
    };
  });

  const desktop = viewport.width >= 1024;
  let navigation;
  if (desktop) {
    const services = page.locator("header button", { hasText: "Services" }).first();
    await services.click();
    const open = await services.getAttribute("aria-expanded");
    await page.keyboard.press("Escape");
    navigation = { open, afterEscape: await services.getAttribute("aria-expanded") };
  } else {
    const trigger = page.locator('header button[aria-label="Open menu"]');
    await trigger.click();
    const open = await trigger.getAttribute("aria-expanded");
    const focusedAfterOpen = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    await page.keyboard.press("Escape");
    navigation = { open, afterEscape: await trigger.getAttribute("aria-expanded"), focusedAfterOpen, focusedAfterEscape: await page.evaluate(() => document.activeElement?.getAttribute("aria-label")) };
  }

  const launcher = page.locator('button[aria-label="Open chat assistant"]');
  const launcherCount = await launcher.count();
  await launcher.click();
  const chatPanel = page.locator(".pcm-static-chat-panel");
  const openPanelCount = await chatPanel.count();
  const opened = openPanelCount === 1 && !(await chatPanel.getAttribute("hidden"));
  await page.locator(".pcm-static-chat-close").click();
  const closed = (await chatPanel.getAttribute("hidden")) !== null;
  await page.close();
  return { layout, navigation, chat: { launcherCount, panelCount: openPanelCount, opened, closed }, messages };
}

const exactBrowserQa = {
  desktop1280x900: await exactQa({ width: 1280, height: 900 }),
  mobile390x844: await exactQa({ width: 390, height: 844 }),
};

await browser.close();
const report = { generatedAt: new Date().toISOString(), route: routePath, raw: rawSnapshot(), probes, exactBrowserQa };
const json = `${JSON.stringify(report, null, 2)}\n`;
if (output) await writeFile(output, json);
else process.stdout.write(json);
