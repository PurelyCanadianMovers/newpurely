const MANUS_BLOG_LOGIN =
  "https://manus.im/app-auth?appId=FhisZ7WXCdcqNnJdX5VyAC&redirectUri=https%3A%2F%2Fpurelycanada-fhisz7wx.manus.space%2Fapi%2Foauth%2Fcallback&state=eyJyZWRpcmVjdFVyaSI6Imh0dHBzOi8vcHVyZWx5Y2FuYWRhLWZoaXN6N3d4Lm1hbnVzLnNwYWNlL2FwaS9vYXV0aC9jYWxsYmFjayIsInJldHVyblBhdGgiOiIvYWRtaW4vYmxvZyJ9&type=signIn";
const MANUS_ORIGIN = "https://purelycanada-fhisz7wx.manus.space";
const MANUS_OAUTH_CALLBACK =
  `${MANUS_ORIGIN}/api/oauth/callback`;
const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000",
};

const REDIRECTS = new Map([
  ["/admin/blog", MANUS_BLOG_LOGIN],
  ["/admin/blog/", MANUS_BLOG_LOGIN],
  ["/admin/login", MANUS_BLOG_LOGIN],
  ["/admin/login/", MANUS_BLOG_LOGIN],
  ["/index.htm", "/"],
  ["/index.htm/", "/"],
  ["/index.html", "/"],
  ["/home", "/"],
  ["/home/", "/"],
  ["/long-distance", "/long-distance/"],
  ["/distance", "/long-distance/"],
  ["/distance/", "/long-distance/"],
  ["/movers-west-vancouver.html", "/local/"],
  ["/thank-you/index.html", "/contact/"],
  ["/customer-comments/index.html", "/testimonials/"],
  ["/load-your-moving-truck-like-a-pro/", "/packing/"],
  ["/moving-quotes/", "/long-distance-moving-cost-canada/"],
  [
    "/2025/10/17/why-purely-canadian-movers-great-canadian-van-lines-are-montreal-and-quebecs-moving-company-of-choice/",
    "/montreal-long-distance-movers/",
  ],
  ["/category/news/index.html", "/blog/"],
  ["/blog/page/2/index.html", "/blog/"],
  ["/blog/page/3/", "/blog/"],
  ["/blog/page/3/index.html", "/blog/"],
  ["/siteblog/index.php", "/blog/"],
  ["/siteblog/comments/feed/", "/blog/"],
  [
    "/2025/06/10/why-purely-canadian-movers-is-a-top-rated-choice-for-long-distance-moves-from-burnaby/",
    "/long-distance/",
  ],
  [
    "/2025/07/10/why-purely-canadian-movers-is-the-cheapest-choice-for-long-distance-moves/",
    "/long-distance-moving-cost-canada/",
  ],
  [
    "/2025/07/07/purely-canadian-movers-coquitlams-oldest-most-reputable-moving-company/",
    "/local-movers-in-coquitlam-bc/",
  ],
  [
    "/2025/07/21/purely-canadian-movers-trusted-long-distance-movers-in-canada-with-honest-quotes/",
    "/long-distance-moving-cost-canada/",
  ],
  [
    "/2025/07/23/purely-canadian-best-long-distance-movers-in-canada/",
    "/long-distance/",
  ],
  ["/tag/best-mover-in-burnaby/", "/local-movers-burnaby-bc/"],
]);

function redirectLocation(requestUrl, destination) {
  if (destination.startsWith("https://")) {
    return destination;
  }

  const url = new URL(requestUrl);
  url.pathname = destination;
  url.search = "";
  return url.toString();
}

function canonicalRedirectLocation(requestUrl, destination) {
  if (destination.startsWith("https://")) {
    return destination;
  }

  const url = new URL(requestUrl);
  url.protocol = "https:";
  url.hostname = "purelycanadianmovers.com";
  url.pathname = destination;
  url.search = "";
  return url.toString();
}

function manusCallbackLocation(requestUrl) {
  const url = new URL(requestUrl);
  return `${MANUS_OAUTH_CALLBACK}${url.search}`;
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function fetchStaticAsset(request, env, assetPath, extraHeaders = {}) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  assetUrl.search = "";

  const response = await env.ASSETS.fetch(new Request(assetUrl.toString(), request));
  const secured = withSecurityHeaders(response);
  const headers = new Headers(secured.headers);

  for (const [name, value] of Object.entries(extraHeaders)) {
    headers.set(name, value);
  }

  return new Response(secured.body, {
    status: secured.status,
    statusText: secured.statusText,
    headers,
  });
}

function redirectWithSecurityHeaders(location, status = 301) {
  return withSecurityHeaders(Response.redirect(location, status));
}

function hasFileExtension(pathname) {
  return /\/[^/]+\.[^/]+$/.test(pathname);
}

function isCostQuestion(inputText) {
  return (
    /\b(cost|price|pricing|quote|estimate|how much|rate|rates)\b/i.test(inputText) &&
    /\b(move|moving|mover|movers|relocat|ship|long[-\s]?distance|toronto|calgary|vancouver|canada)\b/i.test(inputText)
  );
}

function appendCostGuideLink(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  let updated = false;

  if (typeof payload.reply === "string") {
    const costGuideLink =
      "[Long-Distance Moving Cost Canada](https://purelycanadianmovers.com/long-distance-moving-cost-canada/)";

    if (!payload.reply.includes("/long-distance-moving-cost-canada/")) {
      payload.reply += `\n\nFor pricing ranges by home size and route, see our detailed guide: ${costGuideLink}.`;
      updated = true;
    }
  }

  for (const value of Object.values(payload)) {
    if (value && typeof value === "object") {
      updated = appendCostGuideLink(value) || updated;
    }
  }

  return updated;
}

function extractTextFromChatPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (Array.isArray(payload.messages)) {
    const lastUserMessage = [...payload.messages].reverse().find((message) => message?.role === "user");
    return typeof lastUserMessage?.content === "string" ? lastUserMessage.content : "";
  }

  if (payload.json) {
    return extractTextFromChatPayload(payload.json);
  }

  for (const value of Object.values(payload)) {
    const text = extractTextFromChatPayload(value);

    if (text) {
      return text;
    }
  }

  return "";
}

function fallbackChatReply(inputText) {
  const lowerInput = inputText.toLowerCase();

  if (isCostQuestion(inputText)) {
    return "Moving costs depend on the route, home size, shipment weight, access, packing, storage, and timing. For Toronto to Calgary and other Canada-wide routes, Purely Canadian Movers can provide a detailed no-obligation estimate after reviewing your inventory.\n\nFor pricing ranges by route and home size, see our detailed guide: [Long-Distance Moving Cost Canada](https://purelycanadianmovers.com/long-distance-moving-cost-canada/).";
  }

  if (/\b(contact|phone|call|email|quote|estimate)\b/i.test(inputText)) {
    return "You can reach Purely Canadian Movers at 1-877-485-6683, locally at 604-522-7222, or by email at esales@pcmovers.ca. You can also start a free estimate on the contact page: [Get a Free Estimate](https://purelycanadianmovers.com/contact/).";
  }

  if (/\b(area|areas|serve|service|city|cities|coquitlam|surrey|burnaby|vancouver|langley|maple ridge|north vancouver|port moody|white rock)\b/i.test(inputText)) {
    return "Purely Canadian Movers serves Metro Vancouver, the Lower Mainland, and long-distance moves across Canada. Key local service areas include Coquitlam, Port Coquitlam, Port Moody, Burnaby, Surrey, Langley, Maple Ridge, Vancouver, North Vancouver, White Rock, and nearby communities.";
  }

  if (/\b(subcontract|broker|agent|great canadian)\b/i.test(inputText)) {
    return "Purely Canadian Movers is family-owned and based in Coquitlam, BC. The company does not use subcontractors for its moves and is an agent of Great Canadian Van Lines for Canada-wide long-distance moving support.";
  }

  if (lowerInput.includes("packing") || lowerInput.includes("storage")) {
    return "Yes. Packing, unpacking, storage, and valuation coverage options can be added to a moving estimate. The best next step is to request a quote with your moving date, origin, destination, and home size so the team can price the right crew, truck, and services.";
  }

  return "I can help with local moves, long-distance moving, pricing questions, packing, storage, service areas, and estimate requests. For immediate help, call 1-877-485-6683 or start here: [Get a Free Estimate](https://purelycanadianmovers.com/contact/).";
}

function makeTrpcChatResponse(body, requestUrl) {
  let parsed;
  let userText = "";

  try {
    parsed = JSON.parse(body || "{}");
    userText = extractTextFromChatPayload(parsed);
  } catch {
    parsed = null;
  }

  const payload = {
    reply: fallbackChatReply(userText),
  };
  const url = new URL(requestUrl);
  const isBatch = url.searchParams.get("batch") === "1" || (parsed && typeof parsed === "object" && Object.hasOwn(parsed, "0"));
  const result = { result: { data: { json: payload } } };
  const responseBody = isBatch ? JSON.stringify([result]) : JSON.stringify(result);

  return withSecurityHeaders(new Response(responseBody, {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  }));
}

async function proxyTrpcToManus(request) {
  const url = new URL(request.url);
  const upstream = new URL(url.pathname + url.search, MANUS_ORIGIN);
  const isChatMessage = url.pathname === "/api/trpc/chat.message" || url.pathname === "/api/trpc/chat.message/";
  const body = request.method === "GET" || request.method === "HEAD" ? "" : await request.text();
  const shouldAddCostGuide = isChatMessage && isCostQuestion(body);
  const headers = new Headers(request.headers);

  const response = await fetch(upstream.toString(), {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : body,
    redirect: "manual",
  });

  const contentType = response.headers.get("content-type") || "";

  if (isChatMessage && !contentType.includes("application/json")) {
    return makeTrpcChatResponse(body, request.url);
  }

  if (!shouldAddCostGuide || !response.ok) {
    return withSecurityHeaders(response);
  }

  const responseText = await response.text();

  try {
    const payload = JSON.parse(responseText);

    if (!appendCostGuideLink(payload)) {
      return withSecurityHeaders(new Response(responseText, response));
    }

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-length");
    responseHeaders.set("content-type", "application/json");

    return withSecurityHeaders(new Response(JSON.stringify(payload), {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    }));
  } catch {
    return withSecurityHeaders(new Response(responseText, response));
  }
}

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const destination = REDIRECTS.get(pathname);

    if (destination && (url.protocol === "http:" || url.hostname === "www.purelycanadianmovers.com")) {
      return redirectWithSecurityHeaders(canonicalRedirectLocation(request.url, destination), 301);
    }

    if (url.protocol === "http:" || url.hostname === "www.purelycanadianmovers.com") {
      url.protocol = "https:";
      url.hostname = "purelycanadianmovers.com";
      return redirectWithSecurityHeaders(url.toString(), 301);
    }

    if (pathname === "/api/oauth/callback" || pathname === "/api/oauth/callback/") {
      return redirectWithSecurityHeaders(manusCallbackLocation(request.url), 302);
    }

    if (pathname === "/api/trpc" || pathname === "/api/trpc/" || pathname.startsWith("/api/trpc/")) {
      return proxyTrpcToManus(request);
    }

    if (pathname === "/blog" || pathname === "/blog/") {
      return fetchStaticAsset(request, env, "/blog/index.html", {
        "Cache-Control": "no-cache, max-age=0, must-revalidate",
      });
    }

    if (pathname === "/blog/toronto-to-western-canada-purely-canadian-movers/") {
      return fetchStaticAsset(request, env, "/blog/toronto-to-western-canada-purely-canadian-movers/index.html", {
        "Cache-Control": "no-cache, max-age=0, must-revalidate",
      });
    }

    if (pathname === "/blog/avoid-cheap-long-distance-moving-quotes-fake-reviews-1779301349239/") {
      return fetchStaticAsset(request, env, "/blog/avoid-cheap-long-distance-moving-quotes-fake-reviews-1779301349239/index.html", {
        "Cache-Control": "no-cache, max-age=0, must-revalidate",
      });
    }

    if (destination) {
      return redirectWithSecurityHeaders(redirectLocation(request.url, destination), 301);
    }

    if (!pathname.endsWith("/") && !hasFileExtension(pathname)) {
      url.pathname = `${pathname}/`;
      url.search = "";
      return redirectWithSecurityHeaders(url.toString(), 301);
    }

    if (pathname.endsWith("/")) {
      return fetchStaticAsset(request, env, `${pathname}index.html`);
    }

    return env.ASSETS.fetch(request).then(withSecurityHeaders);
  },
};
