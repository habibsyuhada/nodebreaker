import type { LevelDef } from "./types";

export const LEVEL_21: LevelDef = {
  id: "level-21",
  index: 20,
  title: { en: "Elm Street Grid Substation", id: "Substation Grid Jalan Elm" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: Elm Street Grid Substation.", id: "Target: Substation Grid Jalan Elm." },
    {
      en: "The outage-report portal is public-facing — the real grid controls live somewhere else.",
      id: "Portal laporan pemadaman ini terbuka untuk publik — kontrol grid yang asli ada di tempat lain.",
    },
  ],
  entryNodeId: "elm-public",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — internal restoration queue unlocked.", id: "Kamu masuk — antrean pemulihan internal terbuka." },
    { en: "LEVEL 21 COMPLETE.", id: "LEVEL 21 SELESAI." },
  ],
  parSeconds: 260,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Some queues never needed to be fair to begin with.", id: "Beberapa antrean memang dari awal gak pernah dibuat adil." },
    cards: [
      {
        id: "l21-context",
        kind: "system",
        channel: { en: "Internal Ops — Restoration Queue", id: "Ops Internal — Antrean Pemulihan" },
        author: { en: "Dashboard", id: "Dasbor" },
        body: [
          { en: "Ward 3 average restoration time: 6.2 hrs. Ward 1 average: 1.4 hrs.", id: "Rata-rata pemulihan Wilayah 3: 6,2 jam. Rata-rata Wilayah 1: 1,4 jam." },
        ],
      },
      {
        id: "l21-harm",
        kind: "victim",
        channel: { en: "Outage Portal — Message Center", id: "Portal Pemadaman — Pusat Pesan" },
        author: { en: "Resident (Ticket #4102)", id: "Warga (Tiket #4102)" },
        meta: { en: "Follow-up #3", id: "Tindak lanjut #3" },
        body: [
          {
            en: "Power's been out for 5 hours on our block. The outage map shows crews already dispatched two blocks over, twice, since this started.",
            id: "Listrik mati sudah 5 jam di blok kami. Peta pemadaman nunjukin kru sudah dikirim ke dua blok sebelah, dua kali, sejak ini mulai.",
          },
        ],
      },
      {
        id: "l21-brushoff",
        kind: "system",
        channel: { en: "Outage Portal — Message Center", id: "Portal Pemadaman — Pusat Pesan" },
        author: { en: "Grid Support (auto)", id: "Dukungan Grid (otomatis)" },
        body: [
          {
            en: "Crews are prioritized per standard protocol. Estimated restoration time will update automatically.",
            id: "Kru diprioritaskan sesuai protokol standar. Perkiraan waktu pemulihan akan diperbarui otomatis.",
          },
        ],
      },
      {
        id: "l21-gloat",
        kind: "perp",
        channel: { en: "Internal Ops — #grid-priority", id: "Ops Internal — #grid-priority" },
        author: { en: "Grid Ops Manager", id: "Manajer Ops Grid" },
        body: [
          {
            en: "Keep Ward 3 low in the priority queue. Their service contract's the cheapest tier — let the premium wards see the fast numbers.",
            id: "Jaga Wilayah 3 tetap rendah di antrean prioritas. Kontrak layanan mereka tier termurah — biarkan wilayah premium yang lihat angka cepat.",
          },
        ],
      },
      {
        id: "l21-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Public portal won't have logins — but it'll leak something pointing at the real system.",
            id: "Portal publik gak bakal punya login — tapi pasti ada yang bocor nunjuk ke sistem aslinya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The tier weighting is gone. The queue is honest now.", id: "Pembobotan tier-nya hilang. Antreannya sekarang jujur." },
    cards: [
      {
        id: "l21-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Reused email/password combo. Straight into the internal queue — grabbed the priority memo and reordered the queue by outage time, not contract tier.",
            id: "Kombinasi email/password yang dipakai ulang. Langsung masuk ke antrean internal — ambil memo prioritas dan urutkan ulang antrean berdasarkan waktu pemadaman, bukan tier kontrak.",
          },
        ],
        answers: "l21-plan",
      },
      {
        id: "l21-outro-relief",
        kind: "victim",
        channel: { en: "Outage Portal — Message Center", id: "Portal Pemadaman — Pusat Pesan" },
        author: { en: "Resident (Ticket #4102)", id: "Warga (Tiket #4102)" },
        body: [
          {
            en: "Crew showed up within the hour. First time this block's outage got fixed before the sun came up.",
            id: "Kru datang dalam sejam. Pertama kalinya pemadaman di blok ini beres sebelum matahari terbit.",
          },
        ],
        answers: "l21-harm",
      },
      {
        id: "l21-outro-memo",
        kind: "public",
        channel: { en: "Internal Ops — #grid-priority", id: "Ops Internal — #grid-priority" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Tier-priority memo exported. Restoration queue reordered by outage duration for the rest of the shift.",
            id: "Memo prioritas tier diekspor. Antrean pemulihan diurutkan ulang berdasarkan durasi pemadaman untuk sisa shift.",
          },
        ],
        answers: "l21-gloat",
      },
      {
        id: "l21-outro-panic",
        kind: "perp",
        channel: { en: "Internal Ops — #grid-priority", id: "Ops Internal — #grid-priority" },
        author: { en: "Grid Ops Manager", id: "Manajer Ops Grid" },
        body: [{ en: "who reordered the queue", id: "siapa yang urutkan ulang antreannya" }],
      },
    ],
  },
  nodes: [
    {
      id: "elm-public",
      ip: "203.0.113.101",
      orgName: "Elm Street Grid Substation — Outage Portal",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.20 | Elm Street public outage portal" }],
      users: [],
      systemUsers: [],
      pivots: [
        {
          id: "to-internal",
          targetNodeId: "elm-internal",
          label: { en: "Pivot to 192.168.70.15", id: "Pivot ke 192.168.70.15" },
          requiredFacts: ["found-internal-ip"],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "about.txt",
            kind: "file",
            content: {
              en: "Elm Street Grid Substation outage portal.\nReport outages, check restoration estimates.",
              id: "Portal pemadaman Substation Grid Jalan Elm.\nLaporkan pemadaman, cek perkiraan pemulihan.",
            },
          },
          {
            name: "contact.txt",
            kind: "file",
            grantsFact: "read-staff-contacts",
            content: {
              en:
                "Need help reporting an outage?\n\n" +
                "IT Support — [[username:dpatel|Also used for internal systems]] / " +
                "[[email:dpatel@ferroviasystems.com|IT support contact — listed on several public pages]]\n" +
                "Dispatch — dispatch@ferroviasystems.com",
              id:
                "Butuh bantuan melaporkan pemadaman?\n\n" +
                "IT Support — [[username:dpatel|Juga dipakai untuk sistem internal]] / " +
                "[[email:dpatel@ferroviasystems.com|Kontak dukungan IT — tercantum di beberapa halaman publik]]\n" +
                "Dispatch — dispatch@ferroviasystems.com",
            },
          },
          {
            name: "robots.txt",
            kind: "file",
            grantsFact: "found-internal-ip",
            content: {
              en:
                "User-agent: *\n" +
                "Disallow: /admin\n" +
                "Disallow: /grid/internal\n" +
                "# TODO: retire link to the legacy restoration dashboard " +
                "([[path:192.168.70.15|Leftover internal IP, left in a public robots.txt]]) once migration finishes",
              id:
                "User-agent: *\n" +
                "Disallow: /admin\n" +
                "Disallow: /grid/internal\n" +
                "# TODO: hapus link ke dashboard pemulihan lama " +
                "([[path:192.168.70.15|IP internal yang ketinggalan, ada di robots.txt publik]]) setelah migrasi selesai",
            },
          },
        ],
      },
    },
    {
      id: "elm-internal",
      ip: "192.168.70.15",
      orgName: "Elm Street Grid Substation — Internal Ops",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | restoration-dashboard (internal, staff VPN only)" }],
      users: [{ username: "dpatel", password: "Volt$urge42", role: "grid ops" }],
      systemUsers: [
        { username: "dpatel", role: "grid ops" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-public",
          targetNodeId: "elm-public",
          label: { en: "Pivot to 203.0.113.101", id: "Pivot ke 203.0.113.101" },
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "README.txt",
            kind: "file",
            content: {
              en: "Internal restoration dashboard. Authorized grid staff only.\nContact IT if you've lost access.",
              id: "Dashboard pemulihan internal. Hanya untuk staf grid yang berwenang.\nHubungi IT kalau kamu kehilangan akses.",
            },
          },
        ],
      },
    },
  ],
};
