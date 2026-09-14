import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { aggregateRouteBuildOrder, routeWriterManifest } from "./route-writer-manifest.mjs";
import { routeOwnershipByUrl } from "./route-page-ownership.mjs";
import { validateRepository } from "./validate-route-page-ownership.mjs";

const args = process.argv.slice(2);
const root = resolve(args.find((arg) => !arg.startsWith("--")) ?? "site-copy");
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((arg) => arg.startsWith("--only="));
const onlyScript = onlyArg?.slice("--only=".length);
const buildOrder = onlyScript ? aggregateRouteBuildOrder.filter((script) => script === onlyScript) : aggregateRouteBuildOrder;
if (onlyScript && buildOrder.length === 0) throw new Error(`ERROR: ${onlyScript} is not part of the authoritative aggregate route build.`);

function validate(stage) {
  const { errors, inventory } = validateRepository(root);
  if (errors.length) throw new Error(`ERROR: ownership validation ${stage} failed:\n${errors.join("\n")}`);
  console.log(`Ownership validation ${stage}: ${inventory.length} routes, exactly one owner each.`);
}

function assertInputsExist(script) {
  const manifest = routeWriterManifest.find((entry) => entry.script === script);
  if (!manifest || manifest.mode !== "post-processor") return;
  for (const routeUrl of [...manifest.routes, ...(manifest.postProcessorRoutes ?? [])]) {
    const owner = routeOwnershipByUrl.get(routeUrl)?.owner;
    const page = join(root, routeUrl.slice(1), "index.html");
    if (!existsSync(page)) throw new Error(`ERROR: ${script} cannot run before owner ${owner}; missing ${page}.`);
  }
}

function run(script) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, [join("tools", script), root], { stdio: "inherit", shell: false });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolveRun() : reject(new Error(`ERROR: ${script} exited with code ${code}.`)));
  });
}

validate("before generation");
if (dryRun) {
  console.log("DRY RUN: no files will be written.");
  buildOrder.forEach((script, index) => console.log(`${index + 1}. ${script}`));
} else {
  for (const script of buildOrder) {
    assertInputsExist(script);
    console.log(`Running ${basename(script)}...`);
    await run(script);
  }
  validate("after generation");
}
