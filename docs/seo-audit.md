# SEO Audit — import-keshav.github.io

**Site:** https://import-keshav.github.io/  
**Local repo:** `/Users/keshav/ImpProjects/import-keshav.github.io`  
**Audit date:** 8 October 2026  
**Primary goal:** Inbound **buyer** leads (consulting, freelance AI engineering, full-time Senior AI Engineer / Forward-Deployed Engineer), not vanity traffic.  
**Constraint:** This document is an audit only. No production files were modified.

Live HTTP was sampled the same day. Local HTML and live HTML for the key URLs matched (homepage, consulting, blog index, article URLs).

---

# What we are doing wrong

Ranked by impact on (1) qualified inbound leads, (2) Google ranking for buyer-intent queries, (3) crawl/index hygiene and Core Web Vitals. Every item has evidence.

---

## High impact

### H1. Buyer intent is not encoded in titles, H1s, or URL inventory

A founder searching “hire AI engineer”, “AI consultant for startups”, “MCP consultant”, “hire forward deployed engineer”, or “AI systems engineer Bengaluru” never sees a page whose **title + H1** match that query.

| Query cluster | Closest existing title | Gap |
|---|---|---|
| hire AI engineer / freelance AI engineer | Homepage: “Keshav Bathla \| AI Systems Consultant & Senior Engineer” (`index.html` L19) | No “hire”, no “freelance”, no FDE |
| AI consultant for startups | Consulting: “AI Agent & MCP Consultant \| Keshav Bathla” (`consulting.html` L19) | Decent consultant phrasing; H1 does not say hire/consultant |
| production AI agent consultant | Same consulting title | Partial; H1 is a slogan |
| MCP consultant | Consulting title includes “MCP Consultant” | H1 (`consulting.html` L309) does not contain MCP |
| LLM app development | None | No page |
| hire forward deployed engineer / FDE | None | Role is not named anywhere in titles, H1s, or schema |
| AI systems engineer Bengaluru | Bengaluru only in descriptions / experience (`index.html` L20, L208, L393) | Not in any `<title>` |
| how to hire an AI engineer / build vs buy AI | None | No informational-commercial bridge content |

Consulting H1 (`consulting.html` L309):

> Production AI agents and backend systems that survive production.

That is a tautology, not a commercial heading. It does not name the buyer, the offer, or the action (hire / engage). Homepage H1 (`index.html` L206) is first-person craft (“I build…”) which is fine for brand, but it is the **only** H1 competing for commercial queries because no dedicated service URLs exist.

**Mechanism:** Google’s primary ranking and title-rewrite signals are `<title>`, H1, and visible copy. Commercial SERPs will be won by pages that say “Hire …” / “Consulting for …”. This site currently ranks (if at all) for informational essay titles.

---

### H2. Conversion architecture: no calendar, no testimonials, weak 5-second offer on several templates

**What a buyer cannot do today**

- There is **no Cal.com / Calendly / Google Calendar** URL anywhere in the repo (grep across `*.html` / `*.js`: zero matches). Every high-intent CTA is `mailto:` (`consulting.html` L635–641, `index.html` L371–373, L535–537, blog author CTAs). Mailto adds friction on mobile, loses the lead if the user has no mail client, and cannot be attributed in Search Console the way a `/thanks` or calendar landing can.
- There are **zero testimonials, client logos, or named case-study pages**. Proof is self-reported metrics on the homepage (`index.html` L227–231, L244–325) without a third-party quote, LinkedIn recommendation embed, or deep-dive URL a hiring manager can forward internally.
- **Blog index has no in-body hire CTA** — only header nav (`blogs/index.html` L151–156). A recruiter who lands from a post list never sees “hire / FDE / consulting” in the main column.
- **Consulting page does not link to any article** as proof. `consulting.html` internal `href`s are nav, `#contact`, `#services`, `index.html#work` (L319). Thought-leadership that would de-risk a $15k–$30k sprint is one-way: blogs → consulting, never consulting → blogs.
- Footer is social-only (`index.html` L565–571; `consulting.html` L669–674). No sitewide “Consulting / Writing / Résumé / Email” architecture. Consulting footer also drops the athletic-log link that other pages include — inconsistent, but more importantly it does not pass PageRank to money pages from the footer.

**5-second test**

| Surface | Can a stranger tell what you sell and who you help? | Primary action |
|---|---|---|
| Homepage hero (`index.html` L205–213) | Yes for consulting-ish work; **no FDE / “hire me full-time”** until contact H2 at L530 | “Explore Consulting” |
| Consulting hero (`consulting.html` L308–320) | Offer is clear in lead paragraph; H1 is weak | Mailto / in-page contact, no calendar |
| Blog article CTA asides | Yes for consulting sprints | Mailto + consulting fragment |
| Blog index (`blogs/index.html` L181–185) | No. H1: “Notes on AI, systems and engineering” | None in body |

Homepage contact H2 (`index.html` L530) does mention hiring:

> Building a production AI system—or hiring technical leadership?

That is the only explicit full-time hiring sentence. It does not say **Forward-Deployed Engineer**, **Senior AI Engineer**, or **Bengaluru / remote**. The mailto subject is `Senior Engineering Leadership Opportunity` (`index.html` L543) — “leadership” may miss IC FDE / senior AI engineer briefs.

**Mechanism:** Conversion rate on consulting/freelance/FDE traffic is capped by CTA friction and missing social proof, independent of rankings.

---

### H3. Duplicate indexable URLs (no HTTP consolidation)

Live curl (8 Oct 2026), identical bodies, **HTTP 200 on both**, no 301:

| Pair | Canonical in HTML | Live status |
|---|---|---|
| `https://import-keshav.github.io/` and `/index.html` | `/` (`index.html` L14) | Both 200, same SHA |
| `https://import-keshav.github.io/consulting.html` and `/consulting` | `consulting.html` (`consulting.html` L14) | Both 200, same SHA |
| `https://import-keshav.github.io/blogs/` and `/blogs/index.html` | `/blogs/` (`blogs/index.html` L14) | Both 200, same SHA |
| `/blogs` | — | 1 hop to `/blogs/` (good) |

Canonical tags point at one URL, which is necessary but not sufficient. Google still crawls both; Search Console often reports “Duplicate, Google chose different canonical than user.” Internal links **prefer the duplicate form**: wordmark `href="index.html"` (`index.html` L169), nav `href="blogs/index.html"` (`index.html` L173), `href="consulting.html"` everywhere.

**Mechanism:** Split signals, diluted sitelinks, messier Search Console. GitHub Pages will serve `foo.html` at `/foo` and `index.html` at both `/` and `/index.html`. Internal links should use the canonical form (`/` , `/consulting.html` or a chosen slash policy, `/blogs/`).

---

### H4. Legacy blog URLs return HTTP 200 thin redirect stubs, not 301

Live:

- https://import-keshav.github.io/blogs/demystifying-prompt-caching-for-engineers.html → **200**, 622 bytes  
- https://import-keshav.github.io/blogs/demystifying-claude-md-agent-harness.html → **200**, 552 bytes  

Evidence: `blogs/demystifying-prompt-caching-for-engineers.html` L4–8 (`meta refresh` + `window.location.replace`); same pattern in `blogs/demystifying-claude-md-agent-harness.html` L4–8.

Missing on both stubs:

- `robots` / `X-Robots-Tag: noindex`
- `html lang`, viewport
- HTTP 301 (GitHub Pages cannot emit 301 without Jekyll `jekyll-redirect-from`, a custom 404 trick, or an external CDN)

They **do** have `rel=canonical` to the new URLs (L6 on both). They are **not** in `sitemap.xml` (good). They are still crawlable if old tweets/HN links exist.

**Mechanism:** Thin 200 pages can be indexed as “Redirecting to…”. Client-side refresh is a weaker redirect than 301 for link equity.

---

### H5. Future `datePublished` / `lastmod` (today is 8 Oct 2026)

| Location | Value |
|---|---|
| `index.html` L72 ProfilePage `dateModified` | `2026-10-12` |
| `sitemap.xml` L5, L11, L17, L23 | `2026-10-12` for home, consulting, blogs index, prompt-caching article |
| `blogs/how-prompt-caching-works.html` L35–36, L80–81 | `article:published_time` / `datePublished` = `2026-10-12` |
| Homepage writing card | “12 Oct 2026” (`index.html` L470) |

Google may drop or delay indexing of documents dated in the future, and rich-result eligibility can fail.

Additionally, sitemap `lastmod` for older posts is `2026-10-08` (`sitemap.xml` L29, L35, L41, L47) while article JSON-LD `dateModified` is `2026-09-20` for Chinese models and Cursor Router (`blogs/chinese-ai-models-vs-us.html` L81; `blogs/how-cursor-router-works.html` L81). Inconsistent lastmod trains Google to ignore the sitemap field.

---

### H6. Schema will fail Google’s article / service rich-result requirements

**BlogPosting.publisher is a Person, not an Organization with logo**

Every article graph sets `"publisher": { "@id": "https://import-keshav.github.io/#person" }`  
Example: `blogs/how-prompt-caching-works.html` L86–88. Same on `how-claude-md-works.html` L86–88, `coding-is-dying-what-comes-next.html` L86–88, `chinese-ai-models-vs-us.html` L86–88, `how-cursor-router-works.html` L86–88.

Google Article rich results require `publisher.Organization` + `logo` (ImageObject, min 112px). Person-as-publisher is Schema.org-legal and Google-invalid for that enhancement.

**Dangling Offer `@id` on the homepage**

`index.html` L148–154 `makesOffer.itemOffered.@id` = `https://import-keshav.github.io/consulting.html#service`. That node is **not** in the homepage `@graph`. Rich Results Test flags unresolved `@id` when the graph is evaluated per page.

**Service Offers have no price despite on-page pricing**

Visible: `consulting.html` L357 “Most fixed-scope engagements range between US$15k–$30k.”  
JSON-LD Offers (`consulting.html` L209–257) have `url` + nested `Service` name/description only — no `price`, `priceCurrency`, `priceSpecification`, or `eligibleTransactionVolume`. Google cannot emit price-related rich results; GPT-style shopping/consulting agents also cannot quote a range from schema.

**No `ProfessionalService`, no `FAQPage`, no `Occupation` for FDE**

- Consulting uses `Service` + `OfferCatalog` (`consulting.html` L114–203) — acceptable, but `ProfessionalService` with `areaServed` + `geo` is the type Google maps to local/professional queries.
- Consulting has FAQ-shaped copy (good fit / not a fit, L596–618; assurances L534–565) with **no FAQPage** schema — a cheap rich-result win left unused.
- Homepage `hasOccupation` (`index.html` L98–108) is “Senior AI Systems Engineer” and “Senior Backend Systems Engineer”. **Forward-Deployed Engineer is absent** from schema, copy, and titles.

**Person.worksFor = Harness only** (`index.html` L88–92) while the commercial pitch is independent consulting. Knowledge Graph / LinkedIn-style SERPs will prefer “Senior Software Engineer at Harness”, not “AI consultant”. `sameAs` also includes `https://keshav-harness.github.io/` (`index.html` L146) — an athletic log — which dilutes professional entity merging.

**Blog Person stubs** omit `sameAs`, `jobTitle`, `email` (e.g. `how-prompt-caching-works.html` L60–65). Cross-page `@id` merge is hoped for, not guaranteed on first crawl.

---

### H7. Title / H1 / schema headline mismatch (title rewriting + CTR)

Google often replaces `<title>` with H1 when they diverge.

| File | `<title>` | Visible H1 | Schema `headline` |
|---|---|---|---|
| `how-prompt-caching-works.html` L19 / L169 / L71 | “…Why Prompt Caching **Powers** AI Coding Agents” | “…**Unsung Hero** of AI Coding Agents” | Unsung Hero |
| Homepage card `index.html` L468 | — | “Powers” short title | — |
| Blog index ItemList L112 | Unsung Hero long name | — | — |
| `coding-is-dying-what-comes-next.html` L19 / L169 / L71 | “How AI Changes Software Engineering Careers” | “Coding is Dying. What Comes Next?” | Career-safe headline |
| `chinese-ai-models-vs-us.html` L19 / L169 | “DeepSeek vs Claude: Cost, Agents & Trust” | “Cheap Intelligence, Expensive Trust: …” | Short title |
| `how-cursor-router-works.html` L19 / L169 | “How Cursor Router Works: LLM Model Routing” | “…picks the right model **(explained simply)**” | Title version |
| `blogs/index.html` L19 / L184 | “Production AI Engineering Blog” | “Notes on AI, systems and engineering” | CollectionPage uses blog title L68 |

Prompt-caching crumb (`how-prompt-caching-works.html` L166) uses the **Powers** phrasing; H1 uses **Unsung Hero**. Three public names for one URL.

For buyers, “explained simply” and “Notes on AI” signal hobby blog, not a consultant they would pay $15k.

---

### H8. Keyword cannibalization: homepage vs consulting vs essays

Both homepage and consulting target the same commercial phrase cluster (“production AI agents”, “MCP”, “RAG evaluation”, “high-scale backend”) in `<title>` and meta description (`index.html` L19–20 vs `consulting.html` L19–20).

There is **no distinct landing page** for:

- Freelance / project work vs retained consulting vs FTE
- MCP-only engagement (only an on-page fragment `#enterprise-mcp`)
- RAG audit as a standalone indexable URL
- FDE / “hire Keshav” recruiting page

Essays `how-prompt-caching-works.html` and `how-claude-md-works.html` both compete for “prompt caching” (claude.md L20, L99 keywords include prompt caching; prompt-caching article is the rightful canonical for that query). Internal link from claude.md **related reading omits** the prompt-caching article (`how-claude-md-works.html` L587–594) even though the body spends a section on caching (L431+). That is both a cluster error and a missed consolidating link.

---

### H9. Render-blocking third parties and Mermaid CLS (CWV)

On **every** HTML page, in `<head>` before CSS:

1. Microsoft Clarity inline loader (`index.html` L7–12, same on consulting L7–12, all blogs L7–12) — `async=1` on the injected tag, but the snippet itself is in head and starts a third-party connection on the critical path. No `preconnect` to `www.clarity.ms`.
2. Google Fonts render-blocking stylesheet (`index.html` L15–17): Inter 400/500/600/700 + JetBrains Mono 400/500. `display=swap` is in the URL (good) but the CSS request still blocks first paint. Eight cuts is more than the UI uses.
3. `static_files/style.css` (~30 KB) — acceptable.

**Mermaid on two posts** (high INP/CLS risk):

- `blogs/how-prompt-caching-works.html` L561–689: `import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'`
- `blogs/how-claude-md-works.html` L612+: same, four diagrams

Empty containers `.mermaid-diagram { min-height: 120px }` (`static_files/style.css` L602–611) then client-rendered SVG (often 300–500px) → layout shift. Module script is deferred (good for parse) but competes with INP after load. No `preconnect` to `cdn.jsdelivr.net`. Theme toggle re-renders all diagrams (`how-prompt-caching-works.html` L684–688).

**LCP image over-fetch:**

Hero `<img>` declares `width="260" height="325"` (`index.html` L218; `consulting.html` L325) with `fetchpriority="high"` (good) but files are **960×1200**, 212 KB JPEG / 123 KB WebP (`static_files/keshav-bathla.jpg`, `.webp`). No `srcset`/`sizes`. The browser downloads ~4× linear resolution for a 260 CSS-pixel slot (520px at 2x would suffice).

Blog LCP candidates are uncompressed PNG, several with `fetchpriority="high"`:

| File | Image | Display attrs | Actual |
|---|---|---|---|
| `coding-is-dying-what-comes-next.html` L204 | `coding-dying-ai-wealth-flow.png` | 783×198 eager high | 783×198 PNG 30 KB |
| `chinese-ai-models-vs-us.html` L387 | `chinese-models-intelligence-index.png` | 1024×564 eager high | 1024×564 PNG 69 KB |
| `how-cursor-router-works.html` L207 | `01-router-overview.png` | 1024×170 eager high | 1024×170 PNG 22 KB |

No WebP/AVIF, no `srcset`. CSS forces `width: 100%` (`style.css` L583–588), so width/height attributes do not fully reserve the final layout on a 800px article column.

All Open Graph images are the same `og-default.jpg` (`index.html` L33; every blog `og:image`). Articles will look identical on LinkedIn/X — weak social CTR for the exact channel recruiters and founders use.

---

### H10. Custom 404 is GitHub’s generic page (indexable-looking, off-brand, no recovery)

Live `https://import-keshav.github.io/this-page-does-not-exist-seo` → **HTTP 404**, title `Page not found · GitHub Pages`, no canonical, no robots, no links to consulting or home.

Repo has **no** `404.html`. Lost backlinks and typos (`/consulting.htm`, old paths) dump users off-site instead of capturing a lead.

---

### H11. Content gaps vs how buyers actually search

Existing posts are **engineer-explainer** pieces (prompt caching, CLAUDE.md, Cursor Router, model geopolitics, career essay). Word counts: prompt-caching ~2274; claude.md ~2786; chinese models ~2398; coding-dying ~1061; cursor-router ~982; blog index body ~272 (thin).

Missing **commercial** pages (none of these URLs exist):

1. Hire / FDE / full-time AI engineer landing  
2. Freelance AI engineer / project work (distinct from $15k sprint consulting)  
3. “How to hire a production AI engineer” (informational → consulting)  
4. Build vs buy AI for seed/Series A  
5. MCP implementation landing (indexable, not only `#enterprise-mcp`)  
6. RAG eval audit landing  
7. Named case-study URLs for Harness agent, CoinSwitch, Blinkit  
8. Prompt-caching **service** angle (cost/latency optimization engagement)  
9. Bengaluru / India GST + in-person page targeting local + GCC founders  
10. Testimonials / proof page  

Without these, organic demand for “hire …” cannot land on a relevant URL. Blog traffic cannot be retargeted by intent.

---

## Medium impact

### M1. Heading hierarchy breaks

- Consulting assurances: H2 (`consulting.html` L538) then **H4** cards (L546–562) — skipped H3. Screen readers and outline-based SEO parsers see a broken tree.
- Consulting `#fit`: two sibling H2s (“When this work is useful” L601, “When to choose another route” L611) with no parent H2 for the section. Valid HTML5, weak outline.
- `how-claude-md-works.html`: H2 “The Big Surprise” then **H4** “Reason 1” (L391) then **H3** “Reason 2–4” (L414, L426, L431) — H4 then H3 inversion.
- `how-prompt-caching-works.html` L409: H4 “The Zipper Principle” under H2 without an H3.
- Consulting CTA H3s inside asides after article H2s are OK; emoji in H3 (`how-prompt-caching-works.html` L428 “🌟 The Golden Rule”) is unnecessary noise in outlines.

---

### M2. Internal linking is incomplete and generic

**Missing cluster links**

- `how-claude-md-works.html` L587–594: no link to `how-prompt-caching-works.html` despite overlapping topic.
- `coding-is-dying-what-comes-next.html` L322–327: no links to prompt-caching or claude.md (MCP/evals are recommended in body L263–264).
- `how-cursor-router-works.html` L369–374: no link to prompt-caching (cache-miss cost is mentioned L219).
- `chinese-ai-models-vs-us.html` L562–567: no prompt-caching / claude.md.

**Generic anchors**

- Repeated “Get in touch” (`how-claude-md-works.html` L593; `coding-is-dying-what-comes-next.html` L327; `chinese-ai-models-vs-us.html` L567; `how-cursor-router-works.html` L374).
- Card chrome “Read article” (`index.html` L470–502; `blogs/index.html` L194–226) — the parent `<a>` wraps the H2, so it is not a separate crawl path, but it trains users toward generic language.
- Nav CTA “Discuss a Project” on every page — not “Hire an AI engineer” / “Book a fit call”.

**Relative `index.html` links** force the duplicate URL in H3.

**Visual breadcrumbs on posts** are `Writing / Title` only (`how-prompt-caching-works.html` L166), while JSON-LD BreadcrumbList includes Home (`L104–122`). Consulting visual breadcrumbs match schema (`consulting.html` L303–307 vs L78–93). Inconsistent.

**Homepage work cases** (`index.html` L236–326) do not link to related essays (MCP → claude.md / consulting#enterprise-mcp; agents → prompt-caching).

---

### M3. Brand-search and E-E-A-T fragmentation

- `sameAs` (`index.html` L142–147): GitHub, LinkedIn, X, athletic GitHub Pages. Missing: explicit `https://import-keshav.github.io/` already as `url` (OK). No Crunchbase, no Google Scholar, no personal Knowledge Panel image distinct from OG default.
- Athletic property in `sameAs` and homepage hero caption (`index.html` L220) competes with “Keshav Bathla AI” queries.
- `Person.email` in JSON-LD (`index.html` L81) is harvestable; it does not help rankings.
- No `rel="author"` / byline URL on posts; author is a 52px avatar with alt “Keshav Bathla” only (`how-prompt-caching-works.html` L519) — misses the consultant job title in alt.
- Résumé exists as PDF (`static_files/keshav-bathla-resume.pdf`) and an unused duplicate `static_files/Keshav's Resume.pdf` (space in filename, not linked). PDFs are poor for “Keshav Bathla AI engineer” queries vs an HTML résumé/about page.
- No `llms.txt` / `/.well-known` for AI-agent crawlers (low-medium for 2026 buyer agents that fetch consulting pages).

SERP consolidation of site + LinkedIn + GitHub + X depends on consistent NAP, `sameAs`, and identical display name. Display name is consistent. Occupation is not (Harness employee vs consultant vs FDE).

---

### M4. Metadata and snippet quality

- Titles for articles are long; “\| Keshav Bathla” plus poetic H1s will truncate on mobile SERP (~40–50 characters visible).
- Meta descriptions are decent length but **not commercial** on articles (they sell the essay, not the sprint). Example `how-prompt-caching-works.html` L20 — no “I help teams ship …” closer.
- `article:published_time` is date-only (`2026-10-08`) without timezone (`how-claude-md-works.html` L35).
- No `article:tag` / `article:section`.
- BlogPosting missing `wordCount`, `timeRequired`, `isAccessibleForFree`, expanded `author`.
- No `twitter:label1` (reading time) — minor.
- Favicon is a data-URI SVG (`index.html` L45). Fine for browsers; some crawlers and iOS share sheets prefer `/apple-touch-icon.png`. None exists.
- `og:type` homepage is `profile` (`index.html` L26) — correct for ProfilePage. Consulting is `website` (`consulting.html` L27) — should be `website` or consider leaving as-is; not `product`.

---

### M5. robots.txt / sitemap / index hygiene leftovers

`robots.txt` L1–4: `Allow: /` + sitemap. Fine. It does **not** `Disallow` the redirect stubs or `static_files/Keshav's Resume.pdf`.

`sitemap.xml` includes the right 8 URLs and **excludes** redirect stubs (good). It includes `changefreq`/`priority` (ignored by Google — noise). Future lastmod (H5).

No `hreflang` needed (single language).

---

### M6. Performance extras

- No `<link rel="preload" as="image">` for the LCP portrait.
- Clarity `identify(ref)` on UTM (`static_files/portfolio.js` L106–108) is analytics/privacy, not SEO; it does add JS work on every page.
- `Cache-Control: max-age=600` from GitHub Pages (live homepage headers) — short cache, not a ranking factor, but hurts repeat LCP.
- Mobile: CSS has 44px targets and breakpoints at 640/760/960 (`style.css` L1179–1241). `nav-desktop` hidden below 960px. Viewport meta present. No obvious horizontal-scroll CSS bugs found in a static read; **not lab-measured** in this audit (no Lighthouse run against production with throttling). Treat H9 as the CWV hypothesis until PageSpeed Insights is run.

---

### M7. Offer page conversion copy vs recruiter/FDE buyers

`consulting.html` is optimized for **founders buying a sprint**. Recruiter/FDE path is only:

- Homepage mailto “Discuss a Leadership Role” (`index.html` L543)
- Contact H2 mentioning “hiring technical leadership” (`index.html` L530)

There is no:

- Availability signal for FTE (notice period, remote vs Bengaluru hybrid, visa, compensation band)
- Role inventory (FDE vs Staff AI vs consulting-only)
- “For recruiters” block with one-pager bullets + résumé + LinkedIn

Fellow-freelancer / agency referral channel is unnamed. No partner/referral sentence.

---

## Low impact

### L1. Sitemap `changefreq` / `priority`

Ignored by Google. Harmless. Prefer accurate `lastmod` only (`sitemap.xml` L6–7 etc.).

### L2. JSON-LD formatting / skills indent

`index.html` L117–118 `"PostgreSQL"` / `"Redis"` indentation is cosmetic.

### L3. `target="_blank"` on external links without `noopener` — actually they have `rel="noopener"` (e.g. `coding-is-dying-what-comes-next.html` L191). Fine.

### L4. Theme flash script in head (`index.html` L6)

Tiny; not a CWV issue.

### L5. Duplicate WebSite node on every page

Correct `@id` reuse pattern. Keep.

### L6. No SearchAction on WebSite

No on-site search; adding a fake SearchAction would be invalid. Do not add.

### L7. Email in visible copy and schema

Intentional for conversion. Spam risk only.

### L8. `.DS_Store` in repo root

Not served as content of note; do not put in sitemap.

---

# What is already working well

1. **HTTPS, HSTS, `lang="en"`, viewport, `robots: index, follow`** on all money pages. Live homepage `Strict-Transport-Security: max-age=31556952`.
2. **Canonical tags exist** on homepage, consulting, blog index, all five articles (`index.html` L14; `consulting.html` L14; `blogs/index.html` L14; each post L14).
3. **robots.txt + sitemap.xml are valid and discoverable.** Sitemap lists all eight intended URLs; redirect stubs are omitted.
4. **Open Graph + Twitter Cards** are complete on money pages: `og:title`, description, url, locale, image 1200×630 (`og-default.jpg` is actually 1200×630), `twitter:card=summary_large_image`, `twitter:creator=@import_keshav`.
5. **JSON-LD graphs are ambitious and mostly well-ID’d:** `WebSite` + `ProfilePage` + `Person` on home; `Service` + `OfferCatalog` + `BreadcrumbList` on consulting; `BlogPosting` + `BreadcrumbList` on posts; `CollectionPage` + `ItemList` on blog index. `@id` stability for `#person` and `#website` is the right pattern.
6. **Person entity basics are strong:** name, image, jobTitle, homeLocation Bengaluru, alumniOf, skills, knowsAbout, award GSoC, `sameAs` GitHub/LinkedIn/X (`index.html` L75–147).
7. **Consulting page is a real commercial page**, not a mailto stub: scoped offers, INR/GST note (`consulting.html` L357, L561–564), timezone overlap, NDA/IP, process, good-fit / not-a-fit. Visible price band. Area served includes India, US, Europe, Middle East, APAC.
8. **Every article (except the list page) has an author CTA aside** linking to a consulting fragment (`#ai-agent-sprint`, `#rag-audit`, `#systems-advisory`) plus mailto. That is the correct conversion pattern for informational URLs.
9. **Portrait uses `<picture>` + WebP + width/height + `fetchpriority="high"`** (`index.html` L216–218). Skip link, 44px targets, `prefers-reduced-motion` (`style.css` L1243–1246) — accessibility is above typical personal sites.
10. **Internal nav includes Consulting as a first-class item** on all templates. Homepage has a consulting bridge section (`index.html` L361–377) and contact dual-path (consulting vs leadership role).
11. **`/blogs` trailing-slash redirect works** (1 hop to `/blogs/`).
12. **Live and local content are in sync** for the audited URLs (identical SHA for home, consulting, blog index).
13. **Article bodies are not thin** (1k–2.8k words) and match engineer search intent for those specific topics.
14. **Alt text on blog figures is descriptive**, not “image1.png” (e.g. `how-cursor-router-works.html` L207, L247).
15. **`rel="me"`** on footer LinkedIn/GitHub/X (`index.html` L567–570) supports identity verification.

---

# Priority snapshot

| Rank | Issue | Blocks |
|---|---|---|
| H1 | No hire/FDE/freelance landing language | Rankings for buyer queries |
| H2 | No calendar, no testimonials, weak blog-index CTA | Conversion |
| H3 | Duplicate 200 URLs | Index hygiene |
| H4 | 200 redirect stubs | Index hygiene / equity |
| H5 | Future dates | Indexing |
| H6 | Schema gaps (publisher, price, FAQ, FDE occupation) | Rich results / KG |
| H7 | Title≠H1 | CTR / rewrites |
| H8 | Cannibalization + missing cluster links | Rankings |
| H9 | Fonts, Clarity, Mermaid, oversized LCP | CWV |
| H10 | Default GitHub 404 | Recovery / brand |
| H11 | Missing buyer pages | Demand capture |

Fix sequencing is in `seo-fix-plan.md`.
