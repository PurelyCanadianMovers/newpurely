import {readFile,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const sha=b=>createHash('sha256').update(b).digest('hex');
const fail=s=>{throw Error(s);};
export const accountPattern=/^[a-f0-9]{32}$/;
export async function readAccountBinding(){
  const configPath=fileURLToPath(new URL('./deployment-account.json',import.meta.url));
  const st=await lstat(configPath);if(!st.isFile()||st.isSymbolicLink())fail('Ordinary account configuration required');
  const bytes=await readFile(configPath),config=JSON.parse(bytes);
  if(config.schema!=='pcm-deployment-account/v1'||config.worker!=='newpurely'||!accountPattern.test(config.accountId??''))fail('Invalid controlled account configuration');
  return {id:config.accountId,configPath,configSha256:sha(bytes)};
}
export function validateAccountEnvironment(accountId,env=process.env,args=[]){
  if(!accountPattern.test(accountId??''))fail('Explicit reviewed account binding required; prepare a new plan');
  for(const [raw,value] of Object.entries(env)){const key=raw.toUpperCase();
    if(['CLOUDFLARE_ACCOUNT_ID','CF_ACCOUNT_ID'].includes(key)&&value&&value!==accountId)fail('Conflicting account environment override: '+key);
    if(['CLOUDFLARE_ENV','WRANGLER_ENV','WRANGLER_CONFIG','CLOUDFLARE_API_BASE_URL','CF_API_BASE_URL'].includes(key)&&value)fail('Unsupported deployment environment override: '+key);
  }
  if(args.some(a=>/^(?:--(?:account|account-id|account_id|env|environment)(?:=|$)|-e(?:=|$))/.test(a)))fail('Account/environment command-line overrides are forbidden');
}
export async function validatePlanAccount(plan,configText,env=process.env){
  const current=await readAccountBinding();
  if(!plan.account||JSON.stringify(current)!==JSON.stringify(plan.account))fail('Account configuration differs from reviewed plan; prepare a new plan');
  validateAccountEnvironment(plan.account.id,env);
  for(const match of configText.matchAll(/^\s*account_id\s*=\s*["']([^"']+)["']/gm))if(match[1]!==plan.account.id)fail('Worker configuration account conflicts with reviewed account');
  // Unsupported expressions must not silently escape the identity check.
  if((configText.match(/^\s*account_id\s*=/gm)??[]).length!==[...configText.matchAll(/^\s*account_id\s*=\s*["'][^"']+["']/gm)].length)fail('Unsupported Worker account configuration');
}
export function validateAccountEvidence(evidence,accountId,versionId){
  validateAccountEnvironment(accountId,{});
  const prefix='https://api.cloudflare.com/client/v4/accounts/'+accountId+'/workers/scripts/newpurely/';
  const relevant=evidence?.api_evidence??[];
  const version=relevant.find(e=>e.endpoint===prefix+'versions/'+versionId);
  const deployment=relevant.find(e=>e.endpoint?.startsWith(prefix+'deployments'));
  const age=Date.now()-Date.parse(evidence?.verified_at_utc);
  if(evidence?.worker!=='newpurely'||evidence.observed_version_id!==versionId||evidence.observed_production_allocations?.length!==1||evidence.observed_production_allocations[0].version_id?.value!==versionId||evidence.observed_production_allocations[0].percentage?.value!==100||![version,deployment].every(e=>e?.http_status===200&&e.success===true)||version.result?.id?.value!==versionId||relevant.some(e=>!e.endpoint?.startsWith(prefix))||!Number.isFinite(age)||age< -60000||age>300000)fail('Authenticated evidence does not match reviewed account, Worker, production version and traffic');
  return {accountId,worker:'newpurely',versionId,traffic:100,verifiedAtUtc:evidence.verified_at_utc};
}
