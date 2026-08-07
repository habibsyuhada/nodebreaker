import type { LevelDef } from "./types";

export const LEVEL_01: LevelDef = {
  id: "level-01",
  index: 0,
  title: "Neighbor's Router",
  briefing: [
    "Connection established.",
    "Target: unsecured router on the local subnet.",
    "No intrusion detection on this device. Take your time.",
  ],
  entryNodeId: "router",
  successText: ["ACCESS GRANTED.", "You're in — admin panel unlocked.", "LEVEL 1 COMPLETE."],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Someone should even the line.", id: "Saatnya menyamakan jalur." },
    cards: [
      {
        id: "l1-context",
        kind: "system",
        channel: { en: "Building WiFi — Group Chat", id: "WiFi Gedung — Grup Chat" },
        author: { en: "Building Admin (pinned)", id: "Admin Gedung (disematkan)" },
        body: [
          {
            en: "Reminder: this line is shared across all six units. Outages? Contact your ISP, not the building.",
            id: "Pengingat: jalur ini dipakai bersama oleh enam unit. Ada gangguan? Hubungi ISP kalian, bukan pengelola gedung.",
          },
        ],
      },
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
        id: "l1-brushoff",
        kind: "system",
        channel: { en: "Building WiFi — Group Chat", id: "WiFi Gedung — Grup Chat" },
        author: { en: "Building Admin (pinned)", id: "Admin Gedung (disematkan)" },
        body: [
          {
            en: "No outages reported on our end. Please contact your ISP.",
            id: "Tidak ada laporan gangguan dari pihak kami. Silakan hubungi ISP Anda.",
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
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The line's even now.", id: "Jalurnya sudah rata sekarang." },
    cards: [
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
        id: "l1-outro-cap",
        kind: "system",
        channel: { en: "Building WiFi — Group Chat", id: "WiFi Gedung — Grup Chat" },
        author: { en: "Building Admin (pinned)", id: "Admin Gedung (disematkan)" },
        body: [
          {
            en: "Bandwidth cap applied to unit 4B. Traffic now shared evenly across all six units.",
            id: "Batas bandwidth diterapkan ke unit 4B. Lalu lintas kini dibagi rata ke enam unit.",
          },
        ],
        answers: "l1-brushoff",
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
        label: "Login (admin/admin — factory default)",
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
                content:
                  "192.168.1.14  AA:BB:CC:11:22:33  [[pattern:living-room-tv|DHCP hostname]]\n192.168.1.23  AA:BB:CC:44:55:66  [[username:johns-laptop|DHCP hostname — possible username]]",
              },
            ],
          },
          {
            name: "notes.txt",
            kind: "file",
            grantsFact: "read-notes",
            content:
              "Reminder to self:\n\nStill haven't logged into the router admin panel to change\nanything since the ISP tech set it up. Everything's probably\nstill on whatever it shipped with out of the box.\n\n- M",
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
