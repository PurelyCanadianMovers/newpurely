import { Link } from "wouter";
import { ArrowRight, CheckCircle, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema, ServiceSchema } from "@/components/Schema";

type SeoLandingPageData = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  bullets: string[];
  sections: { title: string; body: string }[];
  relatedLinks?: { label: string; href: string }[];
};

const defaultRelatedLinks = [
  { label: "Local Moving", href: "/local/" },
  { label: "Long-Distance Moving", href: "/long-distance/" },
  { label: "Cross-Country Moves", href: "/cross-country-movers/" },
  { label: "Storage Solutions", href: "/storage/" },
  { label: "Get a Free Estimate", href: "/contact/" },
];

const locationServices = [
  "Local household moves",
  "Long-distance and cross-country moves",
  "Office and commercial moving",
  "Packing, storage, and careful handling",
];

const cityNames: Record<string, string> = {
  delta: "Delta",
  "port-moody": "Port Moody",
  "white-rock": "White Rock",
  abbotsford: "Abbotsford",
  "maple-ridge": "Maple Ridge",
  "pitt-meadows": "Pitt Meadows",
};

const cityPages = Object.entries(cityNames).map(([slug, city]): SeoLandingPageData => ({
  slug,
  title: `Movers in ${city}, BC`,
  description: `Professional moving services in ${city}, BC from Purely Canadian Movers. Local, long-distance, packing, storage, and office moves from a family-owned BC moving company.`,
  eyebrow: "Lower Mainland Service Area",
  intro: `Purely Canadian Movers helps families and businesses move in ${city} and throughout the Lower Mainland. Our crews handle local moves, long-distance relocations, packing, storage coordination, and office moves with the same careful process we have used since 1991.`,
  bullets: locationServices,
  sections: [
    {
      title: `Moving help in ${city}`,
      body: `Whether you are moving within ${city}, relocating to Metro Vancouver, or planning a longer move across Canada, our team can help with planning, loading, transportation, and delivery.`,
    },
    {
      title: "Family-owned, no subcontractors",
      body: "Purely Canadian Movers is family-owned and based in Coquitlam. We focus on accountable crews, clear communication, and careful handling from estimate to delivery.",
    },
  ],
}));

const longDistanceCities = [
  "Calgary",
  "Edmonton",
  "Halifax",
  "Montreal",
  "Ottawa",
  "Toronto",
  "Victoria",
  "Vancouver",
];

const citySlug = (city: string) => city.toLowerCase().replace(/\s+/g, "-");

const longDistanceCityPages = longDistanceCities.flatMap((city): SeoLandingPageData[] => {
  const slug = citySlug(city);
  return [
    {
      slug: `long-distance-movers-${slug}`,
      title: `Long-Distance Movers ${city}`,
      description: `Long-distance moving services for ${city} relocations. Purely Canadian Movers helps plan careful, professional moves across British Columbia and Canada.`,
      eyebrow: "Long-Distance Moving",
      intro: `Planning a long-distance move involving ${city}? Purely Canadian Movers coordinates careful pickup, transport, and delivery for household and business moves across Canada.`,
      bullets: [
        "Detailed long-distance moving estimates",
        "Professional loading and protection for transport",
        "Packing options for fragile or high-value items",
        "Storage support when move dates do not line up",
      ],
      sections: [
        {
          title: `${city} long-distance moving support`,
          body: "Long-distance moves need planning around access, timing, inventory, and delivery windows. Our team helps you prepare the details before moving day so the process is smoother.",
        },
        {
          title: "Built for Canadian routes",
          body: "We support moves across provincial lines, including popular Western Canada, Ontario, Quebec, Atlantic Canada, and Vancouver Island routes.",
        },
      ],
    },
    {
      slug: `${slug}-long-distance-movers`,
      title: `${city} Long-Distance Movers`,
      description: `Professional ${city} long-distance movers for household and business relocations across Canada. Request a free estimate from Purely Canadian Movers.`,
      eyebrow: "Long-Distance Moving",
      intro: `Purely Canadian Movers provides long-distance moving support for customers moving to, from, or through ${city}. We help with planning, careful loading, transport coordination, and storage options.`,
      bullets: [
        "Free no-obligation estimates",
        "Local and long-distance moving crews",
        "Packing and storage options",
        "Family-owned moving company since 1991",
      ],
      sections: [
        {
          title: `Moving to or from ${city}`,
          body: "Every long-distance route has different timing, access, and inventory needs. We tailor the estimate and move plan to your origin, destination, shipment size, and schedule.",
        },
        {
          title: "Care from start to finish",
          body: "Our team focuses on preparation, protection, and clear communication so your belongings are handled carefully through the full move.",
        },
      ],
    },
  ];
});

const routePairs = [
  ["Calgary", "Edmonton"],
  ["Calgary", "Toronto"],
  ["Calgary", "Vancouver"],
  ["Edmonton", "Calgary"],
  ["Edmonton", "Toronto"],
  ["Edmonton", "Vancouver"],
  ["Halifax", "Toronto"],
  ["Montreal", "Calgary"],
  ["Montreal", "Edmonton"],
  ["Montreal", "Toronto"],
  ["Montreal", "Vancouver"],
  ["Montreal", "Victoria"],
  ["Ottawa", "Calgary"],
  ["Ottawa", "Edmonton"],
  ["Ottawa", "Toronto"],
  ["Ottawa", "Vancouver"],
  ["Ottawa", "Victoria"],
  ["Toronto", "Calgary"],
  ["Toronto", "Edmonton"],
  ["Toronto", "Montreal"],
  ["Toronto", "Vancouver"],
  ["Toronto", "Victoria"],
  ["Vancouver", "Calgary"],
  ["Vancouver", "Montreal"],
  ["Vancouver", "Toronto"],
  ["Victoria", "Vancouver"],
];

const routePages = routePairs.flatMap(([from, to]): SeoLandingPageData[] => {
  const fromSlug = citySlug(from);
  const toSlug = citySlug(to);
  const data: SeoLandingPageData = {
    slug: `movers-${fromSlug}-to-${toSlug}`,
    title: `Movers from ${from} to ${to}`,
    description: `Moving from ${from} to ${to}? Purely Canadian Movers provides long-distance moving estimates, packing, storage, and careful transport across Canada.`,
    eyebrow: "Route Moving Services",
    intro: `A move from ${from} to ${to} takes coordination, careful packing, and a realistic plan for timing and delivery. Purely Canadian Movers helps customers prepare for long-distance moves across Canada with clear estimates and experienced moving support.`,
    bullets: [
      `Long-distance moving from ${from} to ${to}`,
      "Packing and protection for transport",
      "Storage options when needed",
      "Free estimate before you book",
    ],
    sections: [
      {
        title: `${from} to ${to} moving estimates`,
        body: "Long-distance pricing depends on distance, shipment size, access, timing, and services such as packing or storage. Request a free estimate so the team can quote the move accurately.",
      },
      {
        title: "Careful Canadian long-distance moves",
        body: "We help plan the practical details: inventory, pickup conditions, delivery access, move windows, and protection for furniture and fragile belongings.",
      },
    ],
  };

  const alternateData: SeoLandingPageData = {
    ...data,
    slug: `${fromSlug}-to-${toSlug}-movers`,
    title: `${from} to ${to} Movers`,
  };

  return [data, alternateData];
});

const guidePages: SeoLandingPageData[] = [
  {
    slug: "long-distance-moving-cost-canada",
    title: "Long-Distance Moving Cost in Canada",
    description: "Learn what affects long-distance moving costs in Canada, including distance, shipment size, packing, storage, timing, and access conditions.",
    eyebrow: "Moving Cost Guide",
    intro: "Long-distance moving costs in Canada vary based on the size of your shipment, the distance travelled, access at each address, packing needs, storage, timing, and the level of service required.",
    bullets: [
      "Shipment size and weight or volume",
      "Distance between pickup and delivery",
      "Packing, storage, and specialty handling",
      "Access conditions such as stairs, elevators, and parking",
    ],
    sections: [
      {
        title: "Why estimates vary",
        body: "A studio move across one province and a full household move across the country require very different equipment, labour, and planning. A proper estimate gives the moving team enough detail to price the route responsibly.",
      },
      {
        title: "How to get an accurate quote",
        body: "Prepare an inventory, note large or fragile items, share access details for both addresses, and mention any storage or packing needs before requesting your estimate.",
      },
    ],
  },
  {
    slug: "average-cost-of-long-distance-move-in-canada",
    title: "Average Cost of a Long-Distance Move in Canada",
    description: "Learn what affects the average cost of a long-distance move in Canada, including distance, shipment size, packing, storage, timing, and access conditions.",
    eyebrow: "Moving Cost Guide",
    intro: "Long-distance moving costs in Canada vary based on the size of your shipment, the distance travelled, access at each address, packing needs, storage, timing, and the level of service required.",
    bullets: [
      "Shipment size and weight or volume",
      "Distance between pickup and delivery",
      "Packing, storage, and specialty handling",
      "Access conditions such as stairs, elevators, and parking",
    ],
    sections: [
      {
        title: "Why estimates vary",
        body: "A studio move across one province and a full household move across the country require very different equipment, labour, and planning. A proper estimate gives the moving team enough detail to price the route responsibly.",
      },
      {
        title: "How to get an accurate quote",
        body: "Prepare an inventory, note large or fragile items, share access details for both addresses, and mention any storage or packing needs before requesting your estimate.",
      },
    ],
  },
  {
    slug: "cross-country-moving-guide",
    title: "Cross-Country Moving Guide",
    description: "A practical guide to planning a cross-country move in Canada, from estimates and packing to delivery timing and storage.",
    eyebrow: "Moving Guide",
    intro: "Cross-country moves need more planning than a local move. A good plan covers your inventory, packing timeline, access details, delivery window, storage needs, and the documents or essentials you keep with you.",
    bullets: [
      "Start planning several weeks ahead",
      "Create a room-by-room inventory",
      "Pack fragile items for longer transport",
      "Confirm pickup and delivery access early",
    ],
    sections: [
      {
        title: "Prepare for the distance",
        body: "Longer routes mean belongings are in transit longer and may be handled through more logistics steps. Good packing and clear labelling make the move easier at both ends.",
      },
      {
        title: "Build in flexibility",
        body: "Weather, route timing, building access, and storage needs can affect cross-country moves. Keep important documents, medication, chargers, and first-night essentials with you.",
      },
    ],
  },
  {
    slug: "valuation-coverage-protection",
    title: "Valuation Coverage and Moving Protection",
    description: "Understand moving valuation coverage, protection options, and how to prepare belongings for a safer move.",
    eyebrow: "Moving Protection",
    intro: "Moving protection starts with careful packing, trained handling, and a clear understanding of valuation coverage. Ask about available coverage options before your move so you know what is included.",
    bullets: [
      "Discuss coverage before moving day",
      "Identify high-value or fragile belongings",
      "Use professional packing for delicate items",
      "Keep records and photos for important pieces",
    ],
    sections: [
      {
        title: "Valuation is not the same as insurance",
        body: "Moving valuation describes a carrier's liability for goods in transit. If you have high-value belongings, ask what coverage applies and whether additional protection is recommended.",
      },
      {
        title: "Reduce risk with preparation",
        body: "Good packing, accurate inventory notes, and clear communication about fragile items help protect your belongings through loading, transport, and delivery.",
      },
    ],
  },
  {
    slug: "bc-to-washington-movers",
    title: "BC to Washington Movers",
    description: "Cross-border moving support for British Columbia to Washington State moves, including planning, packing, and route coordination.",
    eyebrow: "Canada-USA Moving",
    intro: "Moving from BC to Washington State involves cross-border planning, timing, inventory preparation, and careful packing. Purely Canadian Movers can help you prepare for the route and request a detailed estimate.",
    bullets: [
      "BC to Washington moving estimates",
      "Packing support for cross-border transport",
      "Guidance on move planning and inventory details",
      "Storage options when dates do not align",
    ],
    sections: [
      {
        title: "Plan the border details early",
        body: "Cross-border moves can require additional documentation and timing coordination. Start early and share destination, access, inventory, and timing details when requesting an estimate.",
      },
      {
        title: "Popular Lower Mainland route",
        body: "BC to Washington is a common cross-border route for customers leaving Metro Vancouver and the Lower Mainland.",
      },
    ],
  },
  {
    slug: "great-canadian-vanlines-agent",
    title: "Great Canadian Van Lines Agent",
    description: "Purely Canadian Movers supports long-distance moves through experienced Canadian moving networks and careful local service.",
    eyebrow: "Long-Distance Network",
    intro: "Purely Canadian Movers helps customers plan local and long-distance moves with careful local service and access to Canadian long-distance moving support.",
    bullets: [
      "Local Metro Vancouver moving experience",
      "Long-distance move planning",
      "Packing and storage options",
      "Family-owned service since 1991",
    ],
    sections: [
      {
        title: "Local accountability, national reach",
        body: "A successful long-distance move needs local preparation and reliable route coordination. Our team helps bridge those needs for customers moving across Canada.",
      },
      {
        title: "Start with a detailed estimate",
        body: "Share your origin, destination, inventory, timing, and storage needs so the estimate can reflect the real scope of your move.",
      },
    ],
  },
  {
    slug: "our-network",
    title: "Our Moving Network",
    description: "Learn how Purely Canadian Movers supports local, long-distance, cross-country, and international moves through trusted moving processes.",
    eyebrow: "Moving Network",
    intro: "From local moves in Metro Vancouver to long-distance relocations across Canada, Purely Canadian Movers focuses on reliable planning, clear estimates, and careful handling.",
    bullets: [
      "Metro Vancouver and Lower Mainland service",
      "Cross-country moving support",
      "Canada-USA and overseas moving options",
      "Packing, storage, and office moving services",
    ],
    sections: [
      {
        title: "Built around customer care",
        body: "Our service model is built on accountability: no subcontractors for local work, careful crews, and practical planning before moving day.",
      },
      {
        title: "Support for complex moves",
        body: "Longer routes, cross-border moves, and storage needs require coordination. We help customers understand the options before they book.",
      },
    ],
  },
];

const allPages = [...cityPages, ...longDistanceCityPages, ...routePages, ...guidePages];

export const seoLandingPages = new Map(allPages.map((page) => [page.slug, page]));

export function SeoLandingRoute({ slug }: { slug: string }) {
  const page = seoLandingPages.get(slug);
  if (!page) return null;
  return <SeoLandingPage page={page} />;
}

function SeoLandingPage({ page }: { page: SeoLandingPageData }) {
  const relatedLinks = page.relatedLinks ?? defaultRelatedLinks;

  return (
    <SiteLayout>
      <SEO title={page.title} description={page.description} canonical={`/${page.slug}/`} />
      <ServiceSchema name={page.title} description={page.description} url={`/${page.slug}/`} />
      <BreadcrumbSchema items={[{ name: page.title, url: `/${page.slug}/` }]} />

      <section className="relative overflow-hidden bg-gray-900 py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/hero-truck_dad4e475.png')" }}
        />
        <div className="relative container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">{page.eyebrow}</span>
            </div>
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-red-300 mb-3">{page.eyebrow}</p>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-5">{page.title}</h1>
            <p className="font-body text-lg leading-relaxed text-gray-300 mb-8">{page.intro}</p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                <Link href="/contact/">Get a Free Estimate</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent font-body font-semibold">
                <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">What to Expect</h2>
              <ul className="grid gap-3 mb-10 sm:grid-cols-2">
                {page.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-[#CC1A1A]" />
                    <span className="font-body text-sm font-semibold text-gray-800">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-8">
                {page.sections.map((section) => (
                  <div key={section.title}>
                    <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
                    <p className="font-body text-gray-700 leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside>
              <Card className="border-0 shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-[#CC1A1A]">
                    <ShieldCheck size={20} />
                    <h2 className="font-heading text-xl font-bold text-gray-900">Request an Estimate</h2>
                  </div>
                  <p className="font-body text-sm leading-relaxed text-gray-600 mb-5">
                    Tell us where you are moving, what you are moving, and when you would like to move. We will help you plan the next step.
                  </p>
                  <Button asChild className="w-full bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold mb-3">
                    <Link href="/contact/">Get a Free Estimate</Link>
                  </Button>
                  <a href="tel:6045227222" className="flex items-center justify-center gap-2 font-body text-sm font-semibold text-[#CC1A1A] hover:text-[#A31515]">
                    <Phone size={15} /> 604-522-7222
                  </a>
                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Related Pages</h3>
                    <div className="space-y-2">
                      {relatedLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-md px-3 py-2 font-body text-sm text-gray-700 hover:bg-red-50 hover:text-[#CC1A1A]">
                          <span>{link.label}</span>
                          <ArrowRight size={14} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Truck, title: "Since 1991", body: "Family-owned moving service based in Coquitlam, BC." },
              { icon: MapPin, title: "Metro Vancouver", body: "Serving the Lower Mainland plus long-distance routes across Canada." },
              { icon: ShieldCheck, title: "Careful Handling", body: "Packing, storage, and moving support for residential and business moves." },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <item.icon size={24} className="text-[#CC1A1A] mb-4" />
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-gray-600">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
