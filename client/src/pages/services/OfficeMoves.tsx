import ServicePage from "@/components/ServicePage";
export default function OfficeMovesPage() {
  return (
    <ServicePage
      title="Office & Corporate Moving Services in Metro Vancouver"
      slug="office"
      description="Professional office and corporate moving services in Metro Vancouver. Purely Canadian Movers — family-owned since 1991. Minimal disruption, weekend moves available. Call 1-877-485-6683."
      heroSubtitle="Efficient, minimal-disruption office relocations planned around your business schedule. Weekend and after-hours moves available."
      intro="Moving your business is a major undertaking — and downtime costs money. Purely Canadian Movers specializes in office and corporate relocations across Metro Vancouver and beyond, coordinating every detail so your team is back up and running as quickly as possible. We've been trusted by businesses of all sizes since 1991."
      features={[
        "Office and corporate relocations of all sizes",
        "Weekend and after-hours moves to minimize disruption",
        "Careful handling of IT equipment, furniture, and files",
        "Experienced, professional crew — no subcontractors",
        "Detailed move planning and coordination",
        "Disassembly and reassembly of office furniture",
        "Secure short-term storage if your new space isn't ready",
        "Fully insured and BBB Accredited",
      ]}
      highlights={[
        { title: "Minimal Downtime", desc: "We plan your move around your schedule — evenings, weekends, or phased moves — so your business keeps running." },
        { title: "No Subcontractors", desc: "Your office contents are handled exclusively by our own trained, vetted crew from start to finish." },
        { title: "Full-Service Option", desc: "We can pack, move, and unpack your entire office so your team arrives to a ready-to-work space." },
      ]}
    />
  );
}
