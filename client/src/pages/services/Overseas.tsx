import ServicePage from "@/components/ServicePage";
export default function OverseasPage() {
  return (
    <ServicePage
      title="Overseas Moving Services"
      slug="overseas"
      description="Professional overseas and international moving services from Vancouver, BC. Purely Canadian Movers — family-owned since 1991. Call 1-877-485-6683."
      heroSubtitle="International relocations to any destination worldwide, coordinated by our experienced team with trusted global partners."
      intro="Moving overseas is one of life's biggest transitions — and it requires a moving company with the international expertise to handle every detail. Purely Canadian Movers coordinates overseas relocations in partnership with trusted international freight and logistics partners, ensuring your belongings arrive safely at your destination anywhere in the world."
      features={[
        "International freight coordination via trusted partners",
        "Sea freight and air freight options",
        "Professional packing and crating for overseas transport",
        "Customs documentation and import/export support",
        "Container loading and management",
        "Door-to-door service where available",
        "Full liability coverage for international moves",
        "Free, no-obligation international estimates",
      ]}
      highlights={[
        { title: "Sea Freight", desc: "Cost-effective container shipping for full household moves to destinations worldwide." },
        { title: "Air Freight", desc: "Faster delivery for urgent moves or smaller shipments." },
        { title: "Global Partners", desc: "We work with trusted international logistics partners to ensure seamless delivery at your destination." },
      ]}
    />
  );
}
