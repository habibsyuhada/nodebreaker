import type { LevelDef } from "./types";

export const LEVEL_01: LevelDef = {
  id: "level-01",
  index: 0,
  title: { en: "Neighbor's Router", id: "Router Tetangga" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    {
      en: "Target: unsecured router on the local subnet.",
      id: "Target: router tanpa pengamanan di subnet lokal.",
    },
    {
      en: "No intrusion detection on this device. Take your time.",
      id: "Tidak ada deteksi intrusi di perangkat ini. Santai saja.",
    },
  ],
  entryNodeId: "router",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — admin panel unlocked.", id: "Kamu masuk — panel admin terbuka." },
    { en: "LEVEL 1 COMPLETE.", id: "LEVEL 1 SELESAI." },
  ],
  // First-pass estimate (structural, not playtested) — see LevelDef.parSeconds's doc comment.
  parSeconds: 90,
  coldOpen: true,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Someone should even the line.", id: "Saatnya menyamakan jalur." },
    cards: [
      {
        id: "l1-harm",
        kind: "victim",
        channel: { en: "Building WiFi — Group Chat", id: "WiFi Gedung — Grup Chat" },
        author: { en: "Mrs. Adisa (4A)", id: "Bu Adisa (4A)" },
        meta: { en: "9:02 PM", id: "21:02" },
        body: [
          {
            en: "My grandson's online class keeps dropping every night around 9. Same time, every time. Anyone else's connection doing this?",
            id: "Kelas online cucu saya putus terus setiap malam sekitar jam 9. Selalu jam segitu. Ada yang lain ngalamin ini juga?",
          },
        ],
      },
      {
        id: "l1-gloat",
        kind: "perp",
        channel: { en: "DM — M to a friend", id: "DM — M ke teman" },
        author: { en: "M (4B)", id: "M (4B)" },
        body: [
          {
            en: "It's shared. Shared means first come, first served. What's she gonna do, call the ISP? It's in my name.",
            id: "Ini kan jalur bersama. Bersama artinya siapa cepat dia dapat. Emang dia mau ngapain, telepon ISP? Aktanya atas nama gue.",
          },
          { en: "She'll never figure it out.", id: "Dia gak bakal pernah nyadar." },
        ],
      },
      {
        id: "l1-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need into that router. Factory reset creds, probably — nobody in this building ever changes them.",
            id: "Perlu masuk ke router itu. Kemungkinan besar masih kredensial bawaan pabrik — gak ada yang pernah ganti di gedung ini.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The line's even now.", id: "Jalurnya sudah rata sekarang." },
    cards: [
      {
        id: "l1-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Capped 4B's bandwidth allocation. She'll never know why — she'll just have a working connection again.",
            id: "Batasi alokasi bandwidth 4B. Dia gak bakal pernah tahu kenapa — dia cuma bakal punya koneksi yang lancar lagi.",
          },
        ],
        answers: "l1-plan",
      },
      {
        id: "l1-outro-relief",
        kind: "victim",
        channel: { en: "Building WiFi — Group Chat", id: "WiFi Gedung — Grup Chat" },
        author: { en: "Mrs. Adisa (4A)", id: "Bu Adisa (4A)" },
        meta: { en: "9:04 PM", id: "21:04" },
        body: [
          {
            en: "Whole class tonight, no drops. Whatever changed — thank you.",
            id: "Kelas malam ini lancar penuh, gak putus sama sekali. Apa pun yang berubah — terima kasih.",
          },
        ],
        answers: "l1-harm",
      },
      {
        id: "l1-outro-panic",
        kind: "perp",
        channel: { en: "Building WiFi — Group Chat", id: "WiFi Gedung — Grup Chat" },
        author: { en: "M (4B)", id: "M (4B)" },
        meta: { en: "no replies", id: "tidak ada balasan" },
        body: [{ en: "anyone else's wifi feel weird?", id: "wifi kalian kerasa aneh gak sih?" }],
        answers: "l1-gloat",
      },
    ],
  },
  nodes: [
    {
      id: "router",
      ip: "192.168.1.1",
      orgName: "Private Residence — Apt 4B",
      traceEnabled: false,
      ports: [
        {
          port: 80,
          service: "http",
          banner:
            "RealTek RTL-WR840N | Web Admin [[version:v1.2|Router firmware version]] (default firmware)",
        },
      ],
      users: [{ username: "admin", password: "admin", role: "admin" }],
      systemUsers: [],
      quickLogin: {
        requiredFacts: ["read-notes"],
        username: "admin",
        password: "admin",
        label: { en: "Login (admin/admin — factory default)", id: "Login (admin/admin — bawaan pabrik)" },
      },
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "system",
            kind: "dir",
            children: [
              {
                name: "dhcp_leases.log",
                kind: "file",
                content: {
                  en: "192.168.1.14  AA:BB:CC:11:22:33  [[pattern:living-room-tv|DHCP hostname]]\n192.168.1.23  AA:BB:CC:44:55:66  [[username:johns-laptop|DHCP hostname — possible username]]",
                  id: "192.168.1.14  AA:BB:CC:11:22:33  [[pattern:living-room-tv|Nama host DHCP]]\n192.168.1.23  AA:BB:CC:44:55:66  [[username:johns-laptop|Nama host DHCP — kemungkinan username]]",
                },
              },
            ],
          },
          {
            name: "notes.txt",
            kind: "file",
            grantsFact: "read-notes",
            content: {
              en: "Reminder to self:\n\nStill haven't logged into the router admin panel to change\nanything since the ISP tech set it up. Everything's probably\nstill on whatever it shipped with out of the box.\n\n- M",
              id: "Pengingat untuk diri sendiri:\n\nBelum pernah login ke panel admin router untuk mengubah\napa pun sejak teknisi ISP memasangnya. Kemungkinan besar\nsemuanya masih pengaturan bawaan pabrik.\n\n- M",
            },
          },
          {
            name: "firmware.bin",
            kind: "file",
            readable: false,
          },
        ],
      },
    },
  ],
};
