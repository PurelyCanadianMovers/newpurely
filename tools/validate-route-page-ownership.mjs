import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename, join, resolve } from "node:path";
import { checkedInStaticSource, routePageOwnership } from "./route-page-ownership.mjs";
import { aggregateRouteBuildOrder, routeWriterManifest } from "./route-writer-manifest.mjs";

export function validateOwnershipModel(entries, writers, inventory = entries.map((entry) => entry.routeUrl)) {
  const errors = [];
  const owners = new Map();
  for (const entry of entries) {
    if (owners.has(entry.routeUrl)) errors.push(`${entry.routeUrl} has more than one full-page owner: ${owners.get(entry.routeUrl)} and ${entry.owner}.`);
    else owners.set(entry.routeUrl, entry.owner);
  }
  for (const routeUrl of inventory) if (!owners.has(routeUrl)) errors.push(`${routeUrl} has no declared full-page owner.`);
  for (const routeUrl of owners.keys()) if (!inventory.includes(routeUrl)) errors.push(`${routeUrl} is registered but is not in the 56-route inventory.`);

  for (const writer of writers.filter((item) => item.mode === "authoritative")) {
    for (const routeUrl of writer.routes) {
      const owner = owners.get(routeUrl);
      if (owner !== writer.script) errors.push(`${routeUrl} is owned by ${owner ?? "nobody"} but ${writer.script} also attempts full-page output.`);
    }
  }
  for (const entry of entries.filter((item) => item.ownerType !== "checked-in-static-source")) {
    const writer = writers.find((item) => item.script === entry.owner && item.mode === "authoritative");
    if (!writer?.routes.includes(entry.routeUrl)) errors.push(`${entry.owner} owns ${entry.routeUrl} but does not declare that full-page output.`);
  }
  return errors;
}

export function routeInventory(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*-to-[a-z0-9]+(?:-[a-z0-9]+)*-movers$/.test(entry.name))
    .map((entry) => `/${entry.name}/`)
    .sort();
}

export function validateRouteArchitecture(entry, html) {
  const errors = [];
  const exceptions = new Set(entry.architectureExceptions ?? []);
  const hasReactBootstrap = /<script\b[^>]*type=["']module["'][^>]*>/i.test(html);
  const hasStaticNav = /<script\b[^>]*src=["'][^"']*static-nav\.js["'][^>]*>/i.test(html);
  const hasStaticChat = /<script\b[^>]*src=["'][^"']*static-chat\.js["'][^>]*>/i.test(html);
  const declaresStaticNav = entry.runtimeEnhancers.includes("site-copy/assets/static-nav.js");
  const declaresStaticChat = entry.runtimeEnhancers.includes("site-copy/assets/static-chat.js");

  if (entry.rendering === "react-spa") {
    if (!hasReactBootstrap && !exceptions.has("missing-react-bootstrap")) errors.push(`${entry.routeUrl} is declared react-spa but has no module bootstrap.`);
    if ((hasStaticNav || hasStaticChat || declaresStaticNav || declaresStaticChat) && !exceptions.has("static-nav-chat-on-react")) {
      errors.push(`${entry.routeUrl} is declared react-spa but substitutes static navigation/chat runtime.`);
    }
  } else if (entry.rendering === "static" && hasReactBootstrap && !exceptions.has("module-bootstrap-on-static")) {
    errors.push(`${entry.routeUrl} is declared static but contains a module bootstrap.`);
  }

  if (declaresStaticNav && !hasStaticNav) errors.push(`${entry.routeUrl} declares static-nav.js but its markup is absent.`);
  if (declaresStaticChat && !hasStaticChat) errors.push(`${entry.routeUrl} declares static-chat.js but its markup is absent.`);
  return errors;
}

export function validateRepository(root = "site-copy") {
  const resolvedRoot = resolve(root);
  const inventory = routeInventory(resolvedRoot);
  const errors = validateOwnershipModel(routePageOwnership, routeWriterManifest, inventory);
  if (inventory.length !== 56) errors.push(`Expected 56 route directories, found ${inventory.length}.`);
  for (const entry of routePageOwnership) {
    const routeFile = join(resolvedRoot, entry.routeUrl.slice(1), "index.html");
    if (!existsSync(routeFile)) errors.push(`${entry.routeUrl} owner input/output page is missing.`);
    else errors.push(...validateRouteArchitecture(entry, readFileSync(routeFile, "utf8")));
    if (entry.owner !== checkedInStaticSource && !existsSync(join("tools", entry.owner))) errors.push(`Owner script is missing: tools/${entry.owner}.`);
    for (const postProcessor of entry.postProcessors) if (!existsSync(join("tools", postProcessor))) errors.push(`Post-processor is missing: tools/${postProcessor}.`);
    for (const dependency of [...entry.runtimeEnhancers, ...entry.runtimeStyles]) {
      if (!existsSync(dependency)) errors.push(`${entry.routeUrl} runtime dependency is missing: ${dependency}.`);
    }
  }
  for (const script of aggregateRouteBuildOrder) if (!existsSync(join("tools", script))) errors.push(`Aggregate route build script is missing: tools/${script}.`);
  for (const writer of routeWriterManifest.filter((item) => item.mode === "post-processor")) {
    for (const routeUrl of writer.routes) {
      const entry = routePageOwnership.find((item) => item.routeUrl === routeUrl);
      if (!entry?.postProcessors.includes(writer.script)) errors.push(`${writer.script} is not registered as an allowed post-processor for ${routeUrl}.`);
      const ownerIndex = aggregateRouteBuildOrder.indexOf(entry?.owner);
      const writerIndex = aggregateRouteBuildOrder.indexOf(writer.script);
      if (writer.runsInRoutes && entry?.owner !== checkedInStaticSource && (ownerIndex < 0 || writerIndex <= ownerIndex)) {
        errors.push(`${writer.script} must run after owner ${entry?.owner} for ${routeUrl}.`);
      }
    }
  }
  for (const writer of routeWriterManifest.filter((item) => item.postProcessorRoutes)) {
    for (const routeUrl of writer.postProcessorRoutes) {
      const entry = routePageOwnership.find((item) => item.routeUrl === routeUrl);
      if (!entry?.postProcessors.includes(writer.script)) errors.push(`${writer.script} is not registered as an allowed post-processor for ${routeUrl}.`);
    }
  }
  for (const entry of routePageOwnership.filter((item) => item.ownerType !== "checked-in-static-source")) {
    if (!aggregateRouteBuildOrder.includes(entry.owner)) errors.push(`Aggregate route build omits owner ${entry.owner} for ${entry.routeUrl}.`);
  }
  return { errors, inventory };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const root = process.argv[2] ?? "site-copy";
  const { errors, inventory } = validateRepository(root);
  if (errors.length) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${inventory.length} route pages have exactly one declared full-page owner; aggregate claims are collision-free.`);
  }
}
