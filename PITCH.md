# Flux Labs vs Optic Marketing — Sales Pitch One-Pager

**Client:** Kuebler Mechanical LLC · Daniel Lipp  
**Demo folder:** `kuebler-demo/`  
**Open with pitch strip:** add `?pitch=1` to any URL (e.g. `index.html?pitch=1`)

---

## Side-by-side

| Moment            | Optic (live WP / Salient)                      | Flux Labs demo                                                                                |
| ----------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| First 5 seconds   | Promo slider + buried trust                    | Split hero + mini quote form + trust ribbon (stars, Google Guarantee, NATE, Veteran, license) |
| Coupons           | Print plugin pages                             | Countdown to 09/30/2026 + Print + **Text me this offer** + comparison table                   |
| Forms             | Gravity + **reCAPTCHA** on every submit        | Honeypot only · multi-step replacement wizard · GHL-ready story                               |
| Mobile            | Sticky call only                               | **Call · Text · Book** dock + review pill                                                     |
| Gallery           | Image 1 of N carousels                         | Lightbox + **named case studies** (Taco Bell, Stormhouse, etc.)                               |
| Areas             | City list dump                                 | Interactive pin map + full city groups                                                        |
| Content footprint | FAQ / blog / videos exist but template-feeling | Dedicated FAQ (search + schema), Videos, Blog filters, Careers, Financing                     |
| Brand ownership   | Footer **POWERED BY Optic Marketing**          | Flux Demo badge only · client owns the brand                                                  |
| Accessibility     | UserWay overlay                                | Native semantic HTML, skip link, reduced-motion                                               |
| Leads             | Agency / email black box                       | Pitch: **your GHL pipeline**, tagged by intent                                                |

---

## Three “they don’t have this” moments (say these out loud)

1. **Offer countdown + text-this-coupon** — urgency Optic never built.
2. **5-step replacement wizard** — qualifies high-ticket leads without CAPTCHA.
3. **Interactive Treasure Coast map + commercial case cards** — proof, not sliders.

---

## Close line

> “Same phone number, same specials, same Daniel Lipp story—packaged like a market leader. No CAPTCHA friction, no Salient sameness, no Powered By footer. When we go live, leads hit _your_ GoHighLevel in under a minute.”

---

## Production Phase 2 (after signature)

- Mirror all images to CDN (critical badges already in `assets/img/`)
- Wire forms → `GHL_WEBHOOK_URL`
- Optional Next.js premium-site clone on VPS (`2.25.206.39`)
- Square / Synchrony deep-links as needed
- Remove demo badge + pitch strip

---

## Demo QA checklist

- [ ] `index.html` — hero form + trust ribbon
- [ ] `specials.html` — countdown / print / Synchrony
- [ ] `coupon-print.html?offer=tuneup` — print preview
- [ ] `emergency.html` — giant call
- [ ] `installation-replacement.html#wizard` — wizard flow
- [ ] `service-areas.html` — pin clicks
- [ ] `gallery.html` — lightbox
- [ ] `faq.html` / `videos.html` / `careers.html` / `blog.html` / `financing.html`
- [ ] Mobile sticky Call / Text / Book
- [ ] `?pitch=1` pitch strip visible
