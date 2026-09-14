import fs from 'node:fs';
import { assertAllowedPostProcessor } from './route-ownership-guard.mjs';
const routes=[['edmonton-to-ottawa-movers','Edmonton, AB','Ottawa, ON'],['ottawa-to-edmonton-movers','Ottawa, ON','Edmonton, AB']];
assertAllowedPostProcessor('add-route-defaults.mjs', routes.map(([slug]) => slug));
for(const [slug,from,to] of routes){const f=`site-copy/${slug}/index.html`;let s=fs.readFileSync(f,'utf8');const js=`<script>(function(){function set(){['from','to'].forEach(function(n,i){document.querySelectorAll('input[name="'+n+'"]').forEach(function(e){if(!e.value){var p=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;p.call(e,i?'${to}':'${from}');e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))}})})}window.addEventListener('load',function(){setTimeout(set,100);setTimeout(set,700)})})();</script>`;s=s.replace('</body></html>',js+'</body></html>');fs.writeFileSync(f,s)}
