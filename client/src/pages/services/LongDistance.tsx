import { Link } from "wouter";
import { ArrowRight, CheckCircle, ClipboardList, MapPin, Package, PlusCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ServicePage from "@/components/ServicePage";

export default function LongDistancePage() {
  const citiesServed = [
    {
      city: "Toronto, ON",
      href: "/long-distance-movers-toronto/",
      desc: "Moving to or from Canada's largest city? We handle GTA moves in both directions with full packing and door-to-door delivery.",
    },
    {
      city: "Montreal, QC",
      href: "/long-distance-movers-montreal/",
      desc: "Relocating to or from Montreal? Our Great Canadian Van Lines network ensures seamless service in both directions.",
    },
    {
      city: "Ottawa, ON",
      href: "/long-distance-movers-ottawa/",
      desc: "Moving to or from Canada's capital? Whether for work or family, we coordinate every detail of your Ottawa move.",
    },
    {
      city: "Calgary, AB",
      href: "/long-distance-movers-calgary/",
      desc: "Relocating to or from Calgary? We serve Alberta's largest city with full-service packing, loading, and door-to-door delivery.",
    },
    {
      city: "Edmonton, AB",
      href: "/long-distance-movers-edmonton/",
      desc: "Moving to or from Edmonton? Our experienced crew handles the long haul across the Rockies with care and reliability.",
    },
    {
      city: "Victoria, BC",
      href: "/long-distance-movers-victoria/",
      desc: "Moving to or from Victoria? We coordinate ferry logistics and ensure your belongings arrive safely on Vancouver Island.",
    },
    {
      city: "Halifax, NS",
      href: "/long-distance-movers-halifax/",
      desc: "Relocating coast to coast? We move families and businesses to and from Halifax with our trusted national network.",
    },
  ];

  return (
    <ServicePage
      title="Best Long-Distance Movers in Canada"
      slug="long-distance"
      description="Professional long-distance movers serving all of Canada. Purely Canadian Movers handles cross-country, Canada-USA, and overseas moves with trusted partners and careful planning."
      heroSubtitle="Professional long-distance movers serving all of Canada. Moving across provinces? Our experienced team handles long-distance moves with the same care as your local move, from pickup to delivery. Trusted since 1991."
      heroImage={{ src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/Wade_e7f5a2e2.webp", alt: "Great Canadian Van Lines tractor-trailer - Purely Canadian Movers long-distance fleet" }}
      intro="Long-distance moves require a higher level of planning, coordination, and trust. When you're moving your family or business across provincial lines, you need a moving company you can rely on completely. Purely Canadian Movers has been handling long-distance moves from Metro Vancouver since 1991, with a track record of careful, well-planned relocations across Canada."
      features={[
        "Detailed move planning and coordination",
        "Professional packing for long-distance transport",
        "Secure, fully enclosed moving trucks",
        "GPS-tracked shipments",
        "Flexible delivery windows",
        "Full liability coverage throughout transit",
        "Agents of Great Canadian Van Lines - Canada's moving company",
        "Experienced crew: our own employees, never subcontractors",
        "Free, no-obligation estimates",
      ]}
      highlights={[
        { title: "Careful Packing", desc: "Long-distance moves demand extra protection. We use professional-grade materials to ensure everything arrives safely." },
        { title: "On-Time Delivery", desc: "We provide realistic delivery windows and communicate throughout the journey so you're never left wondering." },
        { title: "Full Coverage", desc: "Your belongings are covered from pickup through delivery." },
      ]}
    >
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">High Miles, Low Stress</h2>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  Call us to discuss your long distance move and answer all of the questions you have.
                </h3>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  The most important thing with a long distance move, since each end of the move is handled by different crews, is that the same level of professional standards are met at both ends. At Purely Canadian Movers we have worked hard over the years to develop relationships with trusted affiliates across the country that share our commitment to stress free and efficient moving. For each and every move.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  With long established partnerships with Great Canadian Van Lines in Canada and in the States, our moving company is uniquely suited to handle all of the details involved in your long distance move. You can trust us to get you settled in your new home exactly when you need us there, and everything exactly as when you last saw it.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  You are freed up to handle pressing concerns in your new area: finding schools, dealing with utilities and just generally feeling your way around your new neighbourhood.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  As with our established local moving expertise, we are geared to handle household long distance moves, as well as commercial and corporate long distance moves, employee relocation and long distance vehicle transport. All with the same reliability, efficiency, attention to detail and personal service our local customers expect.
                </p>
                <p className="font-body text-gray-700 leading-relaxed">
                  Whether it is with special boxes or crates to guarantee the safety of your cargo from the rigours of a long haul move, or just simply handling the logistics of time, distance, weather, multiple stops and different personnel, Purely Canadian Movers delivers the goods every time out. Our vehicles and affiliate vehicles are insured and bonded from the beginning through to the final destination of your long distance relocation.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Cross-Country Movers</h2>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  Cross-country relocation involves many steps, and it is a must that you hire the right cross-country movers for this job. There is more to this process than just having your items picked up, transported and dropped off at their final destination, and our team here at Purely Canadian Movers will always execute your move with excellence.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  Our team pays careful attention to every detail, and our cross-country movers have years of experience with these kinds of moves specifically. We take pride in what we do and are licensed, insured and bonded. Your belongings will be transported safely and will arrive in their original condition.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  We are one of the top cross-country moving companies in Coquitlam, and customer service is always prioritized. Our movers arrive with safe and professional moving equipment, quality moving supplies, thorough industry knowledge, and years of experience.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  Our moving services are customized for each client's individual needs because we know every cross-country move is different. We consider your contents, quantity, total weight, volume, route, packing needs, crating services, and assembly needs when planning your move.
                </p>
                <p className="font-body text-gray-700 leading-relaxed">
                  Cross-country moves are not stressful or overwhelming when you hire the right team, and choosing Purely Canadian Movers as your moving provider is a smart choice. Contact us today to find out more about our services and why we are leaders in this industry: 1-877-485-6683.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Canada-USA Movers</h2>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  Canada and the United States share the longest undefended border in the world. The two countries share more trade, family ties and business relationships than probably any two other countries.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  Because of this, moving between the two nations is not a difficult process. It does require paperwork, though, and quite a bit more than when moving within Canada. Provided all documentation is completed correctly and you have had your personal belongings and household effects in your possession for a year or more, your possessions are permitted to enter the United States duty-free.
                </p>
                <p className="font-body text-gray-700 leading-relaxed">
                  You must declare all items and state actual values when completing the necessary documentation. If U.S. customs finds that you understated values or that you did not declare all items, they can confiscate your personal belongings or household effects or charge you penalties and duty on them. On occasion, U.S. customs may charge duty on personal items. You should inquire with U.S. customs prior to your move.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Overseas Movers</h2>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  Have a stress-free international and overseas move with Purely Canadian Movers. Our moving company understands how challenging, overwhelming and stressful overseas moves can be, so we have made the navigation of those uncharted waters as easy for you as possible.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  We have developed a reliable network of highly qualified, like-minded overseas agents and movers. In tandem with your coordinator here, they will assist and help you on every aspect of your international move, especially at the other end. Our reputation is in their hands once over there, so we have picked our partners carefully.
                </p>
                <p className="font-body text-gray-700 leading-relaxed mb-4">
                  We have moved countless customers door-to-door to Pacific Rim countries: Japan, Korea, Taiwan, China, Hong Kong, Australia, Indonesia, Malaysia, New Zealand, Philippines, Russia, Singapore, and Thailand. Over the years we have moved to almost every continent on the globe.
                </p>
                <p className="font-body text-gray-700 leading-relaxed">
                  Purely Canadian Movers will provide complete logistics spanning the entire move, sealed container service with complete documentation, customs assistance, insurance, storage and final destination delivery service.
                </p>
              </section>

              <section>
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Special Packing for International Destinations</h3>
                <p className="font-body text-gray-700 leading-relaxed">
                  Proper packing is essential for safe and efficient international and overseas moving. Our experienced crews are equipped and trained to pack small, large and fragile items making economical use of the limited and valuable space available in air and ocean freight. You can relax knowing your possessions are properly organized and amply protected using packing forms custom built for international and overseas moving.
                </p>
              </section>

              <section>
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Shipping Your Items to the Far Sides of the World</h3>
                <p className="font-body text-gray-700 leading-relaxed">
                  Shipping details will be sent to you after packing and loading is completed. This includes the estimated time of arrival at the destination port or airport and the name of the contact person who will clear your items through customs and arrange delivery. Our commitment to the highest quality service and our connection with, and proximity to, the Port of Vancouver makes us a reliable partner for your international move.
                </p>
              </section>
            </div>

            <aside>
              <div className="sticky top-24 rounded-xl bg-gray-50 p-6 border border-gray-200">
                <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">Long-Distance Move Types</h2>
                <ul className="space-y-3">
                  {[
                    "Household long-distance moves",
                    "Cross-country relocations",
                    "Canada-USA moves",
                    "Office and corporate moves",
                    "Employee relocation",
                    "Vehicle transport coordination",
                    "Storage between pickup and delivery",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={17} className="mt-0.5 shrink-0 text-[#CC1A1A]" />
                      <span className="font-body text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Cities We Serve</h2>
            <p className="font-body text-gray-700 leading-relaxed max-w-5xl">
              Moving to or from another province? We regularly move families and businesses in both directions - from Metro Vancouver to major Canadian cities, and back again. As agents of Great Canadian Van Lines, we have the national network to get you there safely.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {citiesServed.map((item) => (
              <Link
                key={item.city}
                href={item.href}
                className="group block rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all hover:border-[#CC1A1A] hover:bg-white hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-[#CC1A1A]" />
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900 mb-2 group-hover:text-[#CC1A1A]">{item.city} - To &amp; From</h3>
                    <p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-8 font-body text-sm text-gray-600">
            Don't see your destination? We move to <strong className="font-semibold text-gray-900">anywhere in Canada.</strong>{" "}
            <Link href="/contact/" className="font-semibold text-[#CC1A1A] hover:text-[#A31515]">Contact us</Link> for a custom quote.
          </p>
          <div className="mt-8 space-y-5">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
              <p className="font-body text-sm leading-relaxed text-gray-700">
                <strong className="font-semibold text-gray-900">Popular long-distance routes:</strong> We specialize in moves to and from{" "}
                <Link href="/long-distance-movers-toronto/" className="font-semibold text-[#CC1A1A] hover:text-[#A31515]">Toronto</Link>,{" "}
                <Link href="/long-distance-movers-montreal/" className="font-semibold text-[#CC1A1A] hover:text-[#A31515]">Montreal</Link>,{" "}
                <Link href="/long-distance-movers-calgary/" className="font-semibold text-[#CC1A1A] hover:text-[#A31515]">Calgary</Link>, and all major Canadian cities. Each destination page includes route-specific details and pricing.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <p className="font-body text-sm leading-relaxed text-gray-700">
                <strong className="font-semibold text-gray-900">Wondering about pricing?</strong> See our detailed breakdown of{" "}
                <Link href="/average-cost-of-long-distance-move-in-canada/" className="font-semibold text-[#CC1A1A] hover:text-[#A31515]">long-distance moving costs in Canada</Link>{" "}
                - including typical ranges by home size and popular route transit times. We also offer{" "}
                <Link href="/cross-country-movers/" className="font-semibold text-[#CC1A1A] hover:text-[#A31515]">cross-country moving services</Link> for coast-to-coast relocations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-5">
              Backed by 40+ Agent Locations Across Canada
            </h2>
            <p className="font-body text-gray-700 leading-relaxed max-w-4xl mb-8">
              Purely Canadian Movers is an agent of Great Canadian Van Lines, giving us access to a nationwide network of 40+ trusted agents across every province. This means your long-distance move is handled by local experts at both ends: people who know the communities, understand local logistics, and maintain the same high standards we do.
            </p>
            <div className="grid gap-5 md:grid-cols-2 max-w-4xl mb-6">
              <div className="rounded-lg border border-blue-200 bg-white p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-0.5 shrink-0 text-blue-900" />
                  <div>
                    <h3 className="font-heading text-xl font-bold text-blue-900 mb-3">Coordinated Excellence</h3>
                    <p className="font-body text-sm leading-relaxed text-gray-700">
                      Every agent follows the same quality standards and training, ensuring consistent service coast to coast.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-blue-200 bg-white p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-0.5 shrink-0 text-blue-900" />
                  <div>
                    <h3 className="font-heading text-xl font-bold text-blue-900 mb-3">Seamless Handoff</h3>
                    <p className="font-body text-sm leading-relaxed text-gray-700">
                      Direct coordination between agents at pickup and delivery locations ensures your move stays on track.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/our-network/" className="font-body text-sm font-bold text-[#CC1A1A] hover:text-[#A31515]">
              View all agent locations <ArrowRight size={14} className="inline-block" />
            </Link>
          </div>

          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">Other Helpful Services</h2>
            <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">Call or Contact Us for Any Questions</h3>
            <p className="font-body text-gray-600 max-w-2xl mx-auto">
              Long-distance moves often need more than transportation. These related services help make the process smoother.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Package, title: "Packing", href: "/packing/", desc: "Professional packing for fragile, large, and high-value items." },
              { icon: ClipboardList, title: "Smooth Move Checklist", href: "/services/", desc: "Plan your move with practical steps for timing, preparation, packing, and delivery." },
              { icon: Truck, title: "Storage", href: "/storage/", desc: "Short-term and long-term storage options when dates do not align." },
              { icon: PlusCircle, title: "Additional Services", href: "/services/", desc: "Explore office moves, cross-border relocations, overseas moving, packing, and more." },
            ].map((service) => (
              <Card key={service.title} className="border border-gray-200 hover:border-[#CC1A1A] hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <service.icon size={24} className="text-[#CC1A1A] mb-4" />
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">{service.desc}</p>
                  <Link href={service.href} className="inline-flex items-center gap-1 font-body text-sm font-semibold text-[#CC1A1A] hover:text-[#A31515]">
                    Learn More <ArrowRight size={14} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#CC1A1A] text-white">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Get a Quick Quote Today</h2>
          <p className="font-body text-red-100 max-w-2xl mx-auto mb-8">
            Tell us where you are moving, what you are moving, and when you would like to move. We will help you plan the next step.
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
    </ServicePage>
  );
}
