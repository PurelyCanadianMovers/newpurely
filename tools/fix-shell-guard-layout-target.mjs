import fs from 'node:fs';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const routes = ['edmonton-to-ottawa-movers','ottawa-to-edmonton-movers'];
assertAllowedPostProcessor('fix-shell-guard-layout-target.mjs', routes);
for (const slug of routes) {
  const f=`site-copy/${slug}/index.html`; let s=fs.readFileSync(f,'utf8');
  const old="var q=document.querySelector('.pcm-lead-panel'),l=q&&q.nextElementSibling,m=l&&l.querySelector('main'),p=document.querySelector('.pcm-route-cost');if(q&&m&&!l.contains(q))l.insertBefore(q,m);if(q&&p&&q.nextElementSibling!==p)q.after(p)";
  const replacement="var q=document.querySelector('.pcm-lead-panel'),l=document.querySelector('.min-h-screen.flex.flex-col'),m=l&&l.querySelector('main'),p=document.querySelector('.pcm-route-cost');if(q&&m&&!l.contains(q))l.insertBefore(q,m);if(p&&m&&!l.contains(p))l.insertBefore(p,m);if(q&&p&&q.nextElementSibling!==p)q.after(p)";
  if(!s.includes(old)) throw new Error(`guard not found: ${f}`);
  fs.writeFileSync(f,s.replace(old,replacement));
}
