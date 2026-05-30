import { Link } from "wouter";
import { Calculator, CheckCircle, Clock, Home, MapPin, Package, Phone, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema, FAQSchema } from "@/components/Schema";

const factors = [
  "Total weight or volume of your belongings",
  "Distance between origin and destination",
  "Type of home: studio, apartment, townhouse, or house",
  "Access conditions such as stairs, elevators, parking, or rural access",
  "Packing, storage, valuation coverage, or specialty services",
  "Seasonal demand, especially peak summer moving dates",
];

const homeCosts = [
  ["Studio apartment", "Starting at $2,500"],
  ["1-bedroom apartment", "$3,800 - $5,300"],
  ["2-bedroom home", "$6,300 - $7,000"],
  ["3-4 bedroom home", "$10,000+ - $15,000+"],
];

const routes = [
  ["Vancouver -> Toronto", "$2,500", "$4,700", "$6,500", "$10,000", "$15,000"],
  ["Toronto -> Vancouver", "$2,500", "$4,700", "$6,500", "$10,000", "$15,000"],
  ["Victoria/Nanaimo -> Toronto", "$3,000", "$5,300", "$7,000", "$11,000", "$16,000"],
  ["Toronto -> Victoria/Nanaimo", "$3,000", "$5,300", "$7,000", "$11,000", "$16,000"],
  ["Vancouver -> Ottawa", "$2,500", "$4,700", "$6,500", "$10,000", "$15,000"],
  ["Ottawa -> Vancouver", "$2,500", "$4,700", "$6,500", "$10,000", "$15,000"],
  ["Victoria/Nanaimo -> Ottawa", "$3,000", "$5,300", "$7,000", "$11,000", "$16,000"],
  ["Ottawa -> Victoria/Nanaimo", "$3,000", "$5,300", "$7,000", "$11,000", "$16,000"],
  ["Vancouver -> Calgary", "$2,000", "$2,600", "$3,500", "$4,800", "$6,500"],
  ["Calgary -> Vancouver", "$2,000", "$2,600", "$3,500", "$4,800", "$6,500"],
  ["Vancouver -> Edmonton", "$2,200", "$2,800", "$3,800", "$5,200", "$7,000"],
  ["Edmonton -> Vancouver", "$2,200", "$2,800", "$3,800", "$5,200", "$7,000"],
  ["Toronto -> Calgary", "$2,500", "$3,800", "$6,400", "$10,000", "$15,000"],
  ["Calgary -> Toronto", "$2,500", "$3,800", "$6,400", "$10,000", "$15,000"],
  ["Toronto -> Edmonton", "$2,500", "$3,800", "$6,400", "$10,000", "$15,000"],
  ["Edmonton -> Toronto", "$2,500", "$3,800", "$6,400", "$10,000", "$15,000"],
  ["Ottawa -> Calgary", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Calgary -> Ottawa", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Ottawa -> Edmonton", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Edmonton -> Ottawa", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Montreal -> Calgary", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Calgary -> Montreal", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Montreal -> Edmonton", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Edmonton -> Montreal", "$2,500", "$4,700", "$6,300", "$10,000", "$15,000"],
  ["Montreal -> Vancouver", "$2,500", "$4,700", "$6,400", "$10,000", "$15,000"],
  ["Vancouver -> Montreal", "$2,500", "$4,700", "$6,400", "$10,000", "$15,000"],
  ["Montreal -> Victoria/Nanaimo", "$3,000", "$5,300", "$7,000", "$11,000", "$16,000"],
  ["Victoria/Nanaimo -> Montreal", "$3,000", "$5,300", "$7,000", "$11,000", "$16,000"],
  ["Toronto -> Montreal", "$2,300", "$3,900", "$5,200", "$8,300", "$12,000"],
  ["Montreal -> Toronto", "$2,300", "$3,900", "$5,200", "$8,300", "$12,000"],
  ["Toronto -> Ottawa", "$800", "$1,100", "$1,500", "$2,000", "$2,800"],
  ["Ottawa -> Toronto", "$800", "$1,100", "$1,500", "$2,000", "$2,800"],
  ["Calgary -> Edmonton", "$800", "$1,100", "$1,500", "$2,000", "$2,800"],
  ["Edmonton -> Calgary", "$800", "$1,100", "$1,500", "$2,000", "$2,800"],
  ["Halifax -> Toronto", "$2,200", "$2,900", "$3,900", "$5,300", "$7,000"],
  ["Toronto -> Halifax", "$2,200", "$2,900", "$3,900", "$5,300", "$7,000"],
];

const faqs = [
  {
    question: "How much does a long-distance move cost in Canada?",
    answer: "Long-distance moving costs in Canada typically range from $2,500 to $16,000+ depending on route, shipment size, access, packing, storage, and timing.",
  },
  {
    question: "Why do long-distance moving quotes vary so much?",
    answer: "Pricing changes because every shipment has a different weight, route, access condition, delivery window, and service level. A detailed inventory is the best way to get an accurate quote.",
  },
  {
    question: "Are these route prices guaranteed?",
    answer: "No. The route table is an estimate for planning. Your final quote depends on your specific inventory, addresses, timing, and requested services.",
  },
  {
    question: "Do you offer packing and storage?",
    answer: "Yes. Purely Canadian Movers offers packing, unpacking, storage, and specialty handling for long-distance moves.",
  },
];

function CostGuideContent({ canonical }: { canonical: string }) {
  return (
    <SiteLayout>
      <SEO
        title="Long Distance Moving Costs in Canada | Purely Canadian Movers"
        description="Understand real pricing for moving between provinces and across Canada. See estimated long-distance moving costs by home size and popular Canadian routes."
        canonical={canonical}
      />
      <BreadcrumbSchema items={[{ name: "Long Distance Moving Costs in Canada", url: canonical }]} />
      <FAQSchema faqs={faqs} />

      <section className="bg-gray-900 py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
                <span className="text-gray-600">/</span>
                <span className="font-body text-sm text-gray-300">Moving Cost Guide</span>
              </div>
              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white mb-5">Long Distance Moving Costs in Canada</h1>
              <p className="font-body text-lg text-gray-300 leading-relaxed mb-8">
                Understand real pricing for moving between provinces and across Canada - with no hidden fees or surprises.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                  <Link href="/contact/">Get an Accurate Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-body font-semibold bg-transparent">
                  <a href="tel:18774856683"><Phone size={16} className="mr-2" />1-877-485-6683</a>
                </Button>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-xl">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-5">Quick Answer</h2>
              <p className="font-body text-gray-700 leading-relaxed mb-4">
                Long-distance moving costs in Canada typically range from <strong>$2,500 to $16,000+</strong>, depending on home size, weight, and distance.
              </p>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="font-body text-sm font-semibold text-[#CC1A1A]">Studio apartment moves start at $2,500.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-5">What is a Long-Distance Move in Canada?</h2>
                <div className="space-y-4 font-body text-gray-700 leading-relaxed">
                  <p>A long-distance move in Canada is typically any relocation over 100 km or any move between provinces.</p>
                  <p>Examples include moving from Toronto to Vancouver, Montreal to Calgary, or Ottawa to British Columbia.</p>
                  <p>These moves require coordinated logistics, transportation scheduling, and professional handling due to the distance involved.</p>
                </div>
              </section>

              <section>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-5">How Long-Distance Moving Costs Are Calculated</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {factors.map((factor) => (
                    <div key={factor} className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <CheckCircle size={18} className="mt-0.5 shrink-0 text-[#CC1A1A]" />
                      <p className="font-body text-sm text-gray-700 leading-relaxed">{factor}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-5">Typical Long-Distance Moving Costs in Canada</h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-left font-body text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 font-semibold text-gray-900">Home Type</th>
                        <th className="px-5 py-3 font-semibold text-gray-900">Estimated Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {homeCosts.map(([type, cost]) => (
                        <tr key={type}>
                          <td className="px-5 py-3 text-gray-700">{type}</td>
                          <td className="px-5 py-3 font-semibold text-gray-900">{cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 font-body text-xs text-gray-500">
                  Estimates are approximate and vary by weight, distance, and services. Contact us for an accurate quote.
                </p>
              </section>
            </div>

            <aside>
              <div className="sticky top-24 space-y-5">
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <Calculator size={28} className="text-[#CC1A1A] mb-4" />
                    <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">Get Your Exact Quote</h2>
                    <p className="font-body text-sm text-gray-600 leading-relaxed mb-5">
                      The best way to know your actual cost is to get a free estimate based on your inventory and route.
                    </p>
                    <Button asChild className="w-full bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                      <Link href="/contact/">Request a Free Estimate</Link>
                    </Button>
                  </CardContent>
                </Card>
                <div className="grid gap-3">
                  {[
                    { icon: ShieldCheck, label: "No subcontractors" },
                    { icon: Truck, label: "Long-distance specialists" },
                    { icon: Package, label: "Packing and storage options" },
                    { icon: Clock, label: "Realistic delivery windows" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <item.icon size={18} className="text-[#CC1A1A]" />
                      <span className="font-body text-sm font-semibold text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Long-Distance Moving Costs by Route</h2>
            <p className="font-body text-gray-700 leading-relaxed max-w-4xl">
              Estimated pricing for 36 popular Canadian routes. Prices vary based on weight, distance, and services. Contact us for an accurate quote.
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[760px] text-left font-body text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Route</th>
                  <th className="px-4 py-3 font-semibold">Studio</th>
                  <th className="px-4 py-3 font-semibold">1-Bedroom</th>
                  <th className="px-4 py-3 font-semibold">2-Bedroom</th>
                  <th className="px-4 py-3 font-semibold">3-Bedroom</th>
                  <th className="px-4 py-3 font-semibold">4+ Bedroom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {routes.map((row) => (
                  <tr key={row[0]} className="odd:bg-white even:bg-gray-50">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className={`px-4 py-3 ${index === 0 ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-body text-xs text-gray-500 leading-relaxed">
            Disclaimer: These are estimated costs based on typical weight, distance, and services. Actual prices may vary depending on access conditions, seasonal demand, and additional services. Contact us for a detailed and accurate quote.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Home, title: "Home Size Matters", body: "More rooms usually mean more weight, more labour, and more truck space." },
              { icon: MapPin, title: "Route Distance Matters", body: "Short intercity moves cost less than true coast-to-coast relocations." },
              { icon: Package, title: "Service Level Matters", body: "Packing, storage, specialty handling, and valuation options affect the final quote." },
            ].map((item) => (
              <Card key={item.title} className="border border-gray-200">
                <CardContent className="p-6">
                  <item.icon size={26} className="text-[#CC1A1A] mb-4" />
                  <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#CC1A1A] text-white">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready for an Accurate Moving Quote?</h2>
          <p className="font-body text-red-100 max-w-2xl mx-auto mb-8">
            Share your route, move size, timing, and service needs. We will prepare a realistic quote for your long-distance move.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#CC1A1A] hover:bg-gray-100 font-body font-semibold">
              <Link href="/contact/">Get a Free Estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-body font-semibold bg-transparent">
              <a href="tel:18774856683">1-877-485-6683</a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default function LongDistanceCostCanadaPage() {
  return <CostGuideContent canonical="/long-distance-moving-cost-canada/" />;
}

export function AverageLongDistanceCostPage() {
  return <CostGuideContent canonical="/average-cost-of-long-distance-move-in-canada/" />;
}
