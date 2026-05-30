import { Link } from "wouter";
import { ArrowRight, CheckCircle, MapPin, Network, Phone, ShieldCheck, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema, FAQSchema } from "@/components/Schema";

const networkBenefits = [
  "Coordinated excellence across all provinces",
  "Local expertise in every major city",
  "Seamless long-distance coordination",
  "Consistent professional standards",
];

const stats = [
  { value: "35+", label: "Agent Locations" },
  { value: "7", label: "Provinces Covered" },
  { value: "Coast-to-Coast", label: "Coverage" },
];

const networkCards = [
  {
    icon: ShieldCheck,
    title: "Coordinated Excellence",
    body: "Every move is handled by trained GCVL agents who follow the same high standards. Your belongings are in expert hands from start to finish.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    body: "Our agents know their communities. They understand local building codes, parking restrictions, and neighborhood logistics.",
  },
  {
    icon: Truck,
    title: "Seamless Long-Distance Moves",
    body: "Moving across provinces? Our network ensures smooth coordination between pickup and delivery locations with no gaps in service.",
  },
  {
    icon: Users,
    title: "Reliability You Can Trust",
    body: "Backed by Great Canadian Van Lines' reputation and standards, we deliver consistent, professional service every time.",
  },
];

const agentLocations = [
  {
    province: "British Columbia",
    cities: [
      "Burnaby",
      "Chilliwack",
      "Coquitlam",
      "Gaibaldi Highlands",
      "Kamloops",
      "Kelowna",
      "Nanaimo",
      "Nelson",
      "North Vancouver",
      "Parksville",
      "Prince George",
      "Richmond",
      "Summerland",
      "Surrey",
      "Victoria",
    ],
  },
  {
    province: "Alberta",
    cities: ["Calgary", "Edmonton", "Grande Prairie", "Lethbridge", "Red Deer", "Wetaskiwin"],
  },
  {
    province: "Saskatchewan",
    cities: ["Saskatoon"],
  },
  {
    province: "Manitoba",
    cities: ["Winnipeg"],
  },
  {
    province: "Ontario",
    cities: ["Belleville", "Guelph", "Holland Landing", "London", "Mississauga", "North Bay", "North York", "Oakville", "Ottawa", "Toronto"],
  },
  {
    province: "Quebec",
    cities: ["Anjou"],
  },
  {
    province: "Prince Edward Island",
    cities: ["Charlottetown"],
  },
];

const faqs = [
  {
    question: "What's the difference between Purely Canadian Movers and Great Canadian Van Lines?",
    answer:
      "Purely Canadian Movers is a family-owned agent of Great Canadian Van Lines. We provide personalized, local service in Metro Vancouver while having access to GCVL's nationwide network of 40+ agents for long-distance and cross-country moves.",
  },
  {
    question: "Do you handle moves to all provinces?",
    answer:
      "Yes! We have agents in British Columbia, Alberta, Saskatchewan, Manitoba, Ontario, Quebec, and Prince Edward Island. If you're moving anywhere in Canada, we can help coordinate your move.",
  },
  {
    question: "How does the coordination work for long-distance moves?",
    answer:
      "We work directly with GCVL agents at your destination to ensure seamless handoff. Your move is tracked from pickup to delivery, with direct communication between all parties involved.",
  },
  {
    question: "Are all GCVL agents held to the same standards?",
    answer:
      "Absolutely. All GCVL agents, including Purely Canadian Movers, follow the same quality standards and training. This ensures consistent, professional service regardless of which agent handles your move.",
  },
];

export default function OurNetworkPage() {
  return (
    <SiteLayout>
      <SEO
        title="Our Network - 40+ GCVL Agents Across Canada | Purely Canadian Movers"
        description="Purely Canadian Movers is backed by Great Canadian Van Lines agents across Canada, providing coast-to-coast long-distance moving coverage with local expertise."
        canonical="/our-network/"
      />
      <BreadcrumbSchema items={[{ name: "Our Network", url: "/our-network/" }]} />
      <FAQSchema faqs={faqs} />

      <section className="relative overflow-hidden bg-gray-900 py-20 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/hero-truck_dad4e475.png')" }}
        />
        <div className="relative container">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-5">
                <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
                <span className="text-gray-600">/</span>
                <span className="font-body text-sm text-gray-300">Our Network</span>
              </div>
              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white mb-6">Our National Network</h1>
              <p className="font-body text-lg text-gray-200 leading-relaxed max-w-2xl mb-8">
                Backed by 35+ Great Canadian Van Lines agents across Canada. Coast-to-coast coverage with local expertise in every major city.
              </p>
              <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                <Link href="/contact/">Get Your Free Moving Estimate <ArrowRight size={18} className="ml-2" /></Link>
              </Button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-xl">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-5">Why Choose Our Network?</h2>
              <ul className="space-y-4">
                {networkBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle size={20} className="mt-0.5 shrink-0 text-[#CC1A1A]" />
                    <span className="font-body text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 border-b border-gray-100">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <div className="font-heading text-3xl lg:text-4xl font-bold text-[#CC1A1A] mb-2">{stat.value}</div>
                <div className="font-body text-sm font-semibold text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Why Our Network Matters</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {networkCards.map((item) => (
              <Card key={item.title} className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                    <item.icon size={24} className="text-[#CC1A1A]" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-gray-600">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="mb-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
              <Network size={24} className="text-[#CC1A1A]" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Agent Locations Across Canada</h2>
            <p className="font-body text-gray-600 max-w-3xl leading-relaxed">
              Our Great Canadian Van Lines network gives your move local support at pickup and destination, with agents across major Canadian markets.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agentLocations.map((group) => (
              <Card key={group.province} className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">{group.province}</h3>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.cities.map((city) => (
                      <li key={city} className="flex items-center gap-2 font-body text-sm text-gray-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#CC1A1A]" />
                        {city}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#CC1A1A] text-white">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready for Your Next Move?</h2>
          <p className="font-body text-red-100 max-w-2xl mx-auto mb-8">
            Whether you're moving across the street or across the country, we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#CC1A1A] hover:bg-gray-100 font-body font-semibold">
              <Link href="/contact/">Get Free Estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-body font-semibold bg-transparent">
              <Link href="/contact/">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="font-body text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild size="lg" variant="outline" className="border-[#CC1A1A] text-[#CC1A1A] hover:bg-[#CC1A1A] hover:text-white font-body font-semibold">
                <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
