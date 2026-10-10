# Performance Report — Muhammed Swalih P. Portfolio

## Phase 1: Baseline (before any fixes)

Build: `npm run build && npm run preview`

### Build Output — Baseline

| Asset | Raw | Gzip |
|---|---|---|
| `vendor-react.js` | 181.75 KB | 57.16 KB |
| `vendor-motion.js` | 142.06 KB | 46.72 KB |
| `index.js` (app) | 112.21 KB | 28.59 KB |
| `vendor-lenis.js` | 18.60 KB | 5.39 KB |
| `index.css` | 79.93 KB | 14.69 KB |
| **Total JS (gzip)** | — | **~138 KB** |

### Image Inventory (src/assets — all JPEG/JPG, none WebP)

| File | Size | Flag |
|---|---|---|
| `excel workshop.jpeg` | 334 KB | Over budget |
| `internship.jpeg` | 269 KB | Over budget |
| `school nss.jpeg` | 253 KB | Over budget |
| `useless project.jpg` | 224 KB | Over budget |
| `hackathon.jpg` | 156 KB | Over budget |
| `indrustrial visit.jpg` | 163 KB | Over budget |
| `plus two group photo.jpeg` | 137 KB | Over budget |
| `a rainy day.jpeg` | 95 KB | OK |
| `laptop.jpeg` | 52 KB | OK |

### Public Folder Images

| File | Size | Flag |
|---|---|---|
| `myphoto.jpeg` | 376 KB | LCP image — over budget! |
| `cammapphoto.png` | 472 KB | Over budget, wrong format |
| `myphoto.webp` | 135 KB | Exists but not used |
| `myphoto-sm.webp` | 56 KB | Good — use for srcset |
| `cammapphoto.webp` | 47.6 KB | Exists but not referenced |

Total image transfer on first load (mobile, worst-case): ~2.2 MB

### Ranked Causes of Jank / Slow Load

1. **Images** — All polaroid photos are unoptimized JPEG/JPG imported into JS bundle. Hero serves 376 KB JPEG even though 135 KB WebP exists. No `srcset`. No `width`/`height` on most images (CLS).
2. **No code splitting** — All sections, HeroChat, Lightbox, DoodleStrip, PhotoBooth load in the initial bundle. HeroChat initializes a setInterval prompt rotation on mount even when chat is closed.
3. **Full Framer Motion bundle** — 46.7 KB gzip. `layout` prop on PhotoBooth wall grid + cells triggers expensive layout animations on shuffle. Animated `filter: grayscale/sepia/blur` on every polaroid entry forces rasterization.
4. **SVG roughen filters** — `filter="url(#roughen-scene)"` on ~15 path elements in About SVG scene, plus a roughen filter on the animated trail path. Each filtered element = GPU texture.
5. **Google Fonts** — 4 families (Inter weights 300–900, Newsreader, JetBrains Mono, Caveat) loaded from Google CDN. No font preloads. No subsetting.
6. **Infinite animations not paused off-screen** — Mobile pile breathing animation, chat trigger scribble animation both run with `repeat: Infinity` regardless of viewport position.
7. **backdrop-filter: blur(8px)** — Applied to navbar every scroll event; creates compositor stacking context on entire viewport width.
8. **No vercel.json** — No immutable caching headers for hashed assets, no security headers.
9. **Work section** — `cammapphoto.png` (472 KB) served instead of the existing `cammapphoto.webp` (47.6 KB).
10. **Navbar scroll handler** — Two `setState` calls per scroll event (setIsScrolled + setActiveSection).

---

## Phase 2: Fixes Applied

*(To be filled after optimizations — see sections A through G)*

---

## Phase 3: After-Fix Metrics

*(To be filled after rebuild and Lighthouse)*

---

## Acceptance Checklist

- [ ] Lighthouse mobile Performance 90+, LCP under 2.5s, CLS under 0.1, TBT under 200ms
- [ ] Photos converted to WebP with responsive sizes, nothing below the fold loads eagerly
- [ ] Heavy sections, lightbox and AI chat lazy loaded, initial JS small
- [ ] SVG filters not causing scroll jank; animations only transform/opacity, pause off-screen
- [ ] Scrolling smooth on 4x CPU slowdown profile
- [ ] Fonts load without layout jump, caching headers set
- [ ] Design and features unchanged (or changes listed)
- [ ] `PERFORMANCE.md` and `npm run optimize-images` exist
- [ ] Lint and build pass, no console errors
