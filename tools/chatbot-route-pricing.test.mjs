import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  COST_ROUTE_ESTIMATES,
  costGuideChatReply,
  isCostQuestion,
  proxyTrpcToManus,
} from "../src/index.js";

const sizes = {
  studio: "studio",
  oneBed: "1 bedroom",
  twoBed: "2 bedroom",
  threeBed: "3 bedroom",
  fourPlus: "4+ bedroom",
};

const guideRows = [
  ["vancouver", "winnipeg", "2400", "3400", "5500", "8900", "13000"],
  ["winnipeg", "vancouver", "2400", "3400", "5500", "8900", "13000"],
  ["vancouver", "toronto", "2500", "4700", "6500", "10000", "15000"],
  ["toronto", "vancouver", "2500", "4700", "6500", "10000", "15000"],
  ["victoria/nanaimo", "toronto", "3000", "5300", "7000", "11000", "16000"],
  ["toronto", "victoria/nanaimo", "3000", "5300", "7000", "11000", "16000"],
  ["vancouver", "ottawa", "2500", "4700", "6500", "10000", "15000"],
  ["ottawa", "vancouver", "2500", "4700", "6500", "10000", "15000"],
  ["victoria/nanaimo", "ottawa", "3000", "5300", "7000", "11000", "16000"],
  ["ottawa", "victoria/nanaimo", "3000", "5300", "7000", "11000", "16000"],
  ["vancouver", "calgary", "2000", "2600", "3500", "4800", "6500"],
  ["calgary", "vancouver", "2000", "2600", "3500", "4800", "6500"],
  ["winnipeg", "calgary", "2300", "3200", "5100", "8200", "12000"],
  ["calgary", "winnipeg", "2300", "3200", "5100", "8200", "12000"],
  ["edmonton", "winnipeg", "2300", "3200", "5100", "8200", "12000"],
  ["winnipeg", "edmonton", "2300", "3200", "5100", "8200", "12000"],
  ["winnipeg", "toronto", "2400", "3400", "5500", "9000", "13000"],
  ["toronto", "winnipeg", "2400", "3400", "5500", "9000", "13000"],
  ["winnipeg", "montreal", "2400", "3400", "5500", "9000", "13000"],
  ["montreal", "winnipeg", "2400", "3400", "5500", "9000", "13000"],
  ["vancouver", "edmonton", "2200", "2800", "3800", "5200", "7000"],
  ["edmonton", "vancouver", "2200", "2800", "3800", "5200", "7000"],
  ["toronto", "calgary", "2500", "3800", "6400", "10000", "15000"],
  ["calgary", "toronto", "2500", "3800", "6400", "10000", "15000"],
  ["toronto", "edmonton", "2500", "3800", "6400", "10000", "15000"],
  ["edmonton", "toronto", "2500", "3800", "6400", "10000", "15000"],
  ["ottawa", "calgary", "2500", "4700", "6300", "10000", "15000"],
  ["calgary", "ottawa", "2500", "4700", "6300", "10000", "15000"],
  ["ottawa", "edmonton", "2500", "4700", "6300", "10000", "15000"],
  ["edmonton", "ottawa", "2500", "4700", "6300", "10000", "15000"],
  ["montreal", "calgary", "2500", "4700", "6300", "10000", "15000"],
  ["calgary", "montreal", "2500", "4700", "6300", "10000", "15000"],
  ["montreal", "edmonton", "2500", "4700", "6300", "10000", "15000"],
  ["edmonton", "montreal", "2500", "4700", "6300", "10000", "15000"],
  ["montreal", "vancouver", "2500", "4700", "6400", "10000", "15000"],
  ["vancouver", "montreal", "2500", "4700", "6400", "10000", "15000"],
  ["montreal", "victoria/nanaimo", "3000", "5300", "7000", "11000", "16000"],
  ["victoria/nanaimo", "montreal", "3000", "5300", "7000", "11000", "16000"],
  ["toronto", "montreal", "2300", "3900", "5200", "8300", "12000"],
  ["montreal", "toronto", "2300", "3900", "5200", "8300", "12000"],
  ["toronto", "ottawa", "800", "1100", "1500", "2000", "2800"],
  ["ottawa", "toronto", "800", "1100", "1500", "2000", "2800"],
  ["calgary", "edmonton", "800", "1100", "1500", "2000", "2800"],
  ["edmonton", "calgary", "800", "1100", "1500", "2000", "2800"],
  ["halifax", "toronto", "2200", "2900", "3900", "5300", "7000"],
  ["calgary", "halifax", "2600", "3900", "6500", "11000", "16000"],
  ["halifax", "calgary", "2600", "3900", "6500", "11000", "16000"],
  ["vancouver", "halifax", "2700", "4400", "7300", "12000", "18000"],
  ["halifax", "vancouver", "2700", "4400", "7300", "12000", "18000"],
];

const money = (value) => value.replace(/[^0-9]/g, "");

function expandedGuideRows() {
  return guideRows.flatMap(([from, to, ...prices]) => {
    const fromCities = from.split("/");
    const toCities = to.split("/");
    return fromCities.flatMap((fromCity) => toCities.map((toCity) => [fromCity, toCity, ...prices]));
  });
}

test("deterministic pricing exactly covers every authoritative guide row", () => {
  const actual = new Map(COST_ROUTE_ESTIMATES.map((route) => [
    `${route.from}->${route.to}`,
    [route.studio, route.oneBed, route.twoBed, route.threeBed, route.fourPlus].map(money),
  ]));
  const expected = expandedGuideRows();

  assert.equal(actual.size, expected.length);
  for (const [from, to, ...prices] of expected) {
    assert.deepEqual(actual.get(`${from}->${to}`), prices, `${from} to ${to}`);
  }
});

test("all routes and all five sizes return deterministic planning estimates", () => {
  for (const route of COST_ROUTE_ESTIMATES) {
    for (const [sizeKey, wording] of Object.entries(sizes)) {
      const reply = costGuideChatReply(`how much to move a ${wording} from ${route.from} to ${route.to}`);
      assert.match(reply, new RegExp(route[sizeKey].replace("$", "\\$").replace(",", ",")));
      assert.match(reply, /planning estimate, not a guaranteed/i);
      assert.doesNotMatch(reply, /\$3,500[–-]\$6,500|\$179|Metro Vancouver/i);
    }
  }
});

test("directional links resolve locally or intentionally use the authoritative guide", () => {
  for (const route of COST_ROUTE_ESTIMATES) {
    const reply = costGuideChatReply(`price for a 2 bedroom from ${route.from} to ${route.to}`);
    const url = reply.match(/\]\((https:\/\/purelycanadianmovers\.com\/[^)]+)\)/)?.[1];
    assert.ok(url, `${route.from} to ${route.to} has a link`);
    const pathname = new URL(url).pathname;
    if (pathname !== "/long-distance-moving-cost-canada/") {
      assert.ok(fs.existsSync(`site-copy${pathname}index.html`), `${pathname} exists`);
    }
  }
});

test("required route spot checks use guide prices", () => {
  const checks = [
    ["ottawa", "calgary", "2 bedroom", "$6,300+"],
    ["calgary", "ottawa", "2 bedroom", "$6,300+"],
    ["edmonton", "montreal", "2 bedroom", "$6,300+"],
    ["calgary", "vancouver", "2 bedroom", "$3,500+"],
    ["vancouver", "calgary", "2 bedroom", "$3,500+"],
    ["toronto", "montreal", "2 bedroom", "$5,200+"],
  ];
  for (const [from, to, size, price] of checks) {
    assert.match(costGuideChatReply(`how much to move a ${size} from ${from} to ${to}`), new RegExp(price.replace("$", "\\$").replace("+", "\\+")));
  }
  for (const wording of Object.values(sizes)) {
    assert.ok(costGuideChatReply(`cost to move a ${wording} from montreal to edmonton`));
  }
});

test("Calgary and Ottawa route replies include the shared route facts in both directions", () => {
  for (const [from, to, routeName] of [
    ["calgary", "ottawa", "Calgary to Ottawa"],
    ["ottawa", "calgary", "Ottawa to Calgary"],
  ]) {
    const sizedReply = costGuideChatReply(`how much to move a 2 bedroom from ${from} to ${to}`);
    assert.match(sizedReply, new RegExp(routeName));
    assert.match(sizedReply, /3,500 km/);
    assert.match(sizedReply, /7–19 days/);
    assert.match(sizedReply, /\$6,300\+/);

    const genericReply = costGuideChatReply(`how much to move from ${from} to ${to}`);
    assert.match(genericReply, new RegExp(routeName));
    assert.match(genericReply, /3,500 km/);
    assert.match(genericReply, /7–19 days/);
    for (const price of ["$2,500+", "$4,700+", "$6,300+", "$10,000+", "$15,000+"]) {
      assert.match(genericReply, new RegExp(price.replace("$", "\\$").replace("+", "\\+")));
    }
  }
});

test("Winnipeg and Montreal route replies include the shared route facts in both directions", () => {
  for (const [from, to, routeName, slug] of [
    ["winnipeg", "montreal", "Winnipeg to Montreal", "winnipeg-to-montreal-movers"],
    ["montreal", "winnipeg", "Montreal to Winnipeg", "montreal-to-winnipeg-movers"],
  ]) {
    const sizedReply = costGuideChatReply(`how much to move a 2 bedroom from ${from} to ${to}`);
    assert.match(sizedReply, new RegExp(routeName));
    assert.match(sizedReply, /approximately 2,270 km/);
    assert.match(sizedReply, /typical transit of 5–13 days/);
    assert.match(sizedReply, /\$5,500\+/);
    assert.match(sizedReply, new RegExp(`https://purelycanadianmovers\\.com/${slug}/`));

    const genericReply = costGuideChatReply(`how much to move from ${from} to ${to}`);
    assert.match(genericReply, new RegExp(routeName));
    assert.match(genericReply, /approximately 2,270 km/);
    assert.match(genericReply, /typical transit of 5–13 days/);
    for (const price of ["$2,400+", "$3,400+", "$5,500+", "$9,000+", "$13,000+"]) {
      assert.match(genericReply, new RegExp(price.replace("$", "\\$").replace("+", "\\+")));
    }
  }
});

test("Victoria to Ottawa uses the dedicated route page and current route facts", () => {
  for (const prompt of [
    "Victoria to Ottawa",
    "moving from Victoria to Ottawa",
    "how much to move a 2 bedroom from Victoria to Ottawa",
  ]) {
    const reply = costGuideChatReply(prompt);
    assert.match(reply, /Victoria\/Nanaimo to Ottawa/);
    assert.match(reply, /~4,700\+ km/);
    assert.match(reply, /10–22 days/);
    assert.match(reply, /\$7,000\+/);
    assert.match(reply, /https:\/\/purelycanadianmovers\.com\/victoria-to-ottawa-movers\//);
  }
  const reverseReply = costGuideChatReply("how much to move a 2 bedroom from Ottawa to Victoria");
  assert.match(reverseReply, /Ottawa to Victoria\/Nanaimo/);
  assert.match(reverseReply, /\$7,000\+/);
});

test("recognized pricing bypasses upstream while unrelated chat still reaches it", async () => {
  const originalFetch = globalThis.fetch;
  let upstreamCalls = 0;
  globalThis.fetch = async () => {
    upstreamCalls += 1;
    return new Response(JSON.stringify({ reply: "upstream non-pricing answer" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  try {
    for (const route of COST_ROUTE_ESTIMATES) {
      for (const wording of Object.values(sizes)) {
        const prompt = `price for ${wording} ${route.from} to ${route.to}`;
        assert.ok(isCostQuestion(prompt), prompt);
        const pricingRequest = new Request("https://purelycanadianmovers.com/api/trpc/chat.message", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ json: { messages: [{ role: "user", content: prompt }] } }),
        });
        const pricingReply = await (await proxyTrpcToManus(pricingRequest, null, null)).text();
        assert.match(pricingReply, /planning estimate, not a guaranteed/i);
      }
    }
    assert.equal(upstreamCalls, 0);

    const unrelatedRequest = new Request("https://purelycanadianmovers.com/api/trpc/chat.message", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: { messages: [{ role: "user", content: "Do you offer packing services?" }] } }),
    });
    const unrelatedReply = await (await proxyTrpcToManus(unrelatedRequest, null, null)).text();
    assert.match(unrelatedReply, /upstream non-pricing answer/);
    assert.equal(upstreamCalls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
