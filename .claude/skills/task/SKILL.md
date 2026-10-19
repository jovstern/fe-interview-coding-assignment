---
name: task
description: Build a timed assignment end to end in this one session - read the assignment, ask one batch of questions, get one approval on a spec and plan, build it milestone by milestone with Superpowers subagents, each ending in a reviewed PR with a demo GIF that the user merges, and finish with a README. Optimised for speed and quality within one Pro usage window.
argument-hint: "[assignment text, file path or URL]"
disable-model-invocation: true
---

# /task

Live, timed work (about 2–3 hours). Quality and wall-clock time come first, within one Pro
usage window (about $50 API-equivalent; the dry run measured it). Everything happens in
**this one session**, never `/clear`ed:
- questions, spec and plan with the main session on **Opus**;
- the build with the main session on **Sonnet** (it only coordinates; the user switches
  after approving the plan), while builders and the milestone review stay on Opus;
- `/compact` at a merge is the user's option: they run it only if `/usage` says the window is
  getting tight.

No GitHub issues. The user stays in control through one approval of the plan and by merging
each milestone's pull request (repo: `jovstern/fe-interview-coding-assignment`, `main` is protected).

The interviewer's starter is in place (Next.js in `src/`, CSS Modules, an external API in `external-server/` that must not be changed); tests and gates were added on top. Read `CLAUDE.md`,
`.claude/skills/stack-conventions/SKILL.md` and `.claude/skills/quality-gates/SKILL.md` first.

## 0. Resume check (always first)

If `docs/superpowers/plans/task.md` exists on any branch (`git log --all -- docs/superpowers/plans/task.md`),
this is a resumed run, not a new one: do not ask the questions again.
1. Read the spec and plan (from the newest milestone branch if `main` lacks them), `gh pr list
   --state all`, and the ledger under `.superpowers/sdd/` if present.
2. Work out where things stand: the last merged milestone, an open PR (then wait or handle
   its comments), or a milestone branch with tasks done (then continue with the first task
   the ledger does not mark complete).
3. Tell the user in 3 lines where you are resuming, then continue from there.

## 1. Start (2 minutes)

1. Start `npm run dev:all` in the background (app on :3000, API on :4000) so the user can
   watch the app as it grows. Reuse them if already running.
2. The assignment is `README.md` (plus anything in `$ARGUMENTS`). Read it, the API
   (`external-server/src/*.ts`, `curl localhost:4000/api/openapi.json`, one real response
   from each endpoint) and the design: read all 3 pages of
   `fe-interview-coding-assignment.pdf`, and any screenshots the user pastes. Write down the
   design tokens you see (colours, type sizes, spacing, radii, breakpoints) for the spec.
3. Follow the starter's structure and tooling wherever it conflicts with ours; keep our
   rules for everything else.

## 2. One round of questions (target: under 8 minutes of the user's time)

Read the assignment twice. List every requirement as a checklist (quote the assignment's
words). Then ask **at most 8 questions**, only those whose answer changes what gets built.
The tool takes 4 per call, so use one `AskUserQuestion` call for up to 4 questions, or two
calls back to back for 5–8 (most important first). Ask fewer when fewer matter. Each question puts your recommended option first. Typical
ones: what to cut if time runs short, ambiguous requirements, whether to rename the GitHub
repo to match the assignment (`gh repo rename`). Everything else: decide, and list it as an
assumption.

There is no database: never add one. Typical questions here: which design details are
ambiguous in the PDF (ask with a screenshot reference), what to cut if time runs short,
whether the nice-to-haves (shareability, desktop) go in a milestone or the polish.

## 3. Spec and plan, one approval (target: 15 minutes)

Use `superpowers:brainstorming` (architectural path) and `superpowers:writing-plans` with
these project overrides, which take precedence over their defaults:

- No more questions and no section-by-section approval: the batch above was the questions.
- Write the spec to `docs/superpowers/specs/task-design.md`, short: requirements checklist,
  assumptions, the API's data shapes, routes, design tokens, and for each screen how it reads data and how it writes
  (from `stack-conventions`), and what is out of scope.
- Write the plan to `docs/superpowers/plans/task.md`, split into **milestones** (M1, M2, …).
  M1 is the thinnest end-to-end version of the core flow (home grid from the real API →
  details page → related photo, one e2e test), done in about the first hour. Later milestones add the remaining requirements in
  priority order; the last is polish (loading/error/empty states, accessibility, README).
  Each milestone has at most 6 tasks, ends with the app working, and names the one user
  flow its demo GIF shows.
- Global Constraints repeat the stack rules that matter for this task, including the Data
  line per screen. Any `useReducer`, Route Handler, Context, Zustand, TanStack Query or
  TanStack Form needs a line naming where and why.
- Then show the user, in chat, a summary of at most 20 lines: requirements → milestones, the
  key decisions, and the assumptions. **Wait for one approval.** Their changes are applied
  directly, without a second full review round.

`main` is protected, so create the M1 branch first (`git switch -c m1-<slug>`) and commit the
spec and plan there (`docs: spec and plan`); they arrive on `main` with the first PR.

Then stop with exactly: "Plan committed. Switch the coordinator to Sonnet to save usage:
`/model` → Sonnet → `s` (this session only, no `/clear`), then say **go**." Builders and
reviews keep their own models, so this does not lower code quality.

## 4. Build, one milestone at a time

Use `superpowers:subagent-driven-development` on the plan, with these overrides:

- **Run it per milestone:** hand it only the current milestone's tasks. Each milestone is its
  own branch `mN-<slug>`, created from an up-to-date `main` (M1's already exists).
- **Models:** set the model explicitly on every dispatch: an omitted model inherits the
  session's Sonnet. Implementers on Opus, except Sonnet when the task text contains the
  complete code. Task reviewers and scoped re-reviews on Sonnet. The milestone review on
  Opus. Never Haiku.
- If the session is still on Opus when the build starts, remind the user once (one line:
  `/model` → Sonnet → `s`) and carry on; do not wait.
- Every implementer and reviewer brief carries, verbatim: "Follow
  `.claude/skills/stack-conventions/SKILL.md` and `.claude/skills/quality-gates/SKILL.md`.
  Data is read in Server Components through `src/app/lib/api.ts` from the external API,
  which is used as-is (`external-server/` is never edited); view state lives in the URL;
  server data is never copied into client state. Match the design in
  `fe-interview-coding-assignment.pdf`. A Route Handler proxy, `useEffect` fetch,
  client-side fetch, duplicated server data in state, `any`, missing alt/focus states, or
  dead code is an Important finding."
- One commit per task on the milestone branch. No worktrees.
- **Progress:** after each task completes, post one line: `M<N> task <k>/<total> done —
  <what>; about <minutes> min to the PR`. Nothing more between tasks.

### End of each milestone: review, GIF, PR, wait

1. **Review:** the milestone's whole-diff review on Opus, using Superpowers' final-review
   step (`requesting-code-review`'s `code-reviewer.md`) on `git merge-base main HEAD..HEAD`,
   pointed at the ledger's deferred minors. One fix dispatch for its findings, one scoped
   re-review.
2. **Gates:** both gates from `quality-gates` green.
3. **Demo:** the `pr-demo` skill with the milestone number, recording the flow the plan names.
4. **PR:** push the branch and `gh pr create --base main --title "M<N>: <name>"` with this
   body (written to a temp file, `--body-file`):
   ```
   ## What you can do now
   <3–5 bullets, user-facing>

   ## Demo
   ![M<N> demo](<URL printed by make-demo.sh>)

   ## Review
   <the milestone review's verdict; each finding, how it was fixed or why it stands;
   minors left for later>

   ## Decisions made during the build
   <every "Ruling:" line from this milestone, with what it costs if wrong; "None" if empty>

   ## Checks
   <commands run and their results: npm run check, npm run e2e>

   ## Requirements covered
   <the spec's checklist items this milestone completes>
   ```
5. **Stop and wait.** Post at most 6 lines: the PR link, what to look at in the GIF, what
   to click at `localhost:3000`, time spent so far, what the next milestone is, and:
   "Reply **merged** when done (or leave PR comments). If `/usage` looks tight, run
   `/compact` first; the plan, progress log and PRs are on disk, so nothing is lost." Do not start the next
   milestone. While waiting, do nothing that changes files.
6. **When the user replies:** if the conversation was compacted, first re-read the plan's
   next milestone and the ledger under `.superpowers/sdd/` (as in the resume check). Then
   check `gh pr view <N> --json state,reviews,comments`.
   - Comments or requested changes → fix them on the same branch, rerun the gates, push,
     reply to each comment, update the PR body if the demo changed, and wait again.
   - `MERGED` → `git switch main && git pull --ff-only`, then start the next milestone.
   - Not merged and no comments → ask whether to wait or continue on top of it.

If time is running short (the user says so, or about 2 hours have passed), say so: the
current milestone ends cleanly with its PR, and the next one becomes the polish milestone.

## 5. Finish

The last milestone includes `README.md`: what it is, how to run it (`npm install`, `npm run dev:all`, tests), how it is built (data reads, caching, URL state, image loading), the
decisions and trade-offs with reasons, assumptions, the demo GIFs of each milestone, and what
you would do next with more time (leftover review minors go here). It ships through its PR
like every milestone.

After the last merge: final message with the requirement checklist (✅ / ❌ each), every
ruling made across milestones, and the links to the repo and each PR.
