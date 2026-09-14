import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "site-copy");
const routes = {
  "/calgary-to-vancouver-movers/": {
    description: "Plan a Calgary to Vancouver move with a family-owned Canadian mover. Review typical 4–13 day transit, route pricing, packing, and delivery considerations.",
  },
  "/vancouver-to-calgary-movers/": {
    description: "Plan a Vancouver to Calgary move with a family-owned Canadian mover. Review typical 4–13 day transit, route pricing, packing, and delivery considerations.",
  },
};

const styleTag = '    <link rel="stylesheet" href="/assets/step33-calgary-vancouver.css" data-pcm-step33="calgary-vancouver">';
const scriptTag = '    <script defer src="/assets/step33-calgary-vancouver.js" data-pcm-step33="calgary-vancouver"></script>';

function escapeAttribute(value) {
  return value.replace(/[&"]/g, (character) => ({ "&": "&amp;", '"': "&quot;" })[character]);
}

for (const [route, config] of Object.entries(routes)) {
  const file = join(root, route.slice(1), "index.html");
  const canonical = `https://purelycanadianmovers.com${route}`;
  let html = await readFile(file, "utf8");

  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttribute(config.description)}">`,
  );
  html = html
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeAttribute(config.description)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeAttribute(config.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}">`)
    .replace(/<link rel="canonical" id="canonical-tag" href="[^"]*"\s*\/?>/i, `<link rel="canonical" id="canonical-tag" href="${canonical}">`);

  if (!html.includes('data-pcm-step33="calgary-vancouver"')) {
    html = html.replace("</head>", `${styleTag}\n${scriptTag}\n</head>`);
  } else {
    const styleCount = html.split(styleTag).length - 1;
    const scriptCount = html.split(scriptTag).length - 1;
    if (styleCount !== 1 || scriptCount !== 1) throw new Error(`${route} has an invalid Step 33 asset state.`);
  }

  await writeFile(file, html, "utf8");
  console.log(`Standardized Step 33 route shell: ${route}`);
}
