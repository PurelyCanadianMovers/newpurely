import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/Schema";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";

const posts: Array<{
  slug: string;
  title: string;
  metaDescription?: string | null;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  readTimeMinutes: number;
}> = [];

export default function BlogPage() {
  return (
    <SiteLayout>
      <SEO
        title="Moving Tips & Advice Blog | Purely Canadian Movers"
        description="Moving tips, advice, and guides from Purely Canadian Movers. Expert insights on local, long-distance, and cross-country moves in Metro Vancouver."
        canonical="/blog/"
      />
      <BreadcrumbSchema items={[{ name: "Blog", url: "/blog/" }]} />

      {/* Hero */}
      <section className="bg-gray-900 py-16">
        <div className="container">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="font-body text-sm text-gray-400 hover:text-white">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="font-body text-sm text-gray-300">Blog</span>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Moving Tips & Advice</h1>
            <p className="font-body text-lg text-gray-300 leading-relaxed">
              Expert moving guides, tips, and advice from the team at Purely Canadian Movers.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-700 mb-2">No Posts Yet</h2>
              <p className="font-body text-gray-500 mb-6">Check back soon — we're working on helpful moving guides for you.</p>
              <Button asChild className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                <Link href="/contact/">Get a Free Estimate</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}/`}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group overflow-hidden">
                    {post.coverImageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <h2 className="font-heading text-lg font-bold text-gray-900 mb-2 group-hover:text-[#CC1A1A] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.metaDescription && (
                        <p className="font-body text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{post.metaDescription}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-body mb-3">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(post.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTimeMinutes} min read
                        </span>
                      </div>
                      <span className="font-body text-sm font-semibold text-[#CC1A1A] flex items-center gap-1">
                        Read More <ArrowRight size={13} />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
