# NODEBREAKER — Rencana Chapter 2–4 (Boss Node Map + Skin Reward)

Dokumen perencanaan, bukan implementasi. Ditulis sebagai lanjutan
`PROGRESS.md` ("What's next" sudah menandai *"second chapter of levels"*
sebagai item utama yang tersisa). Level 1–8 yang sudah ada sekarang disebut
**Chapter 1** — tidak perlu di-rename di kode (id/index level lama tidak
diubah), cukup dibungkus di layer baru (`ChapterDef`) supaya kompatibel
mundur dengan save lama.

## 1. Struktur besar

- **Chapter 1** (sudah ada): 8 level reguler, level 8 = endgame lama, tetap
  seperti sekarang. Tidak dianggap "boss chapter" secara resmi (retroaktif
  boleh dianggap bonus, tidak wajib diubah).
- **Chapter 2, 3, 4** (baru), masing-masing:
  - 6–7 level reguler (mekanik baru, lihat §5), mengikuti pola satu mekanik
    baru per level yang sudah dipakai Chapter 1.
  - 1 **Boss Chapter** di akhir: bukan level tunggal, tapi **peta jaringan
    boss** — beberapa node saling terhubung yang bisa dijelajahi bebas
    (bukan pivot linear satu arah seperti level 5/8 sekarang).
  - Chapter N+1 terbuka setelah Boss Chapter N diselesaikan lewat **salah
    satu** dari 3 jalur (lihat §3) — sama seperti `isUnlocked()` di
    `LevelSelect.tsx` sekarang, tapi gate-nya jadi "boss cleared", bukan
    "level completed".

## 2. Peta Boss (visual, bisa pindah-pindah node)

`NetworkMap.tsx` yang ada sekarang adalah **daftar** (list overlay), bukan
peta spasial — cukup untuk pivot 2-4 node linear di Chapter 1. Untuk Boss
Chapter perlu komponen baru, `BossMap.tsx`:

- Setiap `BossNodeDef` punya `mapPosition: { x: number; y: number }` (grid
  koordinat, bukan pixel absolut, supaya responsif di layar 360–430px) dan
  `connections: string[]` (id node tetangga).
- Render: node sebagai ikon pixel-art kecil (pakai `spriteEngine`/`icons.tsx`
  yang sudah ada, style konsisten dengan game), garis SVG antar node yang
  terhubung, node saat ini di-highlight (glow accent color), node yang
  belum reachable (belum ada pivot fact-nya) digambar redup + ikon gembok.
- Tap node yang reachable → sama seperti `pivotTo()` sekarang, pindah
  `currentNodeId`, lalu tutup overlay dan buka Terminal node baru.
- Full-screen, bukan bottom-sheet seperti `NetworkMap` biasa — boss map
  butuh ruang untuk 5-8 node sekaligus. Tetap satu tangan/portrait: scroll
  atau pinch-zoom kalau node terlalu banyak untuk satu layar.
- Reuse: fact-gating (`requiredFacts` di pivot), `visitedNodeIds`, tone
  warna sudah ada — ini murni tambahan visual + posisi, bukan mekanik nav
  baru.

## 3. Tiga jalur penyelesaian boss

Setiap Boss Chapter punya satu **core node** (target akhir) dan 3
`BossPathDef` independen menuju ke situ, masing-masing lewat subset node
yang berbeda di peta:

1. **Jalur teknis (wajib salah satu, biasanya paling "netral" sulitnya)** —
   rantai recon → crack/decode → privilege escalation → core, mirip pola
   Chapter 1 level 7–8.
2. **Jalur sosial/insider** — kumpulkan clue tentang seseorang (dari node
   HR/kontak), palsukan/pakai identitasnya untuk masuk lewat node lain yang
   bocor karena reused password / trust relationship.
3. **Jalur diam-diam (stealth/backdoor)** — pivot lewat node pinggiran yang
   traceless, tanam backdoor, masuk core tanpa pernah trigger alarm node
   utama.

Aturan penyelesaian:

- **Cukup 1 jalur selesai** → `completionRequires` boss terpenuhi → Chapter
  berikutnya terbuka. Ini dicek sama seperti `completionRequires` level
  biasa sekarang, hanya faktanya jadi `"path-a-done" | "path-b-done" |
  "path-c-done"` (OR, bukan AND).
- Jalur lain **tetap bisa dikerjakan setelah itu** (boss node tidak
  "selesai total" dan hilang — save `bossPathsCompleted[bossId]: string[]`
  menyimpan jalur mana saja yang sudah pernah dituntaskan, lintas sesi).
  Praktisnya: setelah lanjut ke chapter berikutnya, pemain masih bisa balik
  ke Boss Map (lewat Chapter Select) untuk coba jalur lain kapan saja.
- Setiap jalur yang diselesaikan (termasuk yang pertama) memberi 1
  **skin tema** — bukan cuma 2 jalur "opsional". Supaya jalur pertama yang
  dipilih pemain tidak terasa seperti "yang tidak dapat reward", best
  practice-nya: semua 3 jalur reward tema, tapi jalur pertama yang selesai
  otomatis juga membuka chapter selanjutnya. Ini lebih adil daripada
  menganggap 1 dari 3 "gratis, tanpa reward".
- Node yang unik ke satu jalur cukup dikunjungi sekali; kalau jalur lain
  butuh melewati node yang sama (irisan), fakta yang sudah didapat tetap
  kepakai (Clue Inventory level-wide, sama seperti sekarang).

## 4. Sistem skin/tema

Sekarang cuma ada satu palet (hijau fosfor di atas hitam,
`--color-*` di `src/index.css`, bagian `@theme`). Rencana:

- `ThemeDef`: `{ id, name: LocalizedText, colors: { bg, panel, panelAlt,
  border, text, textBright, textDim, accent, accentDim, warn, warnDim } }`
  — 1:1 dengan token `--color-*` yang sudah ada.
- Terapkan dengan set CSS custom properties di root element saat tema
  aktif berubah (bukan lewat Tailwind `@theme` statis, karena itu
  compile-time) — style inline pada elemen root App, override token yang
  sama persis namanya supaya semua utility (`bg-accent`, `text-warn`, dst)
  otomatis ikut berubah tanpa sentuh komponen lain.
- Simpan di store: `unlockedThemeIds: string[]` (selalu berisi
  `"phosphor-green"` default), `equippedThemeId: string`. Persist lewat
  `persist` middleware yang sudah ada (tambah field, tidak breaking —
  field baru default ke array/`"phosphor-green"` kalau tidak ada di save
  lama).
- UI: tab/section baru di `SettingsPanel` — grid swatch tema, tema
  terkunci tampil abu-abu + syarat unlock-nya (nama boss + jalur), tap tema
  ter-unlock untuk equip langsung (preview instan, bukan perlu save/apply).
- 6 tema dari jalur boss (3 chapter x 2 jalur "tambahan" — jalur ke-2 dan
  ke-3 yang diselesaikan pemain di boss yang sama, siapa pun boleh jalur
  duluan) + 1 tema default hijau. Contoh nama (bisa diubah pas
  implementasi, sekadar starting point):
  - Chapter 2 boss → **Amber CRT** (kuning-oranye monokrom, nuansa
    terminal jadul) dan **Cyan Frost** (biru-cyan dingin).
  - Chapter 3 boss → **Blood Alert** (merah tua/krimson) dan **Violet
    Static** (ungu-magenta).
  - Chapter 4 boss → **Arctic White** (putih-biru kontras tinggi) dan
    **Gold Protocol** (emas-hitam, kesan "prestige").
  - Opsional/bonus di luar 3 chapter (bukan wajib untuk MVP): 1 tema
    rahasia untuk pemain yang menuntaskan **semua 9 jalur boss** (3 chapter
    × 3 jalur) — reward "100% completion" yang sudah sesuai gaya
    achievement game ini (`ACHIEVEMENTS`/Ops Record sudah punya pola
    serupa).
- Setiap tema wajib lolos cek kontras aksesibilitas dasar (teks vs
  background) sebelum masuk — sama semangatnya dengan palet hijau/hitam
  yang sudah dipilih hati-hati sekarang, jangan sampai tema baru bikin
  teks susah dibaca di HP outdoor.

## 5. Ide mekanik & level per chapter

Chapter 1 sudah memakai: search keyword, tap-hold clue, Workbench combine,
trace + hapus log, decode/crack hash, compare file, multi-node pivot,
password reuse via leak-check, honeypot, metadata inspect, privilege
escalation, falsify log, backdoor, admin-online (check connections/hide).
Chapter 2–4 harus tambah **1 mekanik baru per level reguler**, tanpa
mengulang pola yang sama, mengikuti aturan onboarding yang sudah ada
("maksimal 3-5 aksi baru per level, tanpa popup tutorial").

**Chapter 2 — mekanik menengah (memperluas apa yang sudah ada):**
1. Intercept traffic — "tangkap" beberapa baris log jaringan mentah, cari
   pola di dalamnya (perluasan dari keyword search, tapi sumbernya feed
   log, bukan file browser).
2. Phishing/rekayasa sosial — susun pesan dari potongan clue (chip preset,
   tetap tanpa ketik) untuk memancing target membocorkan 1 clue baru.
3. Bypass OTP/2FA — clue OTP muncul di node kedua (mailbox/SMS gateway),
   harus dipivot dan diambil dalam window waktu sebelum kadaluarsa.
4. Lateral movement — infeksi node A memberi akses baca-saja ke folder
   share di node B (perluasan dari backdoor, tapi antar-node bukan re-entry
   node sendiri).
5. Firewall/ACL reading — Scan Ports diperluas: sebagian port ketutup,
   harus baca rule file dulu buat tahu port mana yang kebuka untuk role
   tertentu.
6. Cloud bucket misconfig — folder publik yang harusnya private, ditemukan
   lewat clue path yang bocor di halaman lain (mirip robots.txt level 5,
   tapi temanya cloud storage bukan LAN).
7. *(opsional, kalau masih kurang padat)* Shift window — node hanya bisa
   diakses pas indikator waktu in-game tertentu.

**Chapter 3 — mekanik lanjut (butuh penalaran, bukan cuma prosedur):**
1. Cipher berlapis — decode butuh 2 langkah transform berurutan (bukan
   1 kali seperti sekarang).
2. Steganografi — clue tersembunyi di metadata/komentar file "gambar"
   (direpresentasikan sebagai ascii-art/file biner + metadata panel, sesuai
   aturan tanpa aset gambar asli).
3. Insider identification — beberapa file profil "tersangka", pemain harus
   silang-cocokkan clue (jam akses, lokasi, device) untuk tahu akun mana
   yang harus dipakai — puzzle logika ringan, bukan mekanik baru di engine.
4. Counter-intrusion pasif — begitu trace lewat threshold tertentu, admin
   "membalas" (pindah/kunci 1 file penting) — trace jadi py konsekuensi
   struktural, bukan cuma angka.
5. Badge/akses fisik — 1 clue dari node digital membuka 1 node "fisik"
   (kombinasi tema, tetap mekanik login/pivot yang sama).

**Chapter 4 — endgame kedua (gabungan semua, paling padat):**
1. Dual-guard vault — 2 node penjaga harus di-nonaktifkan (lewat 2 mekanik
   berbeda) sebelum core boss chapter-nya sendiri kebuka.
2. Adaptive defense — begitu 1 privilege escalation kepakai, node terkait
   "patch" celah itu (fakta baru menutup 1 opsi, mendorong pemain ke jalur
   lain) — cocok dipakai buat differentiate 3 jalur boss.
3. False flag — log yang sengaja dipalsukan mengarah ke pemain; falsify
   log jadi wajib bukan cuma buat "aman" tapi buat tidak "dituduh".
4. Boss chapter 4 = gabungan semua mekanik 1-3, peta terbesar (7-8 node).

Catatan: ini starting point, bukan final — perlu direview lagi pas mulai
nulis konten tiap level (nama organisasi, cerita korban/dampak sesuai gaya
intro/outro scene yang sudah ada).

## 6. Perubahan data model (ringkas)

- `src/levels/types.ts`: tambah `ChapterDef`, `BossNodeDef` (extends
  `LevelNodeDef` + `mapPosition`/`connections`), `BossPathDef` (id, label,
  requiredNodeIds/facts, `completionFact`, `rewardThemeId`).
- `src/levels/index.ts`: `LEVELS` tetap ada (backward compat), tambah
  `CHAPTERS: ChapterDef[]` sebagai struktur baru yang membungkus level lama
  (chapter 1) + level/boss baru (chapter 2-4).
- `src/store/gameStore.ts`: tambah `currentChapterIndex`, `bossPathsCompleted`,
  `unlockedThemeIds`, `equippedThemeId`; action baru `pivotBossNode`,
  `completeBossPath`, `equipTheme`.
- `src/screens/LevelSelect.tsx` → pecah jadi `ChapterSelect.tsx` (tab per
  chapter) + `LevelSelect.tsx` yang sudah ada dipakai di dalam 1 chapter.
- `src/components/BossMap.tsx` (baru, lihat §2).
- `src/panels/SettingsPanel` (atau file sejenis yang sudah ada) → tambah
  Theme picker.
- Semua field teks baru pakai `LocalizedText` (en/id) mengikuti konvensi
  i18n yang sudah selesai di Chapter 1 — jangan rilis chapter baru
  English-only lalu terjemahkan belakangan seperti Stage 21 kemarin.

## 7. Urutan pengerjaan yang diusulkan (lanjutan penomoran stage di PROGRESS.md)

11. Engine tema (`ThemeDef`, penerapan CSS var runtime, Settings UI) —
    ship dengan default hijau saja dulu, supaya bisa diverifikasi terpisah
    dari konten chapter baru.
12. Model data chapter (`ChapterDef`/`BossNodeDef`/`BossPathDef`) + store
    (unlock per-chapter) + `ChapterSelect` UI — belum ada konten baru,
    cuma re-wrap Chapter 1 supaya alur lama tidak regresi.
13. `BossMap.tsx` (peta visual) — uji pakai data boss "dummy" 3-4 node dulu.
14. Chapter 2: level reguler (mekanik §5).
15. Chapter 2: Boss Chapter (peta + 3 jalur) + wiring reward tema.
16. Chapter 3: level reguler.
17. Chapter 3: Boss Chapter + reward tema.
18. Chapter 4: level reguler.
19. Chapter 4: Boss Chapter (final) + reward tema + polish endgame.
20. i18n (id) untuk semua konten baru — sekaligus, bukan ditunda.
21. Playtesting/balance (`parSeconds`, tuning trace), achievement baru
    (mis. "Tiga Jalur" — selesaikan ketiga jalur 1 boss; "Kolektor Tema" —
    unlock semua tema), review kontras warna tiap tema, regresi save lama.

## 8. Hal yang masih perlu diputuskan sebelum mulai coding

- Jumlah level reguler per chapter: 6, 7, atau 8? (draf ini pakai ~6-7,
  konsisten dengan Chapter 1 = 8 total termasuk endgame-nya sendiri).
- Nama & tema cerita chapter 2-4 (organisasi/korban) — perlu selaras
  dengan nada game (dampak nyata orang yang dirugikan, bukan sekadar
  "misi hacking").
- Apakah 3 jalur boss chapter 2 harus lebih mudah daripada chapter 4
  (kurva kesulitan antar-boss), atau tetap 3 opsi setara tapi beda gaya
  main tiap chapter.
- Nama final 6-7 tema warna (draf di §4 masih placeholder).
