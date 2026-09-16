import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { route } from "./montreal-victoria-static-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const template = resolve("tools/templates/montreal-victoria-static-route.html");
const file = join(root, route.slug, "index.html");
const esc = (value) => value.replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
const faqHtml = route.faqs.map(([question, answer]) => `<article class="pcm-card"><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`).join("");
const faqSchema = `<script type="application/ld+json" id="pcm-step08-faq-schema">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: route.faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) })}</script>`;

let html = await readFile(template, "utf8");
html = html
  .replace(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<script\b[^>]*src=["'][^"']*(?:index-[^"']+\.js|step23-[^"']+\.js|openai-ads-attribution\.js)[^"']*["'][^>]*>\s*<\/script>\s*/gi, "")
  .replace(/\s*<!-- STEP23_MONTREAL_VICTORIA_START -->[\s\S]*?<!-- STEP23_MONTREAL_VICTORIA_END -->\s*/gi, "\n")
  .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?FAQPage[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<link[^>]+href=["'][^"']*\/assets\/(?:conversion-boost|static-nav|static-chat)\.(?:css|js)(?:\?[^"']*)?["'][^>]*>\s*/gi, "")
  .replace(/<html\b[^>]*>/i, `<html class="pcm-step08-montreal-victoria" lang="en">`)
  .replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(route.title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${esc(route.description)}">`)
  .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${esc(route.title)}">`)
  .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${esc(route.description)}">`)
  .replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${esc(route.title)}">`)
  .replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${esc(route.description)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="https://purelycanadianmovers.com${route.path}">`)
  .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com${route.path}">`)
  .replace(/full-value protection options/gi, "Declared Value Protection options")
  .replace(/<link rel="stylesheet" crossorigin="" href="\.\.\/assets\/index-[^"]+\.css">/i, `$&\n    <link rel="stylesheet" href="/assets/conversion-boost.css">\n    <link rel="stylesheet" href="/assets/static-nav.css">\n    <link rel="stylesheet" href="/assets/static-chat.css">\n    <style data-step08-typography>html.pcm-step08-montreal-victoria h1{font-size:48px;line-height:60px} @media (max-width: 767px){html.pcm-step08-montreal-victoria h1{font-size:36px;line-height:45px}}</style>`)
  .replace(/\s*<\/head>/i, `\n  ${faqSchema}\n</head>`)
  .replace(/<\/body>/i, `\n<script defer src="/assets/conversion-boost.js"></script>\n<script defer src="/assets/static-nav.js"></script>\n<script defer src="/assets/static-chat.js"></script>\n</body>`)
  .replace(/^[ \t]+$/gm, "");

const faqSection = `<section id="pcm-step08-route-faq" class="py-16 bg-gray-50 pcm-step08-faq"><div class="container max-w-3xl"><h2 class="font-heading text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2><div class="space-y-4" data-pcm-route-faq-list>${faqHtml}</div></div></section>`;
const faqHeading = html.search(/<h2[^>]*>Frequently Asked Questions<\/h2>/i);
const faqStart = html.lastIndexOf("<section", faqHeading);
const faqEnd = html.indexOf("</section>", faqHeading);
if (faqHeading < 0 || faqStart < 0 || faqEnd < 0) throw new Error("FAQ section not found");
html = html.slice(0, faqStart) + faqSection + html.slice(faqEnd + 10);

for (const value of [route.distance, route.transit, ...route.prices]) if (!html.includes(value)) throw new Error(`Missing Montreal–Victoria fact: ${value}`);
if (/index-CNBNs70h\.js|type=["']module|step23-|pcm-local-seo|undefined|Moving Cost Breakdown|step36-edmonton-montreal\.css/i.test(html)) throw new Error("Forbidden Step 8 token remains");
await writeFile(file, html, "utf8");
console.log(`Rebuilt static Montreal–Victoria route: ${route.path}`);