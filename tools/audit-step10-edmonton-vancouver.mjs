import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4175";
const output = resolve(process.argv[4] ?? "STEP_10_EDMONTON_VANCOUVER_AUDIT.json");
if (!process.env.PLAYWRIGHT_PATH) throw new Error("PLAYWRIGHT_PATH is required");
const { chromium } = await import(process.env.PLAYWRIGHT_PATH.startsWith("file:") ? process.env.PLAYWRIGHT_PATH : pathToFileURL(process.env.PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ executablePath: process.env.PCM_BROWSER_EXECUTABLE || undefined, headless: true });

const routes = [
  { path: "/edmonton-to-vancouver-movers/", from: "Edmonton, AB", to: "Vancouver, BC", faqCount: 9 },
  { path: "/vancouver-to-edmonton-movers/", from: "Vancouver, BC", to: "Edmonton, AB", faqCount: 9 },
];
const clean = (value) => String(value ?? "").replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"').replace(/\s+/g, " ").trim();

function faqNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => faqNodes(item, nodes));
  else Object.values(value).forEach((item) => faqNodes(item, nodes));
  return nodes;
}

function rawAudit(html, route) {
  const body = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const routeBody = body.replace(/<(header|footer|nav)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const headingIndex = body.indexOf(">Frequently Asked Questions</h2>");
  const start = body.lastIndexOf("<section", headingIndex);
  const end = body.indexOf("</section>", headingIndex);
  const faq = start >= 0 && end >= 0 ? body.slice(start, end + 10) : "";
  const visible = [...faq.matchAll(/<(h3|h4|summary)\b[^>]*>([\s\S]*?)<\/\1>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => ({ question: clean(match[2]), answer: clean(match[3]) }));
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => { try { return faqNodes(JSON.parse(match[1])); } catch { return []; } });
  const schema = schemas[0]?.mainEntity?.map((item) => ({ question: clean(item.name), answer: clean(item.acceptedAnswer?.text) })) ?? [];
  const attr = (pattern) => clean(html.match(pattern)?.[1]);
  const form = body.match(/<form\b[^>]*class="[^"]*pcm-estimate-form[^"]*"[^>]*>([\s\S]*?)<\/form>/i)?.[1] ?? "";
  const value = (name) => clean(form.match(new RegExp(`<input[^>]*name=["']${name}["'][^>]*value=["']([^"']*)`, "i"))?.[1]);
  const ownership = routeOwnershipByUrl.get(route.path);
  return {
    owner: ownership?.owner, rendering: ownership?.rendering, postProcessors: ownership?.postProcessors,
    reactBootstrap: /type=["']module["'][^>]*index-CNBNs70h\.js/i.test(html), conversionRuntime: /assets\/conversion-boost\.js/i.test(html),
    title: attr(/<title[^>]*>([\s\S]*?)<\/title>/i), ogTitle: attr(/<meta property="og:title" content="([^"]*)"/i), twitterTitle: attr(/<meta name="twitter:title" content="([^"]*)"/i),
    description: attr(/<meta name="description" content="([^"]*)"/i), canonical: attr(/<link rel="canonical"[^>]*href="([^"]*)"/i), ogUrl: attr(/<meta property="og:url" content="([^"]*)"/i),
    formValues: { from: value("from"), to: value("to") },
    counts: { h1:(body.match(/<h1\b/gi) ?? []).length, quote:(body.match(/class="[^"]*pcm-lead-panel\b/gi) ?? []).length, form:(body.match(/<form\b/gi) ?? []).length, pricing:(body.match(/class="[^"]*pcm-route-cost\b/gi) ?? []).length, table:(body.match(/<table\b/gi) ?? []).length, glance:(body.match(/Route at a Glance/gi) ?? []).length, faqSection:faq ? 1 : 0, faqHeading:(faq.match(/Frequently Asked Questions/gi) ?? []).length, visibleFaq:visible.length, faqPage:schemas.length, localSeo:(body.match(/class="[^"]*pcm-local-seo/gi) ?? []).length },
    faqParity: schemas.length === 1 && JSON.stringify(visible) === JSON.stringify(schema), undefinedVisible:/\bundefined\b/i.test(clean(routeBody)), legacyPricing:/Moving Cost Breakdown/i.test(clean(routeBody)), staleTerminology:/\bfully insured\b|\bvaluation coverage\b/i.test(clean(routeBody)),
  };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const text = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
    const headings = [...document.querySelectorAll("h2")].filter((node) => /^Frequently Asked Questions$/i.test(text(node.textContent)));
    const faq = headings[0]?.closest("section");
    const visible = [...(faq?.querySelectorAll("h3") ?? [])].map((heading) => ({ question:text(heading.textContent), answer:text(heading.nextElementSibling?.textContent) }));
    const schemas=[]; const walk=(value)=>{if(!value||typeof value!=="object")return;if(value["@type"]==="FAQPage")schemas.push((value.mainEntity??[]).map((item)=>({question:text(item.name),answer:text(item.acceptedAnswer?.text)})));if(Array.isArray(value))value.forEach(walk);else Object.values(value).forEach(walk)};
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script)=>{try{walk(JSON.parse(script.textContent))}catch{}});
    const pricing=document.querySelector(".pcm-route-cost"); const glance=document.querySelector(".pcm-step10-glance"); const form=document.querySelector(".pcm-lead-panel form"); const h1=document.querySelector("h1"); const routeText=`${document.querySelector("main")?.innerText??""} ${document.querySelector(".pcm-lead-panel")?.innerText??""} ${pricing?.innerText??""}`;
    const style=(node)=>node?getComputedStyle(node):null; const font=(node)=>style(node)?.fontFamily??""; const h1Style=style(h1); const wrap=pricing?.querySelector(".pcm-route-cost__table-wrap")??pricing?.querySelector("[class*=overflow]"); const bodyText=document.body.innerText;
    return {
      title:document.title, ogTitle:document.querySelector('meta[property="og:title"]')?.content, twitterTitle:document.querySelector('meta[name="twitter:title"]')?.content, description:document.querySelector('meta[name="description"]')?.content, canonical:document.querySelector('link[rel="canonical"]')?.href, ogUrl:document.querySelector('meta[property="og:url"]')?.content,
      from:form?.querySelector('[name="from"]')?.value, to:form?.querySelector('[name="to"]')?.value,
      h1:text(h1?.textContent), h1Style:h1Style?{family:h1Style.fontFamily,size:h1Style.fontSize,lineHeight:h1Style.lineHeight,weight:h1Style.fontWeight}:null,
      fonts:{body:font(document.body),paragraph:font(document.querySelector("main p")),pricing:font(pricing?.querySelector("td")??pricing),faq:font(faq?.querySelector("p")),form:font(form?.querySelector("input")??form),button:font(form?.querySelector("button")??form),cta:font(document.querySelector('main a[href="/contact/"]'))},
      counts:{h1:document.querySelectorAll("h1").length,quote:document.querySelectorAll(".pcm-lead-panel").length,form:document.querySelectorAll(".pcm-lead-panel form").length,pricing:document.querySelectorAll(".pcm-route-cost").length,table:pricing?.querySelectorAll("table").length??0,rows:pricing?.querySelectorAll("tbody tr").length??0,glance:document.querySelectorAll(".pcm-step10-glance").length,faqSection:new Set(headings.map((node)=>node.closest("section"))).size,faqHeading:headings.length,visibleFaq:visible.length,faqPage:schemas.length,localSeo:document.querySelectorAll(".pcm-local-seo").length,nav:document.querySelectorAll("header nav,nav").length,chat:document.querySelectorAll('button[aria-label="Open chat assistant"]').length},
      faqParity:schemas.length===1&&JSON.stringify(visible)===JSON.stringify(schemas[0]), facts:{distance:/1,160 km/.test(`${pricing?.innerText} ${glance?.innerText} ${faq?.innerText} ${bodyText}`),transit:/4–13 days/.test(`${pricing?.innerText} ${glance?.innerText} ${faq?.innerText}`),prices:["$2,200+","$2,800+","$3,800+","$5,200+","$7,000+"].every((value)=>`${pricing?.innerText} ${faq?.innerText}`.includes(value)),range:/\$2,200–\$7,000\+/.test(glance?.innerText??"")},
      pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth, pricingInternalScroll:Boolean(wrap&&wrap.scrollWidth>wrap.clientWidth), clippedControls:[...document.querySelectorAll("input,select,button")].filter((node)=>{const box=node.getBoundingClientRect();return box.width>0&&(box.left < -1||box.right>document.documentElement.clientWidth+1)}).length,
      undefinedVisible:/\bundefined\b/i.test(routeText),soft404:/Page Not Found/i.test(routeText),legacyPricing:/Moving Cost Breakdown/i.test(routeText),staleTerminology:/\bfully insured\b|\bvaluation coverage\b/i.test(routeText),
      order:[...document.querySelectorAll("body > section,#root > section,#root > div > main > section")].map((node)=>text(node.querySelector("h1,h2,h3")?.textContent||node.className)),
    };
  });
}

async function interactions(page, mobile) {
  const result={};
  if(mobile){const trigger=page.locator('button[aria-label="Open menu"]');result.navTrigger=await trigger.count()===1&&await trigger.isVisible();if(result.navTrigger){await trigger.click();await page.waitForTimeout(150);result.navOpened=await trigger.getAttribute("aria-expanded");await page.keyboard.press("Escape");await page.waitForTimeout(150);result.navClosed=await trigger.getAttribute("aria-expanded");}}
  else{const trigger=page.getByRole("button",{name:"Services",exact:true});result.navTrigger=await trigger.count()>0&&await trigger.first().isVisible();if(result.navTrigger){await trigger.first().click();await page.waitForTimeout(150);result.navOpened=await page.locator('header a[href="/local/"]').first().isVisible();await page.mouse.click(8,500);}}
  const launcher=page.locator('button[aria-label="Open chat assistant"]');result.chatLauncher=await launcher.count()===1&&await launcher.isVisible();if(result.chatLauncher){await launcher.click();await page.waitForTimeout(150);const close=page.locator('button[aria-label="Close chat assistant"],button[aria-label*="Close chat"]');result.chatOpened=await close.count()>0&&await close.first().isVisible();if(result.chatOpened){await close.first().click();await page.waitForTimeout(100);result.chatClosed=!await close.first().isVisible();}}
  return result;
}

const results=[];
for(const route of routes){
  const html=await readFile(join(root,route.path.slice(1),"index.html"),"utf8"); const page=await browser.newPage({viewport:{width:1280,height:900}}); const errors=[];
  page.on("pageerror",(error)=>errors.push(`pageerror: ${error.message}`)); page.on("console",(message)=>{if(message.type()==="error"&&!/ERR_NETWORK_ACCESS_DENIED|favicon/i.test(message.text()))errors.push(`console: ${message.text()}`)}); page.on("requestfailed",(request)=>{const failure=request.failure()?.errorText??"";if(!/ERR_NETWORK_ACCESS_DENIED|ERR_NAME_NOT_RESOLVED|ERR_FAILED/.test(failure))errors.push(`requestfailed: ${request.url()} (${failure})`)});
  await page.goto(new URL(route.path,baseUrl).href,{waitUntil:"domcontentloaded",timeout:30000}); const initial=await snapshot(page); await page.waitForTimeout(1500); const oneToTwoSeconds=await snapshot(page); await page.waitForTimeout(4000); const fivePlusSeconds=await snapshot(page); const desktopInteractions=await interactions(page,false);
  await page.setViewportSize({width:390,height:844}); await page.reload({waitUntil:"domcontentloaded"}); await page.waitForTimeout(5500); const mobile=await snapshot(page); const mobileInteractions=await interactions(page,true);
  results.push({route:route.path,expected:route,raw:rawAudit(html,route),lifecycle:{initial,oneToTwoSeconds,fivePlusSeconds},responsive:{desktop1280x900:fivePlusSeconds,mobile390x844:mobile},interactions:{desktop:desktopInteractions,mobile:mobileInteractions},applicationErrors:[...new Set(errors)]}); await page.close();
}
await browser.close(); await writeFile(output,`${JSON.stringify({generatedAt:new Date().toISOString(),results},null,2)}\n`);
for(const item of results) console.log(`${item.route}: raw FAQ ${item.raw.counts.visibleFaq}/${item.raw.counts.faqPage}, rendered FAQ ${item.lifecycle.fivePlusSeconds.counts.visibleFaq}/${item.lifecycle.fivePlusSeconds.counts.faqPage}, rawParity=${item.raw.faqParity}, errors=${item.applicationErrors.length}`);
console.log(`Wrote ${output}`);
