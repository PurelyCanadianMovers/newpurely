import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { Home, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <SiteLayout>
      <SEO
        title="Page Not Found | Purely Canadian Movers"
        description="The page you're looking for doesn't exist. Return to the Purely Canadian Movers homepage."
        canonical="/404"
        noIndex
      />
      <section className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="container text-center py-20">
          <div className="font-heading text-8xl font-bold text-[#CC1A1A] mb-4">404</div>
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="font-body text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
              <Link href="/"><Home size={16} className="mr-2" />Back to Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#CC1A1A] text-[#CC1A1A] hover:bg-[#CC1A1A] hover:text-white font-body font-semibold">
              <Link href="/contact/"><Phone size={16} className="mr-2" />Contact Us</Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            {[
              { label: "Local Moving", href: "/local/" },
              { label: "Long-Distance", href: "/long-distance/" },
              { label: "Storage", href: "/storage/" },
              { label: "About Us", href: "/about/" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="font-body text-sm font-semibold text-[#CC1A1A] hover:text-[#A31515] underline underline-offset-2">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
