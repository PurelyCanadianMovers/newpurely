import ServicePage from "@/components/ServicePage";
export default function CrossCountryPage() {
  return (
    <ServicePage
      title="Cross-Country Movers Canada"
      slug="cross-country-movers"
      description="Professional cross-country moving services across Canada. From BC to Ontario, Quebec, and beyond. Purely Canadian Movers — family-owned since 1991. Call 1-877-485-6683."
      heroSubtitle="Coast-to-coast Canadian moves handled with expertise and care. From Vancouver to Halifax — we've done it thousands of times."
      intro="Moving from BC to Ontario, Quebec, or the Maritimes is a major undertaking — and it requires a moving company with the experience, equipment, and reliability to handle the distance. Purely Canadian Movers has been completing cross-country moves since 1991, helping Canadian families and businesses relocate from one end of this vast country to the other."
      features={[
        "Full cross-country service from BC to all provinces",
        "Professional packing and crating for long-haul transport",
        "Secure, climate-controlled moving trucks",
        "Detailed inventory management",
        "Flexible delivery scheduling",
        "Full liability coverage",
        "Experienced crew — our own employees, never subcontractors",
        "Free, no-obligation cross-country estimates",
      ]}
      highlights={[
        { title: "BC to Ontario", desc: "Our most popular cross-country route. We've helped thousands of families make the move east." },
        { title: "BC to Quebec", desc: "Bilingual coordination available for Quebec-bound moves. We handle all the logistics." },
        { title: "All Provinces", desc: "From Vancouver to St. John's — we move Canadians coast to coast." },
      ]}
    />
  );
}
