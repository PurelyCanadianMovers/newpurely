import ServicePage from "@/components/ServicePage";
export default function CanadaUSAPage() {
  return (
    <ServicePage
      title="Canada–USA Moving Services"
      slug="canada-usa"
      description="Professional Canada to USA moving services. Cross-border moves with customs documentation support. Purely Canadian Movers — family-owned since 1991. Call 1-877-485-6683."
      heroSubtitle="Cross-border moves between Canada and the USA, handled with full customs documentation support and experienced border-crossing logistics."
      intro="Moving between Canada and the United States involves more than just packing boxes — it requires careful customs documentation, border crossing coordination, and a moving company experienced in the regulatory requirements of both countries. Purely Canadian Movers has been handling Canada–USA moves since 1991, and our team knows exactly what's required to make your cross-border move smooth and stress-free."
      features={[
        "Full customs documentation preparation and support",
        "Experienced border-crossing logistics",
        "Coordination with US-based delivery partners",
        "Professional packing for international transport",
        "Inventory documentation for customs clearance",
        "Full liability coverage across the border",
        "Guidance on import/export regulations",
        "Free, no-obligation cross-border estimates",
      ]}
      highlights={[
        { title: "Customs Documentation", desc: "We prepare all required customs forms and documentation to ensure a smooth border crossing." },
        { title: "BC to Washington State", desc: "Our most common cross-border route — we know the Peace Arch and Pacific Highway crossings well." },
        { title: "All US Destinations", desc: "Whether you're moving to Seattle, California, or New York — we coordinate the full journey." },
      ]}
    />
  );
}
