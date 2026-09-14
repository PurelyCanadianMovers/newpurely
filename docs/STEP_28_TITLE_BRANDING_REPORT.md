# Step 28 — Title-branding consistency report

Step 28 is complete. No deployment was performed, and Step 29 was not started.

## 1. Total routes audited

56 owned long-distance route pages: 55 received an unrestricted nine-second browser pass before the fix; Victoria→Vancouver was source/runtime-path validated because its pre-existing body MutationObserver locks the browser main thread. After the fix, 55 routes received an unrestricted nine-second pass and Victoria→Vancouver received a constrained browser pass with the unrelated body observer and recovered SPA bundle disabled, plus separate compiled-writer source/idempotency validation.

## 2. Complete pre-fix metadata classification

These are route-level, overlapping issue counts across raw, early, and settled title fields:

| Classification | Routes |
| --- | ---: |
| Canonical across raw and runtime | 6 |
| Missing suffix in at least one title field | 45 |
| Duplicate suffix in at least one title field | 25 |
| Generic/homepage/404 title in at least one phase | 10 |
| OG-only mismatch | 26 |
| Twitter-only mismatch | 32 |
| Runtime overwrite | 17 |
| Other | 0 |

### Complete pre-fix inventory

| Route | Owner | Architecture | Raw Title | Early Title | Settled Title | Settled OG Title | Settled Twitter Title | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /bc-to-washington-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | BC to Washington State Movers \| Overnight Service \| Purely Canadian Movers \| Purely Canadian Movers | BC to Washington Movers \| Cross-Border Moving | BC to Washington State Movers \| Overnight Service \| Purely Canadian Movers \| Purely Canadian Movers | BC to Washington State Movers \| Overnight Service \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /calgary-to-edmonton-movers/ | generate-spa-routes.mjs | react-spa | Calgary to Edmonton Movers \| Purely Canadian Movers | Calgary to Edmonton Movers \| Purely Canadian Movers | Calgary to Edmonton Movers \| Purely Canadian Movers | Calgary to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | Calgary to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | duplicate suffix, OG-only mismatch, Twitter-only mismatch |
| /calgary-to-halifax-movers/ | generate-halifax-calgary-route-pages.mjs | static | Calgary to Halifax Movers \| Alberta to Nova Scotia Moving | Calgary to Halifax Movers \| Alberta to Nova Scotia Moving | Calgary to Halifax Movers \| Alberta to Nova Scotia Moving | Calgary to Halifax Moving Cost, Prices & Transit Time \| Purely Canadian Movers | Calgary to Halifax Movers \| Purely Canadian Movers | missing suffix, OG-only mismatch, Twitter-only mismatch |
| /calgary-to-montreal-movers/ | checked-in-static-route-source | static | Calgary to Montreal Movers \| Purely Canadian Movers | Calgary to Montreal Movers \| Purely Canadian Movers | Calgary to Montreal Movers \| Purely Canadian Movers | Calgary to Montreal Movers \| Purely Canadian Movers | Calgary to Montreal Movers \| Purely Canadian Movers | canonical |
| /calgary-to-ottawa-movers/ | rebuild-calgary-ottawa-routes.mjs | static | Calgary to Ottawa Movers \| Cost, Transit Time & Estimate | Calgary to Ottawa Movers \| Cost, Transit Time & Estimate | Calgary to Ottawa Movers \| Cost, Transit Time & Estimate | Calgary to Ottawa Movers \| Cost, Transit Time & Estimate | Calgary to Ottawa Movers \| Cost, Transit Time & Estimate | missing suffix |
| /calgary-to-toronto-movers/ | generate-spa-routes.mjs | react-spa | Calgary to Toronto Movers \| Purely Canadian Movers | Calgary to Toronto Movers \| Purely Canadian Movers | Calgary to Toronto Movers \| Purely Canadian Movers | Calgary to Toronto Movers \| Purely Canadian Movers | Calgary to Toronto Movers \| Purely Canadian Movers | duplicate suffix, OG-only mismatch, Twitter-only mismatch |
| /calgary-to-vancouver-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Calgary to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | Calgary to Vancouver Movers \| Alberta to BC Moving | Calgary to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | Calgary to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /calgary-to-winnipeg-movers/ | rebuild-calgary-winnipeg-routes.mjs | static | Calgary to Winnipeg Movers \| Cost, Transit Time & Estimate | Calgary to Winnipeg Movers \| Cost, Transit Time & Estimate | Calgary to Winnipeg Movers \| Cost, Transit Time & Estimate | Calgary to Winnipeg Movers \| Cost, Transit Time & Estimate | Calgary to Winnipeg Movers \| Cost, Transit Time & Estimate | missing suffix |
| /edmonton-to-calgary-movers/ | generate-spa-routes.mjs | react-spa | Edmonton to Calgary Movers \| Purely Canadian Movers | Edmonton to Calgary Movers \| Purely Canadian Movers | Edmonton to Calgary Movers \| Purely Canadian Movers | Edmonton to Calgary Movers \| Purely Canadian Movers | Edmonton to Calgary Movers \| Purely Canadian Movers | canonical |
| /edmonton-to-montreal-movers/ | generate-spa-routes.mjs | react-spa | Edmonton to Montreal Moving Cost \| Movers, Prices & Transit Time | Edmonton to Montreal Moving Cost \| Movers, Prices & Transit Time | Edmonton to Montreal Moving Cost \| Movers, Prices & Transit Time | Edmonton to Montreal Moving Cost \| Movers, Prices & Transit Time | Edmonton to Montreal Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, Twitter-only mismatch |
| /edmonton-to-ottawa-movers/ | generate-spa-routes.mjs | react-spa | Edmonton to Ottawa Movers \| Long-Distance Moving | Edmonton to Ottawa Movers \| Long-Distance Moving | Edmonton to Ottawa Movers \| Long-Distance Moving | Edmonton to Ottawa Movers \| Long-Distance Moving | Edmonton to Ottawa Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, Twitter-only mismatch |
| /edmonton-to-toronto-movers/ | generate-spa-routes.mjs | react-spa | Edmonton to Toronto Moving Cost \| Movers, Prices & Transit Time | Edmonton to Toronto Moving Cost \| Movers, Prices & Transit Time | Edmonton to Toronto Moving Cost \| Movers, Prices & Transit Time | Edmonton to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | Edmonton to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, OG-only mismatch, Twitter-only mismatch |
| /edmonton-to-vancouver-movers/ | generate-spa-routes.mjs | react-spa | Edmonton to Vancouver Movers \| Alberta to BC Moving | Edmonton to Vancouver Movers \| Alberta to BC Moving | Edmonton to Vancouver Movers \| Alberta to BC Moving | Edmonton to Vancouver Movers \| Alberta to BC Moving | Edmonton to Vancouver Movers \| Alberta to BC Moving | missing suffix |
| /edmonton-to-winnipeg-movers/ | rebuild-edmonton-winnipeg-routes.mjs | static | Edmonton to Winnipeg Movers \| Cost, Transit Time & Estimate | Edmonton to Winnipeg Movers \| Cost, Transit Time & Estimate | Edmonton to Winnipeg Movers \| Cost, Transit Time & Estimate | Edmonton to Winnipeg Movers \| Cost, Transit Time & Estimate | Professional Movers Vancouver BC \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, Twitter-only mismatch |
| /halifax-to-calgary-movers/ | generate-halifax-calgary-route-pages.mjs | static | Halifax to Calgary Movers \| Nova Scotia to Alberta Moving | Halifax to Calgary Movers \| Nova Scotia to Alberta Moving | Halifax to Calgary Movers \| Nova Scotia to Alberta Moving | Halifax to Calgary Moving Cost, Prices & Transit Time \| Purely Canadian Movers | Halifax to Calgary Movers \| Purely Canadian Movers | missing suffix, OG-only mismatch, Twitter-only mismatch |
| /halifax-to-toronto-movers/ | update-halifax-toronto-routes.mjs | static | Halifax to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | Halifax to Toronto Movers \| Long-Distance Moving | Halifax to Toronto Movers \| Long-Distance Moving | Halifax to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | Halifax to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /halifax-to-vancouver-movers/ | checked-in-static-route-source | static | Halifax to Vancouver Movers \| Cost, Transit Time & Estimate \| Purely Canadian Movers | Halifax to Vancouver Movers \| Cost, Transit Time & Estimate \| Purely Canadian Movers | Halifax to Vancouver Movers \| Cost, Transit Time & Estimate \| Purely Canadian Movers | Halifax to Vancouver Movers \| Purely Canadian Movers | Halifax to Vancouver Movers \| Purely Canadian Movers | OG-only mismatch, Twitter-only mismatch |
| /montreal-to-calgary-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Montreal to Calgary Movers \| Purely Canadian Movers \| Purely Canadian Movers | Montreal to Calgary Movers \| Cross-Canada Moving | Montreal to Calgary Movers \| Purely Canadian Movers \| Purely Canadian Movers | Montreal to Calgary Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /montreal-to-edmonton-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Montreal to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | Montreal to Edmonton Moving Cost \| Movers, Prices & Transit Time | Montreal to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | Montreal to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /montreal-to-toronto-movers/ | generate-spa-routes.mjs | react-spa | Montreal to Toronto Movers \| Long-Distance Moving | Montreal to Toronto Movers \| Long-Distance Moving | Montreal to Toronto Movers \| Long-Distance Moving | Montreal to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | Montreal to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, OG-only mismatch, Twitter-only mismatch |
| /montreal-to-vancouver-movers/ | standardize-montreal-vancouver-routes.mjs | static | Montreal to Vancouver Movers \| Cost, Transit Time & Estimate | Montreal to Vancouver Moving Cost \| Movers, Prices & Transit Time | Montreal to Vancouver Moving Cost \| Movers, Prices & Transit Time | Montreal to Vancouver Movers \| Cost, Transit Time & Estimate |  | missing suffix, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /montreal-to-victoria-movers/ | generate-spa-routes.mjs | react-spa | Montreal to Victoria & Nanaimo Movers \| Purely Canadian Movers | Montreal to Victoria & Nanaimo Movers \| Purely Canadian Movers | Montreal to Victoria & Nanaimo Movers \| Purely Canadian Movers | Montreal to Victoria & Nanaimo Movers \| Purely Canadian Movers | Montreal to Victoria & Nanaimo Movers \| Purely Canadian Movers | canonical |
| /montreal-to-winnipeg-movers/ | rebuild-winnipeg-montreal-routes.mjs | static | Montreal to Winnipeg Movers \| Cost, Transit Time & Estimate | Montreal to Winnipeg Movers \| Cost, Transit Time & Estimate | Montreal to Winnipeg Movers \| Cost, Transit Time & Estimate | Montreal to Winnipeg Movers \| Cost, Transit Time & Estimate | Montreal to Winnipeg Movers \| Cost, Transit Time & Estimate | missing suffix |
| /ottawa-to-calgary-movers/ | rebuild-calgary-ottawa-routes.mjs | static | Ottawa to Calgary Movers \| Cost, Transit Time & Estimate | Ottawa to Calgary Movers \| Cost, Transit Time & Estimate | Ottawa to Calgary Movers \| Cost, Transit Time & Estimate | Ottawa to Calgary Movers \| Cost, Transit Time & Estimate | Ottawa to Calgary Movers \| Cost, Transit Time & Estimate | missing suffix |
| /ottawa-to-edmonton-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Ottawa to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | Ottawa to Edmonton Movers \| Long-Distance Moving | Ottawa to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | Ottawa to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /ottawa-to-toronto-movers/ | rebuild-ottawa-toronto-routes.mjs | static | Ottawa to Toronto Movers \| Cost, Transit Time & Estimate | Ottawa to Toronto Movers \| Cost, Transit Time & Estimate | Ottawa to Toronto Movers \| Cost, Transit Time & Estimate | Ottawa to Toronto Movers \| Cost, Transit Time & Estimate | Ottawa to Toronto Movers \| Cost, Transit Time & Estimate | missing suffix |
| /ottawa-to-vancouver-movers/ | standardize-montreal-vancouver-routes.mjs | static | Ottawa to Vancouver Movers \| Cost, Transit Time & Estimate | Ottawa to Vancouver Moving Cost \| Movers, Prices & Transit Time | Ottawa to Vancouver Moving Cost \| Movers, Prices & Transit Time | Ottawa to Vancouver Movers \| Cost, Transit Time & Estimate |  | missing suffix, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /ottawa-to-victoria-movers/ | rebuild-victoria-ottawa-route.mjs | static | Ottawa to Victoria & Nanaimo Movers \| Purely Canadian Movers | Ottawa to Victoria & Nanaimo Movers \| Purely Canadian Movers | Ottawa to Victoria & Nanaimo Movers \| Purely Canadian Movers | Ottawa to Victoria & Nanaimo Movers \| Purely Canadian Movers | Ottawa to Victoria & Nanaimo Movers \| Purely Canadian Movers | canonical |
| /ottawa-to-winnipeg-movers/ | fix-winnipeg-static-routes.mjs | static | Ottawa to Winnipeg Movers \| Cost, Transit Time & Estimate | Ottawa to Winnipeg Movers \| Cost, Transit Time & Estimate | Ottawa to Winnipeg Movers \| Cost, Transit Time & Estimate | Ottawa to Winnipeg Movers \| Cost, Transit Time & Estimate | Ottawa to Winnipeg Movers \| Cost, Transit Time & Estimate | missing suffix |
| /seattle-to-vancouver-movers/ | checked-in-static-route-source | static | Seattle to Vancouver Movers \| Cross-Border Estimates | Seattle to Vancouver Movers \| Cross-Border Estimates | Seattle to Vancouver Movers \| Cross-Border Estimates | Seattle to Vancouver Movers \| Cross-Border Estimates | Seattle to Vancouver Movers \| Cross-Border Estimates | missing suffix |
| /toronto-to-calgary-movers/ | generate-spa-routes.mjs | react-spa | Toronto to Calgary Moving Cost \| Movers, Prices & Transit Time | Toronto to Calgary Moving Cost \| Movers, Prices & Transit Time | Toronto to Calgary Moving Cost \| Movers, Prices & Transit Time | Toronto to Calgary Movers \| Purely Canadian Movers | Toronto to Calgary Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, OG-only mismatch, Twitter-only mismatch |
| /toronto-to-edmonton-movers/ | generate-spa-routes.mjs | react-spa | Toronto to Edmonton Movers \| Long-Distance Moving | Toronto to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Edmonton Movers \| Long-Distance Moving | Toronto to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Edmonton Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /toronto-to-halifax-movers/ | update-halifax-toronto-routes.mjs | static | Toronto to Halifax Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Halifax Movers \| Purely Canadian Movers | Toronto to Halifax Movers \| Purely Canadian Movers | Toronto to Halifax Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Halifax Movers \| Purely Canadian Movers \| Purely Canadian Movers | duplicate suffix, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /toronto-to-montreal-movers/ | generate-spa-routes.mjs | react-spa | Toronto to Montreal Movers \| Long-Distance Moving | Toronto to Montreal Movers \| Long-Distance Moving | Toronto to Montreal Movers \| Long-Distance Moving | Toronto to Montreal Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Montreal Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, OG-only mismatch, Twitter-only mismatch |
| /toronto-to-ottawa-movers/ | rebuild-ottawa-toronto-routes.mjs | static | Toronto to Ottawa Movers \| Cost, Transit Time & Estimate | Toronto to Ottawa Movers \| Cost, Transit Time & Estimate | Toronto to Ottawa Movers \| Cost, Transit Time & Estimate | Toronto to Ottawa Movers \| Cost, Transit Time & Estimate | Toronto to Ottawa Movers \| Cost, Transit Time & Estimate | missing suffix |
| /toronto-to-vancouver-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Toronto to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Vancouver Movers \| Cross-Canada Moving | Toronto to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /toronto-to-victoria-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Toronto to Victoria & Nanaimo Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Victoria Movers \| Long-Distance Moving | Toronto to Victoria & Nanaimo Movers \| Purely Canadian Movers \| Purely Canadian Movers | Toronto to Victoria & Nanaimo Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /toronto-to-winnipeg-movers/ | rebuild-toronto-winnipeg-routes.mjs | static | Toronto to Winnipeg Movers \| Cost, Transit Time & Estimate | Toronto to Winnipeg Movers \| Cost, Transit Time & Estimate | Toronto to Winnipeg Movers \| Cost, Transit Time & Estimate | Toronto to Winnipeg Movers \| Cost, Transit Time & Estimate | Toronto to Winnipeg Movers \| Cost, Transit Time & Estimate | missing suffix |
| /vancouver-to-calgary-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Vancouver to Calgary Movers \| Purely Canadian Movers \| Purely Canadian Movers | Vancouver to Calgary Movers \| Costs, Transit & Quotes | Vancouver to Calgary Movers \| Purely Canadian Movers \| Purely Canadian Movers | Vancouver to Calgary Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /vancouver-to-edmonton-movers/ | finalize-vancouver-edmonton-routes.mjs | static | Vancouver to Edmonton Movers \| Purely Canadian Movers | Vancouver to Edmonton Movers \| Purely Canadian Movers | Vancouver to Edmonton Movers \| Purely Canadian Movers | Vancouver to Edmonton Movers \| Purely Canadian Movers | Vancouver to Edmonton Movers \| Purely Canadian Movers | canonical |
| /vancouver-to-halifax-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Page Not Found \| Purely Canadian Movers \| Purely Canadian Movers | Page Not Found \| Purely Canadian Movers \| Purely Canadian Movers | Page Not Found \| Purely Canadian Movers \| Purely Canadian Movers | Page Not Found \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /vancouver-to-montreal-movers/ | standardize-montreal-vancouver-routes.mjs | static | Vancouver to Montreal Movers \| Cost, Transit Time & Estimate | Vancouver to Montreal Movers \| Cost, Transit Time & Estimate | Vancouver to Montreal Movers \| Cost, Transit Time & Estimate | Vancouver to Montreal Movers \| Cost, Transit Time & Estimate |  | missing suffix, Twitter-only mismatch |
| /vancouver-to-ottawa-movers/ | standardize-montreal-vancouver-routes.mjs | static | Vancouver to Ottawa Movers \| Cost, Transit Time & Estimate | Vancouver to Ottawa Movers \| Cost, Transit Time & Estimate | Vancouver to Ottawa Movers \| Cost, Transit Time & Estimate | Vancouver to Ottawa Movers \| Cost, Transit Time & Estimate |  | missing suffix, Twitter-only mismatch |
| /vancouver-to-seattle-movers/ | checked-in-static-route-source | static | Vancouver to Seattle Movers \| Cross-Border Estimates | Vancouver to Seattle Movers \| Cross-Border Estimates | Vancouver to Seattle Movers \| Cross-Border Estimates | Vancouver to Seattle Movers \| Cross-Border Estimates | Vancouver to Seattle Movers \| Cross-Border Estimates | missing suffix |
| /vancouver-to-toronto-movers/ | generate-spa-routes.mjs | react-spa | Vancouver Movers \| Local & Long-Distance Moving | Vancouver to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | Vancouver to Toronto Movers \| Cross-Canada Moving | Vancouver to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | Vancouver to Toronto Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, generic title, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /vancouver-to-winnipeg-movers/ | rebuild-winnipeg-modern-routes.mjs | static | Vancouver to Winnipeg Movers \| Cost, Transit Time & Estimate | Vancouver to Winnipeg Movers \| Cost, Transit Time & Estimate | Vancouver to Winnipeg Movers \| Cost, Transit Time & Estimate | Vancouver to Winnipeg Movers \| Cost, Transit Time & Estimate | Vancouver to Winnipeg Movers \| Cost, Transit Time & Estimate | missing suffix |
| /victoria-to-montreal-movers/ | checked-in-static-route-source | static | Victoria to Montreal Movers \| Purely Canadian Movers | Victoria to Montreal Movers \| Long-Distance Moving | Victoria to Montreal Movers \| Long-Distance Moving | Victoria to Montreal Movers \| Purely Canadian Movers | Victoria to Montreal & Victoria Movers \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /victoria-to-ottawa-movers/ | rebuild-victoria-ottawa-route.mjs | static | Victoria to Ottawa Movers \| Long-Distance Moving | Victoria to Ottawa Movers \| Long-Distance Moving | Victoria to Ottawa Movers \| Long-Distance Moving | Victoria to Ottawa Movers \| Long-Distance Moving | Victoria to Ottawa Movers \| Long-Distance Moving | missing suffix |
| /victoria-to-toronto-movers/ | checked-in-static-route-source | static | Victoria to Toronto Movers \| Purely Canadian Movers | Victoria to Toronto Movers \| Purely Canadian Movers | Victoria to Toronto Movers \| Purely Canadian Movers | Victoria to Toronto Movers \| Purely Canadian Movers | Victoria to Toronto Movers \| Purely Canadian Movers | canonical |
| /victoria-to-vancouver-movers/ | checked-in-static-route-source | static | Victoria to Vancouver Movers \| Purely Canadian Movers | Victoria to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | Victoria to Vancouver Movers \| Purely Canadian Movers | Victoria to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | Victoria to Vancouver Movers \| Purely Canadian Movers \| Purely Canadian Movers | duplicate suffix, OG-only mismatch, Twitter-only mismatch, runtime overwrite |
| /winnipeg-to-calgary-movers/ | rebuild-calgary-winnipeg-routes.mjs | static | Winnipeg to Calgary Movers \| Cost, Transit Time & Estimate | Winnipeg to Calgary Movers \| Cost, Transit Time & Estimate | Winnipeg to Calgary Movers \| Cost, Transit Time & Estimate | Winnipeg to Calgary Movers \| Cost, Transit Time & Estimate | Winnipeg to Calgary Movers \| Cost, Transit Time & Estimate | missing suffix |
| /winnipeg-to-edmonton-movers/ | rebuild-edmonton-winnipeg-routes.mjs | static | Winnipeg to Edmonton Movers \| Cost, Transit Time & Estimate | Winnipeg to Edmonton Movers \| Cost, Transit Time & Estimate | Winnipeg to Edmonton Movers \| Cost, Transit Time & Estimate | Winnipeg to Edmonton Movers \| Cost, Transit Time & Estimate | Professional Movers Vancouver BC \| Purely Canadian Movers \| Purely Canadian Movers | missing suffix, duplicate suffix, Twitter-only mismatch |
| /winnipeg-to-montreal-movers/ | rebuild-winnipeg-montreal-routes.mjs | static | Winnipeg to Montreal Movers \| Cost, Transit Time & Estimate | Winnipeg to Montreal Movers \| Cost, Transit Time & Estimate | Winnipeg to Montreal Movers \| Cost, Transit Time & Estimate | Winnipeg to Montreal Movers \| Cost, Transit Time & Estimate | Winnipeg to Montreal Movers \| Cost, Transit Time & Estimate | missing suffix |
| /winnipeg-to-ottawa-movers/ | fix-winnipeg-static-routes.mjs | static | Winnipeg to Ottawa Movers \| Cost, Transit Time & Estimate | Winnipeg to Ottawa Movers \| Cost, Transit Time & Estimate | Winnipeg to Ottawa Movers \| Cost, Transit Time & Estimate | Winnipeg to Ottawa Movers \| Cost, Transit Time & Estimate | Winnipeg to Ottawa Movers \| Cost, Transit Time & Estimate | missing suffix |
| /winnipeg-to-toronto-movers/ | rebuild-toronto-winnipeg-routes.mjs | static | Winnipeg to Toronto Movers \| Cost, Transit Time & Estimate | Winnipeg to Toronto Movers \| Cost, Transit Time & Estimate | Winnipeg to Toronto Movers \| Cost, Transit Time & Estimate | Winnipeg to Toronto Movers \| Cost, Transit Time & Estimate | Winnipeg to Toronto Movers \| Cost, Transit Time & Estimate | missing suffix |
| /winnipeg-to-vancouver-movers/ | rebuild-winnipeg-modern-routes.mjs | static | Winnipeg to Vancouver Movers \| Cost, Transit Time & Estimate | Winnipeg to Vancouver Movers \| Cost, Transit Time & Estimate | Winnipeg to Vancouver Movers \| Cost, Transit Time & Estimate | Winnipeg to Vancouver Movers \| Cost, Transit Time & Estimate | Winnipeg to Vancouver Movers \| Cost, Transit Time & Estimate | missing suffix |

## 3. Complete list of affected routes

- /bc-to-washington-movers/
- /calgary-to-edmonton-movers/
- /calgary-to-halifax-movers/
- /calgary-to-ottawa-movers/
- /calgary-to-toronto-movers/
- /calgary-to-vancouver-movers/
- /calgary-to-winnipeg-movers/
- /edmonton-to-montreal-movers/
- /edmonton-to-ottawa-movers/
- /edmonton-to-toronto-movers/
- /edmonton-to-vancouver-movers/
- /edmonton-to-winnipeg-movers/
- /halifax-to-calgary-movers/
- /halifax-to-toronto-movers/
- /halifax-to-vancouver-movers/
- /montreal-to-calgary-movers/
- /montreal-to-edmonton-movers/
- /montreal-to-toronto-movers/
- /montreal-to-vancouver-movers/
- /montreal-to-winnipeg-movers/
- /ottawa-to-calgary-movers/
- /ottawa-to-edmonton-movers/
- /ottawa-to-toronto-movers/
- /ottawa-to-vancouver-movers/
- /ottawa-to-winnipeg-movers/
- /seattle-to-vancouver-movers/
- /toronto-to-calgary-movers/
- /toronto-to-edmonton-movers/
- /toronto-to-halifax-movers/
- /toronto-to-montreal-movers/
- /toronto-to-ottawa-movers/
- /toronto-to-vancouver-movers/
- /toronto-to-victoria-movers/
- /toronto-to-winnipeg-movers/
- /vancouver-to-calgary-movers/
- /vancouver-to-halifax-movers/
- /vancouver-to-montreal-movers/
- /vancouver-to-ottawa-movers/
- /vancouver-to-seattle-movers/
- /vancouver-to-toronto-movers/
- /vancouver-to-winnipeg-movers/
- /victoria-to-montreal-movers/
- /victoria-to-ottawa-movers/
- /victoria-to-vancouver-movers/
- /winnipeg-to-calgary-movers/
- /winnipeg-to-edmonton-movers/
- /winnipeg-to-montreal-movers/
- /winnipeg-to-ottawa-movers/
- /winnipeg-to-toronto-movers/
- /winnipeg-to-vancouver-movers/

The six fully canonical pre-fix routes were Calgary→Montreal, Edmonton→Calgary, Montreal→Victoria, Ottawa→Victoria, Vancouver→Edmonton, and Victoria→Toronto.

## 4. Canonical title policy implemented

Exactly `<route-specific title> | Purely Canadian Movers` for raw HTML title, settled `document.title`, `og:title`, and `twitter:title`. The helper removes only repeated exact terminal ` | Purely Canadian Movers` tokens, then appends one suffix. Route wording before the suffix is preserved.

## 5. Complete title-writer map

| Writer | Fields touched | Routes affected | Behavior after Step 28 |
| --- | --- | --- | --- |
| 14 declared full-page owner groups/templates | Raw title, OG title, Twitter title | 56 | Generate route-specific source; the aggregate title finalizer is the last title-metadata authority. |
| `generate-spa-routes.mjs` | Raw shell metadata; compiled title inputs | 22 SPA-owned routes | Preserves existing owned output and normalizes the two Step 27 Victoria/Nanaimo title inputs. |
| Compiled React SEO component in `index-CNBNs70h.js` | document title, OG title, Twitter title | React/SPA routes | Exact-suffix idempotent; branded and unbranded props both settle to one suffix. |
| Halifax↔Calgary generator inline metadata observer | document title; raw title fields | 2 | Now writes and preserves the same canonical branded title. |
| Calgary↔Toronto, Montreal↔Toronto, Toronto↔Edmonton, Vancouver↔Edmonton finalizers | document title; Vancouver/Edmonton also writes social titles | 8 | Route configs now contain the same canonical title as raw HTML. |
| Edmonton↔Winnipeg and Ottawa↔Winnipeg generators | Raw title, OG title, Twitter title | 4 | Title selectors accept the authority attribute and write canonical branded route titles directly. |
| `conversion-boost.js` | document title, OG title, Twitter title | 56 | Route title override map is bypassed for owned route paths; it preserves the authoritative raw title and idempotently repairs later mutations. |
| `normalize-route-title-metadata.mjs` | Raw title, OG title, Twitter title; compiled SEO helper | 56 | Final aggregate metadata authority; safe on repeated runs and preserves route wording. |

## 6. Root causes identified

1. The compiled React SEO helper appended the brand blindly even when many route props already contained it.
2. `conversion-boost.js` retried alternate route titles for four seconds, often without branding, and changed only `document.title`.
3. Ten SPA/static documents carried a generic homepage shell title; Vancouver→Halifax also settled to a client-side 404 title.
4. Several raw OG/Twitter fields were stale, duplicated, absent, or disagreed with the HTML title.
5. Route finalizers enforced unbranded titles after load.
6. Four Winnipeg-related generators used a `<title>` selector that did not match the authority-marked title and inherited another route's title during aggregate generation.

## 7. Files changed

- Shared runtime/bundle: `site-copy/assets/conversion-boost.js`, `site-copy/assets/index-CNBNs70h.js`.
- Ownership/build map: `tools/route-page-ownership.mjs`, `tools/route-writer-manifest.mjs`, `tools/route-page-ownership.test.mjs`.
- Durable route writers: `tools/generate-halifax-calgary-route-pages.mjs`, `tools/rebuild-edmonton-winnipeg-routes.mjs`, `tools/fix-winnipeg-static-routes.mjs`, and the Calgary/Toronto, Montreal/Toronto, Toronto/Edmonton, and Vancouver/Edmonton finalizers.
- Step 28 tooling/tests: `tools/normalize-route-title-metadata.mjs`, `tools/route-title-metadata.test.mjs`, `tools/audit-route-title-metadata.mjs`, `tools/snapshot-route-integrity.mjs`, `tools/hash-route-build-state.mjs`, `tools/merge-route-title-audits.mjs`, and this report writer.
- 50 route HTML files listed below.

## 8. Routes whose HTML changed

- /bc-to-washington-movers/
- /calgary-to-edmonton-movers/
- /calgary-to-halifax-movers/
- /calgary-to-ottawa-movers/
- /calgary-to-toronto-movers/
- /calgary-to-vancouver-movers/
- /calgary-to-winnipeg-movers/
- /edmonton-to-montreal-movers/
- /edmonton-to-ottawa-movers/
- /edmonton-to-toronto-movers/
- /edmonton-to-vancouver-movers/
- /edmonton-to-winnipeg-movers/
- /halifax-to-calgary-movers/
- /halifax-to-toronto-movers/
- /halifax-to-vancouver-movers/
- /montreal-to-calgary-movers/
- /montreal-to-edmonton-movers/
- /montreal-to-toronto-movers/
- /montreal-to-vancouver-movers/
- /montreal-to-winnipeg-movers/
- /ottawa-to-calgary-movers/
- /ottawa-to-edmonton-movers/
- /ottawa-to-toronto-movers/
- /ottawa-to-vancouver-movers/
- /ottawa-to-winnipeg-movers/
- /seattle-to-vancouver-movers/
- /toronto-to-calgary-movers/
- /toronto-to-edmonton-movers/
- /toronto-to-halifax-movers/
- /toronto-to-montreal-movers/
- /toronto-to-ottawa-movers/
- /toronto-to-vancouver-movers/
- /toronto-to-victoria-movers/
- /toronto-to-winnipeg-movers/
- /vancouver-to-calgary-movers/
- /vancouver-to-halifax-movers/
- /vancouver-to-montreal-movers/
- /vancouver-to-ottawa-movers/
- /vancouver-to-seattle-movers/
- /vancouver-to-toronto-movers/
- /vancouver-to-winnipeg-movers/
- /victoria-to-montreal-movers/
- /victoria-to-ottawa-movers/
- /victoria-to-vancouver-movers/
- /winnipeg-to-calgary-movers/
- /winnipeg-to-edmonton-movers/
- /winnipeg-to-montreal-movers/
- /winnipeg-to-ottawa-movers/
- /winnipeg-to-toronto-movers/
- /winnipeg-to-vancouver-movers/

Only the 50 routes with proven defects changed. The six canonical route documents remained byte-identical.

## 9. Shared runtime/bundle changes

- React SEO title construction is exact-suffix idempotent.
- Conversion runtime preserves the authoritative route title, synchronizes OG/Twitter, and repairs only mismatches.
- No description, canonical URL, OG URL, Twitter description, H1, navigation, chatbot, or layout behavior was changed.

## 10. Missing-suffix fixes

All 45 routes that had a missing suffix in at least one raw/runtime title field now have one exact suffix in all four authoritative fields.

## 11. Duplicate-suffix fixes

All 25 routes that had a duplicated suffix in at least one raw/runtime title field now have one exact suffix. This includes the React social-title duplicates and the prior Vancouver→Halifax 404-title duplication.

## 12. Montreal → Edmonton OG result

`Montreal to Edmonton Movers | Purely Canadian Movers` — raw, settled, OG, and Twitter agree.

## 13. Montreal → Toronto OG result

`Montreal to Toronto Movers | Long-Distance Moving | Purely Canadian Movers` — raw, settled, OG, and Twitter agree.

## 14. Toronto → Montreal OG result

`Toronto to Montreal Movers | Long-Distance Moving | Purely Canadian Movers` — raw, settled, OG, and Twitter agree.

## 15. 56-route final settled title result

56/56 canonical; 56/56 exactly one brand suffix; 0 generic/404/alternate settled titles.

## 16. 56-route OG title result

56/56 equal the authoritative raw/settled title.

## 17. 56-route Twitter title result

56/56 equal the authoritative raw/settled title.

## 18. Metadata idempotency result

- Unit tests cover no suffix, one suffix, duplicate suffix, legitimate company wording, HTML second pass, and compiled React second pass.
- Main-worktree second normalization: 0 route drift, 0 shared-writer drift.
- Runtime mutation retries settle without a second suffix.

## 19. Ownership validation

PASS: 56 routes, exactly one owner each, zero collisions. Ownership and metadata tests: 18/18 passed.

## 20. First aggregate convergence result

PASS in a temporary history-backed Git clone: 0/56 route drift; 0 shared bundle/runtime drift.

## 21. Second aggregate convergence result

PASS: 0/56 route drift relative to the first run; 0 shared bundle/runtime drift.

## 22. Confirmation that route body/layout/content did not change

All 56 `<main>` hashes, H1 values, quote-form defaults, FAQ-schema counts, and `.pcm-local-seo` counts are unchanged. Eight body hashes changed only because their inline title-metadata writer literal changed to the canonical title:

- /calgary-to-halifax-movers/
- /edmonton-to-toronto-movers/
- /edmonton-to-vancouver-movers/
- /halifax-to-calgary-movers/
- /montreal-to-toronto-movers/
- /toronto-to-calgary-movers/
- /toronto-to-edmonton-movers/
- /toronto-to-montreal-movers/

No pricing, distance, transit, FAQ content, navigation, chatbot, main content, footer, or layout change was made.

### Recently standardized route regression check

| Route | Final canonical title | OG/Twitter match | H1 | Form defaults | Main content hash |
| --- | --- | --- | --- | --- | --- |
| /montreal-to-edmonton-movers/ | Montreal to Edmonton Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /montreal-to-toronto-movers/ | Montreal to Toronto Movers \| Long-Distance Moving \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /toronto-to-montreal-movers/ | Toronto to Montreal Movers \| Long-Distance Moving \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /toronto-to-edmonton-movers/ | Toronto to Edmonton Movers \| Long-Distance Moving \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /edmonton-to-toronto-movers/ | Edmonton to Toronto Moving Cost \| Movers, Prices & Transit Time \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /vancouver-to-edmonton-movers/ | Vancouver to Edmonton Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /edmonton-to-vancouver-movers/ | Edmonton to Vancouver Movers \| Alberta to BC Moving \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /calgary-to-toronto-movers/ | Calgary to Toronto Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /toronto-to-calgary-movers/ | Toronto to Calgary Moving Cost \| Movers, Prices & Transit Time \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /montreal-to-victoria-movers/ | Montreal to Victoria & Nanaimo Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /victoria-to-montreal-movers/ | Victoria to Montreal Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /calgary-to-halifax-movers/ | Calgary to Halifax Movers \| Alberta to Nova Scotia Moving \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /halifax-to-calgary-movers/ | Halifax to Calgary Movers \| Nova Scotia to Alberta Moving \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /montreal-to-vancouver-movers/ | Montreal to Vancouver Movers \| Cost, Transit Time & Estimate \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /vancouver-to-montreal-movers/ | Vancouver to Montreal Movers \| Cost, Transit Time & Estimate \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /ottawa-to-vancouver-movers/ | Ottawa to Vancouver Movers \| Cost, Transit Time & Estimate \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /vancouver-to-ottawa-movers/ | Vancouver to Ottawa Movers \| Cost, Transit Time & Estimate \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /halifax-to-toronto-movers/ | Halifax to Toronto Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /toronto-to-halifax-movers/ | Toronto to Halifax Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /ottawa-to-victoria-movers/ | Ottawa to Victoria & Nanaimo Movers \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |
| /victoria-to-ottawa-movers/ | Victoria to Ottawa Movers \| Long-Distance Moving \| Purely Canadian Movers | yes | unchanged | unchanged | unchanged |

## 23. Remaining metadata exceptions or known issues

No title-policy exceptions remain. Victoria→Vancouver's unrelated legacy body MutationObserver still locks an unrestricted automated browser session. Its raw/static conversion path passed with that observer and the recovered SPA bundle disabled, and the compiled SEO writer was separately source-traced and idempotency-tested. This limitation is not silently counted as an unrestricted browser pass.

## Final state

Step 28 is complete. No deployment was performed. Step 29 was not started.
