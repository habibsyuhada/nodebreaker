import type { LevelDef } from "./types";

export const LEVEL_20: LevelDef = {
  id: "level-20",
  index: 19,
  title: { en: "Civic Transit Card System", id: "Sistem Kartu Transit Kota" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: the city transit card staging server.", id: "Target: server staging kartu transit kota." },
    {
      en: "Nothing here is guarded well, but nothing is handed to you either —",
      id: "Gak ada yang dijaga ketat di sini, tapi juga gak ada yang dikasih cuma-cuma —",
    },
    {
      en: "and this credential is encoded twice. Decode it, then decode what you get.",
      id: "dan kredensial ini di-encode dua kali. Decode, lalu decode lagi hasilnya.",
    },
  ],
  entryNodeId: "transit-app",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — fare-zone config unlocked.", id: "Kamu masuk — config zona tarif terbuka." },
    { en: "LEVEL 20 COMPLETE.", id: "LEVEL 20 SELESAI." },
  ],
  parSeconds: 220,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "The map never mentioned the throttle.", id: "Petanya gak pernah nyebut soal pembatasan itu." },
    cards: [
      {
        id: "l20-context",
        kind: "system",
        channel: { en: "#civic-os-eng", id: "#civic-os-eng" },
        author: { en: "Platform Bot", id: "Bot Platform" },
        body: [
          { en: "Config sync — staging updated. Fare-zone module v4.1.", id: "Sinkronisasi config — staging diperbarui. Modul zona tarif v4.1." },
        ],
      },
      {
        id: "l20-harm",
        kind: "victim",
        channel: { en: "#civic-os-eng", id: "#civic-os-eng" },
        author: { en: "Marcus (rider, via support ticket)", id: "Marcus (penumpang, via tiket dukungan)" },
        meta: { en: "Forwarded internally", id: "Diteruskan secara internal" },
        body: [
          {
            en: "My free transfer window used to be 90 minutes. Now it's 40, only on routes through Ward 3. Every other zone still gets 90.",
            id: "Jendela transfer gratis saya dulu 90 menit. Sekarang 40, cuma di rute yang lewat Wilayah 3. Zona lain masih 90.",
          },
        ],
      },
      {
        id: "l20-gloat",
        kind: "perp",
        channel: { en: "DM — Platform Lead to Ferrovia contracts", id: "DM — Platform Lead ke tim kontrak Ferrovia" },
        author: { en: "Platform Lead", id: "Platform Lead" },
        body: [
          {
            en: "v4.1 quietly shortens the transfer window in the three lowest-revenue wards. Same fare screen, buried zone override.",
            id: "v4.1 diam-diam mempersingkat jendela transfer di tiga wilayah berpendapatan terendah. Layar tarif sama, override zona dikubur.",
          },
          { en: "Nobody reads the zone override table.", id: "Gak ada yang baca tabel override zona." },
        ],
      },
      {
        id: "l20-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need into the staging box. If the zones really changed, the old and new configs will say different things.",
            id: "Perlu masuk ke box staging. Kalau zonanya benar berubah, config lama dan baru bakal beda isinya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The override table is public now.", id: "Tabel override-nya sekarang publik." },
    cards: [
      {
        id: "l20-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Pulled both configs side by side and the buried zone override with them. Posted the diff where it can't be quietly reverted.",
            id: "Ambil kedua config berdampingan beserta override zona yang dikubur. Posting perbandingannya di tempat yang gak bisa dibalikin diam-diam.",
          },
        ],
        answers: "l20-plan",
      },
      {
        id: "l20-outro-relief",
        kind: "victim",
        channel: { en: "Personal blog — now public", id: "Blog pribadi — kini publik" },
        author: { en: "Marcus", id: "Marcus" },
        body: [
          {
            en: "Turns out it wasn't just Ward 3 riders imagining it. The override table's right there in the diff.",
            id: "Ternyata bukan cuma penumpang Wilayah 3 yang ngerasa. Tabel override-nya ada persis di hasil perbandingan.",
          },
        ],
        answers: "l20-harm",
      },
      {
        id: "l20-outro-press",
        kind: "public",
        channel: { en: "Tech Press — Breaking", id: "Media Teknologi — Berita Terbaru" },
        author: { en: "@dataleaks_daily", id: "@dataleaks_daily" },
        body: [
          {
            en: "Leaked configs show a city transit system quietly shortened transfer windows in its lowest-revenue wards.",
            id: "Config bocor menunjukkan sistem transit kota mempersingkat jendela transfer secara diam-diam di wilayah berpendapatan terendah.",
          },
        ],
        answers: "l20-gloat",
      },
      {
        id: "l20-outro-panic",
        kind: "perp",
        channel: { en: "DM — Platform Lead to Ferrovia contracts", id: "DM — Platform Lead ke tim kontrak Ferrovia" },
        author: { en: "Platform Lead", id: "Platform Lead" },
        body: [{ en: "the override table is trending, who leaked the diff", id: "tabel override-nya lagi rame dibahas, siapa yang bocorin diff-nya" }],
      },
    ],
  },
  nodes: [
    {
      id: "transit-app",
      ip: "203.0.113.230",
      orgName: "Civic Transit Card — Staging Server",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | transit-app (staging)" }],
      users: [{ username: "transitsvc", password: "Z0neThr0ttle#5", role: "deployment service account" }],
      systemUsers: [
        { username: "transitsvc", role: "service account" },
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
                    "# legacy service login: [[username:transitsvc|Deployment service account]]\n" +
                    "# key rotated twice, both layers left in the config comment below\n" +
                    "import subprocess\n",
                  id:
                    "# sinkronisasi config staging — jangan diubah tanpa izin tim platform\n" +
                    "# login service lama: [[username:transitsvc|Akun servis deployment]]\n" +
                    "# key dirotasi dua kali, kedua lapisan ada di komentar config di bawah\n" +
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
                name: "fare_zones.old.yml",
                kind: "file",
                grantsFact: "read-fare-old",
                content: {
                  en:
                    "module: fare-zone\n" +
                    "transfer_window_minutes: 90\n" +
                    "zone_override: none\n" +
                    "updated: 2023-08-04",
                  id:
                    "module: fare-zone\n" +
                    "transfer_window_minutes: 90\n" +
                    "zone_override: none\n" +
                    "updated: 2023-08-04",
                },
              },
              {
                name: "fare_zones.new.yml",
                kind: "file",
                grantsFact: "read-fare-new",
                content: {
                  en:
                    "module: fare-zone\n" +
                    "transfer_window_minutes: 90\n" +
                    "zone_override: { ward3: 40, ward7: 40, ward9: 40 }\n" +
                    "password_chain: [[encoded:V2pCdVpWUm9jakIwZEd4bEl6VT0=|Encoded twice during the last key rotation]]\n" +
                    "updated: 2024-04-15",
                  id:
                    "module: fare-zone\n" +
                    "transfer_window_minutes: 90\n" +
                    "zone_override: { ward3: 40, ward7: 40, ward9: 40 }\n" +
                    "password_chain: [[encoded:V2pCdVpWUm9jakIwZEd4bEl6VT0=|Di-encode dua kali saat rotasi kunci terakhir]]\n" +
                    "updated: 2024-04-15",
                },
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content: {
              en: "Civic Transit Card staging server.\nIf access breaks, check with the platform team before touching creds.",
              id: "Server staging Kartu Transit Kota.\nKalau akses gak berfungsi, hubungi tim platform dulu sebelum mengubah kredensial.",
            },
          },
        ],
      },
      compares: [
        {
          id: "fare-configs",
          label: { en: "Compare Configs", id: "Bandingkan Config" },
          pathA: ["etc", "fare_zones.old.yml"],
          pathB: ["etc", "fare_zones.new.yml"],
          requiredFacts: ["read-fare-old", "read-fare-new"],
          grantsFact: "compared-fare-configs",
        },
      ],
    },
  ],
};
