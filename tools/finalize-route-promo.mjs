import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { routePageOwnership } from "./route-page-ownership.mjs";

export const ROUTE_PROMO_HEADING = "Online estimate bonus: save at least $100";
export const ROUTE_PROMO_DEADLINE = "Book before September 30, 2026";
export const ROUTE_PROMO_SUPPORT = "Complete an online estimate and book your move with Purely Canadian Movers. Discount confirmed with your written estimate.";
export const ROUTE_PROMO_MARKUP = `<div class="pcm-estimate-bonus"><span class="pcm-estimate-bonus__icon" aria-hidden="true">$</span><div><strong>${ROUTE_PROMO_HEADING}</strong><span class="pcm-estimate-bonus__deadline">${ROUTE_PROMO_DEADLINE}</span><span>${ROUTE_PROMO_SUPPORT}</span></div></div>`;

const PROMO_BLOCK_RE = /<div class="pcm-estimate-bonus">[\s\S]*?<\/div><\/div>/gi;
const ESTIMATE_FORM_RE = /<form\b[^>]*(?:pcm-estimate|pcm-lead-panel|pcm-estimate-form)[^>]*>[\s\S]*?<\/form>/gi;
const VERIFIED_DETAILS_RE = /<div class="(?:pcm-verified-details|pcm-estimate-trust-note)"/i;

export function restoreRoutePromo(html, routeUrl = "route") {
  const forms = [...html.matchAll(ESTIMATE_FORM_RE)];
  const estimateForm = forms.find((match) => /moving from|homeSize|home size/i.test(match[0]));
  if (!estimateForm) throw new Error(`${routeUrl}: top estimate form not found`);
  let form = estimateForm[0];
  const existingBlocks = form.match(PROMO_BLOCK_RE) ?? [];
  if (existingBlocks.length > 1) throw new Error(`${routeUrl}: duplicate promo cards in top estimate form`);
  if (existingBlocks.length === 1) {
    form = form.replace(PROMO_BLOCK_RE, ROUTE_PROMO_MARKUP);
  } else if (VERIFIED_DETAILS_RE.test(form)) {
    form = form.replace(VERIFIED_DETAILS_RE, (match) => ROUTE_PROMO_MARKUP + match);
  } else {
    form = form.replace(/<\/form>$/i, ROUTE_PROMO_MARKUP + "</form>");
  }
  return html.slice(0, estimateForm.index) + form + html.slice(estimateForm.index + estimateForm[0].length);
}

export function validateRoutePromo(html, routeUrl = "route") {
  const errors = [];
  const promoBlocks = html.match(PROMO_BLOCK_RE) ?? [];
  if (promoBlocks.length !== 1) errors.push(`expected exactly one .pcm-estimate-bonus; found ${promoBlocks.length}`);
  if (((promoBlocks[0] ?? "").match(new RegExp(escapeRegExp(ROUTE_PROMO_HEADING), "g")) ?? []).length !== 1) errors.push("promo heading is missing or duplicated inside the card");
  if (((promoBlocks[0] ?? "").match(new RegExp(escapeRegExp(ROUTE_PROMO_DEADLINE), "g")) ?? []).length !== 1) errors.push("approved promo deadline is missing or duplicated inside the card");
  if (((promoBlocks[0] ?? "").match(new RegExp(escapeRegExp(ROUTE_PROMO_SUPPORT), "g")) ?? []).length !== 1) errors.push("promo supporting sentence is missing or duplicated inside the card");
  if (/Book before\s+August\s+\d+/i.test(html)) errors.push("August promo deadline remains");
  if (/Book before September 30(?!, 2026)/i.test(html)) errors.push("September 30 promo deadline is missing the year");
  if (/Written estimate planning/i.test(promoBlocks[0] ?? "")) errors.push("planning copy remains inside promo");
  const forms = [...html.matchAll(ESTIMATE_FORM_RE)];
  const estimateForm = forms.find((match) => /moving from|homeSize|home size/i.test(match[0]))?.[0] ?? "";
  const promoIndex = estimateForm.indexOf(ROUTE_PROMO_MARKUP);
  const verifiedIndex = estimateForm.search(VERIFIED_DETAILS_RE);
  const buttonIndex = estimateForm.search(/pcm-buttons|pcm-button-row|type="submit"/i);
  const noteIndex = estimateForm.search(/pcm-form-note|pcm-estimate-reassurance|pcm-contact-form-reassurance/i);
  if (promoIndex < 0) errors.push("promo is not inside the top estimate form");
  if (buttonIndex < 0 || buttonIndex > promoIndex) errors.push("promo is not after the form buttons");
  if (noteIndex >= 0 && noteIndex > promoIndex) errors.push("promo is not after the reassurance/form note");
  if (verifiedIndex >= 0 && promoIndex > verifiedIndex) errors.push("promo is not before verified company details");
  const formIndex = html.indexOf(estimateForm);
  const formEnd = formIndex + estimateForm.length;
  const pricingAfterForm = html.slice(formEnd).search(/(?:pcm-route-cost|moving cost estimates|moving costs)/i);
  if (pricingAfterForm >= 0 && html.indexOf(ROUTE_PROMO_MARKUP) > formEnd + pricingAfterForm) errors.push("promo is not before route pricing");
  if (errors.length) throw new Error(`${routeUrl}: ${errors.join("; ")}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

if (process.argv[1]?.endsWith("finalize-route-promo.mjs")) {
  const root = resolve(process.argv[2] ?? "site-copy");
  let changed = 0;
  for (const route of routePageOwnership) {
    const file = join(root, route.routeUrl.slice(1), "index.html");
    const before = readFileSync(file, "utf8");
    const hasMaterializedForm = ESTIMATE_FORM_RE.test(before);
    ESTIMATE_FORM_RE.lastIndex = 0;
    if (!hasMaterializedForm && !/\/assets\/conversion-boost\.js/i.test(before)) throw new Error(`${route.routeUrl}: route has neither a materialized estimate form nor the promo runtime`);
    const after = hasMaterializedForm ? restoreRoutePromo(before, route.routeUrl) : before;
    if (hasMaterializedForm) validateRoutePromo(after, route.routeUrl);
    else if (!/\/assets\/conversion-boost\.js/i.test(after)) throw new Error(`${route.routeUrl}: SPA shell does not load the promo runtime`);
    if (after !== before) {
      writeFileSync(file, after, "utf8");
      changed += 1;
    }
  }
  console.log(`Route promo finalizer: ${routePageOwnership.length}/56 valid; ${changed} files materialized.`);
}
