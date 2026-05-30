import ServicePage from "@/components/ServicePage";
export default function StoragePage() {
  return (
    <ServicePage
      title="Storage Solutions in Coquitlam, BC"
      slug="storage"
      description="Secure short-term and long-term storage solutions in Coquitlam, BC. Purely Canadian Movers — family-owned since 1991. Flexible terms, competitive rates. Call 1-877-485-6683."
      heroSubtitle="Secure, convenient storage at our Coquitlam facility. Short-term or long-term — flexible terms to fit your timeline."
      intro="Sometimes a move doesn't go exactly as planned — your new home isn't ready, you need to declutter before selling, or you're between homes. Purely Canadian Movers offers secure storage solutions at our Coquitlam facility, giving you the flexibility to store your belongings safely for as long as you need."
      features={[
        "Secure storage facility in Coquitlam, BC and throughout Canada",
        "Short-term storage (days to weeks)",
        "Long-term storage (months or more)",
        "Flexible terms — no long-term contracts required",
        "Climate-controlled",
        "Full inventory management",
        "Competitive monthly rates",
      ]}
      highlights={[
        { title: "Flexible Terms", desc: "Store for a week or a year — we work around your timeline with no long-term commitment required." },
        { title: "Secure Facility", desc: "Our Coquitlam storage facility is monitored and secure, giving you peace of mind." },
        { title: "Seamless Integration", desc: "Combine storage with your move — we pick up, store, and deliver when you're ready." },
      ]}
    />
  );
}
