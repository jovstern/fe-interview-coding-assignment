# Image Viewer

## Solution

A photo feed and a photo details page built with Next.js (App Router), React Server
Components and CSS Modules, reading the provided external API as-is.

### How to run

```bash
npm install
npm run dev:all   # the app on http://localhost:3000 and the API on http://localhost:4000
npm run check     # format check, lint, typecheck, unit tests, build
npm run e2e       # Playwright browser tests (starts the API if needed)
```

The app reads the API from `API_URL` (optional, default `http://localhost:4000`).

### How it's built

- **Server data:** all reads happen in Server Components through `src/app/lib/api.ts`,
  with `revalidate: 3600`, because the API serves static mock data. Cache Components are
  off. Nothing from the server is copied into client state.
- **URL state:** the active collection is `/?filter=<id>` and a photo is `/photos/[id]`, so
  every view can be shared, bookmarked and restored with Back.
- **Client code:** two interactive client leaves (plus the error boundaries): the sheet
  toggle (collapses the details sheet on phones) and the Follow button.
- **Images:** `next/image` with the API's width and height (no layout shift), `sizes` per
  breakpoint, a preloaded hero on the details page and eager loading for the first two
  cards.
- **States:** skeletons that mirror the real layout (`loading.tsx`), error boundaries with a
  retry, an empty-collection state and a not-found page for unknown photos.
- **Responsive:** 2 / 3 / 4 feed columns at 0 / 640 / 1024px; from 1024px the details page
  is a split view, the photo on the left and the details as a 440px panel on the right.

### Decisions and trade-offs

- **Masonry with CSS columns:** no JavaScript and no layout library. The DOM order stays the
  API's order (good for keyboard and screen readers), so columns fill top to bottom rather
  than in the PDF's alternating order.
- **Follow is local and not persisted:** the API has no write endpoint. The shown state is
  derived as `isFollowing !== toggled`, so the server value is never duplicated.
- **Soft 404:** `/photos/<unknown>` renders the not-found page with a 200 status and
  `noindex`, because `loading.tsx` starts streaming before the photo request answers.
- **Greeting:** "Good morning/afternoon/evening" uses the server's time zone.
- **Design tokens:** the Figma file was view-only, so colours, type and spacing were
  measured from the PDF export and a screenshot. The picsum images differ from the PDF's
  photos.
- **Chip contrast:** white on the accent (the 12px chips) is 3.2:1 as given by the design,
  and was left as designed.

### Assumptions

- The design is mobile-only; the tablet and desktop layouts extend it with the same tokens.
- The API's data is static, so an hour of caching is safe.

### Demos

![M1 demo](https://github.com/jovstern/fe-interview-coding-assignment/blob/pr-media/m01/demo.gif?raw=true)

![M2 demo](https://github.com/jovstern/fe-interview-coding-assignment/blob/pr-media/m02/demo.gif?raw=true)

### What's next

- Previous / next photo with the arrow keys, and a Share button (cut for time).
- Persisted Follow, once the API has a write endpoint.
- Pagination through `nextCursor`.
- A real 404 status, by checking the photo in a proxy before the page streams.
- A test for the details page when the feed request fails (the alt-text fallback).
- Tag and related rows in the photo skeleton.
- A drag gesture on the details sheet.

---

## The brief

A simple image viewing app.

## Features

- **Home page:** a grid of photo thumbnails. Click or tap one to open its details page.
- **Details page:** the full photo and its info, with related thumbnails at the bottom. Click one to load that photo.

## What we're looking for

- **State:** Keep server data (home feed, photo details) separate from UI state, and avoid duplicating one in the other. Don't edit or change `/external-server`.
- **Aesthetics:** it should look good. Care about spacing, typography, color and visual polish.
- **Attention to detail:** small things count, such as alignment, hover and focus states, and consistent styling.
- **Clean code:** readable, well-named and easy to follow, with no dead code or leftovers.
- **Structure:** sensible components, files and folders, with clear separation of concerns.
- **UX:** loading, error and empty states should be handled, and the app should feel smooth.
- **Responsiveness:** it should work well on both mobile and desktop.
- **Accessibility:** add alt text, and make sure it works with a keyboard.
- **Performance:** load images sensibly and avoid unnecessary re-renders.
- **Type safety:** use TypeScript properly, and avoid `any`.
- **Communication:** be ready to explain your decisions and trade-offs.

## Nice to have

- **Shareability**.
- **Desktop ready**.

## Design

[Figma design](https://www.figma.com/design/Qo0GSurREkYuEB4DtaZT2V/fe-interview-coding-assignment?node-id=0-1&p=f&t=GnCNbVzZBdghnVDv-0)

Local copies are also in the repo root:

- [fe-interview-coding-assignment.fig](fe-interview-coding-assignment.fig): Figma file
- [fe-interview-coding-assignment.pdf](fe-interview-coding-assignment.pdf): PDF export

## Installation

Install dependencies in both the root and the external server:

```bash
npm install
cd external-server && npm install
```

## Running

```bash
npm run dev:all
```

## API
Full documentation: [localhost:4000/api/docs](http://localhost:4000/api/docs)
