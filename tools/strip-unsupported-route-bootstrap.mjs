import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assertAllowedPostProcessor } from "./route-ownership-guard.mjs";

const outDir = process.argv[2] ?? "site-copy";
const routes = [
  "halifax-to-calgary-movers",
  "calgary-to-halifax-movers",
  "calgary-to-montreal-movers",
  "edmonton-to-montreal-movers",
];
assertAllowedPostProcessor("strip-unsupported-route-bootstrap.mjs", routes);

const formDefaults = {
  "halifax-to-calgary-movers": ["Halifax, NS", "Calgary, AB"],
  "calgary-to-halifax-movers": ["Calgary, AB", "Halifax, NS"],
  "calgary-to-montreal-movers": ["Calgary, AB", "Montreal, QC"],
  "edmonton-to-montreal-movers": ["Edmonton, AB", "Montreal, QC"],
};

for (const route of routes) {
  const file = join(outDir, route, "index.html");
  const html = await readFile(file, "utf8");
  const defaults = formDefaults[route];
  const next = html.replace(
    /\s*<script type="module"[^>]*src="\.\.\/assets\/index-[^"]+\.js"><\/script>/,
    "",
  ).replace(/(<input[^>]*name="from"[^>]*placeholder=")[^"]*("[^>]*>)/i, `$1${defaults[0]}$2`)
    .replace(/(<input[^>]*name="to"[^>]*placeholder=")[^"]*("[^>]*>)/i, `$1${defaults[1]}$2`);
  await writeFile(file, next);
  console.log(next === html
    ? `Route snapshot already static; refreshed form defaults: ${file}`
    : `Removed unsupported React bootstrap and refreshed form defaults: ${file}`);
}
