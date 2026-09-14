import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const base = process.argv[3] ?? "http://127.0.0.1:4174";
const output = resolve(process.argv[4] ?? "STEP_64_MONTREAL_VICTORIA_AUDIT.json");
const { chromium } = await import(process.env.PLAYWRIGHT_PATH);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const routes = [
  { path: "/montreal-to-victoria-movers/", from: "Montreal, QC", to: "Victoria, BC", title: "Montreal to Victoria & Nanaimo Movers | Purely Canadian Movers", rendering: "react-spa" },
  { path: "/victoria-to-montreal-movers/", from: "Victoria, BC", to: "Montreal, QC", title: "Victoria to Montreal Movers | Purely Canadian Movers", rendering: "static" },
];

function normal(value) {
  return String(value ?? "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

function rawAudit(html, route) {
  const visible = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const inputs = Object.fromEntries(["from", "to"].map((name) => {
    const tag = visible.match(new RegExp(`<input(?=[^>]*name=["']${name}["'])[^>]*>`, "i"))?.[0] ?? "";
    return [name, tag.match(/\bvalue=["']([^"']*)/i)?.[1] ?? ""];
  }));
  return {
    moduleBootstrap: /<script[^>]*type=["']module["'][^>]*src=["'][^"']*\/assets\/index-[^"']+\.js/i.test(html),
    staticNav: /\/assets\/static-nav\.js/.test(html),
    staticChat: /\/assets\/static-chat\.js/.test(html),
    conversion: /\/assets\/conversion-boost\.js/.test(html),
    canonical: html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1],
    ogUrl: html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)/i)?.[1],
    description: html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)/i)?.[1],
    inputs,
    counts: {
      h1: (visible.match(/<h1\b/gi) ?? []).length,
      quote: (visible.match(/\bpcm-lead-panel\b/gi) ?? []).length,
      primaryForm: (visible.match(/<form\b[^>]*class=["'][^"']*pcm-estimate-form/gi) ?? []).length,
      pricing: (visible.match(/<section\b[^>]*class=["'][^"']*pcm-route-cost/gi) ?? []).length,
      pricingTable: (visible.match(/<table\b/gi) ?? []).length,
      glance: (visible.match(/Route at a Glance/gi) ?? []).length,
      faqHeading: (visible.match(/Frequently Asked Questions/gi) ?? []).length,
      faqPage: (html.match(/["']FAQPage["']/g) ?? []).length,
      localSeo: (visible.match(/\bpcm-local-seo\b/gi) ?? []).length,
    },
    undefinedVisible: /\bundefined\b/i.test(normal(visible)),
    route,
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const headings = [...document.querySelectorAll("h2")].filter((x) => /^Frequently Asked Questions$/i.test(clean(x.textContent)));
    const faq = headings[0]?.closest("section");
    const visibleFaq = faq ? [...faq.querySelectorAll("h3")].map((q) => ({ question: clean(q.textContent), answer: clean(q.parentElement?.querySelector("p")?.textContent) })) : [];
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) => { try { const data = JSON.parse(script.textContent); return data?.["@type"] === "FAQPage" ? [[...(data.mainEntity ?? [])].map((x) => ({ question: clean(x.name), answer: clean(x.acceptedAnswer?.text) }))] : []; } catch { return []; } });
    const form = document.querySelector(".pcm-lead-panel form");
    const pricing = document.querySelector(".pcm-route-cost");
    const wrap = pricing?.querySelector(".pcm-route-cost__table-wrap");
    const h1 = document.querySelector("h1");
    const style = (node) => node ? getComputedStyle(node) : null;
    const bodyText = clean(document.body.innerText);
    return {
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content,
      form: { from: form?.querySelector('[name="from"]')?.value, to: form?.querySelector('[name="to"]')?.value },
      counts: {
        h1: document.querySelectorAll("h1").length,
        quote: document.querySelectorAll(".pcm-lead-panel").length,
        primaryForm: document.querySelectorAll(".pcm-lead-panel form").length,
        pricing: document.querySelectorAll(".pcm-route-cost").length,
        pricingTable: pricing?.querySelectorAll("table").length ?? 0,
        pricingRows: pricing?.querySelectorAll("tbody tr").length ?? 0,
        glance: [...document.querySelectorAll("h2,h3")].filter((x) => /Route at a Glance/i.test(clean(x.textContent))).length,
        faqSection: new Set(headings.map((x) => x.closest("section"))).size,
        faqHeading: headings.length,
        visibleFaq: visibleFaq.length,
        faqPage: schemas.length,
        localSeo: document.querySelectorAll(".pcm-local-seo").length,
        chat: document.querySelectorAll('button[aria-label="Open chat assistant"]').length,
      },
      faqParity: schemas.length === 1 && JSON.stringify(visibleFaq) === JSON.stringify(schemas[0]),
      fonts: {
        body: style(document.body)?.fontFamily,
        paragraph: style(document.querySelector("main p"))?.fontFamily,
        pricing: style(pricing?.querySelector("td") ?? pricing)?.fontFamily,
        faq: style(faq?.querySelector("p"))?.fontFamily,
        form: style(form?.querySelector("input"))?.fontFamily,
        button: style(form?.querySelector("button"))?.fontFamily,
        cta: style(document.querySelector('main a[href="/contact/"]'))?.fontFamily,
      },
      h1Style: h1 ? { family: style(h1).fontFamily, size: style(h1).fontSize, lineHeight: style(h1).lineHeight, weight: style(h1).fontWeight } : null,
      facts: {
        distance: /4,800(?:\+)? km/.test(bodyText),
        transit: /10–22 days/.test(bodyText),
        prices: ["$3,000+", "$5,300+", "$7,000+", "$11,000+", "$16,000+"].every((x) => bodyText.includes(x)),
        range: /\$3,000[–-]\$16,000\+/.test(bodyText),
      },
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      pricingInternalScroll: Boolean(wrap && wrap.scrollWidth > wrap.clientWidth),
      clippedControls: [...document.querySelectorAll("input,select,button")].filter((x) => { const b = x.getBoundingClientRect(); return b.width > 0 && (b.left < -1 || b.right > document.documentElement.clientWidth + 1); }).length,
      undefinedVisible: /\bundefined\b/i.test(bodyText),
      soft404: /Page Not Found/i.test(bodyText),
      legacyPricing: /Moving Cost Breakdown/i.test(bodyText),
      bodyText,
    };
  });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const trigger = page.locator('button[aria-label="Open menu"]');
    result.present = await trigger.count() === 1 && await trigger.isVisible();
    if (result.present) {
      result.before = await trigger.getAttribute("aria-expanded");
      await trigger.click(); await page.waitForTimeout(100);
      result.open = await trigger.getAttribute("aria-expanded");
      await page.keyboard.press("Escape"); await page.waitForTimeout(100);
      result.closed = await trigger.getAttribute("aria-expanded");
    }
  } else {
    const services = page.getByRole("button", { name: "Services", exact: true }).first();
    result.present = await services.count() > 0 && await services.isVisible();
    if (result.present) { await services.click(); await page.waitForTimeout(100); result.open = await page.locator('header a[href="/local/"]').first().isVisible(); await page.keyboard.press("Escape"); }
  }
  const chat = page.locator('button[aria-label="Open chat assistant"]');
  result.chatPresent = await chat.count() === 1 && await chat.isVisible();
  if (result.chatPresent) { await chat.click(); await page.waitForTimeout(100); result.chatOpen = await page.locator('button[aria-label*="Close chat"]').count() > 0; }
  return result;
}

function failures(result) {
  const expectedUrl = `https://purelycanadianmovers.com${result.expected.path}`;
  const snapshots = [result.lifecycle.initial, result.lifecycle.oneToTwo, result.lifecycle.fivePlus, result.mobile];
  const issues = [];
  if (result.raw.canonical !== expectedUrl || result.raw.ogUrl !== expectedUrl) issues.push("raw self URL metadata");
  if (result.raw.inputs.from !== result.expected.from || result.raw.inputs.to !== result.expected.to) issues.push("raw form identity");
  for (const [index, s] of snapshots.entries()) {
    if (s.title !== result.expected.title || s.ogTitle !== s.title || s.twitterTitle !== s.title || s.canonical !== expectedUrl || s.ogUrl !== expectedUrl) issues.push(`metadata lifecycle ${index}`);
    if (s.form.from !== result.expected.from || s.form.to !== result.expected.to) issues.push(`form lifecycle ${index}`);
    if (s.counts.h1 !== 1 || s.counts.quote !== 1 || s.counts.primaryForm !== 1 || s.counts.pricing !== 1 || s.counts.pricingTable !== 1 || s.counts.glance !== 1 || s.counts.faqSection !== 1 || s.counts.faqHeading !== 1 || s.counts.visibleFaq !== 12 || s.counts.faqPage !== 1 || !s.faqParity || s.counts.localSeo !== 0) issues.push(`structure lifecycle ${index}`);
    if (!s.facts.distance || !s.facts.transit || !s.facts.prices || !s.facts.range) issues.push(`facts lifecycle ${index}`);
    if (s.overflow || s.clippedControls || s.undefinedVisible || s.soft404 || s.legacyPricing) issues.push(`presentation lifecycle ${index}`);
    for (const font of Object.values(s.fonts)) if (!/Source Sans 3/i.test(font ?? "")) issues.push(`body font lifecycle ${index}`);
    if (!/Playfair Display/i.test(s.h1Style?.family ?? "") || s.h1Style?.weight !== "700") issues.push(`heading font lifecycle ${index}`);
  }
  if (result.desktop.h1Style.size !== "48px" || result.desktop.h1Style.lineHeight !== "60px") issues.push("desktop H1 metrics");
  if (result.mobile.h1Style.size !== "36px" || result.mobile.h1Style.lineHeight !== "45px") issues.push("mobile H1 metrics");
  if (!result.interactions.mobile.present || result.interactions.mobile.before !== "false" || result.interactions.mobile.open !== "true" || result.interactions.mobile.closed !== "false") issues.push("mobile navigation Escape");
  if (!result.interactions.desktop.present || !result.interactions.desktop.open || !result.interactions.desktop.chatOpen || !result.interactions.mobile.chatOpen) issues.push("navigation/chat interaction");
  if (result.errors.length) issues.push("browser errors");
  return [...new Set(issues)];
}

const results = [];
for (const expected of routes) {
  const html = await readFile(join(root, expected.path.slice(1), "index.html"), "utf8");
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && !/ERR_|favicon|<path> attribute d: Expected number/i.test(message.text())) errors.push(message.text()); });
  await page.goto(new URL(expected.path, base).href, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  const initial = await snapshot(page);
  await page.waitForTimeout(1500); const oneToTwo = await snapshot(page);
  await page.waitForTimeout(4000); const fivePlus = await snapshot(page);
  const desktopInteractions = await interactions(page, false);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForTimeout(5500);
  const mobile = await snapshot(page); const mobileInteractions = await interactions(page, true);
  const result = { route: expected.path, expected, raw: rawAudit(html, expected.path), lifecycle: { initial, oneToTwo, fivePlus }, desktop: fivePlus, mobile, interactions: { desktop: desktopInteractions, mobile: mobileInteractions }, errors: [...new Set(errors)] };
  result.failures = failures(result);
  results.push(result);
  await page.close();
  console.log(`${expected.path}: ${result.failures.length ? `FAIL ${result.failures.join(", ")}` : "PASS"}`);
}
await browser.close();
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
if (results.some((x) => x.failures.length)) process.exitCode = 1;
