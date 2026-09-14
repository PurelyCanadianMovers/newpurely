import fs from 'node:fs';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const routes = ['edmonton-to-ottawa-movers','ottawa-to-edmonton-movers'];
assertAllowedPostProcessor('fix-route-normalizer-existing-block.mjs', routes);
for (const slug of routes) {
  const f = `site-copy/${slug}/index.html`;
  let s = fs.readFileSync(f, 'utf8');
  const old = "if(!h||document.querySelector('.pcm-route-cost'))return;var p=";
  const replacement = "if(!h)return;var existing=document.querySelector('.pcm-route-cost');if(existing){var q=document.querySelector('.pcm-lead-panel');if(q&&q.nextElementSibling!==existing)q.after(existing);return}var p=";
  if (!s.includes(old)) throw new Error(`normalizer guard not found: ${f}`);
  fs.writeFileSync(f, s.replace(old, replacement));
}
