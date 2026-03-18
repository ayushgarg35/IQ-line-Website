# IQ-Line Website

**Tagline:** Elevating Lives Digitally 🇮🇳  
**Company:** IQ-Line Technologies Pvt. Ltd.  
**Mission:** Build practical deep tech healthcare solutions for Bharat — HIS, LIS, RIS, and iMUIS systems that work in real Indian hospital conditions.

---

## ✅ Completed Features

### Pages Built
| Page | File | Description |
|------|------|-------------|
| Home / Landing | `index.html` | Hero, stats, solutions preview, products overview, testimonials, CTA |
| Solutions Overview | `solutions.html` | Entry point for solution tracks, implementation path, fit guidance |
| Healthcare Solutions | `solutions-healthcare.html` | 9 hospital modules, patient journey workflow, compliance badges |
| Student Management System | `solutions-sms.html` | 8-step lifecycle, 6 modules, NMC compliance features |
| Products | `products.html` | Full detail pages for all 7 products with sticky nav tabs |
| About Us | `about.html` | Mission, values, journey timeline, scale/impact stats, founders, testimonials |
| Blogs | `blogs.html` | Featured article, real category filter, pagination, newsletter signup |
| Blog Article | `blog-post.html` | Dynamic article template powered by shared blog data |
| Careers | `careers.html` | Perks, 8 open positions with dept filter, CV submission form |
| Contact Us | `contact.html` | Demo request form, contact info, 3-step demo process, FAQ accordion |

### Key Features
- ✅ **Sticky responsive navigation** with dropdown menus (Solutions, Products, About Us)
- ✅ **Mobile hamburger menu** with full mobile navigation
- ✅ **IQ-Line brand colors**: Teal `#3DBDB1` and Dark `#3d3d3d`
- ✅ **Scroll animations** (fade-up / fade-in via Intersection Observer)
- ✅ **Counter animations** for all stat numbers
- ✅ **Marquee ticker bar** (NABH, ABDM, HL7, multilingual, offline-first)
- ✅ **Shared JS nav + footer** via `buildNav()` and `buildFooter()` functions
- ✅ **Scroll-to-top button**
- ✅ **Accordion FAQ** on Contact page
- ✅ **Product tab navigation** with scroll-spy highlighting on Products page
- ✅ **Department filter** on Careers page
- ✅ **Accessible interest chip selector** on Contact form
- ✅ **Working category filter & pagination** on Blogs page
- ✅ **Real blog article routing** via shared article template
- ✅ **Backend-powered form submissions** for Contact, Careers, and Newsletter
- ✅ **IQ-Line logo** saved in `images/logo.png`
- ✅ **Video hero background** — `images/hero-banner.mp4` with multi-layer CSS blend overlay, parallax scroll, and fade-in on load
- ✅ **Google Fonts** — Inter + Rajdhani loaded via CDN
- ✅ **Font Awesome 6** icons via CDN

---

## 📁 Project Structure

```
index.html                    ← Homepage / Landing Page
solutions.html                ← Solutions Overview
solutions-healthcare.html     ← Healthcare Solutions
solutions-sms.html            ← Student Management System
products.html                 ← All 7 Products (LIMS/HIMS/RIMS/E-Rx/BMS/MUMS/EWS)
about.html                    ← About Us (Mission/Scale/Compliance/Founders)
blogs.html                    ← Blog Listing
blog-post.html                ← Shared Blog Article Template
careers.html                  ← Careers & Job Listings
contact.html                  ← Contact & Demo Request
server.py                     ← Recommended local static server + form API
server.js                     ← Alternate Node server entrypoint
css/
  style.css                   ← Global stylesheet (variables, nav, footer, components)
js/
  main.js                     ← Global JS (nav, animations, counters, buildNav/buildFooter)
  blog-data.js                ← Shared blog article data
  blogs.js                    ← Blog listing, filter, and pagination logic
  blog-post.js                ← Blog article rendering logic
  forms.js                    ← Form submission and UI handlers
images/
  logo.png                    ← IQ-Line logo
```

---

## 🌐 Navigation Structure

```
Home (index.html)
├── Solutions ▼
│   ├── Solutions Overview (solutions.html)
│   ├── Healthcare Solutions (solutions-healthcare.html)
│   └── Student Management System (solutions-sms.html)
├── Products ▼
│   ├── LIMS (products.html#lims)
│   ├── HIMS (products.html#hims)
│   ├── RIMS (products.html#rims)
│   ├── E-Prescription (products.html#eprescription)
│   ├── BMS (products.html#bms)
│   ├── MUMS (products.html#mums)
│   └── EWS (products.html#ews)
├── About Us ▼
│   ├── Mission (about.html#mission)
│   ├── Scale & Impact (about.html#scale)
│   ├── Compliances (about.html#compliances)
│   └── Founders (about.html#founders)
├── Blogs (blogs.html)
├── Careers (careers.html)
└── Contact Us [CTA Button] (contact.html)
```

---

## 🎨 Brand Identity
- **Primary Color:** `#3DBDB1` (Teal)
- **Dark Color:** `#3d3d3d` / `#2b2b2b`
- **Background Light:** `#f5f7fa`
- **Fonts:** Rajdhani (headings) + Inter (body)
- **Design Style:** Modern SaaS, clean, professional

---

## 📊 Key Content — Products

| Product | Full Name | Target |
|---------|-----------|--------|
| LIMS | Laboratory Information Management System | Hospital Labs |
| HIMS | Hospital Information Management System | Full Hospitals |
| RIMS | Radiology Information Management System | Radiology Depts |
| E-Prescription | Digital Prescription & Pharmacy | Doctors/OPDs |
| BMS | Blood Management System | Blood Banks |
| MUMS | Medical University Management System | Medical Colleges |
| EWS | Early Warning System | ICU/Critical Care |

---

## 🏗️ Features Not Yet Implemented

- [ ] Product sub-domain pages (LIMS.iqline.in etc.)
- [ ] Live chat / WhatsApp chat widget
- [ ] Video demo embed on Products page
- [ ] Case studies / hospital success stories section
- [ ] Team members page with more staff profiles
- [ ] Press / media coverage section
- [ ] Partnership / reseller page
- [ ] Multi-language site toggle (Hindi version)
- [ ] CRM/email forwarding for form submissions

---

## ▶️ Run Locally

```bash
python3 server.py
```

Then open `http://127.0.0.1:3000`.

Form and newsletter submissions are saved locally in the `data/` directory as newline-delimited JSON files.

---

## 🚀 Recommended Next Steps

1. **Add real content** — Replace placeholder contact details (phone, address) with actual company info
2. **Add real testimonials & case study details** — Hospital names with their permission
3. **Backend form integration** — Connect contact & careers forms to CRM/email (e.g., HubSpot, Mailchimp, or custom API)
4. **Video demos** — Add product walkthrough videos on product pages
5. **SEO optimization** — Add meta tags, OpenGraph, structured data (JSON-LD)
6. **Analytics** — Add Google Analytics / Mixpanel
7. **Blog CMS** — Integrate with a headless CMS (e.g., Contentful, Sanity) for managing blog posts
8. **Performance** — Lazy load images, minify CSS/JS for production

---

## 📬 Contact Information (Placeholder)
- **Email:** hello@iqline.in
- **Phone:** +91 XXXXX XXXXX *(update with real number)*
- **Location:** Bengaluru, Karnataka, India

---

*Built with ❤️ for Bharat's Healthcare System*
