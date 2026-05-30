import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema, ServiceSchema } from "@/components/Schema";
import { Truck, MapPin, Globe, Package, Building, Home, ArrowRight, Phone } from "lucide-react";

const services = [
  { icon: Home, title: "Local Moving", desc: "Expert local moves across Metro Vancouver. Hourly rates, professional crew, no hidden fees.", href: "/local/", cta: "Learn About Local Moving" },
  { icon: MapPin, title: "Long-Distance Moving", desc: "Reliable cross-province moves with careful handling and on-time delivery across Canada.", href: "/long-distance/", cta: "Learn About Long-Distance" },
  { icon: Truck, title: "Cross-Country Moves", desc: "Coast-to-coast Canadian moves handled with the same care as your local move.", href: "/cross-country-movers/", cta: "Learn About Cross-Country" },
  { icon: Globe, title: "Canada–USA Moves", desc: "Cross-border relocations with full customs documentation support and experienced border-crossing logistics.", href: "/canada-usa/", cta: "Learn About Canada–USA" },
  { icon: Globe, title: "Overseas Moving", desc: "International relocations to any destination worldwide, coordinated by our experienced team.", href: "/overseas/", cta: "Learn About Overseas Moving" },
  { icon: Package, title: "Storage Solutions", desc: "Secure short-term and long-term storage at our Coquitlam facility. Flexible terms, competitive rates.", href: "/storage/", cta: "Learn About Storage" },
  { icon: Building, title: "Office & Corporate Moves", desc: "Minimal-disruption office relocations planned around your business schedule. Weekend moves available.", href: "/office/", cta: "Learn About Office Moves" },
  { icon: Package, title: "Packing & Unpacking", desc: "Full-service packing and unpacking using professional-grade materials. We handle everything.", href: "/packing/", cta: "Learn About Packing" },
];

export default function ServicesHubPage() {
  return (
    <SiteLayout>
      <SEO
        title="Moving Services | Local, Long-Distance, Cross-Country & International"
        description="Purely Canadian Movers offers local, long-distance, cross-country, Canada–USA, overseas, storage, office, and packing services across Metro Vancouver. Call 1-877-485-6683."
        canonical="/services/"
      />
      <ServiceSchema
        name="Moving Services"
        description="Local, long-distance, cross-country, Canada-USA, overseas, storage, office, and packing services across Metro Vancouver."
        url="/services/"
        serviceType="Moving Service"
      />
      <BreadcrumbSchema items={[{ name: "Services", url: "/services/" }]} />

      {/* Hero */}
      <section className="bg-gray-900 py-20">
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">Services</span>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Our Moving Services</h1>
            <p className="font-body text-lg text-gray-300 mb-8 leading-relaxed">
              From a single-bedroom condo move across town to a full corporate relocation across the country — Purely Canadian Movers handles it all with the same family-owned care and professionalism.
            </p>
            <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
              <Link href="/contact/">Get a Free Estimate</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((s) => (
              <Card key={s.title} className="border border-gray-200 hover:border-[#CC1A1A] hover:shadow-lg transition-all group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-[#CC1A1A] flex items-center justify-center mb-4 transition-colors">
                    <s.icon size={22} className="text-[#CC1A1A] group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:text-[#CC1A1A] transition-colors">{s.title}</h2>
                  <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">{s.desc}</p>
                  <Link href={s.href} className="font-body text-sm font-semibold text-[#CC1A1A] flex items-center gap-1 hover:gap-2 transition-all">
                    {s.cta} <ArrowRight size={14} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#CC1A1A] text-white">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Not Sure Which Service You Need?</h2>
          <p className="font-body text-red-200 mb-8 max-w-xl mx-auto">Call us or fill out our estimate form and we'll help you figure out exactly what your move requires — no pressure, no obligation.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#CC1A1A] hover:bg-gray-100 font-body font-semibold">
              <Link href="/contact/">Get a Free Estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-body font-semibold bg-transparent">
              <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
