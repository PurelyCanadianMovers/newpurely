import CityPage from "@/components/CityPage";

export default function VancouverPage() {
  return (
    <CityPage
      city="Vancouver"
      slug="vancouver"
      description="Purely Canadian Movers provides professional moving services in Vancouver, BC. Local, long-distance, and commercial moves. Family-owned since 1991. Call 1-877-485-6683."
      heroSubtitle="Expert moving services across Vancouver, from Kitsilano to East Van, Downtown to UBC. Dispatched from our Coquitlam base, serving Vancouver since 1991."
      areaDescription="Vancouver is Canada's third-largest city and one of the most dynamic moving markets in the country. Our team knows every neighbourhood, from the tight streets of Gastown to the high-rises of Coal Harbour. We navigate Vancouver's unique geography with ease, whether you're moving into a condo tower, a heritage home in Shaughnessy, or a commercial space on Granville Street."
      whyUs={[
        "Deep knowledge of Vancouver's diverse neighbourhoods and building types",
        "Experienced with high-rise condo moves and elevator bookings",
        "No subcontractors: your crew is our own trained employees",
        "Thousands of Vancouver moves completed from our Coquitlam headquarters",
        "BBB Accredited with 5-star customer reviews",
        "Free, no-obligation estimates",
      ]}
      services={[
        "Local Moving within Vancouver",
        "Condo & Apartment Moves",
        "House Moves",
        "Long-Distance Moving from Vancouver",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
        "Storage Solutions",
      ]}
    />
  );
}
