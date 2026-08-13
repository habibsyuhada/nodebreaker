import type { LevelDef } from "./types";

export const LEVEL_12: LevelDef = {
  id: "level-12",
  index: 11,
  title: { en: "Cascade Wellness App", id: "Aplikasi Cascade Wellness" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a wellness app's staging server.", id: "Target: server staging aplikasi wellness." },
    {
      en: "Nothing here is guarded well, but nothing is handed to you either —",
      id: "Gak ada yang dijaga ketat di sini, tapi juga gak ada yang dikasih cuma-cuma —",
    },
    {
      en: "decode, compare, and crack your way in.",
      id: "decode, bandingkan, dan retas jalan masukmu sendiri.",
    },
  ],
  entryNodeId: "cascade-app",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — staging config unlocked.", id: "Kamu masuk — config staging terbuka." },
    { en: "LEVEL 12 COMPLETE.", id: "LEVEL 12 SELESAI." },
  ],
  parSeconds: 220,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "The consent screen never mentioned this.", id: "Layar consent-nya gak pernah nyebut ini." },
    cards: [
      {
        id: "l12-context",
        kind: "system",
        channel: { en: "#cascade-eng", id: "#cascade-eng" },
        author: { en: "Platform Bot", id: "Bot Platform" },
        body: [
          {
            en: "Config sync — staging updated. Sleep & mood tracking module v2.3.",
            id: "Sinkronisasi config — staging diperbarui. Modul pelacak tidur & suasana hati v2.3.",
          },
        ],
      },
      {
        id: "l12-harm",
        kind: "victim",
        channel: { en: "#cascade-eng", id: "#cascade-eng" },
        author: { en: "Wulan (early user, via support ticket)", id: "Wulan (pengguna awal, via tiket dukungan)" },
        meta: { en: "Forwarded internally", id: "Diteruskan secara internal" },
        body: [
          {
            en: "I used this app for sleep tracking. My insurer just cited a 'behavioral health risk indicator' in a coverage review. I never agreed to share this with anyone.",
            id: "Saya pakai aplikasi ini buat lacak tidur. Asuransi saya baru saja mengutip 'indikator risiko kesehatan perilaku' di tinjauan cakupan. Saya gak pernah setuju ini dibagikan ke siapa pun.",
          },
        ],
      },
      {
        id: "l12-gloat",
        kind: "perp",
        channel: { en: "DM — Platform Lead to Meridian partnerships", id: "DM — Platform Lead ke tim kemitraan Meridian" },
        author: { en: "Platform Lead", id: "Platform Lead" },
        body: [
          {
            en: "v2.3 widens the data-sharing scope quietly — same consent screen, buried new clause. Meridian's Sentinel Score feed goes live Friday.",
            id: "v2.3 memperluas cakupan berbagi data secara diam-diam — layar consent sama, klausul baru dikubur. Feed Sentinel Score ke Meridian aktif hari Jumat.",
          },
          { en: "Nobody reads clause 14.", id: "Gak ada yang baca klausul 14." },
        ],
      },
      {
        id: "l12-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need into the staging box. If the scope really widened, the old and new configs will say different things.",
            id: "Perlu masuk ke box staging. Kalau cakupannya benar diperluas, config lama dan baru bakal beda isinya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Clause 14 is public now.", id: "Klausul 14 sekarang publik." },
    cards: [
      {
        id: "l12-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Pulled both configs side by side and the buried clause with them. Posted the diff somewhere legal can't quietly bury it again.",
            id: "Ambil kedua config berdampingan beserta klausul yang dikubur. Posting perbandingannya di tempat yang gak bisa dikubur lagi diam-diam.",
          },
        ],
        answers: "l12-plan",
      },
      {
        id: "l12-outro-relief",
        kind: "victim",
        channel: { en: "Personal blog — now public", id: "Blog pribadi — kini publik" },
        author: { en: "Wulan", id: "Wulan" },
        body: [
          {
            en: "Turns out I wasn't imagining it. The clause is right there in the diff, timestamped the same week my coverage review happened.",
            id: "Ternyata bukan perasaan saya saja. Klausulnya ada di situ di hasil perbandingan, cap waktunya minggu yang sama dengan tinjauan cakupan saya.",
          },
        ],
        answers: "l12-harm",
      },
      {
        id: "l12-outro-press",
        kind: "public",
        channel: { en: "Tech Press — Breaking", id: "Media Teknologi — Berita Terbaru" },
        author: { en: "@dataleaks_daily", id: "@dataleaks_daily" },
        body: [
          {
            en: "Leaked configs show a wellness app quietly widened data sharing to feed a health-insurance risk score.",
            id: "Config bocor menunjukkan aplikasi wellness memperluas berbagi data secara diam-diam untuk skor risiko asuransi kesehatan.",
          },
        ],
        answers: "l12-gloat",
      },
      {
        id: "l12-outro-panic",
        kind: "perp",
        channel: { en: "DM — Platform Lead to Meridian partnerships", id: "DM — Platform Lead ke tim kemitraan Meridian" },
        author: { en: "Platform Lead", id: "Platform Lead" },
        body: [{ en: "clause 14 is trending, who leaked the diff", id: "klausul 14 lagi rame dibahas, siapa yang bocorin diff-nya" }],
      },
    ],
  },
  nodes: [
    {
      id: "cascade-app",
      ip: "203.0.113.204",
      orgName: "Cascade Wellness — Staging Server",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | cascade-app (staging)" }],
      users: [{ username: "wellnessbot", password: "C0nsentWide9!", role: "deployment service account" }],
      systemUsers: [
        { username: "wellnessbot", role: "service account" },
        { username: "root", role: "admin" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "src",
            kind: "dir",
            children: [
              {
                name: "sync_config.py",
                kind: "file",
                grantsFact: "read-sync-script",
                content: {
                  en:
                    "# staging config sync — don't touch without asking platform team\n" +
                    "# legacy service login moved here during the migration\n" +
                    "# b64: [[encoded:d2VsbG5lc3Nib3Q=|Base64 comment left in by a careless dev]]\n" +
                    "import subprocess\n",
                  id:
                    "# sinkronisasi config staging — jangan diubah tanpa izin tim platform\n" +
                    "# login service lama dipindahkan ke sini saat migrasi\n" +
                    "# b64: [[encoded:d2VsbG5lc3Nib3Q=|Komentar Base64 yang ketinggalan dari dev yang ceroboh]]\n" +
                    "import subprocess\n",
                },
              },
            ],
          },
          {
            name: "etc",
            kind: "dir",
            children: [
              {
                name: "consent.old.yml",
                kind: "file",
                grantsFact: "read-consent-old",
                content: {
                  en:
                    "module: sleep-mood-tracker\n" +
                    "scope: on-device-only\n" +
                    "password_hash: [[hash:5f4dcc3b5aa765d61d8327deb882cf99|Old hash — superseded]]\n" +
                    "updated: 2023-09-11",
                  id:
                    "module: sleep-mood-tracker\n" +
                    "scope: on-device-only\n" +
                    "password_hash: [[hash:5f4dcc3b5aa765d61d8327deb882cf99|Hash lama — sudah diganti]]\n" +
                    "updated: 2023-09-11",
                },
              },
              {
                name: "consent.new.yml",
                kind: "file",
                grantsFact: "read-consent-new",
                content: {
                  en:
                    "module: sleep-mood-tracker\n" +
                    "scope: on-device + partner-risk-feed (clause 14)\n" +
                    "password_hash: [[hash:c74d97b01eae257e44aa9d5bade97baf|New hash after last rotation]]\n" +
                    "updated: 2024-05-20",
                  id:
                    "module: sleep-mood-tracker\n" +
                    "scope: on-device + partner-risk-feed (klausul 14)\n" +
                    "password_hash: [[hash:c74d97b01eae257e44aa9d5bade97baf|Hash baru setelah rotasi terakhir]]\n" +
                    "updated: 2024-05-20",
                },
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content: {
              en: "Cascade Wellness staging server.\nIf access breaks, check with the platform team before touching creds.",
              id: "Server staging Cascade Wellness.\nKalau akses gak berfungsi, hubungi tim platform dulu sebelum mengubah kredensial.",
            },
          },
        ],
      },
      compares: [
        {
          id: "consent-configs",
          label: { en: "Compare Configs", id: "Bandingkan Config" },
          pathA: ["etc", "consent.old.yml"],
          pathB: ["etc", "consent.new.yml"],
          requiredFacts: ["read-consent-old", "read-consent-new"],
          grantsFact: "compared-consent-configs",
        },
      ],
    },
  ],
};
