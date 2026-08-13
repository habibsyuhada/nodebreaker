# NODEBREAKER — Progress & Plan

Pixel-art hacking puzzle game, mobile-portrait PWA. No backend, no login — all
state in `localStorage`, everything visual/audio generated from code (no
external image/audio assets).

Full original design brief (Indonesian) is preserved at the bottom of this
file for reference. This top section tracks what's actually built.

## Key decisions already made (don't re-ask)

- **UI language: English.** The design brief is in Indonesian but all in-game
  text, labels, and code comments are English.
- **Package manager: npm.**
- **Project root:** the repo root IS the Vite project (no subfolder).
- **Fake IP convention:** LAN-flavored nodes use private ranges
  (`192.168.x.x`); internet-facing nodes use documentation-safe TEST-NET
  ranges (`203.0.113.x`, `198.51.100.x`, `192.0.2.x`) — never real-looking
  public IPs.
- **Tailwind v4**, not v3 — uses `@theme` tokens in `src/index.css` (not a
  `tailwind.config.js` color palette). Custom tokens (`--color-accent`,
  `--color-warn`, `--color-bg`, `--color-panel`, `--color-text*`, etc.)
  auto-generate utilities like `bg-accent`, `text-warn`, `border-border`.
- **Lint:** `oxlint`, not eslint (`npm run lint`). Type-check via
  `npx tsc -b --noEmit`.
- **Dev server preview:** `.claude/launch.json` is configured for the
  `Browser` tool (`preview_start` with name `nodebreaker-dev`, port 5173).

## Architecture reference

```
src/
  art/            spriteEngine.ts (canvas renderer + <Sprite/>), sprites.ts
                  (16x16 grid sprite defs), icons.tsx (hand-drawn SVG rect-grid
                  icons for UI, e.g. tab bar)
  audio/          synth.ts — procedural Web Audio: beeps (clue/combine
                  feedback) and noise-buffer bursts (typing tick, glitch,
                  ambient pulse). No audio files.
  engine/         nodeState.ts (filesystem nav + login check + keyword search
                  + shortNodeLabel), clueSystem.ts (clue types incl. node
                  origin, [[type:value|label]] markup parser, dedup),
                  combineRules.ts (Workbench recipes), transformRules.ts
                  (single-input decode/crack/leak-check recipes), traceSystem.ts
                  (trace constants + ambient log thresholds)
  levels/         types.ts (LevelDef/LevelNodeDef/FileEntry/FileCompareDef/
                  PivotDef/HoneypotDef/PrivilegeEscalationDef/
                  LogFalsificationDef/BackdoorDef/etc.), level01-08.ts,
                  index.ts (LEVELS array — all 8 levels registered)
  panels/         Terminal.tsx, FileBrowser.tsx (+ built-in search view),
                  ClueInventory.tsx, Workbench.tsx
  components/     StatusBar.tsx (also the Network Map's trigger on multi-node
                  levels), ActionBar.tsx, TabBar.tsx, HoldableText.tsx
                  (tap-hold-to-save-clue span, used by Terminal + FileBrowser),
                  BriefingDialog.tsx (per-level mission overlay, gates trace),
                  NotificationToast.tsx (self-dismissing toast stack for clue
                  saves + newly-unlocked actions), NetworkMap.tsx (pivot
                  navigation overlay for multi-node levels), NetworkMapHint.tsx
                  (one-time discovery nudge), LoginPicker.tsx (explicit
                  username/password clue picker, replaces auto-guess login)
  screens/        MainMenu.tsx, LevelSelect.tsx — top-level screens shown
                  before the game view (App.tsx's `screen` store field)
  store/          gameStore.ts — single Zustand store, all game state,
                  wrapped in zustand's persist middleware (localStorage)
App.tsx           screen switcher (menu/levels/game), panel switcher,
                  contextual ActionBar logic, breach/burned screens,
                  TraceTicker (passive trace interval), ActionNotifier
                  (diffs notable actions across panels for the toast)
public/icons/     PWA icon PNGs (192/512 any + maskable, apple-touch-icon),
                  rasterized from the existing LOCK_SPRITE — not hand-drawn
                  separately, see stage 10 notes
vite.config.ts    VitePWA plugin: manifest, service worker (generateSW),
                  runtime-caches Google Fonts so offline-after-first-load
                  covers fonts too, not just the app shell
```

### Core mechanics already implemented

- **Terminal**: typewriter-animated output (tap to skip), lines have a `tone`
  (input/output/success/warn/system). Content can embed clue markup.
- **File Browser**: breadcrumb navigation, tap folder to enter / tap file to
  open-and-read (reading IS the "baca file" action — no separate button).
  Built-in keyword search (`Search` action) with 6 tap-only preset chips
  (password/admin/key/backup/config/email) — **no free-text input anywhere
  in the game**, per the "minim ketik" design rule.
- **Clues**: any text can be marked holdable via `[[type:value|label]]` markup
  in a level's file/banner content. Tap-hold (550ms) saves it — haptic +
  procedural beep, dedup by type+value. 9 clue types: username, password,
  hash, pattern, email, path, version, encoded, token.
- **Workbench**: custom pointer-events drag-and-drop (not HTML5 DnD — needed
  for reliable touch behavior). Two slots, drag clues in, tap "Combine".
  Recipes live in `combineRules.ts` (currently just `username + pattern →
  password`). Invalid combos give gentle haptic+sound feedback, no penalty,
  slots just clear.
- **Login**: two mechanisms coexist on `LevelNodeDef`:
  - `quickLogin` (optional) — one-tap login once specific facts are
    discovered, for levels simple enough not to need real clue-matching
    (used by Level 1 only).
  - Generic clue-pair login (`attemptLogin` in the store) — tries every
    `username` clue × `password` clue in inventory against `node.users`.
    Used from Level 2 onward.
- **Trace system**: `node.traceEnabled` gates it. `TraceTicker` component
  ticks `+2%` every 5s via `tickTrace()` while a node is trace-enabled and
  the level isn't complete/burned. Ambient warning log lines auto-append at
  25/50/75/92%. Hitting 100% sets `burned: true` → distinct failure screen
  (separate from the success screen) with a Retry button.
- **Level completion model**: `accessGranted` (login succeeded) is distinct
  from `levelComplete` (`useLevelComplete()` hook — checks `accessGranted`
  AND all of `level.completionRequires` facts are in `discovered`). This is
  what lets Level 3 require "delete logs" *after* login before the level
  actually counts as done, without changing the login flow itself.
- **Recon/analysis actions already wired**: Scan Ports, List Users, Check
  Trace, Delete Logs (all contextual, appear in ActionBar based on state —
  see `useContextActions()` in `App.tsx`).

### Levels implemented (playable end-to-end, tested in-browser)

1. **Neighbor's Router** (`level01.ts`) — no trace. Read a note, tap
   quickLogin (admin/admin factory default).
2. **Online Storefront** (`level02.ts`) — no trace. Introduces keyword
   search, tap-hold clue saving, Workbench combine
   (username + pattern → password), generic login.
3. **Ledger & Co. Accounting** (`level03.ts`) — first trace level. Introduces
   List Users, Check Trace, Delete Logs, and the accessGranted/levelComplete
   split (must delete logs post-login to finish).
4. **Nimbus Startup** (`level04.ts`) — trace enabled. Introduces single-input
   clue transforms (Decode, Crack Hash) via tap-to-select in the Clue
   Inventory, and a "Compare Configs" recon action that diffs two files in
   the Terminal. Base64 comment in a source file decodes to the username;
   comparing old/new config reveals the rotated password hash; crack the
   hash for the password; login as usual.
5. **Riverside Health** (`level05.ts`) — first multi-node level (2 nodes).
   Public patient-portal node has no valid logins of its own; reading its
   `robots.txt` leaks the internal node's IP, and its staff contact page
   holds both a username and an email for the same person. Pivot to the
   internal node, run the email through Check Leak DB to recover the
   password (a reused one), then log in as usual — the credential clues
   carry over from the public node automatically since the Clue Inventory
   is level-wide, not per-node.
6. **Fleetline Logistics** (`level06.ts`) — trace enabled from the start.
   A too-tempting top-level folder (`payroll_export`) is a honeypot: tap-hold
   it from the parent listing to inspect its metadata (owner/modified/note)
   and learn it's fake for free, or tap straight in and eat a 35% trace
   spike. The real data's location is hinted (not required) via a leaked
   path in an error log; credentials sit in a handoff note reachable by
   normal navigation. No completionRequires — login is enough.
7. **Cityview Records Office** (`level07.ts`) — trace enabled. Introduces
   privilege escalation and log falsification. Log in as a low-privilege
   clerk from a helpdesk ticket note; the real records file is
   `requiresFact`-gated and shows PERMISSION DENIED until you escalate —
   found by reading a runbook (cron job reads a writable dropbox as root)
   and a dropbox note, then tapping Drop Payload. This node also replaces
   Delete Logs with Falsify Logs entirely (`LevelNodeDef.logFalsification`);
   completionRequires both reading the now-unlocked records file and
   falsifying logs, not just logging in.
8. **Halcyon Dynamics** (`level08.ts`) — the endgame, 4 connected nodes, one
   entry point. Edge (direct creds, plant a backdoor, pivots branch to HR
   and Finance) → HR (decode-revealed password, HR data, finds Core's
   address) → Finance (leak-check-revealed password, `adminOnlineThreshold`
   gates Check Connections/Hide, privilege escalation unlocks budget data,
   plant a second backdoor) → Core (Workbench-combine-revealed password,
   final Export Data action gated on **both** backdoors plus **both** data
   facts). Every credential-discovery mechanic from stages 4-7 gets used
   exactly once across the four nodes. completionRequires just
   `["exported-core-data"]` since Export Data's own gating already enforces
   the full chain.

### Stage 10 mechanics added — the build is now complete (all 10 stages)

- **PWA**: `vite-plugin-pwa` (devDependency) generates `manifest.webmanifest`
  and a Workbox service worker (`generateSW` mode) at build time —
  `npm run build` only, not `npm run dev` (no `devOptions.enabled`, so the
  dev server never runs a service worker; test PWA/offline behavior against
  `npm run build && npm run preview`, not `npm run dev`). Icons
  (`public/icons/icon-{192,512}.png`, `icon-maskable-{192,512}.png`,
  `apple-touch-icon.png`) are rasterized from the existing `LOCK_SPRITE` +
  `BASE_PALETTE` (not hand-drawn separately) via a one-off Playwright canvas
  screenshot script — reuses the game's actual pixel-art identity instead of
  the generic scaffold `favicon.svg`, and needed no new runtime dependency
  since the rasterization happens once, at authoring time, not per-build.
  `index.html` gets the standard iOS PWA meta tags
  (`apple-mobile-web-app-capable`, `apple-touch-icon`, etc.) alongside the
  plugin's auto-injected `<link rel="manifest">`.
- **Offline after first load**: Workbox precaches the app shell
  automatically. The one external-origin request the game makes — Google
  Fonts — needed an explicit `runtimeCaching` entry (`CacheFirst` for both
  `fonts.googleapis.com` and `fonts.gstatic.com`) so a page that's loaded
  once stays fully styled offline too, not just functional. Verified with a
  real `context.setOffline(true)` Playwright test against the built+
  previewed app: load once online (service worker installs, activates,
  takes control on the *second* load — SW control never applies to the very
  first navigation that registers it, a common gotcha), then reload fully
  offline — app shell, briefing text, and ActionBar all render with zero
  page errors.
- **localStorage persistence** (`gameStore.ts`, zustand's `persist`
  middleware, key `"nodebreaker-save"`): persists exactly what "level
  progress" means — `level.index` (as an index, not the object itself, so
  rehydration always resolves against the current code's `LEVELS` array
  rather than trusting stale persisted level data), `currentNodeId`,
  `discovered`, `accessGrantedNodes`, `traceLevel`, `burned`, `clues`.
  Deliberately does **not** persist transient UI/navigation state
  (`activePanel`, file/search/workbench state, terminal scrollback +
  `terminalRevealCount`, in-flight selection/crack/transform feedback) —
  exactly the split PROGRESS.md's own stage-6-era note anticipated ("want
  level progress to persist, but maybe not mid-level Terminal scrollback").
  A custom `merge` resolves the persisted index back into a real `LevelDef`
  and regenerates fresh `briefingLines` on load, so reopening the game reads
  as "reconnecting" rather than resuming a frozen terminal mid-animation.
  Verified end-to-end: reload mid-Level-3 restores clues/access/trace
  exactly, terminal comes back fresh, and post-reload actions (Delete Logs)
  still correctly complete the level.
- **Clue id collision fix**: `clueCounter` in `clueSystem.ts` is a
  module-level counter reset to 0 on every page load, but restored clues
  keep their old `"clue-N"` ids from a previous session — without
  correction, the very next clue saved after a reload could mint a
  duplicate id, silently breaking React's `key`-based reconciliation in
  `ClueInventory`/`Workbench`. Fixed with an exported `resumeClueCounter`
  that fast-forwards the counter past the highest id in the restored array,
  called once inside the persist `merge` function.
- **Reset Progress** (`resetProgress` action + `SettingsPanel`, replacing
  the old placeholder): clears the localStorage save
  (`useGameStore.persist.clearStorage()`) and calls `loadLevel(0)`. The
  button uses a lightweight tap-to-arm/tap-again-to-confirm pattern (local
  component state, 3s auto-revert) rather than a modal — the codebase has
  no confirm-dialog primitive anywhere else, and this is the first
  genuinely irreversible action in the game (Retry/Replay only affect the
  current level, not the whole save).

### Stage 9 mechanics added

- **Per-node access** (`accessGrantedNodes: Record<string, true>` replacing
  the old single `accessGranted: boolean`): required so a level can demand
  logging into *several* nodes instead of one — previously, the first
  successful login anywhere made the Login button vanish app-wide for the
  rest of the level, which breaks the moment a level has more than one node
  with a real login (Level 8's whole point). `computeLevelComplete` now
  checks "at least one node accessed" instead of a single flag; per-node
  gating (Login button, Delete/Falsify Logs, privilege escalations,
  backdoors) reads a new `useCurrentNodeAccessGranted()` hook. Confirmed via
  browser regression test that Levels 1 and 3 still work identically after
  this change — single-node levels were never affected either way.
- **Backdoors** (`BackdoorDef` + `plantBackdoor`): structurally identical to
  `PrivilegeEscalationDef` (instant, gated by requiredFacts + accessGranted,
  grants a fact) but kept as its own type/verb since a backdoor's fact is
  meant to be *required elsewhere* — Level 8's final Export Data action
  requires both `backdoor-edge` and `backdoor-finance` as proof of
  persistent footholds, not to unlock a `requiresFact` file gate the way
  privilege escalation does.
- **Admin presence** (`LevelNodeDef.adminOnlineThreshold`, `checkConnections`,
  `goQuiet`): deterministic rather than randomized (consistent with the rest
  of the engine — trace ticks and ambient logs are all deterministic too).
  Presence of the field surfaces both actions together. Check Connections
  reports online/clear by comparing `traceLevel` against the threshold —
  pure info, no state change. Hide (`goQuiet`) reduces trace by 20 and is
  available any time the field is set, not gated by login, as a general
  risk-management tool distinct from Delete/Falsify Logs (which require
  access first).
- **Terminal retype-on-remount fixed**: `revealCount` moved from local
  `useState` into the store as `terminalRevealCount` (reset on `loadLevel`).
  Switching panels and back no longer replays the entire scrollback —
  previously-revealed lines render instantly; only genuinely new lines
  (appended while the Terminal wasn't mounted) animate in. `charIndex`
  stays local, so at most the one in-progress line re-animates briefly.
- **Expanded procedural audio** (`audio/synth.ts`): added a noise-buffer
  generator (`noiseBurst`, real white noise through a bandpass filter, not
  another pure tone) backing three new sounds — `playTypeTick` (quiet
  per-character click, throttled to every other character, wired into
  `Terminal.tsx`'s existing reveal effect and skipped under reduced motion),
  `playGlitch` (harsh double burst, fired once when trace first crosses
  `TRACE_HOT_THRESHOLD` and again on `BurnedScreen` mount), `playAmbientPulse`
  (low periodic drone, fired from `TraceTicker`'s existing interval callback
  whenever `traceLevel > 0` — a "heartbeat" pulse rather than a true
  continuous loop, to avoid persistent-audio-node lifecycle complexity under
  React StrictMode's double-invoked effects).
- **Visual polish**: new `.glitch-shift` CSS class (one-shot horizontal
  jitter + red/green text-shadow split) applied to `BurnedScreen`'s heading;
  automatically covered by the existing global
  `prefers-reduced-motion` rule (wildcard selector), so no extra gating
  needed. Haptic audit: added matching `navigator.vibrate` calls at the same
  two new moments (hot-threshold crossing, burned) — existing haptic
  vocabulary (success = single buzz, failure/warning = triple buzz) was
  already consistent everywhere else and didn't need changes.
- **ActionBar overflow bug found and fixed while testing Level 8**: Finance's
  node can have up to 8 simultaneous actions (Scan/List/Trace/Delete Logs/
  Pivot/Drop Payload/Check Connections/Hide). The old `flex-1` button row had
  no overflow handling, and the app shell's `overflow-hidden` silently
  clipped anything past the viewport — Playwright's `.click()` still found
  and clicked the off-screen buttons (bypassing the visual clip), which
  masked the bug in the first automated pass. A dedicated scroll-metrics
  test (`scrollWidth` vs `clientWidth`) caught it. Fixed by making the bar
  `overflow-x-auto` with natural-width (`shrink-0 grow basis-24`) buttons
  instead of forced equal `flex-1` — few actions still fill the width, many
  actions scroll instead of clip.

### Stage 6 mechanics added

- **Clue selection**: `ClueInventory` chips are now tappable — tapping
  toggles `selectedClueId` in the store (`toggleClueSelection`). Selecting a
  clue surfaces single-input transform actions in the ActionBar instead of
  requiring the Workbench's two-slot drag-and-drop.
- **Decode** (`decodeClue` in `gameStore.ts`): instant, single-tap. Looks up
  the selected `encoded` clue's exact value in `transformRules.ts`'s
  `DECODE_RECIPES` (keyed by real base64 strings, decoded via `atob` for
  authenticity) and adds the resulting clue. Gentle failure (no clue found)
  mirrors Workbench's invalid-combo tone — no penalty, just feedback.
- **Crack Hash** (`startCrackHash`): takes simulated time
  (`CRACK_DURATION_MS` = 4s) via `window.setTimeout`, tracked by
  `crackingClueId` so the ActionBar button disables/relabels
  ("Cracking...") while running and only one crack can run at a time. Trace
  keeps ticking throughout since `TraceTicker`'s interval is independent of
  this. Looks up the hash in `transformRules.ts`'s `CRACK_RECIPES`.
- **Compare Files** (`compareFiles`, driven by `LevelNodeDef.compares:
  FileCompareDef[]`): a Terminal-panel contextual action (not Files-panel)
  that line-diffs two file contents and prints the result with `-`/`+`
  prefixes (warn/success tone), unchanged lines plain. Diff output can
  embed `[[type:value|label]]` clue markup same as any other content — a
  changed hash line stays tap-hold-savable straight from the diff view.
  Gated by `requiredFacts` (typically "both files read") and marked done via
  `grantsFact` so the action disappears once run.
- New engine module: `src/engine/transformRules.ts` (mirrors
  `combineRules.ts`'s recipe-table pattern, but single-input).
- **Known quirk, not a stage-6 bug**: `Terminal.tsx` keeps its typewriter
  `revealCount`/`charIndex` as local `useState`, so switching away from the
  Terminal panel and back makes it unmount/remount and **retype the entire
  scrollback from line 0**. Harmless functionally (tap-to-skip still works)
  but gets slower as a level accumulates more lines — noticed while
  browser-testing Level 4's longer diff output. Worth fixing before Level 8
  (which will have the most accumulated lines) — likely fix: lift
  reveal state up, or persist it, so only genuinely new lines animate.

### Stage 7 mechanics added

- **Pivot** (`pivotTo`, driven by `LevelNodeDef.pivots: PivotDef[]`): a
  Terminal-panel contextual action (same loop pattern as `compares`) that
  switches `currentNodeId` to another node in the level once its
  `requiredFacts` are discovered. Resets navigation state (`currentPath`,
  `openFilePath`, `searchOpen`) the same way `loadLevel` does, but
  deliberately leaves `clues`, `discovered`, `accessGranted`, and
  `traceLevel` untouched — those represent player knowledge/session state,
  not per-node state, so credentials found on one node keep working after
  pivoting (this is what makes password reuse work with zero extra
  plumbing: `attemptLogin` already tries every username×password clue in
  the shared inventory against whichever node is current). Appends
  `$ pivot --target <ip>` narration to the terminal. Pivots are
  bidirectional per-level by defining a `PivotDef` on each side (Level 5's
  internal node pivots back to the public one with empty `requiredFacts` —
  no gate needed since you already know the address once you're there).
- **Check Leak DB** (`checkLeakDatabase`): instant, single-tap, same shape
  as `decodeClue` — select an `email` clue, tap the action, look up
  `transformRules.ts`'s new `LEAK_RECIPES` table (keyed by exact email
  value) and add the resulting `password` clue. Gentle failure on no match,
  same tone as decode/crack.
- `StatusBar` needed no changes — it already reads the node via
  `useCurrentNode()`, so the NODE/TRACE display updates automatically on
  pivot (confirmed in the Level 5 browser test: IP and trace-enabled state
  both flip correctly right after pivoting).

### Stage 8 mechanics added

- **Tap-hold on Files rows** (`FileBrowser.tsx`'s new `EntryRow`): the
  directory listing switched from plain `<button onClick>` rows to
  pointer-event rows (mirrors `HoldSpan`'s timer pattern, now exported as
  `HOLD_MS` from `HoldableText.tsx`). A short tap still opens/enters exactly
  as before; a 550ms hold instead calls `openInspect(path)` if
  `entry.metadata` exists (silent no-op otherwise — most rows don't have
  metadata, and holding one shouldn't feel like an error). This is a new
  interaction verb, but reuses the same timing/haptic feel players already
  learned from clue-saving, so it doesn't need a tutorial popup to explain.
- **Metadata inspect view** (`inspectingPath` state, `openInspect`/
  `closeInspect`): renders in place of the directory listing — same pattern
  as `openFilePath`'s file-content view, just showing `FileEntry.metadata`
  label/value rows instead. Deliberately does **not** touch `terminalLines`
  — it's a look-without-committing action, not a logged one, so it shouldn't
  cost anything or leave a trace-relevant record.
- **Honeypot trap** (`FileEntry.honeypot`, checked in `goToPath`): entering
  a honeypot dir for the first time (exact path match, gated by
  `triggeredFact` so re-entering doesn't re-spike) appends warn-toned
  terminal lines and bumps `traceLevel` by `tracePenalty` in the same
  `set()` call — StatusBar's always-visible TRACE% is the primary feedback
  channel here (no new toast/banner UI), consistent with how ambient trace
  logs already work. The counterplay (tap-hold to inspect first) lives
  entirely in the data — no separate "avoid the trap" code path needed
  since inspecting never calls `goToPath`.
- **Privilege gate** (`FileEntry.requiresFact`, checked in both `openFile`
  and `FileBrowser`'s render): a locked file's `grantsFact` is withheld
  until the fact is discovered, and it's excluded from
  `searchFilesystem` results entirely (same treatment as `readable: false`
  binary files) so keyword search can't leak gated content around the
  permission check.
- **Privilege escalation** (`escalatePrivilege`, driven by
  `LevelNodeDef.privilegeEscalations`): instant, gated by `requiredFacts`
  **and** `accessGranted` (narratively: you need an authenticated session
  to use the exploit), grants a fact that unlocks matching
  `requiresFact` gates. Same data-driven shape as `compares`/`pivots`.
- **Log falsification** (`falsifyLogs`, driven by
  `LevelNodeDef.logFalsification`): on a node with this field set, the
  generic Delete Logs action is hidden entirely (`!node.logFalsification`
  added to its condition) and Falsify Logs takes its place — same
  trace-reduction shape as Delete Logs, different fact
  (`logs-falsified` vs `logs-deleted`) and framing. The choice not to make
  Delete Logs actively backfire (vs. simply removing it) was deliberate —
  keeps the mechanic data-driven and low-complexity; the in-fiction "why"
  is explained by a discoverable log-format reference file instead of a
  punishing trap.

### Stage 11 mechanics added — mobile playtest feedback

- **Tap-hold-to-save no longer opens the OS text-selection popup**: on real
  Android/iOS, long-pressing a `[[type:value|label]]` span inside a readable
  file body (rendered under FileBrowser's `.selectable` `<pre>`, which sets
  `user-select: text` so plain prose stays copyable) triggered the native
  Copy/Select All/Share callout instead of — or racing — the custom
  550ms-hold clue-save gesture. Fixed with a new `.holdable` CSS class
  (`src/index.css`) that pins `user-select: none`, `touch-action: none`, and
  `-webkit-touch-callout: none` on the span itself, overriding the
  `.selectable` ancestor; also added `onContextMenu={(e) =>
  e.preventDefault()}` as a cross-browser belt-and-braces. Applied to both
  `HoldSpan` (`HoldableText.tsx`) and `FileBrowser.tsx`'s `EntryRow` (which
  already had `touch-none select-none` via Tailwind but not the
  iOS-specific `-webkit-touch-callout` override). Verified with a Playwright
  touch-viewport test: after a synthetic long-press, `window.getSelection()`
  stays empty and the clue still saves.
- **Per-level mission briefing dialog gates the trace clock**
  (`briefingActive` in `gameStore.ts`, persisted; `dismissBriefing` action;
  `BriefingDialog.tsx`): previously `TraceTicker` started ticking the moment
  a level's node mounted, so a trace-enabled level's clock was already
  running before the player had read the briefing or looked around.
  `loadLevel` now sets `briefingActive: true`; a full-screen opaque overlay
  (level title, target IP/org, briefing lines, a "Start Hack" button) covers
  the whole game screen — StatusBar/panel/ActionBar/TabBar included — until
  dismissed, blocking both interaction and the trace interval
  (`TraceTicker`'s effect now also checks `!briefingActive`). Verified: with
  a trace-enabled level loaded and the briefing left up past a full 5s tick
  interval, trace stays at 0%; tapping Start Hack and waiting the same
  interval moves it to 2% as expected.
- **Main Menu + Level Select screens** (`src/screens/MainMenu.tsx`,
  `LevelSelect.tsx`; new `screen: "menu" | "levels" | "game"` store field,
  deliberately **not** persisted): the app now always boots to a Main Menu
  regardless of saved progress, instead of dropping straight into the
  Terminal — matches the ask that opening the game shouldn't auto-resume a
  session. Main Menu shows "Continue" (only when there's actual save
  progress — clues, discovered facts, trace, node access, or a completed
  level) plus "Select Level". Level Select lists all 8 levels with
  lock/DONE state driven by a new persisted `completedLevels: Record<string,
  true>` map; a level unlocks once the previous level's id is in
  `completedLevels`, index 0 is always unlocked. Completion is recorded by
  `TraceTicker` (already watching `useLevelComplete()` for the hot-trace
  alert) via a second one-shot-per-level ref, calling the new
  `markLevelComplete` action. Settings gained a "Back to Main Menu" button
  (pure navigation — doesn't touch save state, so Continue still resumes
  exactly where you left off). Verified end-to-end with Playwright: seeding
  `localStorage` with levels 1-2 marked complete unlocks level 3 in Level
  Select, and the app still boots to the menu first even with a save
  present.

### Stage 12 mechanics added — second round of mobile playtest feedback

- **Text is no longer selectable anywhere**: stage 11's `.holdable` fix
  scoped `user-select: none` to just the clue spans, leaving surrounding
  prose selectable via `.selectable` on the containing `<pre>`/`<p>`.
  Playtesting showed the player didn't want selection at all (only
  tap-hold), so `.selectable` is gone entirely (`FileBrowser.tsx`'s file
  body, `ClueInventory.tsx`'s clue-value line) and `body` in `index.css`
  now also sets `-webkit-touch-callout: none` globally — safe globally
  (unlike `touch-action: none`, which stays scoped to `.holdable` since
  going global there would break scrolling everywhere).
- **File reads no longer echo into the Terminal**: `openFile` in
  `gameStore.ts` used to push a `$ cat <file>` line plus the
  content/permission-denied/binary-placeholder lines into `terminalLines`,
  duplicating what the Files panel's own `openFilePath` view already
  renders. Removed the terminal-line-pushing half of the action entirely —
  `discovered`/`grantsFact` bookkeeping is untouched, so no game logic
  changed, just where the content is shown (Files panel only, per the ask).
- **Exit button on the Main Menu** (`MainMenu.tsx`): the web platform has no
  real "quit" — `window.close()` only works on a tab the page itself
  opened, so on an ordinary tab it silently no-ops. Exit attempts it anyway
  (covers PWA/webview contexts where it does work) but always lands on a
  themed "CONNECTION TERMINATED" screen with a "Back In" button, so the
  player is never stuck looking at a dead screen on an ordinary browser tab.
- **Toast notifications for clue saves and newly-unlocked actions**
  (`Notification`/`notifications`/`pushNotification`/`dismissNotification`
  in `gameStore.ts`, `NotificationToast.tsx`): playtest feedback was that
  new ActionBar tools felt like they came out of nowhere ("ngawang") —
  reasonable, since this is effectively a self-teaching tutorial with no
  popups by design (see the onboarding rule at the bottom of this file).
  `saveClue` now pushes `"Clue saved: <label>"` on every successful save
  (skips duplicates, same as its existing haptic/sound feedback). New
  ActionBar actions are trickier: `useContextActions()` returns a different
  action list per `activePanel`, so a diff against just the active panel's
  list would miss e.g. Login appearing on the Terminal panel while the
  player is reading a file in Files. Fixed by restructuring
  `useContextActions()` to always compute all three panels' action lists
  every render (previously each panel branch returned early) and expose
  `{ actions, notableActions }` — `actions` is still the active-panel-only
  list ActionBar renders, `notableActions` is every `notable`-flagged
  action across all three panels, independent of which one is active.
  `notable: true` is opt-in per action (login, delete/falsify logs,
  compare/pivot/escalate/backdoor, open-workbench) — routine UI chrome
  (Close/Up/Search/close-workbench/per-selection Decode-Crack-Leak-check)
  deliberately isn't flagged, since those appear and disappear constantly
  from ordinary navigation and would spam the toast queue if diffed the
  same way. First playtest of the diff logic caught exactly this: the
  Files panel's contextual "Close" button got announced as "New action
  unlocked: Close" the moment a file was opened, which is what led to the
  `notable`-flag design instead of diffing the raw action list.
  `ActionNotifier` (new component in `App.tsx`, mounted alongside
  `TraceTicker`) does the actual diffing — baseline resets silently
  (no toast) on node/level change or briefing dismissal, so a level's
  starting toolkit never fires as "new". Toast stack renders at `top-14`
  (clears the `h-11` StatusBar) via `NotificationToast.tsx`, each entry
  self-dismissing after 3.2s or on tap.

### Stage 13 mechanics added — multi-node clarity (Level 8 pivot navigation)

- **Clues are tagged with their origin node** (`Clue.nodeId`/`nodeLabel` in
  `clueSystem.ts`; `addClue` now takes a `{ id, label }` node param instead
  of inferring nothing). `gameStore.ts` gained a `nodeTag(level,
  currentNodeId)` helper and every one of the 5 clue-creation call sites
  (`saveClue`, `combineSlots`, `decodeClue`, `checkLeakDatabase`,
  `startCrackHash`) now stamps the clue with whichever node was current at
  creation time — `startCrackHash`'s is in a `window.setTimeout` callback,
  so it re-reads `get()` fresh at completion rather than capturing node
  context at crack-start (matters if the player pivots away mid-crack).
  `ClueInventory.tsx` groups by `nodeId` with a short-label header
  (`shortNodeLabel`, new export in `nodeState.ts` — takes the descriptor
  after a node's `orgName`'s last " — ", since every multi-node level
  already follows a "Company — Descriptor" convention, so no new per-node
  data field was needed) whenever a level has shown the player clues from
  more than one node; single-node levels (7 of 8) stay exactly the flat
  list they were, confirmed via Playwright regression.
- **Network Map overlay** (`NetworkMap.tsx`, triggered by tapping
  StatusBar's NODE indicator — the indicator itself only becomes a button,
  and only gains the `· <short label>` suffix, when `level.nodes.length >
  1`, so single-node levels' StatusBar is untouched): lists every node
  the player has visited this level (`visitedNodeIds: Record<string,
  true>` — new persisted store field, seeded to the entry node on
  `loadLevel`, extended in `pivotTo`) plus any node reachable via a *ready*
  pivot from the *current* node. Tapping a reachable row calls the same
  `pivotTo()` the Terminal ActionBar's "Pivot to `<ip>`" button already
  exposes — deliberately not a new navigation capability, since letting the
  map jump to any visited node regardless of the current node's actual
  pivot graph would trivialize the star-topology puzzle (Level 8's HR and
  Finance nodes only connect back through Edge, not directly to each
  other). A row's chip reads HERE / PIVOT / VISITED — VISITED rows are
  intentionally inert, which is the tell that a node exists but isn't
  reachable without routing back through Edge first. Verified end-to-end:
  from Finance, the map correctly shows HR as VISITED (dimmed,
  non-interactive) rather than PIVOT, since Finance has no direct pivot to
  HR in `level08.ts`.

### Stage 14 mechanics added — Network Map discoverability + explicit Login

- **Network Map button now reads as a button, plus a one-time discovery
  hint**: StatusBar's NODE indicator gained a visible border, background,
  and a "▾" affordance glyph (`StatusBar.tsx`) instead of looking like
  plain dim text. Fixing this surfaced a real layout bug: a long org name
  (Level 8 Edge's "Employee Portal / VPN Gateway") wrapped inside the
  button and pushed the TRACE indicator out of the fixed `h-11` header,
  breaking the row — fixed with an explicit `min-w-0`/`truncate` chain
  (short label span shrinks/ellipsizes, the `NODE: <ip>` prefix and TRACE
  side both stay `shrink-0 whitespace-nowrap` so they never wrap or lose
  space to the truncating span). Also added `NetworkMapHint.tsx`: a
  one-time dismissible callout (new persisted `networkMapHintShown` flag)
  that appears automatically the first time a level's `visitedNodeIds`
  count shows the map is actually useful (i.e., right after a player's
  first pivot), pointing at the now-obviously-tappable NODE bar.
  `setNetworkMapOpen` also marks the flag shown on open, so a player who
  finds the button on their own before ever pivoting never sees the
  redundant hint. This is a deliberate one-off exception to this project's
  own "no popup tutorials" rule (see the onboarding note near the bottom
  of this file) — added on explicit request after a real playtester didn't
  realize the bar was tappable, which the rule's "introduce every new verb
  through a situation where it's the only way out" premise doesn't cover
  for a pure navigation/orientation aid like this one.
- **Login is now an explicit username/password clue picker, not an
  auto-guess** (`LoginPicker.tsx`; `gameStore.ts`'s `loginPickerOpen` /
  `loginUsernameClueId` / `loginPasswordClueId` / `selectLoginUsername` /
  `selectLoginPassword` / `confirmLogin`, replacing the old `attemptLogin`
  entirely): the previous generic-login action silently looped through
  every username × password clue combo in the level-wide Clue Inventory
  and narrated whichever pair happened to match first. That's invisible
  and confusing on a level like Level 8, where by the time a player reaches
  HR they may already be holding the Edge VPN credential too — tapping
  Login could visibly attempt (and correctly fail with) the VPN pair when
  the player's mental model was "log into HR," with no way to tell the game
  to try their actual HR credential instead. The picker surfaces every
  username/password clue as a tappable row (tagged with its short origin-
  node label via `shortNodeLabel`, but only when the picker's candidates
  actually span more than one node — single-account levels don't show the
  label at all) and only attempts the pair the player explicitly selects.
  `setLoginPickerOpen(true)` auto-preselects when there's exactly one
  username and one password clue, so every level except 8 stays a
  two-tap confirm instead of forcing a redundant pick from a list of one.
  Verified end-to-end: on Level 8's HR node with both the VPN and HR
  credentials in inventory, explicitly picking the VPN pair correctly
  fails (`ACCESS DENIED`, no `accessGrantedNodes` change) and picking the
  HR pair correctly succeeds — confirming the reported bug was a UX/
  legibility problem (silent wrong-looking auto-attempt), not a login-logic
  bug (the old matching logic was already node-scoped and correct;
  players just had no way to see or choose what it was trying).

### Stage 15 mechanics added — Victim scenes before/after each hack

**Problem:** the game was mechanically complete but emotionally flat.
`BriefingDialog` opened a level with dry technical copy ("Connection
established. Target: unsecured router...") and `BreachedScreen`
(`App.tsx:109`) closed it with "NODE BREACHED — next target is online
whenever you're ready." No victim was ever shown being hurt, so there was
nothing pulling the player toward wanting to hack, and no payoff when they
did.

**Design:** each level now gets a **before-hack scene** (intercepted
comms — group chat, support ticket, deleted review, internal memo) that
escalates through 4 fixed beats — context → a *named, specific, powerless*
person harmed → a polite request denied by process → the perpetrator
gloating in a channel they think is private, ending on an explicit
untouchability line ("what exactly are they going to do about it?"). And an
**after-hack scene** that mirrors it card-for-card: each outro card's
`answers` field names a specific intro card, and `StoryScene` renders that
card's opening line struck-through above the new one, ending on the
perpetrator's panic in as few words as possible.

All 8 levels have a victim: neighbor router-hogging (petty, teaches the
grammar) → storefront chargeback stonewalling → an accounting junior framed
as the fall guy → an engineer NDA'd for whistleblowing → a health insurer's
deny-first quota → a driver fired over a doctored timesheet (the in-fiction
reason Level 6's honeypot folder exists) → a family's land deed "lost" to a
developer → and Level 8 (Halcyon Dynamics) revealed as the entity behind
all of the above, with `correlate --sources hr,finance` — already Level 8's
literal win condition — doubling as the payoff mechanic. Level 8's outro
carries one callback card per prior victim, Mrs. Adisa's (Level 1) last and
smallest for the tonal landing.

**Scope decisions locked with the user:** content ships fully bilingual
(English + Bahasa Indonesia) via a new real i18n layer (`src/i18n/index.ts`
— `Lang`, `LocalizedText` = `string | Partial<Record<Lang, string>>`, and a
`t()` resolver that falls back en → first available; deliberately minimal,
no dependency), feed-of-cards visual format with new pixel-art avatar
sprites (not cinematic narration cards), all 8 levels done in one pass, and
the connected-antagonist structure above. Existing UI strings elsewhere
stay hardcoded English — migrating them to the i18n layer is out of scope
for this stage; a language toggle (English / Bahasa Indonesia) was added to
Settings (`App.tsx`'s `SettingsPanel`) purely to exercise it.

**Wiring** (follows this project's established types → store action →
`App.tsx` surfacing pattern, see the note at the bottom of "Known gaps"
below):
- `SceneSourceKind`, `SceneCard`, `SceneDef` types added to
  `levels/types.ts`; `LevelDef` gained optional `intro?: SceneDef` /
  `outro?: SceneDef` so a scene-less level keeps working unchanged (none do
  now — all 8 levels have both).
- Store (`gameStore.ts`) gained `lang`/`setLang` (persisted), `introActive`/
  `dismissIntro` (set alongside `briefingActive` in `loadLevel`), and
  `outroActive`/`dismissOutro` (set inside `markLevelComplete`, which
  already fires exactly once per completion via `TraceTicker`'s
  `completedRef` guard — no new completion-detection hook needed). All
  three new fields were threaded through `PersistedState`, `partialize`,
  and `merge` — this store hand-writes persistence in three places and
  it's the easiest thing to miss.
- New `StoryScene.tsx`: one component for both scenes (self-contained,
  reads `introActive`/`outroActive` directly off the store — no props,
  same pattern as `BriefingDialog`/`NetworkMap`), full-bleed overlay at
  `z-[60]`, one layer above `BriefingDialog`'s `z-50`, so the sequence on a
  level with both is intro → briefing → play → outro → `BreachedScreen`.
  Rendered in `App.tsx` as a sibling of `<main>` (not inside `ActivePanel`,
  unlike `BreachedScreen`) so the outro covers StatusBar/ActionBar/TabBar
  too. Tap-anywhere reveals the next card (`playTypeTick`, or `playGlitch`
  + vibrate on a `perp` card, or `playCombineSuccess` on an outro card that
  `answers` something); a `closer` line types in afterward reusing the
  Terminal's `TYPE_MS_PER_CHAR` feel; Skip is always available top-right.
- Four new 16×16 sprites in `art/sprites.ts` (`PERSON_SPRITE`,
  `SUIT_SPRITE`, `ALERT_SPRITE`, `MEGAPHONE_SPRITE`) using the existing
  `SpriteGrid`/`BASE_PALETTE` format — no new palette needed, tone comes
  from which of the existing `a`/`w` slots each grid uses (e.g. the suit's
  necktie is `w`).
- New `.card-in`/`@keyframes card-in` in `index.css` for the per-card
  fade/slide-in — automatically covered by the existing global
  `prefers-reduced-motion` rule (`* { animation-duration: 0.001ms ... }`),
  no new media-query branch needed.

**Verified:** `npx tsc -b --noEmit`, `npm run lint` (oxlint), and
`npm run build` all clean. Playwright-driven playtest at 400×800 (mobile
width) confirmed: intro renders card-by-card with correct per-kind chrome
(victim green border, perp red border + glitch-shift, system/bystander
neutral) → "Continue" hands off to `BriefingDialog` (not straight into
play) → completing Level 1 triggers the outro immediately, covering
StatusBar/ActionBar/TabBar, with the struck-through mirror line rendering
correctly above each payoff line → dismissing the outro reveals
`BreachedScreen` with Next Level intact → reloading mid-outro and resuming
via Main Menu's "Continue" correctly re-enters the outro at its first card
→ the Settings language toggle immediately switches scene text to Bahasa
Indonesia on next level entry. Cross-checked programmatically that every
outro `answers` id resolves to a real intro card id across all 8 levels
(none missing). Trace-frozen-during-intro was **not** re-verified via a
scripted Level 3 playthrough (locked behind completing Levels 1–2) — it
follows from `introActive` always being a subset of `briefingActive`'s
true-duration (both set together in `loadLevel`; `dismissIntro` always
fires before `dismissBriefing` in the UI flow) and `TraceTicker`'s existing
`briefingActive` gate, which this stage did not modify.

### Stage 16 mechanics added — v1.0 round: save schema, audio, install, release hygiene

**Problem:** the game was feature-complete but the funnel around it leaked —
no install prompt was ever shown despite the app being installable, there was
no way to mute the procedural audio, `assetlinks.json` still had a placeholder
signing fingerprint (would fail Digital Asset Links verification on the TWA),
a stale feature branch was still wired into the Pages deploy trigger, and
`README.md` was still the untouched Vite template. This stage is the
foundation for the rest of the v1.0 round (scoring, achievements, daily
contracts) — all of it adds persisted state, and persistence in this store is
hand-written in three places, so the schema needed to stop growing linearly
with feature count before more features landed.

**Design — persistence refactor:** `gameStore.ts` gained `ProfileState`
(`bestRuns`, `counters`, `achievements`, `daily`, `audio`, `footholds` —
account-wide, survives `loadLevel`) and `RunState` (`startedAt`, `endedAt`,
`peakTrace`, `failedLogins`, `result` — reset every `loadLevel`, exists now so
later scoring work has somewhere to write without touching persistence again).
`RunResult`/`Rank` types live in a new `src/engine/runMetrics.ts` even though
nothing computes them yet, so `ProfileState.bestRuns` has a stable shape from
day one. `mergeProfile()` spreads each sub-object individually (`daily`,
`audio`) rather than relying on one shallow spread, since a save written
before a new sub-field existed would otherwise rehydrate that field as
`undefined`. `freshAccount()` centralizes what "Reset Progress" wipes —
`completedLevels`, `networkMapHintShown`, `profile` (audio setting excluded on
purpose, so a reset doesn't un-mute the game), `run` — so a future field added
to the store can't silently survive a reset by accident. `partialize`/`merge`
now grow by two lines (`profile`, `run`) instead of one line per new field.

**Design — audio mute/volume:** `synth.ts` previously connected every
oscillator/noise-burst straight to `ctx.destination`, so there was no way to
silence it short of the OS mute button. Added one `masterGain` node created
alongside the `AudioContext`; `beep()`/`noiseBurst()` route through it and
early-return before touching the context at all when `output.muted`.
`setAudioOutput()` is exported so the store can push `profile.audio` into the
synth on every change and once after rehydrate (a session's first sound would
otherwise play at the default volume before the restored setting reached the
module). Surfaced two places: a speaker icon top-right of `MainMenu`
(deliberately visible before any sound has ever played) and a mute
toggle + volume slider in `SettingsPanel`. Also corrected
`UI.reducedMotionNote`, which claimed sound respected
`prefers-reduced-motion` — it never did (only `Terminal.tsx`'s
`playTypeTick` checked it) — rather than wiring up a claim nobody asked for;
the new mute control supersedes the need for it anyway.

**Design — install prompt:** nothing in the repo listened for
`beforeinstallprompt` — the PWA was installable but never asked to be. New
`src/pwa/installPrompt.ts` registers the listener at module load (imported
for its side effect from `main.tsx`, before React mounts, since the browser
can fire the event before anything renders) and exposes
`useInstallAvailable()` via `useSyncExternalStore` plus a `promptInstall()`
that calls the deferred event's `.prompt()`. `MainMenu` shows an Install
button only when the browser has actually offered one. Verified in a headless
Playwright pass that the button stays correctly hidden under `npm run dev`
(no service worker/manifest in dev mode, so no installability signal exists
to trigger the event) and that nothing else on the menu regressed.

**Release hygiene:** `deploy-pages.yml`'s push trigger no longer includes the
merged `claude/victim-scenario-before-after-m76i08` branch. `README.md`
rewritten to actually describe the game, stack, dev commands, and the two
deploy workflows instead of the stock Vite/React template text.
**`public/.well-known/assetlinks.json` still has the placeholder
`REPLACE_WITH_APP_SIGNING_CERT_SHA256_FROM_PLAY_CONSOLE`** — this couldn't be
fixed here since the real value is the app's Play Console signing
certificate's SHA-256 fingerprint, which only the account holder has; until
it's filled in, the TWA will fail Digital Asset Links verification and show a
browser URL bar instead of a clean full-screen app.

**Verified:** `npx tsc -b --noEmit`, `npm run lint` (oxlint), `npm run build`
all clean. Playwright-driven pass at 390×800 confirmed: mute toggle flips the
MainMenu speaker icon and the setting survives a reload; Settings shows the
Sound toggle and a working volume slider; Level Select and Level 1's intro
scene still render and navigate normally with no new console errors.

## What's next

All 10 stages from the original build order, plus Stage 16 above, are done —
the game is feature-complete and the v1.0 round's foundation stage has
landed. Reasonable next moves if resuming work on this project (see the
in-repo plan this session worked from for the full staged breakdown: cold
start, run scoring, share cards, daily contracts, achievements, content
i18n, and a second chapter of levels, roughly in that order):

- **Stage 17 — first 90 seconds**: the cold start is still a stack of
  blocking overlays (`LanguagePicker` → MainMenu → LevelSelect → intro scene
  → briefing) before a player can touch anything. Auto-detect language
  instead of blocking on it, add a direct START path into Level 1, and add
  the idle-hint coaching the original design brief called for but never
  shipped.
- **Stage 18 — run scoring & grading**: no score, rank, or achievement exists
  yet; `RunResult`/`Rank` are typed and ready in `runMetrics.ts` but nothing
  computes or displays them.
- Manual real-device testing (an actual phone, not just a Playwright
  viewport) — installability prompt, home-screen icon rendering,
  touch/haptic feel, actual airplane-mode offline check — plus verifying the
  TWA once `assetlinks.json` has a real fingerprint.
- More levels beyond the original 8, if desired — the engine's "types →
  store action → ContextAction" pattern (see below) scales to new mechanics
  without rework, and Level 8's node count could grow from 4 toward the
  brief's "4-6" ceiling if it ever feels thin in playtesting.
- Audio/visual polish is intentionally light-touch (a few noise-burst
  sounds, one CSS glitch effect) rather than exhaustive — expand only if it
  earns its complexity; the game is fully playable and legible without more.

## Known gaps / things to double check when resuming

- `combineRules.ts` still has exactly one recipe, now reused twice
  (Level 2 and Level 8's Core node — same username+pattern→password recipe,
  different clue values, no engine change needed since it matches by type
  not value). `transformRules.ts` has one decode/crack/leak entry per level
  that uses each mechanic; a future level reusing decode/crack/leak just
  needs its own entries keyed by its own exact clue values.
- Terminal's retype-on-remount issue (flagged in stage 6) is **fixed** —
  `terminalRevealCount` now lives in the store, so switching panels and
  back only animates genuinely new lines. Confirmed comfortable even on
  Level 8's long multi-node scrollback.
- Trace level is still a single level-wide number, not per-node. Level 8
  has *three* simultaneously trace-enabled nodes (edge/hr/finance, plus
  core) and this still didn't need to change — trace is framed as "how much
  the whole intrusion session has been noticed," which reads fine as one
  shared number even across pivots. Revisit only if a future level wants
  trace on two nodes to mean genuinely different, non-additive things.
- Level 8 shipped with **4** nodes, not the brief's "4-6" — a deliberate
  scope call to keep the endgame's already-dense mechanic count (pivot,
  backdoor, escalation, admin-online, all 4 credential-discovery methods)
  testable and well-paced rather than padded. If it ever feels thin in
  playtesting, the data model (`LevelDef.nodes: LevelNodeDef[]`) supports
  adding 1-2 more without any engine changes.
- `ActionBar` had a real overflow bug (buttons silently clipped past the
  viewport, no scroll) that only Level 8's 8-simultaneous-action Finance
  node exposed — fixed (see stage 9 notes above), but worth remembering
  when browser-testing future crowded nodes: Playwright's `.click()`
  bypasses visual clipping via `overflow-hidden`, so a passing automated
  test does **not** prove every button is reachable by a real tap. Check
  `scrollWidth` vs `clientWidth` (or just screenshot and look) when a node
  has many simultaneous actions.
- Every new mechanic so far follows the same pattern: add fields to
  `levels/types.ts` → add a store action in `gameStore.ts` → surface it as a
  contextual `ContextAction` in `useContextActions()` in `App.tsx`. Keep
  following that pattern rather than inventing a new wiring approach.

---

## Original design brief (Indonesian, verbatim — source of truth for scope)

Bangun game mobile bernama **NODEBREAKER** — game puzzle hacking bergaya
pixel art. Pemain menjelajahi server fiktif, menemukan potongan informasi,
menggabungkannya menjadi exploit, lalu masuk ke sistem.

Bangun sebagai **web app (PWA) yang dioptimalkan untuk layar HP potret**.
Bisa dibuka di browser HP, installable ke home screen, dan jalan offline.

### STACK & BATASAN TEKNIS

- React + Vite + TypeScript
- Tailwind untuk styling
- Zustand (atau Context) untuk state management
- Semua state tersimpan di localStorage (tidak ada backend, tidak ada login,
  tidak ada server)
- Target: satu tangan, potret, layar 360–430px lebar
- Harus jalan penuh offline setelah load pertama

#### ATURAN ASET — SANGAT PENTING

**Tidak ada aset yang disediakan.** Semua visual dan audio harus dihasilkan
dari kode:

- **Sprite & ikon**: gambar pixel art via `<canvas>` dari array grid yang
  didefinisikan di kode. Modul `src/art/spriteEngine.ts` (fungsi render) dan
  `src/art/sprites.ts` (definisi grid).
- **Ikon UI**: SVG inline ditulis manual (path sederhana bergaya
  pixel/blocky), bukan library ikon eksternal.
- **Font**: hanya font monospace dari Google Fonts (IBM Plex Mono, JetBrains
  Mono) atau font monospace sistem. Jangan pakai file font kustom.
- **Suara**: Web Audio API secara prosedural — square/triangle wave untuk
  beep chiptune, noise generator untuk suara ketikan dan glitch. Tidak ada
  file audio.
- **Background & efek**: CSS gradient, CSS animation, atau canvas (scanline,
  glitch, kursor berkedip).
- Jangan pernah merujuk file gambar/audio eksternal. Jangan pakai placeholder
  dari internet.

#### ATURAN INTERAKSI — MINIM KETIK

Pemain hampir tidak pernah mengetik. Semua aksi lewat tap, hold, drag, dan
swipe:

- **Tap** — buka folder, buka file, jalankan aksi
- **Tap-hold pada teks** — simpan sebagai clue ke inventory (haptic + suara)
- **Drag & drop** — gabungkan dua clue di layar Workbench
- **Swipe kiri/kanan** — pindah antar panel (Terminal / Files / Clues /
  Status)
- **Swipe bawah** — tutup panel/kembali
- **Tombol aksi kontekstual** — muncul di bar bawah sesuai konteks

Satu-satunya input teks yang boleh ada: kolom pencarian kata kunci opsional,
dan itu pun harus punya chip preset yang bisa ditap (`password`, `admin`,
`key`, `backup`, `config`, `email`).

Output tetap ditampilkan seolah hasil terminal (monospace, prefix `$`, delay
ketik) — tapi pemain tidak mengetik command itu sendiri, muncul otomatis saat
menekan tombol aksi.

### LAYOUT LAYAR

```
┌─────────────────────────────┐
│ NODE: 10.14.2.7    TRACE 23%│  ← status bar
├─────────────────────────────┤
│   PANEL AKTIF                │
│   (Terminal/Files/           │
│    Clues/Workbench)          │
├─────────────────────────────┤
│ [Aksi] [Aksi] [Aksi]         │  ← tombol kontekstual
├─────────────────────────────┤
│  ◍ TERM  ◍ FILE  ◍ CLUE  ◍ ⚙│  ← tab bawah (jempol)
└─────────────────────────────┘
```

Semua elemen interaktif minimal 44×44px. Tombol aksi utama di sepertiga
bawah layar.

### SISTEM INTI

1. **Node**: IP fiktif, nama organisasi, port terbuka, pohon filesystem,
   log, daftar user, satu/lebih jalur solusi.
2. **Clue Inventory**: tipe: `username`, `password`, `hash`, `pattern`,
   `email`, `path`, `version`, `encoded`, `token`.
3. **Workbench**: drag dua clue untuk digabung. Kombinasi valid → clue
   baru/kredensial siap pakai. Kombinasi tidak valid → feedback halus
   (getar + pesan), tanpa penalti. Contoh resep:
   - `username` + `pattern` → `credential` (tebakan password)
   - `hash` + tool cracker → `password` (butuh waktu proses, trace jalan)
   - `encoded` → `decoded` (aksi satu tap)
   - `email` + leak database → `password`
4. **Trace Level**: naik saat aksi berisiko (honeypot, gagal login berulang,
   folder terlarang). Persentase + log sistem makin ramai. 100% = run gagal,
   node "burned".
5. **Pasca-akses**: ambil data target, opsional backdoor, kelola jejak
   (hapus log — kasar, kadang mencurigakan — atau palsukan log — halus,
   butuh clue tambahan).

### DAFTAR AKSI PEMAIN (dibuka bertahap per level)

- **Recon**: scan port, ping, lihat banner versi, lookup domain, traceroute
- **Eksplorasi**: browse direktori, baca file, unduh file, ekstrak arsip,
  cari kata kunci, baca log akses, riwayat perintah, proses berjalan,
  daftar user, koneksi aktif, metadata file
- **Analisis**: simpan clue, gabungkan clue, pecahkan hash, decode,
  bandingkan dua file, petakan relasi, cek leak database
- **Akses**: login, password reuse, exploit versi rentan, salah konfigurasi,
  bajak sesi aktif, naikkan hak akses
- **Pasca-akses**: ambil data, pasang backdoor, hapus jejak, palsukan log,
  buat akun tersembunyi, pivot ke node lain
- **Risiko**: cek trace level, ganti rute/proxy, disconnect darurat, ganti
  identitas

### LEVEL (8 total, file data di `src/levels/`)

1. **Router Tetangga** — 1 port, catatan pemilik → password bawaan pabrik.
   Tanpa trace. *(✅ selesai — level01.ts)*
2. **Toko Online** — `/backup/` berisi username; "Tentang Kami" berisi nama
   pemilik + tahun berdiri → gabung jadi tebakan password. *(✅ selesai —
   level02.ts)*
3. **Kantor Akuntan** — trace timer pertama kali. Log akses → akun
   mencurigakan; riwayat perintah akun itu → password. Wajib hapus jejak
   sebelum keluar. *(✅ selesai — level03.ts)*
4. **Startup** — komentar source code berisi string ter-encode. Bandingkan
   config lama vs baru: username sama, hash baru. Pecahkan hash sambil trace
   jalan. *(✅ selesai — level04.ts)*
5. **Rumah Sakit** — 2 node. Node A publik (daftar email staf), Node B
   internal (target). Satu staf pakai password sama di dua tempat. Tanpa
   petunjuk untuk bawa kredensial antar node. *(✅ selesai — level05.ts)*
6. **Logistik** — folder umpan yang terlalu mudah (trace besar). Petunjuk
   palsu ada di metadata file. Jalur asli tersembunyi di error log.
   *(✅ selesai — level06.ts)*
7. **Kantor Pemerintah** — login user biasa; data butuh admin. Proses
   terjadwal jalan sebagai admin baca folder yang bisa ditulis pemain.
   Hapus log total → makin mencurigakan — harus dipalsukan.
   *(✅ selesai — level07.ts)*
8. **Jaringan Korporat** — 4-6 node terhubung, satu pintu masuk. Admin bisa
   online sewaktu-waktu (cek koneksi aktif, sembunyi bila perlu). Data
   tersebar lintas node. Backdoor penting.
   *(✅ selesai — level08.ts, 4 node)*

Aturan onboarding: maksimal 3-5 aksi baru per level, **tanpa popup
tutorial** — tiap aksi baru diperkenalkan lewat situasi di mana aksi itu
satu-satunya jalan keluar. Hint halus boleh muncul setelah pemain diam >45
detik (belum diimplementasi).

### ARAH VISUAL

Terminal klasik, bukan neon cyberpunk generik. Latar hampir hitam (`#0a0c10`),
teks fosfor redup, satu warna aksen untuk clue/keberhasilan (hijau,
`--color-accent`) dan satu warna peringatan untuk trace/risiko (oranye-merah,
`--color-warn`). Efek scanline halus dan kursor berkedip. Teks output muncul
dengan animasi ketik (bisa di-skip dengan tap). Hormati
`prefers-reduced-motion`.

### URUTAN PENGERJAAN (10 tahap, kerjakan bertahap, laporkan tiap tahap)

1. Setup proyek + layout dasar + sprite engine dengan 3 sprite contoh ✅
2. Engine node & filesystem + panel Terminal dan File Browser (Level 1
   penuh) ✅
3. Sistem clue: tap-hold, panel inventory ✅
4. Workbench drag-and-drop + aturan kombinasi (Level 2 selesai) ✅
5. Trace system + log dinamis + hapus jejak (Level 3 selesai) ✅
6. Aksi analisis lanjutan: decode, hash cracker, bandingkan file (Level 4) ✅
7. Multi-node + pivot + password reuse (Level 5) ✅
8. Honeypot, metadata, hak akses bertingkat, palsukan log (Level 6-7) ✅
9. Level 8 endgame + audio prosedural + polish (scanline, haptic, animasi
   ketik) ✅
10. PWA manifest + service worker + simpan progres di localStorage
    ⬅ **next**
