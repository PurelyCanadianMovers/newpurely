const fs = require("fs");

const file = "site-copy/assets/index-CNBNs70h.js";
const text = fs.readFileSync(file, "utf8");
const patterns = [
  "Calgary's lower cost",
  "lower cost of living",
  "mountain proximity",
  "binding estimate",
  "guaranteed pricing",
  "guaranteed final",
  "guaranteed price",
];

for (const pattern of patterns) {
  let index = -1;
  let count = 0;
  const samples = [];
  while ((index = text.indexOf(pattern, index + 1)) !== -1) {
    count += 1;
    if (samples.length < 4) {
      samples.push(
        text
          .slice(Math.max(0, index - 220), Math.min(text.length, index + 420))
          .replace(/\s+/g, " ")
      );
    }
  }
  console.log(`\nPATTERN: ${pattern}`);
  console.log(`COUNT: ${count}`);
  for (const sample of samples) console.log(`SAMPLE: ${sample}`);
}
