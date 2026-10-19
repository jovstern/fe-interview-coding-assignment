# Image Viewer — design spec

The brief is `README.md`. Design source: `fe-interview-coding-assignment.pdf` (3 mobile
frames, 390 × 844: home, details with the sheet expanded, details with the sheet collapsed).
The Figma file is view-only for this account, so the Figma MCP could not read it; the tokens
below were measured from the PDF (text layer for sizes, rendered pixels for colours).

## Requirements checklist

- [ ] R1 Home: "a grid of photo thumbnails. Click or tap one to open its details page"
- [ ] R2 Details: "the full photo and its info, with related thumbnails at the bottom. Click one to load that photo"
- [ ] R3 State: "Keep server data … separate from UI state, and avoid duplicating one in the other. Don't edit or change `/external-server`"
- [ ] R4 Aesthetics: "spacing, typography, color and visual polish" (match the PDF)
- [ ] R5 Attention to detail: "alignment, hover and focus states, and consistent styling"
- [ ] R6 Clean code: "no dead code or leftovers"
- [ ] R7 Structure: "sensible components, files and folders"
- [ ] R8 UX: "loading, error and empty states … feel smooth"
- [ ] R9 Responsiveness: "mobile and desktop"
- [ ] R10 Accessibility: "alt text … works with a keyboard"
- [ ] R11 Performance: "load images sensibly and avoid unnecessary re-renders"
- [ ] R12 Type safety: "avoid `any`"
- [ ] R13 Nice to have: "Shareability"
- [ ] R14 Nice to have: "Desktop ready"
- [ ] R15 (design) Filter chips work, as a URL param (user's answer)
- [ ] R16 (design) The details sheet collapses/expands with a toggle button (user's answer)
- [ ] R17 (design) Follow toggles locally (user's answer; the API has no write endpoint)

## Decisions (from the questions)

- Filters: `/?filter=<id>` filters the feed on the server by `item.tags`; "For you" = no param.
- Sheet: the handle is a `<button aria-expanded>` that collapses the sheet to show the full
  photo (PDF page 3). Local `useState`. No drag.
- Desktop: home grid grows to 3–4 columns in a centred max-width; details becomes a split
  view (photo left, info panel right).
- Follow: a client leaf keeps only `toggled: boolean`; shown state is derived
  `isFollowing !== toggled`, so the API value is never copied into state. Resets per photo
  (`key`), lost on reload (stated in the UI's README).

## Assumptions

- Font: the design is set in Inter; `next/font/google` Inter replaces the starter's Geist.
- Greeting: "Good morning / afternoon / evening" from the request time on the server (the
  home page is dynamic because of `searchParams`), in the server's time zone.
- Home grid is a CSS multi-column masonry (`columns`, `break-inside: avoid`), DOM in API
  order: keyboard order follows each visual column top to bottom. Cost: on mobile the
  left column holds items 1–4 instead of the PDF's alternating 1/3/5/7.
- Unknown `?filter=` value: empty state with a link back to all photos (the URL stays the
  truth; nothing is silently rewritten). Same empty state if the feed has no items.
- The back button is a `<Link href="/">`; browser Back keeps the filtered URL.
- Related thumbnails only carry `id` + `thumbnailUrl`; their alt text ("Soft Morning by
  Noah Williams") comes from the home feed, read on the server alongside the photo.
- Shareability: every view is a URL; details pages get Open Graph metadata.
- Caching: Cache Components stays off (the starter's config); API reads use
  `fetch(url, { next: { revalidate: 3600 } })` because the data is static mock data. Pages
  are dynamic (they read `searchParams` / `params`), so the build never needs the API.
- No blur data from the API: image frames reserve space with `aspect-ratio` from the API's
  width/height and show `--color-placeholder` until the image paints.
- The empty `src/app/api/` folder and the starter's placeholder page are removed.

## API (external-server, read-only, no CORS, no delays)

```ts
type Image = { url: string; width: number; height: number };
type HomeResponse = {
  user: { id: string; name: string; avatarUrl: string };
  headline: string; subheadline: string;
  filters: { id: string; label: string; active: boolean }[]; // for-you | coast | architecture
  items: { id: string; title: string; author: { id: string; name: string }; image: Image; tags: string[] }[];
  pagination: { total: number; nextCursor: string | null };
};
type PhotoResponse = {
  id: string; position: number; total: number; title: string; category: string;
  badges: string[]; image: Image; description: string;
  author: { id: string; name: string; role: string; city: string; avatarUrl: string; isFollowing: boolean };
  details: { location: { city: string; country: string }; lensMm: number; aperture: number; capturedAt: string };
  tags: string[]; related: { id: string; thumbnailUrl: string }[]; // 240×240
};
// GET /api/home → HomeResponse; GET /api/photo/:id → PhotoResponse | 404 { message }
```

Images are on `picsum.photos` (redirects to `fastly.picsum.photos`; `next/image` follows it).

## Routes

| Route | Reads | Writes / UI state |
|---|---|---|
| `/` (`?filter=`) | `getHome()` in the page (Server Component); filtered with `filterItems(items, filter)` | URL only: chips are `<Link>`s |
| `/photos/[id]` | `Promise.all([getPhoto(id), getHome()])` in the page; `generateMetadata` reuses the same deduped fetches | Sheet collapsed (`useState`, sheet toggle leaf); Follow toggled (`useState`, follow leaf) |

`getPhoto` returns `null` on 404 → `notFound()`; other failures throw → `error.tsx`.

## Design tokens (CSS custom properties in `globals.css`)

Colours: `--color-bg #FBFAF8`, `--color-surface #FFFFFF`, `--color-ink #2D2F3A`,
`--color-muted #878C98`, `--color-subtle #B7BAC2` (second eyebrow), `--color-border #EDECE9`,
`--color-accent #F15E7F`, `--color-accent-soft #FDF4F6` (Follow bg),
`--color-icon-bg #F3F5F9` (meta icon circles), `--color-placeholder #EFEDEA`,
`--color-overlay rgba(30, 30, 34, 0.45)` (counter pill), `--color-glass rgba(255,255,255,0.18)`
+ `--color-glass-border rgba(255,255,255,0.45)` (back button),
`--shadow-card 0 1px 2px rgba(45,47,58,.04), 0 6px 18px rgba(45,47,58,.06)`.

Type (Inter, px at the 390 frame): greeting 11 muted; user name 14; headline 27/1.15 with an
accent full stop; subheadline 13/1.5 muted; chip 12; card title 14; card author 11 muted;
counter 12 semibold; eyebrow 10 uppercase, letter-spacing .04em (category accent, badge
subtle, separated by a 4px accent dot); details title 29/1.1; author name 13; role · city 11
muted; Follow 11 accent; description 13/1.55 muted; meta value 12 ink, meta label 10 muted;
tag 10 muted. Desktop steps headline to 40, details title to 36.

Spacing and shape: page gutter 20 (details 22); grid gap 16; card radius 16, caption
padding 12 12 14; chip height 34, padding 0 16, radius 999, gap 8; avatar 36 (home, 2px
white ring) and 42 (details); back button 42 circle at top 54 / left 20; counter pill 32 high,
padding 0 12, radius 999; sheet radius 28 top corners, starts at ~46% of the viewport,
handle 40 × 4 radius 2 `--color-border`; divider 1px border; meta: 4 equal columns, icon
circle 34; tags height 26 radius 999 1px border; related thumbs 78 square, radius 14, gap 8,
horizontal scroll. Collapsed sheet shows handle + eyebrow + title (~92px). Breakpoints:
`640px` (3 columns), `1024px` (4 columns, details split view, panel 440 wide), content max
width 1200.

Interaction: cards lift 2px with a stronger shadow and the image scales 1.03 on hover;
`:focus-visible` = 2px accent outline, 2px offset, everywhere; transitions 200ms ease, none
under `prefers-reduced-motion`.

## Out of scope

Cut for time (1.5 hours total): previous/next photo + arrow keys, a Share button. Also out:
pagination (`nextCursor` is null), persisting Follow, drag gestures on the sheet, user
profile pages, author links, search, a database.
