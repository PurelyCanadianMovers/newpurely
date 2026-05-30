import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, posix } from "node:path";

const outDir = process.argv[2] ?? "site-copy";
const index = await readFile(join(outDir, "index.html"), "utf8");
const bundle = await readFile(join(outDir, "assets", "index-CNBNs70h.js"), "utf8");
const siteOrigin = "https://purelycanadianmovers.com";
const privateRoutePrefixes = ["/admin/", "/404/"];

const routes = new Set(["/"]);
const routePatterns = [
  /\bhref:"(\/[a-z0-9][a-z0-9/-]*\/)"/gi,
  /\bcanonical:"(\/[a-z0-9][a-z0-9/-]*\/)"/gi,
  /\bpath:"(\/[a-z0-9][a-z0-9/-]*\/?)"/gi,
];

for (const pattern of routePatterns) {
  for (const match of bundle.matchAll(pattern)) {
    if (!match[1].startsWith("/assets/")) routes.add(match[1].endsWith("/") ? match[1] : `${match[1]}/`);
  }
}

function isPrivateRoute(route) {
  return privateRoutePrefixes.some((prefix) => route.startsWith(prefix));
}

function routeFile(route) {
  if (route === "/") return "index.html";
  return posix.join(route.replace(/^\/|\/$/g, ""), "index.html");
}

function depth(route) {
  return route.replace(/^\/|\/$/g, "").split("/").filter(Boolean).length;
}

for (const route of routes) {
  const file = routeFile(route);
  const prefix = depth(route) === 0 ? "." : Array(depth(route)).fill("..").join("/");
  let html = index
    .replaceAll("./assets/", `${prefix}/assets/`)
    .replaceAll("./external/", `${prefix}/external/`)
    .replaceAll('href="./index.html"', `href="${prefix}/index.html"`);

  if (isPrivateRoute(route)) {
    html = html.replace(
      /<meta name="robots" content="[^"]*" \/>/,
      '<meta name="robots" content="noindex, nofollow, noarchive" />',
    );
  }

  const target = join(outDir, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

const publicRoutes = [...routes].filter((route) => !isPrivateRoute(route)).sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes
  .map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`)
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Disallow: /admin/
Disallow: /404/

Sitemap: ${siteOrigin}/sitemap.xml
`;

await writeFile(join(outDir, "sitemap.xml"), sitemap);
await writeFile(join(outDir, "robots.txt"), robots);

console.log(`generated ${routes.size} route entry files`);
