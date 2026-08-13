import type { LevelDef } from "./types";

export const LEVEL_09: LevelDef = {
  id: "level-09",
  index: 8,
  title: { en: "Package Locker Kiosk", id: "Kios Loker Paket" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    {
      en: "Target: an apartment building's package locker kiosk.",
      id: "Target: kios loker paket sebuah apartemen.",
    },
    {
      en: "No intrusion detection on this device. Take your time.",
      id: "Tidak ada deteksi intrusi di perangkat ini. Santai saja.",
    },
  ],
  entryNodeId: "locker-kiosk",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — kiosk admin panel unlocked.", id: "Kamu masuk — panel admin kios terbuka." },
    { en: "LEVEL 9 COMPLETE.", id: "LEVEL 9 SELESAI." },
  ],
  parSeconds: 90,
  coldOpen: true,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Every fee needs a reason. This one doesn't have one.", id: "Setiap biaya butuh alasan. Yang ini gak punya." },
    cards: [
      {
        id: "l9-harm",
        kind: "victim",
        channel: { en: "Building Chat — #residents", id: "Grup Warga — #penghuni" },
        author: { en: "Ester (Unit 5C)", id: "Ester (Unit 5C)" },
        body: [
          {
            en: "Third time this month the locker's charged me a 'late pickup fee' for a package I collected the same day it arrived. Support just says 'system says otherwise.'",
            id: "Sudah ketiga kalinya bulan ini loker nge-charge 'biaya telat ambil' padahal saya ambil paketnya hari itu juga. Support cuma bilang 'sistem bilang lain.'",
          },
        ],
      },
      {
        id: "l9-gloat",
        kind: "perp",
        channel: { en: "DM — Facilities Manager to vendor rep", id: "DM — Manajer Fasilitas ke rep vendor" },
        author: { en: "Facilities Manager", id: "Manajer Fasilitas" },
        body: [
          {
            en: "The 'late fee' timer starts on delivery, not notification. Half the building doesn't get the text until hours later. Free money.",
            id: "Timer 'biaya telat' mulai dari waktu paket masuk, bukan notifikasi. Setengah gedung baru dapat SMS-nya beberapa jam kemudian. Duit gratis.",
          },
          { en: "Nobody's ever checked the logs.", id: "Belum pernah ada yang cek log-nya." },
        ],
      },
      {
        id: "l9-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Kiosk admin panel. These vendor boxes almost never get their factory password touched.",
            id: "Panel admin kios. Kotak vendor kayak gini hampir gak pernah diganti password bawaannya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The timer starts on notification now.", id: "Timernya sekarang mulai dari notifikasi." },
    cards: [
      {
        id: "l9-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Refunded every late fee this quarter and repointed the timer to start on notification, not delivery.",
            id: "Refund semua biaya telat kuartal ini dan ubah timer supaya mulai dari notifikasi, bukan waktu paket masuk.",
          },
        ],
        answers: "l9-plan",
      },
      {
        id: "l9-outro-relief",
        kind: "victim",
        channel: { en: "Building Chat — #residents", id: "Grup Warga — #penghuni" },
        author: { en: "Ester (Unit 5C)", id: "Ester (Unit 5C)" },
        body: [
          {
            en: "Got three fees refunded with no explanation needed. Whole building's chat is asking the same question now.",
            id: "Tiga biaya saya di-refund tanpa perlu penjelasan. Seisi grup warga sekarang nanya hal yang sama.",
          },
        ],
        answers: "l9-harm",
      },
      {
        id: "l9-outro-panic",
        kind: "perp",
        channel: { en: "DM — Facilities Manager to vendor rep", id: "DM — Manajer Fasilitas ke rep vendor" },
        author: { en: "Facilities Manager", id: "Manajer Fasilitas" },
        body: [{ en: "who touched the kiosk config", id: "siapa yang utak-atik config kios" }],
      },
    ],
  },
  nodes: [
    {
      id: "locker-kiosk",
      ip: "192.168.1.40",
      orgName: "Private Residence — Package Locker Kiosk",
      traceEnabled: false,
      ports: [
        {
          port: 80,
          service: "http",
          banner: "LockerBox LB-200 | Kiosk Admin [[version:v3.1|Kiosk firmware version]] (default firmware)",
        },
      ],
      users: [{ username: "kiosk", password: "kiosk", role: "admin" }],
      systemUsers: [],
      quickLogin: {
        requiredFacts: ["read-service-note"],
        username: "kiosk",
        password: "kiosk",
        label: { en: "Login (kiosk/kiosk — factory default)", id: "Login (kiosk/kiosk — bawaan pabrik)" },
      },
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "fee_log.csv",
            kind: "file",
            content:
              "unit,delivered,notified,fee_charged\n" +
              "5C,09:02,13:47,4.00\n" +
              "5C,10:15,14:30,4.00\n" +
              "5C,08:50,12:10,4.00",
          },
          {
            name: "service_note.txt",
            kind: "file",
            grantsFact: "read-service-note",
            content: {
              en:
                "Installer note: kiosk shipped without a proper admin password. Building manager " +
                "said they'd change it later. That was two years ago.",
              id:
                "Catatan pemasang: kios dikirim tanpa password admin yang layak. Manajer gedung bilang " +
                "akan mengubahnya nanti. Itu dua tahun lalu.",
            },
          },
        ],
      },
    },
  ],
};
