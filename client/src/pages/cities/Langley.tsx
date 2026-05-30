import CityPage from "@/components/CityPage";
export default function LangleyPage() {
  return (
    <CityPage
      city="Langley"
      slug="langley"
      description="Professional moving services in Langley, BC. Purely Canadian Movers — family-owned since 1991. Local and long-distance moves. Call 1-877-485-6683."
      heroSubtitle="Reliable movers in Langley City and Langley Township — from Willoughby to Walnut Grove, Murrayville to Fort Langley. Dispatched from our Coquitlam base since 1991."
      areaDescription="Langley is one of the fastest-growing communities in the Fraser Valley, with a mix of established neighbourhoods and exciting new developments. Our team regularly serves both Langley City and the Township, handling everything from moves in the historic Fort Langley area to new construction homes in Willoughby Heights and Willowbrook."
      whyUs={[
        "Regular service throughout Langley City and Langley Township",
        "Experienced with Langley's new construction communities",
        "No subcontractors — your crew is our own trained employees",
        "Family-owned since 1991 — based in Coquitlam, with extensive Fraser Valley experience",
        "BBB Accredited with 5-star customer reviews",
        "Competitive rates for Langley area moves",
      ]}
      services={[
        "Local Moving within Langley",
        "Langley to Metro Vancouver Moves",
        "Long-Distance Moving from Langley",
        "New Construction Moves",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
      ]}
    />
  );
}
