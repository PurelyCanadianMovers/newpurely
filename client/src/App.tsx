import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import OurNetwork from "./pages/OurNetwork";
import LongDistanceCostCanada, { AverageLongDistanceCostPage } from "./pages/LongDistanceCostCanada";
import { SeoLandingRoute, seoLandingPages } from "./pages/SeoLanding";

// Services
import ServicesHub from "./pages/services/ServicesHub";
import LocalMoving from "./pages/services/LocalMoving";
import LocalMoversVancouver from "./pages/services/LocalMoversVancouver";
import LocalMoversCoquitlam from "./pages/services/LocalMoversCoquitlam";
import LongDistance from "./pages/services/LongDistance";
import CrossCountry from "./pages/services/CrossCountry";
import CanadaUSA from "./pages/services/CanadaUSA";
import Overseas from "./pages/services/Overseas";
import Storage from "./pages/services/Storage";
import PricingGuide from "./pages/services/PricingGuide";
import OfficeMoves from "./pages/services/OfficeMoves";
import Packing from "./pages/services/Packing";

// Cities
import Vancouver from "./pages/cities/Vancouver";
import Coquitlam from "./pages/cities/Coquitlam";
import Surrey from "./pages/cities/Surrey";
import Burnaby from "./pages/cities/Burnaby";
import NorthVancouver from "./pages/cities/NorthVancouver";
import Langley from "./pages/cities/Langley";
import Richmond from "./pages/cities/Richmond";
import NewWestminster from "./pages/cities/NewWestminster";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminBlog from "./pages/admin/AdminBlog";

function LegacyDistanceRedirect() {
  useEffect(() => {
    window.location.replace("/long-distance/");
  }, []);

  return null;
}

function AverageCostGuide() {
  return <AverageLongDistanceCostPage />;
}

function Router() {
  return (
    <Switch>
      {/* Homepage */}
      <Route path="/" component={Home} />

      {/* Services */}
      <Route path="/services/" component={ServicesHub} />
      <Route path="/services" component={ServicesHub} />
      <Route path="/local/" component={LocalMoving} />
      <Route path="/local" component={LocalMoving} />
      <Route path="/local-movers-in-vancouver-bc/" component={LocalMoversVancouver} />
      <Route path="/local-movers-in-coquitlam-bc/" component={LocalMoversCoquitlam} />
      <Route path="/distance/" component={LegacyDistanceRedirect} />
      <Route path="/distance" component={LegacyDistanceRedirect} />
      <Route path="/long-distance/" component={LongDistance} />
      <Route path="/long-distance" component={LongDistance} />
      <Route path="/cross-country-movers/" component={CrossCountry} />
      <Route path="/cross-country-movers" component={CrossCountry} />
      <Route path="/canada-usa/" component={CanadaUSA} />
      <Route path="/canada-usa" component={CanadaUSA} />
      <Route path="/overseas/" component={Overseas} />
      <Route path="/overseas" component={Overseas} />
      <Route path="/storage/" component={Storage} />
      <Route path="/storage" component={Storage} />
      <Route path="/x-country/" component={PricingGuide} />
      <Route path="/x-country" component={PricingGuide} />
      <Route path="/office/" component={OfficeMoves} />
      <Route path="/office" component={OfficeMoves} />
      <Route path="/packing/" component={Packing} />
      <Route path="/packing" component={Packing} />
      <Route path="/long-distance-moving-cost-canada/" component={LongDistanceCostCanada} />
      <Route path="/long-distance-moving-cost-canada" component={LongDistanceCostCanada} />
      <Route path="/average-cost-of-long-distance-move-in-canada/" component={AverageCostGuide} />
      <Route path="/average-cost-of-long-distance-move-in-canada" component={AverageCostGuide} />

      {/* City Pages */}
      <Route path="/vancouver/" component={Vancouver} />
      <Route path="/vancouver" component={Vancouver} />
      <Route path="/coquitlam/" component={Coquitlam} />
      <Route path="/coquitlam" component={Coquitlam} />
      <Route path="/surrey/" component={Surrey} />
      <Route path="/surrey" component={Surrey} />
      <Route path="/burnaby/" component={Burnaby} />
      <Route path="/burnaby" component={Burnaby} />
      <Route path="/north-vancouver/" component={NorthVancouver} />
      <Route path="/north-vancouver" component={NorthVancouver} />
      <Route path="/langley/" component={Langley} />
      <Route path="/langley" component={Langley} />
      <Route path="/richmond/" component={Richmond} />
      <Route path="/richmond" component={Richmond} />
      <Route path="/new-westminster/" component={NewWestminster} />
      <Route path="/new-westminster" component={NewWestminster} />

      {/* Info Pages */}
      <Route path="/about/" component={About} />
      <Route path="/about" component={About} />
      <Route path="/testimonials/" component={Testimonials} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/our-network/" component={OurNetwork} />
      <Route path="/our-network" component={OurNetwork} />
      <Route path="/contact/" component={Contact} />
      <Route path="/contact" component={Contact} />

      {/* Blog */}
      <Route path="/blog/" component={Blog} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug/" component={(props: any) => <BlogPost params={props.params} />} />
      <Route path="/blog/:slug" component={(props: any) => <BlogPost params={props.params} />} />

      {/* Admin */}
      <Route path="/admin/login/" component={AdminLogin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/blog/" component={AdminBlog} />
      <Route path="/admin/blog" component={AdminBlog} />

      {/* Static SEO migration pages from the live sitemap */}
      {Array.from(seoLandingPages.keys()).flatMap((slug) => [
        <Route key={`${slug}/`} path={`/${slug}/`} component={() => <SeoLandingRoute slug={slug} />} />,
        <Route key={slug} path={`/${slug}`} component={() => <SeoLandingRoute slug={slug} />} />,
      ])}

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
