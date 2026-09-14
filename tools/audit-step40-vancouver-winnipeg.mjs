import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";
import { VANCOUVER_WINNIPEG_BY_PATH } from "./vancouver-winnipeg-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4176";
const output = resolve(process.argv[4] ?? "STEP_40_VANCOUVER_WINNIPEG_AUDIT.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required.");
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });
const bundle = await readFile(join(root, "assets", "index-CNBNs70h.js"), "utf8");
const clean = (value) => String(value ?? "").replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replace(/\s+/g, " ").trim();

function faqNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => faqNodes(item, nodes));
  else Object.values(value).forEach((item) => faqNodes(item, nodes));
  return nodes;
}

function rawAudit(html, route) {
  const ownership = routeOwnershipByUrl.get(route);
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => { try { return faqNodes(JSON.parse(match[1])); } catch { return []; } });
  const pick = (pattern) => clean(html.match(pattern)?.[1]);
  return {
    owner: ownership.owner, postProcessors: ownership.postProcessors, declaredRender: ownership.rendering,
    actualRender: /<script\b[^>]*type=["']module["'][^>]*index-CNBNs70h\.js/i.test(html) ? "react-spa" : "static",
    reactBootstrap: /<script\b[^>]*type=["']module["'][^>]*index-CNBNs70h\.js/i.test(html), exactReactSupport: bundle.includes(route),
    staticNav: /static-nav\.js/i.test(html), staticChat: /static-chat\.js/i.test(html), conversionRuntime: /conversion-boost\.js/i.test(html),
    title: pick(/<title\b[^>]*>([\s\S]*?)<\/title>/i), ogTitle: pick(/<meta property="og:title" content="([^"]*)"/i), twitterTitle: pick(/<meta name="twitter:title" content="([^"]*)"/i),
    description: pick(/<meta name="description" content="([^"]*)"/i), canonical: pick(/<link rel="canonical"[^>]*href="([^"]*)"/i), ogUrl: pick(/<meta property="og:url" content="([^"]*)"/i),
    h1: clean(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]),
    counts: { h1:(body.match(/<h1\b/gi) ?? []).length, quote:(body.match(/pcm-top-estimate-wrap|pcm-lead-panel/gi) ?? []).length, form:(body.match(/<form\b/gi) ?? []).length, pricing:(body.match(/class="[^"]*pcm-route-cost\b/gi) ?? []).length, table:(body.match(/<table\b/gi) ?? []).length, glance:(body.match(/Route at a Glance/gi) ?? []).length, faqHeading:(body.match(/Frequently Asked Questions/gi) ?? []).length, faqPage:schemas.length, localSeo:(body.match(/pcm-local-seo/gi) ?? []).length, footer:(body.match(/<footer\b/gi) ?? []).length },
    contamination: { torontoBody:/TORONTO TO VANCOUVER MOVERS|toronto-long-distance-movers/i.test(body), expiredPromotion:/Book before September|Online estimate bonus/i.test(body), undefined:/\bundefined\b/i.test(body) },
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const cleanText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const faq = document.querySelector(".pcm-step40-faq");
    const visibleFaq = [...(faq?.querySelectorAll("article") ?? [])].map((item) => ({ question:cleanText(item.querySelector("h3")?.textContent), answer:cleanText(item.querySelector("p")?.textContent) }));
    const schemas = [];
    const walk = (value) => { if (!value || typeof value !== "object") return; if (value["@type"] === "FAQPage") schemas.push((value.mainEntity ?? []).map((item) => ({ question:cleanText(item.name), answer:cleanText(item.acceptedAnswer?.text) }))); if (Array.isArray(value)) value.forEach(walk); else Object.values(value).forEach(walk); };
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => { try { walk(JSON.parse(script.textContent)); } catch {} });
    const quote = document.querySelector(".pcm-lead-panel,.pcm-top-estimate-wrap");
    const pricing = document.querySelector(".pcm-step40-pricing");
    const glance = document.querySelector(".pcm-step40-glance");
    const relevant = cleanText([document.querySelector(".pcm-step40-main")?.innerText, pricing?.innerText, faq?.innerText].join(" "));
    const h1 = document.querySelector("h1"); const h1Style = h1 && getComputedStyle(h1);
    return {
      ready:document.documentElement.dataset.pcmStep40Ready, h1:cleanText(h1?.textContent), h1Count:document.querySelectorAll("h1").length,
      h1Style:h1Style ? [h1Style.fontFamily,h1Style.fontSize,h1Style.lineHeight,h1Style.fontWeight] : null,
      from:quote?.querySelector('[name="from"]')?.value, to:quote?.querySelector('[name="to"]')?.value,
      title:document.title, ogTitle:document.querySelector('meta[property="og:title"]')?.content, twitterTitle:document.querySelector('meta[name="twitter:title"]')?.content,
      description:document.querySelector('meta[name="description"]')?.content, canonical:document.querySelector('link[rel="canonical"]')?.href, ogUrl:document.querySelector('meta[property="og:url"]')?.content,
      counts:{ quote:document.querySelectorAll(".pcm-lead-panel,.pcm-top-estimate-wrap").length, form:quote?.querySelectorAll("form").length ?? 0, trustPills:quote?.querySelectorAll(".pcm-trust-row span,.pcm-pills span").length ?? 0, pricing:document.querySelectorAll(".pcm-step40-pricing").length, table:pricing?.querySelectorAll("table").length ?? 0, rows:pricing?.querySelectorAll("tbody tr").length ?? 0, glance:document.querySelectorAll(".pcm-step40-glance").length, faq:document.querySelectorAll(".pcm-step40-faq").length, faqHeading:[...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(cleanText(node.textContent))).length, faqSchema:schemas.length, localSeo:document.querySelectorAll(".pcm-local-seo").length, footer:document.querySelectorAll("footer").length, launcher:document.querySelectorAll('button[aria-label="Open chat assistant"]').length },
      facts:{ distance:relevant.includes("2,300 km"), transit:relevant.includes("5–13 days"), range:relevant.includes("$2,400–$13,000+"), prices:["$2,400+","$3,400+","$5,500+","$8,900+","$13,000+"].every((value) => relevant.includes(value)) },
      faqParity:schemas.length === 1 && JSON.stringify(visibleFaq) === JSON.stringify(schemas[0]),
      contamination:/TORONTO TO VANCOUVER MOVERS|Book before September|Online estimate bonus|Moving Cost Breakdown|Route Pricing/i.test(document.body.innerText) || Boolean(document.querySelector('main a[href="/toronto-long-distance-movers/"]')),
      staleTerminology:/\bfully insured\b|\bvaluation coverage\b/i.test(relevant), undefined:/\bundefined\b/i.test(document.body.innerText), homepage:/Your Move\. Our Family\. One Standard:/i.test(document.body.innerText), soft404:/Page Not Found/i.test(document.body.innerText),
    };
  });
}

async function responsive(page, viewport) {
  await page.setViewportSize(viewport); await page.reload({ waitUntil:"domcontentloaded" }); await page.waitForSelector('html[data-pcm-step40-ready="1"]'); await page.waitForTimeout(350);
  return page.evaluate(() => { const style = (selector) => { const node=document.querySelector(selector); const value=node && getComputedStyle(node); return value ? { display:value.display, columns:value.gridTemplateColumns, overflowX:value.overflowX, font:value.fontFamily } : null; }; const wrap=document.querySelector(".pcm-route-cost__table-wrap"), h1=getComputedStyle(document.querySelector("h1")); return { viewport:[innerWidth,innerHeight], pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth, h1:[h1.fontSize,h1.lineHeight,h1.fontWeight], bodyFont:getComputedStyle(document.querySelector('[data-pcm-static-route]')).fontFamily, quote:style(".pcm-lead-panel__inner,.pcm-top-estimate"), glance:style(".pcm-step40-glance__grid"), pricing:style(".pcm-route-cost__table-wrap"), tableMinWidth:getComputedStyle(document.querySelector(".pcm-route-cost table")).minWidth, pricingInternalScroll:Boolean(wrap && wrap.scrollWidth>wrap.clientWidth), brokenImages:[...document.images].filter((image)=>image.complete&&image.naturalWidth===0).map((image)=>image.currentSrc||image.src) }; });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const open=page.locator('button[aria-label="Open menu"]'); result.trigger=await open.count()===1&&await open.isVisible(); result.expandedBefore=result.trigger?await open.getAttribute("aria-expanded"):null;
    if (result.trigger) { await open.click(); await page.waitForTimeout(250); result.expandedOpen=await open.getAttribute("aria-expanded"); const panel=page.locator(".pcm-static-mobile"); result.opened=await panel.count()===1&&await panel.evaluate((node)=>node.classList.contains("is-open")); await page.keyboard.press("Escape"); await page.waitForTimeout(250); result.expandedClosed=await open.getAttribute("aria-expanded"); result.closed=await panel.count()===0||!await panel.evaluate((node)=>node.classList.contains("is-open")); if(!result.closed){await page.locator('button[aria-label="Close menu"]').click();await page.waitForTimeout(150);} }
  } else {
    const trigger=page.getByRole("button",{name:"Services",exact:true}); result.trigger=await trigger.count()===1&&await trigger.isVisible(); if(result.trigger){await trigger.click();await page.waitForTimeout(200);result.opened=await page.locator('header a[href="/local/"]').first().isVisible();await page.mouse.click(5,500);}
  }
  const launcher=page.locator('button[aria-label="Open chat assistant"]'); result.chatLauncher=await launcher.count()===1&&await launcher.isVisible(); if(result.chatLauncher){await launcher.click();await page.waitForTimeout(200);const close=page.locator('button[aria-label*="Close chat"]');result.chatOpened=await close.count()===1&&await close.isVisible();if(result.chatOpened){await close.click();await page.waitForTimeout(100);result.chatClosed=!await close.isVisible();}}
  return result;
}

const results=[];
for (const [route,expected] of Object.entries(VANCOUVER_WINNIPEG_BY_PATH)) {
  const html=await readFile(join(root,route.slice(1),"index.html"),"utf8"), messages=[];
  const page=await browser.newPage({viewport:{width:1280,height:900}}); page.on("console",(message)=>{if(["error","warning"].includes(message.type()))messages.push(`${message.type()}: ${message.text()}`);}); page.on("pageerror",(error)=>messages.push(`pageerror: ${error.message}`));
  await page.goto(new URL(route,baseUrl).href,{waitUntil:"domcontentloaded"}); const initial=await snapshot(page); await page.waitForSelector('html[data-pcm-step40-ready="1"]'); const hydrated=await snapshot(page); await page.waitForTimeout(1200); const oneSecond=await snapshot(page); await page.waitForTimeout(4200); const fiveSeconds=await snapshot(page);
  const desktop=await responsive(page,{width:1280,height:900}), desktopInteractions=await interactions(page,false), mobile=await responsive(page,{width:390,height:844}), mobileInteractions=await interactions(page,true);
  results.push({route,expected,raw:rawAudit(html,route),lifecycle:{initial,hydrated,oneSecond,fiveSeconds},responsive:{desktop,mobile},interactions:{desktop:desktopInteractions,mobile:mobileInteractions},consoleMessages:[...new Set(messages)]}); await page.close();
}
await browser.close(); await writeFile(output,`${JSON.stringify({generatedAt:new Date().toISOString(),results},null,2)}\n`); console.log(`Wrote ${output}`);
