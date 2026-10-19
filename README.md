# Image Viewer

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
