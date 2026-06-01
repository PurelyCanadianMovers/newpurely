const REDIRECTS = new Map([
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
  ["/siteblog/comments/feed/", "/blog/"],
]);

function redirectLocation(requestUrl, destination) {
  const url = new URL(requestUrl);
  url.pathname = destination;
  url.search = "";
  return url.toString();
}

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    const destination = REDIRECTS.get(pathname);

    if (destination) {
      return Response.redirect(redirectLocation(request.url, destination), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
