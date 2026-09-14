import fs from 'node:fs';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const routes = ['edmonton-to-ottawa-movers','ottawa-to-edmonton-movers'];
assertAllowedPostProcessor('fix-route-cost-width.mjs', routes);
for (const slug of routes) {
  const f=`site-copy/${slug}/index.html`; let s=fs.readFileSync(f,'utf8');
  const old='class="pcm-lead-boost pcm-route-cost" aria-label="';
  const next='class="pcm-lead-boost pcm-route-cost" style="width:100%;max-width:none;margin-inline:0" aria-label="';
  if(!s.includes(old)) throw new Error(`wrapper not found: ${f}`);
  fs.writeFileSync(f,s.replace(old,next));
}
