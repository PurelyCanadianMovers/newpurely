import CityPage from "@/components/CityPage";
export default function NewWestminsterPage() {
  return (
    <CityPage
      city="New Westminster"
      slug="new-westminster"
      description="Professional moving services in New Westminster, BC. Purely Canadian Movers — family-owned since 1991. Local and long-distance moves. Call 1-877-485-6683."
      heroSubtitle="Trusted movers in New Westminster — BC's oldest city. From the Quay to Uptown, Sapperton to Queensborough. Dispatched from our Coquitlam base since 1991."
      areaDescription="New Westminster holds a special place in British Columbia's history as the province's original capital. Our team loves working in this vibrant city, with its mix of Victorian-era heritage homes, modern riverfront condos along the Quay, and the growing Queensborough community. We handle the unique challenges of older homes and heritage buildings with care and expertise."
      whyUs={[
        "Experienced with New Westminster's heritage homes and older buildings",
        "Knowledgeable about Quay waterfront condo moves",
        "No subcontractors — your crew is our own trained employees",
        "Family-owned since 1991 — based in Coquitlam, with extensive Royal City experience",
        "BBB Accredited with 5-star customer reviews",
        "Careful handling of antiques and heritage furnishings",
      ]}
      services={[
        "Local Moving within New Westminster",
        "Heritage Home Moves",
        "Condo & Apartment Moves",
        "Long-Distance Moving from New Westminster",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
      ]}
    />
  );
}
