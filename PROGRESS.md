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
  engine/         nodeState.ts (filesystem nav + login check + keyword search),
                  clueSystem.ts (clue types, [[type:value|label]] markup parser,
                  dedup), combineRules.ts (Workbench recipes), transformRules.ts
                  (single-input decode/crack/leak-check recipes), traceSystem.ts
                  (trace constants + ambient log thresholds)
  levels/         types.ts (LevelDef/LevelNodeDef/FileEntry/FileCompareDef/
                  PivotDef/HoneypotDef/PrivilegeEscalationDef/
                  LogFalsificationDef/BackdoorDef/etc.), level01-08.ts,
                  index.ts (LEVELS array — all 8 levels registered)
  panels/         Terminal.tsx, FileBrowser.tsx (+ built-in search view),
                  ClueInventory.tsx, Workbench.tsx
  components/     StatusBar.tsx, ActionBar.tsx, TabBar.tsx, HoldableText.tsx
                  (tap-hold-to-save-clue span, used by Terminal + FileBrowser)
  store/          gameStore.ts — single Zustand store, all game state
App.tsx           panel switcher, contextual ActionBar logic, breach/burned
                  screens, TraceTicker (passive trace interval)
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

## What's next (stage 10, not started)

Follow the original 10-stage build order from the brief (bottom of this
file). We are done through **stage 9** — all 8 levels are built and
playable end-to-end. Next up:

**Stage 10 — PWA + persistence**
- `manifest.json`, service worker (offline-first after first load),
  installable to home screen.
- Persist game state to `localStorage` (currently everything resets on
  reload — no persistence exists yet). Needs a save/load layer in
  `gameStore.ts`, probably zustand's `persist` middleware, with care around
  what should/shouldn't survive a reload (e.g. probably want level progress
  to persist, but maybe not mid-level Terminal scrollback).

## Known gaps / things to double check when resuming

- No `localStorage` persistence at all yet (stage 10) — closing the tab
  loses all progress.
- No PWA manifest/service worker yet (stage 10) — not installable, not
  offline-capable yet despite the brief requiring it.
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
