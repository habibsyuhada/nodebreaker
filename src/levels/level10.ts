import type { LevelDef } from "./types";

export const LEVEL_10: LevelDef = {
  id: "level-10",
  index: 9,
  title: { en: "Riverbend Driving School", id: "Sekolah Mengemudi Riverbend" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a small driving school's admin backend.", id: "Target: backend admin sekolah mengemudi kecil." },
    {
      en: "No login page shortcuts here — you'll need to earn the credentials.",
      id: "Tidak ada jalan pintas di halaman login — kamu harus mencari kredensialnya sendiri.",
    },
  ],
  entryNodeId: "riverbend-admin",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — booking admin unlocked.", id: "Kamu masuk — admin booking terbuka." },
    { en: "LEVEL 10 COMPLETE.", id: "LEVEL 10 SELESAI." },
  ],
  parSeconds: 150,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Time to reopen the booking calendar.", id: "Saatnya buka lagi kalender booking-nya." },
    cards: [
      {
        id: "l10-harm",
        kind: "victim",
        channel: { en: "Riverbend Booking — Support Chat", id: "Riverbend Booking — Chat Dukungan" },
        author: { en: "Dimas", id: "Dimas" },
        meta: { en: "Day 6", id: "Hari ke-6" },
        body: [
          {
            en: "I paid for 10 lessons in advance. The app now shows 'no active package' and support won't answer. My test is in two weeks.",
            id: "Saya sudah bayar 10 sesi di muka. Aplikasinya sekarang bilang 'tidak ada paket aktif' dan dukungan gak balas. Ujian saya dua minggu lagi.",
          },
        ],
      },
      {
        id: "l10-gloat",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "budip", id: "budip" },
        body: [
          {
            en: "Cash flow's tight this month. Marked a batch of prepaid packages 'expired' early — nobody reads the fine print on the renewal date.",
            id: "Arus kas lagi seret bulan ini. Tandai sekumpulan paket prabayar 'kedaluwarsa' lebih awal — gak ada yang baca detail tanggal perpanjangan.",
          },
          { en: "They'll just rebook.", id: "Mereka bakal booking ulang aja." },
        ],
      },
      {
        id: "l10-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Booking admin panel. A shop this small usually reuses one memorable login for everything.",
            id: "Panel admin booking. Toko sekecil ini biasanya pakai satu login gampang diingat buat semuanya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Every package just came back to life.", id: "Semua paket baru saja hidup lagi." },
    cards: [
      {
        id: "l10-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored every package marked 'expired' early and flagged the batch job so it can't run quietly again.",
            id: "Pulihkan semua paket yang ditandai 'kedaluwarsa' lebih awal dan tandai batch job-nya biar gak bisa jalan diam-diam lagi.",
          },
        ],
        answers: "l10-plan",
      },
      {
        id: "l10-outro-relief",
        kind: "victim",
        channel: { en: "Riverbend Booking — Support Chat", id: "Riverbend Booking — Chat Dukungan" },
        author: { en: "Dimas", id: "Dimas" },
        body: [
          {
            en: "Package is back, all 10 lessons showing again. Booked my test-prep session for this weekend.",
            id: "Paketnya balik lagi, semua 10 sesi muncul lagi. Sudah booking sesi persiapan ujian akhir pekan ini.",
          },
        ],
        answers: "l10-harm",
      },
      {
        id: "l10-outro-panic",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "budip", id: "budip" },
        body: [{ en: "who restored the expired batch", id: "siapa yang pulihkan batch yang kedaluwarsa" }],
      },
    ],
  },
  nodes: [
    {
      id: "riverbend-admin",
      ip: "203.0.113.61",
      orgName: "Riverbend Driving School",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.19 | Riverbend booking admin login" }],
      users: [{ username: "budip", password: "budi1994", role: "owner" }],
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
                "Riverbend Driving School — teaching this town to drive since way back.\n\n" +
                "Fun fact from the old site relaunch notes: the very first admin handle here was " +
                "just the owner's name and his birth year —\n" +
                "[[pattern:budi1994|Owner's name + birth year, an old admin handle]] —\n" +
                "from back when nobody worried much about security.",
              id:
                "Sekolah Mengemudi Riverbend — mengajar warga kota ini nyetir sejak lama.\n\n" +
                "Fakta menarik dari catatan relaunch situs lama: handle admin pertama di sini " +
                "cuma nama pemilik ditambah tahun lahirnya —\n" +
                "[[pattern:budi1994|Nama pemilik + tahun lahir, handle admin lama]] —\n" +
                "dari masa saat belum ada yang terlalu peduli soal keamanan.",
            },
          },
          {
            name: "packages.csv",
            kind: "file",
            content: "sku,name,lessons,price\nRVB-01,Starter Pack,5,150.00\nRVB-02,Test-Ready Pack,10,270.00",
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
                  en: "export_date,admin_user,last_login\n2021-04-02,[[username:budip|Backup admin username]],2021-03-30",
                  id: "export_date,admin_user,last_login\n2021-04-02,[[username:budip|Username admin backup]],2021-03-30",
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
