import fs from 'node:fs';
import path from 'node:path';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const root = path.resolve(process.argv[2] ?? 'site-copy');
const routes = [
  ['halifax-to-toronto-movers', 'Halifax to Toronto'],
  ['toronto-to-halifax-movers', 'Toronto to Halifax'],
];
assertAllowedPostProcessor('update-route-quote-wording.mjs', routes.map(([slug]) => slug));
for (const [slug, route] of routes) {
  const file = path.join(root, slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace('>Free moving estimate</div><h2>Get a quote for this moving route.</h2>', `>FREE MOVING ESTIMATE</div><h2>Get a ${route} quote.</h2>`);
  fs.writeFileSync(file, html);
}
