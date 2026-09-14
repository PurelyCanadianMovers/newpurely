import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = process.argv[2] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[3] ?? "STEP_46_TORONTO_WINNIPEG_AUDIT.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const routes = [
  ["/toronto-to-winnipeg-movers/", "Toronto", "Toronto, ON", "Winnipeg", "Winnipeg, MB"],
  ["/winnipeg-to-toronto-movers/", "Winnipeg", "Winnipeg, MB", "Toronto", "Toronto, ON"],
];
const clean = (value) => String(value ?? "").replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replace(/\s+/g, " ").trim();
const faqNodes = (value, out = []) => { if (!value || typeof value !== "object") return out; if (value["@type"] === "FAQPage") out.push(value); if (Array.isArray(value)) value.forEach((item) => faqNodes(item, out)); else Object.values(value).forEach((item) => faqNodes(item, out)); return out; };

function raw(html) {
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const pick = (re) => clean(html.match(re)?.[1]);
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) => { try { return faqNodes(JSON.parse(m[1])); } catch { return []; } });
  return {
    title: pick(/<title\b[^>]*>([\s\S]*?)<\/title>/i), og: pick(/<meta property="og:title" content="([^"]*)"/i), twitter: pick(/<meta name="twitter:title" content="([^"]*)"/i),
    description: pick(/<meta name="description" content="([^"]*)"/i), canonical: pick(/<link rel="canonical"[^>]*href="([^"]*)"/i), ogUrl: pick(/<meta property="og:url" content="([^"]*)"/i), h1: pick(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i),
    architecture: { reactBootstrap: /<script type="module"[^>]*index-[^"]+\.js/i.test(html), staticNav: /static-nav\.js/i.test(html), staticChat: /static-chat\.js/i.test(html), conversion: /conversion-boost\.js/i.test(html) },
    counts: { h1: (body.match(/<h1\b/gi) || []).length, quote: (body.match(/pcm-top-estimate-wrap/gi) || []).length, form: (body.match(/<form\b/gi) || []).length, pricing: (body.match(/class="[^"]*pcm-route-cost\b/gi) || []).length, table: (body.match(/<table\b/gi) || []).length, glance: (body.match(/Route at a Glance/gi) || []).length, faqSection: (body.match(/Frequently Asked Questions/gi) || []).length, faqHeading: (body.match(/Frequently Asked Questions/gi) || []).length, faqPage: schemas.length, localSeo: (body.match(/pcm-local-seo/gi) || []).length, footer: (body.match(/<footer\b/gi) || []).length },
    undefined: /\bundefined\b/i.test(body), contamination: Object.fromEntries(["Vancouver", "Calgary", "Edmonton", "Montreal", "Ottawa", "Halifax", "Victoria"].map((city) => [city, (body.match(new RegExp(`\\b${city}\\b`, "gi")) || []).length])),
  };
}

async function snap(page) {
  return page.evaluate(() => {
    const c = (v) => String(v ?? "").replace(/\s+/g, " ").trim(), q = (s) => document.querySelectorAll(s).length, schemas = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => { try { (function walk(v) { if (!v || typeof v !== "object") return; if (v["@type"] === "FAQPage") schemas.push(v); if (Array.isArray(v)) v.forEach(walk); else Object.values(v).forEach(walk); })(JSON.parse(s.textContent)); } catch {} });
    const faqHeading = [...document.querySelectorAll('h2')].find((x) => c(x.textContent) === 'Frequently Asked Questions'), section = faqHeading?.closest('section'), visible = [...(section?.querySelectorAll('article') ?? [])].map((x) => ({ q: c(x.querySelector('h3')?.textContent), a: c(x.querySelector('p')?.textContent) })), schema = (schemas[0]?.mainEntity || []).map((x) => ({ q: c(x.name), a: c(x.acceptedAnswer?.text) }));
    return { title: document.title, og: document.querySelector('meta[property="og:title"]')?.content, twitter: document.querySelector('meta[name="twitter:title"]')?.content, h1: c(document.querySelector('h1')?.textContent), from: document.querySelector('[name="from"]')?.value, to: document.querySelector('[name="to"]')?.value,
      counts: { h1: q('h1'), quote: q('.pcm-top-estimate-wrap'), form: q('.pcm-top-estimate-wrap form'), pricing: q('.pcm-route-cost'), table: q('.pcm-route-cost table'), rows: q('.pcm-route-cost tbody tr'), glance: q('.pcm-route-glance-section'), faq: section ? 1 : 0, faqHeading: [...document.querySelectorAll('h2')].filter((x) => c(x.textContent) === 'Frequently Asked Questions').length, faqPage: schemas.length, localSeo: q('.pcm-local-seo'), footer: q('footer'), launcher: q('button[aria-label="Open chat assistant"]'), panel: q('.pcm-static-chat-panel') },
      faqParity: JSON.stringify(visible) === JSON.stringify(schema), undefined: /\bundefined\b/i.test(document.body.innerText), homepage: /Your Move\. Our Family\. One Standard:/i.test(document.body.innerText), soft404: /Page Not Found/i.test(document.body.innerText), sentinel: c(document.querySelector('.pcm-route-intro')?.textContent).slice(0, 180) };
  });
}

async function responsive(page, viewport) {
  await page.setViewportSize(viewport); await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForTimeout(500);
  return page.evaluate(() => { const rect = (s) => { const n = document.querySelector(s); if (!n || getComputedStyle(n).display === "none") return null; const x = n.getBoundingClientRect(); return { l:x.left,r:x.right,t:x.top,b:x.bottom }; }, overlap = (a,b) => !!(a&&b&&a.l<b.r&&a.r>b.l&&a.t<b.b&&a.b>b.t), h = getComputedStyle(document.querySelector('h1')), wrap = document.querySelector('.pcm-route-cost__table-wrap'), table = document.querySelector('.pcm-route-cost table'); return { viewport:[innerWidth,innerHeight], pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth, h1:[h.fontFamily,h.fontSize,h.lineHeight,h.fontWeight], bodyFont:getComputedStyle(document.body).fontFamily, quoteColumns:getComputedStyle(document.querySelector('.pcm-top-estimate')).gridTemplateColumns, glanceColumns:getComputedStyle(document.querySelector('.pcm-route-glance')).gridTemplateColumns, tableMinWidth:getComputedStyle(table).minWidth, pricingInternalScroll:wrap.scrollWidth>wrap.clientWidth, brokenImages:[...document.images].filter((x)=>x.complete&&x.naturalWidth===0).map((x)=>x.src), floatingOverlap:overlap(rect('.pcm-static-chat-button'),rect('.pcm-sticky-cta'))||overlap(rect('.pcm-static-chat-button'),rect('.pcm-chat-nudge')) }; });
}

async function interactions(page, mobile) {
  const out = {};
  if (mobile) { const open = page.locator('button[aria-label="Open menu"]'); out.menuTrigger = await open.isVisible(); out.expandedBefore = await open.getAttribute('aria-expanded'); await open.click(); await page.waitForTimeout(50); out.expandedOpen = await open.getAttribute('aria-expanded'); await page.keyboard.press('Escape'); await page.waitForTimeout(50); out.expandedClosed = await open.getAttribute('aria-expanded'); out.menuClassAfterEscape = await page.locator('.pcm-static-mobile').getAttribute('class'); if (out.menuClassAfterEscape?.includes('is-open')) await page.locator('button[aria-label="Close menu"]').click(); out.menuClassFinal = await page.locator('.pcm-static-mobile').getAttribute('class'); }
  else { const open = page.getByRole('button', { name:'Services', exact:true }); out.menuTrigger = await open.isVisible(); await open.click(); out.menuOpened = await page.locator('header a[href="/local/"]').first().isVisible(); await page.keyboard.press('Escape'); }
  const chat = page.locator('button[aria-label="Open chat assistant"]'); out.chatLauncher = await chat.isVisible(); await chat.click(); const close = page.locator('button[aria-label*="Close chat"]'); out.chatOpened = await close.isVisible(); out.chatFits = await page.locator('.pcm-static-chat-panel').evaluate((x) => { const r=x.getBoundingClientRect(); return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight; }); await close.click(); out.chatClosed = !await close.isVisible(); return out;
}

const results = [];
for (const [path, from, fromFull, to, toFull] of routes) {
  const html = await readFile(resolve('site-copy', path.slice(1), 'index.html'), 'utf8'), messages = [], page = await browser.newPage({ viewport:{width:1280,height:900} });
  page.on('console', (m) => { if (["error", "warning"].includes(m.type())) messages.push(`${m.type()}: ${m.text()}`); }); page.on('pageerror', (e) => messages.push(`pageerror: ${e.message}`));
  await page.goto(new URL(path, base).href, { waitUntil:'domcontentloaded' }); const initial = await snap(page); await page.waitForTimeout(1500); const oneSecond = await snap(page); await page.waitForTimeout(4000); const fiveSeconds = await snap(page);
  const desktop = await responsive(page,{width:1280,height:900}), desktopInteractions = await interactions(page,false), mobile = await responsive(page,{width:390,height:844}), mobileInteractions = await interactions(page,true);
  results.push({ path, expected:{from,fromFull,to,toFull}, raw:raw(html), lifecycle:{initial,oneSecond,fiveSeconds}, responsive:{desktop,mobile}, interactions:{desktop:desktopInteractions,mobile:mobileInteractions}, consoleMessages:[...new Set(messages)] }); await page.close();
}
await browser.close(); await writeFile(output, `${JSON.stringify({generatedAt:new Date().toISOString(),results},null,2)}\n`); console.log(`Wrote ${output}`);
