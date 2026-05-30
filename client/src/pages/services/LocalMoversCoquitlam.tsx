import ServicePage from "@/components/ServicePage";
export default function LocalMoversCoquitlamPage() {
  return (
    <ServicePage
      title="Local Movers in Coquitlam, BC"
      slug="local-movers-in-coquitlam-bc"
      description="Professional local movers in Coquitlam, BC. Purely Canadian Movers is based in Coquitlam — family-owned since 1991. Hourly rates, no subcontractors. Call 1-877-485-6683."
      heroSubtitle="Coquitlam is our home. Nobody knows local moves in the Tri-Cities better than Purely Canadian Movers."
      intro="Purely Canadian Movers was founded in Coquitlam in 1991, and our office is still here today at Unit 16–91 Golden Dr. Over three decades, we've helped thousands of Coquitlam families move — from Burke Mountain new builds to Town Centre condos, from Maillardville heritage homes to Ranch Park family houses. When you hire us for a Coquitlam move, you're hiring the most experienced local movers in the Tri-Cities."
      features={[
        "Based in Coquitlam since 1991 — this is our home",
        "Deep knowledge of every Coquitlam neighbourhood",
        "Professional crew — our own employees, never subcontractors",
        "Fastest response times in the Tri-Cities area",
        "Experience with Burke Mountain new construction",
        "Transparent hourly billing with no hidden fees",
        "Full liability coverage",
        "Free, no-obligation estimates",
      ]}
      highlights={[
        { title: "Our Home Base", desc: "We've been based in Coquitlam since 1991. We know every street, building, and neighbourhood." },
        { title: "Tri-Cities Specialists", desc: "We serve Coquitlam, Port Coquitlam, and Port Moody with the same local expertise." },
        { title: "No Subcontractors", desc: "Every mover on your job is a direct Purely Canadian Movers employee. Guaranteed." },
      ]}
    />
  );
}
