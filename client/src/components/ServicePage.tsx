import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { ServiceSchema, BreadcrumbSchema } from "@/components/Schema";
import { CheckCircle, Phone } from "lucide-react";

interface ServicePageProps {
  title: string;
  slug: string;
  description: string;
  heroSubtitle: string;
  intro: string;
  features: string[];
  highlights: { title: string; desc: string }[];
  ctaText?: string;
  heroImage?: { src: string; alt: string };
  children?: React.ReactNode;
}

export default function ServicePage({
  title,
  slug,
  description,
  heroSubtitle,
  intro,
  features,
  highlights,
  ctaText = "Get a Free Estimate",
  heroImage,
  children,
}: ServicePageProps) {
  return (
    <SiteLayout>
      <SEO title={title} description={description} canonical={`/${slug}/`} />
      <ServiceSchema name={title} description={description} url={`/${slug}/`} />
      <BreadcrumbSchema items={[{ name: "Services", url: "/services/" }, { name: title, url: `/${slug}/` }]} />

      {/* Hero */}
      <section className="bg-gray-900 py-20">
        <div className="container">
          <div className={heroImage ? "grid lg:grid-cols-2 gap-10 items-center" : ""}>
            <div className={heroImage ? "" : "max-w-2xl"}>
              <div className="flex items-center gap-2 mb-4">
                <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
                <span className="text-gray-600">/</span>
                <Link href="/services/" className="font-body text-sm text-gray-400 hover:text-white">Services</Link>
                <span className="text-gray-600">/</span>
                <span className="font-body text-sm text-gray-300">{title}</span>
              </div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>
              <p className="font-body text-lg text-gray-300 mb-8 leading-relaxed">{heroSubtitle}</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                  <Link href="/contact/">{ctaText}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-body font-semibold bg-transparent">
                  <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
                </Button>
              </div>
            </div>
            {heroImage && (
              <div className="hidden lg:block">
                <img
                  src={heroImage.src}
                  alt={heroImage.alt}
                  className="rounded-xl shadow-2xl w-full object-cover max-h-80"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="font-body text-lg text-gray-700 leading-relaxed mb-8">{intro}</p>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                    <span className="font-body text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="font-body text-sm text-gray-600 mb-4">Get your free, no-obligation estimate today.</p>
                <Button asChild className="w-full bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold mb-3">
                  <Link href="/contact/">Get a Free Estimate</Link>
                </Button>
                <a href="tel:18774856683" className="block text-center font-body text-sm font-semibold text-[#CC1A1A] hover:text-[#A31515]">
                  Or call 1-877-485-6683
                </a>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-body text-xs text-gray-500 text-center">Office: Mon–Fri 9am–5pm<br />Moving Services: 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h) => (
                <Card key={h.title} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{h.title}</h3>
                    <p className="font-body text-sm text-gray-600 leading-relaxed">{h.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      {children}
    </SiteLayout>
  );
}
