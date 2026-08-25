import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { injectOpenAiAdsPixel } from "./openai-ads-pixel.mjs";

const siteRoot = process.argv[2] ?? "site-copy";

async function walk(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "admin") continue;
      await walk(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = await walk(siteRoot);
let updated = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  const next = injectOpenAiAdsPixel(html);
  if (next === html) continue;
  await writeFile(file, next, "utf8");
  updated += 1;
  console.log(`Injected OpenAI Ads base pixel: ${relative(siteRoot, file)}`);
}

console.log(`OpenAI Ads pixel present on ${files.length} public HTML files; updated ${updated}.`);
