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

function redirectWithSecurityHeaders(location, status = 301) {
  return withSecurityHeaders(Response.redirect(location, status));
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

async function proxyChatToManus(request) {
  const url = new URL(request.url);
  const upstream = new URL(url.pathname + url.search, MANUS_ORIGIN);
  const body = await request.text();
  const shouldAddCostGuide = isCostQuestion(body);
  const headers = new Headers(request.headers);

  const response = await fetch(upstream.toString(), {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : body,
    redirect: "manual",
  });

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

    if (url.hostname === "www.purelycanadianmovers.com") {
      url.hostname = "purelycanadianmovers.com";
      return redirectWithSecurityHeaders(url.toString(), 301);
    }

    if (pathname === "/api/oauth/callback" || pathname === "/api/oauth/callback/") {
      return redirectWithSecurityHeaders(manusCallbackLocation(request.url), 302);
    }

    if (pathname === "/api/trpc/chat.message" || pathname === "/api/trpc/chat.message/") {
      return proxyChatToManus(request);
    }

    const destination = REDIRECTS.get(pathname);

    if (destination) {
      return redirectWithSecurityHeaders(redirectLocation(request.url, destination), 301);
    }

    return env.ASSETS.fetch(request).then(withSecurityHeaders);
  },
};
