import fs from 'node:fs';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const routes = ['edmonton-to-ottawa-movers','ottawa-to-edmonton-movers'];
assertAllowedPostProcessor('extend-route-normalizer-retry.mjs', routes);
for (const slug of routes) {
  const f = `site-copy/${slug}/index.html`;
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace('setTimeout(normalize,500)', 'setTimeout(normalize,2000);setTimeout(normalize,4000)');
  fs.writeFileSync(f, s);
}
