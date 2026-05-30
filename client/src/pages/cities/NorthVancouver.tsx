import CityPage from "@/components/CityPage";
export default function NorthVancouverPage() {
  return (
    <CityPage
      city="North Vancouver"
      slug="north-vancouver"
      description="Professional moving services in North Vancouver, BC. Purely Canadian Movers — family-owned since 1991. Local and long-distance moves. Call 1-877-485-6683."
      heroSubtitle="Trusted movers on the North Shore — from Lower Lonsdale to Deep Cove, Lynn Valley to Edgemont Village. Dispatched from our Coquitlam base since 1991."
      areaDescription="North Vancouver's unique geography — steep hillsides, winding roads, and stunning waterfront properties — requires experienced movers who know the terrain. Our team has completed hundreds of moves on the North Shore, from the urban neighbourhoods near Lonsdale Quay to the forested communities of Lynn Valley and the prestigious homes of Edgemont Village."
      whyUs={[
        "Experienced with North Shore's challenging terrain and steep hillsides",
        "Knowledgeable about waterfront and heritage property moves",
        "No subcontractors — your crew is our own trained employees",
        "Family-owned since 1991 — based in Coquitlam, with extensive North Shore experience",
        "BBB Accredited with 5-star customer reviews",
        "Fully equipped trucks for all property types",
      ]}
      services={[
        "Local Moving within North Vancouver",
        "North Shore to Metro Vancouver Moves",
        "Long-Distance Moving from North Vancouver",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
        "Storage Solutions",
      ]}
    />
  );
}
