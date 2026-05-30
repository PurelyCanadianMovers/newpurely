import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema, ServiceSchema } from "@/components/Schema";
import { CheckCircle, Phone, ArrowRight, MapPin } from "lucide-react";

const cities = [
  {
    name: "Vancouver",
    href: "/local-movers-in-vancouver-bc/",
    label: "Local Movers in Vancouver, BC",
    desc: "High-rise condo specialists. We know every neighbourhood from Kitsilano to East Van.",
  },
  {
    name: "Coquitlam",
    href: "/local-movers-in-coquitlam-bc/",
    label: "Local Movers in Coquitlam, BC",
    desc: "Our home base since 1991. Unmatched local knowledge across the Tri-Cities.",
  },
  {
    name: "Surrey",
    href: "/surrey/",
    label: "Movers in Surrey, BC",
    desc: "Serving all Surrey neighbourhoods — Cloverdale, Newton, Fleetwood, and more.",
  },
  {
    name: "Burnaby",
    href: "/burnaby/",
    label: "Movers in Burnaby, BC",
    desc: "Experienced with Burnaby's mix of high-rises, townhomes, and single-family homes.",
  },
  {
    name: "North Vancouver",
    href: "/north-vancouver/",
    label: "Movers in North Vancouver, BC",
    desc: "Navigating the North Shore's hills and tight streets with care and efficiency.",
  },
  {
    name: "Langley",
    href: "/langley/",
    label: "Movers in Langley, BC",
    desc: "Covering Langley City and Township — acreages, townhomes, and everything in between.",
  },
  {
    name: "Richmond",
    href: "/richmond/",
    label: "Movers in Richmond, BC",
    desc: "Reliable moves across Richmond's diverse residential and commercial areas.",
  },
  {
    name: "New Westminster",
    href: "/new-westminster/",
    label: "Movers in New Westminster, BC",
    desc: "Expert moves in BC's oldest city — heritage homes, condos, and everything in between.",
  },
];

export default function LocalMovingPage() {
  return (
    <SiteLayout>
      <SEO
        title="Local Moving Services Metro Vancouver | Purely Canadian Movers"
        description="Professional local moving services across Metro Vancouver. Hourly rates, experienced crew, no subcontractors. Serving Vancouver, Coquitlam, Surrey, Burnaby and more. Call 1-877-485-6683."
        canonical="/local/"
      />
      <ServiceSchema
        name="Local Moving Services in Metro Vancouver"
        description="Professional local moving services across Metro Vancouver with hourly rates, experienced crews, and no subcontractors."
        url="/local/"
        serviceType="Local Moving Service"
      />
      <BreadcrumbSchema items={[{ name: "Services", url: "/services/" }, { name: "Local Moving", url: "/local/" }]} />

      <section className="bg-gray-900 py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
                <span className="text-gray-600">/</span>
                <span className="font-body text-sm text-gray-300">Local Moving</span>
              </div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Local Moving Services in Metro Vancouver</h1>
              <p className="font-body text-lg text-gray-300 mb-8 leading-relaxed">
                Expert local moves across the Lower Mainland. Hourly rates, professional crew, and the peace of mind that comes from 30+ years of experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                  <Link href="/contact/">Get a Free Estimate</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-body font-semibold bg-transparent">
                  <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/Trucks33and34_ff8dc052.jpg"
                alt="Two Purely Canadian Movers trucks at a residential move in Metro Vancouver"
                className="rounded-xl shadow-2xl w-full object-cover max-h-80"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="font-body text-lg text-gray-700 leading-relaxed mb-6">
                Whether you're moving from a studio apartment in Kitsilano to a townhome in Coquitlam, or relocating your family from one end of Metro Vancouver to the other, Purely Canadian Movers delivers the same professional, careful service every time.
              </p>
              <p className="font-body text-gray-700 leading-relaxed mb-8">
                Our local moves are billed hourly, with transparent rates and no hidden fees. You only pay for the time it takes — and our experienced crew works efficiently to keep your costs down without cutting corners.
              </p>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">What's Included in Every Local Move</h2>
              <ul className="space-y-3 mb-8">
                {[
                  "Professional, uniformed moving crew (our own employees — no subcontractors)",
                  "Fully equipped moving truck with blankets, straps, and dollies",
                  "Careful disassembly and reassembly of furniture",
                  "Floor and door frame protection",
                  "Transparent hourly billing — no hidden fees",
                  "Full liability coverage on all items",
                  "Flexible scheduling including evenings and weekends",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#CC1A1A] mt-0.5 shrink-0" />
                    <span className="font-body text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">Cities We Serve</h2>
              <p className="font-body text-gray-600 mb-6">
                We serve all of Metro Vancouver and the Lower Mainland. Select your city for local moving details, pricing, and neighbourhood-specific information.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cities.map((c) => (
                  <Link key={c.href} href={c.href} className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#CC1A1A] hover:bg-red-50 transition-all group">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#CC1A1A] shrink-0" />
                      <span className="font-body text-sm font-bold text-gray-900 group-hover:text-[#CC1A1A]">{c.label}</span>
                      <ArrowRight size={12} className="text-gray-400 group-hover:text-[#CC1A1A] ml-auto shrink-0" />
                    </div>
                    <p className="font-body text-xs text-gray-500 leading-relaxed pl-5">{c.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">Get a Free Estimate</h3>
                <p className="font-body text-sm text-gray-600 mb-4">Tell us about your move and we'll provide a no-obligation quote.</p>
                <Button asChild className="w-full bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold mb-3">
                  <Link href="/contact/">Request an Estimate</Link>
                </Button>
                <a href="tel:18774856683" className="block text-center font-body text-sm font-semibold text-[#CC1A1A] hover:text-[#A31515]">
                  Or call 1-877-485-6683
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
