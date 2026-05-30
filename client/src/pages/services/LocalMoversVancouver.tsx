import ServicePage from "@/components/ServicePage";
export default function LocalMoversVancouverPage() {
  return (
    <ServicePage
      title="Local Movers in Vancouver, BC"
      slug="local-movers-in-vancouver-bc"
      description="Professional local movers in Vancouver, BC. Purely Canadian Movers — family-owned since 1991. Hourly rates, no subcontractors. Call 1-877-485-6683."
      heroSubtitle="Trusted local movers serving Vancouver since 1991. Based in Coquitlam — from Kitsilano condos to East Van houses, we know every neighbourhood."
      intro="Vancouver is one of Canada's most dynamic cities to move in — and one of the most challenging. High-rise condos require elevator bookings, heritage homes demand careful handling, and the city's diverse neighbourhoods each present their own logistical considerations. Based in Coquitlam since 1991, Purely Canadian Movers has been serving Vancouver from day one, and our team brings that deep regional knowledge to every move."
      features={[
        "Professional crew — our own employees, never subcontractors",
        "Fully equipped moving trucks with all necessary equipment",
        "Experience with Vancouver high-rise elevator bookings",
        "Careful handling of heritage and character homes",
        "Transparent hourly billing with no hidden fees",
        "Full liability coverage",
        "Flexible scheduling including weekends",
        "Free, no-obligation estimates",
      ]}
      highlights={[
        { title: "High-Rise Specialists", desc: "We coordinate elevator bookings and understand the specific requirements of Vancouver's condo buildings." },
        { title: "All Neighbourhoods", desc: "From Yaletown to East Van, Kitsilano to Mount Pleasant — we know Vancouver's streets." },
        { title: "No Subcontractors", desc: "Every mover on your job is a direct Purely Canadian Movers employee. Guaranteed." },
      ]}
    />
  );
}
