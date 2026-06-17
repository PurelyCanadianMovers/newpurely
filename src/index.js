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

function isStoragePricingQuestion(inputText) {
  return (
    /\b(storage|store|stored|warehouse|warehousing)\b/i.test(inputText) &&
    /\b(cost|price|pricing|quote|estimate|how much|rate|rates|charge|charges|fee|fees)\b/i.test(inputText)
  );
}

function isLeadIntentQuestion(inputText) {
  return (
    isCostQuestion(inputText) ||
    isStoragePricingQuestion(inputText) ||
    /\b(quote|estimate|book|booking|availability|available|schedule|moving date|move date|call me|contact me|phone|email)\b/i.test(inputText) ||
    /\b(move|moving|movers|relocat|ship)\b/i.test(inputText) && /\bfrom\b.+\bto\b/i.test(inputText) ||
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(inputText) ||
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(inputText)
  );
}

function truncateForNotification(value, maxLength = 2000) {
  if (!value || value.length <= maxLength) {
    return value || "";
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

function parseEmailRecipients(value) {
  return String(value || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

async function resolveEnvValue(env, ...names) {
  for (const name of names) {
    const binding = env?.[name];

    if (!binding) {
      continue;
    }

    if (typeof binding === "string") {
      return binding;
    }

    if (typeof binding.get === "function") {
      const value = await binding.get();

      if (value) {
        return value;
      }
    }
  }

  return "";
}

async function describeEnvValue(env, name) {
  const binding = env?.[name];

  if (!binding) {
    return { configured: false, type: "missing", readable: false };
  }

  if (typeof binding === "string") {
    return { configured: true, type: "string", readable: binding.length > 0 };
  }

  if (typeof binding.get === "function") {
    try {
      const value = await binding.get();
      return { configured: true, type: "secrets-store", readable: Boolean(value) };
    } catch (error) {
      return {
        configured: true,
        type: "secrets-store",
        readable: false,
        error: error?.message || "Unable to read secret",
      };
    }
  }

  return { configured: true, type: typeof binding, readable: false };
}

async function estimateConfigDebugResponse(env) {
  const payload = {
    ok: true,
    bindings: {
      ESTIMATE_NOTIFY_TO: await describeEnvValue(env, "ESTIMATE_NOTIFY_TO"),
      ESTIMATE_NOTIFY_FROM: await describeEnvValue(env, "ESTIMATE_NOTIFY_FROM"),
      RESEND_API_KEY: await describeEnvValue(env, "RESEND_API_KEY"),
      ESTIMATE_WEBHOOK_URL: await describeEnvValue(env, "ESTIMATE_WEBHOOK_URL"),
      CHAT_LEAD_WEBHOOK_URL: await describeEnvValue(env, "CHAT_LEAD_WEBHOOK_URL"),
      CHAT_LEAD_NOTIFY_TO: await describeEnvValue(env, "CHAT_LEAD_NOTIFY_TO"),
      CHAT_LEAD_NOTIFY_FROM: await describeEnvValue(env, "CHAT_LEAD_NOTIFY_FROM"),
    },
  };

  return withSecurityHeaders(new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  }));
}

function chatLeadNotificationPayload(request, userText, replyText) {
  const url = new URL(request.url);

  return {
    event: "chat_lead_question",
    site: "purelycanadianmovers.com",
    page: request.headers.get("referer") || url.origin,
    question: truncateForNotification(userText),
    reply: truncateForNotification(replyText),
    userAgent: request.headers.get("user-agent") || "",
    ipCountry: request.cf?.country || "",
    timestamp: new Date().toISOString(),
  };
}

async function sendChatLeadNotification(request, env, userText, replyText) {
  if (!isLeadIntentQuestion(userText)) {
    return;
  }

  const payload = chatLeadNotificationPayload(request, userText, replyText);
  const webhookUrl = await resolveEnvValue(env, "CHAT_LEAD_WEBHOOK_URL");
  const resendApiKey = await resolveEnvValue(env, "RESEND_API_KEY");
  const notifyTo = await resolveEnvValue(env, "CHAT_LEAD_NOTIFY_TO", "ESTIMATE_NOTIFY_TO");
  const notifyFrom = await resolveEnvValue(env, "CHAT_LEAD_NOTIFY_FROM", "ESTIMATE_NOTIFY_FROM");
  const recipients = parseEmailRecipients(notifyTo);

  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  if (resendApiKey && recipients.length > 0 && notifyFrom) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${resendApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: notifyFrom,
        to: recipients,
        subject: "New chatbot lead question",
        text: [
          "A visitor asked a lead-intent question on the website chatbot.",
          "",
          `Question: ${payload.question}`,
          "",
          `Chatbot reply: ${payload.reply}`,
          "",
          `Page: ${payload.page}`,
          `Country: ${payload.ipCountry || "Unknown"}`,
          `Time: ${payload.timestamp}`,
          `User agent: ${payload.userAgent}`,
        ].join("\n"),
      }),
    });
  }
}

function queueChatLeadNotification(request, env, ctx, userText, replyText) {
  if (!env) {
    return;
  }

  const task = sendChatLeadNotification(request, env, userText, replyText).catch((error) => {
    console.error("Chat lead notification failed", error);
  });

  if (ctx?.waitUntil) {
    ctx.waitUntil(task);
  }
}

function trpcJsonResponse(payload, isBatch = false) {
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

function trpcErrorResponse(message, isBatch = false, status = 500) {
  const error = {
    error: {
      message,
      code: -32603,
      data: {
        code: "INTERNAL_SERVER_ERROR",
        httpStatus: status,
      },
    },
  };
  const responseBody = isBatch ? JSON.stringify([error]) : JSON.stringify(error);

  return withSecurityHeaders(new Response(responseBody, {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  }));
}

function extractTrpcJsonInput(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return {};
  }

  if (parsed.json && typeof parsed.json === "object") {
    return parsed.json;
  }

  if (parsed["0"] && typeof parsed["0"] === "object") {
    return extractTrpcJsonInput(parsed["0"]);
  }

  return parsed;
}

function estimateNotificationPayload(request, estimate) {
  const url = new URL(request.url);

  return {
    event: "estimate_request",
    site: "purelycanadianmovers.com",
    page: request.headers.get("referer") || url.origin,
    name: estimate.name || "",
    email: estimate.email || "",
    phone: estimate.phone || "",
    moveType: estimate.moveType || "",
    homeSize: estimate.homeSize || "",
    movingFrom: estimate.movingFrom || "",
    movingTo: estimate.movingTo || "",
    moveDate: estimate.moveDate || "",
    details: truncateForNotification(estimate.details || ""),
    userAgent: request.headers.get("user-agent") || "",
    ipCountry: request.cf?.country || "",
    timestamp: new Date().toISOString(),
  };
}

function estimateNotificationText(payload) {
  return [
    "A visitor submitted an estimate request on purelycanadianmovers.com.",
    "",
    `Name: ${payload.name || "Not provided"}`,
    `Email: ${payload.email || "Not provided"}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Move type: ${payload.moveType || "Not provided"}`,
    `Home / office size: ${payload.homeSize || "Not provided"}`,
    `Moving from: ${payload.movingFrom || "Not provided"}`,
    `Moving to: ${payload.movingTo || "Not provided"}`,
    `Move date: ${payload.moveDate || "Not provided"}`,
    "",
    "Additional details:",
    payload.details || "None provided",
    "",
    `Page: ${payload.page}`,
    `Country: ${payload.ipCountry || "Unknown"}`,
    `Time: ${payload.timestamp}`,
    `User agent: ${payload.userAgent}`,
  ].join("\n");
}

async function sendEstimateNotification(request, env, estimate) {
  const payload = estimateNotificationPayload(request, estimate);
  const channels = [];
  const webhookUrl = await resolveEnvValue(env, "ESTIMATE_WEBHOOK_URL", "CHAT_LEAD_WEBHOOK_URL");
  const resendApiKey = await resolveEnvValue(env, "RESEND_API_KEY");
  const notifyTo = await resolveEnvValue(env, "ESTIMATE_NOTIFY_TO", "CHAT_LEAD_NOTIFY_TO") || "esales@pcmovers.ca";
  const notifyFrom = await resolveEnvValue(env, "ESTIMATE_NOTIFY_FROM", "CHAT_LEAD_NOTIFY_FROM");
  const recipients = parseEmailRecipients(notifyTo);

  if (webhookUrl) {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Estimate webhook failed with ${webhookResponse.status}`);
    }

    channels.push("webhook");
  }

  if (resendApiKey) {
    if (!notifyFrom) {
      throw new Error("Estimate email skipped because ESTIMATE_NOTIFY_FROM or CHAT_LEAD_NOTIFY_FROM is not configured.");
    }

    if (recipients.length === 0) {
      throw new Error("Estimate email skipped because ESTIMATE_NOTIFY_TO or CHAT_LEAD_NOTIFY_TO is not configured.");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${resendApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: notifyFrom,
        to: recipients,
        subject: `New estimate request: ${payload.movingFrom || "Origin"} to ${payload.movingTo || "Destination"}`,
        text: estimateNotificationText(payload),
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Estimate email failed with ${emailResponse.status}: ${errorText}`);
    }

    channels.push("email");
  }

  return {
    sent: channels.length > 0,
    channels,
    missingEmailConfig: !resendApiKey || !notifyFrom || recipients.length === 0,
  };
}

async function handleEstimateSubmit(request, env, ctx) {
  const body = request.method === "GET" || request.method === "HEAD" ? "" : await request.text();
  const url = new URL(request.url);
  const isBatch = url.searchParams.get("batch") === "1";
  let estimate = {};

  try {
    estimate = extractTrpcJsonInput(JSON.parse(body || "{}"));
  } catch {
    estimate = {};
  }

  let notification = {
    sent: false,
    channels: [],
    missingEmailConfig: true,
  };

  try {
    notification = await sendEstimateNotification(request, env || {}, estimate);
  } catch (error) {
    console.error("Estimate notification failed", error);
    const detail = error?.message ? ` ${String(error.message).slice(0, 500)}` : "";
    return trpcErrorResponse(`Estimate request could not be emailed. Please call 1-877-485-6683.${detail}`, isBatch);
  }

  if (!notification.sent) {
    console.error("Estimate notification missing configuration", notification);
    return trpcErrorResponse("Estimate notification is not configured. Please call 1-877-485-6683.", isBatch);
  }

  return trpcJsonResponse({
    success: true,
    message: "Estimate request received.",
    notification,
  }, isBatch);
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

const COST_GUIDE_URL = "https://purelycanadianmovers.com/long-distance-moving-cost-canada/";
const HOME_SIZE_LABELS = {
  studio: "studio",
  oneBed: "1-bedroom",
  twoBed: "2-bedroom",
  threeBed: "3-bedroom",
  fourPlus: "4+ bedroom",
};
const COST_ROUTE_ESTIMATES = [
  { route: "Vancouver to Toronto", from: "vancouver", to: "toronto", transit: "9-22 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,500", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Toronto to Vancouver", from: "toronto", to: "vancouver", transit: "9-22 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,500", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Vancouver to Ottawa", from: "vancouver", to: "ottawa", transit: "11-22 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,500", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Ottawa to Vancouver", from: "ottawa", to: "vancouver", transit: "11-22 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,500", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Vancouver to Calgary", from: "vancouver", to: "calgary", transit: "4-13 days", studio: "$2,000", oneBed: "$2,600", twoBed: "$3,500", threeBed: "$4,800", fourPlus: "$6,500" },
  { route: "Calgary to Vancouver", from: "calgary", to: "vancouver", transit: "4-13 days", studio: "$2,000", oneBed: "$2,600", twoBed: "$3,500", threeBed: "$4,800", fourPlus: "$6,500" },
  { route: "Vancouver to Edmonton", from: "vancouver", to: "edmonton", transit: "4-13 days", studio: "$2,200", oneBed: "$2,800", twoBed: "$3,800", threeBed: "$5,200", fourPlus: "$7,000" },
  { route: "Edmonton to Vancouver", from: "edmonton", to: "vancouver", transit: "4-13 days", studio: "$2,200", oneBed: "$2,800", twoBed: "$3,800", threeBed: "$5,200", fourPlus: "$7,000" },
  { route: "Toronto to Calgary", from: "toronto", to: "calgary", transit: "7-19 days", studio: "$2,500", oneBed: "$3,800", twoBed: "$6,400", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Calgary to Toronto", from: "calgary", to: "toronto", transit: "7-19 days", studio: "$2,500", oneBed: "$3,800", twoBed: "$6,400", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Toronto to Edmonton", from: "toronto", to: "edmonton", transit: "7-18 days", studio: "$2,500", oneBed: "$3,800", twoBed: "$6,400", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Edmonton to Toronto", from: "edmonton", to: "toronto", transit: "7-18 days", studio: "$2,500", oneBed: "$3,800", twoBed: "$6,400", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Ottawa to Calgary", from: "ottawa", to: "calgary", transit: "7-19 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Calgary to Ottawa", from: "calgary", to: "ottawa", transit: "7-19 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Ottawa to Edmonton", from: "ottawa", to: "edmonton", transit: "7-19 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Edmonton to Ottawa", from: "edmonton", to: "ottawa", transit: "7-19 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Montreal to Calgary", from: "montreal", to: "calgary", transit: "8-20 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Calgary to Montreal", from: "calgary", to: "montreal", transit: "8-20 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Montreal to Edmonton", from: "montreal", to: "edmonton", transit: "8-20 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Edmonton to Montreal", from: "edmonton", to: "montreal", transit: "8-20 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,300", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Montreal to Vancouver", from: "montreal", to: "vancouver", transit: "10-22 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,400", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Vancouver to Montreal", from: "vancouver", to: "montreal", transit: "10-22 days", studio: "$2,500", oneBed: "$4,700", twoBed: "$6,400", threeBed: "$10,000", fourPlus: "$15,000" },
  { route: "Montreal to Victoria/Nanaimo", from: "montreal", to: "victoria", transit: "10-22 days", studio: "$3,000", oneBed: "$5,300", twoBed: "$7,000", threeBed: "$11,000", fourPlus: "$16,000" },
  { route: "Victoria/Nanaimo to Montreal", from: "victoria", to: "montreal", transit: "10-22 days", studio: "$3,000", oneBed: "$5,300", twoBed: "$7,000", threeBed: "$11,000", fourPlus: "$16,000" },
  { route: "Montreal to Victoria/Nanaimo", from: "montreal", to: "nanaimo", transit: "10-22 days", studio: "$3,000", oneBed: "$5,300", twoBed: "$7,000", threeBed: "$11,000", fourPlus: "$16,000" },
  { route: "Victoria/Nanaimo to Montreal", from: "nanaimo", to: "montreal", transit: "10-22 days", studio: "$3,000", oneBed: "$5,300", twoBed: "$7,000", threeBed: "$11,000", fourPlus: "$16,000" },
  { route: "Toronto to Montreal", from: "toronto", to: "montreal", transit: "2-5 days", studio: "$2,300", oneBed: "$3,900", twoBed: "$5,200", threeBed: "$8,300", fourPlus: "$12,000" },
  { route: "Montreal to Toronto", from: "montreal", to: "toronto", transit: "2-5 days", studio: "$2,300", oneBed: "$3,900", twoBed: "$5,200", threeBed: "$8,300", fourPlus: "$12,000" },
  { route: "Toronto to Ottawa", from: "toronto", to: "ottawa", transit: "2-4 days", studio: "$800", oneBed: "$1,100", twoBed: "$1,500", threeBed: "$2,000", fourPlus: "$2,800" },
  { route: "Ottawa to Toronto", from: "ottawa", to: "toronto", transit: "2-4 days", studio: "$800", oneBed: "$1,100", twoBed: "$1,500", threeBed: "$2,000", fourPlus: "$2,800" },
  { route: "Calgary to Edmonton", from: "calgary", to: "edmonton", transit: "2-4 days", studio: "$800", oneBed: "$1,100", twoBed: "$1,500", threeBed: "$2,000", fourPlus: "$2,800" },
  { route: "Edmonton to Calgary", from: "edmonton", to: "calgary", transit: "2-4 days", studio: "$800", oneBed: "$1,100", twoBed: "$1,500", threeBed: "$2,000", fourPlus: "$2,800" },
  { route: "Halifax to Toronto", from: "halifax", to: "toronto", transit: "5-12 days", studio: "$2,200", oneBed: "$2,900", twoBed: "$3,900", threeBed: "$5,300", fourPlus: "$7,000" },
];

function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseHomeSize(inputText) {
  const normalized = normalizeText(inputText);

  if (/\b(studio|bachelor)\b/.test(normalized)) {
    return "studio";
  }

  if (/\b(1|one)\s*(bed|bedroom|br)\b/.test(normalized)) {
    return "oneBed";
  }

  if (/\b(2|two)\s*(bed|bedroom|br)\b/.test(normalized)) {
    return "twoBed";
  }

  if (/\b(3|three)\s*(bed|bedroom|br)\b/.test(normalized)) {
    return "threeBed";
  }

  if (/\b(4|four|5|five)\s*(bed|bedroom|br)|\b4\s*\+\s*(bed|bedroom|br)\b/.test(normalized)) {
    return "fourPlus";
  }

  return "";
}

function findCostRoute(inputText) {
  const normalized = normalizeText(inputText);
  const cities = [...new Set(COST_ROUTE_ESTIMATES.flatMap((estimate) => [estimate.from, estimate.to]))];
  const mentionedCities = cities.filter((city) => new RegExp(`\\b${city}\\b`).test(normalized));

  if (mentionedCities.length < 2) {
    return null;
  }

  const fromToMatch = normalized.match(/\bfrom\s+([a-z ]+?)\s+to\s+([a-z ]+?)(?:\s|$)/);

  if (fromToMatch) {
    const from = cities.find((city) => fromToMatch[1].includes(city));
    const to = cities.find((city) => fromToMatch[2].includes(city));

    if (from && to) {
      return COST_ROUTE_ESTIMATES.find((estimate) => estimate.from === from && estimate.to === to) || null;
    }
  }

  const [firstCity, secondCity] = mentionedCities.sort((a, b) => normalized.indexOf(a) - normalized.indexOf(b));
  return COST_ROUTE_ESTIMATES.find((estimate) => estimate.from === firstCity && estimate.to === secondCity) ||
    COST_ROUTE_ESTIMATES.find((estimate) => estimate.from === secondCity && estimate.to === firstCity) ||
    null;
}

function costGuideChatReply(inputText) {
  const routeEstimate = findCostRoute(inputText);

  if (!routeEstimate) {
    return "";
  }

  const homeSize = parseHomeSize(inputText);

  if (homeSize) {
    return `According to our long-distance moving cost guide, a ${HOME_SIZE_LABELS[homeSize]} move from ${routeEstimate.route} is estimated at about ${routeEstimate[homeSize]}, with an estimated transit time of ${routeEstimate.transit}. Actual pricing and timing depend on shipment weight, access, stairs or elevators, packing, storage, season, and valuation coverage.\n\nSee the full pricing table here: [Long-Distance Moving Cost Canada](${COST_GUIDE_URL}).`;
  }

  return `According to our long-distance moving cost guide, estimated transit time for ${routeEstimate.route} is ${routeEstimate.transit}. Estimated pricing is: studio ${routeEstimate.studio}, 1-bedroom ${routeEstimate.oneBed}, 2-bedroom ${routeEstimate.twoBed}, 3-bedroom ${routeEstimate.threeBed}, and 4+ bedroom ${routeEstimate.fourPlus}. Actual pricing and timing depend on shipment weight, access, packing, storage, season, and valuation coverage.\n\nSee the full pricing table here: [Long-Distance Moving Cost Canada](${COST_GUIDE_URL}).`;
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

function extractReplyFromChatPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (typeof payload.reply === "string") {
    return payload.reply;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const reply = extractReplyFromChatPayload(item);

      if (reply) {
        return reply;
      }
    }

    return "";
  }

  for (const value of Object.values(payload)) {
    const reply = extractReplyFromChatPayload(value);

    if (reply) {
      return reply;
    }
  }

  return "";
}

function fallbackChatReply(inputText) {
  const lowerInput = inputText.toLowerCase();
  const costGuideReply = costGuideChatReply(inputText);

  if (costGuideReply) {
    return costGuideReply;
  }

  if (isStoragePricingQuestion(inputText)) {
    return "Storage pricing depends on how much is being stored, how long you need storage, access, packing, and whether the shipment is priced by weight or volume. Purely Canadian Movers can include short-term or long-term storage in a written moving estimate after reviewing your inventory, origin, destination, and storage dates.\n\nFor the most accurate storage quote, start here: [Get a Free Estimate](https://purelycanadianmovers.com/contact/).";
  }

  if (isCostQuestion(inputText)) {
    return `Moving costs depend on the route, home size, shipment weight, access, packing, storage, and timing. Purely Canadian Movers can provide a detailed no-obligation estimate after reviewing your inventory.\n\nFor pricing ranges by route and home size, see our detailed guide: [Long-Distance Moving Cost Canada](${COST_GUIDE_URL}).`;
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
    return "Yes. Packing, unpacking, storage, and valuation coverage options can be added to a moving estimate. The best next step is to request a quote with your moving date, origin, destination, home size, and inventory details so the team can price the move based on either weight or volume, along with the right crew, truck, and services.";
  }

  return "I can help with local moves, long-distance moving, pricing questions, packing, storage, service areas, and estimate requests. For immediate help, call 1-877-485-6683 or start here: [Get a Free Estimate](https://purelycanadianmovers.com/contact/).";
}

function makeTrpcChatResponse(body, request) {
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
  const url = new URL(request.url);
  const isBatch = url.searchParams.get("batch") === "1" || (parsed && typeof parsed === "object" && Object.hasOwn(parsed, "0"));
  return trpcJsonResponse(payload, isBatch);
}

async function proxyTrpcToManus(request, env, ctx) {
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
    const fallbackResponse = makeTrpcChatResponse(body, request);
    let userText = "";
    let replyText = "";

    try {
      const parsedBody = JSON.parse(body || "{}");
      userText = extractTextFromChatPayload(parsedBody);
      replyText = extractReplyFromChatPayload(JSON.parse(await fallbackResponse.clone().text()));
    } catch {}

    queueChatLeadNotification(request, env, ctx, userText, replyText);
    return fallbackResponse;
  }

  if (!shouldAddCostGuide || !response.ok) {
    if (isChatMessage && response.ok) {
      try {
        const parsedBody = JSON.parse(body || "{}");
        queueChatLeadNotification(
          request,
          env,
          ctx,
          extractTextFromChatPayload(parsedBody),
          extractReplyFromChatPayload(JSON.parse(await response.clone().text())),
        );
      } catch {}
    }

    return withSecurityHeaders(response);
  }

  const responseText = await response.text();

  try {
    const payload = JSON.parse(responseText);

    if (!appendCostGuideLink(payload)) {
      queueChatLeadNotification(request, env, ctx, extractTextFromChatPayload(JSON.parse(body || "{}")), extractReplyFromChatPayload(payload));
      return withSecurityHeaders(new Response(responseText, response));
    }

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-length");
    responseHeaders.set("content-type", "application/json");
    queueChatLeadNotification(request, env, ctx, extractTextFromChatPayload(JSON.parse(body || "{}")), extractReplyFromChatPayload(payload));

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
  fetch(request, env, ctx) {
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

    if (pathname === "/api/debug/estimate-config" || pathname === "/api/debug/estimate-config/") {
      return estimateConfigDebugResponse(env);
    }

    if (pathname === "/api/trpc/contact.submit" || pathname === "/api/trpc/contact.submit/") {
      return handleEstimateSubmit(request, env, ctx);
    }

    if (pathname === "/api/trpc" || pathname === "/api/trpc/" || pathname.startsWith("/api/trpc/")) {
      return proxyTrpcToManus(request, env, ctx);
    }

    if (pathname === "/blog" || pathname === "/blog/") {
      return fetchStaticAsset(request, env, "/blog/index.html", {
        "Cache-Control": "no-cache, max-age=0, must-revalidate",
      });
    }

    if (pathname === "/blog/content/posts.json") {
      return fetchStaticAsset(request, env, "/blog/content/posts.json", {
        "Cache-Control": "no-cache, max-age=0, must-revalidate",
      });
    }

    if (pathname === "/assets/conversion-boost.js") {
      return fetchStaticAsset(request, env, "/assets/conversion-boost.js", {
        "Cache-Control": "no-cache, max-age=0, must-revalidate",
      });
    }

    if (pathname.startsWith("/blog/") && pathname.endsWith("/") && !pathname.startsWith("/blog/content/")) {
      return fetchStaticAsset(request, env, `${pathname}index.html`, {
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
