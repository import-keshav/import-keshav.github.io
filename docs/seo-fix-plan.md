# SEO Fix Plan — import-keshav.github.io

**Paired audit:** `seo-audit.md` (same folder)  
**Goal:** Inbound buyer leads — consulting, freelance AI engineering, full-time Senior AI Engineer / FDE.  
**Date:** 8 October 2026  
**Constraint:** This plan specifies work. It does not modify production HTML/CSS/JS.

Phases are sequential. Do not start Phase C copy until Phase A dates, redirects, and schema no longer fight the crawler.

---

## Phase A — Critical technical and schema

### A1. Stop publishing future dates

**What:** Set all `datePublished` / `article:published_time` / visible bylines / ProfilePage `dateModified` / sitemap `lastmod` to **on or before 8 Oct 2026** (or the real publish instant in `YYYY-MM-DD` or `YYYY-MM-DDThh:mm:ss+05:30`). Align sitemap `lastmod` with JSON-LD `dateModified` per URL.

**Where:**

- `index.html` L72 `dateModified`
- `sitemap.xml` L5, L11, L17, L23 (currently `2026-10-12`)
- `blogs/how-prompt-caching-works.html` L35–36, L80–81, L171
- `index.html` L470 writing card date
- `blogs/index.html` L194

**Why:** Future dates delay or suppress indexing of the newest commercial-adjacent article and the homepage.

**Verify:**

```bash
python3 - <<'PY'
from pathlib import Path
import re
root=Path('/Users/keshav/ImpProjects/import-keshav.github.io')
for p in root.rglob('*'):
    if p.suffix not in {'.html','.xml'}: continue
    t=p.read_text(errors='ignore')
    if '2026-10-12' in t or '12 October, 2026' in t or '12 Oct 2026' in t:
        print(p)
PY
```

Rich Results Test → prompt-caching URL → `datePublished` ≤ today.

---

### A2. Make redirect stubs non-indexable (and document the 301 ceiling)

**What:** On both demystifying stubs:

- Add `<meta name="robots" content="noindex, follow">`
- Keep canonical + refresh (GitHub Pages cannot emit HTTP 301 without Jekyll or a CDN)

Optional later: enable Jekyll + `jekyll-redirect-from` or put Cloudflare in front for true 301s.

**Where:**

- `blogs/demystifying-prompt-caching-for-engineers.html` (after L3)
- `blogs/demystifying-claude-md-agent-harness.html` (after L3)

**Why:** Thin 200 pages should never compete with the real articles.

**Verify:**

```bash
curl -sS https://import-keshav.github.io/blogs/demystifying-prompt-caching-for-engineers.html | grep -i robots
# expect: noindex
```

URL Inspection in Search Console → Request a crawl → “Excluded: noindex”.

---

### A3. Canonicalize internal links to one URL per page

**What:** Pick and stick:

| Page | Canonical URL | Internal href |
|---|---|---|
| Home | `https://import-keshav.github.io/` | `/` or `https://import-keshav.github.io/` |
| Consulting | `.../consulting.html` | `/consulting.html` (or keep `.html` everywhere; do not link `/consulting` **and** `.html`) |
| Blog index | `.../blogs/` | `/blogs/` |
| Posts | `.../blogs/<slug>.html` | `/blogs/<slug>.html` |

Replace `href="index.html"`, `href="blogs/index.html"` with slash forms. Wordmark on home: `href="/"`.

GitHub Pages will still 200 `/index.html` and `/consulting`; canonical + consistent internal links is the available fix without a host change.

**Where:** All templates’ `<header>` / wordmark / breadcrumbs / writing cards:

- `index.html` L169, L173, L186, L210, L370, L466–498
- `consulting.html` L267–284, L304, L319
- `blogs/index.html` L149–166
- Every post header L133–166

**Why:** Stops duplicate-canonical noise (audit H3).

**Verify:**

```bash
# after deploy
python3 - <<'PY'
import hashlib, urllib.request
def body(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent':'x'})).read()
pairs=[
 ('https://import-keshav.github.io/','https://import-keshav.github.io/index.html'),
 ('https://import-keshav.github.io/consulting.html','https://import-keshav.github.io/consulting'),
 ('https://import-keshav.github.io/blogs/','https://import-keshav.github.io/blogs/index.html'),
]
for a,b in pairs:
    ba,bb=body(a),body(b)
    print(a, 'canonical unique in A', b'canonical' in ba)
    print(' identical still expected', hashlib.sha256(ba).digest()==hashlib.sha256(bb).digest())
PY
```

Search Console → Page indexing → Duplicate without user-selected canonical should fall.

---

### A4. Organization publisher + logo for articles

**What:** Add a sitewide `Organization` node:

```json
{
  "@type": "Organization",
  "@id": "https://import-keshav.github.io/#organization",
  "name": "Keshav Bathla — AI Systems Consulting",
  "url": "https://import-keshav.github.io/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://import-keshav.github.io/static_files/og-default.jpg",
    "width": 1200,
    "height": 630
  },
  "founder": { "@id": "https://import-keshav.github.io/#person" },
  "sameAs": ["https://github.com/import-keshav","https://www.linkedin.com/in/keshav-bathla-b517a2152/","https://x.com/import_keshav"]
}
```

Set every `BlogPosting.publisher` to `{ "@id": "...#organization" }`. Prefer a square ≥112px logo file (e.g. `static_files/logo-112.png`) over the 1200×630 OG image if Google’s logo rules complain.

**Where:** Article JSON-LD publisher blocks (example `blogs/how-prompt-caching-works.html` L86–88); repeat on four other posts. Optionally inject the Organization node once on `index.html` `@graph` after WebSite (L50–59) with `publisher` pointing at `#organization` instead of `#person`.

**Why:** Unlocks Article rich results; cleaner KG.

**Verify:** https://search.google.com/test/rich-results → each article URL → Article valid, publisher.logo present.

---

### A5. Fix homepage `makesOffer` dangling `@id`

**What:** Either:

- Inline a stub `Service` on the homepage graph with `@id` `consulting.html#service`, **or**
- Change `makesOffer` to a full `Offer` with `itemOffered` embedded (name, url) without cross-page `@id`.

**Where:** `index.html` L148–154.

**Why:** Rich Results Test unresolved node (audit H6).

**Verify:** Rich Results Test on `https://import-keshav.github.io/` → 0 errors.

---

### A6. Price the OfferCatalog; add FAQPage; add ProfessionalService; add FDE occupation

**What:**

1. Each Offer in `consulting.html` L209–257: add  
   `"priceSpecification": { "@type": "PriceSpecification", "minPrice": "15000", "maxPrice": "30000", "priceCurrency": "USD" }`  
   (and a note that INR invoicing is available — already on-page L357). Do not invent a single exact price.
2. Add `FAQPage` JSON-LD from existing good-fit / not-a-fit / NDA / timezone copy (L534–618). 4–6 questions max.
3. Promote `@type` of the main service to `["Service","ProfessionalService"]` (`consulting.html` L114–116).
4. Homepage `hasOccupation` (`index.html` L98–108): add Occupation `"Forward-Deployed Engineer"` and keep consulting as `makesOffer`. Add `knowsAbout` value `"Forward Deployed Engineering"` (already present L125 — good). Add visible copy in contact (Phase C) so schema is not an orphan.

**Why:** Price + FAQ are the two highest-probability rich-result types for this site. FDE occupation matches recruiter queries.

**Verify:** Rich Results Test on consulting URL → FAQ and Service.  
https://validator.schema.org/ → paste consulting JSON-LD.

---

### A7. Person entity: consultant first, employer second

**What:**

- Keep `worksFor` Harness (true) but add `"@type": "Occupation"` / `hasOccupation` already there.
- Add `"affiliation"` or a second `worksFor` Organization `"Keshav Bathla Consulting"` (same as `#organization`).
- Remove athletic URL from `Person.sameAs` (`index.html` L146). Keep it as a visible footer link, not a KG identity link.
- Do not put `email` in JSON-LD if spam is a concern; keep it visible on the page.

**Where:** `index.html` L88–147.

**Why:** Brand SERP for “Keshav Bathla AI” should not resolve only to Harness employee.

**Verify:** Rich Results Test Person. After weeks: `site:import-keshav.github.io Keshav Bathla` vs LinkedIn in an incognito SERP.

---

### A8. Custom `404.html`

**What:** Add `404.html` at repo root (GitHub Pages convention) with site chrome, short apology, links to `/`, `/consulting.html`, `/blogs/`, résumé, mailto. `noindex`. No thin keyword spam.

**Where:** new file `/Users/keshav/ImpProjects/import-keshav.github.io/404.html` (implementation agent).

**Why:** Recapture typos and dead backlinks (audit H10).

**Verify:**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://import-keshav.github.io/this-page-does-not-exist-seo
# 404
curl -sS https://import-keshav.github.io/this-page-does-not-exist-seo | grep -E 'consulting|noindex'
```

---

## Phase B — Performance and resource loading

### B1. LCP portrait: real srcset, preload, correctly sized files

**What:** Export 320w / 520w / 800w WebP (and JPEG fallback).  

```html
<link rel="preload" as="image" href="static_files/keshav-bathla-520.webp" type="image/webp" fetchpriority="high">
```

`srcset` + `sizes="(min-width: 960px) 260px, 42vw"`. Keep width/height 260×325 (aspect 4:5 matches 960×1200).

**Where:** `index.html` L15–18 (preload next to fonts), L216–218; `consulting.html` L323–326. New files under `static_files/`.

**Why:** Current 960×1200 WebP (123 KB) / JPEG (212 KB) for a 260px slot (audit H9).

**Verify:** Chrome DevTools → Network → img → transferred size ≤ ~40 KB on 2x. PageSpeed Insights mobile LCP element = portrait or H1, LCP < 2.5s.

```bash
sips -g pixelWidth -g pixelHeight static_files/keshav-bathla.webp
```

---

### B2. Defer Clarity until after load

**What:** Move Clarity snippet to after `portfolio.js`, or wrap in `requestIdleCallback` / `load` event. Add `<link rel="preconnect" href="https://www.clarity.ms" crossorigin>` only if it stays.

**Where:** Head snippets `index.html` L7–12 and copies on every HTML file; or a single late `portfolio.js` injection.

**Why:** Third-party JS on the critical path of every URL, including articles whose LCP is text.

**Verify:** DevTools Coverage / Network: `clarity.ms` starts after `load`. PSI “Reduce unused JavaScript” should drop Clarity from the initial critical path.

---

### B3. Fonts: subset, two weights, optional self-host

**What:** Inter 400+600 only; JetBrains Mono 400 only (or system mono). Keep `display=swap`. Better: self-host two `.woff2` files in `static_files/fonts/` with `font-display: swap` in `style.css` — eliminates fonts.googleapis.com round trips.

**Where:** Every page L15–17; `style.css` L16–17 `--font-sans` / `--font-mono`.

**Why:** Render-blocking CSS + eight font cuts (audit H9).

**Verify:** Network waterfall: no `fonts.googleapis.com` (if self-hosted) or a single CSS + ≤3 woff2. PSI unused-preload warnings = 0.

---

### B4. Replace runtime Mermaid with static SVG

**What:** Render the five diagrams once (prompt-caching ×3, claude.md ×4) to SVG (or SVG+PNG fallback), check them in, delete the `import mermaid from 'https://cdn.jsdelivr.net/...'` modules (`how-prompt-caching-works.html` L561–689; `how-claude-md-works.html` L612+). Give figures reserved `width`/`height` or `aspect-ratio`. Keep `figcaption`.

**Why:** CLS from 120px stub → tall SVG; INP from mermaid.esm; extra origin `cdn.jsdelivr.net`.

**Verify:** View-source of live article: no `cdn.jsdelivr.net`. PSI CLS < 0.1. `curl -sS URL | grep jsdelivr` empty.

---

### B5. Blog PNGs → WebP + srcset; unique OG images

**What:** Convert `static_files/blog/*.png` to WebP; add `srcset`. Create 1200×630 OG stills per article (title + one diagram crop) and point `og:image` / BlogPosting `image` at them.

**Where:** Image tags listed in audit H9; `og:image` on each post L29; schema `image.url` L74–78.

**Why:** Social CTR + article LCP. LinkedIn/X currently show the same generic JPEG for every URL.

**Verify:** https://www.linkedin.com/post-inspector/ and https://cards-dev.twitter.com/validator (or X Card Validator) per article URL — unique image, 1.91:1.

---

## Phase C — Content, metadata, keyword targeting

### C1. Align title, H1, schema headline, crumbs, cards (one string per article)

**What:** One public title per URL. Suggested commercial-aware but accurate:

| URL | Proposed unified title (≤60 chars before brand) |
|---|---|
| `/` | `Keshav Bathla \| AI Systems Consultant & Senior Engineer` (keep; add Bengaluru in description not title) |
| `/consulting.html` | `Hire an AI Agent & MCP Consultant \| Keshav Bathla` |
| `/blogs/` | `Production AI Engineering Notes \| Keshav Bathla` |
| prompt-caching | `Prompt Caching Architecture for AI Coding Agents \| Keshav Bathla` |
| claude.md | `How CLAUDE.md Works in AI Agent Harnesses \| Keshav Bathla` |
| coding-dying | `Coding Is Dying. What Comes Next for Engineers \| Keshav Bathla` (H1 = title; drop the mismatched “How AI Changes…” title **or** commit to that title everywhere) |
| chinese-models | `DeepSeek vs Claude: Cost, Agents, and Trust \| Keshav Bathla` |
| cursor-router | `How Cursor Router Does LLM Model Routing \| Keshav Bathla` |

Drop “(explained simply)” and “Notes on AI, systems and engineering” as H1.

**Where:** Each file’s L19, H1, schema `headline`, crumb, homepage card H3 (`index.html` L468–500), blog index H2 + ItemList names (`blogs/index.html` L110–138, L192–224).

**Why:** Stops Google title rewrites and CTR confusion (audit H7).

**Verify:** After deploy, `curl -sS URL | grep -E '<title>|<h1>'` — strings match. SERP fetch in Search Console URL Inspection.

---

### C2. Rewrite consulting H1 and homepage contact for buyers

**Consulting H1** (`consulting.html` L309) → something like:

> Hire a production AI agent and MCP consultant — remote worldwide, based in Bengaluru.

Lead (`L310–313`) already lists founders/engineering leaders; keep it. Add one line for **recruiters / FTE / FDE** pointing to a new `#hire` or `/hire.html` (see Content Plan).

**Homepage contact H2** (`index.html` L530) → name the three buyer paths explicitly: consulting sprint, freelance project, full-time FDE / Senior AI Engineer (Bengaluru or remote).

Mailto subjects:

- Keep architecture fit call
- Change `Senior Engineering Leadership Opportunity` (`index.html` L543) → `Full-time Senior AI Engineer or FDE role` unless leadership is truly the only FTE target.

**Why:** Audit H1/H2/M7.

**Verify:** 5-second test with a founder and a recruiter (two people). They should each see their path above the fold or in the contact box without scrolling the whole résumé.

---

### C3. Meta descriptions with a closer

**What:** Append a clause to article descriptions: “Written by Bengaluru AI systems consultant Keshav Bathla.” Consulting description already says “Hire …” (`consulting.html` L20) — keep and add FDE only on a dedicated page so you do not cannibalize.

Homepage description (`index.html` L20): add “Hire for consulting, freelance, or full-time FDE roles.”

**Verify:** SERP snippet in URL Inspection; 150–160 characters.

---

### C4. Heading hierarchy patches (no new sections required)

**What:**

- Consulting assurance cards: H4 → H3 (`consulting.html` L546–562)
- claude.md Reason 1: H4 → H3 (`how-claude-md-works.html` L391)
- prompt-caching Zipper: H4 → H3 (`how-prompt-caching-works.html` L409)
- Fit section: one H2 “Fit” + two H3s (`consulting.html` L601, L611)

**Why:** Audit M1.

**Verify:** https://headings.thatcomputernerd.com/ or browser outline extension — single H1, no skips.

---

## Phase D — Internal linking and conversion architecture

### D1. Calendar CTA sitewide

**What:** Create a Cal.com (or Calendly) event “15-min architecture fit call”. Replace **one** primary button per template with that URL; keep mailto as secondary (copy-email already exists).

**Where:**

- `consulting.html` L317, L635–641
- `index.html` L535–537
- Nav `.nav-resume` currently “Discuss a Project” (`index.html` L176) → “Book a fit call”
- Author CTA asides on all five posts (e.g. `how-prompt-caching-works.html` L529–533)

**Why:** Mailto is the #1 conversion leak (audit H2).

**Verify:** Click-through on mobile Safari (no mail app). Clarity already tracks `mailto_clicked` (`portfolio.js` L91–98) — add a `calendar_clicked` event the same way.

---

### D2. Footer = architecture, not only social

**What:** Footer nav on every template: Home, Consulting, Writing, Hire / FTE (once it exists), Résumé, Email, LinkedIn, GitHub, X. Aria-label “Site” vs “Social”.

**Where:** `index.html` L562–572; `consulting.html` L666–675; `blogs/index.html` L232–242; each post footer.

**Why:** Sitewide equity to money pages; consulting currently has no footer path to writing.

---

### D3. Consulting must cite articles; articles must complete the cluster

**What:**

On `consulting.html`, add a “Proof in writing” block (after services or why-keshav) with four descriptive links:

- Prompt caching article → Agent sprint / cost
- CLAUDE.md article → Agent harness / MCP
- Cursor router → Model routing
- Chinese models → Eval / model choice → `#rag-audit`

On articles, add the missing cluster links:

| From | Add |
|---|---|
| `how-claude-md-works.html` L587 | `how-prompt-caching-works.html` |
| `coding-is-dying-what-comes-next.html` L322 | prompt-caching + claude.md |
| `how-cursor-router-works.html` L369 | prompt-caching |
| `chinese-ai-models-vs-us.html` L562 | cursor-router already present; add prompt-caching |

Replace anchor “Get in touch” with “Discuss MCP consulting” / “Discuss LLM routing” etc.

**Why:** Audit H8, M2. Bidirectional links are how commercial pages inherit topical authority.

**Verify:** Crawl simulation:

```bash
python3 - <<'PY'
from pathlib import Path
import re
root=Path('/Users/keshav/ImpProjects/import-keshav.github.io')
html= (root/'consulting.html').read_text()
for slug in ['how-prompt-caching','how-claude-md','how-cursor-router','chinese-ai']:
    print(slug, slug in html)
PY
```

All True.

---

### D4. Blog index body CTA + homepage case → fragment links

**What:** After `blogs/index.html` L185 lead, add 2 sentences + buttons: Consulting offers, FTE/FDE, résumé.  
On homepage cases (`index.html` L269–270 MCP line), link `consulting.html#enterprise-mcp` and `blogs/how-claude-md-works.html`.

**Why:** Blog index is a dead conversion end (audit H2). Cases are proof without a next step.

---

### D5. Proof: one verifiable quote, then case-study URLs

**What (minimum):** One named testimonial (Harness colleague, founder, or hiring manager) with role + company, on consulting and homepage contact. If legal/HR blocks names, use “Engineering manager, public SaaS, 500+ engineers” plus LinkedIn recommendation screenshot with permission.

Then implement Content Plan items CP6–CP8 as separate URLs (not just homepage cards).

**Why:** $15k–$30k and FTE loops require forwardable proof (audit H2).

---

### D6. Recruiter / FDE block

**What:** Even before a full `/hire.html`, add `#hire` on `index.html` or `consulting.html`:

- Open to: Senior AI Engineer, Forward-Deployed Engineer, founding AI engineer (name what you will **not** take)
- Location: Bengaluru in-person / remote worldwide
- Stack: Go, Python, MCP, agents, evals
- One-click: résumé PDF, LinkedIn, email with prefilled subject `FTE: Senior AI Engineer / FDE`

**Why:** Audit M7. Recruiters bounce if they cannot copy a packet in 30 seconds.

---

## Content plan (buyer-intent)

Do **not** add more explainer-only essays until these exist. Each row is one URL, one primary keyword, one audience, one intent.

| ID | Proposed URL | Primary keyword | Audience | Intent | Job of the page |
|---|---|---|---|---|---|
| CP1 | `/consulting.html` (rewrite H1 + FAQ; already exists) | hire production AI agent consultant / MCP consultant | Founders, CTOs | Commercial | Money page. Keep four offers. Add calendar + proof + article citations. |
| CP2 | `/hire.html` **new** | hire AI engineer Bengaluru / hire forward deployed engineer | Recruiters, hiring managers | Commercial / job | FTE + FDE packet: scope, location, stack, résumé, LinkedIn, what roles to send, what not to send. Canonical for job-shaped queries so consulting stays sprint-shaped. |
| CP3 | `/freelance.html` **or** consulting `#freelance` if you refuse a new URL | freelance AI engineer / LLM app development | Startups, agencies, referral freelancers | Commercial | Smaller than $15k sprints: scoped builds, hourly/weekly, what you will not do (generic chatbots). Distinct from CP1 to avoid cannibalization. Prefer a real URL. |
| CP4 | `/blogs/how-to-hire-a-production-ai-engineer.html` **new** | how to hire an AI engineer | Founders who are not ready to buy yet | Informational → consulting | Checklist: agent vs chatbot, evals, MCP, onshore vs contractor. CTA to fit call. |
| CP5 | `/blogs/build-vs-buy-ai-for-startups.html` **new** | build vs buy AI for startups | Seed / Series A CTOs | Commercial-investigation | When to hire a consultant vs a platform vs an FDE. CTA to CP1 and CP2. |
| CP6 | `/work/harness-internal-developer-agent.html` **new** | production AI agent architecture (proof) | CTOs, FDEs peers | Commercial-investigation | Deep dive of homepage case 01 with architecture diagram, constraints, metrics, stack. Link MCP + evals. |
| CP7 | `/work/coinswitch-low-latency-trading.html` **new** | high-scale Go Python backend (proof) | Hiring managers, systems leads | Commercial-investigation | Case 02. Makes “backend + AI” claim credible for FTE. |
| CP8 | `/work/blinkit-listing-latency.html` **new** | (supporting proof) | Hiring managers | Commercial-investigation | Case 03. Short is fine. |
| CP9 | `/blogs/forward-deployed-ai-engineering.html` **new** | forward deployed engineer / FDE AI | Hiring managers, FDE candidates | Informational-commercial | Define FDE as you practice it (on-site Bengaluru + remote overlap, MCP into customer systems, evals). CTA to CP2. |
| CP10 | `/blogs/rag-evaluation-systems.html` **new** | RAG evaluation systems | CTOs with a broken RAG | Informational → `#rag-audit` | Fills the keyword you already sell but do not rank for. CTA to RAG audit offer. |

**Do not write next:** another Cursor/Claude internals essay, another model-geopolitics piece, more career LinkedIn-style posts — until CP1–CP5 and at least one of CP6–CP8 ship. Those posts help engineers share links; they do not convert founders.

**Cluster map after content ships**

```
/consulting.html  ←→  /hire.html  ←→  /freelance.html
        ↑                  ↑
   CP4, CP5, CP9, CP10    CP9
        ↑
   existing 5 essays (keep) + CP6–CP8 work/
```

Each new HTML page: unique title/H1, canonical, sitemap row, OG image, BreadcrumbList, FAQ where Q&A exists, Person `@id` reuse, CTA to calendar.

---

## Suggested implementation order (one week)

| Day | Ship |
|---|---|
| 1 | A1 dates, A2 noindex stubs, A8 404, C1 title/H1 freeze on existing URLs |
| 2 | A4–A7 schema, A5 dangling Offer, A6 FAQ+price |
| 3 | A3 internal canonical hrefs, D2 footer, D3 cluster links, D4 blog-index CTA |
| 4 | D1 calendar, C2 H1/contact, D6 `#hire` block (even if `/hire.html` waits) |
| 5 | B1 portrait srcset, B2 Clarity, B3 fonts |
| 6 | B4 static SVG diagrams, B5 WebP + unique OG |
| 7+ | CP2 `/hire.html`, then CP4, then one case-study URL (CP6) |

Do not wait for new long-form (CP4–CP10) to ship Phase A. Indexing bugs are cheaper than content.

---

## Verification checklist (full site)

```bash
# 1. No future dates
rg -n '2026-10-12|12 October, 2026' /Users/keshav/ImpProjects/import-keshav.github.io

# 2. Redirect stubs noindex
curl -sS https://import-keshav.github.io/blogs/demystifying-prompt-caching-for-engineers.html | rg robots

# 3. Sitemap lastmod ≤ today and matches article dateModified
curl -sS https://import-keshav.github.io/sitemap.xml

# 4. 404 is branded
curl -sS -w '%{http_code}\n' https://import-keshav.github.io/nope | rg -i 'consulting|404'

# 5. No mermaid CDN
rg -n 'cdn.jsdelivr.net|mermaid' /Users/keshav/ImpProjects/import-keshav.github.io/blogs
```

External:

- https://search.google.com/test/rich-results — `/`, `/consulting.html`, one article  
- https://validator.schema.org/  
- https://pagespeed.web.dev/ — mobile `/` and `/blogs/how-prompt-caching-works.html`  
- LinkedIn Post Inspector + X card validator — `/consulting.html` and one article  
- Google Search Console: submit sitemap, inspect `/consulting.html`, monitor “Duplicate without user-selected canonical”  
- Manual 5-second tests: founder, recruiter, freelance PM  

**Success metrics (4–8 weeks, not vanity):**

1. Search Console queries containing hire, consultant, MCP, FDE, Bengaluru, freelance  
2. Clarity events: `calendar_clicked` > `mailto_clicked`  
3. Fit-call bookings attributed to `utm_source=google` / article CTAs  
4. Recruiter inbound that mentions `/hire.html` or the FTE mailto subject  
