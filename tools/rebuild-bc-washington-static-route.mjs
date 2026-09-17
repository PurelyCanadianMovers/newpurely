import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { bcWashingtonRoute as route } from "./bc-washington-static-route-data.mjs";

const root = resolve(process.argv[2] ?? "site-copy");
const file = join(root, route.slug, "index.html");
const template = resolve("tools/templates/bc-washington-static-route.html");
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const faqItems = route.faqs.map(([question, answer]) => '<details class="border border-gray-200 rounded-lg bg-white"><summary class="font-semibold cursor-pointer p-5">' + esc(question) + '</summary><p class="px-5 pb-5 text-gray-700">' + esc(answer) + "</p></details>").join("");
const faqSection = '<section id="pcm-step12-route-faq" data-pcm-route-faq-static="1" class="pcm-route-faq-static pcm-step12-faq py-16 px-4 bg-gray-50"><div class="max-w-3xl mx-auto"><h2 class="text-4xl font-serif font-bold mb-8 text-slate-900">Frequently Asked Questions</h2><div class="space-y-4">' + faqItems + "</div></div></section>";
const faqSchema = '<script type="application/ld+json" id="pcm-step12-faq-schema">' + JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: route.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }) + "</script>";

const relatedLinks = '<section class="pcm-step12-related"><div class="container"><h2>Cross-Border Routes and Resources</h2><div class="pcm-step12-related-links"><a href="/vancouver-to-seattle-movers/">Vancouver to Seattle Movers</a><a href="/seattle-to-vancouver-movers/">Seattle to Vancouver Movers</a><a href="/canada-usa/">Canada–USA Moving Services</a><a href="/packing/">Packing Services</a><a href="/storage/">Storage Options</a></div></div></section>';
let html = await readFile(template, "utf8");
html = html
  .replace(/<script\b[^>]*type=["']module["'][\s\S]*?<\/script>\s*/gi, "")
  .replace(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?FAQPage[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<link\b[^>]*href=["'][^"']*\/assets\/(?:conversion-boost|static-nav|static-chat)\.css[^"']*["'][^>]*>\s*/gi, "")
  .replace(/<script\b[^>]*src=["'][^"']*\/assets\/(?:conversion-boost|static-nav|static-chat)\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, "")
  .replace(/<section[^>]*data-pcm-route-faq-static=["']1["'][\s\S]*?<\/section>\s*/i, "")
  .replace(/<html\b[^>]*>/i, '<html lang="en" class="pcm-step12-bc-washington">')
  .replace(/<body\b[^>]*>/i, '<body class="pcm-step12-bc-washington">')
  .replace(/<title[^>]*>[\s\S]*?<\/title>/i, "<title>" + esc(route.title) + "</title>")
  .replace(/<meta name="description"[^>]*>/i, '<meta name="description" content="' + esc(route.description) + '">')
  .replace(/<meta property="og:title"[^>]*>/i, '<meta property="og:title" content="' + esc(route.title) + '">')
  .replace(/<meta property="og:description"[^>]*>/i, '<meta property="og:description" content="' + esc(route.description) + '">')
  .replace(/<meta name="twitter:title"[^>]*>/i, '<meta name="twitter:title" content="' + esc(route.title) + '">')
  .replace(/<meta name="twitter:description"[^>]*>/i, '<meta name="twitter:description" content="' + esc(route.description) + '">')
  .replace(/<meta property="og:url"[^>]*>/i, '<meta property="og:url" content="https://purelycanadianmovers.com' + route.path + '">')
  .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/i, '<link rel="canonical" id="canonical-tag" href="https://purelycanadianmovers.com' + route.path + '">')
  .replace(/<link rel="stylesheet" crossorigin="" href="\.\.\/assets\/index-[^"]+\.css">/i, '$&\n<link rel="stylesheet" href="/assets/conversion-boost.css">\n<link rel="stylesheet" href="/assets/static-nav.css">\n<link rel="stylesheet" href="/assets/static-chat.css">')
  .replace(/<input name="from"[^>]*>/i, '<input name="from" value="British Columbia" placeholder="British Columbia" type="text">')
  .replace(/<input name="to"[^>]*>/i, '<input name="to" value="Washington State" placeholder="Washington State" type="text">')
  .replace(/Seattle, Bellevue, and surrounding areas/g, "Seattle, Bellevue, Redmond, Kirkland, Everett, Tacoma, and surrounding areas")
  .replace(/Seattle\/Bellevue/g, "Seattle/Bellevue/Redmond")
  .replace(/Seattle, Bellevue, and surrounding areas/g, "Seattle, Bellevue, Redmond, Kirkland, Everett, Tacoma, and surrounding areas")
  .replace(/Seattle\/Bellevue/g, "Seattle/Bellevue/Redmond")
  .replace(/<\/head>/i, '<style data-step12-typography>html.pcm-step12-bc-washington h1{font-family:"Playfair Display",serif;font-size:48px;line-height:60px}@media(max-width:767px){html.pcm-step12-bc-washington h1{font-size:36px;line-height:45px}}</style>\n' + faqSchema + '\n</head>')
  .replace(/<\/body>/i, '<script defer src="/assets/conversion-boost.js"></script><script defer src="/assets/static-nav.js"></script><script defer src="/assets/static-chat.js"></script>\n</body>')
  .replace(/^[ \t]+$/gm, "");

html = html.replace(/<main[^>]*>[\s\S]*?<\/main>/i, (main) => main.replace(/<section[^>]*data-pcm-route-faq-static=["']1["'][\s\S]*?<\/section>\s*/i, "") + "\n" + faqSection);
html = html.replace(/<section id="pcm-step12-route-faq"[\s\S]*?<\/section>/i, relatedLinks + "\n$&");
if (!html.includes('id="pcm-step12-route-faq"')) html = html.replace(/<\/body>/i, faqSection + "\n</body>");
for (const value of [route.title, route.description, route.origin, route.destination, route.transit, route.overnight, route.range, ...route.prices, ...route.cities, ...route.links]) if (!html.includes(esc(value))) throw new Error("Missing BC–Washington fact or link: " + value);
if (!/value="British Columbia"/.test(html) || !/value="Washington State"/.test(html)) throw new Error("BC–Washington form defaults missing");
if (/index-CNBNs70h\.js|type=["']module|step68|step79|pcm-local-seo|undefined|Moving Cost Breakdown|washington-to-bc-movers/i.test(html)) throw new Error("Forbidden React or stale cross-border token remains");
if ((html.match(/<h1\b/gi) ?? []).length !== 1) throw new Error("BC–Washington output must have exactly one H1");
if ((html.match(/id="pcm-step12-route-faq"/g) ?? []).length !== 1 || (html.match(/id="pcm-step12-faq-schema"/g) ?? []).length !== 1) throw new Error("Step 12 FAQ output is not singular");
await writeFile(file, html, "utf8");
console.log("Rebuilt static BC–Washington hub: " + route.path);