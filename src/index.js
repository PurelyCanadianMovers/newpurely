const MANUS_BLOG_LOGIN =
  "https://manus.im/app-auth?appId=FhisZ7WXCdcqNnJdX5VyAC&redirectUri=https%3A%2F%2Fpurelycanada-fhisz7wx.manus.space%2Fapi%2Foauth%2Fcallback&state=eyJyZWRpcmVjdFVyaSI6Imh0dHBzOi8vcHVyZWx5Y2FuYWRhLWZoaXN6N3d4Lm1hbnVzLnNwYWNlL2FwaS9vYXV0aC9jYWxsYmFjayIsInJldHVyblBhdGgiOiIvYWRtaW4vYmxvZyJ9&type=signIn";
const MANUS_OAUTH_CALLBACK =
  "https://purelycanada-fhisz7wx.manus.space/api/oauth/callback";

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

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/oauth/callback" || pathname === "/api/oauth/callback/") {
      return Response.redirect(manusCallbackLocation(request.url), 302);
    }

    const destination = REDIRECTS.get(pathname);

    if (destination) {
      return Response.redirect(redirectLocation(request.url, destination), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
