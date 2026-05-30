# Purely Canadian Movers — Project TODO

## Database & Backend
- [x] Update drizzle/schema.ts with blog_posts table
- [x] Run database migration (pnpm db:push)
- [x] Add blog DB helpers to server/db.ts
- [x] Add tRPC routers: blog CRUD, contact form, AI chat, AI blog generator
- [x] Add admin-only procedure guard

## Global Components
- [x] index.css — True North Red design system (Playfair Display + Source Sans 3)
- [x] SEO component (title, meta description, canonical, OG tags)
- [x] ScrollToTop component (wouter useLocation, behavior: instant)
- [x] Header component (top bar + main nav + mobile hamburger + dropdown)
- [x] Footer component (4-column + bottom bar with Google/Yelp links)
- [x] AI floating chat widget (all pages)
- [x] robots.txt

## Pages — Main
- [x] Homepage (/) — hero, trust bar, why choose us, services grid, how it works, service areas, testimonials, FAQ, AI chat section, preferred vendors, CTA
- [x] Services Hub (/services/)
- [x] About (/about/)
- [x] Testimonials (/testimonials/)
- [x] Contact (/contact/) — estimate request form with success state + owner notification
- [x] 404 Not Found

## Pages — Service Pages
- [x] Local Moving Hub (/local/)
- [x] Local Movers Vancouver (/local-movers-in-vancouver-bc/)
- [x] Local Movers Coquitlam (/local-movers-in-coquitlam-bc/)
- [x] Long-Distance Moving (/distance/)
- [x] Cross-Country Movers (/cross-country-movers/)
- [x] Canada–USA Moves (/canada-usa/)
- [x] Overseas Moving (/overseas/)
- [x] Storage Solutions (/storage/)
- [x] Cross-Country Pricing Guide (/x-country/)

## Pages — City Pages
- [x] Vancouver (/vancouver/)
- [x] Coquitlam (/coquitlam/)
- [x] Surrey (/surrey/)
- [x] Burnaby (/burnaby/)
- [x] North Vancouver (/north-vancouver/)
- [x] Langley (/langley/)
- [x] Richmond (/richmond/)
- [x] New Westminster (/new-westminster/)

## Blog System
- [x] Blog listing page (/blog/) — published posts only
- [x] Individual blog post page (/blog/:slug/) — markdown rendering, cover image, CTA

## Admin System
- [x] Admin Login (/admin/login) — passphrase "BlogCreator" → Manus OAuth
- [x] Admin Blog Panel (/admin/blog) — list posts, publish/unpublish/delete, AI generator
- [x] AI Blog Generator — topic input → LLM generates full post + cover image → save as draft

## SEO
- [x] Unique title + meta description + canonical + OG tags on every page
- [x] robots.txt

## Migration Pre-Launch
- [ ] Optimize Vite production bundle size before launch; current build passes but reports chunks over 500 kB.

## Fixes & Updates
- [x] Update contact form notification email to Esales@pcmovers.ca
- [x] Install Resend SDK and add RESEND_API_KEY secret
- [x] Wire Resend into contact form router to send to Esales@pcmovers.ca
- [x] Remove notifyOwner backup from contact form (stop sending to edwardkita@gmail.com)
- [x] Switch to Gmail SMTP (nodemailer) for contact form email delivery
- [x] Add SMTP_USER and SMTP_PASS secrets for Gmail App Password auth

## Testing
- [x] auth.logout.test.ts — session cookie clearing
- [x] blog.test.ts — blog router CRUD, access control, contact form validation
- [x] Add Google Reviews link/CTA to the contact form page
- [x] Fix broken nav links: Office & Corporate Moves (/services/#office) and Packing & Unpacking (/services/#packing)
- [x] Audit and fix all other broken links site-wide
- [x] Create dedicated /office/ and /packing/ service pages
- [x] Round corners on navigation bar logo image
- [x] Complete site audit: SEO metadata, schema markup, AI search optimization
- [x] Add LocalBusiness + MovingCompany JSON-LD schema to all pages
- [x] Add Service schema to each service page
- [x] Add FAQ schema to relevant pages
- [x] Add BreadcrumbList schema to all inner pages
- [x] Optimize all page meta titles and descriptions for target keywords
- [x] Add Open Graph and Twitter Card meta tags
- [x] Create/update sitemap.xml and robots.txt
- [x] Add llms.txt for AI search optimization
- [x] Fix accessibility issues (aria labels, focus rings, alt text)
- [x] Add canonical URLs to all pages
- [x] Audit and improve page content for E-E-A-T signals
- [x] Add PCM trucks photo (Trucks33and34.jpg) beside the top heading on the Local Moving page
- [x] Add Great Canadian Van Lines truck photo (Wade.webp) beside the top heading on the Long-Distance Moving page
- [x] Add mention on Long-Distance page that PCM are agents of Great Canadian Van Lines
- [x] Send real-time email to esales@pcmovers.ca when visitor sends chatbot message
- [x] Add contact CTA to chatbot after 2-3 exchanges (suggest calling or contact form)
- [x] Replace all placeholder/made-up reviews on the Reviews page and homepage with real Google reviews provided by the user
- [x] Add Natasha Rana's Google review to Testimonials page and homepage
- [x] Add K VH's Google review to Testimonials page
- [x] Add Arman Mesri's Google review to Testimonials page
- [x] Add Joyce's Google review to Testimonials page
- [x] Add Andrew Hitchcock's Google review to Testimonials page
- [x] Remove Amirali Farahnia and Charles Cruickshank reviews from Testimonials page
- [x] Reorder reviews to mix short and long for visual variety
- [x] Replace "5 Stars" text badge on review cards with actual star icons
- [x] Update Storage page: "Secure storage facility in Coquitlam, BC" → "...and throughout Canada"
- [x] SEO: Set /vancouver/ city page canonical to /local-movers-in-vancouver-bc/ (stronger, more specific page)
- [x] SEO: Differentiate /local/ (Metro Vancouver hub) from /local-movers-in-vancouver-bc/ and /local-movers-in-coquitlam-bc/ with clear canonical tags
- [x] SEO: Add noindex to blog index/archive page when filtered by category or tag (N/A - no tag/category archives exist)
- [x] SEO: Add noindex to BlogPost pages that are drafts or thin content
- [x] SEO: Add robots.txt disallow for admin pages (already present)
- [x] SEO: Add internal links from /local/ hub to city-specific local mover pages
- [x] SEO: Guide user to submit sitemap to Google Search Console (instructions provided in chat)
- [x] Add Google Search Console HTML verification file to client/public/
- [x] Add Google Search Console meta tag verification to index.html <head>
- [x] Fix factual consistency across all city pages: one HQ identity (Coquitlam), service-area language separated from office-location language
