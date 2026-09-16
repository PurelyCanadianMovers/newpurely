import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const projectRoot = resolve(process.argv[2] ?? ".");
const output = resolve(process.argv[3] ?? "STEP_02_GENERATOR_DURABILITY.json");
const slugs = ["calgary-to-vancouver-movers", "vancouver-to-calgary-movers"];

async function hash(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function targetHashes(root) {
  return Object.fromEntries(await Promise.all(slugs.map(async (slug) => [slug, await hash(join(root, "site-copy", slug, "index.html"))])));
}

function run(cwd, script, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, [script, ...args], { cwd, stdio: ["ignore", "ignore", "pipe"], shell: false });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolveRun() : reject(new Error(`${script} exited ${code}: ${stderr}`)));
  });
}

const directScript = join(projectRoot, "tools", "rebuild-calgary-vancouver-static-routes.mjs");
await run(projectRoot, directScript, [join(projectRoot, "site-copy")]);
const directFirst = await targetHashes(projectRoot);
await run(projectRoot, directScript, [join(projectRoot, "site-copy")]);
const directSecond = await targetHashes(projectRoot);

const isolatedRoot = await mkdtemp(join(tmpdir(), "pcm-step02-aggregate-"));
let aggregateFirst;
let aggregateSecond;
try {
  await cp(join(projectRoot, "tools"), join(isolatedRoot, "tools"), { recursive: true });
  await cp(join(projectRoot, "site-copy"), join(isolatedRoot, "site-copy"), { recursive: true });
  await cp(join(projectRoot, "package.json"), join(isolatedRoot, "package.json"));
  const aggregateScript = join(isolatedRoot, "tools", "run-owned-route-build.mjs");
  await run(isolatedRoot, aggregateScript, [join(isolatedRoot, "site-copy")]);
  aggregateFirst = await targetHashes(isolatedRoot);
  await run(isolatedRoot, aggregateScript, [join(isolatedRoot, "site-copy")]);
  aggregateSecond = await targetHashes(isolatedRoot);
} finally {
  await rm(isolatedRoot, { recursive: true, force: true });
}

const directIdempotent = JSON.stringify(directFirst) === JSON.stringify(directSecond);
const aggregateIdempotent = JSON.stringify(aggregateFirst) === JSON.stringify(aggregateSecond);
const aggregateMatchesOwner = JSON.stringify(directSecond) === JSON.stringify(aggregateSecond);
const report = { generatedAt: new Date().toISOString(), directFirst, directSecond, aggregateFirst, aggregateSecond, directIdempotent, aggregateIdempotent, aggregateMatchesOwner };
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Direct owner: ${directIdempotent ? "PASS" : "FAIL"}`);
console.log(`Aggregate second pass: ${aggregateIdempotent ? "PASS" : "FAIL"}`);
console.log(`Aggregate preserves owner output: ${aggregateMatchesOwner ? "PASS" : "FAIL"}`);
process.exitCode = directIdempotent && aggregateIdempotent && aggregateMatchesOwner ? 0 : 1;
