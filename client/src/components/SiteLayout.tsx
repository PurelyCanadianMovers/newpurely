import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import AIChatWidget from "./AIChatWidget";
import { LocalBusinessSchema } from "./Schema";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <LocalBusinessSchema />
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
