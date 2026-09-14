# Ezers & Strategies

Marketing site for Ezers & Strategies — a creative agency operating out of
Nigeria and Canada since 2012.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lenis

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # must pass clean; this is also the Vercel gate
npm run lint
```

## Adding real content

All copy and imagery lives in `src/data/` — no component edits needed.

| File | Holds |
| --- | --- |
| `src/data/site.ts` | Phone numbers, email, locations, headline stats, nav |
| `src/data/work.ts` | Case studies (also generates `/work/[slug]` pages) |
| `src/data/team.ts` | People |
| `src/data/clients.ts` | Client list for the logo marquee |
| `src/data/services.ts` | The four disciplines |

**Images.** Every item names an image path, e.g. `/work/kitchen-affairs.jpg`.
Until a file exists at that path in `public/`, the site renders a flat brand
colour field carrying the item's name — deliberate-looking, not broken. Drop
the real file in at exactly that path and it takes over; `hasAsset()` in
`src/lib/media.ts` resolves this on the server at build time.

Suggested aspect ratios: work `portrait` 4:5, `landscape` 16:10, `square` 1:1;
team portraits 4:5. Client logos are optional — pass a `logo` path to use an
image, or leave it out and the marquee typesets the name instead.

## Design system

Tokens live in `src/app/globals.css` under `@theme`. The palette comes from the
three logo variants, with blue leading.

`--color-blue` and `--color-pink` are the true brand values, used for the mark
and for accents on the paper background. `--color-blue-deep` and
`--color-pink-deep` are slightly darkened panel tints — the deepest values that
still clear WCAG AA for white body text — and are what full-bleed sections use.
`src/lib/colors.ts` routes each case to the right one; `panelBg` is the map for
any full-bleed panel. Green, orange and yellow panels take ink text.

The logo is drawn as inline SVG in `src/components/Logo.tsx` so it recolours per
section; `onDark` flips disc and pills for use on a coloured panel.

## Motion

`MotionConfig reducedMotion="user"` in `src/components/MotionProvider.tsx`
handles every enter animation. Anything that swaps markup or drives a frame loop
— the pinned services sequence, the marquee, the magnetic buttons — uses
`useCalmMotion()` (`src/lib/useCalmMotion.ts`) instead, which reports `false`
during hydration so the first client paint matches the server HTML. Do not call
`useReducedMotion()` directly during render; that is what caused a hydration
mismatch previously.

With motion reduced, the site drops smooth scroll, the
section pinning and all scroll-linked transforms, and reads as a plain
scrolling page.

## Contact form

`src/app/api/contact/route.ts` validates the submission and logs it. Swap the
`console.info` for a transactional email provider (Resend, Postmark) once one is
chosen. The contact section also offers `mailto:` links, so nothing is dead in
the meantime.

## Deployment

Vercel, standard Next.js build. Set the production domain in `site.url`
(`src/data/site.ts`) — it feeds metadata, `sitemap.xml` and `robots.txt`.
