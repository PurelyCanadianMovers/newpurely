import CityPage from "@/components/CityPage";
export default function RichmondPage() {
  return (
    <CityPage
      city="Richmond"
      slug="richmond"
      description="Professional moving services in Richmond, BC. Purely Canadian Movers — family-owned since 1991. Local and long-distance moves. Call 1-877-485-6683."
      heroSubtitle="Expert movers in Richmond — from Steveston to City Centre, Brighouse to Hamilton. Dispatched from our Coquitlam headquarters, serving Richmond since 1991."
      areaDescription="Richmond is a vibrant city on Lulu Island, known for its diverse communities, waterfront neighbourhoods, and thriving commercial districts. Our team has extensive experience with Richmond's unique geography — including its many condo towers, townhome complexes, and the charming heritage homes of Steveston Village."
      whyUs={[
        "Experienced with Richmond's condo towers and townhome complexes",
        "Knowledgeable about Steveston's heritage properties",
        "No subcontractors — your crew is our own trained employees",
        "Hundreds of Richmond moves completed — dispatched from our Coquitlam headquarters",
        "BBB Accredited with 5-star customer reviews",
        "Flexible scheduling to accommodate your timeline",
      ]}
      services={[
        "Local Moving within Richmond",
        "Richmond to Metro Vancouver Moves",
        "Long-Distance Moving from Richmond",
        "Condo & Apartment Moves",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
      ]}
    />
  );
}
