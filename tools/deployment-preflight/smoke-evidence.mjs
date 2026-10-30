import { createHash } from 'node:crypto';
import { readFile, writeFile, rename,lstat } from 'node:fs/promises';
import { isAbsolute, resolve, relative, sep, join } from 'node:path';
import {parse} from 'parse5';
import {routeOwnershipByUrl} from './route-ownership.mjs';

const hash = b => createHash('sha256').update(b).digest('hex');
const fail = s => { throw Error(s); };
export const APPROVED_HOMEPAGE_BROWSER_TITLE = 'Professional Movers Vancouver BC | Purely Canadian Movers';
export const APPROVED_COST_GUIDE_BROWSER_TITLE = 'Moving Cost Guide Canada';
const OUTDATED_HOMEPAGE_BROWSER_TITLE = 'Vancouver Movers | Local & Long-Distance Moving';
export function expectedPageTitle(route, candidateTitle, explicitHomepageTitle) {
  if (route === '/long-distance-moving-cost-canada/') return APPROVED_COST_GUIDE_BROWSER_TITLE;
  if (route !== '/') return candidateTitle;
  if (typeof explicitHomepageTitle === 'string' && explicitHomepageTitle.trim()) return explicitHomepageTitle.trim();
  return candidateTitle === OUTDATED_HOMEPAGE_BROWSER_TITLE ? APPROVED_HOMEPAGE_BROWSER_TITLE : candidateTitle;
}
export const CLOUDFLARE_INSIGHTS_BEACON = Buffer.from('<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092" integrity="sha512-UKNk8GbxkABxKcXYuLkO16EleLGUkcvJWtpSNmExE0Too3ZaFAxTscNWEc1OdAv5/BikHawapSCaiD2XCmp+Bw==" data-cf-beacon=\'{"version":"2024.11.0","token":"f97618e89b40439eb3ae1eead9a6e89d","r":1,"spa":2}\' crossorigin="anonymous"></script>\n');
const HTML_CLOSE_BODY = Buffer.from('</body>');
export function verifyProductionHtml(body, expectedSha256, isHtml = true) {
  if (!Buffer.isBuffer(body) || !body.length) fail('Production response body is missing');
  if (!/^[a-f0-9]{64}$/i.test(expectedSha256 ?? '')) fail('Approved production HTML hash is invalid');
  const rawResponseSha256 = hash(body);
  let normalized = body, cloudflareInsightsBeaconApplied = false;
  if (isHtml) {
    const first = body.indexOf(CLOUDFLARE_INSIGHTS_BEACON);
    if (first >= 0) {
      if (body.indexOf(CLOUDFLARE_INSIGHTS_BEACON, first + 1) >= 0) fail('Production HTML contains multiple Cloudflare Insights beacon insertions');
      const closingBody = body.indexOf(HTML_CLOSE_BODY);
      if (closingBody < 0 || closingBody !== body.lastIndexOf(HTML_CLOSE_BODY)
          || first + CLOUDFLARE_INSIGHTS_BEACON.length !== closingBody) fail('Cloudflare Insights beacon is not in the approved position immediately before </body>');
      normalized = Buffer.concat([body.subarray(0, first), body.subarray(first + CLOUDFLARE_INSIGHTS_BEACON.length)]);
      cloudflareInsightsBeaconApplied = true;
    }
  }
  const comparisonSha256 = hash(normalized);
  if (comparisonSha256 !== expectedSha256.toLowerCase()) fail('Production asset bytes differ from approved candidate: response bytes do not match the approved asset after Cloudflare Insights normalization');
  return { rawResponseSha256, comparisonSha256, cloudflareInsightsBeaconApplied, beaconInsertionCount: cloudflareInsightsBeaconApplied ? 1 : 0, normalizedBytes: normalized };
}
export const BROWSER_CHECKS=['page-title','page-h1','navigation','estimate-form','chatbot-input','desktop-layout','mobile-layout','console-errors'];
export const LOW_RISK_BROWSER_CHECKS=['page-title','page-h1','changed-content','navigation','estimate-form','desktop-layout','mobile-layout','console-errors'];
const OPTIONAL_ESTIMATE_VALIDATION_ROUTES=new Set(['/','/local/','/surrey/','/long-distance-moving-cost-canada/']);
const ROUTE_PREFILLED_GET_ESTIMATE_FORMS=new Map([
  ['/toronto-to-halifax-movers/',{from:'Toronto, ON',to:'Halifax, NS'}],
  ['/halifax-to-vancouver-movers/',{from:'Halifax, NS',to:'Vancouver, BC'}],
  ['/vancouver-to-halifax-movers/',{from:'Vancouver, BC',to:'Halifax, NS'}],
  ['/halifax-to-calgary-movers/',{from:'Halifax, NS',to:'Calgary, AB'}],
  ['/calgary-to-halifax-movers/',{from:'Calgary, AB',to:'Halifax, NS'}],
  ['/toronto-to-winnipeg-movers/',{from:'Toronto, ON',to:'Winnipeg, MB'}],
  ['/winnipeg-to-toronto-movers/',{from:'Winnipeg, MB',to:'Toronto, ON'}],
  ['/calgary-to-winnipeg-movers/',{from:'Calgary, AB',to:'Winnipeg, MB'}],
  ['/winnipeg-to-calgary-movers/',{from:'Winnipeg, MB',to:'Calgary, AB'}],
  ['/montreal-to-winnipeg-movers/',{from:'Montreal, QC',to:'Winnipeg, MB'}],
  ['/winnipeg-to-montreal-movers/',{from:'Winnipeg, MB',to:'Montreal, QC'}],
]);
function staticEstimateFormProfile(html) {
  const document=parse(html),nodes=[];
  const visit=node=>{if(node.tagName)nodes.push(node);for(const child of node.childNodes??[])visit(child);};visit(document);
  const forms=nodes.filter(node=>node.tagName==='form'&&(node.attrs??[]).some(attr=>attr.name==='class'
    &&attr.value.split(/\s+/).some(name=>['pcm-estimate','pcm-estimate-form'].includes(name))));
  if(forms.length!==1)return null;
  const form=forms[0],controls=[];
  const visitControls=node=>{
    if(['input','select','textarea'].includes(node.tagName)){
      const attrs=new Map((node.attrs??[]).map(attr=>[attr.name,attr.value]));
      const type=node.tagName==='select'?'select-one':(attrs.get('type')??(node.tagName==='input'?'text':node.tagName)).toLowerCase();
      if(!['hidden','submit','button'].includes(type)){
        let value=attrs.get('value')??'';
        if(node.tagName==='select'){
          const options=[];const collectOptions=child=>{if(child.tagName==='option')options.push(child);for(const nested of child.childNodes??[])collectOptions(nested);};collectOptions(node);
          const first=options[0];if(first)value=(first.attrs??[]).find(attr=>attr.name==='value')?.value??(first.childNodes??[]).map(part=>part.value??'').join('').trim();
        }
        controls.push({name:attrs.get('name')??'',type,required:attrs.has('required'),ariaRequired:attrs.get('aria-required')??null,value});
      }
    }
    for(const child of node.childNodes??[])visitControls(child);
  };
  visitControls(form);
  const attrs=new Map((form.attrs??[]).map(attr=>[attr.name,attr.value]));
  return {action:attrs.get('action')??'',method:(attrs.get('method')??'get').toUpperCase(),controls};
}
async function acceptedBaselineEstimateFormProfile(route, baseline) {
  if(!ROUTE_PREFILLED_GET_ESTIMATE_FORMS.has(route))return undefined;
  const assetPath=`site-copy${route}index.html`,record=baseline?.file_hashes?.find(file=>file.path===assetPath);
  if(!record||!baseline?.package?.root)fail('Accepted baseline estimate form record is missing');
  const bytes=await readFile(resolve(baseline.package.root,assetPath));
  if(bytes.length!==record.bytes||hash(bytes)!==record.sha256)fail('Accepted baseline estimate form bytes do not match the controlled inventory');
  const profile=staticEstimateFormProfile(bytes.toString('utf8'));
  if(!profile)fail('Accepted baseline route estimate form is missing or ambiguous');
  return profile;
}
export function validateEstimateValidationEvidence(route, evidence, { baselineFormProfile, origin } = {}) {
  const validity=evidence?.nativeValidityObserved;
  const controls=evidence?.validationControlEvidence;
  const failEvidence=()=>fail('Estimate native validation evidence is missing or inconsistent');
  if(evidence?.validationObserved!==true||evidence?.validationMethod!=='HTMLFormElement.checkValidity'
      ||typeof evidence.validationResult!=='boolean'||!Array.isArray(validity)||!validity.length
      ||!Array.isArray(controls)||JSON.stringify(validity)!==JSON.stringify(controls)
      ||validity.some(item=>typeof item.name!=='string'||typeof item.valid!=='boolean'||typeof item.required!=='boolean'||typeof item.valueMissing!=='boolean'||typeof item.willValidate!=='boolean')
      ||evidence.requiredControlCount!==validity.filter(item=>item.required).length
      ||evidence.validationResult!==validity.filter(item=>item.willValidate).every(item=>item.valid)) failEvidence();
  const routePrefilled=ROUTE_PREFILLED_GET_ESTIMATE_FORMS.get(route);
  if(routePrefilled){
    const expectedNames=['from','to','homeSize','moveDate'];
    const baselineControls=baselineFormProfile?.controls;
    const actualControls=evidence?.formControls;
    const actionUrl=origin?new URL(baselineFormProfile?.action??'',origin).href:'';
    if(!baselineFormProfile||baselineFormProfile.action!=='/contact/'||baselineFormProfile.method!=='GET'
        ||!Array.isArray(baselineControls)||baselineControls.length!==4
        ||JSON.stringify(baselineControls.map(control=>control.name))!==JSON.stringify(expectedNames)
        ||baselineControls[0].value!==routePrefilled.from||baselineControls[1].value!==routePrefilled.to
        ||!Array.isArray(actualControls)||actualControls.length!==baselineControls.length
        ||evidence.formActionUrl!==actionUrl||evidence.formMethod!=='GET'
        ||evidence.formActionUrl!==origin+'/contact/'
        ||actualControls.some((control,index)=>control.name!==baselineControls[index].name
          ||control.type!==baselineControls[index].type||control.value!==baselineControls[index].value
          ||control.required!==baselineControls[index].required||control.ariaRequired!==baselineControls[index].ariaRequired
          ||control.visible!==true||typeof control.accessibleName!=='string'||!control.accessibleName.trim())
        ||evidence.validationResult!==true||evidence.validationControlEvidence.some((control,index)=>
          control.name!==baselineControls[index].name||control.required!==baselineControls[index].required
          ||control.willValidate!==true||control.valid!==true||control.valueMissing!==false||control.customError!==false)
        ||evidence.valuesPreserved!==true||evidence.submitActivated!==false||evidence.submitAttempts!==0) failEvidence();
    return true;
  }
  const requiredCount=validity.filter(item=>item.required).length;
  if(OPTIONAL_ESTIMATE_VALIDATION_ROUTES.has(route)?requiredCount!==0:requiredCount===0) failEvidence();
  return true;
}
const NEW_STATIC_PAGE_CHECKS=['candidate-content','illustration-rendered','charity-link'];
const FEATURE_NAMES=['estimate','chatbot','callback','email','submission'];
const DELIVERY_SIGNAL=/(?:callback|call\s*back|resend|send(?:ing)?\s*(?:an?\s*)?email|email\s*(?:delivery|notification)|webhook|notify_to|notify_from|\/api\/estimate|\/api\/trpc\/chat\.message)/i;
export function inferChangeFeatures({path,beforeBytes,afterBytes}){
  const before=Buffer.isBuffer(beforeBytes)?beforeBytes.toString('utf8'):'';
  const after=Buffer.isBuffer(afterBytes)?afterBytes.toString('utf8'):'';
  const html=/\.html?$/i.test(path);
  const features=new Set();
  if(html){
    const forms=source=>[...source.matchAll(/<form\b[\s\S]*?<\/form\s*>/gi)].map(match=>match[0]);
    const beforeForms=forms(before),afterForms=forms(after);
    if(JSON.stringify(beforeForms)!==JSON.stringify(afterForms)){features.add('estimate');features.add('submission');}
    // A route page can initiate a user journey; only a changed delivery endpoint/contract
    // warrants real callback or email delivery evidence.
    const changedForms=[...beforeForms.filter(form=>!afterForms.includes(form)),...afterForms.filter(form=>!beforeForms.includes(form))].join('\n');
    if(/(?:action=["'][^"']*\/api\/(?:estimate|callback|lead)|data-(?:callback|email|delivery)-endpoint)/i.test(changedForms)){
      if(/callback/i.test(changedForms))features.add('callback');
      if(/email|delivery/i.test(changedForms))features.add('email');
    }
    return [...features];
  }
  let start=0;while(start<before.length&&start<after.length&&before[start]===after[start])start++;
  let end=0;while(end<before.length-start&&end<after.length-start&&before.at(-1-end)===after.at(-1-end))end++;
  const delta=before.slice(start,before.length-end)+'\n'+after.slice(start,after.length-end);
  const deliveryCode=/\.(?:m?js|cjs|ts|tsx)$/i.test(path)||/^(?:worker|src|functions|server|api)\//i.test(path);
  const deliveryConfig=/(?:wrangler\.(?:toml|jsonc?)|(?:^|\/)(?:.*bindings|.*secrets|.*environment|.*config)\.(?:json|toml|ya?ml))$/i.test(path);
  const deliverySurface=deliveryCode||deliveryConfig||/^(?:worker|src|functions|server|api)\//i.test(path);
  if(deliverySurface&&DELIVERY_SIGNAL.test(delta)){
    if(/callback|call\s*back/i.test(delta))features.add('callback');
    if(/resend|email|webhook|notify_to|notify_from/i.test(delta))features.add('email');
  }
  if(deliveryCode&&/(?:estimate|quote|\/api\/estimate)/i.test(delta)){features.add('estimate');features.add('submission');}
  if(deliveryCode&&/(?:chatbot|chat-assistant|chat\.message)/i.test(delta))features.add('chatbot');
  if(/^worker\//i.test(path)&&!features.size)for(const f of FEATURE_NAMES)features.add(f);
  return [...features];
}
export function pageIdentity(html){
  const document=parse(html),nodes=[];
  function visit(n){if(n.tagName)nodes.push(n);for(const c of n.childNodes??[])visit(c);}visit(document);
  const text=n=>n?.nodeName==='#text'?n.value:(n?.childNodes??[]).map(text).join('');
  const titles=nodes.filter(n=>n.tagName==='title'&&n.namespaceURI==='http://www.w3.org/1999/xhtml'&&n.parentNode?.tagName==='head'),h1=nodes.filter(n=>n.tagName==='h1');
  return {title:titles.length===1?text(titles[0]).trim():'',h1:h1.length===1?text(h1[0]).replace(/\s+/g,' ').trim():''};
}
const forbiddenRiskTags=new Set(['form','input','select','textarea','button','script','style','iframe','object','embed','nav']);
const trustedRiskAssessments=new WeakSet();
function htmlTree(source){
  const doc=parse(source);
  const make=(n,ancestors=[])=>{
    if(n.nodeName==='#comment')return null;
    if(n.nodeName==='#text')return n.value.trim()?{text:n.value,parent:ancestors.at(-1)??''}:null;
    const tag=n.tagName??n.nodeName;
    const attrs=(n.attrs??[]).map(a=>[a.name,a.value]).sort((a,b)=>a[0].localeCompare(b[0]));
    const next=[...ancestors,tag];
    return {tag,attrs,children:(n.childNodes??[]).map(c=>make(c,next)).filter(Boolean)};
  };
  return make(doc);
}
function shape(node, omitFooterHref=null, state={}){
  if(!node)return null;
  if(node.tag==='a'&&omitFooterHref&&node.attrs.some(([k,v])=>k==='href'&&v===omitFooterHref)&&state.inFooter)return null;
  const inFooter=state.inFooter||node.tag==='footer';
  const children=node.children.map(c=>c.text!==undefined?{text:'#text',parent:c.parent}:shape(c,omitFooterHref,{...state,inFooter})).filter(Boolean);
  return {tag:node.tag,attrs:node.attrs,children};
}
function textLeaves(node,path=[],out=[]){if(!node)return out;if(node.text!==undefined){out.push({path:path.join('/'),parent:node.parent,text:node.text});return out;}for(let i=0;i<node.children.length;i++)textLeaves(node.children[i],[...path,node.tag+':'+i],out);return out;}
function ownerIsRegistered(change,owner){
  if(!owner||owner.path!==change.path||!change.path.startsWith('site-copy/')||!change.path.endsWith('/index.html'))return false;
  const route='/'+change.path.slice(10,-10),registered=routeOwnershipByUrl.get(route);if(!registered||registered.owner==='generate-spa-routes.mjs')return false;
  const expectedSource=registered.owner==='checked-in-static-route-source'?change.path:'tools/'+registered.owner;
  return owner.route===route&&owner.owner===registered.owner&&owner.sourcePath===expectedSource&&owner.kind===registered.ownerType;
}
export function classifyChangeRisk({changes,owners,features=[]}){
  const full={classification:'HIGH-RISK FUNCTIONAL',basis:'The verified change is ambiguous, functional, structural, or lacks registered source ownership.'};
  if(!Array.isArray(changes)||changes.length!==1||features.length||!Array.isArray(owners)||owners.length!==1)return full;
  const c=changes[0],owner=owners[0];if(!ownerIsRegistered(c,owner)||!Buffer.isBuffer(c.beforeBytes)||!Buffer.isBuffer(c.afterBytes))return full;
  const before=htmlTree(c.beforeBytes.toString('utf8')),after=htmlTree(c.afterBytes.toString('utf8'));
  let content;
  const beforeLeaves=textLeaves(before),afterLeaves=textLeaves(after);
  const beforeShape=shape(before),afterShape=shape(after);
  // Compare link inventories and require exactly one new accessible, safe footer link.
  const links=root=>{const out=[];const walk=(n,footer=false)=>{if(!n)return;footer=footer||n.tag==='footer';if(n.tag==='a')out.push({footer,attrs:n.attrs,text:textLeaves(n).map(x=>x.text).join('').trim()});for(const x of n.children)if(x.tag)walk(x,footer);};walk(root);return out;};
  const oldLinks=links(before),newLinks=links(after),isOld=x=>oldLinks.some(y=>JSON.stringify(y)===JSON.stringify(x));
  const additions=newLinks.filter(x=>!isOld(x));
  if(additions.length){
    const addedHref=additions.length===1?additions[0].attrs.find(([k])=>k==='href')?.[1]:null;
    if(JSON.stringify(beforeShape)!==JSON.stringify(shape(after,addedHref)))return full;
    if(additions.length!==1||!additions[0].footer||!additions[0].text||additions[0].attrs.some(([k])=>!['href','target','rel','aria-label','class'].includes(k))||!additions[0].attrs.some(([k,v])=>k==='target'&&v==='_blank')||!additions[0].attrs.some(([k,v])=>k==='rel'&&v.split(/\s+/).includes('noopener')&&v.split(/\s+/).includes('noreferrer')))return full;
    const href=additions[0].attrs.find(([k])=>k==='href')?.[1];if(!/^https:\/\//i.test(href??''))return full;
    content={kind:'footer-link-added',href,label:additions[0].text};
  }else{
    const sameStructure=JSON.stringify(beforeShape)===JSON.stringify(afterShape);
    if(!sameStructure||beforeLeaves.length!==afterLeaves.length)return full;
    const diffs=beforeLeaves.map((x,i)=>({before:x,after:afterLeaves[i]})).filter(x=>x.before.text!==x.after.text);
    if(!diffs.length||diffs.some(diff=>diff.before.path!==diff.after.path))return full;
    const allowedTextParents=new Set(['p','span','li','strong','em','small','h2','h3','h4','figcaption','td','th']);
    if(diffs.some(diff=>!allowedTextParents.has(diff.before.parent)
        ||[...forbiddenRiskTags].some(tag=>diff.before.path.toLowerCase().includes(tag+':'))))return full;
    const textChanges=diffs.map(diff=>({before:diff.before.text,after:diff.after.text,path:diff.before.path,parent:diff.before.parent}));
    content=textChanges.length===1
      ?{kind:'static-text-updated',...textChanges[0]}
      :{kind:'static-text-updated',changes:textChanges};
  }
  const assessment={classification:'LOW-RISK CONTENT',verified:true,basis:'Verified static text-only changes in an authoritative registered route source; interactive structure and dependencies are unchanged.',owner:{route:owner.route,sourcePath:owner.sourcePath,kind:owner.kind},content};
  trustedRiskAssessments.add(assessment);return assessment;
}
export function smokePolicy(changes, features = [], routes = [], riskAssessment, verificationScope) {
  const sensitive = changes.some(c => /\.(?:m?js|cjs|ts|tsx)$/i.test(c.path) || c.path.startsWith('worker/') || c.path.startsWith('src/'));
  // Estimate and chatbot are exercised in the candidate browser suite on every
  // changed route. Delivery integrations remain separate evidence requirements.
  const required = new Set(['http','browser',...features.filter(f=>!['estimate','chatbot'].includes(f))]);
  if(features.includes('estimate')||features.includes('submission'))required.add('submission');
  if(features.includes('callback')||features.includes('email'))required.add('submission');
  const low=trustedRiskAssessments.has(riskAssessment)&&riskAssessment?.classification==='LOW-RISK CONTENT'
    &&riskAssessment?.verified===true&&!!riskAssessment.owner?.sourcePath&&!!riskAssessment.content?.kind&&!sensitive&&!features.length;
  return {classification:low?'LOW-RISK CONTENT':'HIGH-RISK FUNCTIONAL',riskAssessment:low?riskAssessment:undefined,checks:[...required].sort(),browserChecks:[...(low?LOW_RISK_BROWSER_CHECKS:BROWSER_CHECKS)], routes:[...new Set(verificationScope?.routes??(routes.length?routes:['/']))].sort(), ...(verificationScope?{verificationScope}:{}), maxAgeMinutes:120 };
}
function approvedNewStaticRoute(plan, owners) {
  const additions=(plan.approvedChanges??[]).filter(change=>change.before===null&&change.path.startsWith('site-copy/')&&change.path.endsWith('/index.html'));
  if(additions.length!==1)return null;
  const change=additions[0];
  const route='/'+change.path.slice('site-copy/'.length,-'index.html'.length);
  const owner=(owners??[]).find(o=>o.path===change.path);
  return ownerIsRegistered(change,owner)?route:null;
}
function pageHasEstimateOrChatbotInteraction(source) {
  const document = parse(source);
  const interactiveTags = new Set(['form','input','select','textarea','button','iframe','object','embed']);
  let interactive = false;
  const visit = node => {
    if (interactive) return;
    if (node.tagName && interactiveTags.has(node.tagName)) { interactive = true; return; }
    if (node.tagName === 'script') {
      const type = node.attrs?.find(attr => attr.name === 'type')?.value?.toLowerCase();
      if (type !== 'application/ld+json') { interactive = true; return; }
    }
    for (const attr of node.attrs ?? []) {
      if (/^(?:data-(?:chat|chatbot|estimate|quote)|contenteditable)$/i.test(attr.name)
          || /(?:chatbot|chat-assistant|estimate-form|quote-form)/i.test(attr.value)) { interactive = true; return; }
    }
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(document);
  return interactive;
}
async function verifiedIndependentStaticAddition(plan, owners, differences) {
  const route = approvedNewStaticRoute(plan, owners);
  if (!route || route === '/' || !Array.isArray(differences) || differences.length !== 1) return null;
  const change = plan.approvedChanges[0], difference = differences[0];
  if (difference.path !== change.path || difference.before !== null || difference.after !== change.after) return null;
  const source = await readFile(resolve(plan.candidatePackage, change.path), 'utf8');
  if (pageHasEstimateOrChatbotInteraction(source)) return null;
  return route;
}
export function browserCheckAssignments(plan, policy=plan.smokeRequirements, owners=plan.workflow?.owners, independentStaticAdditionRoute=policy?.independentStaticAdditionRoute) {
  const checks=policy?.browserChecks??BROWSER_CHECKS;
  const routes=[...new Set(policy?.routes?.length?policy.routes:['/'])];
  const newStaticRoute=approvedNewStaticRoute(plan,owners);
  if(policy?.verificationScope){
    const {scopeSha256,...unsigned}=policy.verificationScope;
    if(policy.verificationScope.schema!=='pcm-verification-scope/v1'
        ||(plan.candidateManifestSha256&&policy.verificationScope.candidateManifestSha256!==plan.candidateManifestSha256)
        ||hash(Buffer.from(JSON.stringify(unsigned)))!==scopeSha256
        ||!Array.isArray(policy.verificationScope.routes)||!policy.verificationScope.routes.length
        ||JSON.stringify(routes)!==JSON.stringify([...policy.verificationScope.routes].sort())
        ||!policy.verificationScope.checksByRoute||routes.some(route=>!Array.isArray(policy.verificationScope.checksByRoute[route])
          ||policy.verificationScope.checksByRoute[route].some(check=>!checks.includes(check))))
      fail('Candidate-bound verification scope is missing, mismatched, or invalid');
  }
  if(policy?.verificationScope&&['SHARED_RUNTIME_OR_ROUTING','SHARED_OR_UNCERTAIN_ASSET','CSS_DEPENDENCY_UNKNOWN_SITE_WIDE'].includes(policy.verificationScope.kind)){
    const byRoute={...policy.verificationScope.checksByRoute};
    if(newStaticRoute&&routes.includes(newStaticRoute))byRoute[newStaticRoute]=[...new Set([...(byRoute[newStaticRoute]??[]),...NEW_STATIC_PAGE_CHECKS])];
    return {routes,byRoute,newStaticRoutes:newStaticRoute&&routes.includes(newStaticRoute)?[newStaticRoute]:[],pageChecks:newStaticRoute&&routes.includes(newStaticRoute)?[...NEW_STATIC_PAGE_CHECKS]:[]};
  }
  if (independentStaticAdditionRoute && independentStaticAdditionRoute === newStaticRoute
      && routes.length === 1 && routes[0] === newStaticRoute) {
    return {
      routes,
      byRoute: { [newStaticRoute]: checks.filter(check => !['estimate-form','chatbot-input'].includes(check)) },
      newStaticRoutes: [newStaticRoute],
      pageChecks: [...NEW_STATIC_PAGE_CHECKS],
    };
  }
  if (newStaticRoute && routes.includes(newStaticRoute) && newStaticRoute !== '/') {
    const pageChecks=checks.filter(check=>!['navigation','estimate-form','chatbot-input'].includes(check));
    const homeChecks=['navigation','estimate-form','chatbot-input'].filter(check=>checks.includes(check));
    if(checks.includes('console-errors'))homeChecks.push('console-errors');
    return {
      routes:[...new Set([...routes,'/'])],
      byRoute:{...Object.fromEntries(routes.map(route=>[route,pageChecks])),...(newStaticRoute!=='/'?{'/':homeChecks}:{})},
      newStaticRoutes:[newStaticRoute],
      pageChecks:[...NEW_STATIC_PAGE_CHECKS],
    };
  }
  if(policy?.verificationScope){
    return {routes,byRoute:policy.verificationScope.checksByRoute,newStaticRoutes:[],pageChecks:[]};
  }
  if(!newStaticRoute||!routes.includes(newStaticRoute)) {
    return {routes,byRoute:Object.fromEntries(routes.map(route=>[route,[...checks]])),newStaticRoutes:[],pageChecks:[]};
  }
  const pageChecks=checks.filter(check=>!['navigation','estimate-form','chatbot-input'].includes(check));
  const homeChecks=['navigation','estimate-form','chatbot-input'].filter(check=>checks.includes(check));
  if(checks.includes('console-errors'))homeChecks.push('console-errors');
  return {
    routes:[...new Set([...routes,'/'])],
    byRoute:{...Object.fromEntries(routes.map(route=>[route,pageChecks])),...(newStaticRoute!=='/'?{'/':homeChecks}:{})},
    newStaticRoutes:[newStaticRoute],
    pageChecks:[...NEW_STATIC_PAGE_CHECKS],
  };
}
export async function validateApprovedChangeSet(plan, baseline, manifest) {
  if(!Array.isArray(baseline?.file_hashes)||!Array.isArray(manifest?.files)||!Array.isArray(plan?.approvedChanges))fail('Candidate/baseline file inventories are incomplete');
  const oldFiles=new Map(),newFiles=new Map();
  for(const file of baseline.file_hashes){if(oldFiles.has(file.path))fail('Baseline inventory contains a duplicate file: '+file.path);oldFiles.set(file.path,file);}
  for(const file of manifest.files){if(newFiles.has(file.path))fail('Candidate manifest contains a duplicate file: '+file.path);newFiles.set(file.path,file);}
  const approved=new Map();
  for(const change of plan.approvedChanges){if(approved.has(change.path))fail('Approved change list contains a duplicate file: '+change.path);approved.set(change.path,change);}
  const paths=new Set([...oldFiles.keys(),...newFiles.keys()]),differences=[];
  const identity=file=>file?`${file.bytes}:${file.sha256}`:null;
  for(const path of paths){const before=oldFiles.get(path),after=newFiles.get(path);if(identity(before)!==identity(after))differences.push({path,before:identity(before),after:identity(after)});}
  if(differences.length!==approved.size)fail('Candidate contains unapproved added, modified, or deleted assets');
  for(const difference of differences){const change=approved.get(difference.path);if(!change||change.before!==difference.before||change.after!==difference.after)fail('Candidate difference is not explicitly approved: '+difference.path);}
  for(const change of approved.values())if(!differences.some(item=>item.path===change.path))fail('Approved change does not match a candidate difference: '+change.path);
  return differences;
}

function routeHtmlAsset(route){return route==='/'?'site-copy/index.html':`site-copy${route}index.html`;}
function internalAssetPath(value,baseUrl){
  let url;try{url=new URL(value,baseUrl);}catch{return null;}
  if(url.origin!=='https://pcm.invalid'||url.search||url.hash)return null;
  let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{fail('Asset dependency URL has invalid encoding');}
  if(!pathname.startsWith('/')||pathname.split('/').some(part=>part==='..'))fail('Asset dependency URL is unsafe');
  return `site-copy${pathname}`;
}
function stylesheetReferences(html,route){
  const document=parse(html),found=new Set(),base=`https://pcm.invalid${route}`;
  const text=node=>(node.childNodes??[]).map(child=>child.nodeName==='#text'?child.value:text(child)).join('');
  const visit=node=>{
    if(node.tagName==='link'){
      const attrs=new Map((node.attrs??[]).map(attr=>[attr.name.toLowerCase(),attr.value]));
      if((attrs.get('rel')??'').toLowerCase().split(/\s+/).includes('stylesheet')){
        const asset=internalAssetPath(attrs.get('href')??'',base);if(asset)found.add(asset);
      }
    }
    if(node.tagName==='style')for(const asset of parseCssImports(text(node),base))found.add(asset);
    for(const child of node.childNodes??[])visit(child);
  };
  visit(document);return found;
}
function parseCssImports(css,baseUrl){
  const imports=[...css.matchAll(/@import\s+(?:url\(\s*)?(?:"([^"]+)"|'([^']+)'|([^\s)"';]+))\s*\)?[^;]*;/gi)];
  if((css.match(/@import\b/gi)??[]).length!==imports.length)fail('Stylesheet dependencies contain an unrecognized @import; route scope is incomplete');
  return imports.map(match=>internalAssetPath(match[1]??match[2]??match[3],baseUrl)).filter(Boolean);
}
async function routeStylesheetDependencies(route,htmlPath,htmlRecord,packageRoot,inventory){
  const htmlBytes=await readFile(join(packageRoot,htmlPath));
  if(htmlBytes.length!==htmlRecord.bytes||hash(htmlBytes)!==htmlRecord.sha256)fail('Route HTML dependency inventory does not match its recorded bytes');
  const htmlUrl=route==='/'?'https://pcm.invalid/':`https://pcm.invalid${route}`;
  const roots=stylesheetReferences(htmlBytes.toString('utf8'),route),found=new Set(),visit=async asset=>{
    if(found.has(asset))return;found.add(asset);
    const record=inventory.get(asset);if(!record)fail(`Stylesheet dependency is missing from the complete asset inventory: ${asset}`);
    const bytes=await readFile(join(packageRoot,asset));
    if(bytes.length!==record.bytes||hash(bytes)!==record.sha256)fail(`Stylesheet dependency bytes are not verified: ${asset}`);
    const cssUrl='https://pcm.invalid/'+asset.slice('site-copy/'.length);
    for(const dependency of parseCssImports(bytes.toString('utf8'),cssUrl))await visit(dependency);
  };
  for(const asset of roots)await visit(asset);
  return found;
}
export async function deriveVerificationScope({plan,changes,owners,features=[],riskAssessment,baseline,manifest,routeOwnership=routeOwnershipByUrl}){
  if(!Array.isArray(changes)||!changes.length||!Array.isArray(owners)||owners.length!==changes.length
      ||!Array.isArray(baseline?.file_hashes)||!Array.isArray(manifest?.files))fail('Verification scope lacks complete changed-file or ownership evidence');
  const byPath=new Map(owners.map(owner=>[owner.path,owner]));
  for(const change of changes){
    const owner=byPath.get(change.path);
    if(!owner||owner.path!==change.path)fail('Verification scope owner record does not match the exact changed asset: '+change.path);
    if(change.path.startsWith('site-copy/')&&change.path.endsWith('/index.html')&&!ownerIsRegistered(change,owner))
      fail('Verification scope rejects ambiguous or unregistered route ownership: '+change.path);
    if(change.path.startsWith('site-copy/')&&/\.css$/i.test(change.path)
        &&(owner.kind!=='asset'||owner.sourcePath!==change.path))fail('Verification scope rejects ambiguous stylesheet ownership: '+change.path);
  }
  const changedPaths=changes.map(change=>change.path),hasWorkerOrRuntime=changedPaths.some(path=>
    /^(?:src\/|worker\/)|(?:^|\/)(?:wrangler\.toml|_redirects|_headers)$/.test(path)
      ||/\.(?:m?js|cjs|ts|tsx)$/i.test(path));
  let kind='SITE_WIDE',routes;
  if(!hasWorkerOrRuntime&&changedPaths.every(path=>path.startsWith('site-copy/')&&path.endsWith('/index.html'))){
    routes=[...new Set(owners.map(owner=>owner.route))].filter(Boolean);
    if(routes.length!==changes.length)fail('Changed route scope is ambiguous');
    kind=riskAssessment?.classification==='LOW-RISK CONTENT'?'STATIC_CONTENT_PAGES':'ROUTE_HTML_PAGES';
    if(changes.some(change=>change.before===null)){
      for(const change of changes.filter(item=>item.before===null)){
        const route=byPath.get(change.path)?.route;
        if(pageHasEstimateOrChatbotInteraction(change.afterBytes?.toString('utf8')??''))routes.push('/');
      }
      kind='STATIC_PAGE_ADDITION';
    }
  }else if(!hasWorkerOrRuntime&&changedPaths.every(path=>path.startsWith('site-copy/')&&/\.css$/i.test(path))){
    const baselineInventory=new Map(baseline.file_hashes.map(file=>[file.path,file]));
    const candidateInventory=new Map(manifest.files.map(file=>[file.path,file]));
    const cssDependencies=new Map();
    const routeEntries=[...routeOwnership.entries()].sort(([a],[b])=>a.localeCompare(b));
    for(const [route,record] of routeEntries){
      if(!record?.owner||!record?.ownerType||record.owner==='generate-spa-routes.mjs')fail('Stylesheet dependency route ownership is incomplete: '+route);
      const htmlPath=routeHtmlAsset(route),baseRecord=baselineInventory.get(htmlPath),candidateRecord=candidateInventory.get(htmlPath);
      if(!baseRecord||!candidateRecord)fail('Stylesheet dependency route inventory is incomplete for '+route);
      const baseDeps=await routeStylesheetDependencies(route,htmlPath,baseRecord,baseline.package.root,baselineInventory);
      const candidateDeps=await routeStylesheetDependencies(route,htmlPath,candidateRecord,plan.candidatePackage,candidateInventory);
      cssDependencies.set(route,new Set([...baseDeps,...candidateDeps]));
    }
    const changedCss=new Set(changedPaths);
    routes=routeEntries.filter(([route])=>[...(cssDependencies.get(route)??[])].some(asset=>changedCss.has(asset))).map(([route])=>route);
    if(!routes.length){routes=routeEntries.map(([route])=>route);kind='CSS_DEPENDENCY_UNKNOWN_SITE_WIDE';}
    else kind='ROUTE_SPECIFIC_CSS';
  }else{
    routes=[...routeOwnership.keys()];
    if(!routes.length)fail('Site-wide verification cannot be scoped without the authoritative route ownership inventory');
    kind=hasWorkerOrRuntime?'SHARED_RUNTIME_OR_ROUTING':'SHARED_OR_UNCERTAIN_ASSET';
  }
  routes=[...new Set(routes)].sort();
  const checks=kind==='STATIC_CONTENT_PAGES'?LOW_RISK_BROWSER_CHECKS:BROWSER_CHECKS;
  const checksByRoute=Object.fromEntries(routes.map(route=>[route,[...checks]]));
  const candidateManifestSha256=plan.candidateManifestSha256??hash(await readFile(plan.candidateManifestPath));
  const body={schema:'pcm-verification-scope/v1',kind,candidateManifestSha256,routes,checksByRoute,changedPaths:[...changedPaths].sort()};
  return {...body,scopeSha256:hash(Buffer.from(JSON.stringify(body)))};
}
export async function deriveSmokePolicy(plan, owners) {
  const recorded=plan.smokeRequirements??{};
  const baseline=JSON.parse(await readFile(plan.baselinePath,'utf8')),manifest=JSON.parse(await readFile(plan.candidateManifestPath,'utf8')),changes=[];
  for(const c of plan.approvedChanges){
    const previous=baseline.file_hashes.find(f=>f.path===c.path);
    if(!previous&&c.before!==null)fail('Risk review lacks a baseline asset record for an existing change: '+c.path);
    if(previous&&c.before===null)fail('Approved new asset already exists in the accepted baseline: '+c.path);
  }
  const verifiedAssetDifferences=await validateApprovedChangeSet(plan,baseline,manifest);
  for(const c of plan.approvedChanges){
    const previous=baseline.file_hashes.find(f=>f.path===c.path);
    const beforeBytes=previous?await readFile(join(baseline.package.root,c.path)):null;
    const afterBytes=await readFile(resolve(plan.candidatePackage,c.path)).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
    changes.push({path:c.path,beforeBytes,afterBytes});
  }
  let requestedFeatures;
  const requestRefs=plan.workflow?.verificationFiles??[];
  let request=null;
  for(const ref of requestRefs){
    if(!isAbsolute(ref?.path??''))continue;
    const bytes=await readFile(ref.path).catch(()=>null);
    if(!bytes||hash(bytes)!==ref.sha256)fail('Prepared feature request evidence is missing or mismatched');
    let parsed;try{parsed=JSON.parse(bytes.toString('utf8'));}catch{continue;}
    if(parsed.schema==='pcm-website-change-request/v1'){request=parsed;break;}
  }
  if(request){const declared=request.features??[];if(!Array.isArray(declared)||declared.some(f=>!FEATURE_NAMES.includes(f)))fail('Declared functionality requirements are invalid');requestedFeatures=[...declared];}
  else requestedFeatures=(recorded.checks??[]).filter(c=>FEATURE_NAMES.includes(c));
  const features=new Set(requestedFeatures);
  for(const change of changes)for(const feature of inferChangeFeatures({path:change.path,beforeBytes:change.beforeBytes,afterBytes:change.afterBytes}))features.add(feature);
  const featureList=[...features].sort();
  const risk=classifyChangeRisk({changes,owners,features:featureList});
  if(recorded.classification&& !['LOW-RISK CONTENT','HIGH-RISK FUNCTIONAL'].includes(recorded.classification))fail('Unknown recorded risk classification');
  if(recorded.classification==='LOW-RISK CONTENT'&&risk.classification!=='LOW-RISK CONTENT')fail('Recorded low-risk classification conflicts with verified changes or ownership');
  const independentStaticAdditionRoute=await verifiedIndependentStaticAddition(plan,owners,verifiedAssetDifferences);
  const verificationScope=await deriveVerificationScope({plan,changes,owners,features:featureList,
    riskAssessment:recorded.classification==='HIGH-RISK FUNCTIONAL'?{...risk,classification:'HIGH-RISK FUNCTIONAL'}:risk,baseline,manifest});
  if(recorded.classification==='HIGH-RISK FUNCTIONAL'&&risk.classification==='LOW-RISK CONTENT'){
    const forcedHighRisk={...risk,classification:'HIGH-RISK FUNCTIONAL'};
    const policy=smokePolicy(plan.approvedChanges,featureList,verificationScope.routes,forcedHighRisk,verificationScope);
    return {...policy,verifiedAssetDifferences,independentStaticAdditionRoute};
  }
  const policy=smokePolicy(plan.approvedChanges,featureList,verificationScope.routes,risk,verificationScope);
  if(risk.classification==='LOW-RISK CONTENT'&&policy.classification!=='LOW-RISK CONTENT')fail('Verified low-risk policy could not be established');
  return {...policy,verifiedAssetDifferences,independentStaticAdditionRoute};
}
function fresh(time,plan){const minutes=plan.smokeRequirements?.maxAgeMinutes??120,age=Date.now()-Date.parse(time);if(!Number.isFinite(minutes)||minutes<=0||minutes>120||!Number.isFinite(age)||age< -60000||age>minutes*60000)fail('Smoke evidence is stale or has invalid time');}

export const COST_GUIDE_OWNER_ACCEPTED_MOBILE_LAYOUT = Object.freeze({
  conditionId: 'cost-guide-4ec3926f-owner-accepted-mobile-horizontal-overflow',
  candidateVersionId: '4ec3926f-c504-4edb-8fb2-820483e8a2b6',
  candidateManifestSha256: 'a4ef544e19dccb86010328f792878929e3bfbb10ea6d38bff2552c3f8b85df57',
  releasePlanSha256: '33e359121eeed9c06f2b865cb2622626e70b46ec1dc31db1c8a5058730cf8d78',
  productionVersion: 'e13d21fe-1af5-477b-b631-5a9ada60571e',
  previewOrigin: 'https://4ec3926f-newpurely.edwardkita.workers.dev',
  route: '/long-distance-moving-cost-canada/',
  viewport: Object.freeze({ width: 390, height: 844 }),
  screenshotPath: 'C:\\Users\\HP\\PCM-deployment\\evidence\\cost-guide-4ec3926f-preview-20261030-r4\\mobile-e7922cf4d235.png',
  screenshotSha256: '72a77cee8e24de5d10bdfbb3ad890fc63c8a9b42bb1d6d94abfab4e114480135',
  sourceBrowserArtifactSha256: '73c5d9736a7f23ac64eee5f03de151e7ef065667ff0c7c7bc31466f8c2bdbdc7',
  ownerStatement: 'I inspected the mobile presentation and confirm the horizontal scrolling is acceptable.',
  blockingDefects: Object.freeze([
    'Horizontal overflow or missing visible page heading',
    'FAIL: mobile viewport shows horizontal page overflow; horizontal scrollbar is visible at 390px width.',
  ]),
});

// Separate production acceptance recorded after owner inspection of the exact
// production capture. The original preview-bound acceptance above remains
// unchanged and continues to govern preview evidence only.
export const COST_GUIDE_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT = Object.freeze({
  conditionId: 'cost-guide-4ec3926f-production-owner-accepted-mobile-20261030',
  candidateVersionId: '4ec3926f-c504-4edb-8fb2-820483e8a2b6',
  candidateManifestSha256: 'a4ef544e19dccb86010328f792878929e3bfbb10ea6d38bff2552c3f8b85df57',
  releasePlanSha256: '33e359121eeed9c06f2b865cb2622626e70b46ec1dc31db1c8a5058730cf8d78',
  productionVersion: 'e13d21fe-1af5-477b-b631-5a9ada60571e',
  previewOrigin: 'https://4ec3926f-newpurely.edwardkita.workers.dev',
  route: '/long-distance-moving-cost-canada/',
  viewport: Object.freeze({ width: 390, height: 844 }),
  screenshotPath: 'C:\\Users\\HP\\PCM-deployment\\evidence\\cost-guide-4ec3926f-production-20261030-r4\\mobile-e7922cf4d235.png',
  screenshotSha256: '4dd758e008eaa586d753a98c1f1cf115cde1e66480af378ec6957d190f37583d',
  ownerStatement: 'I have reviewed and approve the new production mobile screenshot at 390 × 844.',
  blockingDefects: Object.freeze([
    'Horizontal overflow or missing visible page heading',
    'Automated horizontal overflow remains FAIL. Owner acceptance applies only to production screenshot SHA-256 4dd758e008eaa586d753a98c1f1cf115cde1e66480af378ec6957d190f37583d.',
  ]),
});

// Separate preview acceptance for the alphabetical Cost Guide candidate.
// The automated horizontal-overflow failure remains recorded; this condition
// only permits that exact route, viewport, candidate, artifact, and screenshot.
export const COST_GUIDE_ALPHABETICAL_OWNER_ACCEPTED_MOBILE_LAYOUT = Object.freeze({
  conditionId: 'cost-guide-e2061c76-owner-accepted-mobile-horizontal-overflow',
  candidateVersionId: 'e2061c76-5ab1-4cd7-91f7-3d6476b9c3d2',
  candidateManifestSha256: '91afab70133ba7d44f93b78d00195bb7f1e1689d7daec90d5a1c3beeefb561d2',
  releasePlanSha256: 'd3d92e458ac13c9dd779a58d2fd43a03e9881f1ba4bc74b454d53548f427b8d4',
  productionVersion: '4ec3926f-c504-4edb-8fb2-820483e8a2b6',
  previewOrigin: 'https://e2061c76-newpurely.edwardkita.workers.dev',
  route: '/long-distance-moving-cost-canada/',
  viewport: Object.freeze({ width: 390, height: 844 }),
  screenshotPath: 'C:\\Users\\HP\\PCM-deployment\\evidence\\cost-guide-e2061c76-preview-20261030-r1\\mobile-e7922cf4d235.png',
  screenshotSha256: '4dd758e008eaa586d753a98c1f1cf115cde1e66480af378ec6957d190f37583d',
  sourceBrowserArtifactSha256: '5e1c92501e173375c80a42309cc70c83f15df700ffedb967560d0531152b8e15',
  ownerStatement: 'The horizontal table scrolling at 390 px is visually acceptable to me.',
  blockingDefects: Object.freeze(['Horizontal overflow or missing visible page heading']),
});

// Production has a separate capture and acceptance. This condition is bound to
// the exact production screenshot reviewed after promoting this same candidate.
export const COST_GUIDE_ALPHABETICAL_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT = Object.freeze({
  conditionId: 'cost-guide-e2061c76-production-owner-accepted-mobile-20261030',
  candidateVersionId: 'e2061c76-5ab1-4cd7-91f7-3d6476b9c3d2',
  candidateManifestSha256: '91afab70133ba7d44f93b78d00195bb7f1e1689d7daec90d5a1c3beeefb561d2',
  releasePlanSha256: 'd3d92e458ac13c9dd779a58d2fd43a03e9881f1ba4bc74b454d53548f427b8d4',
  productionVersion: '4ec3926f-c504-4edb-8fb2-820483e8a2b6',
  previewOrigin: 'https://e2061c76-newpurely.edwardkita.workers.dev',
  route: '/long-distance-moving-cost-canada/',
  viewport: Object.freeze({ width: 390, height: 844 }),
  screenshotPath: 'C:\\Users\\HP\\PCM-deployment\\evidence\\cost-guide-e2061c76-production-20261030-r1\\mobile-e7922cf4d235.png',
  screenshotSha256: '72a77cee8e24de5d10bdfbb3ad890fc63c8a9b42bb1d6d94abfab4e114480135',
  sourceBrowserArtifactSha256: 'e3abf6a4728f8886332b1480db86672a5a0278f20886ef26043220fdd7831fae',
  ownerStatement: 'The business owner reviewed the production mobile screenshot at 390 × 844 and replied PASS.',
  blockingDefects: Object.freeze(['Horizontal overflow or missing visible page heading']),
});

export async function validateCostGuideOwnerAcceptedMobileLayout({ testRows, phase, plan, state, conditionRef, sourceBrowserArtifactSha256 }) {
  const preview=COST_GUIDE_OWNER_ACCEPTED_MOBILE_LAYOUT, production=COST_GUIDE_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT;
  const alphabetical=COST_GUIDE_ALPHABETICAL_OWNER_ACCEPTED_MOBILE_LAYOUT;
  const alphabeticalProduction=COST_GUIDE_ALPHABETICAL_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT;
  const isAlphabeticalPreview=phase==='preview'&&conditionRef?.conditionId===alphabetical.conditionId;
  const isAlphabeticalProduction=phase==='production'&&conditionRef?.conditionId===alphabeticalProduction.conditionId;
  const isProductionAcceptance=phase==='production'&&[production.conditionId,alphabeticalProduction.conditionId].includes(conditionRef?.conditionId);
  const e=isAlphabeticalPreview?alphabetical:isAlphabeticalProduction?alphabeticalProduction:isProductionAcceptance?production:preview;
  const reject=()=>fail('Cost Guide mobile owner-accepted condition is incomplete or outside its exact candidate, route, viewport, or screenshot scope');
  if(!isAbsolute(conditionRef?.path??'')||!/^[a-f0-9]{64}$/i.test(conditionRef?.sha256??'')
      ||(isProductionAcceptance
        ? !/^[a-f0-9]{64}$/i.test(conditionRef?.sourceBrowserArtifactSha256??'')||conditionRef.sourceBrowserArtifactSha256!==sourceBrowserArtifactSha256
        : conditionRef?.sourceBrowserArtifactSha256!==e.sourceBrowserArtifactSha256)
      ||!['preview','production'].includes(phase)
      ||(phase==='preview'&&sourceBrowserArtifactSha256!==e.sourceBrowserArtifactSha256)
      ||(phase==='production'&&!isProductionAcceptance&&(!/^[a-f0-9]{64}$/i.test(sourceBrowserArtifactSha256??'')
        ||conditionRef?.sourceBrowserArtifactSha256!==preview.sourceBrowserArtifactSha256))) reject();
  let conditionBytes,condition;
  try{conditionBytes=await readFile(conditionRef.path);condition=JSON.parse(conditionBytes);}catch{reject();}
  if(hash(conditionBytes)!==conditionRef.sha256) reject();
  await evidenceFiles([conditionRef],plan?.candidatePackage);
  if(state?.versionId!==e.candidateVersionId||state?.previewUrl!==e.previewOrigin
      ||(phase==='production'&&(state?.stage!=='PROMOTED_VERIFIED'||state?.productionVersionAfterPromotion!==e.candidateVersionId||state?.postPromotionTrafficVerified!==true))
      ||plan?.candidateManifestSha256!==e.candidateManifestSha256||plan?.releasePlanSha256!==e.releasePlanSha256
      ||plan?.productionVersion!==e.productionVersion||JSON.stringify(plan?.smokeRequirements?.routes)!==JSON.stringify([e.route])
      ||JSON.stringify(plan?.approvedChanges?.map(change=>change.path))!==JSON.stringify(['site-copy/long-distance-moving-cost-canada/index.html'])
      ||condition?.schema!=='pcm-owner-accepted-layout-condition/v1'||condition?.conditionId!==e.conditionId
      ||condition?.source!=='explicit business-owner instruction'||condition?.acknowledged!==true
      ||condition?.candidateVersionId!==e.candidateVersionId||condition?.candidateManifestSha256!==e.candidateManifestSha256
      ||condition?.productionVersionId!==(isProductionAcceptance?e.candidateVersionId:e.productionVersion)||condition?.route!==e.route
      ||condition?.viewport?.width!==e.viewport.width||condition?.viewport?.height!==e.viewport.height||condition?.scrollY!==0
      ||condition?.screenshotPath!==e.screenshotPath||condition?.screenshotSha256!==e.screenshotSha256
      ||condition?.sourceBrowserArtifactSha256!==conditionRef.sourceBrowserArtifactSha256
      ||condition?.automatedResult!=='FAIL'||condition?.ownerStatement!==e.ownerStatement
      ||(isAlphabeticalPreview&&condition?.phase!=='preview')
      ||(isAlphabeticalProduction&&condition?.phase!=='production')
      ||(isProductionAcceptance&&(condition?.phase!=='production'||conditionRef?.conditionId!==condition?.conditionId))
      ||JSON.stringify(condition?.blockingDefects)!==JSON.stringify([...e.blockingDefects])) reject();
  fresh(condition.acknowledgedAtUtc,plan);
  const rows=(testRows??[]).filter(row=>row?.name==='mobile-layout'&&row.route===e.route),test=rows[0];
  const expectedManualReview=phase==='production'
    ? (isProductionAcceptance?production.blockingDefects[1]:`Horizontal overflow remains as an automated FAIL. The owner-approved acceptance is bound to the exact candidate and 390x844 screenshot hash ${preview.screenshotSha256}; this production screenshot hash matches that approved image.`)
    : null;
  const expectedDefects=isAlphabeticalProduction?[...alphabeticalProduction.blockingDefects]
    :phase==='production'?[e.blockingDefects[0],expectedManualReview]:[...e.blockingDefects];
  if(rows.length!==1||test?.status!=='FAIL'||test?.versionId!==e.candidateVersionId
      ||test?.candidateManifestSha256!==e.candidateManifestSha256||test?.viewport?.width!==e.viewport.width
      ||test?.viewport?.height!==e.viewport.height
      ||JSON.stringify(test?.blockingDefects)!==JSON.stringify(expectedDefects)
      ||!Array.isArray(test.evidenceFiles)||!test.evidenceFiles.some(file=>(isProductionAcceptance?file.path===e.screenshotPath:(phase==='production'||file.path===e.screenshotPath))&&file.sha256===e.screenshotSha256)) reject();
  return e.conditionId;
}

export const PRICING_MOBILE_LAYOUT_GROUP = Object.freeze({
  conditionId: 'pricing-66f53c94-approved-mobile-fixed-control-overlaps',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  previewOrigin: 'https://66f53c94-newpurely.edwardkita.workers.dev',
  viewport: Object.freeze({ width: 390, height: 844 }),
  scrollY: 0,
  afterScrollScreenshotsAvailable: false,
  ownerStatement: 'I acknowledge the documented initial-mobile-viewport overlaps on the 29 routes listed in proposed-layout-condition-group.json, subject to verification that the final record contains exactly those 29 routes and conditions. The acknowledgment applies only to the recorded overlap between the fixed estimate bar/chat launcher and Home size or Move date controls on those 29 routes.',
  routes: Object.freeze({
    '/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/calgary-to-edmonton-movers/': ['homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/calgary-to-ottawa-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
    '/calgary-to-toronto-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/calgary-to-vancouver-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/calgary-to-winnipeg-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
    '/edmonton-to-calgary-movers/': ['homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/edmonton-to-toronto-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/edmonton-to-vancouver-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/halifax-to-toronto-movers/': ['homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
    '/local/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/montreal-to-edmonton-movers/': ['homeSize intersects fixed sticky estimate bar','moveDate intersects fixed sticky estimate bar'],
    '/montreal-to-toronto-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher'],
    '/montreal-to-vancouver-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/ottawa-to-calgary-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
    '/ottawa-to-toronto-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
    '/ottawa-to-vancouver-movers/': ['homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
    '/surrey/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/toronto-to-calgary-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/toronto-to-edmonton-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/toronto-to-montreal-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher'],
    '/toronto-to-ottawa-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
    '/toronto-to-vancouver-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/vancouver-to-calgary-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/vancouver-to-edmonton-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/vancouver-to-montreal-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/vancouver-to-ottawa-movers/': ['homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/vancouver-to-toronto-movers/': ['moveDate intersects fixed sticky estimate bar','moveDate intersects fixed chat launcher'],
    '/winnipeg-to-calgary-movers/': ['homeSize intersects fixed sticky estimate bar','homeSize intersects fixed chat launcher','moveDate intersects fixed sticky estimate bar'],
  }),
});

export const PRICING_MONTREAL_EDMONTON_ADDITIONAL_MOBILE_CONDITION = Object.freeze({
  conditionId: 'pricing-66f53c94-montreal-edmonton-mobile-origin-destination-overlap',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  route: '/montreal-to-edmonton-movers/',
  viewport: Object.freeze({ width: 390, height: 844 }),
  scrollY: 0,
  defects: Object.freeze([
    'from intersects fixed sticky estimate bar',
    'to intersects fixed sticky estimate bar',
    'to intersects fixed chat launcher',
  ]),
  screenshotSha256: '7baa4fc85139c73466bde793a3b27c941b140cb9e7d6cc0454f027e3066d550f',
  ownerStatement: 'I approve the existing production-equivalent mobile overlap involving the Moving from / Moving to fields, fixed estimate bar, and chat launcher for this pricing candidate on /montreal-to-edmonton-movers/ at 390 × 844 and scroll position 0, as shown by matching screenshots with SHA-256 7BAA4FC85139C73466BDE793A3B27C941B140CB9E7D6CC0454F027E3066D550F.',
});

export const PRICING_R5B_SIX_ROUTE_DESTINATION_CHAT_CONDITION = Object.freeze({
  conditionId: 'pricing-66f53c94-r5b-six-route-destination-chat-overlap',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  previewOrigin: 'https://66f53c94-newpurely.edwardkita.workers.dev',
  sourceBrowserArtifactSha256: '9e23b42b0a882c8194c6edc36cad040da658cb4223346c26714356e12f710604',
  ownerApprovalRecordSha256: 'a11caedb7a7902a5a4123d7033728e52c5ae2e1e71e6a51180a7df7c797de3bd',
  viewport: Object.freeze({ width: 390, height: 844 }),
  scrollY: 0,
  ownerStatement: 'All six pages look fine. I accept the existing minor chatbot-launcher overlaps identified in R5b. This approval applies only to the existing measured overlaps on these six pages and this candidate version. It does not authorize new or larger overlaps or unrelated layout problems.',
  acknowledgedAtUtc: '2026-10-29T17:42:44.2657988Z',
  routes: Object.freeze({
    '/calgary-to-ottawa-movers/': Object.freeze({
      defect: 'to intersects fixed chat launcher', overlapWidth: 41, overlapHeight: 2.6,
      toField: Object.freeze({ x: 35, y: 666.6, right: 344, bottom: 706.6 }),
      chatLauncher: Object.freeze({ x: 303, y: 704, right: 359, bottom: 760 }),
      screenshotSha256: 'a66caf27706d757a2c164ad138b9626a39deb312c55ad15b468cb1636b7ac2c1',
    }),
    '/calgary-to-winnipeg-movers/': Object.freeze({
      defect: 'to intersects fixed chat launcher', overlapWidth: 41, overlapHeight: 0.6,
      toField: Object.freeze({ x: 35, y: 664.6, right: 344, bottom: 704.6 }),
      chatLauncher: Object.freeze({ x: 303, y: 704, right: 359, bottom: 760 }),
      screenshotSha256: 'e090d0f12b2da51921976301fa64a89451379bad0868197b9cd47c6584213802',
    }),
    '/ottawa-to-calgary-movers/': Object.freeze({
      defect: 'to intersects fixed chat launcher', overlapWidth: 41, overlapHeight: 2.6,
      toField: Object.freeze({ x: 35, y: 666.6, right: 344, bottom: 706.6 }),
      chatLauncher: Object.freeze({ x: 303, y: 704, right: 359, bottom: 760 }),
      screenshotSha256: '2c26472fa122455455f1cf57de4e9a02d8fe7d5c1f20bc2e3d17ccff95200371',
    }),
    '/ottawa-to-toronto-movers/': Object.freeze({
      defect: 'to intersects fixed chat launcher', overlapWidth: 41, overlapHeight: 2.6,
      toField: Object.freeze({ x: 35, y: 666.6, right: 344, bottom: 706.6 }),
      chatLauncher: Object.freeze({ x: 303, y: 704, right: 359, bottom: 760 }),
      screenshotSha256: 'a19967af4cd4543b1b5512ea7137d46d67e8049e0a8810c0fbdfa854fbd75d5a',
    }),
    '/toronto-to-ottawa-movers/': Object.freeze({
      defect: 'to intersects fixed chat launcher', overlapWidth: 41, overlapHeight: 2.6,
      toField: Object.freeze({ x: 35, y: 666.6, right: 344, bottom: 706.6 }),
      chatLauncher: Object.freeze({ x: 303, y: 704, right: 359, bottom: 760 }),
      screenshotSha256: '35c8574d13b0c850c97f7237897029352b6ea77462116b122bd60648b035fc65',
    }),
    '/winnipeg-to-calgary-movers/': Object.freeze({
      defect: 'to intersects fixed chat launcher', overlapWidth: 41, overlapHeight: 0.6,
      toField: Object.freeze({ x: 35, y: 664.6, right: 344, bottom: 704.6 }),
      chatLauncher: Object.freeze({ x: 303, y: 704, right: 359, bottom: 760 }),
      screenshotSha256: 'd31f6f0f4c3ebbd7e9f2c56f706ab5e25a616617bbe7c7c5befdb87cca2ad576',
    }),
  }),
});

export const PRICING_DESKTOP_LAYOUT_CONDITION = Object.freeze({
  conditionId: 'pricing-66f53c94-montreal-edmonton-desktop-estimate-compression',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  previewOrigin: 'https://66f53c94-newpurely.edwardkita.workers.dev',
  route: '/montreal-to-edmonton-movers/',
  viewport: Object.freeze({ width: 1440, height: 900 }),
  scrollY: 0,
  defect: 'Narrow estimate form controls, clipped text, and wrapped action-button labels',
  screenshotSha256: '4027aa4b35c4c82358a05ab0bb7c50b7e33f861263ad8be64eaa29dcc1d3271f',
  geometry: Object.freeze({
    estimateForm: Object.freeze({ x: 813.5, y: 101, width: 410, height: 454.4 }),
    controls: Object.freeze({
      from: Object.freeze({ x: 813.5, y: 126, width: 64.5, height: 40 }),
      to: Object.freeze({ x: 890, y: 126, width: 123.5, height: 40 }),
      homeSize: Object.freeze({ x: 813.5, y: 203, width: 64.5, height: 40 }),
      moveDate: Object.freeze({ x: 890, y: 203, width: 123.5, height: 40 }),
      estimateSubmit: Object.freeze({ x: 1023.5, y: 111, width: 95.5, height: 132 }),
      phoneLink: Object.freeze({ x: 1128, y: 111, width: 95.5, height: 132 }),
    }),
  }),
  ownerStatement: 'I acknowledge only the existing narrow estimate form controls, clipped text, and wrapped action-button labels on /montreal-to-edmonton-movers/ at 1440 × 900 and scroll position 0 for pricing candidate 66f53c94-b431-4f60-b910-801109100952, compared with production v969. The controls accept input, but their visible text remains clipped or wrapped. This does not accept any other route, viewport, layout condition, or worsened obstruction.',
});

export const PRICING_CALGARY_WINNIPEG_DESKTOP_CONDITION = Object.freeze({
  conditionId: 'pricing-66f53c94-calgary-winnipeg-desktop-fixed-contact-toolbar',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  previewOrigin: 'https://66f53c94-newpurely.edwardkita.workers.dev',
  route: '/calgary-to-winnipeg-movers/',
  viewport: Object.freeze({ width: 1440, height: 900 }),
  scrollY: 0,
  defect: 'Existing fixed-position Get Estimate / Call toolbar at the bottom-left',
  ownerStatement: 'I have personally reviewed the Calgary → Winnipeg desktop screenshot. The estimate form, pricing information, headings, and navigation appear correctly displayed. I accept the visible fixed-position Get Estimate / Call toolbar at the bottom-left as an existing layout condition for this candidate. This acceptance requires automated confirmation that no essential controls are blocked, there is no horizontal overflow, and the candidate has no layout regression.',
});

export const PRICING_HOMEPAGE_DESKTOP_TOOLBAR_CONDITION = Object.freeze({
  conditionId: 'pricing-66f53c94-homepage-desktop-fixed-contact-toolbar-h1-overlap',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  previewOrigin: 'https://66f53c94-newpurely.edwardkita.workers.dev',
  route: '/',
  viewport: Object.freeze({ width: 1440, height: 900 }),
  scrollY: 0,
  defect: 'The fixed bottom-left Get Estimate / Call toolbar partly obscures the homepage H1 at the initial viewport',
  screenshotSha256: '773959699f90df52664183066c2c10560099f7f81e316852c23757eb670fea17',
  evidencePaths: Object.freeze({
    productionScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/homepage-toolbar-comparison-20261028/production-homepage-1440x900.png',
    candidateScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/homepage-toolbar-comparison-20261028/candidate-homepage-1440x900.png',
    comparisonRecord: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/homepage-toolbar-comparison-20261028/comparison.json',
  }),
  comparisonRecordSha256: 'e753a634dfa178bfdab0b696aa72da5d56fb39ae531b80516e3d2b527287fc05',
  toolbar: Object.freeze({ x: 18, y: 823.61, right: 198.08, bottom: 882, width: 180.08, height: 58.39 }),
  heading: Object.freeze({ x: 104.5, y: 844.83, right: 776.5, bottom: 1069.83, width: 672, height: 225 }),
  intersection: Object.freeze({ x: 104.5, y: 844.828125, right: 198.078125, bottom: 882 }),
  ownerStatement: 'I accept the existing homepage desktop toolbar overlap for this pricing candidate. Approval is limited to candidate 66f53c94-b431-4f60-b910-801109100952, route /, viewport 1440 × 900, scroll position 0, where the bottom-left Get Estimate / Call toolbar partly obscures the homepage H1. Production and candidate screenshots are pixel-identical with SHA-256 773959699f90df52664183066c2c10560099f7f81e316852c23757eb670fea17. The measured geometry matches, the homepage form controls work, and there is no horizontal overflow or browser error. Do not describe the H1 as fully visible.',
});

export const PRICING_LOCAL_DESKTOP_TOOLBAR_CONDITION = Object.freeze({
  conditionId: 'pricing-66f53c94-local-desktop-fixed-contact-toolbar-h1-overlap',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  previewOrigin: 'https://66f53c94-newpurely.edwardkita.workers.dev',
  route: '/local/',
  viewport: Object.freeze({ width: 1440, height: 900 }),
  scrollY: 0,
  defect: 'The fixed bottom-left Get Estimate / Call toolbar partly obscures the “Local Movers in Metro Vancouver” H1 by approximately 40.8 px',
  screenshotSha256: '6200d586d60481dd529a0817394b1b1e341d0986a8d51eaf6f4ab94852eedd26',
  evidencePaths: Object.freeze({
    productionScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/production-layout-compare-20261027/desktop-local-production.png',
    candidateScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/production-layout-compare-20261027/desktop-local-candidate.png',
    comparisonRecord: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/production-layout-compare-20261027/comparison.json',
    freshProductionScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/pricing-candidate-preview-20261028-final/local-production-desktop-ece4c4e66e74.png',
    freshCandidateScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/pricing-candidate-preview-20261028-final/local-candidate-desktop-ed8053cab684.png',
  }),
  comparisonRecordSha256: '48c565b1cee4b95d99be057c9a2b8e799db70bac2c8ceb27b00dbbf1dcf8a723',
  freshRenderComparison: Object.freeze({
    productionScreenshotSha256: '6200d586d60481dd529a0817394b1b1e341d0986a8d51eaf6f4ab94852eedd26',
    candidateScreenshotSha256: 'aca0ff90fbd0027d1066986f9edff93749d768849cd290c8a6580196a1b56a16',
    fullScreenshotIdentical: false,
    differingPixels: 59531,
    differingPixelBounds: Object.freeze({ x: 43, y: 53, right: 1321, bottom: 900 }),
    toolbarRegion: Object.freeze({ box: Object.freeze([18, 823, 199, 883]), differingPixels: 35 }),
    approvedOverlapRegion: Object.freeze({ box: Object.freeze([104, 823, 199, 865]), differingPixels: 12 }),
    verticalBandDifferenceCounts: Object.freeze([{ top: 0, bottom: 520, pixels: 3879 }, { top: 520, bottom: 760, pixels: 9408 }, { top: 760, bottom: 900, pixels: 46244 }]),
    unchangedImageAsset: Object.freeze({ url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/Trucks33and34_ff8dc052.jpg', etag: '"74ba4b15207920fbc93fd2a8bfa7421f"', contentLength: 257538 }),
  }),
  geometry: Object.freeze({
    toolbar: Object.freeze({ x: 18, y: 823.609375, right: 198.078125, bottom: 882, width: 180.078125, height: 58.390625 }),
    heading: Object.freeze({ x: 104.5, y: 768.421875, right: 692.5, bottom: 864.421875, width: 588, height: 96 }),
    intersection: Object.freeze({ x: 104.5, y: 823.609375, right: 198.078125, bottom: 864.421875, width: 93.578125, height: 40.8125 }),
  }),
  ownerStatement: 'I approve the existing /local/ desktop toolbar condition for candidate 66f53c94-b431-4f60-b910-801109100952 at 1440 × 900 and scroll position 0. The bottom-left Get Estimate / Call toolbar partly obscures the H1 by approximately 40.8 px. Production and candidate screenshots match exactly with SHA-256 6200D586D60481DD529A0817394B1B1E341D0986A8D51EAF6F4AB94852EEDD26. Form controls work and there is no horizontal overflow. This approval applies only to this route, viewport, and condition.',
});

export const PRICING_EDMONTON_MONTREAL_MOBILE_CONDITION = Object.freeze({
  conditionId: 'pricing-66f53c94-edmonton-montreal-mobile-continue-estimate-overlap',
  candidateVersionId: '66f53c94-b431-4f60-b910-801109100952',
  candidateManifestSha256: '9c67b984eb335a13d7c553e9d3b2117e0af8524aba83f9ec383dc90d422b3d93',
  releasePlanSha256: 'f7e5e1cfbdcc6726a585bc50c9155fe89f94d8fcc5fc8191e0c60a491c887416',
  productionVersion: 'b10af3f9-f94a-420f-8a33-8e3701d86186',
  previewOrigin: 'https://66f53c94-newpurely.edwardkita.workers.dev',
  route: '/edmonton-to-montreal-movers/',
  viewport: Object.freeze({ width: 390, height: 844 }),
  scrollY: 0,
  defects: Object.freeze([
    'continueEstimate intersects fixed sticky estimate bar',
    'continueEstimate intersects fixed chat launcher',
  ]),
  ownerStatement: 'I am satisfied with the existing mobile overlap on /edmonton-to-montreal-movers/ for pricing candidate 66f53c94-b431-4f60-b910-801109100952 at 390 × 844 and scroll position 0. This acknowledgment applies only to the fixed estimate bar and chat launcher overlap with the Continue Estimate button, supported by the specified paired screenshots, their individual SHA-256 hashes, matching geometry, verified form functionality, and pixel-identical overlap regions. The full screenshots differ and are not identical.',
  evidencePaths: Object.freeze({
    productionScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/edmonton-montreal-mobile-layout-comparison-20261028/production-viewport-390x844.png',
    candidateScreenshot: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/edmonton-montreal-mobile-layout-comparison-20261028/candidate-viewport-390x844.png',
    screenshotRecord: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/edmonton-montreal-mobile-layout-comparison-20261028/paired-screenshot-evidence-20261028.json',
    pixelComparisonRecord: 'C:/Users/HP/.codex/visualizations/2026/10/26/01a1794c-d6ea-73c3-9ef4-7536a94fa69b/edmonton-montreal-mobile-layout-comparison-20261028/overlap-pixel-comparison-20261028.json',
  }),
  pixelComparison: Object.freeze({
    productionScreenshotSha256: 'afe0b01f31023ff14d617d9aac18d7eaac0216b686cc87a0db86a11fd787434d',
    candidateScreenshotSha256: '5e8c08b33f3099ad74723584e5bcc7d3b8f6f8231fb95192b4c35d6436d9fa1c',
    screenshotRecordSha256: '993eca3d97b3b3b1e79c5a4c4de49f93a3450c499949d3cee243514ac20b5f5a',
    comparisonRecordSha256: '9de07d1fb49d23b2a74eb9f8be01d9a4d6552f93066efe39c1ddcca57e85ee1b1',
    fullScreenshotsIdentical: false,
    differingPixels: 1866,
    regions: Object.freeze([
      Object.freeze({ name: 'continue-estimate_under_fixed-bar', box: Object.freeze([37, 776, 342, 792]), pixelSha256: '282755719a76d35d7fbded0356a768eee85ff9a70d237d514bdb9a7045d9f15a' }),
      Object.freeze({ name: 'continue-estimate_under_chat-launcher', box: Object.freeze([295, 764, 342, 792]), pixelSha256: 'f242b1ae22e2612fed0c1a47f3e430b8bcf3bfb52b932cbeb30c7ee5b9af4c96' }),
      Object.freeze({ name: 'fixed-bar_under_chat-launcher', box: Object.freeze([295, 776, 351, 820]), pixelSha256: '15dd3438fd7ae9290975fb9f6746ca47e60fc5086df8b7687fb0cec0edd5523b' }),
    ]),
  }),
});

function validLayoutRect(rect) {
  return rect && ['x','y','right','bottom'].every(key => Number.isFinite(rect[key]))
    && rect.right > rect.x && rect.bottom > rect.y;
}
function layoutRectsIntersect(a,b) {
  return Math.min(a.right,b.right)>Math.max(a.x,b.x)
    && Math.min(a.bottom,b.bottom)>Math.max(a.y,b.y);
}
function sameLayoutGeometry(a,b) {
  const names=['fromField','toField','homeSize','moveDateField','estimateBar','chatLauncher'];
  return names.every(name => validLayoutRect(a?.[name])&&validLayoutRect(b?.[name])
    &&['x','y','right','bottom'].every(key=>a[name][key]===b[name][key]));
}
function sameLayoutRect(a,b) {
  return Boolean(a&&b&&['x','y','right','bottom'].every(key=>a[key]===b[key]));
}
export function validateAcceptedProductionEquivalentLayoutGroup({testRows,check,phase,plan,state,group}) {
  const e=PRICING_MOBILE_LAYOUT_GROUP, expectedRoutes=Object.keys(e.routes).sort();
  const failGroup=()=>fail('Candidate-bound production-equivalent layout condition group is incomplete, mismatched, or outside its approved scope');
  if(phase!=='preview'||check!=='mobile-layout'||state?.versionId!==e.candidateVersionId
      ||plan?.candidateManifestSha256!==e.candidateManifestSha256||plan?.releasePlanSha256!==e.releasePlanSha256
      ||plan?.productionVersion!==e.productionVersion||state?.previewUrl!==e.previewOrigin
      ||group?.conditionId!==e.conditionId||group?.candidateVersionId!==e.candidateVersionId
      ||group?.candidateManifestSha256!==e.candidateManifestSha256||group?.productionVersionId!==e.productionVersion
      ||group?.viewport?.width!==390||group?.viewport?.height!==844||group?.scrollY!==0
      ||group?.afterScrollScreenshotsAvailable!==false
      ||JSON.stringify([...(group?.routes??[])].sort())!==JSON.stringify(expectedRoutes)
      ||JSON.stringify(Object.keys(group?.conditions??{}).sort())!==JSON.stringify(expectedRoutes)) failGroup();
  const ack=group.ownerAcknowledgment;
  if(ack?.acknowledged!==true||ack?.source!=='explicit business-owner instruction'
      ||ack?.candidateVersionId!==e.candidateVersionId||JSON.stringify([...(ack?.routes??[])].sort())!==JSON.stringify(expectedRoutes)
      ||ack?.viewport?.width!==390||ack?.viewport?.height!==844||ack?.scrollY!==0
      ||ack?.statement!==e.ownerStatement||typeof ack?.acknowledgedAtUtc!=='string') fail('Exact 29-route production-equivalent layout owner acknowledgment is missing');
  fresh(ack.acknowledgedAtUtc,plan);
  const r5b=PRICING_R5B_SIX_ROUTE_DESTINATION_CHAT_CONDITION,r5bAck=group.r5bOwnerAcknowledgment;
  const r5bRoutes=Object.keys(r5b.routes).sort();
  if(r5bAck?.conditionId!==r5b.conditionId||r5bAck?.acknowledged!==true
      ||r5bAck?.source!=='explicit business-owner instruction'||r5bAck?.candidateVersionId!==r5b.candidateVersionId
      ||r5bAck?.candidateManifestSha256!==r5b.candidateManifestSha256||r5bAck?.productionVersionId!==r5b.productionVersion
      ||r5bAck?.sourceBrowserArtifactSha256!==r5b.sourceBrowserArtifactSha256
      ||r5bAck?.ownerApprovalRecordSha256!==r5b.ownerApprovalRecordSha256
      ||JSON.stringify([...(r5bAck?.routes??[])].sort())!==JSON.stringify(r5bRoutes)
      ||r5bAck?.viewport?.width!==390||r5bAck?.viewport?.height!==844||r5bAck?.scrollY!==0
      ||r5bAck?.statement!==r5b.ownerStatement||r5bAck?.acknowledgedAtUtc!==r5b.acknowledgedAtUtc)
    fail('Exact six-route R5b destination/chat owner acknowledgment is missing or outside its approved scope');
  fresh(r5bAck.acknowledgedAtUtc,plan);
  const accepted=new Set();
  for(const route of expectedRoutes){
    const rows=(testRows??[]).filter(t=>t.name==='mobile-layout'&&t.route===route);
    const test=rows[0],record=group.conditions[route],baseExpected=e.routes[route];
    const additional=route===PRICING_MONTREAL_EDMONTON_ADDITIONAL_MOBILE_CONDITION.route?PRICING_MONTREAL_EDMONTON_ADDITIONAL_MOBILE_CONDITION:null;
    const r5b=PRICING_R5B_SIX_ROUTE_DESTINATION_CHAT_CONDITION.routes[route]??null;
    const expected=[...baseExpected,...(additional?.defects??[]),...(r5b?[r5b.defect]:[])];
    if(rows.length!==1||test?.status!=='PASS'||test?.versionId!==e.candidateVersionId
        ||test?.candidateManifestSha256!==e.candidateManifestSha256||test?.viewport?.width!==390||test?.viewport?.height!==844
        ||test?.scrollY!==0||test?.titleVisible!==true||!Number.isFinite(test?.scrollWidth)||test.scrollWidth>392
        ||JSON.stringify([...(test?.blockingDefects??[])].sort())!==JSON.stringify([...expected].sort())
        ||record?.route!==route||record?.conditionId!==`${e.conditionId}:${route}`
        ||JSON.stringify([...(record?.blockingDefects??[])].sort())!==JSON.stringify([...expected].sort())
        ||record?.afterScrollScreenshotsAvailable!==false) failGroup();
    const production=record.production,candidate=record.candidate;
    if(production?.versionId!==e.productionVersion||production?.url!=='https://purelycanadianmovers.com'+route
        ||candidate?.versionId!==e.candidateVersionId||candidate?.manifestSha256!==e.candidateManifestSha256
        ||candidate?.url!==e.previewOrigin+route
        ||![production,candidate].every(s=>s.viewport?.width===390&&s.viewport?.height===844&&s.scrollY===0
          &&Number.isFinite(s.scrollWidth)&&s.scrollWidth<=392)
        ||!sameLayoutGeometry(production.geometry,candidate.geometry)
        ||!record.comparison?.candidateNoWorse||record.comparison?.result!=='MATCHED_NO_WORSE'
        ||production.screenshot?.sha256!==candidate.screenshot?.sha256
        ||!/^([a-f0-9]{64})$/i.test(production.screenshot?.sha256??'')
        ||!Array.isArray(test.evidenceFiles)
        ||![production.screenshot,candidate.screenshot].every(s=>s&&isAbsolute(s.path??'')
          &&test.evidenceFiles.some(ref=>ref.path===s.path&&ref.sha256===s.sha256))) failGroup();
    const defects=expected;
    for(const defect of defects){
      const [control, ...overlapTarget]=defect.split(' intersects fixed '), target=overlapTarget.join(' intersects fixed ');
      const controlKey={from:'fromField',to:'toField',homeSize:'homeSize',moveDate:'moveDateField'}[control],targetKey=target==='sticky estimate bar'?'estimateBar':'chatLauncher';
      if(!layoutRectsIntersect(candidate.geometry[controlKey],candidate.geometry[targetKey])
          ||!layoutRectsIntersect(production.geometry[controlKey],production.geometry[targetKey]))failGroup();
    }
    for(const side of [production,candidate]){
      const controls=side.usabilityAfterScroll;
      if(!Array.isArray(controls)||!['from','to','homeSize','moveDate'].every(name=>controls.some(c=>c.name===name&&c.enabled===true&&c.displayed===true&&c.centerHitControl===true)))failGroup();
      fresh(side.capturedAtUtc,plan);
    }
    if(record.comparison?.horizontalOverflowAbsent!==true||record.comparison?.controlsUsableInBoth!==true
        ||record.ownerAcknowledgment?.acknowledged!==true||record.ownerAcknowledgment?.candidateVersionId!==e.candidateVersionId
        ||JSON.stringify([...(record.ownerAcknowledgment?.routes??[])].sort())!==JSON.stringify(expectedRoutes))failGroup();
    if(additional){
      const extra=record.additionalOwnerAcknowledgment;
      if(extra?.conditionId!==additional.conditionId||extra?.acknowledged!==true
          ||extra?.source!=='explicit business-owner instruction'||extra?.candidateVersionId!==e.candidateVersionId
          ||extra?.candidateManifestSha256!==e.candidateManifestSha256||extra?.productionVersionId!==e.productionVersion
          ||extra?.route!==additional.route||extra?.viewport?.width!==390||extra?.viewport?.height!==844||extra?.scrollY!==0
          ||JSON.stringify([...(extra?.blockingDefects??[])].sort())!==JSON.stringify([...additional.defects].sort())
          ||extra?.screenshotSha256!==additional.screenshotSha256||extra?.statement!==additional.ownerStatement
          ||typeof extra?.acknowledgedAtUtc!=='string'
          ||production.screenshot?.sha256!==additional.screenshotSha256||candidate.screenshot?.sha256!==additional.screenshotSha256)
        fail('Montreal to Edmonton additional mobile overlap acceptance is missing or outside its approved scope');
      fresh(extra.acknowledgedAtUtc,plan);
    } else if(record.additionalOwnerAcknowledgment) fail('Unexpected route-specific mobile layout acknowledgment');
    if(r5b){
      const e=PRICING_R5B_SIX_ROUTE_DESTINATION_CHAT_CONDITION,extra=record.r5bOwnerAcknowledgment;
      const field=candidate.geometry.toField,launcher=candidate.geometry.chatLauncher;
      if(extra?.conditionId!==e.conditionId||extra?.acknowledged!==true
          ||extra?.source!=='explicit business-owner instruction'||extra?.candidateVersionId!==e.candidateVersionId
          ||extra?.candidateManifestSha256!==e.candidateManifestSha256||extra?.productionVersionId!==e.productionVersion
          ||extra?.sourceBrowserArtifactSha256!==e.sourceBrowserArtifactSha256
          ||extra?.ownerApprovalRecordSha256!==e.ownerApprovalRecordSha256||extra?.route!==route
          ||extra?.viewport?.width!==390||extra?.viewport?.height!==844||extra?.scrollY!==0
          ||JSON.stringify(extra?.blockingDefects)!==JSON.stringify([r5b.defect])||extra?.statement!==e.ownerStatement
          ||extra?.sourceScreenshotSha256!==r5b.screenshotSha256||extra?.acknowledgedAtUtc!==e.acknowledgedAtUtc
          ||!sameLayoutRect(field,r5b.toField)||!sameLayoutRect(candidate.geometry.fromField,production.geometry.fromField)
          ||!sameLayoutRect(candidate.geometry.homeSize,production.geometry.homeSize)
          ||!sameLayoutRect(candidate.geometry.moveDateField,production.geometry.moveDateField)
          ||!sameLayoutRect(launcher,r5b.chatLauncher)||!sameLayoutRect(production.geometry.toField,r5b.toField)
          ||!sameLayoutRect(production.geometry.chatLauncher,r5b.chatLauncher)
          ||!layoutRectsIntersect(field,launcher))
        fail('R5b six-route destination/chat overlap acknowledgment is missing or outside its exact measured scope');
      const measured=['from','to','homeSize','moveDate'].flatMap(control=>['sticky estimate bar','chat launcher']
        .filter(target=>layoutRectsIntersect(candidate.geometry[{from:'fromField',to:'toField',homeSize:'homeSize',moveDate:'moveDateField'}[control]],candidate.geometry[target==='sticky estimate bar'?'estimateBar':'chatLauncher']))
        .map(target=>`${control} intersects fixed ${target}`)).sort();
      if(JSON.stringify(measured)!==JSON.stringify([...expected].sort()))
        fail('R5b accepted route contains a new or unapproved mobile overlap');
      const overlapWidth=Math.min(field.right,launcher.right)-Math.max(field.x,launcher.x);
      const overlapHeight=Math.min(field.bottom,launcher.bottom)-Math.max(field.y,launcher.y);
      if(Math.abs(overlapWidth-r5b.overlapWidth)>0.01||Math.abs(overlapHeight-r5b.overlapHeight)>0.01)
        fail('R5b destination/chat overlap exceeds or differs from the owner-reviewed measurement');
      fresh(extra.acknowledgedAtUtc,plan);
    } else if(record.r5bOwnerAcknowledgment) fail('Unexpected R5b route-specific mobile layout acknowledgment');
    accepted.add(route);
  }
  return accepted;
}

export function validateAcceptedPricingDesktopLayoutCondition({testRows,check,phase,plan,state,condition}) {
  const e=PRICING_DESKTOP_LAYOUT_CONDITION;
  const failCondition=()=>fail('Candidate-bound Montreal-to-Edmonton desktop layout condition is incomplete, mismatched, or outside its approved scope');
  if(phase!=='preview'||check!=='desktop-layout'||state?.versionId!==e.candidateVersionId
      ||state?.previewUrl!==e.previewOrigin||plan?.candidateManifestSha256!==e.candidateManifestSha256
      ||plan?.releasePlanSha256!==e.releasePlanSha256||plan?.productionVersion!==e.productionVersion
      ||condition?.conditionId!==e.conditionId||condition?.candidateVersionId!==e.candidateVersionId
      ||condition?.candidateManifestSha256!==e.candidateManifestSha256||condition?.productionVersionId!==e.productionVersion
      ||condition?.route!==e.route||condition?.viewport?.width!==e.viewport.width||condition?.viewport?.height!==e.viewport.height
      ||condition?.scrollY!==e.scrollY||condition?.defect!==e.defect
      ||JSON.stringify(condition?.blockingDefects)!==JSON.stringify([e.defect])) failCondition();
  const rows=(testRows??[]).filter(t=>t.name==='desktop-layout'&&t.route===e.route);
  const test=rows[0],production=condition.production,candidate=condition.candidate;
  const validShot=s=>s&&isAbsolute(s.path??'')&&/^([a-f0-9]{64})$/i.test(s.sha256??'');
  const sameGeometry=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  if(rows.length!==1||test?.status!=='PASS'||test?.versionId!==e.candidateVersionId
      ||test?.candidateManifestSha256!==e.candidateManifestSha256||test?.viewport?.width!==1440||test?.viewport?.height!==900
      ||test?.scrollY!==0||JSON.stringify(test?.blockingDefects)!==JSON.stringify([e.defect])
      ||test?.visibleCondition!==e.defect
      ||production?.versionId!==e.productionVersion||production?.url!=='https://purelycanadianmovers.com'+e.route
      ||candidate?.versionId!==e.candidateVersionId||candidate?.manifestSha256!==e.candidateManifestSha256
      ||candidate?.url!==e.previewOrigin+e.route) failCondition();
  for(const side of [production,candidate]){
    if(side.viewport?.width!==1440||side.viewport?.height!==900||side.scrollY!==0
        ||side.horizontalOverflow!==false||side.controlInteraction?.allPassed!==true
        ||side.controlInteraction?.valuesAccepted!==true||side.controlInteraction?.messageSubmitted!==false
        ||!Array.isArray(side.controlInteraction?.hitTargets)||side.controlInteraction.hitTargets.length!==6
        ||!['from','to','homeSize','moveDate','submit','phoneLink'].every(name=>side.controlInteraction.hitTargets.some(t=>t.name===name&&t.hit===true&&t.enabled===true))
        ||!side.geometry?.estimateForm
        ||!side.geometry?.controls||side.visibleCondition!==e.defect
        ||!sameGeometry({estimateForm:side.geometry.estimateForm,controls:side.geometry.controls},e.geometry)
        ||!Number.isFinite(Date.parse(side.capturedAtUtc)))failCondition();
    fresh(side.capturedAtUtc,plan);
  }
  if(!validShot(production.screenshot)||!validShot(candidate.screenshot)
      ||production.screenshot.sha256!==candidate.screenshot.sha256
      ||production.screenshot.sha256!==e.screenshotSha256
      ||!sameGeometry(production.geometry,candidate.geometry)
      ||!Array.isArray(test.evidenceFiles)
      ||![production.screenshot,candidate.screenshot].every(s=>test.evidenceFiles.some(ref=>ref.path===s.path&&ref.sha256===s.sha256))
      ||!condition.comparison?.candidateNoWorse||condition.comparison?.result!=='MATCHED_NO_WORSE'
      ||condition.comparison?.exactGeometryMatch!==true||condition.comparison?.horizontalOverflowAbsent!==true
      ||condition.comparison?.controlsUsableInBoth!==true
      ||condition.ownerAcknowledgment?.acknowledged!==true
      ||condition.ownerAcknowledgment?.candidateVersionId!==e.candidateVersionId
      ||condition.ownerAcknowledgment?.statement!==e.ownerStatement
      ||!Number.isFinite(Date.parse(condition.ownerAcknowledgment?.acknowledgedAtUtc)))failCondition();
  fresh(condition.ownerAcknowledgment.acknowledgedAtUtc,plan);
  return new Set([e.route]);
}

export function validateAcceptedCalgaryWinnipegDesktopCondition({testRows,check,phase,plan,state,condition}) {
  const e=PRICING_CALGARY_WINNIPEG_DESKTOP_CONDITION;
  const failCondition=()=>fail('Candidate-bound Calgary-to-Winnipeg desktop toolbar condition is incomplete, mismatched, or outside its approved scope');
  if(phase!=='preview'||check!=='desktop-layout'||state?.versionId!==e.candidateVersionId
      ||state?.previewUrl!==e.previewOrigin||plan?.candidateManifestSha256!==e.candidateManifestSha256
      ||plan?.releasePlanSha256!==e.releasePlanSha256||plan?.productionVersion!==e.productionVersion
      ||condition?.conditionId!==e.conditionId||condition?.candidateVersionId!==e.candidateVersionId
      ||condition?.candidateManifestSha256!==e.candidateManifestSha256||condition?.productionVersionId!==e.productionVersion
      ||condition?.route!==e.route||condition?.viewport?.width!==e.viewport.width||condition?.viewport?.height!==e.viewport.height
      ||condition?.scrollY!==0||condition?.defect!==e.defect||JSON.stringify(condition?.blockingDefects)!==JSON.stringify([e.defect]))failCondition();
  const rows=(testRows??[]).filter(t=>t.name==='desktop-layout'&&t.route===e.route),test=rows[0];
  const production=condition.production,candidate=condition.candidate;
  const validShot=s=>s&&isAbsolute(s.path??'')&&/^([a-f0-9]{64})$/i.test(s.sha256??'');
  const same=a=>JSON.stringify(a);
  if(rows.length!==1||test?.status!=='PASS'||test?.versionId!==e.candidateVersionId
      ||test?.candidateManifestSha256!==e.candidateManifestSha256||test?.viewport?.width!==1440||test?.viewport?.height!==900
      ||test?.scrollY!==0||JSON.stringify(test?.blockingDefects)!==JSON.stringify([e.defect])
      ||test?.acceptedConditionId!==e.conditionId||!Array.isArray(test.evidenceFiles))failCondition();
  for(const [side,expectedVersion,expectedUrl] of [[production,e.productionVersion,'https://purelycanadianmovers.com'+e.route],[candidate,e.candidateVersionId,e.previewOrigin+e.route]]){
    if(side?.versionId!==expectedVersion||side?.url!==expectedUrl||side?.viewport?.width!==1440||side?.viewport?.height!==900||side?.scrollY!==0
        ||side?.horizontalOverflow!==false||side?.controlInteraction?.allPassed!==true||side?.controlInteraction?.valuesAccepted!==true
        ||side?.controlInteraction?.messageSubmitted!==false||!Array.isArray(side?.controlInteraction?.hitTargets)
        ||side.controlInteraction.hitTargets.length!==6||!['from','to','homeSize','moveDate','submit','phoneLink'].every(name=>side.controlInteraction.hitTargets.some(t=>t.name===name&&t.hit===true&&t.enabled===true))
        ||!Array.isArray(side?.usabilityAfterScroll)||!['homeSize','moveDate'].every(name=>side.usabilityAfterScroll.some(c=>c.name===name&&c.enabled===true&&c.displayed===true&&c.centerHitControl===true))
        ||!side.geometry?.estimateForm||!side.geometry?.controls||!Number.isFinite(Date.parse(side.capturedAtUtc))||!validShot(side.screenshot))failCondition();
    fresh(side.capturedAtUtc,plan);
    if(!test.evidenceFiles.some(ref=>ref.path===side.screenshot.path&&ref.sha256===side.screenshot.sha256))failCondition();
  }
  if(same(production.geometry)!==same(candidate.geometry)||!condition.comparison?.candidateNoWorse
      ||condition.comparison?.result!=='MATCHED_NO_WORSE'||condition.comparison?.exactGeometryMatch!==true
      ||condition.comparison?.horizontalOverflowAbsent!==true||condition.comparison?.controlsUsableInBoth!==true
      ||condition.ownerAcknowledgment?.acknowledged!==true||condition.ownerAcknowledgment?.candidateVersionId!==e.candidateVersionId
      ||condition.ownerAcknowledgment?.route!==e.route||condition.ownerAcknowledgment?.statement!==e.ownerStatement
      ||!Number.isFinite(Date.parse(condition.ownerAcknowledgment?.acknowledgedAtUtc)))failCondition();
  fresh(condition.ownerAcknowledgment.acknowledgedAtUtc,plan);
  return new Set([e.route]);
}

export function validateAcceptedHomepageDesktopToolbarCondition({testRows,check,phase,plan,state,condition}) {
  const e=PRICING_HOMEPAGE_DESKTOP_TOOLBAR_CONDITION;
  const failCondition=()=>fail('Candidate-bound homepage desktop toolbar/H1 condition is incomplete, mismatched, or outside its approved scope');
  if(phase!=='preview'||check!=='desktop-layout'||state?.versionId!==e.candidateVersionId||state?.previewUrl!==e.previewOrigin
      ||plan?.candidateManifestSha256!==e.candidateManifestSha256||plan?.releasePlanSha256!==e.releasePlanSha256
      ||plan?.productionVersion!==e.productionVersion||condition?.conditionId!==e.conditionId
      ||condition?.candidateVersionId!==e.candidateVersionId||condition?.candidateManifestSha256!==e.candidateManifestSha256
      ||condition?.productionVersionId!==e.productionVersion||condition?.route!==e.route
      ||condition?.viewport?.width!==1440||condition?.viewport?.height!==900||condition?.scrollY!==0
      ||condition?.defect!==e.defect||JSON.stringify(condition?.blockingDefects)!==JSON.stringify([e.defect]))failCondition();
  const rows=(testRows??[]).filter(t=>t.name==='desktop-layout'&&t.route==='/'),test=rows[0];
  const production=condition.production,candidate=condition.candidate;
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const screenshotRef=(side,path)=>side?.screenshot?.path===path&&side?.screenshot?.sha256===e.screenshotSha256;
  if(rows.length!==1||test?.status!=='PASS'||test?.versionId!==e.candidateVersionId
      ||test?.candidateManifestSha256!==e.candidateManifestSha256||test?.viewport?.width!==1440||test?.viewport?.height!==900
      ||test?.scrollY!==0||test?.visibleCondition!==e.defect||test?.acceptedConditionId!==e.conditionId
      ||JSON.stringify(test?.blockingDefects)!==JSON.stringify([e.defect])||!Array.isArray(test?.evidenceFiles))failCondition();
  for(const [side,version,url,path] of [[production,e.productionVersion,'https://purelycanadianmovers.com/',e.evidencePaths.productionScreenshot],
    [candidate,e.candidateVersionId,e.previewOrigin+'/',e.evidencePaths.candidateScreenshot]]){
    if(side?.versionId!==version||side?.url!==url||side?.responseStatus!==200
        ||side?.viewport?.width!==1440||side?.viewport?.height!==900||side?.scrollY!==0
        ||side?.scrollWidth!==1425||side?.horizontalOverflow!==false
        ||!same(side?.geometry?.toolbar,e.toolbar)||!same(side?.geometry?.heading,e.heading)
        ||!same(side?.geometry?.intersection,e.intersection)||side?.geometry?.headingPartlyObscured!==true
        ||side?.formInteraction?.accepted!==true||side?.formInteraction?.restored!==true
        ||side?.formInteraction?.noCustomerLeadOrEstimateSubmission!==true
        ||!Array.isArray(side?.errors)||side.errors.length!==0
        ||!screenshotRef(side,path)||!Number.isFinite(Date.parse(side?.capturedAtUtc)))failCondition();
    fresh(side.capturedAtUtc,plan);
    if(!test.evidenceFiles.some(ref=>ref.path===path&&ref.sha256===e.screenshotSha256)
        ||!test.evidenceFiles.some(ref=>ref.path===side.screenshot.path&&ref.sha256===side.screenshot.sha256))failCondition();
  }
  const comparison=condition.comparison;
  if(!same(production.geometry,candidate.geometry)||!comparison?.productionCandidateScreenshotsPixelIdentical
      ||comparison?.fullScreenshotSha256!==e.screenshotSha256||!comparison?.candidateNoWorse
      ||!comparison?.exactGeometryMatch||!comparison?.horizontalOverflowAbsent||!comparison?.formControlsWorked
      ||comparison?.headingFullyVisible!==false||!comparison?.partialH1ObstructionRecorded
      ||!condition.ownerAcknowledgment?.acknowledged||condition.ownerAcknowledgment?.source!=='explicit business-owner instruction'
      ||condition.ownerAcknowledgment?.candidateVersionId!==e.candidateVersionId||condition.ownerAcknowledgment?.route!=='/'
      ||condition.ownerAcknowledgment?.viewport?.width!==1440||condition.ownerAcknowledgment?.viewport?.height!==900
      ||condition.ownerAcknowledgment?.scrollY!==0||condition.ownerAcknowledgment?.statement!==e.ownerStatement
      ||!Number.isFinite(Date.parse(condition.ownerAcknowledgment?.acknowledgedAtUtc)))failCondition();
  if(!test.evidenceFiles.some(ref=>ref.path===e.evidencePaths.comparisonRecord&&ref.sha256===e.comparisonRecordSha256))failCondition();
  fresh(condition.ownerAcknowledgment.acknowledgedAtUtc,plan);
  return new Set(['/']);
}

export function validateAcceptedLocalDesktopToolbarCondition({testRows,check,phase,plan,state,condition}) {
  const e=PRICING_LOCAL_DESKTOP_TOOLBAR_CONDITION;
  const failCondition=(detail='')=>fail(`Candidate-bound /local/ desktop toolbar/H1 condition is incomplete, mismatched, or outside its approved scope${detail?`: ${detail}`:''}`);
  if(phase!=='preview'||check!=='desktop-layout'||state?.versionId!==e.candidateVersionId||state?.previewUrl!==e.previewOrigin
      ||plan?.candidateManifestSha256!==e.candidateManifestSha256||plan?.releasePlanSha256!==e.releasePlanSha256
      ||plan?.productionVersion!==e.productionVersion||condition?.conditionId!==e.conditionId
      ||condition?.candidateVersionId!==e.candidateVersionId||condition?.candidateManifestSha256!==e.candidateManifestSha256
      ||condition?.productionVersionId!==e.productionVersion||condition?.route!==e.route
      ||condition?.viewport?.width!==1440||condition?.viewport?.height!==900||condition?.scrollY!==0
      ||condition?.defect!==e.defect||JSON.stringify(condition?.blockingDefects)!==JSON.stringify([e.defect]))failCondition();
  const rows=(testRows??[]).filter(t=>t.name==='desktop-layout'&&t.route===e.route),test=rows[0];
  const validShot=s=>s&&isAbsolute(s.path??'')&&/^([a-f0-9]{64})$/i.test(s.sha256??'');
  if(rows.length!==1||test?.status!=='PASS'||test?.versionId!==e.candidateVersionId
      ||test?.candidateManifestSha256!==e.candidateManifestSha256||test?.viewport?.width!==1440||test?.viewport?.height!==900
      ||test?.scrollY!==0||test?.visibleCondition!==e.defect||test?.acceptedConditionId!==e.conditionId
      ||JSON.stringify(test?.blockingDefects)!==JSON.stringify([e.defect])||!Array.isArray(test?.evidenceFiles))failCondition();
  for(const [side,version,url,path] of [[condition.production,e.productionVersion,'https://purelycanadianmovers.com/local/',e.evidencePaths.productionScreenshot],
    [condition.candidate,e.candidateVersionId,e.previewOrigin+'/local/',e.evidencePaths.candidateScreenshot]]){
    if(side?.versionId!==version||side?.url!==url||side?.responseStatus!==200
        ||side?.viewport?.width!==1440||side?.viewport?.height!==900||side?.scrollY!==0
        ||side?.scrollWidth!==1425||side?.horizontalOverflow!==false
        ||JSON.stringify(side?.geometry)!==JSON.stringify(e.geometry)
        ||side?.headingText!=='Local Movers in Metro Vancouver'
        ||side?.formInteraction?.allPassed!==true||side?.formInteraction?.valuesAccepted!==true
        ||side?.formInteraction?.messageSubmitted!==false
        ||!Array.isArray(side?.usabilityAfterScroll)||!['homeSize','moveDate'].every(name=>side.usabilityAfterScroll.some(c=>c.name===name&&c.enabled&&c.displayed&&c.centerHitControl))
        ||!Number.isFinite(Date.parse(side?.capturedAtUtc))||!validShot(side?.screenshot))failCondition();
    fresh(side.capturedAtUtc,plan);
    if(!test.evidenceFiles.some(ref=>ref.path===path&&ref.sha256===e.screenshotSha256)
        ||!test.evidenceFiles.some(ref=>ref.path===side.screenshot.path&&ref.sha256===side.screenshot.sha256))failCondition();
  }
  const comparison=condition.comparison,render=e.freshRenderComparison;
  const requiredRenderRefs=[
    {path:e.evidencePaths.freshProductionScreenshot,sha256:render.productionScreenshotSha256},
    {path:e.evidencePaths.freshCandidateScreenshot,sha256:render.candidateScreenshotSha256},
  ];
  const renderRecord=comparison?.renderComparisonRecord;
  const renderRecordRef=renderRecord&&test.evidenceFiles.find(ref=>ref.path===renderRecord.path&&ref.sha256===renderRecord.sha256);
  const comparisonInvalid=JSON.stringify(condition.production.geometry)!==JSON.stringify(condition.candidate.geometry)
      ||!comparison?.candidateNoWorse||comparison?.exactGeometryMatch!==true
      ||comparison?.approvedScreenshotPairPixelIdentical!==true||comparison?.freshFullScreenshotsPixelIdentical!==false
      ||comparison?.freshDifferingPixels!==render.differingPixels||JSON.stringify(comparison?.freshDifferingPixelBounds)!==JSON.stringify(render.differingPixelBounds)
      ||comparison?.freshApprovedOverlapDifferingPixels!==render.approvedOverlapRegion.differingPixels
      ||!renderRecordRef||!isAbsolute(renderRecord.path??'')||!/^([a-f0-9]{64})$/i.test(renderRecord.sha256??'')
      ||requiredRenderRefs.some(required=>!condition.evidenceFiles.some(ref=>ref.path===required.path&&ref.sha256===required.sha256)
        ||!test.evidenceFiles.some(ref=>ref.path===required.path&&ref.sha256===required.sha256))
      ||comparison?.fullScreenshotSha256!==e.screenshotSha256
      ||comparison?.horizontalOverflowAbsent!==true||comparison?.controlsUsableInBoth!==true
      ||comparison?.h1PartlyObscured!==true||comparison?.h1FullyVisible!==false;
  if(comparisonInvalid
      ||condition.ownerAcknowledgment?.acknowledged!==true||condition.ownerAcknowledgment?.source!=='explicit business-owner instruction'
      ||condition.ownerAcknowledgment?.candidateVersionId!==e.candidateVersionId||condition.ownerAcknowledgment?.route!==e.route
      ||condition.ownerAcknowledgment?.viewport?.width!==1440||condition.ownerAcknowledgment?.viewport?.height!==900
      ||condition.ownerAcknowledgment?.scrollY!==0||condition.ownerAcknowledgment?.statement!==e.ownerStatement
      ||!Number.isFinite(Date.parse(condition.ownerAcknowledgment?.acknowledgedAtUtc)))failCondition(comparisonInvalid?'saved rendering comparison':'owner acknowledgment');
  if(!test.evidenceFiles.some(ref=>ref.path===e.evidencePaths.comparisonRecord&&ref.sha256===e.comparisonRecordSha256))failCondition();
  fresh(condition.ownerAcknowledgment.acknowledgedAtUtc,plan);
  return new Set([e.route]);
}

export function validateAcceptedEdmontonMontrealMobileCondition({testRows,check,phase,plan,state,condition}) {
  const e=PRICING_EDMONTON_MONTREAL_MOBILE_CONDITION, failCondition=()=>fail('Candidate-bound Edmonton-to-Montreal mobile overlap condition is incomplete, mismatched, or outside its approved scope');
  if(phase!=='preview'||check!=='mobile-layout'||state?.versionId!==e.candidateVersionId||state?.previewUrl!==e.previewOrigin
      ||plan?.candidateManifestSha256!==e.candidateManifestSha256||plan?.releasePlanSha256!==e.releasePlanSha256||plan?.productionVersion!==e.productionVersion
      ||condition?.conditionId!==e.conditionId||condition?.candidateVersionId!==e.candidateVersionId
      ||condition?.candidateManifestSha256!==e.candidateManifestSha256||condition?.productionVersionId!==e.productionVersion
      ||condition?.route!==e.route||condition?.viewport?.width!==390||condition?.viewport?.height!==844||condition?.scrollY!==0
      ||JSON.stringify(condition?.blockingDefects)!==JSON.stringify([...e.defects])) failCondition();
  const rows=(testRows??[]).filter(row=>row.name==='mobile-layout'&&row.route===e.route),test=rows[0];
  const validShot=(shot,expected)=>shot&&isAbsolute(shot.path??'')&&/^([a-f0-9]{64})$/i.test(shot.sha256??'')&&(expected===undefined||shot.sha256===expected);
  const expectedFiles=[e.pixelComparison.productionScreenshotSha256,e.pixelComparison.candidateScreenshotSha256,e.pixelComparison.screenshotRecordSha256,e.pixelComparison.comparisonRecordSha256];
  if(rows.length!==1||test?.status!=='PASS'||test?.versionId!==e.candidateVersionId||test?.candidateManifestSha256!==e.candidateManifestSha256
      ||test?.viewport?.width!==390||test?.viewport?.height!==844||test?.scrollY!==0||test?.scrollWidth>392
      ||JSON.stringify(test?.blockingDefects)!==JSON.stringify([...e.defects])||!Array.isArray(test.evidenceFiles)
      ||expectedFiles.some(sha256=>!test.evidenceFiles.some(ref=>ref.sha256===sha256))) failCondition();
  if(condition.ownerAcknowledgment?.acknowledged!==true||condition.ownerAcknowledgment?.source!=='explicit business-owner instruction'
      ||condition.ownerAcknowledgment?.candidateVersionId!==e.candidateVersionId||condition.ownerAcknowledgment?.route!==e.route
      ||condition.ownerAcknowledgment?.statement!==e.ownerStatement||condition.ownerAcknowledgment?.viewport?.width!==390
      ||condition.ownerAcknowledgment?.viewport?.height!==844||condition.ownerAcknowledgment?.scrollY!==0
      ||!Number.isFinite(Date.parse(condition.ownerAcknowledgment?.acknowledgedAtUtc))) failCondition();
  fresh(condition.ownerAcknowledgment.acknowledgedAtUtc,plan);
  const p=condition.pixelComparison,expected=e.pixelComparison;
  if(p?.fullScreenshotsIdentical!==false||p?.differingPixels!==1866||JSON.stringify(p?.regions)!==JSON.stringify(expected.regions)
      ||!Array.isArray(condition.evidenceFiles)
      ||![expected.productionScreenshotSha256,expected.candidateScreenshotSha256,expected.screenshotRecordSha256,expected.comparisonRecordSha256].every((sha256,index)=>
        condition.evidenceFiles.some(ref=>ref.sha256===sha256&&isAbsolute(ref.path??'')))) failCondition();
  const production=condition.production,candidate=condition.candidate;
  if(production?.versionId!==e.productionVersion||production?.url!=='https://purelycanadianmovers.com'+e.route
      ||candidate?.versionId!==e.candidateVersionId||candidate?.manifestSha256!==e.candidateManifestSha256||candidate?.url!==e.previewOrigin+e.route) failCondition();
  const requiredGeometry=['homeSize','moveDateField','estimateBar','chatLauncher'];
  const sameRect=(a,b)=>a&&b&&['x','y','right','bottom'].every(key=>Number.isFinite(a[key])&&a[key]===b[key]);
  const buttonRect=side=>{const b=side?.geometry?.controls?.estimateSubmit;return b&&{x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height};};
  const intersects=(a,b)=>a&&b&&Math.min(a.right,b.right)>Math.max(a.x,b.x)&&Math.min(a.bottom,b.bottom)>Math.max(a.y,b.y);
  for(const side of [production,candidate]){
    if(side.viewport?.width!==390||side.viewport?.height!==844||side.scrollY!==0||side.scrollWidth>392
        ||!Number.isFinite(Date.parse(side.capturedAtUtc))||!validShot(side.screenshot)
        ||!Array.isArray(side.usabilityAfterScroll)||!['homeSize','moveDate'].every(name=>side.usabilityAfterScroll.some(c=>c.name===name&&c.enabled===true&&c.displayed===true&&c.centerHitControl===true))) failCondition();
    fresh(side.capturedAtUtc,plan);
    for(const key of requiredGeometry)if(!side.geometry?.[key])failCondition();
    const b=buttonRect(side);
    if(!b||!intersects(b,side.geometry.estimateBar)||!intersects(b,side.geometry.chatLauncher))failCondition();
  }
  if(!requiredGeometry.every(key=>sameRect(production.geometry[key],candidate.geometry[key]))
      ||!['x','y','width','height'].every(key=>production.geometry.controls?.estimateSubmit?.[key]===candidate.geometry.controls?.estimateSubmit?.[key])
      ||!condition.comparison?.candidateNoWorse||condition.comparison?.result!=='MATCHED_NO_WORSE'
      ||condition.comparison?.exactGeometryMatch!==true||condition.comparison?.horizontalOverflowAbsent!==true
      ||condition.comparison?.controlsUsableInBoth!==true||condition.comparison?.overlapRegionsPixelIdentical!==true
      ||condition.comparison?.fullScreenshotsIdentical!==false||condition.comparison?.differingPixels!==1866)failCondition();
  if(!Array.isArray(test.evidenceFiles)||![production.screenshot,candidate.screenshot].every(shot=>test.evidenceFiles.some(ref=>ref.path===shot.path&&ref.sha256===shot.sha256)))failCondition();
  return new Set([e.route]);
}
async function evidenceFiles(refs,packageRoot){
  if(!Array.isArray(refs)||!refs.length)fail('Relevant browser/test evidence files are missing');
  for(const ref of refs){if(!isAbsolute(ref?.path??''))fail('Evidence file must have an absolute path');const rel=relative(resolve(packageRoot),resolve(ref.path));if(rel===''||(!rel.startsWith('..'+sep)&&rel!=='..'&&!isAbsolute(rel)))fail('Evidence files must be outside candidate');const st=await lstat(ref.path);if(!st.isFile()||st.isSymbolicLink())fail('Evidence must reference an ordinary file');if(hash(await readFile(ref.path))!==ref.sha256)fail('Relevant test evidence file hash mismatch');}
}
export function versionOrigin(url, version) {
  let u; try { u=new URL(url); } catch { fail('Missing exact-version preview URL'); }
  if (u.protocol!=='https:' || u.username || u.password || u.pathname!=='/' || u.search || u.hash || !u.hostname.startsWith(version.slice(0,8)+'-newpurely.') || !u.hostname.endsWith('.workers.dev')) fail('Preview URL does not identify the uploaded version');
  return u.origin;
}
export async function validateSmoke({ evidencePath, plan, state, phase, policyOverride, sourceOwners, expectedHomepageTitle }) {
  if(!['preview','production'].includes(phase))fail('Unknown smoke evidence phase');
  if (!isAbsolute(evidencePath??'')) fail('An explicit smoke evidence file is required');
  const inside = relative(resolve(plan.candidatePackage),resolve(evidencePath));
  if (inside==='' || (!inside.startsWith('..'+sep)&&inside!=='..'&&!isAbsolute(inside))) fail('Smoke evidence must be outside immutable package');
  const bytes=await readFile(evidencePath),doc=JSON.parse(bytes);
  const origin=phase==='preview'?versionOrigin(state.previewUrl,state.versionId):'https://purelycanadianmovers.com';
  if(doc.schema!=='pcm-release-smoke/v1'||doc.phase!==phase||doc.worker!=='newpurely'||doc.versionId!==state.versionId||doc.candidateManifestSha256!==plan.candidateManifestSha256||doc.origin!==origin) fail('Smoke evidence does not match the exact candidate and phase');
  fresh(doc.verifiedAtUtc,plan);
  if(!Array.isArray(doc.probes)||!Array.isArray(doc.checks)) fail('Required smoke evidence is missing');
  const failedSmokeChecks=doc.checks.filter(check=>check.status!=='PASS');
  const hasCostGuideOwnerReview=Boolean(doc.ownerAcceptedCostGuideMobileLayout);
  if(new Set(doc.probes.map(p=>p.path)).size!==doc.probes.length
      ||(failedSmokeChecks.length&&!(hasCostGuideOwnerReview&&failedSmokeChecks.length===1
        &&failedSmokeChecks[0].name==='browser'&&failedSmokeChecks[0].status==='FAIL')))
    fail('Smoke evidence contains contradictory or failed results');
  const manifest=JSON.parse(await readFile(plan.candidateManifestPath,'utf8'));
  const baseline=JSON.parse(await readFile(plan.baselinePath,'utf8'));
  const verifiedAssetDifferences=await validateApprovedChangeSet(plan,baseline,manifest);
  const policy=await deriveSmokePolicy(plan,sourceOwners??plan.workflow?.owners);
  if(policyOverride&&JSON.stringify(policyOverride)!==JSON.stringify(policy))fail('Supplied smoke policy differs from source-derived release policy');
  if(!Array.isArray(policy?.browserChecks)||!policy.browserChecks.length||policy.browserChecks.some(c=>!BROWSER_CHECKS.includes(c)&&!LOW_RISK_BROWSER_CHECKS.includes(c)))fail('Required browser-check policy is missing or invalid');
  const classification=policy.classification??'HIGH-RISK FUNCTIONAL';
  if(doc.riskClassification!==classification)fail('Smoke evidence risk classification does not match verified release policy');
  const independentStaticAdditionRoute=await verifiedIndependentStaticAddition(plan,sourceOwners??plan.workflow?.owners,verifiedAssetDifferences);
  const assignments=browserCheckAssignments(plan,policy,sourceOwners??plan.workflow?.owners,independentStaticAdditionRoute);
  if(classification==='LOW-RISK CONTENT'){
    const owners=sourceOwners??plan.workflow?.owners;
    if(!owners||!plan.baselinePath)fail('Low-risk classification lacks authoritative source ownership evidence');
    const baseline=JSON.parse(await readFile(plan.baselinePath,'utf8'));
    const changes=[];
    for(const c of plan.approvedChanges){
      const old=baseline.file_hashes.find(f=>f.path===c.path);if(!old)fail('Low-risk baseline asset evidence is incomplete');
      changes.push({path:c.path,beforeBytes:await readFile(resolve(baseline.package.root,c.path)),afterBytes:await readFile(resolve(plan.candidatePackage,c.path))});
    }
    const features=policy.checks.filter(c=>!['browser','http'].includes(c));
    const recomputed=classifyChangeRisk({changes,owners,features});
    if(recomputed.classification!=='LOW-RISK CONTENT'||JSON.stringify(recomputed)!==JSON.stringify(policy.riskAssessment)||policy.checks.some(c=>['estimate','chatbot','callback','email','submission'].includes(c))||JSON.stringify(policy.browserChecks)!==JSON.stringify(LOW_RISK_BROWSER_CHECKS))fail('Low-risk classification does not match verified asset differences and ownership');
  }else if(classification!=='HIGH-RISK FUNCTIONAL'||JSON.stringify(policy.browserChecks)!==JSON.stringify(BROWSER_CHECKS))fail('High-risk release must retain the complete browser test set');
  const probeFor = p => doc.probes.find(x=>x.path===p);
  const validateProbe = p => {
    const probe=probeFor(p);
    if(!probe||probe.status!==200||probe.url!==origin+p||probe.redirected!==false||probe.cloudflareAccessLogin===true||typeof probe.bodyBase64!=='string') fail('Preview/production probe failed or returned Cloudflare Access login');
    const body=Buffer.from(probe.bodyBase64,'base64');
    if(/cloudflareaccess\.com\/cdn-cgi\/access\/login|<title>[^<]*(?:Access|Sign in|Login)/i.test(body.toString())) fail('Cloudflare Access login is not candidate verification');
    if (phase === 'production') {
      const pathIsHtml = p.endsWith('/') || /\.html?$/i.test(p);
      const verified = verifyProductionHtml(body, probe.comparisonBodySha256, pathIsHtml);
      if (probe.bodySha256 !== verified.rawResponseSha256 || probe.rawResponseSha256 !== verified.rawResponseSha256 || probe.comparisonBodySha256 !== verified.comparisonSha256
          || probe.cloudflareInsightsBeaconApplied !== verified.cloudflareInsightsBeaconApplied) fail('Production HTTP evidence hashes or Cloudflare Insights normalization do not match the captured response');
    }
    return body;
  };
  for(const route of assignments.routes){
    const bytes=validateProbe(route),path=route==='/'?'site-copy/index.html':'site-copy'+route+(route.endsWith('/')?'index.html':'');
    const file=manifest.files.find(f=>f.path===path);if(file){const compared=phase==='production'?verifyProductionHtml(bytes,file.sha256,true).normalizedBytes:bytes;if(hash(compared)!==file.sha256)fail('Route response bytes do not match approved candidate');}
  }
  for(const c of plan.approvedChanges) {
    if(!c.path.startsWith('site-copy/')||c.path==='site-copy/_redirects') continue;
    const asset='/'+c.path.slice(10),file=manifest.files.find(f=>f.path===c.path);
    const bytes=validateProbe(asset),compared=phase==='production'&&/\.html?$/i.test(asset)?verifyProductionHtml(bytes,file?.sha256,true).normalizedBytes:bytes;
    if(!file||hash(compared)!==file.sha256) fail('Served asset bytes do not match the approved candidate');
  }
  const required=policy.checks;
  if(!Array.isArray(required)||!required.includes('browser')||!required.includes('http')) fail('Release must require HTTP and interactive browser evidence');
  let acceptedCostGuideMobileCondition=null, costGuideTitleRevalidated=false;
  for(const name of required) {
    const rows=doc.checks.filter(c=>c.name===name);
    if(rows.length!==1||(rows[0].status!=='PASS'&&!(name==='browser'&&hasCostGuideOwnerReview&&rows[0].status==='FAIL')))
      fail('Required smoke test missing or failed: '+name);
    if(name==='http') continue;
    const ref=rows[0].artifact;
    if(!isAbsolute(ref?.path??'')) fail('Required test artifact missing: '+name);
    const artifactBytes=await readFile(ref.path);
    if(hash(artifactBytes)!==ref.sha256) fail('Test artifact hash mismatch: '+name);
    const a=JSON.parse(artifactBytes);
    if(a.kind!==name||a.versionId!==state.versionId||a.candidateManifestSha256!==plan.candidateManifestSha256||a.origin!==origin||!Array.isArray(a.tests)||!a.tests.length)
      fail('Test artifact is incomplete or belongs to another candidate: '+name);
    if(a.status!=='PASS'||a.tests.some(t=>t.status!=='PASS')){
      const condition=doc.ownerAcceptedCostGuideMobileLayout;
      const failedRows=a.tests.filter(test=>test.status!=='PASS');
      const expectedFailedRows=phase==='production'?['mobile-layout']
        :condition.conditionId===COST_GUIDE_ALPHABETICAL_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId?['mobile-layout']:['mobile-layout','page-title'];
      if(name!=='browser'||!condition||a.status!=='FAIL'
          ||(phase==='preview'&&hash(artifactBytes)!==condition.sourceBrowserArtifactSha256)
          ||(phase==='production'&&condition.conditionId===COST_GUIDE_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId
            &&condition.sourceBrowserArtifactSha256!==COST_GUIDE_OWNER_ACCEPTED_MOBILE_LAYOUT.sourceBrowserArtifactSha256)
          ||(phase==='production'&&condition.conditionId===COST_GUIDE_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId
            &&condition.sourceBrowserArtifactSha256!==hash(artifactBytes))
          ||(phase==='production'&&condition.conditionId===COST_GUIDE_ALPHABETICAL_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId
            &&condition.sourceBrowserArtifactSha256!==hash(artifactBytes))
          ||JSON.stringify(failedRows.map(test=>test.name).sort())!==JSON.stringify(expectedFailedRows))
        fail('Test artifact is incomplete or belongs to another candidate: '+name);
      acceptedCostGuideMobileCondition=await validateCostGuideOwnerAcceptedMobileLayout({testRows:a.tests,phase,plan,state,
        conditionRef:condition,sourceBrowserArtifactSha256:hash(artifactBytes)});
    }
    if(name==='browser'&&hasCostGuideOwnerReview&&!acceptedCostGuideMobileCondition)
      fail('Cost Guide owner-accepted condition is not bound to the retained failed browser artifact');
    fresh(a.verifiedAtUtc,plan);
    if(!a.browserEnvironment?.browser||!a.browserEnvironment?.version||!a.browserEnvironment?.platform)fail('Browser/test environment is missing');
    await evidenceFiles(a.evidenceFiles,plan.candidatePackage);
    const acceptedLayoutRoutes=name==='browser'&&a.acceptedLayoutConditionGroup
      ? validateAcceptedProductionEquivalentLayoutGroup({testRows:a.tests,check:'mobile-layout',phase,plan,state,group:a.acceptedLayoutConditionGroup})
      : new Set();
    const acceptedDesktopLayoutRoutes=name==='browser'&&a.acceptedDesktopLayoutCondition
      ? validateAcceptedPricingDesktopLayoutCondition({testRows:a.tests,check:'desktop-layout',phase,plan,state,condition:a.acceptedDesktopLayoutCondition})
      : new Set();
    const acceptedCalgaryWinnipegDesktopRoutes=name==='browser'&&a.acceptedCalgaryWinnipegDesktopCondition
      ? validateAcceptedCalgaryWinnipegDesktopCondition({testRows:a.tests,check:'desktop-layout',phase,plan,state,condition:a.acceptedCalgaryWinnipegDesktopCondition})
      : new Set();
    const acceptedHomepageDesktopToolbarRoutes=name==='browser'&&a.acceptedHomepageDesktopToolbarCondition
      ? validateAcceptedHomepageDesktopToolbarCondition({testRows:a.tests,check:'desktop-layout',phase,plan,state,condition:a.acceptedHomepageDesktopToolbarCondition})
      : new Set();
    const acceptedLocalDesktopToolbarRoutes=name==='browser'&&a.acceptedLocalDesktopToolbarCondition
      ? validateAcceptedLocalDesktopToolbarCondition({testRows:a.tests,check:'desktop-layout',phase,plan,state,condition:a.acceptedLocalDesktopToolbarCondition})
      : new Set();
    const acceptedEdmontonMontrealMobileRoutes=name==='browser'&&a.acceptedEdmontonMontrealMobileCondition
      ? validateAcceptedEdmontonMontrealMobileCondition({testRows:a.tests,check:'mobile-layout',phase,plan,state,condition:a.acceptedEdmontonMontrealMobileCondition})
      : new Set();
    if(name==='browser'&&(!assignments.routes.every(r=>a.routes?.includes(r))||a.browserInteractionPerformed!==true)) fail('Browser interaction evidence is missing required routes');
    if(name==='browser')for(const route of assignments.routes){
      const checks=assignments.byRoute[route]??[];
      const expected=pageIdentity(validateProbe(route).toString());
      const expectedTitle=expectedPageTitle(route,expected.title,expectedHomepageTitle);
      if(checks.includes('page-title')&&(!expectedTitle||!expected.h1))fail('Required route title/H1 is missing in captured candidate HTML');
      for(const check of checks){
        const rows=a.tests.filter(t=>t.name===check&&t.route===route);if(rows.length!==1)fail('Required browser check missing or duplicated: '+check);
        const t=rows[0];
        const correctedCostGuideTitle=name==='browser'&&acceptedCostGuideMobileCondition&&check==='page-title'
          &&route==='/long-distance-moving-cost-canada/'&&t.status==='FAIL'&&t.passed===false
          &&t.expected==='Moving Cost Guide Canada | Purely Canadian Movers'
          &&t.actual===expectedTitle&&expectedTitle===APPROVED_COST_GUIDE_BROWSER_TITLE;
        const acceptedCostGuideOverflow=name==='browser'&&acceptedCostGuideMobileCondition&&check==='mobile-layout'
          &&route==='/long-distance-moving-cost-canada/'&&t.status==='FAIL';
        if((t.status!=='PASS'&&!correctedCostGuideTitle&&!acceptedCostGuideOverflow)||t.versionId!==state.versionId
            ||t.url!==origin+route||t.candidateManifestSha256!==plan.candidateManifestSha256)fail('Browser check failed or belongs to another candidate: '+check);
        if(correctedCostGuideTitle)costGuideTitleRevalidated=true;
        fresh(t.verifiedAtUtc,plan);await evidenceFiles(t.evidenceFiles,plan.candidatePackage);
        if(!t.browserEnvironment?.browser||!t.browserEnvironment?.version||!t.browserEnvironment?.platform)fail('Browser check environment is missing');
        if(check==='page-title'&&t.actual!==expectedTitle)fail('Browser page title differs from candidate HTML or explicit homepage title expectation');
        if(check==='page-h1'&&t.actual!==expected.h1)fail('Browser H1 differs from candidate HTML');
        if(check==='changed-content'){
          const expectedChange=policy.riskAssessment?.content;
          if(!expectedChange||t.changedContentObserved!==true)fail('Changed content was not observed');
          if(expectedChange.kind==='footer-link-added'&&(t.observedHref!==expectedChange.href||t.observedLabel!==expectedChange.label))fail('Changed link evidence differs from the approved content change');
          if(expectedChange.kind==='static-text-updated'){
            const expectedTexts=(expectedChange.changes??[expectedChange]).map(change=>change.after);
            const observedTexts=t.observedTexts??(t.observedText!==undefined?[t.observedText]:[]);
            if(JSON.stringify(observedTexts)!==JSON.stringify(expectedTexts))fail('Changed text evidence differs from the approved content change');
          }
        }
        if(check==='navigation'&&(t.navigationSucceeded!==true||!t.destinationUrl?.startsWith(origin+'/')))fail('Navigation evidence failed');
        if(check==='estimate-form'){
          if(t.interactionPerformed!==true)fail('Estimate interaction evidence missing');
          const baselineFormProfile=await acceptedBaselineEstimateFormProfile(route,baseline);
          validateEstimateValidationEvidence(route,t,{baselineFormProfile,origin});
          if(required.includes('submission')){
            if(t.getHandoffObserved!==true||!t.formValues?.from||!t.formValues?.to||!t.formValues?.homeSize||t.handoff?.method!=='GET'||t.handoff?.responseStatus!==200||t.handoff?.actionUrl!==origin+'/contact/'||t.handoff?.responseUrl!==t.handoff?.requestUrl)fail('Candidate estimate GET handoff evidence is missing or invalid');
            const submitted=new URL(t.handoff.requestUrl);
            if(submitted.origin!==origin||submitted.pathname!=='/contact/'||submitted.searchParams.get('from')!==t.formValues.from||submitted.searchParams.get('to')!==t.formValues.to||submitted.searchParams.get('homeSize')!==t.formValues.homeSize)fail('Estimate GET values differ from the observed form values');
            const slug=route.match(/\/([a-z-]+)-to-([a-z-]+)-movers\/$/i);
            if(route!=='/'&&(!slug||!t.formValues.from.toLowerCase().startsWith(slug[1].replaceAll('-',' '))||!t.formValues.to.toLowerCase().startsWith(slug[2].replaceAll('-',' '))))fail('Estimate form values do not match the required route direction');
          }
        }
        if(check==='chatbot-input'&&(t.opened!==true||t.textInputAccepted!==true))fail('Chatbot interaction evidence failed');
        if(check.endsWith('-layout')){
          if(!Array.isArray(t.blockingDefects)||!Number.isFinite(t.viewport?.height)||t.viewport.height<1||(check==='desktop-layout'?!(t.viewport.width>=1024):!(t.viewport.width>0&&t.viewport.width<=480)))fail('Desktop/mobile layout evidence failed');
          if(t.blockingDefects.length&&!(check==='mobile-layout'&&acceptedLayoutRoutes.has(route))
              &&!(check==='mobile-layout'&&acceptedCostGuideOverflow&&[COST_GUIDE_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId,COST_GUIDE_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId,COST_GUIDE_ALPHABETICAL_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId,COST_GUIDE_ALPHABETICAL_PRODUCTION_OWNER_ACCEPTED_MOBILE_LAYOUT.conditionId].includes(acceptedCostGuideMobileCondition))
              &&!(check==='mobile-layout'&&acceptedEdmontonMontrealMobileRoutes.has(route))
              &&!(check==='desktop-layout'&&acceptedDesktopLayoutRoutes.has(route))
              &&!(check==='desktop-layout'&&acceptedCalgaryWinnipegDesktopRoutes.has(route))
              &&!(check==='desktop-layout'&&acceptedHomepageDesktopToolbarRoutes.has(route))
              &&!(check==='desktop-layout'&&acceptedLocalDesktopToolbarRoutes.has(route)))fail('Desktop/mobile layout evidence failed');
        }
        if(check==='console-errors'&&(!Array.isArray(t.materialErrors)||t.materialErrors.length))fail('Material browser console errors remain');
      }
    }
    if(name==='browser')for(const route of assignments.newStaticRoutes){
      const htmlPath=`site-copy${route}index.html`,file=manifest.files.find(f=>f.path===htmlPath);
      if(!file)fail('Approved new static page is missing from the candidate manifest');
      for(const check of assignments.pageChecks){
        const rows=a.tests.filter(t=>t.name===check&&t.route===route);if(rows.length!==1)fail('Required new-page browser check missing or duplicated: '+check);
        const t=rows[0];if(t.status!=='PASS'||t.versionId!==state.versionId||t.url!==origin+route||t.candidateManifestSha256!==plan.candidateManifestSha256)fail('New-page browser check failed or belongs to another candidate: '+check);
        fresh(t.verifiedAtUtc,plan);await evidenceFiles(t.evidenceFiles,plan.candidatePackage);
        if(!t.browserEnvironment?.browser||!t.browserEnvironment?.version||!t.browserEnvironment?.platform)fail('New-page browser check environment is missing');
        if(check==='candidate-content'&&(t.actualSha256!==file.sha256||t.expectedSha256!==file.sha256))fail('New-page response does not match the exact approved candidate bytes');
        if(check==='illustration-rendered'&&(t.visible!==true||!Number.isFinite(t.width)||t.width<=0||!Number.isFinite(t.height)||t.height<=0||t.accessible!==true))fail('New-page illustration is missing, hidden, or inaccessible');
        if(check==='charity-link'&&(t.href!=='https://christmasbureau.com/'||t.visible!==true||t.target!=='_blank'||!t.rel?.includes('noopener')||!t.rel?.includes('noreferrer')))fail('New-page charity link does not match the approved destination');
      }
    }
    if(name==='submission'){
      if(a.requestSubmitted!==true||a.expectedResponseObserved!==true)fail('Submission behavior evidence is missing');
      const browserCheck=doc.checks.find(check=>check.name==='browser'),browserBytes=await readFile(browserCheck.artifact.path),browserArtifact=JSON.parse(browserBytes.toString('utf8'));
      for(const route of assignments.routes.filter(route=>assignments.byRoute[route]?.includes('estimate-form'))){
        const rows=a.tests.filter(t=>t.route===route&&t.name==='estimate-get-handoff');
        if(rows.length!==1||rows[0].status!=='PASS'||rows[0].method!=='GET'||rows[0].expectedResponseObserved!==true||rows[0].handoff?.responseStatus!==200)fail('Candidate estimate GET submission evidence is incomplete');
        const browserRows=browserArtifact.tests.filter(t=>t.route===route&&t.name==='estimate-form');
        if(browserRows.length!==1||JSON.stringify(rows[0].handoff)!==JSON.stringify(browserRows[0].handoff)||JSON.stringify(rows[0].formValues)!==JSON.stringify(browserRows[0].formValues))fail('Submission artifact differs from the candidate browser GET observation');
      }
    }
    if(['callback','email'].includes(name)){
      if(a.endToEndDeliveryConfirmed!==true||typeof a.deliveryReference!=='string'||!a.deliveryReference.trim())fail('End-to-end delivery has not been evidenced: '+name);
      fresh(a.deliveryConfirmedAtUtc,plan);await evidenceFiles(a.deliveryReceipts,plan.candidatePackage);
    }
    if(name!=='browser')for(const t of a.tests){
      if(t.versionId!==state.versionId||t.candidateManifestSha256!==plan.candidateManifestSha256||!t.url?.startsWith(origin+'/')||!t.browserEnvironment?.browser||!t.browserEnvironment?.version||!t.browserEnvironment?.platform)fail('Feature test evidence is missing candidate, URL or environment');
      fresh(t.verifiedAtUtc,plan);await evidenceFiles(t.evidenceFiles,plan.candidatePackage);
    }
  }
  return {status:acceptedCostGuideMobileCondition?'PASS_WITH_OWNER_ACCEPTED_CONDITIONS':'PASS',
    ...(acceptedCostGuideMobileCondition?{acceptedOwnerConditions:[acceptedCostGuideMobileCondition],revalidatedChecks:costGuideTitleRevalidated?['page-title']:[]} : {}),
    sha256:hash(bytes),evidencePath,phase,versionId:state.versionId,candidateManifestSha256:plan.candidateManifestSha256,origin,classification,checks:required,browserChecks:policy.browserChecks,verifiedAtUtc:doc.verifiedAtUtc};
}
export async function probeProductionBytes(plan,fetcher=fetch) {
  const manifest=JSON.parse(await readFile(plan.candidateManifestPath,'utf8'));
  const paths=[...new Set([...(plan.smokeRequirements.routes??[]),...plan.approvedChanges.filter(c=>c.path.startsWith('site-copy/')).map(c=>'/'+c.path.slice(10))])];
  const probes=[];
  for(const path of paths){
    const url='https://purelycanadianmovers.com'+path;
    const response=await fetcher(url,{redirect:'manual',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
    if(response.status!==200||response.redirected)fail('Required production HTTP probe failed: '+path);
    const bytes=Buffer.from(await response.arrayBuffer()),assetPath='site-copy'+path+(path.endsWith('/')?'index.html':''),record=manifest.files.find(f=>f.path===assetPath);
    let verified=null;
    if(record){const isHtml=/text\/html|application\/xhtml\+xml/i.test(response.headers.get('content-type')??'')||path.endsWith('/')||/\.html?$/i.test(path);verified=verifyProductionHtml(bytes,record.sha256,isHtml);}
    probes.push({path,status:response.status,sha256:hash(bytes),rawResponseSha256:hash(bytes),comparisonSha256:verified?.comparisonSha256??hash(bytes),cloudflareInsightsBeaconApplied:verified?.cloudflareInsightsBeaconApplied??false,matchesRecordedBytes:record?true:null});
  }
  return {status:'PASS',verifiedAtUtc:new Date().toISOString(),probes};
}
export async function recordPreviewSmoke({ releaseDir, evidencePath, policyOverride, sourceOwners, expectedHomepageTitle }) {
  const plan=JSON.parse(await readFile(resolve(releaseDir,'release-plan.json'),'utf8'));
  const {releasePlanSha256,...unsigned}=plan;
  if(hash(Buffer.from(JSON.stringify(unsigned,null,2)+'\n'))!==releasePlanSha256)fail('Release plan changed before smoke review');
  const statePath=resolve(releaseDir,'release-state.json'),state=JSON.parse(await readFile(statePath,'utf8'));
  const checked=await validateSmoke({evidencePath,plan,state,phase:'preview',policyOverride,sourceOwners,expectedHomepageTitle});
  const revised={...state,previewSmokeSha256:checked.sha256,previewSmokeEvidencePath:resolve(evidencePath),previewSmokeRiskClassification:checked.classification,previewSmokeRequiredChecks:checked.checks,...(expectedHomepageTitle?.trim()?{previewSmokeExpectedHomepageTitle:expectedHomepageTitle.trim()}:{})};
  const out=resolve(releaseDir,'release-state-preview.json');
  const previous=await readFile(out).catch(e=>{if(e.code!=='ENOENT')throw e;return null;});
  if(previous&&JSON.parse(previous).previewSmokeSha256===checked.sha256)return {...checked,promotionApprovalRequired:true,releaseStatePath:out,reused:true};
  if(previous){
    const archive=resolve(releaseDir,'release-state-preview-history-'+hash(previous)+'.json');
    await writeFile(archive,previous,{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});
    const pending=out+'.pending';await writeFile(pending,JSON.stringify(revised,null,2)+'\n',{flag:'wx'});await rename(pending,out);
  }else await writeFile(out,JSON.stringify(revised,null,2)+'\n',{flag:'wx'});
  return {...checked,promotionApprovalRequired:true,releaseStatePath:out};
}
