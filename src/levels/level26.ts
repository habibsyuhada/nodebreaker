import type { LevelDef } from "./types";

export const LEVEL_26: LevelDef = {
  id: "level-26",
  index: 25,
  title: { en: "Sunrise Diner Loyalty", id: "Loyalitas Sunrise Diner" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a diner's loyalty program backend.", id: "Target: backend program loyalitas sebuah diner." },
    {
      en: "No login page shortcuts here — you'll need to earn the credentials.",
      id: "Tidak ada jalan pintas di halaman login — kamu harus mencari kredensialnya sendiri.",
    },
  ],
  entryNodeId: "sunrise-admin",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — loyalty admin unlocked.", id: "Kamu masuk — admin loyalitas terbuka." },
    { en: "LEVEL 26 COMPLETE.", id: "LEVEL 26 SELESAI." },
  ],
  parSeconds: 150,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Time to reopen the points ledger.", id: "Saatnya buka lagi buku poinnya." },
    cards: [
      {
        id: "l26-harm",
        kind: "victim",
        channel: { en: "Sunrise Diner — Support Chat", id: "Sunrise Diner — Chat Dukungan" },
        author: { en: "Greg", id: "Greg" },
        meta: { en: "Day 5", id: "Hari ke-5" },
        body: [
          {
            en: "I had enough points for a free breakfast, saved up over a year. App now shows zero and says points 'expired' — the terms never mentioned an expiration.",
            id: "Poin saya cukup buat sarapan gratis, dikumpulin setahun. Aplikasinya sekarang nunjukin nol dan bilang poinnya 'kedaluwarsa' — syarat & ketentuannya gak pernah nyebut soal kedaluwarsa.",
          },
        ],
      },
      {
        id: "l26-gloat",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "owner_dee", id: "owner_dee" },
        body: [
          {
            en: "Zeroed out every balance over 500 points before the slow season. Nobody reads the fine print until they're already out the door.",
            id: "Nol-kan semua saldo di atas 500 poin sebelum musim sepi. Gak ada yang baca detail sampai mereka udah keluar pintu.",
          },
          { en: "They'll just start over.", id: "Mereka bakal mulai dari nol lagi aja." },
        ],
      },
      {
        id: "l26-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Loyalty admin panel. A shop this small usually reuses one memorable login for everything.",
            id: "Panel admin loyalitas. Toko sekecil ini biasanya pakai satu login gampang diingat buat semuanya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Every balance just came back.", id: "Semua saldo baru saja kembali." },
    cards: [
      {
        id: "l26-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored every zeroed balance and disabled the silent expiration job for good.",
            id: "Pulihkan semua saldo yang di-nol-kan dan matikan job kedaluwarsa senyap itu untuk selamanya.",
          },
        ],
        answers: "l26-plan",
      },
      {
        id: "l26-outro-relief",
        kind: "victim",
        channel: { en: "Sunrise Diner — Support Chat", id: "Sunrise Diner — Chat Dukungan" },
        author: { en: "Greg", id: "Greg" },
        body: [
          {
            en: "Points are back, all of them. Free breakfast finally happened this morning.",
            id: "Poinnya balik lagi, semuanya. Sarapan gratisnya akhirnya kejadian pagi ini.",
          },
        ],
        answers: "l26-harm",
      },
      {
        id: "l26-outro-panic",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "owner_dee", id: "owner_dee" },
        body: [{ en: "who restored the zeroed balances", id: "siapa yang pulihkan saldo yang di-nol-kan" }],
      },
    ],
  },
  nodes: [
    {
      id: "sunrise-admin",
      ip: "203.0.113.84",
      orgName: "Sunrise Diner",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.19 | Sunrise Diner loyalty admin login" }],
      users: [{ username: "owner_dee", password: "dee1987", role: "owner" }],
      systemUsers: [],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "about-us.txt",
            kind: "file",
            content: {
              en:
                "Sunrise Diner — serving this block breakfast since way back.\n\n" +
                "Fun fact from the old site relaunch notes: the very first admin handle here was " +
                "just the owner's name and her birth year —\n" +
                "[[pattern:dee1987|Owner's name + birth year, an old admin handle]] —\n" +
                "from back when nobody worried much about security.",
              id:
                "Sunrise Diner — melayani sarapan blok ini sejak lama.\n\n" +
                "Fakta menarik dari catatan relaunch situs lama: handle admin pertama di sini " +
                "cuma nama pemilik ditambah tahun lahirnya —\n" +
                "[[pattern:dee1987|Nama pemilik + tahun lahir, handle admin lama]] —\n" +
                "dari masa saat belum ada yang terlalu peduli soal keamanan.",
            },
          },
          {
            name: "menu.csv",
            kind: "file",
            content: "sku,name,price\nSUN-01,Classic Breakfast,9.50\nSUN-02,Pancake Stack,7.00",
          },
          {
            name: "backup",
            kind: "dir",
            children: [
              {
                name: "README.txt",
                kind: "file",
                content: {
                  en: "Nightly backups land here automatically.\nPurge old admin exports once you're done with them.",
                  id: "Backup malam otomatis tersimpan di sini.\nHapus ekspor admin lama setelah selesai dipakai.",
                },
              },
              {
                name: "owner_backup.csv",
                kind: "file",
                content: {
                  en: "export_date,admin_user,last_login\n2019-11-03,[[username:owner_dee|Backup admin username]],2019-10-30",
                  id: "export_date,admin_user,last_login\n2019-11-03,[[username:owner_dee|Username admin backup]],2019-10-30",
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
