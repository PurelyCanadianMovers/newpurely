import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const bundlePath = join("site-copy", "assets", "index-CNBNs70h.js");
let bundle = await readFile(bundlePath, "utf8");

const brokenServiceLabel = 'pge[r.id]??""';
const inlineServiceLabel =
  '({local:"Local","long-distance":"Cross-Province","cross-country":"Cross-Country","canada-usa":"Canada-USA",overseas:"Overseas",office:"Office / Commercial",packing:"Packing",storage:"Storage"}[r.id]??"")';
const shortLocationDescription =
  '`${r?.name} in ${s?.name}, ${s?.province}. Family-owned since 1991, BBB Accredited, no subcontractors.`';
const richerLocationDescription =
  '`${r?.name} in ${s?.name}, ${s?.province} for homes, condos, apartments, and offices. Family-owned since 1991, BBB Accredited, no subcontractors. Free estimates.`';

if (!bundle.includes(brokenServiceLabel)) {
  console.log("Burnaby dynamic route service label already patched.");
} else {
  bundle = bundle.replace(brokenServiceLabel, inlineServiceLabel);
  console.log("Patched dynamic service label lookup for location-service pages.");
}

if (!bundle.includes(shortLocationDescription)) {
  console.log("Dynamic location-service meta description already patched.");
} else {
  bundle = bundle.replace(shortLocationDescription, richerLocationDescription);
  console.log("Patched dynamic location-service meta description.");
}

await writeFile(bundlePath, bundle);
