const fs = require("fs");

const files = [
  "site-copy/assets/index-CNBNs70h.js",
  "site-copy/assets/conversion-boost.js",
];

const patterns = [
  "Calgary's lower cost",
  "lower cost of living",
  "mountain proximity",
  "binding estimate",
  "binding estimates",
  "Binding estimate",
  "Binding estimates",
  "guaranteed pricing",
  "guaranteed final",
  "guaranteed price",
];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  console.log(`\nFILE: ${file}`);
  for (const pattern of patterns) {
    let index = -1;
    let count = 0;
    const snippets = [];
    while ((index = text.indexOf(pattern, index + 1)) !== -1) {
      count += 1;
      if (snippets.length < 5) {
        const start = Math.max(0, index - 180);
        const end = Math.min(text.length, index + pattern.length + 220);
        snippets.push(text.slice(start, end).replace(/\s+/g, " "));
      }
    }
    if (count) {
      console.log(`\n${pattern}: ${count}`);
      for (const snippet of snippets) {
        console.log(`- ${snippet}`);
      }
    }
  }
}
