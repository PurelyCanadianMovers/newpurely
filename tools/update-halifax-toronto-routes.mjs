import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('site-copy');
const sourcePath = path.join(root, 'halifax-to-toronto-movers', 'index.html');
let source = fs.readFileSync(sourcePath, 'utf8');

const pricing = (from, to, slug) => `<section class="pcm-lead-boost pcm-route-cost" aria-label="${from} to ${to} moving cost estimates"><div class="pcm-route-cost__inner"><div class="pcm-route-cost__eyebrow">${from} to ${to} moving cost</div><h2>How much does it cost to move from ${from} to ${to}?</h2><p>A ${from} to ${to} move typically ranges from about <strong>$2,200+</strong> for a studio to <strong>$7,000+</strong> for a 4+ bedroom home, depending on inventory, access, packing, storage, season, and valuation coverage.</p><div class="pcm-route-cost__table-wrap"><table><thead><tr><th>Home size</th><th>Estimated cost</th><th>Typical transit</th></tr></thead><tbody><tr><td>Studio</td><td>$2,200+</td><td>5–12 days</td></tr><tr><td>1-bedroom</td><td>$2,900+</td><td>5–12 days</td></tr><tr><td>2-bedroom</td><td>$3,900+</td><td>5–12 days</td></tr><tr><td>3-bedroom</td><td>$5,300+</td><td>5–12 days</td></tr><tr><td>4+ bedroom</td><td>$7,000+</td><td>5–12 days</td></tr></tbody></table></div><p class="pcm-route-cost__inclusion">These estimated moving costs include in-home pickup and delivery, fuel surcharge, Declared Value Protection, and zero deductible.</p><p class="pcm-route-cost__note">Prices are planning ranges in CAD, not guaranteed quotes. A written estimate requires inventory details, pickup and delivery addresses, access conditions, packing needs, storage timing, and service dates.</p><div class="pcm-route-cost__links"><a href="/long-distance-moving-cost-canada/">Full cost guide</a><a href="/${slug}/">${from} movers</a><a href="/contact/">Get a written estimate</a></div></div></section>`;

function replaceLegacy(html, component, from, to, slug) {
  const start = html.indexOf(`<section data-loc="client/src/pages/services/${component}Movers.tsx:199"`);
  if (start < 0) return html;
  const end = html.indexOf('</section>', start) + '</section>'.length;
  return html.slice(0, start) + pricing(from, to, slug) + html.slice(end);
}

function routeDefaults(html, from, to) {
  html = html.replaceAll('placeholder="Toronto, ON"', `value="${from}, ${from === 'Halifax' ? 'NS' : 'ON'}" placeholder="${from}, ${from === 'Halifax' ? 'NS' : 'ON'}"`)
    .replaceAll('placeholder="Calgary, AB"', `value="${to}, ${to === 'Toronto' ? 'ON' : 'NS'}" placeholder="${to}, ${to === 'Toronto' ? 'ON' : 'NS'}"`);
  return html;
}

source = replaceLegacy(source, 'HalifaxToToronto', 'Halifax', 'Toronto', 'halifax-to-toronto-movers');
source = routeDefaults(source, 'Halifax', 'Toronto');
source = source.replace(/(name="from"[^>]*value="[^"]*")\s+value="[^"]*"/g, '$1')
  .replace(/(name="to"[^>]*value="[^"]*")\s+value="[^"]*"/g, '$1')
  .replace(/(name="from"[^>]*placeholder=")[^"]*(")/g, '$1Halifax, NS$2')
  .replace(/(name="to"[^>]*placeholder=")[^"]*(")/g, '$1Toronto, ON$2')
  .replaceAll('~2000 km', '~1,800 km')
  .replace('$2000-$3800–$6000-$12000', '$2,200+ – $7,000+')
  .replace('>6-14</div>', '>5–12 days</div>')
  .replace('>1,800 km</div>', '>1,800 km</div>');
source = source.replaceAll('fully insured', 'protected through available Declared Value Protection options');
source = source.replaceAll('$2,200+–$7,000+', '$2,200+ – $7,000+').replaceAll('$2,200+-$7,000+', '$2,200+ – $7,000+');
source = source.replace(/\s*<script[^>]+src="(?:\.\.\/|\/)assets\/index-[^"]+\.js"[^>]*><\/script>/g, '');
fs.writeFileSync(sourcePath, source);

let reverse = source.replaceAll('halifax-to-toronto-movers', 'toronto-to-halifax-movers')
  .replaceAll('Halifax, NS', '__FROM__').replaceAll('Toronto, ON', '__TO__')
  .replaceAll('Halifax', '__HALIFAX__').replaceAll('Toronto', '__TORONTO__')
  .replaceAll('__FROM__', 'Toronto, ON').replaceAll('__TO__', 'Halifax, NS')
  .replaceAll('__HALIFAX__', 'Toronto').replaceAll('__TORONTO__', 'Halifax');
reverse = reverse.replaceAll('href="/toronto-to-halifax-movers/"', 'href="/toronto-to-halifax-movers/"');
const reverseDir = path.join(root, 'toronto-to-halifax-movers');
fs.mkdirSync(reverseDir, { recursive: true });
fs.writeFileSync(path.join(reverseDir, 'index.html'), reverse);

const guidePath = path.join(root, 'long-distance-moving-cost-canada', 'index.html');
let guide = fs.readFileSync(guidePath, 'utf8');
const row = '<tr data-route="toronto-to-halifax"><td>Toronto → Halifax</td><td>$2,200+</td><td>$2,900+</td><td>$3,900+</td><td>$5,300+</td><td>$7,000+</td></tr>';
if (guide.includes('data-route="toronto-to-halifax"')) {
  guide = guide.replace(/<tr data-route="toronto-to-halifax">[\s\S]*?<\/tr>/, row);
  fs.writeFileSync(guidePath, guide);
} else {
  const i = guide.indexOf('Halifax → Toronto');
  const rowStart = guide.lastIndexOf('<tr', i);
  const end = guide.indexOf('</tr>', i) + 5;
  if (i < 0) throw new Error('Halifax → Toronto guide row not found');
  guide = guide.slice(0, end).replace('<tr', '<tr data-route="halifax-to-toronto"', 1) + row + guide.slice(end);
  fs.writeFileSync(guidePath, guide);
}
