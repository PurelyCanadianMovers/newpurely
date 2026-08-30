import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] || "site-copy";
const routeFiles = [
  ["montreal-to-edmonton-movers", "Montreal", "Edmonton"],
  ["edmonton-to-montreal-movers", "Edmonton", "Montreal"],
];
const inclusion = "These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible. ";

for (const [slug, from, to] of routeFiles) {
  const file = join(outDir, slug, "index.html");
  let html = await readFile(file, "utf8");
  html = html
    .replaceAll("$2,800+", "$2,500+")
    .replaceAll("$5,000+", "$4,700+")
    .replaceAll("$6,800+", "$6,300+")
    .replaceAll("$2,800", "$2,500")
    .replaceAll("$5,000", "$4,700")
    .replaceAll("$6,800", "$6,300")
    .replace(/7[–-]18 days/g, "7–19 days")
    .replace(/8[–-]18 days/g, "7–19 days")
    .replace(/8[–-]20 days/g, "7–19 days")
    .replace(new RegExp(`A[n]? ${from} to ${to} move typically ranges from about <strong>\\$2,500<\\/strong> for a small shipment to <strong>\\$15,000\\+<\\/strong> for a larger home\\. Many 1-2 bedroom moves are estimated around <strong>\\$4,700-\\$6,300<\\/strong>,`),
      `${from === "Edmonton" ? "An" : "A"} ${from} to ${to} move typically ranges from about <strong>$2,500+</strong> for a studio to <strong>$15,000+</strong> for a 4+ bedroom home,`)
    .replace("Studio or small shipment", "Studio");
  html = html
    .replace(/(<input[^>]*name="from"[^>]*placeholder=")[^"]*("[^>]*>)/i, `$1${from}, ${from === "Montreal" ? "QC" : "AB"}$2`)
    .replace(/(<input[^>]*name="to"[^>]*placeholder=")[^"]*("[^>]*>)/i, `$1${to}, ${to === "Montreal" ? "QC" : "AB"}$2`);

  const note = `Prices are planning ranges in CAD, not guaranteed quotes. ${from} to ${to} pricing`;
  if (!html.includes(inclusion + note)) html = html.replace(note, inclusion + note);

  const oldHeading = `${from} to ${to} Moving Cost Breakdown`;
  const escapedHeading = oldHeading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  html = html.replace(new RegExp(`<section[^>]*>[^<]*(?:<[^>]+>)*<h2[^>]*>${escapedHeading}<\\/h2>[\\s\\S]*?<\\/section>`), "");
  await writeFile(file, html);
  console.log(`Finalized ${file}`);
}

const guideFile = join(outDir, "long-distance-moving-cost-canada", "index.html");
let guide = await readFile(guideFile, "utf8");
const headingIndex = guide.indexOf("Popular Moving Routes in Canada");
const tbodyStart = guide.indexOf("<tbody", headingIndex);
const tbodyOpenEnd = guide.indexOf(">", tbodyStart) + 1;
const tbodyEnd = guide.indexOf("</tbody>", tbodyOpenEnd);
if (headingIndex < 0 || tbodyStart < 0 || tbodyEnd < 0) throw new Error("Popular routes table not found");
let tableBody = guide.slice(tbodyOpenEnd, tbodyEnd);
const routes = [
  ["Montreal → Edmonton", "/montreal-to-edmonton-movers/"],
  ["Edmonton → Montreal", "/edmonton-to-montreal-movers/"],
];
for (const [label, href] of routes) {
  if (!tableBody.includes(`>${label}<`)) {
    tableBody += `<tr class="pcm-cost-guide-popular-route"><td>${label}</td><td>3,500 km</td><td>7–19 days</td><td><a href="${href}">View Route</a></td></tr>`;
  }
}
guide = guide.slice(0, tbodyOpenEnd) + tableBody + guide.slice(tbodyEnd);
await writeFile(guideFile, guide);
console.log(`Finalized ${guideFile}`);
