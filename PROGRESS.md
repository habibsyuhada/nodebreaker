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
  audio/          synth.ts — procedural Web Audio beeps (clue saved/duplicate,
                  combine success/invalid). No audio files.
  engine/         nodeState.ts (filesystem nav + login check + keyword search),
                  clueSystem.ts (clue types, [[type:value|label]] markup parser,
                  dedup), combineRules.ts (Workbench recipes), traceSystem.ts
                  (trace constants + ambient log thresholds)
  levels/         types.ts (LevelDef/LevelNodeDef/FileEntry/etc.), level01-03.ts,
                  index.ts (LEVELS array — levels 4-8 not yet added)
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

## What's next (stages 6-10, not started)

Follow the original 10-stage build order from the brief (bottom of this
file). We are done through **stage 5**. Next up:

**Stage 6 — Advanced analysis actions, Level 4**
- New engine pieces: a decode action (single-tap transform on an `encoded`
  clue → `decoded`, e.g. base64/rot13-style), a hash cracker (`hash` clue →
  `password`, takes simulated time while trace keeps ticking if enabled),
  and a "compare two files" action (diff two file contents, surface what
  changed — old vs new config, same username but new hash).
- **Level 4 — Startup** (per brief): a source-code comment contains an
  encoded string; compare old vs new config files — same username, new hash;
  crack the hash while trace runs. Unlocks: decode, crack hash, compare
  files.
- Likely needs: `combineRules.ts` or a new `transformRules.ts` for
  single-input transforms (decode, crack) vs the existing two-input Workbench
  combine; a "processing takes time" pattern (setTimeout-driven, trace still
  ticks) for the hash cracker — reuse the `TraceTicker` pattern if possible.

**Stage 7 — Multi-node + pivot + password reuse**
- **Level 5 — Hospital** (2 nodes): public node only has staff emails;
  internal node is the real target; one staff member reuses their password
  across both. No in-game hint to carry credentials between nodes.
- Needs: node-to-node "pivot" action, `currentNodeId` switching UI (already
  supported structurally by `LevelNodeDef[]` + `currentNodeId`, but no pivot
  action/UI exists yet), and an "leak database"/"password reuse" check
  action per the original action list.

**Stage 8 — Honeypot, metadata, privilege escalation, log falsification**
- **Level 6 — Logistics**: an obviously-too-easy decoy folder that spikes
  trace hard if touched: the "it's fake" tell lives in file metadata (needs
  a metadata-inspection action + `FileEntry.metadata` field, not yet added);
  the real path is hidden in an error log.
- **Level 7 — Government Office**: log in as a regular user; the real data
  needs admin. A scheduled process running as admin reads a
  player-writable folder (privilege escalation via that). Deleting logs
  outright raises suspicion here — must falsify logs instead (new action,
  opposite tone from Level 3's "delete logs").

**Stage 9 — Level 8 endgame + full audio + polish**
- **Level 8 — Corporate Network**: 4-6 connected nodes, one entry point,
  admin can come online any time (active-connections check + "hide"),
  target data spread across nodes, backdoors matter.
- Expand `audio/synth.ts` beyond clue/combine feedback: typing/keystroke
  noise generator, glitch noise, ambient hum — per the brief's "Web Audio
  API ... noise generator untuk suara ketikan dan glitch".
- Polish pass: scanline/glitch canvas effects beyond the current CSS
  scanline overlay, confirm `prefers-reduced-motion` is respected
  everywhere, haptic feedback audit.

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
- `combineRules.ts` has exactly one recipe. Levels 4+ will need more, and
  probably a second kind of rule table for single-input transforms (decode,
  crack) — don't force those into the two-slot Workbench UI, they should
  probably be one-tap ActionBar actions on a selected/held clue instead.
- `LevelNodeDef` has no `metadata` field on `FileEntry` yet — Level 6 needs
  it.
- No pivot/multi-node UI yet even though the data model
  (`LevelDef.nodes: LevelNodeDef[]`) already supports multiple nodes per
  level.
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
   jalan. *(belum)*
5. **Rumah Sakit** — 2 node. Node A publik (daftar email staf), Node B
   internal (target). Satu staf pakai password sama di dua tempat. Tanpa
   petunjuk untuk bawa kredensial antar node. *(belum)*
6. **Logistik** — folder umpan yang terlalu mudah (trace besar). Petunjuk
   palsu ada di metadata file. Jalur asli tersembunyi di error log.
   *(belum)*
7. **Kantor Pemerintah** — login user biasa; data butuh admin. Proses
   terjadwal jalan sebagai admin baca folder yang bisa ditulis pemain.
   Hapus log total → makin mencurigakan — harus dipalsukan. *(belum)*
8. **Jaringan Korporat** — 4-6 node terhubung, satu pintu masuk. Admin bisa
   online sewaktu-waktu (cek koneksi aktif, sembunyi bila perlu). Data
   tersebar lintas node. Backdoor penting. *(belum)*

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
6. Aksi analisis lanjutan: decode, hash cracker, bandingkan file (Level 4)
   ⬅ **next**
7. Multi-node + pivot + password reuse (Level 5)
8. Honeypot, metadata, hak akses bertingkat, palsukan log (Level 6-7)
9. Level 8 endgame + audio prosedural + polish (scanline, haptic, animasi
   ketik)
10. PWA manifest + service worker + simpan progres di localStorage
