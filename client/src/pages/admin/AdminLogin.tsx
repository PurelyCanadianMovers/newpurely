import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <SEO title="Admin Login | Purely Canadian Movers" description="Admin login" canonical="/admin/login/" noIndex />
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#CC1A1A] flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-white" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white mb-3">Admin Unavailable</h1>
        <p className="font-body text-sm text-gray-400 leading-relaxed mb-6">
          This static deployment preserves the public website for Cloudflare Pages or Vercel. Blog and admin
          publishing tools require a separate CMS or backend workflow.
        </p>
        <Button asChild className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
          <Link href="/">Back to Site</Link>
        </Button>
      </div>
    </div>
  );
}
