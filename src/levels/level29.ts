import type { LevelDef } from "./types";

export const LEVEL_29: LevelDef = {
  id: "level-29",
  index: 28,
  title: { en: "Aurelia Investor Relations", id: "Investor Relations Aurelia" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: Aurelia Capital.", id: "Target: Aurelia Capital." },
    {
      en: "The investor portal is public-facing — the real portfolio ops live somewhere else.",
      id: "Portal investor ini terbuka untuk publik — operasi portofolio yang asli ada di tempat lain.",
    },
  ],
  entryNodeId: "aurelia-public",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — internal portfolio ops unlocked.", id: "Kamu masuk — ops portofolio internal terbuka." },
    { en: "LEVEL 29 COMPLETE.", id: "LEVEL 29 SELESAI." },
  ],
  parSeconds: 260,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Some doors don't need to be opened to be broken into.", id: "Beberapa pintu gak perlu dibuka untuk dibobol." },
    cards: [
      {
        id: "l29-context",
        kind: "system",
        channel: { en: "Internal Ops — Fee Queue", id: "Ops Internal — Antrean Biaya" },
        author: { en: "Dashboard", id: "Dasbor" },
        body: [
          { en: "Weekly management fee draw: on schedule. Disclosure exceptions: 3 pending.", id: "Penarikan biaya manajemen mingguan: sesuai jadwal. Pengecualian disclosure: 3 tertunda." },
        ],
      },
      {
        id: "l29-harm",
        kind: "victim",
        channel: { en: "Investor Portal — Message Center", id: "Portal Investor — Pusat Pesan" },
        author: { en: "Limited Partner (Fund III)", id: "Mitra Terbatas (Fund III)" },
        meta: { en: "Follow-up #2", id: "Tindak lanjut #2" },
        body: [
          {
            en: "The quarterly statement shows a management fee line I can't reconcile against the disclosed holdings. Nobody in investor relations will walk me through it.",
            id: "Laporan kuartalan nunjukin baris biaya manajemen yang gak bisa saya cocokkan sama aset yang diungkapkan. Gak ada di investor relations yang mau jelasin.",
          },
        ],
      },
      {
        id: "l29-brushoff",
        kind: "system",
        channel: { en: "Investor Portal — Message Center", id: "Portal Investor — Pusat Pesan" },
        author: { en: "Investor Relations (auto)", id: "Investor Relations (otomatis)" },
        body: [
          {
            en: "Your statement has been prepared per standard fund accounting practice. Please consult your advisor for reconciliation.",
            id: "Laporan Anda telah disusun sesuai praktik akuntansi dana standar. Silakan konsultasikan dengan penasihat Anda untuk rekonsiliasi.",
          },
        ],
      },
      {
        id: "l29-gloat",
        kind: "perp",
        channel: { en: "Internal Ops — #fund-accounting", id: "Ops Internal — #fund-accounting" },
        author: { en: "Fund Accounting Lead", id: "Kepala Akuntansi Dana" },
        body: [
          {
            en: "Route the reconciliation questions to advisors, not us. Most LPs give up before their advisor calls back.",
            id: "Arahkan pertanyaan rekonsiliasi ke penasihat, bukan ke kita. Kebanyakan LP nyerah sebelum penasihatnya telepon balik.",
          },
          { en: "The exceptions stay unexplained on purpose.", id: "Pengecualiannya memang sengaja gak dijelaskan." },
        ],
      },
      {
        id: "l29-plan",
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
    closer: { en: "The exceptions have an explanation now.", id: "Pengecualiannya sekarang punya penjelasan." },
    cards: [
      {
        id: "l29-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Reused email/password combo. Straight into internal ops — grabbed the fee exception memo and mailed it to the full LP roster.",
            id: "Kombinasi email/password yang dipakai ulang. Langsung masuk ke ops internal — ambil memo pengecualian biaya dan kirim ke seluruh daftar LP.",
          },
        ],
        answers: "l29-plan",
      },
      {
        id: "l29-outro-relief",
        kind: "victim",
        channel: { en: "Investor Portal — Message Center", id: "Portal Investor — Pusat Pesan" },
        author: { en: "Limited Partner (Fund III)", id: "Mitra Terbatas (Fund III)" },
        body: [
          {
            en: "Got the reconciliation memo unprompted this morning. First straight answer in three quarters.",
            id: "Dapat memo rekonsiliasi tanpa diminta pagi ini. Jawaban lurus pertama dalam tiga kuartal.",
          },
        ],
        answers: "l29-harm",
      },
      {
        id: "l29-outro-memo",
        kind: "public",
        channel: { en: "Internal Ops — #fund-accounting", id: "Ops Internal — #fund-accounting" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Fee exception memo exported and mailed to every limited partner on Fund III.",
            id: "Memo pengecualian biaya diekspor dan dikirim ke setiap mitra terbatas di Fund III.",
          },
        ],
        answers: "l29-gloat",
      },
      {
        id: "l29-outro-panic",
        kind: "perp",
        channel: { en: "Internal Ops — #fund-accounting", id: "Ops Internal — #fund-accounting" },
        author: { en: "Fund Accounting Lead", id: "Kepala Akuntansi Dana" },
        body: [{ en: "who mailed the exception memo", id: "siapa yang kirim memo pengecualian itu" }],
      },
    ],
  },
  nodes: [
    {
      id: "aurelia-public",
      ip: "203.0.113.77",
      orgName: "Aurelia Capital — Investor Portal",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.21 | Aurelia Capital investor portal" }],
      users: [],
      systemUsers: [],
      pivots: [
        {
          id: "to-internal",
          targetNodeId: "aurelia-internal",
          label: { en: "Pivot to 192.168.80.9", id: "Pivot ke 192.168.80.9" },
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
              en: "Aurelia Capital investor portal.\nView statements, message investor relations, download quarterly reports.",
              id: "Portal investor Aurelia Capital.\nLihat laporan, kirim pesan ke investor relations, unduh laporan kuartalan.",
            },
          },
          {
            name: "contact.txt",
            kind: "file",
            grantsFact: "read-staff-contacts",
            content: {
              en:
                "Need help with the investor portal?\n\n" +
                "IT Support — [[username:mreyes|Also used for internal systems]] / " +
                "[[email:mreyes@aureliacapital.com|IT support contact — listed on several public pages]]\n" +
                "Investor Relations — ir@aureliacapital.com",
              id:
                "Butuh bantuan dengan portal investor?\n\n" +
                "IT Support — [[username:mreyes|Juga dipakai untuk sistem internal]] / " +
                "[[email:mreyes@aureliacapital.com|Kontak dukungan IT — tercantum di beberapa halaman publik]]\n" +
                "Investor Relations — ir@aureliacapital.com",
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
                "Disallow: /portfolio/internal\n" +
                "# TODO: retire link to the legacy fund ops dashboard " +
                "([[path:192.168.80.9|Leftover internal IP, left in a public robots.txt]]) once migration finishes",
              id:
                "User-agent: *\n" +
                "Disallow: /admin\n" +
                "Disallow: /portfolio/internal\n" +
                "# TODO: hapus link ke dashboard ops dana lama " +
                "([[path:192.168.80.9|IP internal yang ketinggalan, ada di robots.txt publik]]) setelah migrasi selesai",
            },
          },
        ],
      },
    },
    {
      id: "aurelia-internal",
      ip: "192.168.80.9",
      orgName: "Aurelia Capital — Internal Fund Ops",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | fund-ops-dashboard (internal, staff VPN only)" }],
      users: [{ username: "mreyes", password: "Quart3rly!9", role: "IT admin" }],
      systemUsers: [
        { username: "mreyes", role: "IT admin" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-public",
          targetNodeId: "aurelia-public",
          label: { en: "Pivot to 203.0.113.77", id: "Pivot ke 203.0.113.77" },
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
              en: "Internal fund ops dashboard. Authorized Aurelia staff only.\nContact IT if you've lost access.",
              id: "Dashboard ops dana internal. Hanya untuk staf Aurelia yang berwenang.\nHubungi IT kalau kamu kehilangan akses.",
            },
          },
        ],
      },
    },
  ],
};
