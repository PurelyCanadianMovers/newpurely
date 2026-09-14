# Canonical Long-Distance Route Page Standard

## 1. Scope

This document freezes the presentation contract for Purely Canadian Movers long-distance route pages. The reference is the rendered `/montreal-to-edmonton-movers/` page after the Step 1 FAQ cleanup, inspected locally on 2026-09-02.

This standard governs shared presentation and structure. It does **not** make Montreal/Edmonton copy, prices, timing, local facts, links, or metadata reusable defaults. All fields identified in [Route-specific data](#17-route-specific-data) must be supplied and validated per route.

Step 3 is documentation only. It does not change route ownership documented in `docs/ROUTE_PAGE_OWNERSHIP.md`, route output, shared runtime code, or any other route page.

Normative terms:

- **MUST**: required for a standardized route.
- **SHOULD**: expected unless a route-specific reason is documented.
- **MAY**: optional presentation/content module.
- **REFERENCE ONLY**: observed on the canonical page but explicitly excluded from propagation under [Known defects and improvements](#19-known-reference-defects-and-improvements-not-to-propagate).

## 2. Canonical reference

- Route path: `/montreal-to-edmonton-movers/`
- Canonical production URL: `https://purelycanadianmovers.com/montreal-to-edmonton-movers/`
- Checked-in shell: `site-copy/montreal-to-edmonton-movers/index.html`
- Shared font request: Google Fonts, Playfair Display weights 400/600/700/900 and Source Sans 3 weights 300/400/500/600/700.
- Shared compiled app assets: `site-copy/assets/index-CNBNs70h.js` and `site-copy/assets/index-DOGLBY_X.css`.
- Shared conversion assets: `site-copy/assets/conversion-boost.js` and `site-copy/assets/conversion-boost.css`.

The reference is the **rendered** page after the compiled React route and `conversion-boost.js` have run. Raw-shell and rendered validation are both required because some metadata and blocks are normalized at runtime.

## 3. Exact rendered component order

The actual top-to-bottom document-flow order was measured from the final rendered page. Do not substitute the example order from the task brief.

| Order | Component | Status | Classification | Notes |
|---:|---|---|---|---|
| 1 | Quote panel | MUST | Shared presentation; route-specific data | Rendered before the header. One primary route estimate form only. |
| 2 | Pricing section | MUST | Shared presentation; route-specific data | Rendered immediately after the quote panel. One pricing table only. |
| 3 | Header/navigation | MUST | Shared | Sticky at the point it enters the viewport; it is not the first document-flow component on this reference. |
| 4 | Hero | MUST | Shared presentation; route-specific copy | Route eyebrow, one H1, intro, two CTAs, four trust badges. |
| 5 | Red trust strip | MUST | Shared | Full-width proof statement. |
| 6 | Main route-content section | MUST | Shared presentation; unique route content | Introductory route copy, Route at a Glance, route tips, proof list, and move-process cards. The wording and exact content modules remain route-specific. |
| 7 | FAQ | MUST | Shared presentation; route-specific Q&A | Exactly one visible heading/section/implementation and one matching schema. |
| 8 | Related destinations | SHOULD | Shared presentation; route-specific links | Separate light-gray section. Links must be relevant and valid for the route. |
| 9 | Closing conversion CTA | MUST | Shared presentation; route-specific wording allowed | Dark, centered, full-width section before the footer. |
| 10 | Footer | MUST | Shared | Shared four-column footer plus runtime-added support links. |
| 11 | Post-footer local SEO block | REFERENCE ONLY | Resolved contamination | Removed from the reference in Step 8. It remains explicitly excluded from the standard; see §19. |

The following are floating/runtime UI and are **not** normal document-flow sections:

- React AI chatbot launcher and open chat panel: MUST where the shared React runtime is used.
- `conversion-boost.js` sticky estimate/call bar: optional runtime conversion UI; must not overlap the chatbot or obscure content.
- `conversion-boost.js` delayed chat nudge: optional runtime conversion UI; must not create a second chatbot or cover primary controls.

## 4. Typography

### 4.1 Families and assets

| Role | Family | Current authority |
|---|---|---|
| Headings and display values | `"Playfair Display", serif` in the compiled app; conversion cards use `"Playfair Display", Georgia, serif` | Google Fonts link in route shell; `.font-heading` in `index-DOGLBY_X.css`; explicit selectors in `conversion-boost.css` |
| Body copy | `"Source Sans 3", sans-serif` | `.font-body`/body rules in `index-DOGLBY_X.css` |
| Conversion body/forms/buttons | `"Source Sans 3", Arial, sans-serif` | `.pcm-lead-boost` in `conversion-boost.css` |
| React buttons/forms | Source Sans 3 through inherited body/font-body utilities | Compiled app CSS and bundle |

Do not replace either family when standardizing a route. A route passes font validation only after the computed family is confirmed; loading the Google Fonts URL alone is insufficient.

### 4.2 Computed reference scale

| Element | Desktop computed value | Tablet/mobile computed value | Notes |
|---|---|---|---|
| Hero H1 | 48px / 60px / 700 | 36px / 45px / 700 below the `lg` breakpoint | Class: `text-4xl lg:text-5xl font-bold leading-tight`; `lg` begins at 1024px. |
| Primary route H2 | 30px / 36px / 700 | Same | Used for the main introduction and FAQ/closing CTA headings. |
| Route subsection H2 | 24px / 32px / 700 | Same | Used for tips, proof, and move-process headings. |
| Related-links H2 | 20px / 28px / 700 | Same | Centered. |
| Quote-panel H2 | 30px / 34.5px / 700 | 25px / 28.75px / 700 at `max-width: 820px` | `conversion-boost.css`; 1.15 line height. |
| Pricing H2 | 32px / 38.4px / 700 | Same in the current CSS | `conversion-boost.css`; 1.2 line height. |
| Route-at-a-Glance heading | 20px / 28px / 700 | Same | H3 display heading. |
| Glance value | 18px / 28px / 700 | Same | Playfair Display. |
| Content-card/process H3 | 16px / 24px / 700 | Same | The reference does not use one universal H3 size. |
| FAQ question H3 | 16px / 24px / 700 | Same | Playfair Display. |
| Body | 16px / 25.6px / 400 | Same | Source Sans 3. |
| Hero intro | 18px / 29.25px / 400 | Same | `text-lg leading-relaxed`. |
| Quote intro | 17px / 25.5px / 400 | Same | 1.5 line height. |
| Pricing intro | 17px / 26.35px / 400 | Same | 1.55 line height; maximum 860px. |
| FAQ answer | 14px / 22.75px / 400 | Same | `text-sm leading-relaxed`. |
| Quote/form button | 16px / inherited 25.6px / 800 | Same | Minimum height 44px. |
| Form label/control | 12px / 19.2px / 800 inherited | Same | Controls are at least 42px high. |
| Table header | 14px / 22.4px / 700 | Same | White on `#111827`. |
| Table cell | 16px / 25.6px / 400 | Same | 13px 14px cell padding. |

The frequently cited “18px / 28px H3” applies to glance values, not every H3. Main content cards and FAQ questions compute to 16px / 24px; the glance block title computes to 20px / 28px.

## 5. Layout widths

All widths below are CSS-pixel contract values from the source rules and confirmed computed styles. Fractional measured borders are browser-scale artifacts; the authored borders are whole CSS pixels.

| Component | Contract |
|---|---|
| General app container | Width 100%; responsive max-width utilities: 640px at `sm`, 768px at `md`, 1024px at `lg`, 1280px at `xl`; horizontal padding 16px base, 24px at `sm`, 32px at `lg`. |
| Hero container | General container, `py-20 lg:py-28`: 80px vertical padding below 1024px, 112px at/above 1024px. |
| Hero content | `max-w-2xl`: maximum 672px. Left-aligned. |
| Quote shell | `max-width: 1120px`; 20px horizontal padding; 24px top/bottom margin. Inner card width is shell content width (1080px at a full 1120px shell). |
| Pricing shell | `max-width: 1120px`; 20px horizontal padding; 24px top/bottom margin. Inner card width is 1080px at full shell width. |
| Main SEO content | `.container.max-w-4xl`: maximum 896px including container padding; usable content width is 832px with 32px desktop sides. |
| FAQ content | `.container.max-w-3xl`: maximum 768px including padding; usable desktop width is 704px. |
| Closing CTA content | `.container.max-w-2xl`: maximum 672px including padding; usable desktop width is 608px. |
| Footer | General container; full available width up to 1280px. |

## 6. Spacing

### 6.1 Page and section spacing

- Quote and pricing outer margins: 24px above and below. Quote becomes 16px above/below at `max-width: 820px`; pricing currently remains 24px.
- Main white content and FAQ: 64px top and bottom (`py-16`).
- Related destinations: 48px top and bottom (`py-12`).
- Closing CTA: 64px top and bottom (`py-16`).
- Footer primary area: 48px top/bottom; 64px at `lg`.
- Footer legal row: 16px top/bottom.
- Standard content block separation: 40px bottom (`mb-10`) for glance, tips grid, proof list, and process grid.
- Major H2 margin: 24px below; FAQ heading uses 32px below; closing CTA H2 uses 16px below.
- Content-card grid gap: 16px. Related-route grid gap: 12px.
- Paragraph rhythm in the route introduction is expressed by `space-y-4` (16px between children).

### 6.2 Card spacing

- Quote inner card: 24px padding desktop; 18px at `max-width: 820px`; 24px column gap.
- Pricing inner card: 26px padding at all current breakpoints.
- Route-at-a-Glance card: 24px padding, 16px grid gap, 40px bottom margin.
- Tips/process cards: 20px padding, 16px grid gap.
- FAQ cards: 24px padding, 16px bottom gap.
- Mobile route/main/FAQ horizontal padding: 16px at ~390px.
- Mobile quote shell: 14px horizontal padding; pricing shell remains 20px.

Avoid introducing arbitrary margins. Reuse the current spacing utilities or the exact conversion classes above.

## 7. Header and navigation

### 7.1 Shared behavior

- Position: `sticky; top: 0; z-index: 50`.
- The header contains a dark-red proof/contact bar above a white navigation bar.
- Desktop proof bar is approximately 36px high; navigation is 64px high (plus border). The combined desktop reference is approximately 101.5px.
- The navigation container is horizontally distributed: logo left, nav items center, phone/estimate actions right.
- Logo is left-aligned and uses `h-14` (56px) with automatic width and a 12px radius.
- Desktop navigation appears at `lg` (1024px). Nav group gap is 4px; items use 12px horizontal and 8px vertical padding, Source Sans 3, 14px, weight 600.
- Dropdowns are button-triggered. They open below their trigger, left-aligned, 224px wide, white, 1px gray border, 8px radius, shadow, `z-index: 50`; item padding is 16px by 8px. Clicking outside closes them.
- Desktop CTA area contains the local phone link and a red “Get Free Estimate” action with a 12px gap.
- The header background becomes translucent white with backdrop blur and stronger shadow after scrolling more than 10px.

### 7.2 Mobile behavior

- Below 1024px, desktop nav and desktop CTA are hidden; a native button labelled `Open menu` appears on the right.
- The mobile menu is a right-side sheet: 320px (`w-80`) wide, full viewport height, with an overlay and a visible close control. At very narrow screens it still must fit without clipping.
- The sheet contains the phone link, Home, expanded groups for Services, Local Moves, and Long-Distance, remaining primary links, and the estimate CTA.
- `aria-expanded` on the mobile trigger changes from `false` to `true` when the sheet opens. Radix sheet semantics provide a dialog and focus behavior.

### 7.3 Keyboard/focus contract

- Links and buttons MUST remain native keyboard-focusable and activate with standard keyboard behavior.
- Visible focus indicators MUST not be removed.
- The mobile sheet MUST trap/restore focus and close via its close control and Escape.
- Desktop dropdown triggers SHOULD expose accurate `aria-expanded` and menu relationships. The reference currently does not; this is a known improvement, not behavior to copy.

Current implementation authority: compiled `Header.tsx` code embedded in `site-copy/assets/index-CNBNs70h.js`; layout/color utilities in `site-copy/assets/index-DOGLBY_X.css`.

## 8. Hero

- Full-width, dark gray (`bg-gray-900`) section with white text and `overflow: hidden`; no border and no rounded outer edge.
- Inner container uses 80px vertical padding below 1024px and 112px at/above 1024px.
- Content is left-aligned with a 672px maximum width.
- Order inside hero content: route eyebrow; H1; intro paragraph; primary/secondary CTA row; trust-badge row.
- H1 is the sole page H1 and uses the scale in §4.
- Intro is directly below the H1, with 16px H1 bottom margin and 32px intro bottom margin.
- CTA row wraps, uses a 16px gap and 32px bottom margin. Trust badges wrap with a 12px gap.
- At mobile widths the content remains left-aligned, fills the padded width, and wraps naturally. No form control belongs in the hero on this reference.

The route eyebrow, H1, intro, CTA labels/targets where relevant, and badge claims are content/data. The dark full-width presentation, widths, alignment, typography, and spacing are shared.

## 9. Quote panel

### 9.1 Card

- Outer maximum width: 1120px; 20px horizontal padding; 24px vertical margin.
- Inner card: white; 1px `#e5e7eb` border; 5px solid `#cc1a1a` left border; 8px radius; `0 16px 40px rgba(17,24,39,.12)` shadow; 24px padding.
- Desktop layout: two-column grid, `minmax(0,1fr) minmax(320px,420px)`, 24px gap, vertically centered. The form column caps at 420px.
- Breakpoint: at `max-width: 820px`, the card becomes one column, uses 18px padding, the outer shell uses 14px horizontal padding and 16px vertical margin, and the heading changes to 25px.

### 9.2 Intro and trust pills

- Eyebrow: Source Sans 3, 13px, 800, uppercase, red, 6px bottom margin.
- One H2 follows, then one 17px intro paragraph.
- Exactly six reference trust pills appear in a wrapping flex row with 8px gaps and 16px top margin.
- Pills: Source Sans 3, 13px, 700; 7px 10px padding; full-pill radius; soft gray background and 1px gray border. Pills 3 and 5 use pale red and a 28%-opacity red border.
- Trust claims are shared business data and must remain factually current; they are not route geography.

### 9.3 Form

- Desktop form: two equal columns, 10px gap. Fields are origin, destination, home size, and move date.
- At `max-width: 820px`, form and button row become one column; a red, uppercase 13px “Begin here” marker becomes visible.
- Labels: 12px, 800, 4px label/control gap. Inputs/selects: full width, minimum height 42px, 8px 10px padding, 1px `#d1d5db` border, 6px radius. Focus uses red border plus `0 0 0 3px rgba(204,26,26,.14)`.
- Button row spans the form. Buttons have a 44px minimum height, 10px 14px padding, 6px radius, 800 weight. Primary is red/white; secondary is white/red. On mobile they become full-row buttons.
- Reassurance text spans both columns, 14px / 18.9px / 800.
- Promo/bonus treatment: pale-red panel, 1px `#f2b8b8` border, 6px radius, 10px 12px padding, 10px gap, 34px icon column. The icon is a 30px red circle. Strong text is red, 14px/900; detail is 13px.
- Verified-details treatment: soft-gray panel, 1px gray border, 6px radius, 10px 12px padding, 13px / 18.2px. Verified phone links are red and 800.

### 9.4 Data boundary

The panel's presentation is shared. These inputs are route data and MUST be generated per route: origin and province/state, destination and province/state, route-name/heading copy, form placeholder/defaults, any pricing language, any route-specific reassurance, and contact/CTA targets if they differ. Never inherit Montreal or Edmonton merely because the visual panel is reused.

Current authority: markup/config/defaults are created or normalized by `site-copy/assets/conversion-boost.js`; styling is in `site-copy/assets/conversion-boost.css`; the finalizer may normalize checked-in form defaults.

## 10. Pricing

- Outer shell: maximum 1120px, 20px horizontal padding, 24px vertical margin.
- Inner card: white; 1px gray border; 5px red left border; 8px radius; `0 10px 30px rgba(17,24,39,.08)` shadow; 26px padding.
- Eyebrow is route-labelled, red, uppercase, 13px/900 with `.08em` tracking and 8px bottom margin.
- Heading pattern is a route-specific “How much does it cost to move from [origin] to [destination]?” H2 in the shared 32px/38.4px pricing style.
- Intro copy is 17px/26.35px with maximum width 860px and 18px bottom margin.
- Table wrapper: 1px gray border, 8px radius, 18px top/bottom margin, `overflow-x: auto`.
- Table: one header row and route-data body rows; `border-collapse: collapse; width:100%; min-width:760px`.
- Header columns in the reference are: **Home size**, **Estimated cost**, **Notes**, **Typical transit**.
- The reference contains five rows: studio, 1-bedroom, 2-bedroom, 3-bedroom, and 4+ bedroom. Future routes SHOULD preserve this useful home-size shape when route data supports it; never reuse its values.
- Cells use 13px 14px padding and a 1px bottom border. Header cells are `#111827` with white 14px text. Alternate body rows use `#f9fafb`. Final row has no bottom border.
- The disclaimer/note follows the table at 14px and MUST state that figures are planning ranges/not guaranteed quotes, identify relevant price factors, and use the approved term **Declared Value Protection** where applicable.
- Related pricing links follow as wrapping pills with a 10px gap; 9px 13px padding; pale-red background; red border/text; hover reverses to red/white.
- On narrow screens only the table wrapper scrolls horizontally. The page itself MUST NOT scroll horizontally.

All prices, ranges, row notes, transit windows, inclusion statements, currency, disclaimer details, eyebrow, heading, and related links are route data.

## 11. Route at a Glance

- Exactly one glance card is required.
- Reference structure: one H3 plus exactly three items: distance, estimated transit time, and typical cost range.
- Outer card: soft gray (`bg-gray-50`), 1px gray border, 12px radius, 24px padding, 40px bottom margin.
- H3: Playfair Display, 20px/28px/700, 16px bottom margin.
- Item grid: three equal columns at `sm` (640px) and above; one column below 640px; 16px gap.
- Each item is a flex row aligned to the top with a 12px gap and a 20px line icon.
- Item label: Source Sans 3, 12px/16px, uppercase, gray, wider tracking, 2px bottom margin.
- Item value: Playfair Display, 18px/28px/700, dark gray.
- Item qualifier: Source Sans 3, 14px/20px, gray.

Distance, transit time, cost/range, route label/qualifier, and any necessary units/currency are route data. Icons, three-item layout, typography, card presentation, and responsive grid are shared.

## 12. Main route content

The main route-content area standardizes presentation, not wording.

- Full-width white section with 64px vertical padding.
- Content container: maximum 896px including responsive padding; 832px usable content width on desktop.
- Hierarchy: one main 30px H2 may introduce the route; subsequent modules use 24px H2s; card headings use 16px H3s. Do not skip heading levels merely to obtain a visual size.
- Body copy: 16px/25.6px. Introductory prose uses a 16px vertical rhythm between paragraphs.
- Route-at-a-Glance appears after the route introduction in the reference.
- Route-tip cards: responsive grid, one column below 640px and two columns at/above 640px; 16px gap; soft-gray background; 1px gray border; 12px radius; 20px padding; 40px grid bottom margin.
- Proof/benefit list: 12px vertical item rhythm (`space-y-3`), 40px bottom margin, check-icon treatment from the shared app.
- Move-process cards: one column below 640px, two columns from 640px, four columns from 1024px; 16px gap; centered soft-gray cards with 1px border, 12px radius, and 20px padding; 40px bottom margin.
- Related destinations: separate soft-gray full-width section, 48px vertical padding, 896px container; grid is two columns by default, three from 640px, four from 1024px, with 12px gaps.
- Closing CTA: separate dark full-width section, 64px vertical padding, centered 672px container, wrapping buttons.

Optional route modules MAY be omitted or added when the route warrants them, provided hierarchy, spacing, card language, and responsive rules remain consistent. Unique route paragraphs, city-specific logistics, neighbourhood references, climate/regulatory information, corridor-specific SEO copy, and cross-border requirements MUST NOT be overwritten merely to achieve structural consistency.

## 13. FAQ

### 13.1 Content/schema invariant

Every standardized route MUST have:

1. Exactly one visible FAQ section.
2. Exactly one visible FAQ H2.
3. Exactly one FAQ implementation.
4. Exactly one `FAQPage` JSON-LD object.
5. A one-to-one match between visible question/answer text and `mainEntity` question/accepted-answer text.

The canonical baseline has 12 visible questions and 12 matching schema entities. The number and wording MAY differ for another route when justified by real route intent, but duplication is never allowed. Do not add a generic FAQ below the app/footer, a hidden FAQ, a stale schema, or an additional schema disconnected from the visible content.

### 13.2 Visual/interaction contract

- Full-width soft-gray section with 64px vertical padding.
- FAQ container: maximum 768px including responsive padding; 704px usable desktop width.
- Centered H2: 30px/36px/700, 32px bottom margin.
- Each Q&A is a white card with 1px gray border, 12px radius, 24px padding, and 16px bottom margin.
- Question: Playfair Display, 16px/24px/700, 8px bottom margin.
- Answer: Source Sans 3, 14px/22.75px/400.
- Current reference interaction: **always-expanded static cards**. There is no accordion control and no open/close state. Future routes that claim parity must not introduce hidden answers or accordion behavior without a separately approved accessibility/design change.
- On mobile, cards remain always expanded and full width inside 16px page padding; typography and 24px card padding remain unchanged.

Current authority: visible Q&A markup and `#faq-schema` originate in the compiled route component/prerendered shell; `normalizeMontrealEdmontonRouteContent()` in `conversion-boost.js` rebuilds the Montreal → Edmonton schema entities from the visible H3/P pairs.

## 14. Footer

- Full-width dark gradient footer with a 4px red top border.
- Primary container uses 48px vertical padding and 64px at `lg`; responsive horizontal container padding applies.
- Core desktop grid: four equal columns at `lg`, 48px gap. It becomes two columns at `sm` and one column below 640px with a 32px base gap.
- Core columns are brand/trust, services, service areas, and contact. Headings use Playfair Display, white, 16px/700, with 16px bottom margin; links/body are Source Sans 3, predominantly 14px.
- Brand column includes wordmark, company summary, rating treatment, and accreditation statement.
- Contact column includes toll-free/local phone, email, linked address, and office/service hours.
- `conversion-boost.js` enhances the map link and appends a **Customer Support** link group (`.pcm-footer-support-links`). Its styling is Source Sans 3 with 10px grid gaps; heading is Playfair Display, white, 18px. These enhancements come from shared runtime code and must remain shared, not copied into route-specific content.
- Bottom legal/social row has a top border, 16px vertical padding, wrapping flex layout, 12px gap, 12px muted text, copyright/admin link left and review/contact links right.
- Mobile: all primary columns stack; the legal row wraps without clipping; link tap targets must remain usable.

Current authority: compiled `Footer.tsx` in `index-CNBNs70h.js`, utility styles in `index-DOGLBY_X.css`, and support/address enhancements in `conversion-boost.js`/`.css`.

## 15. Chatbot and floating conversion UI

### 15.1 React chatbot

- Launcher: fixed bottom-right, 56px square, circular, red `#cc1a1a`, white 22px message icon, large shadow, `z-index: 50`.
- Desktop and current mobile offsets: 24px from right and 24px from bottom.
- Closed state label: `Open chat assistant`; open state label: `Close chat`.
- Open panel: fixed 24px from the right and 96px from the bottom; white; 1px gray border; 16px radius; large shadow; clipped internal overflow; `z-index: 50`.
- Panel width: 384px from `sm` upward and 320px below 640px. Reference content height is automatic (approximately 301px desktop and 324px at ~390px with the initial message).
- Panel structure: red header/identity treatment, close control, scrollable message region, text input, and send button. Opening moves focus to the message field; closing returns to launcher behavior.
- The launcher/panel must remain wholly inside the viewport at ~390px and must not cover an essential form action.

Current authority: compiled `AIChatWidget.tsx` in `index-CNBNs70h.js`; app utility styles in `index-DOGLBY_X.css`.

### 15.2 Conversion runtime UI

- `conversion-boost.js` also adds `.pcm-sticky-cta` and a delayed `.pcm-chat-nudge` that opens the existing React chatbot.
- These controls are shared runtime enhancements, not route-content sections and not a second chatbot implementation.
- Desktop sticky CTA is fixed 18px from bottom/left; mobile uses 10px from bottom/left/right and equal-width actions.
- Mobile nudge uses a maximum width of `calc(100vw - 36px)`, right offset 18px, bottom offset 92px.
- Floating UI MUST be collision-tested together. The current overlap risk is listed in §19 and is not a requirement to copy.

## 16. Responsive behavior

### 16.1 Desktop reference (~1280px CSS viewport)

- H1: 48px/60px.
- Desktop navigation and CTA are visible; header is approximately 101.5px tall.
- Hero container uses 112px vertical and 32px horizontal padding; content caps at 672px.
- Quote/pricing shells cap at 1120px. Quote is two columns with a 420px form column.
- Main content caps at 896px; FAQ caps at 768px.
- Route-at-a-Glance has three columns; tips have two; process has four; footer has four.
- Chat panel is 384px wide, 24px right, 96px bottom.

### 16.2 Tablet and existing breakpoints

- At `<1024px`, desktop nav/CTA switch to the mobile menu and H1 becomes 36px/45px. Process cards change from four columns to two.
- At `max-width:820px`, quote card/form/button grids stack, quote padding becomes 18px, quote shell padding becomes 14px, and quote H2 becomes 25px/28.75px.
- At `<640px`, Route-at-a-Glance, tips, process, and footer core grids become one column; related routes retain a two-column base grid. Chat panel changes from 384px to 320px. Chat nudge changes to its mobile offsets.
- Pricing remains a card with a 760px minimum-width table inside its own horizontal scroller.

### 16.3 Mobile reference (~390px)

- Effective content width is viewport minus the vertical scrollbar; normal main/FAQ padding is 16px per side.
- H1 remains 36px/45px and wraps naturally.
- Hero uses 80px vertical and 16px horizontal padding.
- Quote shell uses 14px horizontal padding; inner card uses 18px; form controls and buttons occupy one full column with no clipping.
- Pricing shell uses 20px horizontal padding and 26px inner padding; table wrapper, not the page, scrolls horizontally.
- Route-at-a-Glance is one column with 16px gaps.
- FAQ cards stay visible/expanded and use 24px padding.
- Footer columns stack and bottom links wrap.
- Chat launcher remains 56px at 24px right/bottom; chat panel is 320px wide at 24px right and 96px bottom.

At every width a standardized page MUST have no page-level horizontal overflow, clipped form controls, broken tables, overlapping floating UI, or off-screen interactive controls. At ~390px the measured reference had no page-level horizontal overflow; the 760px pricing table remained confined to its scroll wrapper.

## 17. Route-specific data

Future migrations MUST preserve or deliberately author these values per route. They are never copied from Montreal → Edmonton merely for visual consistency.

### 17.1 Identity and metadata

- Origin city and province/state/country.
- Destination city and province/state/country.
- Directionality and reverse-route references.
- Route slug/path and public route URL.
- Canonical URL and Open Graph URL.
- Document title, Open Graph/Twitter title, and meta/OG/Twitter description.
- Robots directives, locale, and route-relevant geo/service-area metadata where applicable.
- Hero eyebrow, one H1 route wording, intro, and closing CTA wording.

### 17.2 Estimate and pricing

- Quote-form origin/destination defaults or placeholders.
- Route name in quote/pricing headings.
- Currency.
- Distance and units.
- Transit-time range and qualifiers.
- Pricing by supported home/shipment size.
- Pricing notes, inclusions, disclaimer, cost factors, and protection terminology.
- Route-specific promo/reassurance only when substantiated.

### 17.3 Route content

- Route-specific introductory and SEO copy.
- Corridor-specific logistics, season/weather, access, ferry/border/customs, storage, and scheduling facts.
- City/province/state laws, licensing, tax, health-card, vehicle, neighbourhood, and language details.
- Route-at-a-Glance labels/values/qualifiers.
- Tips, proof points, move-process deviations, and route-specific CTAs.
- Relevant origin/destination hubs and related-route internal links.
- Cross-border details and authoritative external links where relevant.

### 17.4 FAQ and structured data

- Visible FAQ questions and answers.
- Matching `FAQPage` schema entities.
- Route-specific `Service`, breadcrumb, organization/local-business references, `WebPage`, and other structured data.
- Structured-data IDs, URLs, areas served, descriptions, and offers where used.

### 17.5 Assets and links

- Route-relevant images and accurate alternative text when a route uses imagery.
- Every internal/CTA/contact link and any reverse-route link.
- Correct phone/email only from shared current business data; do not hard-code stale contact data in route copy.

## 18. Required validation

Every future standardized route must pass both raw-HTML and browser-rendered checks at approximately 1280px and 390px, plus targeted checks around 1024px, 820px, and 640px.

### 18.1 Structure/content

- [ ] Exactly one H1.
- [ ] Exactly one primary quote form.
- [ ] Exactly one pricing section and one pricing table.
- [ ] Exactly one Route-at-a-Glance block.
- [ ] Exactly one visible FAQ section/H2/implementation.
- [ ] Exactly one `FAQPage` schema.
- [ ] Visible FAQ question/answer text matches schema one-for-one.
- [ ] No hidden or post-footer FAQ duplicate.
- [ ] No `undefined` in visible text, attributes, metadata, or structured data.
- [ ] No legacy `Moving Cost Breakdown` heading/block.
- [ ] No duplicate pricing or duplicate FAQ.
- [ ] No homepage/local-service contamination.
- [ ] No React 404 heading/content contamination.

### 18.2 Route identity/SEO

- [ ] Correct route path and canonical URL in raw and rendered HTML.
- [ ] Correct Open Graph URL.
- [ ] Correct title and meta/OG/Twitter descriptions.
- [ ] Correct H1 and route direction.
- [ ] Correct origin/destination form defaults.
- [ ] Correct distance, transit time, price data, disclaimers, FAQs, structured data, and internal links.
- [ ] No copied city/province/cross-border facts from the canonical reference.

### 18.3 Presentation/responsive

- [ ] Playfair Display computes on headings and Source Sans 3 on body/forms/buttons.
- [ ] Width, padding, spacing, border, radius, shadow, and breakpoint rules match this contract.
- [ ] No page-level horizontal overflow at desktop, tablet, or ~390px.
- [ ] No clipped labels, inputs, selects, buttons, or focus rings.
- [ ] Pricing table scrolls inside its wrapper at narrow widths and remains readable.
- [ ] Route-at-a-Glance and content/footer grids change at the documented breakpoints.
- [ ] Header remains usable; desktop dropdowns work.
- [ ] Mobile menu opens, closes, reports state, supports keyboard/focus behavior, and exposes all required links/CTA.
- [ ] Chatbot opens/closes, accepts focus, fits the viewport, and does not overlap sticky UI.
- [ ] No console errors or warnings during initial load, menu use, FAQ inspection, or chatbot open/close.
- [ ] No broken images; every meaningful image has accurate alt text.

## 19. Known reference defects and improvements not to propagate

The following were observed or confirmed in the reference. They are **not** part of the required behavior and must not be multiplied during migrations.

1. **Post-footer homepage/local SEO contamination (resolved in Step 8).** A `.pcm-local-seo` block titled for Metro Vancouver previously rendered after the footer because the SPA generator cloned it from the homepage shell. The authorized Montreal/Edmonton finalizer now removes that homepage block from Montreal → Edmonton only, and the shared runtime has a route-scoped guard that prevents its configured local-SEO replacement from being injected there. These blocks remain outside the canonical document-flow contract and must not be propagated.
2. **Desktop dropdown ARIA is incomplete.** The three desktop dropdown buttons have no `aria-expanded`, `aria-controls`, or explicit menu relationship. Future work should improve this accessibly; do not document the missing state as desired behavior.
3. **Mobile dialog console warning.** Opening the mobile sheet currently logs `Missing Description or aria-describedby={undefined} for DialogContent`. Standardized routes must not emit that warning.
4. **Floating-UI collision risk.** The mobile sticky estimate bar, chatbot launcher, and delayed nudge occupy overlapping bottom-right space. Future migrations must collision-test and resolve overlap; the current collision geometry is not canonical.
5. **Raw shell relies on runtime normalization for some route identity.** The checked-in shell begins from a shared SPA document and runtime code corrects route title/description/canonical/OG data. Future validation must check raw and rendered states and should prefer route-correct initial metadata where ownership permits.
6. **Compiled-source opacity.** Header, footer, chatbot, route markup, and route FAQ content are recoverable from a compiled bundle with `data-loc` breadcrumbs, but original `client/src/*.tsx` files are not present in this repository. Do not fabricate source files or shift ownership to compensate.
7. **Quote/pricing precede the sticky header.** This is the measured canonical route order and is documented in §3. It is unusual; do not silently “fix” it during a migration. Any decision to move these blocks after the hero is a separate design/architecture change requiring approval, not Step 3 standardization.
8. **FAQ is not an accordion.** The reference uses always-expanded static cards. Do not add nonfunctional chevrons or hidden answers while claiming parity. A true accordion would be a separately approved interaction/accessibility change.

## 20. Source map

| Component | Current source/authority | Shared? | Notes |
|---|---|---:|---|
| Route HTML shell/prerendered output | `site-copy/montreal-to-edmonton-movers/index.html` | Route output | Canonical checked-in artifact. Contains rendered app markup, metadata/schema, and asset references. Must remain owned as defined in Step 2. |
| Compiled React bundle | `site-copy/assets/index-CNBNs70h.js` | Yes | Contains app router, route component, Header, Footer, AIChatWidget, visible route content, and FAQ implementation. `data-loc` identifies original logical TSX locations. |
| Compiled app CSS | `site-copy/assets/index-DOGLBY_X.css` | Yes | Tailwind/theme utilities, font families, breakpoints, container rules, and React component presentation. |
| Conversion runtime | `site-copy/assets/conversion-boost.js` | Yes | Creates/normalizes quote and pricing blocks, route metadata, form defaults, FAQ schema synchronization, footer enhancements, sticky CTA, chat nudge, and other SEO/conversion additions. |
| Conversion CSS | `site-copy/assets/conversion-boost.css` | Yes | Exact quote/pricing/form/table/support-link/sticky-CTA/nudge styles and 820px/640px responsive rules. |
| Route generator | `tools/generate-spa-routes.mjs` | Yes; authoritative SPA owner | Clones the SPA shell for routes owned by the SPA according to the ownership registry. It does not own route component copy in the bundle. |
| Route-specific finalizer | `tools/finalize-montreal-edmonton-routes.mjs` | Pair-specific post-processor | Authorized only for Montreal ↔ Edmonton after SPA output. Normalizes prices/transit/defaults, removes the legacy cost breakdown, and updates the cost guide. It is not a full-page owner. |
| Ownership registry | `tools/route-page-ownership.mjs` | Yes | Declares `generate-spa-routes.mjs` as full-page owner and the Montreal/Edmonton finalizer as a post-processor. |
| Writer manifest/build order | `tools/route-writer-manifest.mjs`, `tools/run-owned-route-build.mjs` | Yes | Describes classifications and preserves owner-before-finalizer ordering. |
| Ownership documentation | `docs/ROUTE_PAGE_OWNERSHIP.md` | Yes | Step 2 ownership contract; this Step 3 document does not change it. |
| FAQ visible source | Route component in `index-CNBNs70h.js`; prerendered in route HTML | Route-specific within shared bundle | Canonical visible implementation is one H2 with 12 static H3/P cards. |
| FAQ schema source | `#faq-schema` in route HTML/bundle; synchronized by `normalizeMontrealEdmontonRouteContent()` in `conversion-boost.js` | Route-specific data; shared synchronizer | Exactly one `FAQPage`; current 12 entities match visible cards. |
| Header | Compiled `client/src/components/Header.tsx` in `index-CNBNs70h.js` | Yes | Sticky desktop/mobile nav. Original TSX is not checked in here. |
| Footer | Compiled `client/src/components/Footer.tsx` in `index-CNBNs70h.js` plus conversion footer enhancements | Yes | Shared four-column footer; runtime adds map/support links. |
| Chatbot | Compiled `client/src/components/AIChatWidget.tsx` in `index-CNBNs70h.js` | Yes | One launcher/panel. Conversion nudge opens it; it is not a second bot. |

---

This document completes Step 3 only. It authorizes no route migration, visual redesign, ownership change, build rewrite, or deployment.
