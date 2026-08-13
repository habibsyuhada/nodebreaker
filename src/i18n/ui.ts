import type { LocalizedText } from "./index";

/**
 * Static UI chrome strings — menus, panel headers, generic (non-level-authored) action labels,
 * overlays. Deliberately excludes: level content (titles/briefing/success text/file contents,
 * still English-only), terminal system output (e.g. "AUTHENTICATING...", "ACCESS GRANTED" — reads
 * as part of the hacker-terminal aesthetic), and literal command syntax (e.g. `--user`, `--pass`).
 * Scene content (StoryScene cards) has its own LocalizedText inline in each level file, unrelated
 * to this dictionary.
 */
export const UI = {
  // MainMenu
  tagline: {
    en: "FIND THE OPENING. GET IN. STAY QUIET.",
    id: "CARI CELAHNYA. MASUK. DIAM-DIAM.",
  },
  startBtn: { en: "START", id: "MULAI" },
  continueBtn: { en: "Continue", id: "Lanjutkan" },
  selectLevel: { en: "Select Level", id: "Pilih Level" },
  installApp: { en: "Install App", id: "Instal Aplikasi" },
  switchToIndonesian: { en: "Bahasa Indonesia?", id: "Bahasa Indonesia?" },
  switchToEnglish: { en: "English?", id: "English?" },
  switchLangDismiss: { en: "×", id: "×" },
  settings: { en: "Settings", id: "Pengaturan" },
  exit: { en: "Exit", id: "Keluar" },
  connectionTerminated: { en: "CONNECTION TERMINATED", id: "KONEKSI DIPUTUS" },
  exitBody: {
    en: "Session closed. You can close this tab now — or jump back in if you're not done yet.",
    id: "Sesi ditutup. Kamu bisa tutup tab ini sekarang — atau lanjut lagi kalau belum selesai.",
  },
  backIn: { en: "Back In", id: "Kembali" },

  // LevelSelect
  menuBack: { en: "‹ Menu", id: "‹ Menu" },
  selectTarget: { en: "SELECT TARGET", id: "PILIH TARGET" },
  done: { en: "DONE", id: "SELESAI" },
  locked: { en: "LOCKED", id: "TERKUNCI" },
  completePreviousTarget: {
    en: "Complete the previous target to unlock.",
    id: "Selesaikan target sebelumnya untuk membuka.",
  },

  // SettingsPanel
  settingsTitle: { en: "SETTINGS", id: "PENGATURAN" },
  reducedMotionNote: {
    en: "Reduced motion is auto-detected from your system.",
    id: "Gerakan berkurang terdeteksi otomatis dari sistem kamu.",
  },
  autosaveNote: {
    en: "Your level, clues, and trace save automatically to this device — closing the tab won't lose your place.",
    id: "Level, petunjuk, dan trace kamu otomatis tersimpan di perangkat ini — menutup tab gak akan menghilangkan progres.",
  },
  audioLabel: { en: "Sound", id: "Suara" },
  muteOn: { en: "Muted", id: "Senyap" },
  muteOff: { en: "On", id: "Aktif" },
  volumeLabel: { en: "Volume", id: "Volume" },
  languageLabel: { en: "Language", id: "Bahasa" },
  resetProgress: { en: "Reset Progress", id: "Reset Progres" },
  resetConfirm: {
    en: "Tap again to confirm — this can't be undone",
    id: "Tap lagi untuk konfirmasi — ini gak bisa dibatalkan",
  },
  backToMainMenu: { en: "Back to Main Menu", id: "Kembali ke Menu Utama" },

  // StatusBar
  traceOff: { en: "TRACE — off", id: "TRACE — nonaktif" },
  traceBurned: { en: "TRACE — BURNED", id: "TRACE — TERBAKAR" },

  // BriefingDialog
  incomingJob: { en: "INCOMING JOB", id: "PEKERJAAN MASUK" },
  target: { en: "Target:", id: "Target:" },
  startHack: { en: "Start Hack", id: "Mulai Hack" },
  traceWontMove: {
    en: "Trace won't move until you tap Start.",
    id: "Trace gak akan bergerak sampai kamu tap Mulai.",
  },

  // BreachedScreen
  nodeBreached: { en: "NODE BREACHED", id: "NODE BERHASIL DIBOBOL" },
  nextTargetOnline: {
    en: "Next target is online whenever you're ready.",
    id: "Target berikutnya online kapan pun kamu siap.",
  },
  moreLevelsComing: {
    en: "More levels are on the way. Replay this one, or sit with the win.",
    id: "Level lain segera hadir. Mainkan ulang yang ini, atau nikmati kemenangannya.",
  },
  replayLevel: { en: "Replay Level", id: "Ulangi Level" },
  nextLevel: { en: "Next Level", id: "Level Berikutnya" },
  mainMenu: { en: "Main Menu", id: "Menu Utama" },

  // Run result breakdown — shared between BreachedScreen (full, graded) and BurnedScreen
  // (partial, ungraded — a burned run never gets a rank). Rank words themselves (GHOST/CLEAN/
  // LOUD/SLOPPY) stay literal, same convention as ACCESS GRANTED and LEVEL X COMPLETE elsewhere.
  resultNewBest: { en: "NEW BEST", id: "REKOR BARU" },
  resultTrace: { en: "PEAK TRACE", id: "TRACE PUNCAK" },
  resultIntel: { en: "INTEL", id: "INTEL" },
  resultTime: { en: "TIME", id: "WAKTU" },
  resultHoneypots: { en: "HONEYPOTS HIT", id: "HONEYPOT KENA" },
  resultFailedLogins: { en: "FAILED LOGINS", id: "LOGIN GAGAL" },
  resultSessionStats: { en: "SESSION STATS", id: "STATISTIK SESI" },

  // ShareButton
  shareResult: { en: "Share Result", id: "Bagikan Hasil" },
  shareCopied: { en: "Copied!", id: "Tersalin!" },
  shareManualHint: {
    en: "Couldn't share directly — copy the text above.",
    id: "Gak bisa dibagikan langsung — salin teks di atas.",
  },

  // BurnedScreen
  connectionLost: { en: "CONNECTION LOST — NODE BURNED", id: "KONEKSI TERPUTUS — NODE TERBAKAR" },
  burnedBody: {
    en: "They caught the session before you finished. The node is off-limits now — try again.",
    id: "Mereka menangkap sesi sebelum kamu selesai. Node ini sekarang gak bisa diakses — coba lagi.",
  },
  retryLevel: { en: "Retry Level", id: "Coba Lagi" },

  // NetworkMap
  networkMap: { en: "NETWORK MAP", id: "PETA JARINGAN" },
  close: { en: "Close", id: "Tutup" },
  here: { en: "HERE", id: "DI SINI" },
  visited: { en: "VISITED", id: "DIKUNJUNGI" },

  // NetworkMapHint — {NODE} marks where the accent-colored "NODE" word is inserted, since the
  // two languages order it differently around "bar" ("the NODE bar" vs "bar NODE").
  networkMapHintBody: {
    en: "You just pivoted. Tap the {NODE} bar above anytime to see every system you've reached and jump between them.",
    id: "Kamu baru saja pivot. Tap bar {NODE} di atas kapan saja untuk lihat semua sistem yang sudah kamu capai dan berpindah di antaranya.",
  },
  gotIt: { en: "Got it", id: "Mengerti" },

  // LoginPicker
  loginTitle: { en: "LOGIN", id: "LOGIN" },
  usernameLabel: { en: "USERNAME", id: "USERNAME" },
  noUsernameClues: { en: "No username clues saved yet.", id: "Belum ada petunjuk username yang tersimpan." },
  passwordLabel: { en: "PASSWORD", id: "PASSWORD" },
  noPasswordClues: { en: "No password clues saved yet.", id: "Belum ada petunjuk password yang tersimpan." },
  login: { en: "Login", id: "Login" },

  // ClueInventory
  clueInventoryEmpty: { en: "CLUE INVENTORY — EMPTY", id: "INVENTARIS PETUNJUK — KOSONG" },
  clueInventoryEmptyBody: {
    en: "Tap text you find in Terminal or Files to save it here.",
    id: "Tap teks yang kamu temukan di Terminal atau Files untuk menyimpannya di sini.",
  },
  cracking: { en: "cracking...", id: "membongkar..." },
  // {plural} resolves to "" or "s" in English (computed in code); the Indonesian string doesn't
  // use the token at all since Indonesian doesn't inflect nouns for plural.
  clueCountLabel: {
    en: "{n} clue{plural} saved · tap a clue to select it",
    id: "{n} petunjuk tersimpan · tap petunjuk untuk memilihnya",
  },

  // Workbench
  dragTwoClues: {
    en: "Drag two clues here to try combining them",
    id: "Seret dua petunjuk ke sini untuk mencoba menggabungkannya",
  },
  noMoreCluesInTray: {
    en: "No more clues in the tray. Fill both slots above, or go find more.",
    id: "Gak ada lagi petunjuk di tray. Isi kedua slot di atas, atau cari lagi.",
  },

  // FileBrowser
  searchFileContents: { en: "Search file contents for a keyword", id: "Cari kata kunci di isi file" },
  tapChipToSearch: { en: "Tap a chip above to search.", id: "Tap chip di atas untuk mencari." },
  noMatchesFor: { en: 'No matches for "{keyword}".', id: 'Tidak ada hasil untuk "{keyword}".' },
  emptyDirectory: { en: "(empty directory — {path})", id: "(direktori kosong — {path})" },
  permissionDenied: {
    en: "PERMISSION DENIED — administrator privileges required.",
    id: "AKSES DITOLAK — memerlukan hak akses administrator.",
  },
  binaryData: {
    en: "[binary data — not human-readable]",
    id: "[data biner — tidak bisa dibaca manusia]",
  },
  upNav: { en: ".. Up", id: ".. Naik" },

  // ActionBar
  noActionsAvailable: { en: "no actions available", id: "tidak ada aksi tersedia" },

  // Generic (non-level-authored) action labels, useContextActions() in App.tsx
  scanPorts: { en: "Scan Ports", id: "Scan Port" },
  listUsers: { en: "List Users", id: "Daftar User" },
  checkTrace: { en: "Check Trace", id: "Cek Trace" },
  deleteLogs: { en: "Delete Logs", id: "Hapus Log" },
  checkConnections: { en: "Check Connections", id: "Cek Koneksi" },
  hide: { en: "Hide", id: "Sembunyikan" },
  closeSearch: { en: "Close Search", id: "Tutup Pencarian" },
  search: { en: "Search", id: "Cari" },
  combine: { en: "Combine", id: "Gabungkan" },
  clearSlots: { en: "Clear Slots", id: "Kosongkan Slot" },
  closeWorkbench: { en: "Close Workbench", id: "Tutup Workbench" },
  decode: { en: "Decode", id: "Decode" },
  crackHash: { en: "Crack Hash", id: "Crack Hash" },
  crackingAction: { en: "Cracking...", id: "Membongkar..." },
  checkLeakDb: { en: "Check Leak DB", id: "Cek Leak DB" },
  workbench: { en: "Workbench", id: "Workbench" },

  // StoryScene
  skip: { en: "Skip", id: "Lewati" },
  tapToContinue: { en: "Tap to continue", id: "Tap untuk lanjut" },

  // MonologueDialog — the player's own session notes. Replaces the corner toast for clue saves
  // and new-action-unlocked, and replaces the terminal "FAILED — preconditions not met." dump for
  // blocked gated actions (privilege escalation / backdoor), with the player thinking it through
  // instead. The interpolated {label} stays whatever the source (level/engine) already provides
  // in English, since level content isn't in scope for this pass.
  youAuthorLabel: { en: "You", id: "Kamu" },
  sessionNotesChannel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
  clueSavedMonologue: {
    en: "Worth keeping. Saved to my notes: {label}",
    id: "Layak disimpan. Tersimpan ke catatan saya: {label}",
  },
  gatedActionBlockedMonologue: {
    en: "Not yet — {label} still needs:",
    id: "Belum bisa — {label} masih butuh:",
  },
  /** Fallback when a gated action's level data doesn't supply its own requiredFactHints entry. */
  stillMissingFact: { en: "still missing: {fact}", id: "masih kurang: {fact}" },

  // GestureCoach — idle-triggered hints, delivered through the same monologue channel as the
  // lines above so they read as the player's own thought rather than a tutorial popup.
  hintTapHoldInspect: {
    en: "Might be worth holding my finger on one of these before opening it.",
    id: "Ada baiknya saya tahan jari di salah satu ini dulu sebelum membukanya.",
  },
  hintSaveClue: {
    en: "Anything useful in here is worth holding my finger on — keeps it in my notes.",
    id: "Apa pun yang berguna di sini layak saya tahan jarinya — biar tersimpan di catatan.",
  },
  hintOpenWorkbench: {
    en: "A couple of these clues might fit together. Worth trying them on the Workbench.",
    id: "Beberapa petunjuk ini mungkin bisa digabung. Coba di Workbench.",
  },

  // RestartLevelDialog
  restartLevel: { en: "Restart Level", id: "Ulangi Level" },
  keepGoing: { en: "Keep Going", id: "Lanjutkan" },
  restartLevelPrompt: {
    en: "Pull the plug on this run? Every login, backdoor, and export I've made here resets — I'd be breaking in from scratch.",
    id: "Putus sesi ini sekarang? Semua login, backdoor, dan data yang sudah saya ambil di sini bakal reset — saya harus masuk dari awal lagi.",
  },

  // OpsRecord (Stage 21) — MainMenu entry point + the achievements/stats screen itself
  opsRecord: { en: "Ops Record", id: "Catatan Operasi" },
  opsRecordTitle: { en: "OPS RECORD", id: "CATATAN OPERASI" },
  opsRecordProgress: { en: "{n} / {total} unlocked", id: "{n} / {total} terbuka" },
  achievementUnlockedMonologue: {
    en: "Achievement unlocked: {name}",
    id: "Pencapaian terbuka: {name}",
  },
  dailyStreakLabel: { en: "DAILY CONTRACT STREAK", id: "RENTETAN KONTRAK HARIAN" },
  dailyStreakBest: { en: "Best: {n}", id: "Terbaik: {n}" },
  dailyStreakCurrent: { en: "{n}-day streak", id: "Rentetan {n} hari" },

  // Daily Contract (Stage 22)
  dailyContract: { en: "Daily Contract", id: "Kontrak Harian" },
  dailyContractDoneToday: {
    en: "Today's contract is done. Come back after 00:00 UTC.",
    id: "Kontrak hari ini sudah selesai. Kembali setelah 00:00 UTC.",
  },
} satisfies Record<string, LocalizedText>;
