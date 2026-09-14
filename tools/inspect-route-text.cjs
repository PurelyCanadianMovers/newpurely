const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const needles = process.argv.slice(3);

if (!file || needles.length === 0) {
  console.error('Usage: node tmp/inspect-route-text.cjs <html-file> <needle...>');
  process.exit(1);
}

const html = fs.readFileSync(path.resolve(file), 'utf8');
const text = html
  .replace(/<script[^]*?<\/script>/gi, ' ')
  .replace(/<style[^]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

for (const needle of needles) {
  const index = text.indexOf(needle);
  console.log(`${needle}: ${index}`);
  if (index >= 0) {
    console.log(text.slice(Math.max(0, index - 350), index + 500));
  }
}
