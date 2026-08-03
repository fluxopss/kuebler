# Kuebler Mechanical Demo — Research & Provenance

**Source of truth:** https://kueblermechanical.com/ (crawled Aug 3, 2026)  
**Demo path:** `kuebler-demo/`  
**Purpose:** Flux Labs sales/demo rebuild — premium multi-page static front-end

---

## Phase 1 — Live site map

| Live URL                                       | Used for                                                                     |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `/`                                            | Home copy, specials, trust claims, service areas, Google reviews             |
| `/about-us/`                                   | Daniel Lipp bio, veteran story, team narrative, warranties                   |
| `/services/`                                   | Repair symptoms, NATE-certified claims, one-visit repair                     |
| `/residential-hvac-services/`                  | Residential funnels, maintenance priority, veteran/first responder discounts |
| `/specials/`                                   | All live promotions (expire 09/30/2026)                                      |
| `/gallery/`                                    | Project categories + commercial case names                                   |
| `/contact-us/`                                 | Form fields, hiring note, hours, address                                     |
| `/port-st-lucie-fl-air-conditioning-services/` | Local AC SEO framing                                                         |
| `/port-st-lucie-fl-heating-services/`          | Heating framing                                                              |

**Not found live (omitted as pages):** Financing standalone, Careers standalone (hiring is a contact note only).

---

## Confirmed business facts (live)

- **Phone:** (772) 878-2281
- **Address:** 574 NW Mercantile Ave. Suite 107, Port St. Lucie, FL 34986
- **Hours:** Monday–Friday 7:30AM–4:00PM; 24/7 emergency service
- **License:** CAC1820289
- **Owner:** Daniel Lipp — Comfort Control Heating and Cooling 2001–2019; founded Kuebler Mechanical 2019; EPA Universal; forklift/scissor lift certs; USMC Staff Sergeant (SSGT), USS Theodore Roosevelt / Persian Gulf, Navy Achievement Medal
- **Trust badges live:** ACCA, NATE, EPA, OSHA, Superpros 2023, Veteran-Owned Certified, SDVOSB/CVE logo
- **Reviews widget:** “EXCELLENT — Based on 30 reviews” (Google); named reviews used only as published on live site
- **Financing:** Synchrony promotional financing mentioned on specials page
- **Hiring (contact page):** resume to careers@kueblermechanical.com and hr@kueblermechanical.com; DL, EPA or 3+ years HVAC, lift 50lbs+

---

## Live specials (expire 09/30/2026)

1. $129 Tune-Up — cooling check, heating check, condensate drain cleaning
2. $300 Maintenance Agreement — 4 tune-ups/year, free filters, 10% off service calls
3. $200 WiFi Thermostat — with new system purchase only
4. Free UV Light — with new system purchase only
5. 10% Off For Veterans — repairs & new equipment (not tune-ups)
6. Free Estimates on New Equipment — Goodman / Ruud; 10 yr parts & 10 yr labor warranty note

---

## Demo sitemap (built)

1. `index.html` — Home (split hero + mini form + trust ribbon)
2. `about.html` — About / Daniel Lipp
3. `services.html` — Services overview
4. `emergency.html` — 24/7 emergency funnel
5. `ac-repair.html` — Emergency / repair funnel + inline form
6. `installation-replacement.html` — Replacement + 5-step wizard
7. `maintenance.html` — Plans / $300 agreement + compare table
8. `indoor-air-quality.html` — IAQ
9. `commercial.html` — Commercial + case studies
10. `service-areas.html` — Interactive map + cities
11. `gallery.html` — Lightbox gallery
12. `specials.html` — Promotions + countdown + print/SMS
13. `coupon-print.html` — Printable coupon sheets
14. `contact.html` — Contact + map embed
15. `faq.html` — Searchable FAQ + schema
16. `videos.html` — Video hub
17. `careers.html` — Hiring page
18. `blog.html` — Blog hub with filters
19. `financing.html` — Synchrony financing
20. `compare.html` — Internal Optic vs Flux table
21. `PITCH.md` — Sales one-pager (`?pitch=1` enables pitch strip)

Mirrored assets: `assets/img/` (logo, knight, badges, Synchrony, payments, favicon)

---

## Image assets (live domain — hotlinked)

Primary brand / trust:

- Logo: `/wp-content/uploads/2022/05/kuebler-logo-color.svg`
- Knight: `/wp-content/uploads/2022/05/knight-head.svg`
- Favicon: `/wp-content/uploads/2022/05/kuebler-favicon.png`
- Badges: ACCA, NATE, EPA, OSHA, Superpros, Veteran-Owned, SDVOSB
- Google reviews graphic: `/wp-content/uploads/2022/06/5-star-google-reviews.jpg`
- Payments / Synchrony: payment-icons + `logo_synchrony_dark.svg`
- Hero-capable: River Park Marina, ac-units, commercial new construction, service category photos

Gallery / project (from WP media, alt text from live site):

- Residential installs (2022/07 IMG\_\*, 2023/05 Jenkins covers)
- Commercial: Stormhouse Brewery, Taco Bell, Warner Robins, Walker's Cay, roof units, ductwork

Full inventory: WP REST `/wp-json/wp/v2/media` + page sitemap image nodes.

---

## Intentionally NOT invented

- No fake review scores beyond live “30 reviews / Excellent”
- No fake awards beyond badges published on site
- No fake team headshots or named techs beyond reviews that already name “Blair”
- No fabricated stats (years in business framed via Daniel’s published timeline only)
- No financing APRs or dollar amounts beyond “promotional financing / Synchrony” language on live site

---

## Still needs manual client input (if going to production)

- Exact Google Business Profile review URL / embed widget refresh
- Confirmation which Superpros year badge to keep current
- High-res owner portrait of Daniel Lipp (not published as a dedicated portrait on live site)
- Legal disclaimer text for specials / warranties
- GHL / form webhook destination (demo form is front-end only)
- Prefer CDN-mirrored images vs hotlinking production WP uploads
