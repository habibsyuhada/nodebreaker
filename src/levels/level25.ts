import type { LevelDef } from "./types";

export const LEVEL_25: LevelDef = {
  id: "level-25",
  index: 24,
  title: { en: "Community Garden Timer", id: "Timer Kebun Komunitas" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a community garden's irrigation controller.", id: "Target: pengontrol irigasi kebun komunitas." },
    {
      en: "No intrusion detection on this device. Take your time.",
      id: "Tidak ada deteksi intrusi di perangkat ini. Santai saja.",
    },
  ],
  entryNodeId: "garden-timer",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — irrigation admin panel unlocked.", id: "Kamu masuk — panel admin irigasi terbuka." },
    { en: "LEVEL 25 COMPLETE.", id: "LEVEL 25 SELESAI." },
  ],
  parSeconds: 90,
  coldOpen: true,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Every plot gets its turn now.", id: "Sekarang setiap petak dapat gilirannya." },
    cards: [
      {
        id: "l25-harm",
        kind: "victim",
        channel: { en: "Garden Chat — #plot-holders", id: "Grup Kebun — #pemilik-petak" },
        author: { en: "Ibu Sari (Plot 14)", id: "Ibu Sari (Petak 14)" },
        body: [
          {
            en: "My plot's watering schedule keeps getting bumped to 3 AM, and only mine. Everyone else still gets the 6 PM slot.",
            id: "Jadwal penyiraman petak saya terus digeser ke jam 3 pagi, cuma punya saya. Yang lain masih dapat slot jam 6 sore.",
          },
        ],
      },
      {
        id: "l25-gloat",
        kind: "perp",
        channel: { en: "DM — Garden Committee Chair to a friend", id: "DM — Ketua Panitia Kebun ke teman" },
        author: { en: "Committee Chair", id: "Ketua Panitia" },
        body: [
          {
            en: "Sari's plot borders mine. Bump hers to the worst slot, mine stays prime. Nobody ever checks the scheduler.",
            id: "Petak Sari berbatasan sama punya saya. Geser jadwal dia ke slot terburuk, punya saya tetap prima. Gak ada yang pernah cek scheduler-nya.",
          },
        ],
      },
      {
        id: "l25-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Irrigation admin panel. These volunteer-run boxes almost never get their factory password touched.",
            id: "Panel admin irigasi. Kotak yang dikelola relawan kayak gini hampir gak pernah diganti password bawaannya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "6 PM, same as everyone else.", id: "Jam 6 sore, sama seperti yang lain." },
    cards: [
      {
        id: "l25-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Reset every plot's schedule to a fair rotation and locked the scheduler so no single plot can be singled out again.",
            id: "Reset jadwal semua petak ke rotasi yang adil dan kunci scheduler-nya biar gak ada petak yang bisa dipilih-pilih lagi.",
          },
        ],
        answers: "l25-plan",
      },
      {
        id: "l25-outro-relief",
        kind: "victim",
        channel: { en: "Garden Chat — #plot-holders", id: "Grup Kebun — #pemilik-petak" },
        author: { en: "Ibu Sari (Plot 14)", id: "Ibu Sari (Petak 14)" },
        body: [
          {
            en: "Watering's back to 6 PM. Whole garden's rotation looks even now, not just mine.",
            id: "Penyiraman balik ke jam 6 sore. Rotasi seluruh kebun sekarang kelihatan rata, bukan cuma punya saya.",
          },
        ],
        answers: "l25-harm",
      },
      {
        id: "l25-outro-panic",
        kind: "perp",
        channel: { en: "DM — Garden Committee Chair to a friend", id: "DM — Ketua Panitia Kebun ke teman" },
        author: { en: "Committee Chair", id: "Ketua Panitia" },
        body: [{ en: "who touched the scheduler", id: "siapa yang utak-atik scheduler-nya" }],
      },
    ],
  },
  nodes: [
    {
      id: "garden-timer",
      ip: "192.168.1.62",
      orgName: "Private Residence — Community Garden Timer",
      traceEnabled: false,
      ports: [
        {
          port: 80,
          service: "http",
          banner: "AquaFlow AF-100 | Timer Admin [[version:v1.4|Timer firmware version]] (default firmware)",
        },
      ],
      users: [{ username: "timer", password: "timer", role: "admin" }],
      systemUsers: [],
      quickLogin: {
        requiredFacts: ["read-install-note"],
        username: "timer",
        password: "timer",
        label: { en: "Login (timer/timer — factory default)", id: "Login (timer/timer — bawaan pabrik)" },
      },
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "schedule.csv",
            kind: "file",
            content: "plot,slot\n11,18:00\n12,18:00\n13,18:00\n14,03:00\n15,18:00",
          },
          {
            name: "install_note.txt",
            kind: "file",
            grantsFact: "read-install-note",
            content: {
              en:
                "Installer note: the committee never scheduled a follow-up visit to set a real admin " +
                "password. Still shipping with the factory default two seasons later.",
              id:
                "Catatan pemasang: panitia belum pernah jadwalkan kunjungan lanjutan untuk atur password " +
                "admin asli. Masih pakai bawaan pabrik sampai dua musim kemudian.",
            },
          },
        ],
      },
    },
  ],
};
