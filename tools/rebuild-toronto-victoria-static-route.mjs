import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { torontoVictoriaStaticRoute as route } from "./toronto-victoria-static-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const file = join(root, route.slug, "index.html");
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const faqItems = route.faq.map(([question, answer]) => '<article class="bg-white border border-gray-200 rounded-lg p-6"><h3>' + esc(question) + '</h3><p>' + esc(answer) + "</p></article>").join("");
const faqSection = '<section id="pcm-step11-route-faq" data-pcm-route-faq-static="1" class="pcm-step11-faq py-16 bg-gray-50"><div class="container max-w-3xl"><h2>Frequently Asked Questions</h2><div class="space-y-4">' + faqItems + "</div></div></section>";
const faqSchema = '<script type="application/ld+json" id="pcm-step11-faq-schema">' + JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: route.faq.map(([name, answer]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: answer } })) }) + "</script>";
let html = await readFile(resolve("tools/templates/toronto-victoria-static-route.html"), "utf8");

html = html
  .replace(/<script\b[^>]*type=["']module["'][\s\S]*?<\/script>\s*/gi, "")
  .replace(/<script\b[^>]*id=["']pcm-step39-config["'][\s\S]*?<\/script>\s*/gi, "")
  .replace(/<script\b[^>]*id=["']pcm-step39-faq-schema["'][\s\S]*?<\/script>\s*/gi, "")
  .replace(/<link\b[^>]*href=["'][^"']*\/assets\/step39-toronto-victoria\.css[^"']*["'][^>]*>\s*/gi, "")
  .replace(/<script\b[^>]*src=["'][^"']*\/assets\/step39-toronto-victoria\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, "")
  .replace(/<section[^>]*class=["'][^"']*pcm-step39-faq[^"']*[\s\S]*?<\/section>\s*/i, "")
  .replace(/<style\b[^>]*>[\s\S]*?(?:pcm-step39|STEP39|Moving Cost Breakdown)[\s\S]*?<\/style>\s*/gi, "")
  .replace(/<html\b[^>]*>/i, '<html lang="en" class="pcm-step11-toronto-victoria">')
  .replace(/<body\b[^>]*>/i, '<body class="pcm-step11-toronto-victoria">')
  .replace(/<title[^>]*>[\s\S]*?<\/title>/i, "<title>" + esc(route.title) + "</title>")
  .replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="' + esc(route.description) + '">')
  .replace(/<meta property="og:title" content="[^"]*">/i, '<meta property="og:title" content="' + esc(route.title) + '">')
  .replace(/<meta property="og:description" content="[^"]*">/i, '<meta property="og:description" content="' + esc(route.description) + '">')
  .replace(/<meta name="twitter:title" content="[^"]*">/i, '<meta name="twitter:title" content="' + esc(route.title) + '">')
  .replace(/<meta name="twitter:description" content="[^"]*">/i, '<meta name="twitter:description" content="' + esc(route.description) + '">')
  .replace(/<meta property="og:url" content="[^"]*">/i, '<meta property="og:url" content="https://purelycanadianmovers.com' + route.path + '">')
  .replace(/<link rel="canonical"[^>]*>/i, '<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com' + route.path + '">')
  .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?FAQPage[\s\S]*?<\/script>\s*/gi, "")
  .replace(/pcm-step39-toronto-victoria/g, "pcm-step11-toronto-victoria")
  .replace(/pcm-step39-(main|pricing|glance|quote)/g, "pcm-step11-$1")
  .replace(/data-pcm-step39-(pricing|glance|quote)=["']1["']/g, 'data-pcm-step11-$1="1"')
  .replace(/<link\b[^>]*href=["'][^"']*\/assets\/(?:conversion-boost|static-nav|static-chat)\.css[^"']*["'][^>]*>\s*/gi, "")
  .replace(/<script\b[^>]*src=["'][^"']*\/assets\/(?:conversion-boost|static-nav|static-chat)\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, "")
  .replace(/<input name="from"[^>]*>/i, '<input name="from" placeholder="Toronto, ON" type="text" value="Toronto, ON">')
  .replace(/<input name="to"[^>]*>/i, '<input name="to" placeholder="Victoria, BC" type="text" value="Victoria, BC">')
  .replace(/\s*<\/head>/i, '\n<link rel="stylesheet" href="/assets/conversion-boost.css">\n<link rel="stylesheet" href="/assets/static-nav.css">\n<link rel="stylesheet" href="/assets/static-chat.css">\n<style data-step11-typography>html.pcm-step11-toronto-victoria h1{font-family:"Playfair Display",serif;font-size:48px;line-height:60px}@media (max-width:767px){html.pcm-step11-toronto-victoria h1{font-size:36px;line-height:45px}}</style>\n' + faqSchema + '\n</head>')
  .replace(/<\/body>/i, '<script defer src="/assets/conversion-boost.js"></script><script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script>\n</body>')
  .replace(/^[ \t]+$/gm, "");

if (!html.includes('id="pcm-step11-route-faq"')) html = html.replace(/<\/body>/i, faqSection + "\n</body>");
for (const value of [route.distanceShort, route.transit, route.overallRange, ...route.rows.flat()]) {
  if (!html.includes(value)) throw new Error("Missing Toronto–Victoria fact: " + value);
}
if (!/value="Toronto, ON"/.test(html) || !/value="Victoria, BC"/.test(html)) throw new Error("Toronto–Victoria form defaults missing");
if (/index-CNBNs70h\.js|type=["']module|step39-toronto-victoria|pcm-local-seo|Moving Cost Breakdown|undefined/i.test(html)) throw new Error("Forbidden React/runtime token remains");
if ((html.match(/id="pcm-step11-route-faq"/g) ?? []).length !== 1 || (html.match(/id="pcm-step11-faq-schema"/g) ?? []).length !== 1) throw new Error("Step 11 FAQ output is not singular");
if ((html.match(/<h1\b/gi) ?? []).length !== 1) throw new Error("Toronto–Victoria output must have one H1");
await writeFile(file, html, "utf8");
console.log("Rebuilt static Toronto–Victoria route: " + route.path);
