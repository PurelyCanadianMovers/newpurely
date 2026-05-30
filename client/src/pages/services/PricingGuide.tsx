import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/Schema";
import { Phone, CheckCircle } from "lucide-react";

const factors = [
  { title: "Distance", desc: "The total distance between your origin and destination is the primary factor in cross-country pricing. BC to Ontario is approximately 4,000 km — significantly different from BC to Alberta at ~1,000 km." },
  { title: "Volume & Weight", desc: "Cross-country moves are typically priced by the weight or cubic footage of your shipment. A 2-bedroom home will cost significantly less to move than a 5-bedroom house." },
  { title: "Packing Services", desc: "If you opt for our full packing service, this adds to the total cost but saves significant time and ensures professional protection for your items." },
  { title: "Time of Year", desc: "Summer (May–September) is peak moving season and typically commands higher rates. Moving in fall or winter can result in lower costs and more flexible scheduling." },
  { title: "Special Items", desc: "Pianos, antiques, artwork, and other specialty items may require additional handling, crating, or insurance — all of which affect the final price." },
  { title: "Delivery Timeline", desc: "Faster delivery windows (guaranteed dates) typically cost more than flexible delivery windows. Discuss your timeline needs when requesting your estimate." },
];

export default function PricingGuidePage() {
  return (
    <SiteLayout>
      <SEO
        title="Cross-Country Moving Cost Guide | What Affects Your Moving Price"
        description="Learn what factors affect cross-country moving costs in Canada. Purely Canadian Movers explains pricing for BC to Ontario, Quebec, and beyond. Get a free estimate."
        canonical="/x-country/"
      />
      <BreadcrumbSchema items={[{ name: "Cross-Country Moving Cost Guide", url: "/x-country/" }]} />

      <section className="bg-gray-900 py-20">
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">Cross-Country Pricing Guide</span>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Cross-Country Moving Cost Guide</h1>
            <p className="font-body text-lg text-gray-300 mb-8 leading-relaxed">
              Understanding what affects the cost of a cross-country move helps you plan your budget and make informed decisions. Here's everything you need to know.
            </p>
            <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
              <Link href="/contact/">Get a Free Estimate</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">What Affects Cross-Country Moving Costs?</h2>
              <p className="font-body text-gray-700 leading-relaxed mb-8">
                Cross-country moves are priced differently from local moves. Instead of an hourly rate, long-distance and cross-country moves are typically quoted based on a combination of factors. Understanding these factors will help you get an accurate estimate and avoid surprises.
              </p>
              <div className="space-y-6">
                {factors.map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <CheckCircle size={20} className="text-[#CC1A1A] mt-1 shrink-0" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">{f.title}</h3>
                      <p className="font-body text-gray-600 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">Typical Cross-Country Move Costs (BC)</h3>
                <p className="font-body text-sm text-gray-500 mb-4">These are approximate ranges. Your actual quote will depend on your specific move details.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-semibold text-gray-700">Route</th>
                        <th className="text-left py-2 font-semibold text-gray-700">1BR Approx.</th>
                        <th className="text-left py-2 font-semibold text-gray-700">3BR Approx.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="py-2 text-gray-700">BC to Alberta</td><td className="py-2 text-gray-600">$1,500–$3,000</td><td className="py-2 text-gray-600">$4,000–$7,000</td></tr>
                      <tr><td className="py-2 text-gray-700">BC to Ontario</td><td className="py-2 text-gray-600">$3,000–$5,500</td><td className="py-2 text-gray-600">$7,000–$12,000</td></tr>
                      <tr><td className="py-2 text-gray-700">BC to Quebec</td><td className="py-2 text-gray-600">$3,500–$6,000</td><td className="py-2 text-gray-600">$8,000–$14,000</td></tr>
                      <tr><td className="py-2 text-gray-700">BC to Maritimes</td><td className="py-2 text-gray-600">$4,000–$7,000</td><td className="py-2 text-gray-600">$9,000–$16,000</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-body text-xs text-gray-400 mt-3">*Prices are estimates only. Contact us for an accurate quote for your specific move.</p>
              </div>
            </div>
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">Get Your Exact Quote</h3>
                <p className="font-body text-sm text-gray-600 mb-4">The best way to know your exact cost is to get a free, no-obligation estimate from our team.</p>
                <Button asChild className="w-full bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold mb-3">
                  <Link href="/contact/">Request a Free Estimate</Link>
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
