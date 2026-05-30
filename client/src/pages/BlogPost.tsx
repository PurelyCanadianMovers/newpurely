import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";

interface BlogPostProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostProps) {
  const title = params.slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <SiteLayout>
      <SEO title={`${title} | Purely Canadian Movers Blog`} description="Moving tips and advice from Purely Canadian Movers." canonical={`/blog/${params.slug}/`} />
      <div className="container py-20 text-center">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="font-body text-gray-600 mb-6">
          This article is not available in the static site yet. Please visit the blog index or contact us for moving advice and estimates.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
            <Link href="/blog/"><ArrowLeft size={14} className="mr-2" />Back to Blog</Link>
          </Button>
          <Button asChild variant="outline" className="font-body font-semibold">
            <Link href="/contact/">Get a Free Estimate</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
