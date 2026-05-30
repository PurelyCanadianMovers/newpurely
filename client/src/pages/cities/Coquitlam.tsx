import CityPage from "@/components/CityPage";

export default function CoquitlamPage() {
  return (
    <CityPage
      city="Coquitlam"
      slug="coquitlam"
      isHomeBase={true}
      description="Purely Canadian Movers is based in Coquitlam, BC. Local and long-distance moving services in Coquitlam and the Tri-Cities. Family-owned since 1991. Call 1-877-485-6683."
      heroSubtitle="Coquitlam is our home — and we know every street, neighbourhood, and building in the Tri-Cities. Local expertise you can count on."
      areaDescription="Coquitlam is where Purely Canadian Movers was founded in 1991, and it remains our home base. Our office is located at Unit 16–91 Golden Dr., Coquitlam, BC. We've helped thousands of Coquitlam families move over the past three decades — from Burke Mountain to Maillardville, from Town Centre to Ranch Park. Nobody knows Coquitlam moves better than we do."
      whyUs={[
        "Coquitlam is our home — we've operated here since 1991",
        "Intimate knowledge of all Coquitlam neighbourhoods and communities",
        "Experienced with Burke Mountain new builds and Town Centre condos",
        "Fastest response times in the Tri-Cities area",
        "No subcontractors — your crew is our own trained employees",
        "BBB Accredited with 5-star customer reviews",
      ]}
      services={[
        "Local Moving within Coquitlam",
        "Tri-Cities Area Moves (Port Coquitlam, Port Moody)",
        "Long-Distance Moving from Coquitlam",
        "New Construction Moves",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
        "Storage Solutions (on-site in Coquitlam)",
      ]}
    />
  );
}
