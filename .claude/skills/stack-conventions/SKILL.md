---
name: stack-conventions
description: Required Next.js patterns for this project, from the official Next.js Learn course (nextjs.org/learn/dashboard-app), adapted to an external read-only API and CSS Modules - Server Components fetch the API directly, URL state, Suspense streaming, error.tsx/notFound, next/image. Read before writing a plan, writing code, or reviewing code.
---

# Stack conventions

These follow the official Next.js Learn course (`nextjs.org/learn/dashboard-app`), adapted
to this assignment: the data comes from an external API (`external-server/`, read-only), not
a database. They are rules: a plan, change or review that breaks one is wrong even if it
works. If one truly cannot apply, say so in the plan with the reason.

**Next.js is newer than your training data.** Before using a Next.js API, config option or
file convention, read the matching guide in `node_modules/next/dist/docs/` (see
`AGENTS.md`). When `next build` or `next dev` prints an error with named fixes, apply it.

## Stack (the interviewer's starter decides)

Next.js 16.3 App Router in `src/`, TypeScript strict, React 19 with the React Compiler,
**CSS Modules** (`*.module.css` next to the component; shared tokens as CSS custom
properties in `globals.css`), `next/font` (Geist is set up), `next/image`, SVG icons from
`public/icons` imported as React components (SVGR is configured). Radix (`radix-ui`) only
if an interactive primitive is really needed (dialog, tooltip). Zod only to validate API
responses if the plan says why. Nothing else without a reason in the plan.

## Structure

```
src/app/
  lib/api.ts           every call to the external API (one async function per endpoint)
  lib/definitions.ts   TypeScript types for the API's data (from the OpenAPI doc)
  lib/utils.ts         pure helpers
  ui/<area>/*.tsx      components, kebab-case files, each with its own *.module.css
  ui/skeletons.tsx     loading skeletons
  <route>/page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx
```

Tests sit next to the file (`*.test.ts[x]`, Vitest); browser tests in `e2e/` (Playwright).

## Reading data: the external API, from the server

- **Fetch from Server Components** through `src/app/lib/api.ts`. The API has no CORS, and
  that is the point: the browser never calls it. No `useEffect` + `fetch`, no `useState`
  holding server data, no client data library, no Route Handler proxy in `src/app/api`.
- The base URL comes from one place (`process.env.API_URL ?? 'http://localhost:4000'`).
- Each function checks `res.ok`: a 404 returns `null` so the page calls `notFound()`;
  other failures throw a short message (the real error is logged), caught by `error.tsx`.
- Choose caching on purpose and say why in the plan (static mock data: caching is safe;
  read the installed caching docs for this Next.js version before choosing).
- **Avoid waterfalls:** start independent requests together (`Promise.all`).
- **Stream:** a page-level `loading.tsx` with a skeleton that matches the real layout (no
  layout shift); move slow fetches into the component that needs them inside
  `<Suspense fallback={<…Skeleton />}>`.
- **Server data is never copied into client state.** Client components get what they need
  as props; derive, don't store.

## UI state

**State that describes what the user is looking at lives in the URL** (the photo id is a
route segment; any view option such as a filter or tab is a search param): shareable,
back/forward works, readable on the server. Client controls use `useSearchParams`,
`usePathname`, `useRouter().replace`; `<Link>` for navigation.

- Server Components by default. `'use client'` only on the smallest leaf that needs state,
  events or browser APIs.
- `useState` for purely local UI state (hover previews, an image's loaded flag). No
  `useReducer` unless the plan says why. Before adding state: can it be derived during
  render? Can it live in the URL? Is it server data (then it stays on the server)?
- No manual memoization (`useMemo`, `useCallback`, `memo`): the React Compiler does it.
  `useEffect` only to sync with something outside React.
- Context or Zustand only for client state shared across distant components, with a reason.

## Images and performance

- `next/image` for every photo, with real `width`/`height` (or `fill` + `sizes`) from the
  API, a meaningful `alt`, `sizes` matching the CSS grid, `priority`/`preload` only for the
  above-the-fold hero (read the installed `Image` docs: prop names changed in 16).
  Configure `images.remotePatterns` for the API's image host; that is an allowed change to
  `next.config.ts`, stated in the plan.
- Use the API's blur/placeholder data if it provides one; reserve space so nothing jumps.
- `<Link>` prefetches the details page; keep client JS small.

## Look and feel, accessibility

- Match the Figma/PDF: spacing scale, colours, type sizes, radii as CSS custom properties.
- Every interactive element: visible `:focus-visible` style, hover state, keyboard
  reachable in a sensible order, a real `<a>`/`<button>`. Images have descriptive `alt`.
  Semantic landmarks (`header`, `main`, `nav`), one `h1` per page.
- Responsive from 320 px to wide desktop; the grid reflows, nothing overflows.
- Respect `prefers-reduced-motion` for any transition.

## Navigation, errors, metadata

- `error.tsx` (client) per segment that fetches; use the prop the installed docs name (from
  Next.js 16.3 that is `retry`, not the course's `reset`). `notFound()` + `not-found.tsx`
  for an unknown photo id.
- Root `metadata` with `title: { template: '%s | <app>', default: '<app>' }`; the details
  page uses `generateMetadata` (title, description, Open Graph image) so a shared link
  previews well.

## TypeScript and code

No `any`, no `@ts-ignore`, no non-null `!` to silence the compiler. Types come from
`definitions.ts`. No dead code, commented-out code or leftovers (the brief grades it); the
starter's placeholder page and `page.module.css` are replaced, not left beside the real
ones. Never disable a lint rule without a comment giving the reason. Never skip or delete a
failing test.
