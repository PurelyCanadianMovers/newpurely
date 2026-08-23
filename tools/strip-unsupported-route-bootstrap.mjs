import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] ?? "site-copy";
const routes = [
  "halifax-to-calgary-movers",
  "calgary-to-halifax-movers",
  "halifax-to-vancouver-movers",
  "calgary-to-montreal-movers",
  "edmonton-to-montreal-movers",
  "edmonton-to-ottawa-movers",
];

const formDefaults = {
  "halifax-to-calgary-movers": ["Halifax, NS", "Calgary, AB"],
  "calgary-to-halifax-movers": ["Calgary, AB", "Halifax, NS"],
  "halifax-to-vancouver-movers": ["Halifax, NS", "Vancouver, BC"],
  "calgary-to-montreal-movers": ["Calgary, AB", "Montreal, QC"],
  "edmonton-to-montreal-movers": ["Edmonton, AB", "Montreal, QC"],
  "edmonton-to-ottawa-movers": ["Edmonton, AB", "Ottawa, ON"],
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
