import type { LevelDef } from "./types";

export const LEVEL_02: LevelDef = {
  id: "level-02",
  index: 1,
  title: "Online Storefront",
  briefing: [
    "Connection established.",
    "Target: a small online store's admin backend.",
    "No login page shortcuts here — you'll need to earn the credentials.",
  ],
  entryNodeId: "storefront",
  successText: ["ACCESS GRANTED.", "You're in — storefront admin unlocked.", "LEVEL 2 COMPLETE."],
  parSeconds: 150,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Time to reopen the ticket.", id: "Saatnya buka lagi tiketnya." },
    cards: [
      {
        id: "l2-context",
        kind: "system",
        channel: { en: "Storefront Support Queue", id: "Antrean Dukungan Toko" },
        author: { en: "Support Ticket — auto", id: "Tiket Dukungan — otomatis" },
        body: [
          {
            en: "Ticket #2117 — Refund Request — status: OPEN — 0 days",
            id: "Tiket #2117 — Permintaan Refund — status: TERBUKA — 0 hari",
          },
        ],
      },
      {
        id: "l2-harm",
        kind: "victim",
        channel: { en: "Ticket #2117", id: "Tiket #2117" },
        author: { en: "Rian", id: "Rian" },
        meta: { en: "Day 4", id: "Hari ke-4" },
        body: [
          {
            en: "My daughter's birthday gift never arrived. Order #BOU-4471, paid in full. Can someone please look into this?",
            id: "Kado ulang tahun anak saya gak pernah sampai. Order #BOU-4471, sudah lunas dibayar. Bisa tolong dicek?",
          },
        ],
      },
      {
        id: "l2-brushoff",
        kind: "system",
        channel: { en: "Ticket #2117", id: "Tiket #2117" },
        author: { en: "Support Ticket — auto-close", id: "Tiket Dukungan — tutup otomatis" },
        meta: { en: "Day 19", id: "Hari ke-19" },
        body: [
          {
            en: "No response received. Ticket automatically closed per policy.",
            id: "Tidak ada respons diterima. Tiket ditutup otomatis sesuai kebijakan.",
          },
        ],
      },
      {
        id: "l2-gloat",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "sarahk", id: "sarahk" },
        body: [
          {
            en: "Chargeback window is 60 days. Most give up around 30. Delete the review and move on.",
            id: "Jendela chargeback itu 60 hari. Kebanyakan nyerah sekitar hari ke-30. Hapus review-nya, lanjut kerja.",
          },
          { en: "Ticket #2117: closed.", id: "Tiket #2117: ditutup." },
        ],
      },
      {
        id: "l2-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Storefront admin panel. If sarahk's this careless with reviews, she's probably just as careless with her password.",
            id: "Panel admin toko. Kalau sarahk seceroboh itu sama review, kemungkinan besar dia juga ceroboh sama passwordnya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "340 reviews just came back.", id: "340 review baru saja kembali." },
    cards: [
      {
        id: "l2-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Force-flushed the refund queue and killed the auto-delete cron. Everyone gets their money and their words back.",
            id: "Paksa proses antrean refund dan matikan cron auto-hapus. Semua orang dapat uang dan kata-katanya kembali.",
          },
        ],
        answers: "l2-plan",
      },
      {
        id: "l2-outro-refund",
        kind: "victim",
        channel: { en: "Storefront — Order #BOU-4471", id: "Toko — Order #BOU-4471" },
        author: { en: "Rian", id: "Rian" },
        meta: { en: "Day 21", id: "Hari ke-21" },
        body: [
          {
            en: "Refund landed today, no explanation needed — it just showed up. Wish it hadn't taken this long.",
            id: "Refund-nya masuk hari ini, gak perlu penjelasan lagi — tahu-tahu sudah ada. Sayangnya kelamaan.",
          },
        ],
        answers: "l2-harm",
      },
      {
        id: "l2-outro-reviews",
        kind: "public",
        channel: { en: "Storefront — Public Reviews", id: "Toko — Ulasan Publik" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "340 previously deleted reviews restored. Auto-delete cron disabled.",
            id: "340 review yang sebelumnya dihapus telah dipulihkan. Cron auto-hapus dinonaktifkan.",
          },
        ],
        answers: "l2-gloat",
      },
      {
        id: "l2-outro-panic",
        kind: "perp",
        channel: { en: "Admin Panel — Internal Note", id: "Panel Admin — Catatan Internal" },
        author: { en: "sarahk", id: "sarahk" },
        body: [{ en: "who reopened all of these", id: "siapa yang buka lagi semua ini" }],
      },
    ],
  },
  nodes: [
    {
      id: "storefront",
      ip: "203.0.113.42",
      orgName: "Boutique '98 Online Store",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.18 | Storefront CMS admin login" }],
      users: [{ username: "sarahk", password: "sarah1998", role: "owner" }],
      systemUsers: [],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "about-us.txt",
            kind: "file",
            content:
              "Little shop, big heart.\n\nBoutique '98 was started back when getting online at all felt\nlike magic. Fun fact: the very first admin handle around here\nwas literally just the owner's name and the year —\n[[pattern:sarah1998|Owner's name + founding year, an old admin handle]] —\nfrom back when nobody worried much about security.",
          },
          {
            name: "products.csv",
            kind: "file",
            content:
              "sku,name,price\nBOU-001,Hand-knit scarf,24.00\nBOU-002,Ceramic mug,14.50\nBOU-003,Tote bag,18.00",
          },
          {
            name: "backup",
            kind: "dir",
            children: [
              {
                name: "README.txt",
                kind: "file",
                content:
                  "Nightly backups land here automatically.\nRemember to purge old admin exports once you're done with them.",
              },
              {
                name: "users_backup.csv",
                kind: "file",
                content:
                  "export_date,admin_user,last_login\n2019-03-01,[[username:sarahk|Backup admin username]],2019-02-27",
              },
            ],
          },
        ],
      },
    },
  ],
};
