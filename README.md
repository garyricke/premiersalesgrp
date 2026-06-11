# Premier Sales Group — Brand & Website

Brand site for **Premier Sales Group**, the manufacturers' representative firm of
**Jason Foley**, representing Unified Wire & Cable.

Built with **Astro** (static), hosted on **Netlify**, with all imagery delivered from
**Cloudinary**. Forms run as **Netlify Forms**.

---

## Pages

| Path             | Purpose                                                        |
| ---------------- | ------------------------------------------------------------- |
| `/`              | Landing page — hero, about, lines, approach, FAQ, contact     |
| `/brand`         | Brand guide — positioning, logo, color, type, voice           |
| `/logo-concepts` | Logo concept directions + the thinking behind each            |
| `/status`        | Day-by-day build log (`noindex`)                              |
| `/thank-you`     | Post-submit confirmation for the contact form (`noindex`)     |

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run preview    # serve the production build
```

## Design system

- **Direction:** Industrial Premium — charcoal canvas, copper accent, bone text.
- **Type:** Fraunces (display serif) · Archivo (grotesk labels) · Hanken Grotesk (body) · Spline Sans Mono (technical).
- Tokens live in `src/styles/global.css`. Site content/config in `src/consts.ts`.

## SEO / AEO

- Per-page `<title>`, meta description, canonical, Open Graph + Twitter cards.
- JSON-LD: `ProfessionalService`, `Person`, `WebSite`, `FAQPage`.
- `@astrojs/sitemap` generates `sitemap-index.xml` (utility pages excluded).
- `public/robots.txt` allows answer-engine crawlers (GPTBot, PerplexityBot, ClaudeBot, etc.).
- FAQ content is written to answer conversational/voice queries.

## Media (Cloudinary)

- Cloud: `dsbllwpbh`, folder `premiersalesgroup`.
- Delivery helper `cld()` in `src/consts.ts` applies `f_auto,q_auto` + sizing.
- To (re)upload working images: `python3 scripts/cloudinary-upload.py`
  (reads `CLOUDINARY_URL` from `.env`; never prints secrets).

## Deploy (handoff steps for Gary)

1. **GitHub:** create repo `garyricke/premiersalesgrp` and push this folder.
   ```bash
   git remote add origin https://github.com/garyricke/premiersalesgrp.git
   git push -u origin main
   ```
2. **Netlify:** New site → import from Git → pick the repo.
   Build settings auto-detected from `netlify.toml` (`npm run build` → `dist`).
3. **Forms:** Netlify auto-detects the `quote-request` form on first deploy.
   Add a notification email under *Site settings → Forms*.
4. **Domain:** point `premiersalesgrp.com` at the Netlify site.
5. **Env:** no build-time secrets are required (Cloudinary URLs are public delivery URLs).

## Private preview (password gate)

The site is gated behind a simple, branded password page via a Netlify Edge
Function (`netlify/edge-functions/auth.js`) — it runs server-side on every
request, so page source isn't viewable until you're in. On success it sets a
14-day cookie.

- **Login:** enter password `imwired` (single field, no username)
- Override the password in **Netlify → Site settings → Environment variables**
  as `SITE_PASSWORD` (keeps the real password out of this public repo).
- The gate only applies on Netlify (not `astro dev`). To test locally:
  `npx netlify dev`.
- **At launch:** delete `netlify/edge-functions/auth.js` to make the site public.
  (The gate also blocks the contact form, so remove it before going live.)

## TODO before launch

- [ ] Replace `PERSON.linkedin` in `src/consts.ts` with Jason's real LinkedIn URL.
- [ ] Confirm Unified product list + any stats Jason wants to stand behind.
- [ ] Jason to pick the lead logo direction (default: The Ascending Peak).
- [ ] Optional: additional headshots / photography.

---

© Premier Sales Group. Site by Orbis Design.
