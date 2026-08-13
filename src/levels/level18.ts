import type { LevelDef } from "./types";

export const LEVEL_18: LevelDef = {
  id: "level-18",
  index: 17,
  title: { en: "Riverbank Tutoring Co-op", id: "Koperasi Bimbel Riverbank" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a small tutoring co-op's admin backend.", id: "Target: backend admin koperasi bimbel kecil." },
    {
      en: "No login page shortcuts here — you'll need to earn the credentials.",
      id: "Tidak ada jalan pintas di halaman login — kamu harus mencari kredensialnya sendiri.",
    },
  ],
  entryNodeId: "riverbank-admin",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — scheduling admin unlocked.", id: "Kamu masuk — admin penjadwalan terbuka." },
    { en: "LEVEL 18 COMPLETE.", id: "LEVEL 18 SELESAI." },
  ],
  parSeconds: 150,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Time to reopen the tutor roster.", id: "Saatnya buka lagi daftar pengajarnya." },
    cards: [
      {
        id: "l18-harm",
        kind: "victim",
        channel: { en: "Riverbank Co-op — Support Chat", id: "Riverbank Co-op — Chat Dukungan" },
        author: { en: "Nadia (Tutor)", id: "Nadia (Pengajar)" },
        meta: { en: "Day 9", id: "Hari ke-9" },
        body: [
          {
            en: "I've been marked 'inactive' and my sessions got reassigned, but I never requested time off. Nobody at the co-op will explain why.",
            id: "Saya ditandai 'tidak aktif' dan sesi saya dialihkan, padahal saya gak pernah minta cuti. Gak ada yang di koperasi mau jelasin kenapa.",
          },
        ],
      },
      {
        id: "l18-gloat",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "ramonc", id: "ramonc" },
        body: [
          {
            en: "Nadia's rate is higher than the newer tutors. Marked her inactive, moved her students to cheaper staff. She'll assume it's seasonal.",
            id: "Tarif Nadia lebih tinggi dari pengajar baru. Tandai dia tidak aktif, pindahkan siswanya ke staf yang lebih murah. Dia bakal ngira itu cuma musiman.",
          },
        ],
      },
      {
        id: "l18-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Scheduling admin panel. A co-op this small usually reuses one memorable login for everything.",
            id: "Panel admin penjadwalan. Koperasi sekecil ini biasanya pakai satu login gampang diingat buat semuanya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Her roster is back, rate and all.", id: "Daftarnya balik lagi, tarif dan semuanya." },
    cards: [
      {
        id: "l18-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored Nadia's active status and reassigned her students back, with a note explaining the 'system error.'",
            id: "Pulihkan status aktif Nadia dan kembalikan siswanya, dengan catatan menjelaskan 'kesalahan sistem.'",
          },
        ],
        answers: "l18-plan",
      },
      {
        id: "l18-outro-relief",
        kind: "victim",
        channel: { en: "Riverbank Co-op — Support Chat", id: "Riverbank Co-op — Chat Dukungan" },
        author: { en: "Nadia (Tutor)", id: "Nadia (Pengajar)" },
        body: [
          {
            en: "Schedule's back to normal, no explanation needed. Weird week, but I'll take it.",
            id: "Jadwalnya normal lagi, gak perlu penjelasan lagi. Minggu yang aneh, tapi ya sudahlah.",
          },
        ],
        answers: "l18-harm",
      },
      {
        id: "l18-outro-panic",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "ramonc", id: "ramonc" },
        body: [{ en: "who reactivated her account", id: "siapa yang aktifkan lagi akunnya" }],
      },
    ],
  },
  nodes: [
    {
      id: "riverbank-admin",
      ip: "203.0.113.72",
      orgName: "Riverbank Tutoring Co-op",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.20 | Riverbank scheduling admin login" }],
      users: [{ username: "ramonc", password: "ramon1989", role: "coordinator" }],
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
                "Riverbank Tutoring Co-op — neighbors helping neighbors' kids since way back.\n\n" +
                "Fun fact from the old site relaunch notes: the very first admin handle here was " +
                "just the coordinator's name and his birth year —\n" +
                "[[pattern:ramon1989|Coordinator's name + birth year, an old admin handle]] —\n" +
                "from back when nobody worried much about security.",
              id:
                "Koperasi Bimbel Riverbank — tetangga bantu anak tetangga sejak lama.\n\n" +
                "Fakta menarik dari catatan relaunch situs lama: handle admin pertama di sini " +
                "cuma nama koordinator ditambah tahun lahirnya —\n" +
                "[[pattern:ramon1989|Nama koordinator + tahun lahir, handle admin lama]] —\n" +
                "dari masa saat belum ada yang terlalu peduli soal keamanan.",
            },
          },
          {
            name: "tutors.csv",
            kind: "file",
            content: "id,name,subject,rate\nT-01,Nadia,Math,28.00\nT-02,J. Kwan,Science,22.00",
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
                name: "coordinator_backup.csv",
                kind: "file",
                content: {
                  en: "export_date,admin_user,last_login\n2020-02-14,[[username:ramonc|Backup admin username]],2020-02-10",
                  id: "export_date,admin_user,last_login\n2020-02-14,[[username:ramonc|Username admin backup]],2020-02-10",
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
