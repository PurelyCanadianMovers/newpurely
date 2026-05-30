import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Purely Canadian Movers";
const SITE_URL = "https://purelycanadianmovers.com";
const DEFAULT_DESCRIPTION = "Purely Canadian Movers — family-owned moving company serving Metro Vancouver since 1991. Local, long-distance, cross-country, and international moves. No subcontractors. BBB Accredited. Call 1-877-485-6683.";
const DEFAULT_OG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/hero-truck_dad4e475.png";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Professional Moving Company Vancouver BC Since 1991`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta description
    setMeta("description", description);

    // Canonical
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = `${SITE_URL}${canonical}`;
    }

    // Open Graph
    setOgMeta("og:title", fullTitle);
    setOgMeta("og:description", description);
    setOgMeta("og:type", ogType);
    setOgMeta("og:image", ogImage);
    setOgMeta("og:site_name", SITE_NAME);
    if (canonical) setOgMeta("og:url", `${SITE_URL}${canonical}`);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // Robots
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  }, [fullTitle, description, canonical, ogImage, ogType, noIndex]);

  return null;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setOgMeta(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}
