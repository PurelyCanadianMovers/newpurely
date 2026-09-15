import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[4] ?? "STEP_54_CALGARY_TORONTO_AUDIT.json");
const playwrightPath = process.env.PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(playwrightPath.startsWith("file:") ? playwrightPath : pathToFileURL(playwrightPath).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });

const routeFilter = process.argv[5];
const routes = [
  { path: "/calgary-to-toronto-movers/", from: "Calgary, AB", to: "Toronto, ON", faqCount: 11 },
  { path: "/toronto-to-calgary-movers/", from: "Toronto, ON", to: "Calgary, AB", faqCount: 9 },
].filter((route) => !routeFilter || route.path.includes(routeFilter));
const clean = (value) => String(value ?? "").replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replaceAll("&#39;", "'").replace(/\s+/g, " ").trim();

function faqNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => faqNodes(item, nodes));
  else Object.values(value).forEach((item) => faqNodes(item, nodes));
  return nodes;
}

function rawAudit(html, route) {
  const body = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const faqHeadingIndex = body.indexOf(">Frequently Asked Questions</h2>");
  const faqStart = body.lastIndexOf("<section", faqHeadingIndex);
  const faqEnd = body.indexOf("</section>", faqHeadingIndex);
  const faq = faqStart >= 0 && faqEnd >= 0 ? body.slice(faqStart, faqEnd + 10) : "";
  const visible = [...faq.matchAll(/<(h3|h4|summary)\b[^>]*>([\s\S]*?)<\/\1>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => ({ question: clean(match[2]), answer: clean(match[3]) }));
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => { try { return faqNodes(JSON.parse(match[1])); } catch { return []; } });
  const schema = schemas[0]?.mainEntity?.map((item) => ({ question: clean(item.name), answer: clean(item.acceptedAnswer?.text) })) ?? [];
  const attr = (pattern) => clean(html.match(pattern)?.[1]);
  const ownership = routeOwnershipByUrl.get(route.path);
  return {
    owner: ownership?.owner, rendering: ownership?.rendering, postProcessors: ownership?.postProcessors,
    reactBootstrap: /type=["']module["'][^>]*index-CNBNs70h\.js/i.test(html),
    title: attr(/<title[^>]*>([\s\S]*?)<\/title>/i), ogTitle: attr(/<meta property="og:title" content="([^"]*)"/i), twitterTitle: attr(/<meta name="twitter:title" content="([^"]*)"/i),
    description: attr(/<meta name="description" content="([^"]*)"/i), canonical: attr(/<link rel="canonical"[^>]*href="([^"]*)"/i), ogUrl: attr(/<meta property="og:url" content="([^"]*)"/i),
    counts: { h1:(body.match(/<h1\b/gi) ?? []).length, quote:(body.match(/class="[^"]*pcm-lead-panel\b/gi) ?? []).length, form:(body.match(/<form\b/gi) ?? []).length, pricing:(body.match(/class="[^"]*pcm-route-cost\b/gi) ?? []).length, table:(body.match(/<table\b/gi) ?? []).length, glance:(body.match(/Route at a Glance/gi) ?? []).length, faqSection:faq ? 1 : 0, faqHeading:(faq.match(/Frequently Asked Questions/gi) ?? []).length, visibleFaq:visible.length, faqPage:schemas.length, localSeo:(body.match(/pcm-local-seo/gi) ?? []).length },
    faqParity: schemas.length === 1 && JSON.stringify(visible) === JSON.stringify(schema),
    undefinedVisible: /\bundefined\b/i.test(clean(body)),
    legacyPricing: /Moving Cost Breakdown/i.test(clean(body)),
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const text = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const faqHeadings = [...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(text(node.textContent)));
    const faqSection = faqHeadings[0]?.closest("section");
    const visible = [...(faqSection?.querySelectorAll("h3") ?? [])].map((heading) => ({ question:text(heading.textContent), answer:text(heading.nextElementSibling?.textContent) }));
    const schemas=[]; const walk=(value)=>{if(!value||typeof value!=="object")return;if(value["@type"]==="FAQPage")schemas.push((value.mainEntity??[]).map((item)=>({question:text(item.name),answer:text(item.acceptedAnswer?.text)})));if(Array.isArray(value))value.forEach(walk);else Object.values(value).forEach(walk)};
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script)=>{try{walk(JSON.parse(script.textContent))}catch{}});
    const pricing = document.querySelector(".pcm-route-cost");
    const glance = document.querySelector(".pcm-step22-glance");
    const form = document.querySelector(".pcm-lead-panel form");
    const h1 = document.querySelector("h1");
    const h1Style = h1 && getComputedStyle(h1);
    const bodyStyle = getComputedStyle(document.body);
    const faqText = faqSection?.innerText ?? "";
    const bodyText = document.body.innerText;
    return {
      title:document.title, ogTitle:document.querySelector('meta[property="og:title"]')?.content, twitterTitle:document.querySelector('meta[name="twitter:title"]')?.content,
      description:document.querySelector('meta[name="description"]')?.content, canonical:document.querySelector('link[rel="canonical"]')?.href, ogUrl:document.querySelector('meta[property="og:url"]')?.content,
      from:form?.querySelector('[name="from"]')?.value, to:form?.querySelector('[name="to"]')?.value,
      h1:text(h1?.textContent), h1Style:h1Style ? { family:h1Style.fontFamily, size:h1Style.fontSize, lineHeight:h1Style.lineHeight, weight:h1Style.fontWeight } : null,
      fonts:{ body:bodyStyle.fontFamily, faq:faqSection?getComputedStyle(faqSection.querySelector("p")??faqSection).fontFamily:"", form:form?getComputedStyle(form.querySelector("input")??form).fontFamily:"", button:form?getComputedStyle(form.querySelector("button")??form).fontFamily:"" },
      counts:{ h1:document.querySelectorAll("h1").length, quote:document.querySelectorAll(".pcm-lead-panel").length, form:document.querySelectorAll(".pcm-lead-panel form").length, pricing:document.querySelectorAll(".pcm-route-cost").length, table:pricing?.querySelectorAll("table").length??0, rows:pricing?.querySelectorAll("tbody tr").length??0, glance:document.querySelectorAll(".pcm-step22-glance").length, faqSection:new Set(faqHeadings.map((node)=>node.closest("section"))).size, faqHeading:faqHeadings.length, visibleFaq:visible.length, faqPage:schemas.length, localSeo:document.querySelectorAll(".pcm-local-seo").length, nav:document.querySelectorAll("header nav, nav").length, chat:document.querySelectorAll('button[aria-label="Open chat assistant"]').length },
      faqParity:schemas.length===1&&JSON.stringify(visible)===JSON.stringify(schemas[0]),
      facts:{ distance:/3,400 km/.test(document.body.innerText), transit:/7–19 days/.test(`${pricing?.innerText} ${glance?.innerText} ${faqText}`), prices:["$2,500+","$3,800+","$6,400+","$10,000+","$15,000+"].every((value)=>`${pricing?.innerText} ${faqText}`.includes(value)), range:/\$2,500–\$15,000\+/.test(glance?.innerText??"") },
      pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,
      pricingInternalScroll:Boolean(pricing?.querySelector(".pcm-route-cost__table-wrap")?.scrollWidth>pricing?.querySelector(".pcm-route-cost__table-wrap")?.clientWidth),
      clippedControls:[...document.querySelectorAll("input,select,button")].filter((node)=>{const box=node.getBoundingClientRect();return box.width>0&&(box.left < -1||box.right>document.documentElement.clientWidth+1)}).length,
      undefinedVisible:/\bundefined\b/i.test(bodyText), soft404:/Page Not Found/i.test(bodyText), legacyPricing:/Moving Cost Breakdown/i.test(bodyText),
      contamination:Object.fromEntries(["Vancouver","Winnipeg","Montreal","Edmonton","Ottawa","Halifax","Victoria","Seattle"].map((city)=>[city,new RegExp(city,"i").test(text(document.querySelector("main")?.innerText))])),
    };
  });
}

async function interactions(page, mobile) {
  const result = {};
  if (mobile) {
    const trigger = page.locator('button[aria-label="Open menu"]');
    result.navTrigger = await trigger.count() === 1 && await trigger.isVisible();
    if (result.navTrigger) { await trigger.click(); await page.waitForTimeout(150); result.navOpened = await trigger.getAttribute("aria-expanded"); await page.keyboard.press("Escape"); await page.waitForTimeout(150); result.navClosed = await trigger.getAttribute("aria-expanded"); }
  } else {
    const trigger = page.getByRole("button", { name:"Services", exact:true });
    result.navTrigger = await trigger.count() > 0 && await trigger.first().isVisible();
    if (result.navTrigger) { await trigger.first().click(); await page.waitForTimeout(150); result.navOpened = await page.locator('header a[href="/local/"]').first().isVisible(); await page.keyboard.press("Escape"); }
  }
  const launcher = page.locator('button[aria-label="Open chat assistant"]');
  result.chatLauncher = await launcher.count() === 1 && await launcher.isVisible();
  if (result.chatLauncher) { await launcher.click(); await page.waitForTimeout(150); const close=page.locator('button[aria-label="Close chat assistant"],button[aria-label*="Close chat"]'); result.chatOpened=await close.count()>0&&await close.first().isVisible(); if(result.chatOpened){await close.first().click();await page.waitForTimeout(100);result.chatClosed=!await close.first().isVisible();} }
  return result;
}

const results=[];
for (const route of routes) {
  const html=await readFile(join(root,route.path.slice(1),"index.html"),"utf8");
  const page=await browser.newPage({viewport:{width:1280,height:900}}); const consoleErrors=[];
  page.setDefaultTimeout(5000);
  page.on("pageerror",(error)=>consoleErrors.push(`pageerror: ${error.message}`)); page.on("console",(message)=>{if(message.type()==="error")consoleErrors.push(`console: ${message.text()}`)});
  await page.goto(new URL(route.path,baseUrl).href,{waitUntil:"commit",timeout:10000});
  await page.waitForLoadState("domcontentloaded",{timeout:5000}).catch(()=>{});
  const initial=await snapshot(page); await page.waitForTimeout(1200); const oneToTwoSeconds=await snapshot(page); await page.waitForTimeout(4000); const fivePlusSeconds=await snapshot(page);
  const desktopInteractions=await interactions(page,false);
  await page.setViewportSize({width:390,height:844}); await page.reload({waitUntil:"commit",timeout:10000}); await page.waitForTimeout(1200); const mobile=await snapshot(page); const mobileInteractions=await interactions(page,true);
  results.push({route:route.path,expected:route,raw:rawAudit(html,route),lifecycle:{initial,oneToTwoSeconds,fivePlusSeconds},responsive:{desktop1280x900:fivePlusSeconds,mobile390x844:mobile},interactions:{desktop:desktopInteractions,mobile:mobileInteractions},consoleErrors:[...new Set(consoleErrors)]});
  await page.close();
}
await browser.close();
await writeFile(output,`${JSON.stringify({generatedAt:new Date().toISOString(),results},null,2)}\n`);
for(const item of results) console.log(`${item.route}: raw FAQ ${item.raw.counts.visibleFaq}/${item.raw.counts.faqPage}, rendered FAQ ${item.lifecycle.fivePlusSeconds.counts.visibleFaq}/${item.lifecycle.fivePlusSeconds.counts.faqPage}, parity=${item.raw.faqParity&&item.lifecycle.fivePlusSeconds.faqParity}`);
console.log(`Wrote ${output}`);
