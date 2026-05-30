import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Star, Shield } from "lucide-react";

function MapleLeafLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 2L20.5 10H29L22.5 15L25 23L18 18L11 23L13.5 15L7 10H15.5L18 2Z" fill="#CC1A1A"/>
      <path d="M16.5 23H19.5V34H16.5V23Z" fill="#CC1A1A"/>
    </svg>
  );
}

const services = [
  { label: "Local Moving", href: "/local/" },
  { label: "Long-Distance Moving", href: "/long-distance/" },
  { label: "Cross-Country Moves", href: "/cross-country-movers/" },
  { label: "Canada–USA Moves", href: "/canada-usa/" },
  { label: "Overseas Moving", href: "/overseas/" },
  { label: "Storage Solutions", href: "/storage/" },
  { label: "Office & Corporate Moves", href: "/office/" },
  { label: "Packing & Unpacking", href: "/packing/" },
];

const serviceAreas = [
  { label: "Vancouver", href: "/vancouver/" },
  { label: "Coquitlam", href: "/coquitlam/" },
  { label: "Surrey", href: "/surrey/" },
  { label: "Burnaby", href: "/burnaby/" },
  { label: "North Vancouver", href: "/north-vancouver/" },
  { label: "Langley", href: "/langley/" },
  { label: "Local Movers Vancouver", href: "/local-movers-in-vancouver-bc/" },
  { label: "Local Movers Coquitlam", href: "/local-movers-in-coquitlam-bc/" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapleLeafLogo />
              <div>
                <div className="font-heading text-white font-bold text-lg leading-none">Purely Canadian</div>
                <div className="font-body text-gray-400 text-xs tracking-widest uppercase">MOVERS</div>
              </div>
            </div>
            <p className="font-body text-sm text-gray-400 leading-relaxed mb-4">
              Family-owned moving company serving Metro Vancouver and the Lower Mainland since 1991. No subcontractors — ever.
            </p>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#CC1A1A" className="text-[#CC1A1A]" />
              ))}
              <span className="font-body text-sm text-gray-400 ml-1">5-Star Rated</span>
            </div>
            <p className="font-body text-xs text-gray-500">BBB Accredited Business</p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="font-heading text-white font-bold text-base mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="font-body text-sm text-gray-400 hover:text-[#CC1A1A] transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Service Areas */}
          <div>
            <h3 className="font-heading text-white font-bold text-base mb-4">Service Areas</h3>
            <ul className="space-y-2">
              {serviceAreas.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="font-body text-sm text-gray-400 hover:text-[#CC1A1A] transition-colors">
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading text-white font-bold text-base mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:18774856683" className="flex items-start gap-2 font-body text-sm text-gray-400 hover:text-[#CC1A1A] transition-colors">
                  <Phone size={15} className="mt-0.5 shrink-0" />
                  <span>1-877-485-6683 (Toll-Free)</span>
                </a>
              </li>
              <li>
                <a href="tel:6045227222" className="flex items-start gap-2 font-body text-sm text-gray-400 hover:text-[#CC1A1A] transition-colors">
                  <Phone size={15} className="mt-0.5 shrink-0" />
                  <span>604-522-7222 (Local)</span>
                </a>
              </li>
              <li>
                <a href="mailto:esales@pcmovers.ca" className="flex items-start gap-2 font-body text-sm text-gray-400 hover:text-[#CC1A1A] transition-colors">
                  <Mail size={15} className="mt-0.5 shrink-0" />
                  <span>esales@pcmovers.ca</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gray-500" />
                <span className="font-body text-sm text-gray-400">
                  Unit 16–91 Golden Dr.<br />
                  Coquitlam, BC V3K 6R2
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={15} className="mt-0.5 shrink-0 text-gray-500" />
                <span className="font-body text-sm text-gray-400">
                  Office: Mon–Fri 9am–5pm<br />
                  Moving Services: 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-body text-xs text-gray-500 flex items-center gap-2">
            © {new Date().getFullYear()} Purely Canadian Movers. All rights reserved.
            <Link
              href="/admin/login"
              title="Admin"
              className="text-gray-700 hover:text-gray-500 transition-colors opacity-40 hover:opacity-70"
              aria-label="Admin login"
            >
              <Shield size={12} />
            </Link>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://share.google/8CPKIYw6TOJB1W8rX"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-gray-500 hover:text-[#CC1A1A] transition-colors"
            >
              Google Reviews
            </a>
            <a
              href="https://www.yelp.com/biz/purely-canadian-movers"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-gray-500 hover:text-[#CC1A1A] transition-colors"
            >
              Yelp
            </a>
            <Link href="/testimonials/" className="font-body text-xs text-gray-500 hover:text-[#CC1A1A] transition-colors">
              Read Our Reviews
            </Link>
            <Link href="/contact/" className="font-body text-xs text-gray-500 hover:text-[#CC1A1A] transition-colors">
              Request a Free Estimate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
