import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { edmontonOttawaFacts, ottawaEdmontonRoute } from "./ottawa-edmonton-static-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const template = resolve("tools/templates/ottawa-edmonton-static-route.html");
const file = join(root, ottawaEdmontonRoute.slug, "index.html");
const esc = (value) => value.replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
const faqHtml = ottawaEdmontonRoute.faq.map(([question, answer]) => `<article class="bg-white border border-gray-200 rounded-lg p-6"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("");
const faqSection = `<section id="pcm-step09-route-faq" data-pcm-route-faq-static="1" class="pcm-step09-faq py-16 bg-gray-50"><div class="container max-w-3xl"><h2>Frequently Asked Questions</h2><div class="space-y-4">${faqHtml}</div></div></section>`;
const faqSchema = `<script type="application/ld+json" id="pcm-step09-faq-schema">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: ottawaEdmontonRoute.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) })}</script>`;

let html = await readFile(template, "utf8");
html = html
  .replace(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<script\b[^>]*src=["'][^"']*(?:index-[^"']+\.js|step37-edmonton-ottawa\.js|openai-ads-attribution\.js)[^"']*["'][^>]*>\s*<\/script>\s*/gi, "")
  .replace(/<link[^>]+href=["'][^"']*\/assets\/(?:conversion-boost|static-nav|static-chat|step37-edmonton-ottawa)\.(?:css|js)(?:\?[^"']*)?["'][^>]*>\s*/gi, "")
  .replace(/<html\b[^>]*>/i, `<html class="pcm-step09-ottawa-edmonton" lang="en">`)
  .replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(ottawaEdmontonRoute.title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${esc(ottawaEdmontonRoute.description)}">`)
  .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${esc(ottawaEdmontonRoute.title)}">`)
  .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${esc(ottawaEdmontonRoute.description)}">`)
  .replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${esc(ottawaEdmontonRoute.title)}">`)
  .replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${esc(ottawaEdmontonRoute.description)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="https://purelycanadianmovers.com${ottawaEdmontonRoute.path}">`)
  .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com${ottawaEdmontonRoute.path}">`)
  .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?FAQPage[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<section[^>]*data-pcm-step37-faq="1"[\s\S]*?<\/section>/i, faqSection)
  .replace(/\s*<\/head>/i, `\n    <link rel="stylesheet" href="/assets/conversion-boost.css">\n    <link rel="stylesheet" href="/assets/static-nav.css">\n    <link rel="stylesheet" href="/assets/static-chat.css">\n    <style data-step09-typography>html.pcm-step09-ottawa-edmonton h1{font-size:48px;line-height:60px} @media (max-width: 767px){html.pcm-step09-ottawa-edmonton h1{font-size:36px;line-height:45px}}</style>\n    ${faqSchema}\n</head>`)
  .replace(/<\/body>/i, `\n<script defer src="/assets/conversion-boost.js"></script>\n<script defer src="/assets/static-nav.js"></script>\n<script defer src="/assets/static-chat.js"></script>\n</body>`)
  .replace(/^[ \t]+$/gm, "");
if (!html.includes('id="pcm-step09-route-faq"')) html = html.replace(/<\/body>/i, `${faqSection}\n</body>`);
for (const value of [edmontonOttawaFacts.distance, edmontonOttawaFacts.transit, edmontonOttawaFacts.overallRange, ...ottawaEdmontonRoute.prices]) if (!html.includes(value)) throw new Error(`Missing Ottawa–Edmonton fact: ${value}`);
if (/index-CNBNs70h\.js|type=["']module|step37-edmonton-ottawa|pcm-local-seo|Moving Cost Breakdown|undefined/i.test(html)) throw new Error("Forbidden Step 9 token remains");
if ((html.match(/id="pcm-step09-route-faq"/g) ?? []).length !== 1 || (html.match(/id="pcm-step09-faq-schema"/g) ?? []).length !== 1) throw new Error("Step 9 FAQ output is not singular");
await writeFile(file, html, "utf8");
console.log(`Rebuilt static Ottawa–Edmonton route: ${ottawaEdmontonRoute.path}`);
