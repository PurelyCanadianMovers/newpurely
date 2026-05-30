/**
 * Schema.tsx â€” JSON-LD structured data injection for SEO
 * Supports: LocalBusiness/MovingCompany, Service, BreadcrumbList, FAQPage, WebSite
 */
import { useEffect } from "react";

const BUSINESS = {
  name: "Purely Canadian Movers Inc.",
  url: "https://purelycanadianmovers.com",
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/pcm-logo_e56ce780.png",
  telephone: ["+1-877-485-6683", "+1-604-522-7222"],
  email: "esales@pcmovers.ca",
  address: {
    streetAddress: "Coquitlam",
    addressLocality: "Coquitlam",
    addressRegion: "BC",
    postalCode: "V3K",
    addressCountry: "CA",
  },
  geo: { latitude: 49.2827, longitude: -122.7932 },
  foundingYear: 1991,
  priceRange: "$$",
  openingHours: ["Mo-Fr 09:00-17:00"],
  areaServed: [
    "Vancouver", "Coquitlam", "Surrey", "Burnaby", "North Vancouver",
    "Langley", "Richmond", "New Westminster", "Port Coquitlam",
    "Port Moody", "Maple Ridge", "Pitt Meadows", "Delta", "White Rock",
    "Abbotsford", "Chilliwack", "Metro Vancouver", "Lower Mainland", "British Columbia",
  ],
  sameAs: [
    "https://share.google/8CPKIYw6TOJB1W8rX",
    "https://www.bbb.org/",
  ],
};

// â”€â”€ LocalBusiness / MovingCompany â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["MovingCompany", "LocalBusiness"],
    "@id": `${BUSINESS.url}/#organization`,
    name: BUSINESS.name,
    url: BUSINESS.url,
    logo: {
      "@type": "ImageObject",
      url: BUSINESS.logo,
    },
    image: BUSINESS.logo,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      ...BUSINESS.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    foundingDate: String(BUSINESS.foundingYear),
    priceRange: BUSINESS.priceRange,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    areaServed: BUSINESS.areaServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    sameAs: BUSINESS.sameAs,
    description:
      "Purely Canadian Movers Inc. is a family-owned moving company based in Coquitlam, BC, serving Metro Vancouver and the Lower Mainland since 1991. We offer local, long-distance, cross-country, Canadaâ€“USA, overseas, office, packing, and storage services. No subcontractors â€” ever. BBB Accredited.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Moving Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Local Moving" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Long-Distance Moving" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cross-Country Moving" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Canadaâ€“USA Moving" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Overseas Moving" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Office & Corporate Moving" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Packing & Unpacking" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Storage Solutions" } },
      ],
    },
  };
  return <JsonLd schema={schema} id="local-business-schema" />;
}

// â”€â”€ WebSite (enables Sitelinks Search Box) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS.url}/#website`,
    url: BUSINESS.url,
    name: BUSINESS.name,
    description: "Professional moving company serving Metro Vancouver since 1991.",
    publisher: { "@id": `${BUSINESS.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BUSINESS.url}/blog/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd schema={schema} id="website-schema" />;
}

// â”€â”€ Service page schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}
export function ServiceSchema({ name, description, url, serviceType }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${BUSINESS.url}${url}`,
    serviceType: serviceType ?? name,
    provider: { "@id": `${BUSINESS.url}/#organization` },
    areaServed: BUSINESS.areaServed.map((area) => ({ "@type": "City", name: area })),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${BUSINESS.url}/contact/`,
      servicePhone: BUSINESS.telephone[0],
    },
  };
  return <JsonLd schema={schema} id={`service-schema-${url.replace(/\//g, "-")}`} />;
}

// â”€â”€ BreadcrumbList â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface BreadcrumbItem { name: string; url: string }
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BUSINESS.url },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${BUSINESS.url}${item.url}`,
      })),
    ],
  };
  return <JsonLd schema={schema} id="breadcrumb-schema" />;
}

// â”€â”€ FAQPage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface FAQItem { question: string; answer: string }
export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return <JsonLd schema={schema} id="faq-schema" />;
}

// â”€â”€ Review / AggregateRating â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function AggregateRatingSchema({ ratingValue = 4.9, reviewCount = 200 }: { ratingValue?: number; reviewCount?: number }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${BUSINESS.url}/#organization`,
    name: BUSINESS.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      bestRating: "5",
      worstRating: "1",
      reviewCount: String(reviewCount),
    },
  };
  return <JsonLd schema={schema} id="aggregate-rating-schema" />;
}

// â”€â”€ Generic JSON-LD injector â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function JsonLd({ schema, id }: { schema: object; id: string }) {
  useEffect(() => {
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [schema, id]);
  return null;
}

