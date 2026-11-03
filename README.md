# Tekprenuers website (v2)

Marketing site for [Tekprenuers](https://www.tekprenuers.com), a remote-first tech agency in Lagos, Nigeria.
React 19 · Vite · TypeScript (strict) · Tailwind CSS 4 · React Router 7 · Framer Motion · three.js (react-three-fiber) · Hugeicons.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (client-rendered, no prerender). |
| `npm run build` | Type-check, build, then **prerender every route to static HTML** and emit `sitemap.xml`, `robots.txt`, `404.html`. |
| `npm run preview:static` | Serves `dist/` like a real static host (`/about` → `about/index.html`, gzip/brotli, HTTP 404). Use this instead of `vite preview`, which answers every path with the home page's HTML. |
| `npm run lint` | ESLint (type-aware React rules, React Compiler checks). |
| `npm run images` | Re-optimise `assets-src/` (logos, 3D icons, photos) into AVIF + WebP in `src/assets/images/` (+ `manifest.json`). Photos become monochrome. |
| `npm run icons` | Regenerate favicons / app icons in `public/` from the logo. |

Environment variables are documented in [`.env.example`](.env.example). Everything is optional.

## Editing content

**All copy and every client-supplied fact lives in one file: [`src/data/site-content.ts`](src/data/site-content.ts).**

- `TODO(client): …` marks something the client has not supplied (testimonials, awards, team, social URLs, booking link,
  case-study details, live URLs). The UI **hides any section whose data is empty or placeholder-only**, so nothing
  fake is ever shown. Fill the value in and the section appears. Find them all with `grep -rn "TODO(client)" src`.
- `REVIEW:` marks copy written by the site team (service detail pages, process timelines, FAQ answers, comparison,
  legal templates) that the client should read and approve.
- Image fields are keys into `src/assets/images`.

Routes, meta titles/descriptions, JSON-LD, the sitemap and the prerendered pages are all generated from that file, so
adding a service or a project there creates its page, its SEO tags and its sitemap entry.

## Architecture

```
src/data/site-content.ts      single content source
src/lib/                      seo (pure), consent, theme, contact form logic, placeholder helpers
src/components/ui/            Button, Container, Section, Heading, Card, Badge, Accordion, Picture, Reveal, TiltCard, CountUp, Magnetic
src/components/layout/        Header, MobileDrawer, Footer, ScrollProgress, BackToTop, CookieBanner, WhatsAppWidget
src/components/shared/        PageHero, CtaBand, ServiceCard, ProjectCard, Comparison, Testimonials, TechOrbit, …
src/components/three/         lazy WebGL scenes (city, orbit) + capability checks
src/features/<page>/          one folder per route
src/entry-server.tsx          build-time prerender entry
plugins/seo-plugin.ts         prerender + per-route <head> + sitemap/robots/404 + deferred app loading
scripts/                      image optimiser, icon generator, static preview server
```

### Design language
- **Flat**: no shadows, no gradients (borders and solid colour only). **Buttons** are `rounded-xl` rectangles with a sweep-fill hover
  and an arrow chip (`src/components/ui/button.tsx`). Nothing interactive is a full pill. The primary button is brand navy on
  light surfaces (sweeping to royal blue on hover) and orange on navy bands (`--cta` / `--cta-sweep` tokens).
- **Type**: Ubuntu (medium weight) for headings, **Outfit** for everything else, both self-hosted via Fontsource. Calm by design:
  no all-caps labels, no heavy weights, soft tinted icon tiles instead of saturated blocks.
- **Icons**: [Hugeicons](https://hugeicons.com) only (`@hugeicons/react` + `@hugeicons/core-free-icons`), rendered through `<HugeIcon/>` /
  `<Icon name="…"/>`. Add new content icons to `IconKey` in `site-content.ts` and the map in `src/components/ui/icon.tsx`.
- **Layout**: one `container` (Tailwind's, with the gutter defined in `src/index.css`) and fractional widths (`lg:w-2/3`); no `max-w-*`.
- **Imagery**: every inner page has its own monochrome Unsplash photo under a solid navy layer (`<PageHero/>`, chosen in
  `pageHeroImages` / `Service.heroImage`). Photo sources are listed in `assets-src/photos/CREDITS.md`. Icons are the
  trimmed 3D renders, shown large.
- **Tokens** live in [`src/index.css`](src/index.css) with Tailwind 4 `@theme` (brand ramps `navy-*` / `royal-*`, radii, fluid type
  scale) and semantic colours (`surface`, `ink`, `line`, `cta`, …). Those are CSS variables, so dark mode and the always-navy
  bands (`<Section tone="dark">`) are a variable swap, not duplicated styles.

### How "dynamic" is built (and how it stays fast)
- **Live 3D**: a procedural WebGL city in the hero and an orbit scene in the CTA band. The hero scene starts by itself about
  2 seconds after the page has loaded (no interaction needed) and fades in. There is deliberately **no static picture** standing in
  for it: the hero keeps its space empty until the city has drawn, and when 3D can never run (software-rendered WebGL,
  `prefers-reduced-motion`, Data Saver) the empty column collapses and the text takes the full width. The CTA scene loads only
  once you scroll near it (a flat CSS ring stays if 3D is unavailable). Scenes pause when off-screen. Append `?3d=force` or
  `?3d=off` to any URL to override.
- **Light interaction**: pointer-tilt cards and parallax tiles are CSS-driven; the technology orbit and the portfolio carousel
  each run a single loop/timer, only while on screen. The carousel advances every 5 s, ignores mouse hover, holds for 8 s after
  a touch, click or key press, and never autoplays for reduced motion.
- **Prerender + hydrate**: every route ships as real HTML, so content paints before JavaScript and crawlers see the page.
  The app bundle starts after the first contentful paint, and below-the-fold sections hydrate in their own time slices.

### Consent
`index.html` keeps the Google tag (AW-18076900674) but only *loads* the library after the visitor clicks **Accept**
(Consent Mode defaults to denied). "Cookie settings" in the footer reopens the choice.

## Deploying
Any static host. Serve `dist/`, mapping `/path` → `path/index.html`, and serve `404.html` with status 404 for unknown
URLs (Netlify, Cloudflare Pages, Vercel and nginx `try_files $uri $uri/index.html =404` all do this). Enable gzip/brotli.
Set `site.url` in `site-content.ts` to the production origin (it drives canonical URLs, Open Graph and the sitemap).
