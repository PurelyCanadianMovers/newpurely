import CityPage from "@/components/CityPage";
export default function SurreyPage() {
  return (
    <CityPage
      city="Surrey"
      slug="surrey"
      description="Professional moving services in Surrey, BC. Purely Canadian Movers — family-owned since 1991. Local and long-distance moves. Call 1-877-485-6683."
      heroSubtitle="Reliable moving services across Surrey — from Cloverdale to Whalley, Newton to South Surrey. Dispatched from our Coquitlam headquarters, serving Surrey since 1991."
      areaDescription="Surrey is BC's second-largest city and one of the fastest-growing communities in Canada. Our team is well-versed in Surrey's diverse neighbourhoods — from the established communities of Cloverdale to the new developments in South Surrey and the urban core of Whalley. We handle everything from single-family home moves to large commercial relocations."
      whyUs={[
        "Experienced with Surrey's rapidly growing neighbourhoods",
        "Knowledgeable about new construction communities in South Surrey",
        "No subcontractors — your crew is our own trained employees",
        "Family-owned since 1991 — based in Coquitlam, serving all of the Lower Mainland",
        "BBB Accredited with 5-star customer reviews",
        "Competitive hourly rates with no hidden fees",
      ]}
      services={[
        "Local Moving within Surrey",
        "Long-Distance Moving from Surrey",
        "New Construction Moves",
        "Office & Commercial Moves",
        "Packing & Unpacking Services",
        "Storage Solutions",
      ]}
    />
  );
}
