import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, ChevronDown, MapPin } from "lucide-react";

const PHONE_TOLLFREE = "1-877-485-6683";
const PHONE_LOCAL = "604-522-7222";
const EMAIL = "esales@pcmovers.ca";

const services = [
  { label: "Services Overview", href: "/services/" },
  { label: "Local Moving", href: "/local/" },
  { label: "Long-Distance Moving", href: "/long-distance/" },
  { label: "Cross-Country Moves", href: "/cross-country-movers/" },
  { label: "Canada–USA Moves", href: "/canada-usa/" },
  { label: "Overseas Moving", href: "/overseas/" },
  { label: "Storage Solutions", href: "/storage/" },
  { label: "Office & Corporate Moves", href: "/office/" },
  { label: "Packing & Unpacking", href: "/packing/" },
];

const localMoves = [
  { label: "Local Moving Overview", href: "/local/" },
  { label: "Vancouver", href: "/vancouver/" },
  { label: "Coquitlam", href: "/coquitlam/" },
  { label: "Surrey", href: "/surrey/" },
  { label: "Burnaby", href: "/burnaby/" },
  { label: "North Vancouver", href: "/north-vancouver/" },
  { label: "Langley", href: "/langley/" },
  { label: "Richmond", href: "/richmond/" },
  { label: "New Westminster", href: "/new-westminster/" },
  { label: "Port Moody", href: "/port-moody/" },
  { label: "Delta", href: "/delta/" },
  { label: "Maple Ridge", href: "/maple-ridge/" },
  { label: "White Rock", href: "/white-rock/" },
];

const longDistanceMoves = [
  { label: "Long-Distance Overview", href: "/long-distance/" },
  { label: "Vancouver Movers", href: "/vancouver-long-distance-movers/" },
  { label: "Toronto Movers", href: "/long-distance-movers-toronto/" },
  { label: "Montreal Movers", href: "/long-distance-movers-montreal/" },
  { label: "Ottawa Movers", href: "/long-distance-movers-ottawa/" },
  { label: "Calgary Movers", href: "/long-distance-movers-calgary/" },
  { label: "Edmonton Movers", href: "/long-distance-movers-edmonton/" },
  { label: "Victoria Movers", href: "/long-distance-movers-victoria/" },
  { label: "Halifax Movers", href: "/long-distance-movers-halifax/" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/", dropdown: services },
  { label: "Local Moves", href: "/local/", dropdown: localMoves },
  { label: "Long-Distance", href: "/long-distance/", dropdown: longDistanceMoves },
  { label: "Storage", href: "/storage/" },
  { label: "Blog", href: "/blog/" },
  { label: "Reviews", href: "/testimonials/" },
  { label: "Contact", href: "/contact/" },
];

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663508689911/FhisZ7WXCdcqNnJdX5VyAC/pcm-logo_e56ce780.png";

export default function Header() {
  const [location] = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDropdownActive = (link: { href: string; dropdown?: { href: string }[] }) =>
    location === link.href || Boolean(link.dropdown?.some((item) => location === item.href || location.startsWith(item.href)));

  return (
    <header className="w-full z-50 sticky top-0">
      {/* Top Bar */}
      <div className="bg-[#A31515] text-white text-sm py-2">
        <div className="container flex flex-wrap items-center justify-between gap-2">
          <span className="hidden sm:block font-body">
            Family-owned since 1991 · Based in Coquitlam, BC · No subcontractors
          </span>
          <span className="sm:hidden font-body text-xs">Family-owned since 1991 · No subcontractors</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE_TOLLFREE.replace(/-/g, "")}`} className="flex items-center gap-1 hover:text-red-200 transition-colors">
              <Phone size={13} />
              <span className="font-body">{PHONE_TOLLFREE}</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="hidden md:flex items-center gap-1 hover:text-red-200 transition-colors">
              <Mail size={13} />
              <span className="font-body">{EMAIL}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`bg-white border-b border-gray-300 transition-shadow duration-200 ${scrolled ? "shadow-md" : "shadow-sm"}`}>
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src={LOGO_URL} alt="Purely Canadian Movers" className="h-14 w-auto rounded-xl" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-body font-semibold transition-colors ${
                      isDropdownActive(link)
                        ? "text-[#CC1A1A]"
                        : "text-gray-900 hover:text-[#CC1A1A]"
                    }`}
                    aria-expanded={openDropdown === link.label}
                    aria-haspopup="menu"
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 max-h-[70vh] w-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2 text-sm font-body text-gray-700 hover:bg-red-50 hover:text-[#CC1A1A] transition-colors"
                          role="menuitem"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-body font-semibold transition-colors ${
                    location === link.href
                      ? "text-[#CC1A1A]"
                      : "text-gray-900 hover:text-[#CC1A1A]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${PHONE_LOCAL.replace(/-/g, "")}`}
              className="flex items-center gap-1.5 text-gray-900 hover:text-[#CC1A1A] transition-colors font-body font-semibold text-sm"
            >
              <Phone size={15} />
              {PHONE_LOCAL}
            </a>
            <Button asChild className="bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold text-sm px-4">
              <Link href="/contact/">Get Free Estimate</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="bg-[#A31515] p-4 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <img src={LOGO_URL} alt="Purely Canadian Movers" className="h-12 w-auto rounded-xl" />
                  </div>
                  <a href={`tel:${PHONE_TOLLFREE.replace(/-/g, "")}`} className="flex items-center gap-2 text-sm font-body">
                    <Phone size={14} />
                    {PHONE_TOLLFREE}
                  </a>
                </div>
                <nav className="flex-1 overflow-y-auto py-2">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href}
                        className={`block px-5 py-3 font-body font-semibold text-sm border-b border-gray-100 transition-colors ${
                          location === link.href ? "text-[#CC1A1A] bg-red-50" : "text-gray-800 hover:text-[#CC1A1A] hover:bg-red-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                      {link.dropdown && (
                        <div className="bg-gray-50">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="block px-8 py-2.5 text-sm font-body text-gray-600 hover:text-[#CC1A1A] border-b border-gray-100 transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                  <Button asChild className="w-full bg-[#CC1A1A] hover:bg-[#A31515] text-white font-body font-semibold">
                    <Link href="/contact/">Get Free Estimate</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
