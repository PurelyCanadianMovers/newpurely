import fs from 'node:fs';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const routes = ['edmonton-to-ottawa-movers','ottawa-to-edmonton-movers'];
assertAllowedPostProcessor('move-route-pricing-after-quote.mjs', routes);
for (const slug of routes) {
  const f = `site-copy/${slug}/index.html`;
  let s = fs.readFileSync(f, 'utf8');
  const old = 'h.replaceWith(d);p.remove();t.remove()';
  const replacement = "document.querySelector('.pcm-lead-panel')?.after(d);h.remove();p.remove();t.remove()";
  if (!s.includes(old)) throw new Error(`normalizer not found: ${f}`);
  fs.writeFileSync(f, s.replace(old, replacement));
}
