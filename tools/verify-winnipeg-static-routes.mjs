import { readFile } from "node:fs/promises";

const routes = [
  "calgary-to-winnipeg-movers",
  "edmonton-to-winnipeg-movers",
  "montreal-to-winnipeg-movers",
  "ottawa-to-winnipeg-movers",
  "toronto-to-winnipeg-movers",
  "vancouver-to-winnipeg-movers",
  "winnipeg-to-calgary-movers",
  "winnipeg-to-edmonton-movers",
  "winnipeg-to-montreal-movers",
  "winnipeg-to-ottawa-movers",
  "winnipeg-to-toronto-movers",
  "winnipeg-to-vancouver-movers",
];

let passed = true;

for (const route of routes) {
  const html = await readFile(`site-copy/${route}/index.html`, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || "(missing title)";
  const h1Count = [...html.matchAll(/<h1[\s\S]*?<\/h1>/gi)].length;
  const issues = [];

  if (html.includes("Page Not Found")) issues.push("Page Not Found content");
  if (html.includes("https://purelycanadianmovers.com/404")) issues.push("canonical /404");
  if (html.includes("index-CNBNs70h.js")) issues.push("React route bundle");
  if (html.includes('<div id="root"></div>')) issues.push("empty root");
  if (h1Count !== 1) issues.push(`H1 count ${h1Count}`);

  if (issues.length) {
    passed = false;
    console.log(`FAIL ${route}: ${issues.join(", ")} | ${title}`);
  } else {
    console.log(`OK ${route}: ${title}`);
  }
}

process.exit(passed ? 0 : 1);
