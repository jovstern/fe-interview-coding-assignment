# fe-interview-coding-assignment

A timed live interview assignment: the image viewer described in `README.md` (the
interviewer's brief; read it first, it is the requirements list). Built with `/task`. The
spec and plan live in `docs/superpowers/`.

@AGENTS.md

## Commands

- `npm run dev:all` — the app at http://localhost:3000 plus the external API at
  http://localhost:4000 (docs: http://localhost:4000/api/docs, spec: `/api/openapi.json`)
- `npm run check` — format check (`src`, `e2e`; the interviewer's `external-server` is not ours to format), lint, typecheck, unit tests, build
- `npm run e2e` — browser tests (recorded; starts the external server itself if needed)
- Format with `npx prettier --write src e2e` — never `npm run format`, which rewrites
  `external-server/`.

## The assignment's ground rules

- **`external-server/` is read-only.** Never edit, format or add files there; Claude's
  settings deny it. Use the API exactly as it is. Read `external-server/src/*.ts` and the
  OpenAPI doc to learn the data shapes, delays and error cases.
- **No database.** All data comes from the external API.
- The interviewer's starter decides the tooling: Next.js 16.3 in `src/`, **CSS Modules**
  (no Tailwind), their Prettier config (organize-imports, css-order), their ESLint config,
  SVG icons in `public/icons` importable as components through SVGR. Keep their files'
  style; do not add libraries without a reason in the plan.
- **Design:** the Figma MCP (`figma`) reads the file linked in the README: in `/task`'s
  first step, pull the design context and variables (colours, type, spacing) of the home
  and details frames once, and save them in the spec; the free plan allows only a few calls,
  so never call it again after that. Also the PDF export `fe-interview-coding-assignment.pdf`
  (3 pages) can be read directly and is the source for layout, spacing, colours and
  typography. Match it closely; the brief grades aesthetics and attention to detail.
- The brief grades: state (server data separate from UI state, no duplication),
  aesthetics, details (hover/focus, alignment), clean code (no dead code or leftovers),
  structure, UX (loading/error/empty states), responsiveness, accessibility (alt text,
  keyboard), performance (images, re-renders), type safety (no `any`), shareability and
  desktop readiness. The plan maps every one of these to work.

## How work happens

- `/task` runs the whole job in one session (plan on Opus, build coordinated on Sonnet,
  optional `/compact` at a merge): questions, spec and plan, then one milestone at a time.
  Each milestone is a branch `mN-<slug>` and a pull request on
  `jovstern/fe-interview-coding-assignment` with a review section and a demo GIF. **The
  user merges every PR; Claude waits for the merge before starting the next milestone.**
- Superpowers preferences for this project (they override the skills' defaults):
  - Brainstorming: one round of up to 8 questions, then one approval of spec and plan
    together.
  - No git worktrees: work in place on the milestone branch; one commit per task.
  - Subagent-driven development runs one milestone's tasks without stopping, then the
    milestone review on Opus.
  - When finishing a milestone, do not show the merge/PR menu: always push and open the PR,
    then stop.
- `gh` is logged in as `jovstern`.

## Hard rules

- Follow `.claude/skills/stack-conventions/SKILL.md` and
  `.claude/skills/quality-gates/SKILL.md`.
- Never push to `main` or merge a PR. Never bypass a hook or check; never skip or delete a
  failing test.
- Ask before changing the interviewer's lint, TypeScript, Prettier or Next.js configuration.
