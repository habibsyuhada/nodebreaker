import type { LevelDef } from "./types";

export const LEVEL_17: LevelDef = {
  id: "level-17",
  index: 16,
  title: { en: "Rooftop Solar Meter", id: "Meteran Solar Atap" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: an HOA-managed rooftop solar meter.", id: "Target: meteran solar atap yang dikelola HOA." },
    {
      en: "No intrusion detection on this device. Take your time.",
      id: "Tidak ada deteksi intrusi di perangkat ini. Santai saja.",
    },
  ],
  entryNodeId: "solar-meter",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — meter admin panel unlocked.", id: "Kamu masuk — panel admin meteran terbuka." },
    { en: "LEVEL 17 COMPLETE.", id: "LEVEL 17 SELESAI." },
  ],
  parSeconds: 90,
  coldOpen: true,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "The credit was always his. Now it shows.", id: "Kreditnya memang selalu miliknya. Sekarang baru kelihatan." },
    cards: [
      {
        id: "l17-harm",
        kind: "victim",
        channel: { en: "HOA Portal — Solar Credits", id: "Portal HOA — Kredit Solar" },
        author: { en: "Wayan (Unit 12)", id: "Wayan (Unit 12)" },
        body: [
          {
            en: "My panels produce more than the app credits me for every single month. HOA says the meter reading is 'final and not disputable.'",
            id: "Panel saya produksi lebih banyak dari yang dikredit aplikasi tiap bulan. HOA bilang pembacaan meteran 'final dan tidak bisa disengketakan.'",
          },
        ],
      },
      {
        id: "l17-gloat",
        kind: "perp",
        channel: { en: "DM — HOA Treasurer to a board member", id: "DM — Bendahara HOA ke anggota dewan" },
        author: { en: "HOA Treasurer", id: "Bendahara HOA" },
        body: [
          {
            en: "The meter skims 8% before it reports out. Covers the HOA's 'grid maintenance fee' without anyone voting on a rate hike.",
            id: "Meterannya motong 8% sebelum dilaporkan. Nutupin 'biaya perawatan jaringan' HOA tanpa perlu ada yang voting kenaikan tarif.",
          },
          { en: "Nobody audits the firmware.", id: "Gak ada yang audit firmware-nya." },
        ],
      },
      {
        id: "l17-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Meter admin panel. Vendor boxes like this almost never get their factory password touched.",
            id: "Panel admin meteran. Kotak vendor kayak gini hampir gak pernah diganti password bawaannya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The skim is gone. The credit is his.", id: "Potongannya hilang. Kreditnya jadi miliknya." },
    cards: [
      {
        id: "l17-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Removed the 8% skim from the reporting firmware and backdated the credit correction to when it started.",
            id: "Hapus potongan 8% dari firmware pelaporan dan tetapkan koreksi kredit sejak awal mulai dipotong.",
          },
        ],
        answers: "l17-plan",
      },
      {
        id: "l17-outro-relief",
        kind: "victim",
        channel: { en: "HOA Portal — Solar Credits", id: "Portal HOA — Kredit Solar" },
        author: { en: "Wayan (Unit 12)", id: "Wayan (Unit 12)" },
        body: [
          {
            en: "Credit jumped up this month with a note calling it a 'calibration fix.' First time the number matched the panels.",
            id: "Kreditnya naik bulan ini dengan catatan 'perbaikan kalibrasi.' Pertama kalinya angkanya cocok sama panelnya.",
          },
        ],
        answers: "l17-harm",
      },
      {
        id: "l17-outro-panic",
        kind: "perp",
        channel: { en: "DM — HOA Treasurer to a board member", id: "DM — Bendahara HOA ke anggota dewan" },
        author: { en: "HOA Treasurer", id: "Bendahara HOA" },
        body: [{ en: "who touched the meter firmware", id: "siapa yang utak-atik firmware meterannya" }],
      },
    ],
  },
  nodes: [
    {
      id: "solar-meter",
      ip: "192.168.1.55",
      orgName: "Private Residence — Rooftop Solar Meter",
      traceEnabled: false,
      ports: [
        {
          port: 80,
          service: "http",
          banner: "SunGrid SG-410 | Meter Admin [[version:v2.0|Meter firmware version]] (default firmware)",
        },
      ],
      users: [{ username: "meter", password: "meter", role: "admin" }],
      systemUsers: [],
      quickLogin: {
        requiredFacts: ["read-install-note"],
        username: "meter",
        password: "meter",
        label: { en: "Login (meter/meter — factory default)", id: "Login (meter/meter — bawaan pabrik)" },
      },
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "generation_log.csv",
            kind: "file",
            content:
              "date,panels_kwh,credited_kwh\n2024-06-01,42.0,38.6\n2024-06-02,39.5,36.3\n2024-06-03,41.0,37.7",
          },
          {
            name: "install_note.txt",
            kind: "file",
            grantsFact: "read-install-note",
            content: {
              en:
                "Installer note: HOA never scheduled the follow-up visit to set a real admin password. " +
                "Still shipping with the factory default two years later.",
              id:
                "Catatan pemasang: HOA belum pernah jadwalkan kunjungan lanjutan untuk atur password admin asli. " +
                "Masih pakai bawaan pabrik sampai dua tahun kemudian.",
            },
          },
        ],
      },
    },
  ],
};
