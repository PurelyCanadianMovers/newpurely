import fs from 'node:fs';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const routes = ['edmonton-to-ottawa-movers','ottawa-to-edmonton-movers'];
assertAllowedPostProcessor('add-route-cost-outer-class.mjs', routes);
for (const slug of routes) {
  const f=`site-copy/${slug}/index.html`; let s=fs.readFileSync(f,'utf8');
  const old=`<div class="pcm-route-cost" aria-label="`;
  const next=`<div class="pcm-lead-boost pcm-route-cost" aria-label="`;
  if(!s.includes(old)) throw new Error(`pricing wrapper not found: ${f}`);
  fs.writeFileSync(f,s.replace(old,next));
}
