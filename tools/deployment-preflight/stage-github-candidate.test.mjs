import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { decryptCandidateBundle, encryptCandidateBundle, unpackCandidateBundle } from './stage-github-candidate.mjs';

const sha=(bytes)=>createHash('sha256').update(bytes).digest('hex');
const payload=Buffer.from('synthetic encrypted deployment evidence');
const candidateRows=[['wrangler.toml',payload],['worker/index.mjs',Buffer.from('worker')],['site-copy/_redirects',Buffer.from('redirects')]].map(([path,bytes])=>({path,bytes:bytes.length,sha256:sha(bytes)})).sort((a,b)=>a.path.localeCompare(b.path,'en'));
const manifestSha=sha(Buffer.from(`${JSON.stringify({schema:'pcm-release-candidate-manifest/v1',files:candidateRows},null,2)}\n`));
const bundleFiles=[
  ...[['candidate/wrangler.toml',payload],['candidate/worker/index.mjs',Buffer.from('worker')],['candidate/site-copy/_redirects',Buffer.from('redirects')],['release/release-plan.json',Buffer.from('plan')],['release/baseline.json',Buffer.from('baseline')]].map(([path,bytes])=>({path,bytes:bytes.length,sha256:sha(bytes),contentBase64:bytes.toString('base64')})),
];
const archive=gzipSync(Buffer.from(JSON.stringify({schema:'pcm-github-candidate-bundle/v1',releasePlanSha256:'a'.repeat(64),candidateManifestSha256:manifestSha,files:bundleFiles},null,2)+'\n'));

test('candidate package encryption round-trips with integrity checks and only extracts the fixed namespace',async t=>{
  // Ephemeral test-only keypair. Production staging requires an owner-provisioned public key.
  const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048,publicKeyEncoding:{type:'spki',format:'pem'},privateKeyEncoding:{type:'pkcs8',format:'pem'}});
  const encrypted=encryptCandidateBundle(archive,publicKey);
  const descriptor={payloadChunks:encrypted.chunks.length,ciphertextSha256:encrypted.ciphertextSha256,plaintextSha256:encrypted.plaintextSha256,wrappedKey:encrypted.wrappedKey,nonce:encrypted.nonce,tag:encrypted.tag};
  const plain=decryptCandidateBundle({chunks:encrypted.chunks.map(x=>x.bytes),descriptor,privateKeyPem:privateKey});assert.deepEqual(plain,archive);
  const root=await mkdtemp(join(tmpdir(),'pcm-stage-unpack-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const result=await unpackCandidateBundle(plain,join(root,'candidate'));assert.equal(result.fileCount,5);
  assert.deepEqual(await readFile(join(root,'candidate','candidate','wrangler.toml')),payload);
  const corrupt={...descriptor,ciphertextSha256:'0'.repeat(64)};
  assert.throws(()=>decryptCandidateBundle({chunks:encrypted.chunks.map(x=>x.bytes),descriptor:corrupt,privateKeyPem:privateKey}),/bytes changed/);
});

test('candidate decryption and extraction reject tampered and path-traversal payloads',async t=>{
  const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048,publicKeyEncoding:{type:'spki',format:'pem'},privateKeyEncoding:{type:'pkcs8',format:'pem'}});
  const encrypted=encryptCandidateBundle(archive,publicKey);const descriptor={payloadChunks:encrypted.chunks.length,ciphertextSha256:encrypted.ciphertextSha256,plaintextSha256:encrypted.plaintextSha256,wrappedKey:encrypted.wrappedKey,nonce:encrypted.nonce,tag:encrypted.tag};
  const corrupted=Buffer.from(encrypted.chunks[0].bytes);corrupted[0]^=1;
  assert.throws(()=>decryptCandidateBundle({chunks:[corrupted],descriptor,privateKeyPem:privateKey}),/changed|authentication/);
  const bad=gzipSync(Buffer.from(JSON.stringify({schema:'pcm-github-candidate-bundle/v1',files:[{path:'candidate/../../escape',bytes:0,sha256:sha(Buffer.alloc(0)),contentBase64:''}]})));
  const root=await mkdtemp(join(tmpdir(),'pcm-stage-bad-'));t.after(()=>rm(root,{recursive:true,force:true}));
  await assert.rejects(unpackCandidateBundle(bad,join(root,'candidate')),/unsafe or duplicate path/);
});
