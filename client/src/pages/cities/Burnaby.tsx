import CityPage from "@/components/CityPage";
export default function BurnabyPage() {
  return (
    <CityPage
      city="Burnaby"
      slug="burnaby"
      description="Professional moving services in Burnaby, BC. Purely Canadian Movers — family-owned since 1991. Local and long-distance moves. Call 1-877-485-6683."
      heroSubtitle="Expert movers in Burnaby — from Metrotown to Brentwood, Capitol Hill to Deer Lake. Dispatched from our Coquitlam headquarters, serving Burnaby since 1991."
      areaDescription="Burnaby sits at the heart of Metro Vancouver, making it one of our most active service areas. Our team is experienced with Burnaby's mix of high-rise condos near SkyTrain stations, established single-family neighbourhoods, and the growing commercial districts around Metrotown and Brentwood. We know how to navigate Burnaby efficiently and safely."
      whyUs={[
        "Extensive experience with Burnaby's high-rise condo buildings",
        "Knowledgeable about elevator booking requirements in Burnaby towers",
        "No subcontractors — your crew is our own trained employees",
        "Thousands of Burnaby moves completed — dispatched from our Coquitlam headquarters",
        "BBB Accredited with 5-star customer reviews",
        "Flexible scheduling including weekends",
      ]}
      services={[
        "Local Moving within Burnaby",
        "Condo & High-Rise Moves",
        "Long-Distance Moving from Burnaby",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
        "Storage Solutions",
      ]}
    />
  );
}
