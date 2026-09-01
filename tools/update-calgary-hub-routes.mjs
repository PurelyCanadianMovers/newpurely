import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2] ?? "site-copy";
const path = join(root, "calgary-long-distance-movers", "index.html");
const marker = "<!-- pcm-calgary-route-list -->";
const block = `${marker}<section class="pcm-section" aria-labelledby="calgary-route-list-heading"><h2 id="calgary-route-list-heading">Popular Calgary Moving Routes</h2><div class="pcm-links"><a href="/calgary-to-edmonton-movers/">Calgary to Edmonton Movers</a><a href="/calgary-to-vancouver-movers/">Calgary to Vancouver Movers</a><a href="/calgary-to-toronto-movers/">Calgary to Toronto Movers</a><a href="/calgary-to-montreal-movers/">Calgary to Montreal Movers</a><a href="/calgary-to-halifax-movers/">Calgary to Halifax Movers</a><a href="/calgary-to-winnipeg-movers/">Calgary to Winnipeg Movers</a></div></section>`;
let html = await readFile(path, "utf8");
html = html.replace(new RegExp(`${marker}[\\s\\S]*?<\\/section>`, "i"), block);
if (!html.includes(marker)) html = html.replace("</main>", `${block}</main>`);
await writeFile(path, html, "utf8");
console.log(`Updated ${path}`);
