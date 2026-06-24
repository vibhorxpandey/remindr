# स्वरावली · Swaraavali Institute of Music & Fine Arts

A high-end marketing + enrollment website for an Indian institute teaching
**vocals, instruments, and Kathak / Bundelkhand folk dance** in Karvi,
Chitrakoot. The signature is a culturally-rooted, audio-reactive **3D garland of
swara glyphs** — layered on top of a fully accessible, SEO-correct base site.

> Built progressively. The base site is 100% usable, navigable, and convertible
> **with WebGL disabled**. 3D is an enhancement (Phases 3–5).

## Stack

- **Next.js 15** (App Router, React 19, Server Actions) · TypeScript (strict)
- **Tailwind CSS v4** design system (dark indigo + saffron-gold)
- **react-hook-form + zod** typed forms (shared client/server schema)
- ESLint 9 (flat config) + Prettier
- _Planned:_ Drizzle/Supabase, Resend, Upstash, three.js / R3F (see Phases)

## Getting started

```bash
cd swaraavali
npm install
cp .env.example .env.local   # not needed for the base site; used from Phase 2
npm run dev                  # http://localhost:3000
```

Scripts: `npm run build` · `npm run lint` · `npm run typecheck` · `npm run format`

## Project structure

```
app/            routes (home, gallery, events, contact, admin),
                metadata, sitemap.ts, robots.ts, opengraph-image.tsx, actions.ts
components/
  ui/           Nav, Footer, Button, EnquiryForm, Gallery*, EventsList, …
  sections/     Hero, Story, Disciplines, Programs, WhyUs, GalleryTeaser,
                Testimonials, Contact
content/        typed bilingual (EN/HI) copy + site NAP + gallery/events data
lib/            locale + audio providers, seo (JSON-LD), zod schema
```

## What’s done (Phases 0–1)

- ✅ Scaffold: Next 15 + TS strict + Tailwind v4 + ESLint/Prettier
- ✅ Design system (palette, fonts: Fraunces / Inter / Tiro Devanagari Hindi)
- ✅ All home sections + `/gallery`, `/events`, `/contact`, `/admin` (placeholder)
- ✅ Accessibility: skip link, focus states, semantic landmarks, keyboard nav,
  `prefers-reduced-motion` honored throughout
- ✅ **Bilingual EN/HI** toggle (persisted), Devanagari rendering
- ✅ Enquiry form: RHF + Zod, conditional instrument field, honeypot, consent,
  inline errors, success state, submits via `submitEnquiry` Server Action
- ✅ SEO: per-page Metadata, canonical, OG/Twitter, **dynamic OG image**,
  JSON-LD (`MusicSchool`+`LocalBusiness`, `Course`, `Event`), `sitemap`, `robots`
- ✅ Global audio toggle (default **muted**, persisted) — ready for Phase 4
- ✅ Static hero "poster" (gradient + animated sheen + CSS swara garland) — the
  zero-WebGL baseline the Canvas mounts onto later

## Roadmap (remaining)

- **Phase 2 — Backend:** Drizzle schema + migrations; wire `submitEnquiry` to
  Upstash rate-limit + Postgres insert + Resend emails (notify + auto-reply);
  Supabase-Auth-gated `/admin` with enquiries table, filters, status, CSV export.
- **Phase 3 — 3D engine:** persistent `<Canvas>`, Lenis + GSAP master timeline,
  GPU tiering, reduced-motion/WebGL fallback, particle garland (Scene 1).
- **Phase 4 — Instruments + audio:** procedural fallback instruments → glTF
  swap-in, hover/tap-to-play, AnalyserNode → `uAudio` reactive particles + bloom.
- **Phase 5 — Scenes + post:** dance ring/mandala, Mahotsav bloom, CTA
  convergence, selective UnrealBloom / vignette / DOF.
- **Phase 6 — Polish:** perf to budget, a11y audit, schema validation, QA.
- **Phase 7 — Tests + deploy:** Vitest + Playwright, Lighthouse ≥ 95, deploy.

## Configuration / TODO(confirm)

Search the codebase for `TODO(confirm)`. Open items:

- **Email** — using `Simfacktd@gmail.com` verbatim (flagged as possibly
  misspelled in the brief; confirm before going live).
- **Geo coordinates** — approximate for Karvi; replace with the exact pin.
- **Opening hours / social links** — placeholder defaults.
- **Gallery photos, event dates, testimonials** — placeholders; swap real assets
  into `/public/images` and update `content/gallery.ts` / `content/events.ts` /
  `content/copy.ts`.

**Confirmed:** address (Dwarikapoori, Pandey Colony, near Chandralok Showroom,
Karvi, Chitrakoot 210205, UP) · course duration = **6–12 months**.

## Accessibility & motion

`prefers-reduced-motion` disables the tagline rotation, scroll reveals, magnetic
buttons, and (later) the entire 3D layer. Audio never autoplays and defaults to
muted. All interactive controls are keyboard-reachable with visible focus.
