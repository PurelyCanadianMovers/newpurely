import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { ServiceSchema, BreadcrumbSchema } from "@/components/Schema";
import { CheckCircle, Phone, ArrowRight } from "lucide-react";

interface CityPageProps {
  city: string;
  province?: string;
  slug: string;
  isHomeBase?: boolean;
  description: string;
  heroSubtitle: string;
  whyUs: string[];
  services: string[];
  areaDescription: string;
}

export default function CityPage({
  city,
  province = "BC",
  slug,
  isHomeBase = false,
  description,
  heroSubtitle,
  whyUs,
  services,
  areaDescription,
}: CityPageProps) {
  return (
    <SiteLayout>
      <SEO
        title={`Movers in ${city}, ${province} | Purely Canadian Movers`}
        description={description}
        canonical={`/${slug}/`}
      />
      <ServiceSchema
        name={`Moving Services in ${city}, ${province}`}
        description={description}
        url={`/${slug}/`}
        serviceType="Moving Service"
      />
      <BreadcrumbSchema items={[{ name: `Movers in ${city}`, url: `/${slug}/` }]} />

      {/* Hero */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/hero-truck_dad4e475.png')" }}
        />
        <div className="relative container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">{city}</span>
            </div>
            {isHomeBase && (
              <div className="inline-flex items-center gap-2 bg-[#CC1A1A]/20 border border-[#CC1A1A]/40 rounded-full px-4 py-1.5 mb-4">
                <span className="font-body text-sm text-red-300 font-medium">Our Home Base</span>
              </div>
            )}
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">
              Movers in {city}, {province}
            </h1>
            <p className="font-body text-lg text-gray-300 mb-8 leading-relaxed">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                <Link href="/contact/">Get a Free Estimate</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-body font-semibold bg-transparent">
                <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
                Why Choose Purely Canadian Movers in {city}?
              </h2>
              <p className="font-body text-gray-600 mb-6 leading-relaxed">{areaDescription}</p>
              <ul className="space-y-3">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                    <span className="font-body text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">Services Available in {city}</h3>
              <div className="grid grid-cols-1 gap-3">
                {services.map((s) => (
                  <div key={s} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-2 h-2 rounded-full bg-[#CC1A1A] shrink-0" />
                    <span className="font-body text-sm font-semibold text-gray-800">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#CC1A1A] text-white">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Ready to Move in {city}?</h2>
          <p className="font-body text-red-200 mb-8 max-w-xl mx-auto">Get your free, no-obligation estimate from Metro Vancouver's most trusted family-owned moving company.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#CC1A1A] hover:bg-gray-100 font-body font-semibold">
              <Link href="/contact/">Get a Free Estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-body font-semibold bg-transparent">
              <a href="tel:6045227222"><Phone size={16} className="mr-2" />604-522-7222</a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
