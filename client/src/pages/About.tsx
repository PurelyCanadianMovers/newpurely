import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/Schema";
import { CheckCircle, Award, Users, Shield, Heart, Phone } from "lucide-react";

const values = [
  { icon: Users, title: "Family-Owned", desc: "We're not a franchise or a corporation. We're a family business, and we treat every customer like a neighbour." },
  { icon: Shield, title: "No Subcontractors", desc: "Every mover on your job is a direct Purely Canadian Movers employee. This is a promise we've kept since day one." },
  { icon: Award, title: "BBB Accredited", desc: "Our Better Business Bureau accreditation reflects our commitment to ethical business practices and customer satisfaction." },
  { icon: Heart, title: "Community First", desc: "We're proud sponsors of the Coquitlam Express Junior Hockey Team and active members of the Lower Mainland community." },
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <SEO
        title="About Purely Canadian Movers | Family-Owned Since 1991"
        description="Learn about Purely Canadian Movers — a family-owned moving company based in Coquitlam, BC, serving Metro Vancouver since 1991. No subcontractors, BBB Accredited."
        canonical="/about/"
      />
      <BreadcrumbSchema items={[{ name: "About Us", url: "/about/" }]} />

      {/* Hero */}
      <section className="bg-gray-900 py-20">
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">About Us</span>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">About Purely Canadian Movers</h1>
            <p className="font-body text-lg text-gray-300 leading-relaxed">
              A family-owned moving company built on trust, hard work, and a genuine commitment to doing right by every customer — since 1991.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 font-body text-gray-700 leading-relaxed">
                <p>
                  Purely Canadian Movers was founded in 1991 in Coquitlam, BC — and we've been based here ever since. What started as a small, family-run operation has grown into one of Metro Vancouver's most trusted moving companies, but our values have never changed.
                </p>
                <p>
                  From the very beginning, we made a commitment that still defines us today: <strong>we would never use subcontractors.</strong> Every mover on your job is a direct employee of Purely Canadian Movers — trained by us, accountable to us, and invested in your experience.
                </p>
                <p>
                  Over more than three decades, we've helped thousands of families, individuals, and businesses move across Metro Vancouver, across Canada, and around the world. We've moved everything from studio apartments to corporate offices, from local Coquitlam moves to cross-country relocations from BC to Ontario.
                </p>
                <p>
                  Today, Purely Canadian Movers is BBB Accredited, 5-star rated, and still family-owned. We're proud of what we've built — and we're proud to call Coquitlam home.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "1991", label: "Year Founded" },
                  { num: "30+", label: "Years of Experience" },
                  { num: "10,000+", label: "Moves Completed" },
                  { num: "5★", label: "Customer Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="font-heading text-3xl font-bold text-[#CC1A1A] mb-1">{stat.num}</div>
                    <div className="font-body text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="font-body text-gray-600 max-w-xl mx-auto">The principles that have guided Purely Canadian Movers since 1991.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <v.icon size={22} className="text-[#CC1A1A]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* No Subcontractors Promise */}
      <section className="py-16 bg-[#CC1A1A] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Shield size={48} className="mx-auto mb-6 text-red-200" />
            <h2 className="font-heading text-3xl font-bold text-white mb-4">Our No-Subcontractor Promise</h2>
            <p className="font-body text-lg text-red-100 leading-relaxed mb-6">
              Many moving companies use subcontractors — third-party workers hired on short notice with no direct accountability to the company or the customer. We've never done this, and we never will.
            </p>
            <p className="font-body text-red-200 leading-relaxed">
              When you hire Purely Canadian Movers, every person who shows up at your door is a trained, vetted, direct employee of our company. They're accountable to us, and we're accountable to you. That's the Purely Canadian promise.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Ready to Work With Us?</h2>
            <p className="font-body text-gray-600 mb-8">Get a free, no-obligation estimate for your move. We'd love to hear from you.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                <Link href="/contact/">Get a Free Estimate</Link>
              </Button>
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
