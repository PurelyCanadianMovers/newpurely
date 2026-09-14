import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const bundleFile = join(root, "assets", "index-CNBNs70h.js");
const conversionFile = join(root, "assets", "conversion-boost.js");

async function replaceOnce(file, current, repaired, label) {
  const before = await readFile(file, "utf8");
  const currentCount = before.split(current).length - 1;
  const repairedCount = before.split(repaired).length - 1;
  if (repairedCount === 1) {
    console.log(`Step 32 runtime already repaired: ${label}`);
    return;
  }
  if (currentCount === 1 && repairedCount === 0) {
    await writeFile(file, before.replace(current, repaired), "utf8");
    console.log(`Step 32 runtime repair: ${label}`);
    return;
  }
  throw new Error(`${label}: expected one unrepaired or one repaired source fragment; found ${currentCount}/${repairedCount}`);
}

await replaceOnce(
  bundleFile,
  'PB.createRoot(["/vancouver-to-calgary-movers/","/calgary-to-vancouver-movers/"].includes(window.location.pathname)?document.createElement("div"):document.getElementById("root"))',
  'PB.createRoot(document.getElementById("root"))',
  "mount the exact Calgary/Vancouver React routes into #root",
);

await replaceOnce(
  conversionFile,
  '    "/calgary-to-toronto-movers/": ["Calgary, AB", "Toronto, ON"],',
  '    "/bc-to-washington-movers/": ["British Columbia", "Washington State"],\n' +
    '    "/calgary-to-toronto-movers/": ["Calgary, AB", "Toronto, ON"],\n' +
    '    "/calgary-to-vancouver-movers/": ["Calgary, AB", "Vancouver, BC"],\n' +
    '    "/montreal-to-calgary-movers/": ["Montreal, QC", "Calgary, AB"],\n' +
    '    "/ottawa-to-edmonton-movers/": ["Ottawa, ON", "Edmonton, AB"],\n' +
    '    "/toronto-to-vancouver-movers/": ["Toronto, ON", "Vancouver, BC"],\n' +
    '    "/toronto-to-victoria-movers/": ["Toronto, ON", "Victoria, BC"],\n' +
    '    "/vancouver-to-calgary-movers/": ["Vancouver, BC", "Calgary, AB"],\n' +
    '    "/vancouver-to-halifax-movers/": ["Vancouver, BC", "Halifax, NS"],\n' +
    '    "/vancouver-to-toronto-movers/": ["Vancouver, BC", "Toronto, ON"],',
  "register directional defaults for the nine audited routes",
);

await replaceOnce(
  conversionFile,
  '    if (path === "/vancouver-to-toronto-movers/" || path === "/toronto-to-vancouver-movers/" || path === "/vancouver-to-winnipeg-movers/" || path === "/winnipeg-to-vancouver-movers/" || path === "/toronto-to-winnipeg-movers/" || path === "/winnipeg-to-toronto-movers/") {',
  '    if (path === "/vancouver-to-winnipeg-movers/" || path === "/winnipeg-to-vancouver-movers/" || path === "/toronto-to-winnipeg-movers/" || path === "/winnipeg-to-toronto-movers/") {',
  "restore the existing Toronto/Vancouver route quote panels after React render",
);

await replaceOnce(
  conversionFile,
  '    if (path === "/montreal-to-calgary-movers/") {\n      return; // Preserve the static Montreal-to-Calgary route structure.\n    }',
  '    // Montreal-to-Calgary proceeds through the bounded route retries after hydration.',
  "keep the Montreal/Calgary quote panel present after React hydration",
);

await replaceOnce(
  bundleFile,
  'a.jsxs(cU,{"data-loc":"client/src/components/Header.tsx:221",side:"right",className:"w-80 p-0",children:',
  'a.jsxs(cU,{"data-loc":"client/src/components/Header.tsx:221",side:"right",className:"w-80 p-0","aria-describedby":void 0,children:',
  "declare the shared mobile navigation sheet description state",
);
