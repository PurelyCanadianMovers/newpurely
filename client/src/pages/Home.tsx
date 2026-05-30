import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { LocalBusinessSchema, WebSiteSchema, FAQSchema, AggregateRatingSchema } from "@/components/Schema";
import {
  Phone, Star, Shield, Users, Award, CheckCircle, ArrowRight,
  Truck, Home, Globe, Package, Building, MapPin, Bot, User, Send, Clock
} from "lucide-react";

const PHONE_TOLLFREE = "1-877-485-6683";
const PHONE_LOCAL = "604-522-7222";

const services = [
  { icon: Truck, title: "Local Moving", desc: "Expert local moves across Metro Vancouver with hourly rates and no hidden fees.", href: "/local/" },
  { icon: MapPin, title: "Long-Distance Moving", desc: "Reliable cross-province moves with careful handling and on-time delivery.", href: "/long-distance/" },
  { icon: Globe, title: "Cross-Country Moves", desc: "Coast-to-coast Canadian moves handled by our experienced team.", href: "/cross-country-movers/" },
  { icon: Globe, title: "Canada–USA Moves", desc: "Cross-border relocations with full customs documentation support.", href: "/canada-usa/" },
  { icon: Package, title: "Storage Solutions", desc: "Secure short-term and long-term storage at our Coquitlam facility.", href: "/storage/" },
  { icon: Building, title: "Office & Corporate Moves", desc: "Minimal-disruption office relocations planned around your schedule.", href: "/services/" },
];

const steps = [
  { num: "01", title: "Get a Free Estimate", desc: "Fill out our quick online form or call us. We'll provide a no-obligation quote tailored to your move." },
  { num: "02", title: "Plan Your Move", desc: "Our team coordinates every detail — timing, packing needs, special items, and logistics." },
  { num: "03", title: "Moving Day", desc: "Our professional crew arrives on time, handles everything with care, and keeps you informed throughout." },
  { num: "04", title: "Settle In", desc: "We place everything exactly where you want it. Your new space, perfectly set up." },
];

const testimonials = [
  { name: "Joe", location: "Local Guide · 181 reviews", type: "Google Review", text: "I highly recommend Purely Canadian Movers for any size project, big or small." },
  { name: "dave wilkinson", location: "5 reviews", type: "Google Review", text: "Great service, they go above and beyond to deliver your goods, safely. Very friendly too! Highly recommended." },
  { name: "Jay Pants", location: "6 reviews", type: "Google Review", text: "I had an amazing experience with Purely Canadian Movers Inc. From the very first phone call, everything felt organized." },
  { name: "Kimberly Ranger", location: "4 reviews", type: "Office Move", text: "We hired Purely Canadian Movers for a three building office move. From the first interaction they were professional." },
];

const faqs = [
  { q: "How far in advance should I book?", a: "We recommend booking at least 2–4 weeks in advance for local moves, and 4–8 weeks for long-distance or cross-country moves. However, we do our best to accommodate last-minute bookings when availability allows." },
  { q: "Do you use subcontractors?", a: "Never. Every member of our moving crew is a direct employee of Purely Canadian Movers. This ensures consistent quality, accountability, and the highest level of care for your belongings." },
  { q: "How is pricing calculated?", a: "Local moves are typically billed hourly based on crew size and truck requirements. Long-distance and cross-country moves are quoted based on weight/volume and distance. We provide free, no-obligation estimates." },
  { q: "Are my belongings insured during the move?", a: "Yes. We carry full liability coverage. We can also discuss additional valuation options for high-value items. Ask us about coverage when you request your estimate." },
  { q: "Do you offer packing services?", a: "Yes! Our team offers full packing and unpacking services. We use professional-grade materials to ensure your items are protected. Packing can be added to any move package." },
  { q: "What areas do you serve?", a: "We serve all of Metro Vancouver and the Lower Mainland, including Vancouver, Coquitlam, Surrey, Burnaby, North Vancouver, Langley, Richmond, New Westminster, Port Moody, and more." },
];

const vendors = [
  { name: "Great Canadian Van Lines", url: "https://www.greatcanadianvanlines.com", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/vendor-gcvl_f751b99b.png" },
  { name: "Canadian Association of Movers", url: "https://www.mover.net", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/vendor-cam_d0fd983a.jpg" },
  { name: "Hansen's Vehicle Relocation", url: "https://www.lhf.com", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/vendor-hansens_d1c00a6d.jpg" },
  { name: "MoveBuddy", url: "https://www.movebuddy.ca", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/vendor-movebuddy_1674bde1.jpg" },
  { name: "Livingston Vehicle Transportation", url: "https://www.livingstonintl.com", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/vendor-livingston_9df6de82.jpg" },
  { name: "Advanced Storage Centres", url: "https://www.advancedstorage.ca", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/vendor-advanced-storage_a8e11879.png" },
  { name: "Coquitlam Express", url: "https://www.coquitlamexpress.com", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/vendor-coquitlam-express_bffff2e3.png" },
];

const cities = ["Vancouver", "Coquitlam", "Surrey", "Burnaby", "North Vancouver", "Langley", "Richmond", "New Westminster"];

interface ChatMessage { role: "user" | "assistant"; content: string; }

function HomeChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm the Purely Canadian Movers virtual assistant. Ask me anything about our services, pricing, or service areas. I'm here to help! 🍁" },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Track whether the user has sent at least one message so we only
  // auto-scroll inside the chat box after real interaction, never on mount.
  const hasInteracted = useRef(false);

  // Only scroll to the latest message after the user has interacted — never on initial mount.
  useEffect(() => {
    if (hasInteracted.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isSending) return;
    hasInteracted.current = true;
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsSending(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Thanks for reaching out. For accurate pricing, availability, or route-specific advice, please call 1-877-485-6683 or request a free estimate through our contact form.",
      }]);
      setIsSending(false);
    }, 350);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">Ask Our AI Assistant</h2>
          <p className="font-body text-gray-600">Have questions about your move? Get instant answers 24/7.</p>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-[#CC1A1A] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <div className="font-body font-semibold text-white">PCM Virtual Assistant</div>
              <div className="font-body text-xs text-red-200">Powered by AI · Available 24/7</div>
            </div>
          </div>
          <div className="h-72 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-gray-200" : "bg-[#CC1A1A]"}`}>
                  {msg.role === "user" ? <User size={15} className="text-gray-600" /> : <Bot size={15} className="text-white" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-body leading-relaxed ${msg.role === "user" ? "bg-[#CC1A1A] text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#CC1A1A] flex items-center justify-center">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
                  <span className="text-sm font-body text-gray-500">One moment...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-200 p-4 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about pricing, services, or your move..."
              className="flex-1 text-sm font-body border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#CC1A1A] focus:border-transparent"
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="w-10 h-10 rounded-full bg-[#CC1A1A] text-white flex items-center justify-center hover:bg-[#A31515] transition-colors disabled:opacity-50"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <SiteLayout>
      <SEO
        title="Professional Moving Company Vancouver BC Since 1991"
        description="Purely Canadian Movers — family-owned moving company serving Metro Vancouver since 1991. Local, long-distance, cross-country, and international moves. No subcontractors. Call 1-877-485-6683."
        canonical="/"
      />
      <LocalBusinessSchema />
      <WebSiteSchema />
      <AggregateRatingSchema ratingValue={4.9} reviewCount={200} />
      <FAQSchema faqs={[
        { question: "How long has Purely Canadian Movers been in business?", answer: "Purely Canadian Movers has been serving Metro Vancouver since 1991 — over 30 years of family-owned moving expertise." },
        { question: "Do you use subcontractors?", answer: "No. We never use subcontractors. Every move is handled exclusively by our own trained, vetted employees from start to finish." },
        { question: "What areas do you serve?", answer: "We serve all of Metro Vancouver and the Lower Mainland, including Vancouver, Coquitlam, Surrey, Burnaby, North Vancouver, Langley, Richmond, and New Westminster. We also offer long-distance, cross-country, Canada–USA, and overseas moves." },
        { question: "Do you offer free estimates?", answer: "Yes. We provide free, no-obligation moving estimates. You can request one online or call us at 1-877-485-6683." },
        { question: "Are you BBB Accredited?", answer: "Yes, Purely Canadian Movers is BBB Accredited with an excellent rating, reflecting our commitment to honest, professional service." },
        { question: "Do you offer storage services?", answer: "Yes. We offer secure short-term and long-term storage at our Coquitlam facility with flexible terms and competitive monthly rates." },
        { question: "Can you help with packing?", answer: "Yes. We offer full-service and partial packing using professional-grade materials. We also offer unpacking and removal of packing materials at your new home." },
        { question: "Do you move offices and businesses?", answer: "Yes. We specialize in office and corporate relocations of all sizes, with weekend and after-hours moves available to minimize business disruption." },
      ]} />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/hero-truck_dad4e475.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40" />
        <div className="relative container py-20">
          <div className="max-w-2xl">
            {/* Hero Logo */}
            <div className="flex items-center gap-4 mb-8">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/pcm-logo_d704acbc.png"
                alt="Purely Canadian Movers"
                className="h-20 w-auto brightness-0 invert drop-shadow-lg"
              />
              <div>
                <div className="font-heading text-white font-bold text-2xl leading-none tracking-tight">Purely Canadian</div>
                <div className="font-body text-red-300 text-sm tracking-[0.2em] uppercase font-semibold mt-1">MOVERS</div>
                <div className="font-body text-gray-400 text-xs mt-1">Serving Metro Vancouver Since 1991</div>
              </div>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Professional Movers in Vancouver & the Lower Mainland Since 1991
            </h1>
            <p className="font-body text-lg text-gray-300 mb-8 leading-relaxed">
              Family-owned, BBB Accredited, and zero subcontractors — ever. Your belongings are in the hands of our own trusted crew from start to finish.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold text-base px-8 h-12">
                <Link href="/contact/">Get Your Free Moving Estimate</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-body font-semibold text-base px-8 h-12 bg-transparent">
                <Link href="/services/">Explore Services</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a href={`tel:${PHONE_TOLLFREE.replace(/-/g, "")}`} className="flex items-center gap-2 text-white hover:text-red-300 transition-colors">
                <Phone size={16} />
                <span className="font-body font-semibold">{PHONE_TOLLFREE}</span>
              </a>
              <span className="text-gray-600 hidden sm:block">|</span>
              <span className="font-body text-sm text-gray-400">Moving Services Available 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#CC1A1A] text-white py-4">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10 text-sm font-body font-semibold">
            {["Since 1991", "Family-Owned", "No Subcontractors", "BBB Accredited", "5-Star Rated"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={15} className="text-red-200" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Purely Canadian Movers?</h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto text-lg">Over three decades of trusted service, built on family values and a commitment to doing things right.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Over 30 Years of Experience", desc: "Since 1991, we've helped thousands of families and businesses move with confidence across Metro Vancouver." },
              { icon: Users, title: "Family-Owned & Locally Operated", desc: "We're not a franchise. We're your neighbours — invested in our community and accountable to every customer." },
              { icon: Shield, title: "No Subcontractors Ever", desc: "Every mover on your job is a direct employee of Purely Canadian Movers. No surprises, no strangers." },
              { icon: Award, title: "BBB Accredited Business", desc: "Our BBB accreditation reflects our commitment to ethical business practices and customer satisfaction." },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                    <item.icon size={22} className="text-[#CC1A1A]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Moving Services</h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto text-lg">From a single-bedroom condo to a cross-country corporate relocation — we handle it all.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link key={s.href} href={s.href}>
                <Card className="h-full border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-[#CC1A1A] flex items-center justify-center mb-4 transition-colors">
                      <s.icon size={22} className="text-[#CC1A1A] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:text-[#CC1A1A] transition-colors">{s.title}</h3>
                    <p className="font-body text-sm text-gray-600 leading-relaxed mb-4">{s.desc}</p>
                    <span className="font-body text-sm font-semibold text-[#CC1A1A] flex items-center gap-1">
                      Learn More <ArrowRight size={14} />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-[#CC1A1A] text-[#CC1A1A] hover:bg-[#CC1A1A] hover:text-white font-body font-semibold">
              <Link href="/services/">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="font-body text-gray-600 max-w-xl mx-auto">Moving made simple — four straightforward steps to your new home or office.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-red-100 z-0" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-full bg-[#CC1A1A] text-white font-heading font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="font-body text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-[#CC1A1A] text-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">We Move Across Metro Vancouver</h2>
            <p className="font-body text-red-200 max-w-xl mx-auto">Serving every community in the Lower Mainland — from the North Shore to the Fraser Valley.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/${city.toLowerCase().replace(" ", "-")}/`}
                className="font-body font-semibold px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-colors text-sm"
              >
                {city}
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[#CC1A1A] font-body font-semibold bg-transparent">
              <Link href="/local/">View All Service Areas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="font-body text-gray-600 max-w-xl mx-auto">Real reviews from real customers across Metro Vancouver.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#CC1A1A" className="text-[#CC1A1A]" />)}
                  </div>
                  <p className="font-body text-sm text-gray-700 leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <div className="font-body font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="font-body text-xs text-gray-500">{t.location} · {t.type}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-[#CC1A1A] text-[#CC1A1A] hover:bg-[#CC1A1A] hover:text-white font-body font-semibold">
              <Link href="/testimonials/">Read All Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="font-body text-gray-600">Everything you need to know before your move.</p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-gray-200 rounded-lg px-2">
                <AccordionTrigger className="font-body font-semibold text-gray-900 text-left hover:text-[#CC1A1A] hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-gray-600 leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* AI Chat Section */}
      <HomeChatSection />

      {/* Preferred Vendors */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Our Preferred Vendors & Partners</h2>
            <p className="font-body text-gray-600">Trusted partners who share our commitment to quality and professionalism.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {vendors.map((v) => (
              <a
                key={v.name}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-44 h-20 bg-white border border-gray-200 rounded-xl px-4 hover:border-[#CC1A1A] hover:shadow-md transition-all"
                title={v.name}
              >
                <img src={v.logo} alt={v.name} className="max-h-12 max-w-full object-contain" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Make Your Move?</h2>
          <p className="font-body text-gray-400 text-lg mb-8 max-w-xl mx-auto">Get a free, no-obligation estimate from Metro Vancouver's most trusted family-owned moving company.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold text-base px-8 h-12">
              <Link href="/contact/">Get Your Free Estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-body font-semibold text-base px-8 h-12 bg-transparent">
              <a href={`tel:${PHONE_TOLLFREE.replace(/-/g, "")}`}>
                <Phone size={16} className="mr-2" />
                {PHONE_TOLLFREE}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
