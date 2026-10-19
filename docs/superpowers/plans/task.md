# Image Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Run one milestone at a time; each milestone is a branch `mN-<slug>` and a PR.

**Goal:** The image viewer in `README.md`: a masonry home feed with URL filters, and a details page with the full photo, its info sheet and related photos, matching `fe-interview-coding-assignment.pdf`, responsive up to a desktop split view. Two milestones, 1.5 hours.

**Architecture:** Server Components read the external API through `src/app/lib/api.ts` (cached fetch, revalidate 3600). View state lives in the URL (`/?filter=`, `/photos/[id]`). Two tiny client leaves hold purely local UI state (sheet collapsed, follow toggled).

**Tech Stack:** Next.js 16.3 App Router, React 19 + React Compiler, TypeScript strict, CSS Modules, next/font (Inter), next/image, SVGR icons, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/task-design.md`

## Global Constraints

- Follow `.claude/skills/stack-conventions/SKILL.md` and `.claude/skills/quality-gates/SKILL.md`.
- `external-server/` is read-only; no database; no new dependencies.
- Data, Home: `src/app/page.tsx` (Server Component) awaits `getHome()` and `searchParams.filter`; it writes nothing; chips are `<Link>`s.
- Data, Details: `src/app/photos/[id]/page.tsx` awaits `Promise.all([getPhoto(id), getHome()])`; `generateMetadata` calls the same functions (fetch dedupes). Writes nothing to the server.
- UI state: sheet `collapsed` and follow `toggled` are `useState` in their own client leaf; nothing else is client state. No `useReducer`, Route Handler, Context, Zustand, TanStack Query or Form anywhere.
- Caching: Cache Components stays off; `fetch(url, { next: { revalidate: 3600 } })` (static mock data).
- `next.config.ts`: only add `images.remotePatterns: [new URL('https://picsum.photos/**')]` (allowed by stack-conventions). No other config change.
- Base URL: `process.env.API_URL ?? 'http://localhost:4000'`, in `api.ts` only.
- Tokens from the spec's "Design tokens" section live as CSS custom properties in `globals.css`; components use the variables, never raw hex.
- `next/image` for every photo/avatar with the API's width/height or `fill` + `sizes`; `preload` only for the details hero; `loading="eager"` for the first 2 home cards.
- Icons: `public/icons/*.svg` imported as React components through the starter's SVGR rule (relative import; add a `src/svg.d.ts` module declaration if TypeScript needs one), rendered `aria-hidden`. New icons go in `public/icons` in the same 16×16 stroke style.
- Every interactive element: real `<a>`/`<button>`, visible `:focus-visible` (2px accent outline, 2px offset), hover state; transitions disabled under `prefers-reduced-motion`.
- File naming: `src/app/ui/<area>/<kebab-name>.tsx` + `<kebab-name>.module.css`; tests next to files.
- Format with `npx prettier --write src e2e`, never `npm run format`.

## Review Focus

1. Unknown photo id (`/photos/nope`) → the not-found page, not the error page. Test: M1 Task 3 e2e.
2. Unknown filter (`/?filter=zzz`) → empty state with a link to all photos, no crash. Test: M2 Task 1 unit + e2e.
3. API down → `error.tsx` with a working "Try again", not a blank page. Test: M1 Task 1 unit (`getHome` throws), M1 Task 4 component test.
4. Navigating from one photo to a related one resets the sheet and follow state (keyed by photo id). Test: M2 Task 3 e2e step.
5. 320px viewport: nothing overflows horizontally (related row scrolls inside itself). Test: M2 Task 3 e2e (`scrollWidth <= clientWidth`).

---

## M1: Core flow (branch `m1-core-flow`, ~40 min)

Demo flow: home grid → click "Casa del Sol" → details page → click a related thumbnail → that photo loads.

### Task 1: Foundation (types, API client, helpers, tokens, font, config)

**Files:** Create `src/app/lib/definitions.ts`, `src/app/lib/api.ts`, `src/app/lib/api.test.ts`. Modify `src/app/globals.css`, `src/app/layout.tsx`, `next.config.ts`. Delete `src/app/page.module.css`, empty `src/app/api/`. Commit the `AGENTS.md` block `next dev` writes.

**Interfaces — Produces:**
- `definitions.ts`: `ApiImage`, `HomeResponse`, `FeedItem` (= `HomeResponse['items'][number]`), `Filter`, `PhotoResponse`, `RelatedPhoto`, exactly the spec's shapes.
- `api.ts`: `getHome(): Promise<HomeResponse>`; `getPhoto(id: string): Promise<PhotoResponse | null>` (404 → `null`; `encodeURIComponent(id)`). Non-OK otherwise: `console.error` the status + URL, throw `new Error('Could not load the feed')` / `'Could not load this photo'`.

- [ ] Step 1: tests in `api.test.ts` with `vi.stubGlobal('fetch', …)`: `getHome` returns parsed JSON and calls `http://localhost:4000/api/home` with `{ next: { revalidate: 3600 } }`; `getPhoto('p_001')` returns the body; `getPhoto('nope')` returns `null` on 404; `getHome` rejects with `'Could not load the feed'` on 500.
- [ ] Step 2: run `npx vitest run src/app/lib/api.test.ts` → FAIL.
- [ ] Step 3: implement `definitions.ts`, `api.ts`.
- [ ] Step 4: run → PASS.
- [ ] Step 5: `globals.css`: all spec tokens on `:root`, `body { background: var(--color-bg); color: var(--color-ink); font-family: var(--font-inter), system-ui, sans-serif }`, a global `:focus-visible` rule, a `prefers-reduced-motion` rule zeroing transitions. `layout.tsx`: Inter via `next/font/google` (`variable: '--font-inter'`), `metadata = { title: { template: '%s | Moments', default: 'Moments' }, description: 'A daily edit of warm places, quiet light and faraway details.', icons }`. `next.config.ts`: `images.remotePatterns` only.
- [ ] Step 6: helpers in `src/app/lib/utils.ts` (+ `utils.test.ts`), below.

**Helpers — Produces:** `greetingFor(date: Date): string` ('Good morning' 5–11h, 'Good afternoon' 12–17h, else 'Good evening'); `formatLens(mm: number): string` → `'35 mm'`; `formatAperture(f: number): string` → `'ƒ / 2.8'`; `formatCapturedAt(iso: string): string` → `"Jun '26"` (UTC, `Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })` + two-digit year); `photoAlt(item: { title: string; author: { name: string } }): string` → `'Casa del Sol by Elena Rossi'`.

- Tests with those exact values, plus boundaries `greetingFor` at 04:59 → evening, 05:00 → morning, 12:00 → afternoon, 18:00 → evening; `formatAperture(8)` → `'ƒ / 8'`.
- [ ] Step 7: FAIL → implement → PASS (`npx vitest run src/app/lib`).
- [ ] Step 8: `npm run lint && npm run typecheck`; commit `feat: API client, types, helpers and design tokens`.

### Task 2: Home page

**Files:** Replace `src/app/page.tsx`. Create `src/app/ui/home/greeting-header.tsx` (+css), `src/app/ui/home/feed-intro.tsx` (+css), `src/app/ui/home/photo-grid.tsx` (+css), `src/app/ui/home/photo-card.tsx` (+css), `photo-card.test.tsx`.

**Interfaces:** Consumes `getHome`, `greetingFor`, `photoAlt`. Produces `PhotoCard({ item, eager }: { item: FeedItem; eager: boolean })`, `PhotoGrid({ items }: { items: FeedItem[] })`.

- Layout per spec: `<header>` with avatar (36, white ring) + greeting + name; `<main>` with `<h1>` headline (accent `.` as a styled `<span aria-hidden>`; the h1's text stays the headline), subheadline `<p>`; grid as `<ul>` with CSS `columns: 2; column-gap: 16px`, `<li>` `break-inside: avoid; margin-bottom: 16px`. Card = one `<Link href={/photos/${id}}>` wrapping image + caption (title `<h2>` 14px, "by …" `<p>`). Image `width/height` from the API, `sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"`, `alt={photoAlt(item)}`, first two `loading="eager"`. Hover/focus per spec.
- [ ] Step 1: `photo-card.test.tsx`: renders a link to `/photos/p_001` named by the title, an img with alt `'Casa del Sol by Elena Rossi'`, and "by Elena Rossi". FAIL → implement → PASS.
- [ ] Step 2: build the page; check at http://localhost:3000 at 390px against PDF page 1.
- [ ] Step 3: lint, typecheck, prettier; commit `feat: home feed`.

### Task 3: Details page

**Files:** Create `src/app/photos/[id]/page.tsx`, `page.module.css`, `src/app/photos/[id]/not-found.tsx`; `src/app/ui/photo/photo-hero.tsx` (+css), `photo-sheet.tsx` (+css), `photo-meta.tsx` (+css), `related-photos.tsx` (+css), `related-photos.test.tsx`; `e2e/core-flow.spec.ts`. Delete `e2e/smoke.spec.ts` only if `core-flow.spec.ts` covers "home serves 200" (it does by visiting `/`).

**Interfaces:** Consumes `getPhoto`, `getHome`, formatters. Produces `RelatedPhotos({ related, feed }: { related: RelatedPhoto[]; feed: FeedItem[] })` (alt from the matching feed item via `photoAlt`, fallback `'Related photo'`), `PhotoSheet({ photo, children? })` laid out so M2 can wrap the handle.

- Page: `params` is a Promise (`PageProps<'/photos/[id]'>`); `Promise.all`; `null` → `notFound()`. `generateMetadata`: `title: photo.title`, `description`, `openGraph.images: [{ url, width, height }]`.
- Hero: `fill` image, `object-fit: cover`, `sizes="100vw"`, `preload`, alt `photoAlt`, fixed behind the sheet at full viewport height; back `<Link href="/" aria-label="Back to all photos">` (glass circle with a new `public/icons/icon-arrow-left.svg`); counter pill `<p aria-label="Photo 1 of 8">` with accent dot.
- Sheet (`<article>`): handle bar (decorative in M1), eyebrow (category · first badge), `<h1>` title, author row (avatar 42, name, "role · city"), description, divider, `PhotoMeta` 4-column `<dl>` with the 4 icons (map-pin/location, camera/lens, aperture, calendar/captured), tags `<ul>`, related row `<nav aria-label="Related photos">` with `<Link>` thumbs 78px (`sizes="78px"`).
- `not-found.tsx`: short message + link home, styled with tokens.
- [ ] Step 1: `related-photos.test.tsx`: links to `/photos/p_008` with alt `'Terracotta Rooftops by Elena Rossi'`; unknown id falls back to `'Related photo'`. FAIL → implement → PASS.
- [ ] Step 2: `e2e/core-flow.spec.ts` (mobile viewport 390×844, `waitForTimeout(1000)` after each visible step): visit `/` → heading "Moments worth keeping"; click link "Casa del Sol" → `getByRole('main')` heading level 1 "Casa del Sol", text "Positano"; click related link named "Terracotta Rooftops by Elena Rossi" → heading "Terracotta Rooftops". Second test: `/photos/nope` → 404 page text and a link home.
- [ ] Step 3: implement; check against PDF page 2 at 390px.
- [ ] Step 4: `npm run check`, `npm run e2e` → green; commit `feat: photo details page`.

### Task 4: Loading, error and not-found states

**Files:** Create `src/app/ui/skeletons.tsx` (+css, +test), `src/app/loading.tsx`, `src/app/photos/[id]/loading.tsx`, `src/app/error.tsx`, `src/app/photos/[id]/error.tsx`, `src/app/ui/error-state.tsx` (+css, +test). Restyle `src/app/photos/[id]/not-found.tsx` with `ErrorState`.

- `HomeSkeleton` mirrors header, headline, chips and 6 cards of varied heights; `PhotoSkeleton` mirrors hero + sheet. Same dimensions as the real layout (no shift); shimmer off under reduced motion; `aria-busy` on the container with a visually hidden "Loading…".
- [ ] Step 1: render test: `HomeSkeleton` has `aria-busy="true"` and the hidden label.

**Interfaces:** `ErrorState({ title, message, action }: { title: string; message: string; action: React.ReactNode })`. `error.tsx` files are `'use client'`, take `{ error, retry }` (Next 16.3 prop), log `error` in an effect, and render "Try again" → `retry()` plus a link home.

- [ ] Step 2: test: the root error component calls `retry` on "Try again". `npm run check`, `npm run e2e` → green; commit `feat: loading, error and not-found states`.

---

## M2: Interactions, desktop and README (branch `m2-interactions`)

Demo flow (390×844, then 1280×720): tap "Coast" → grid filters → open "Still Harbour" → tap Follow → collapse the sheet → expand it → resize to desktop: 4-column grid and split view.

### Task 1: Filter chips (URL state) and empty state

**Files:** Modify `src/app/lib/utils.ts` (+test), `src/app/page.tsx`. Create `src/app/ui/home/filter-chips.tsx` (+css, +test), `src/app/ui/home/empty-feed.tsx` (+css); `e2e/filters.spec.ts`.

**Interfaces — Produces:** `filterItems(items: FeedItem[], filter: string | undefined): FeedItem[]` (undefined or `'for-you'` → all; else items whose `tags` include it; unknown → `[]`); `FilterChips({ filters, activeId }: { filters: Filter[]; activeId: string })` → `<nav aria-label="Collections">` of `<Link scroll={false}>`s (`/` for for-you, `/?filter=<id>`), active has `aria-current="page"`. API `active` flags are ignored; the URL decides.

- [ ] Step 1: unit tests: `filterItems(items, 'coast')` → ids `p_001, p_005, p_007`; `'zzz'` → `[]`; `undefined` → all 8. Chips: active chip has `aria-current="page"`, "Coast" href `/?filter=coast`, "For you" href `/`. FAIL → implement → PASS.
- [ ] Step 2: page reads `searchParams.filter` (string only; arrays → first value); renders `EmptyFeed` ("Nothing here yet", link "Show all photos" → `/`) when the result is empty.
- [ ] Step 3: e2e: click "Coast" → URL `?filter=coast`, 3 cards; Back → 8 cards; `/?filter=zzz` → "Show all photos" link. Commit `feat: filter the feed by collection`.

### Task 2: Follow toggle

**Files:** Create `src/app/ui/photo/follow-button.tsx` (+css, +test); modify `photo-sheet.tsx`, `src/app/photos/[id]/page.tsx` (`key={photo.id}` on the sheet).

**Interfaces:** `FollowButton({ isFollowing, authorName }: { isFollowing: boolean; authorName: string })`, `'use client'`, `const [toggled, setToggled] = useState(false); const following = isFollowing !== toggled;` → `<button aria-pressed={following} aria-label={`Follow ${authorName}`}>` showing "Follow" / "Following" (Following: accent bg, white text).

- [ ] Step 1: tests: `isFollowing=false` → "Follow", pressed false; click → "Following", pressed true; `isFollowing=true` → "Following". FAIL → implement → PASS.
- [ ] Step 2: commit `feat: follow toggle`.

### Task 3: Collapsible sheet

**Files:** Create `src/app/ui/photo/sheet-toggle.tsx` (+css, +test); modify `photo-sheet.tsx`; `e2e/interactions.spec.ts` (the demo flow, incl. related navigation resets follow and sheet).

**Interfaces:** `SheetToggle({ children }: { children: React.ReactNode })`, `'use client'`, owns `collapsed` and renders the sheet container with `data-collapsed`, the handle `<button aria-expanded={!collapsed} aria-controls="photo-details" aria-label={collapsed ? 'Show photo details' : 'Show full photo'}>` and the server-rendered children. Collapsed: `transform: translateY(calc(100% - 92px))` (CSS var), 300ms ease, none under reduced motion; content below the title gets `inert` while collapsed.

- [ ] Step 1: tests: starts expanded (`aria-expanded=true`); click → false and children container `inert`; Enter key toggles back. FAIL → implement → PASS.
- [ ] Step 2: e2e demo flow from the milestone header + "open a related photo → Follow shows 'Follow' again, sheet expanded" + at 320px `document.documentElement.scrollWidth <= clientWidth` on `/` and `/photos/p_001`. Commit `feat: collapsible details sheet`.

### Task 4: Responsive home and desktop split view

**Files:** Modify home css modules and `src/app/page.tsx` layout container.

- Content max-width 1200 centred; gutter 20 → 32 at ≥640; grid `columns: 2` → 3 at 640 → 4 at 1024; headline 27 → 40 at 1024; header/intro aligned to the grid's edges.
- [ ] Step 1: e2e in `e2e/responsive.spec.ts`: at 1280 width the first and fourth card share a top offset ±1px (4 columns); at 390 two distinct column x-positions.

Details (`src/app/photos/[id]/page.module.css`, `photo-hero`, `photo-sheet`, `sheet-toggle` css):
- ≥1024: grid `1fr 440px`, height 100dvh; hero is a sticky panel, image `object-fit: contain` on `--color-ink`; the sheet becomes a scrolling right panel (no radius, no handle: the toggle button is `display: none` and never `inert`s content). Mobile unchanged.
- [ ] Step 2: e2e: at 1280 the handle button is hidden and the photo's box is left of the title's box. Both in `e2e/responsive.spec.ts`; commit `feat: responsive layout and desktop split view`.

### Task 5: README and detail pass

**Files:** Modify `README.md` (keep the brief's sections; add a "Solution" part above them).

- Detail pass first: skip link to `main`, hover/focus on every control, contrast of `--color-muted` on `--color-bg` ≥ 4.5:1 (darken if not).
- What it is; how to run (`npm install`, `npm run dev:all`, `npm run check`, `npm run e2e`); how it's built (server reads, caching, URL state, the two client leaves, image loading); decisions and trade-offs (incl. masonry order, Follow not persisted, Figma MCP unavailable → PDF measured); assumptions; the demo GIFs of M1–M2; what's next (leftover review minors). Run both gates; commit `docs: README`.

## Cut for time (user: 1.5 hours total)

Previous/next + arrow keys and the Share button (Open Graph metadata stays, so links still preview). Listed in the README's "what's next".
