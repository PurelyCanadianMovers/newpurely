import fs from "node:fs";
import path from "node:path";

const routes = process.argv.slice(2);
for (const route of routes) {
  const file = path.join("site-copy", route.replace(/^\/|\/$/g, ""), "index.html");
  if (!fs.existsSync(file)) {
    console.log(`${route}\tMISSING`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const pick = (re) => html.match(re)?.[1]?.replace(/\s+/g, " ").trim() || "";
  const title = pick(/<title>([\s\S]*?)<\/title>/i);
  const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const ogUrl = pick(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i);
  const h1 = pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "");
  const notFound = /Page Not Found|canonical["'][^>]+\/404|content=["']https:\/\/purelycanadianmovers\.com\/404/i.test(html);
  console.log(`${route}\n  title: ${title}\n  canonical: ${canonical}\n  og:url: ${ogUrl}\n  h1: ${h1}\n  soft404: ${notFound}\n`);
}
