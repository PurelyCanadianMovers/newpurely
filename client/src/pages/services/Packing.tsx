import ServicePage from "@/components/ServicePage";
export default function PackingPage() {
  return (
    <ServicePage
      title="Professional Packing & Unpacking Services in Metro Vancouver"
      slug="packing"
      description="Full-service packing and unpacking by professional movers in Metro Vancouver. Purely Canadian Movers — family-owned since 1991. Professional-grade materials, careful handling. Call 1-877-485-6683."
      heroSubtitle="Let our professional crew handle all the packing — so you can focus on everything else about your move."
      intro="Packing is one of the most time-consuming and stressful parts of any move. Purely Canadian Movers offers full-service packing and unpacking using professional-grade materials, ensuring your belongings are protected and organized from the moment we start until the last box is unpacked at your new home."
      features={[
        "Full-service packing of your entire home or office",
        "Partial packing — we pack only what you need",
        "Professional-grade boxes, paper, and bubble wrap",
        "Specialty packing for fragile, valuable, and oversized items",
        "Artwork, mirrors, and electronics packed with care",
        "Labelled and organized boxes for easy unpacking",
        "Unpacking service at your new location",
        "Removal and disposal of packing materials",
      ]}
      highlights={[
        { title: "Professional Materials", desc: "We use industry-grade packing supplies — double-walled boxes, foam wrap, and custom crating for high-value items." },
        { title: "Fragile Item Specialists", desc: "Artwork, antiques, electronics, and glassware receive individual attention and specialized packing techniques." },
        { title: "Full or Partial Service", desc: "Choose full-service packing for a hands-off experience, or partial packing for just the items you'd rather leave to the pros." },
      ]}
    />
  );
}
