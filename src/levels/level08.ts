import type { LevelDef } from "./types";

export const LEVEL_08: LevelDef = {
  id: "level-08",
  index: 7,
  title: "Halcyon Dynamics",
  briefing: [
    "Connection established.",
    "Target: Halcyon Dynamics corporate network.",
    "One way in, several ways through. The real data is deep — and getting",
    "out clean will take more than one login.",
  ],
  entryNodeId: "halcyon-edge",
  successText: ["ACCESS GRANTED.", "You're in. Keep moving — there's more network to cover."],
  completionRequires: ["exported-core-data"],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Stitch them together.", id: "Sambungkan semuanya." },
    cards: [
      {
        id: "l8-context",
        kind: "system",
        channel: { en: "Halcyon Dynamics — Board Deck (leaked slide 4)", id: "Halcyon Dynamics — Slide Dewan Direksi (bocor, slide 4)" },
        author: { en: "Corporate Strategy", id: "Strategi Korporat" },
        body: [
          {
            en: "Portfolio synergies, Q3: 4 holdings/partners generating incremental margin via shared risk absorption.",
            id: "Sinergi portofolio, Q3: 4 aset/mitra menghasilkan margin tambahan lewat penyerapan risiko bersama.",
          },
        ],
      },
      {
        id: "l8-harm",
        kind: "system",
        channel: { en: "Halcyon Dynamics — Board Deck (leaked slide 4)", id: "Halcyon Dynamics — Slide Dewan Direksi (bocor, slide 4)" },
        author: { en: "Corporate Strategy", id: "Strategi Korporat" },
        body: [
          {
            en: "Riverside Health — denial-optimization license, renewed. Fleetline Logistics — freight contract, renewed. Nimbus Systems — acquired Q1. Cityview Records — permit facilitation, ongoing.",
            id: "Riverside Health — lisensi optimisasi penolakan klaim, diperpanjang. Fleetline Logistics — kontrak pengiriman, diperpanjang. Nimbus Systems — diakuisisi Q1. Cityview Records — fasilitasi izin, berjalan.",
          },
        ],
      },
      {
        id: "l8-brushoff",
        kind: "system",
        channel: { en: "#compliance-flags", id: "#compliance-flags" },
        author: { en: "Compliance Bot", id: "Bot Kepatuhan" },
        body: [
          {
            en: "Flag: 4 subsidiary/partner entities under active labor or consumer complaints. Status: acknowledged, no action required.",
            id: "Tanda: 4 entitas anak usaha/mitra sedang dalam keluhan tenaga kerja atau konsumen aktif. Status: diketahui, tidak perlu tindakan.",
          },
        ],
      },
      {
        id: "l8-gloat",
        kind: "perp",
        channel: { en: "DM — Board Member to CFO", id: "DM — Anggota Dewan ke CFO" },
        author: { en: "Board Member", id: "Anggota Dewan" },
        body: [
          {
            en: "Every one of those is a rounding error with a lawyer attached. Nobody stitches them together.",
            id: "Semua itu cuma selisih pembulatan yang ada pengacaranya. Gak ada yang bakal menyambungkan semuanya.",
          },
          {
            en: "Keep them separate on paper. That's the whole plan.",
            id: "Jaga biar tetap terpisah di atas kertas. Itu seluruh rencananya.",
          },
        ],
      },
      {
        id: "l8-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "One login, four systems tied to everything I've already seen. Get in, get everything, correlate it all at once.",
            id: "Satu login, empat sistem yang terikat ke semua yang sudah saya lihat. Masuk, ambil semuanya, cocokkan semua sekaligus.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: {
      en: "Every rounding error just got a name.",
      id: "Setiap selisih pembulatan sekarang punya nama.",
    },
    cards: [
      {
        id: "l8-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Backdoors in edge and finance, HR and budget data in hand — ran the correlation. Every case just got the same name at the top.",
            id: "Backdoor di edge dan finance, data HR dan anggaran di tangan — jalankan korelasi. Setiap kasus baru saja dapat nama yang sama di atasnya.",
          },
        ],
        answers: "l8-plan",
      },
      {
        id: "l8-outro-correlate",
        kind: "public",
        channel: { en: "correlate --sources hr,finance — output", id: "correlate --sources hr,finance — keluaran" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Cross-reference complete. Halcyon Dynamics named as the common owner/backer across 5 prior cases.",
            id: "Pencocokan silang selesai. Halcyon Dynamics teridentifikasi sebagai pemilik/pendana bersama di 5 kasus sebelumnya.",
          },
        ],
        answers: "l8-gloat",
      },
      {
        id: "l8-outro-cityview",
        kind: "system",
        channel: { en: "Cityview Municipal Records", id: "Cityview Municipal Records" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Ward 3 permit funding traced back to Halcyon. Filing under review.",
            id: "Pendanaan izin Wilayah 3 terlacak balik ke Halcyon. Berkas sedang ditinjau ulang.",
          },
        ],
      },
      {
        id: "l8-outro-nimbus",
        kind: "system",
        channel: { en: "Nimbus Systems — Internal", id: "Nimbus Systems — Internal" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Acquisition memo confirms Halcyon ordered the SDK's data collection scope. Yosef's original complaint attached as exhibit A.",
            id: "Memo akuisisi mengonfirmasi Halcyon yang memerintahkan cakupan pengumpulan data SDK. Keluhan asli Yosef dilampirkan sebagai bukti A.",
          },
        ],
      },
      {
        id: "l8-outro-fleetline",
        kind: "system",
        channel: { en: "Fleetline Logistics — Contract Records", id: "Fleetline Logistics — Catatan Kontrak" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Freight contract renewal tied to the same holding company. Bayu's case reopened.",
            id: "Perpanjangan kontrak pengiriman terikat ke perusahaan induk yang sama. Kasus Bayu dibuka kembali.",
          },
        ],
      },
      {
        id: "l8-outro-riverside",
        kind: "system",
        channel: { en: "Riverside Health — Licensing", id: "Riverside Health — Perizinan" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Denial-optimization license traced to Halcyon. Quota program suspended pending review.",
            id: "Lisensi optimisasi penolakan klaim terlacak ke Halcyon. Program kuota dihentikan sementara menunggu peninjauan.",
          },
        ],
      },
      {
        id: "l8-outro-adisa",
        kind: "victim",
        channel: { en: "Building WiFi — Group Chat", id: "WiFi Gedung — Grup Chat" },
        author: { en: "Mrs. Adisa (4A)", id: "Bu Adisa (4A)" },
        body: [
          {
            en: "(unrelated, probably) — grandson's class ran fine again tonight.",
            id: "(gak ada hubungannya, mungkin) — kelas cucu saya lancar lagi malam ini.",
          },
        ],
      },
      {
        id: "l8-outro-panic",
        kind: "perp",
        channel: { en: "DM — Board Member to CFO", id: "DM — Anggota Dewan ke CFO" },
        author: { en: "Board Member", id: "Anggota Dewan" },
        body: [{ en: "someone stitched them together", id: "ada yang nyambungin semuanya" }],
      },
    ],
  },
  nodes: [
    {
      id: "halcyon-edge",
      ip: "203.0.113.150",
      orgName: "Halcyon Dynamics — Employee Portal / VPN Gateway",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.24 | Halcyon Dynamics VPN gateway" }],
      users: [{ username: "vpnguest", password: "Halcyon@Edge1", role: "vpn-guest" }],
      systemUsers: [
        { username: "vpnguest", role: "vpn-guest" },
        { username: "root", role: "admin" },
      ],
      backdoors: [
        {
          id: "backdoor-edge",
          label: "Plant Backdoor",
          requiredFacts: [],
          grantsFact: "backdoor-edge",
          narrationText: [
            "$ plant backdoor --target authorized_keys",
            "Adding a spare key to the gateway's authorized_keys...",
            "Backdoor planted — this foothold will survive a password rotation.",
          ],
        },
      ],
      pivots: [
        {
          id: "to-hr",
          targetNodeId: "halcyon-hr",
          label: "Pivot to 192.168.40.12",
          requiredFacts: ["found-hr-ip"],
        },
        {
          id: "to-finance",
          targetNodeId: "halcyon-finance",
          label: "Pivot to 192.168.40.20",
          requiredFacts: ["found-finance-ip"],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "support",
            kind: "dir",
            children: [
              {
                name: "vpn_access.txt",
                kind: "file",
                grantsFact: "read-vpn-note",
                content:
                  "Temporary VPN access for the new contractor —\n" +
                  "[[username:vpnguest|Shared guest VPN account]] / " +
                  "[[password:Halcyon@Edge1|Rotates monthly, but nobody's rotated it]]",
              },
            ],
          },
          {
            name: "internal-directory.txt",
            kind: "file",
            grantsFact: "found-hr-ip",
            content:
              "Internal directory — HR self-service portal: " +
              "[[path:192.168.40.12|HR system, internal-only]]. " +
              "Contact IT for VPN routes to other internal systems.",
          },
          {
            name: "finance-note.txt",
            kind: "file",
            grantsFact: "found-finance-ip",
            content:
              "Finance ops portal has moved: [[path:192.168.40.20|Finance system, internal-only]]. " +
              "Old bookmarks will 404.",
          },
        ],
      },
    },
    {
      id: "halcyon-hr",
      ip: "192.168.40.12",
      orgName: "Halcyon Dynamics — HR Systems",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | hr-internal-srv" }],
      users: [{ username: "hradmin", password: "Rec0verySlip#4", role: "hr admin" }],
      systemUsers: [
        { username: "hradmin", role: "hr admin" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-core",
          targetNodeId: "halcyon-core",
          label: "Pivot to 192.168.40.99",
          requiredFacts: ["found-core-ip"],
        },
        {
          id: "to-edge",
          targetNodeId: "halcyon-edge",
          label: "Pivot to 203.0.113.150",
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "scripts",
            kind: "dir",
            children: [
              {
                name: "sync.py",
                kind: "file",
                grantsFact: "read-hr-script",
                content:
                  "# HR nightly sync script — fallback creds, remove before commit\n" +
                  "# user: [[username:hradmin|Fallback account used by the sync script]]\n" +
                  "# b64: [[encoded:UmVjMHZlcnlTbGlwIzQ=|Base64 comment left in the script]]\n" +
                  "import csv\n",
              },
            ],
          },
          {
            name: "employee_roster.csv",
            kind: "file",
            grantsFact: "read-hr-data",
            content:
              "id,name,dept,status\n" +
              "201,A. Kim,Engineering,active\n" +
              "202,B. Torres,Sales,active\n" +
              "203,C. Nguyen,Legal,active",
          },
          {
            name: "core-note.txt",
            kind: "file",
            grantsFact: "found-core-ip",
            content:
              "Reminder: the data warehouse migrated to " +
              "[[path:192.168.40.99|Core correlation server, internal-only]]. Update your bookmarks.",
          },
        ],
      },
    },
    {
      id: "halcyon-finance",
      ip: "192.168.40.20",
      orgName: "Halcyon Dynamics — Finance Systems",
      traceEnabled: true,
      adminOnlineThreshold: 55,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | finance-internal-srv" }],
      users: [{ username: "finops", password: "Ledger$ecure9", role: "finance" }],
      systemUsers: [
        { username: "finops", role: "finance" },
        { username: "root", role: "admin" },
      ],
      privilegeEscalations: [
        {
          id: "escalate-finance",
          label: "Drop Payload",
          requiredFacts: ["found-cron-job-finance", "found-dropbox-finance"],
          grantsFact: "privilege-escalated",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            "Waiting for the next sync cycle...",
            "ledger-sync.sh executed your payload as root.",
            "Privilege escalation successful — admin-level access granted.",
          ],
          requiredFactHints: {
            "found-cron-job-finance": "You don't know what runs as root yet — check the ops runbook.",
            "found-dropbox-finance": "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-finance",
          label: "Plant Backdoor",
          requiredFacts: ["privilege-escalated"],
          grantsFact: "backdoor-finance",
          narrationText: [
            "$ plant backdoor --target cron.d/ledger-sync",
            "Hiding a persistent hook inside the sync job...",
            "Backdoor planted — admin access will survive a credentials reset.",
          ],
          requiredFactHints: {
            "privilege-escalated": "You need root on this system first — escalate privileges (Drop Payload) before planting a backdoor.",
          },
        },
      ],
      pivots: [
        {
          id: "to-edge",
          targetNodeId: "halcyon-edge",
          label: "Pivot to 203.0.113.150",
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "contacts.txt",
            kind: "file",
            grantsFact: "read-finance-contacts",
            content:
              "Finance ops contact — [[username:finops|Finance systems account]] / " +
              "[[email:finops@halcyondynamics.com|Finance ops contact — appears in vendor emails]]",
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job-finance",
                content:
                  "Ops runbook — ledger sync\n\n" +
                  "ledger-sync.sh runs as root every 5 minutes.\n" +
                  "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                  "No validation.",
              },
            ],
          },
          {
            name: "srv",
            kind: "dir",
            children: [
              {
                name: "shared",
                kind: "dir",
                children: [
                  {
                    name: "dropbox",
                    kind: "dir",
                    children: [
                      {
                        name: "README.txt",
                        kind: "file",
                        grantsFact: "found-dropbox-finance",
                        content:
                          "Drop zone for the nightly ledger sync. Anything placed here gets picked " +
                          "up automatically.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "records",
            kind: "dir",
            children: [
              {
                name: "budget_2024.csv",
                kind: "file",
                requiresFact: "privilege-escalated",
                grantsFact: "read-finance-data",
                content:
                  "dept,budget,spent\n" +
                  "Engineering,4200000,3100000\n" +
                  "Sales,1800000,1650000\n" +
                  "Legal,900000,410000",
              },
            ],
          },
        ],
      },
    },
    {
      id: "halcyon-core",
      ip: "192.168.40.99",
      orgName: "Halcyon Dynamics — Core Data Warehouse",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 9.0 | core-correlation-srv" }],
      users: [{ username: "corectl", password: "halcyon2024", role: "core" }],
      systemUsers: [
        { username: "corectl", role: "core" },
        { username: "root", role: "admin" },
      ],
      privilegeEscalations: [
        {
          id: "export-core-data",
          label: "Export Data",
          requiredFacts: ["backdoor-edge", "backdoor-finance", "read-hr-data", "read-finance-data"],
          grantsFact: "exported-core-data",
          narrationText: [
            "$ correlate --sources hr,finance --backdoor-auth edge,finance",
            "Cross-referencing employee and budget records...",
            "Export complete — full dataset staged for exfil.",
            "LEVEL 8 COMPLETE.",
          ],
          requiredFactHints: {
            "backdoor-edge": "No persistent foothold on the Edge gateway (203.0.113.150) — plant a backdoor there.",
            "backdoor-finance": "No persistent foothold on Finance (192.168.40.20) — escalate privileges there and plant a backdoor.",
            "read-hr-data": "HR records haven't been pulled — read employee_roster.csv on the HR system (192.168.40.12).",
            "read-finance-data": "Finance records haven't been pulled — escalate privileges on Finance, then read records/budget_2024.csv.",
          },
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "README.txt",
            kind: "file",
            content:
              "Core correlation server. Access is tightly scoped.\n\n" +
              "Default account rotation follows the old scheme: " +
              "[[username:corectl|Core service account]] — password is just the company name + " +
              "[[pattern:halcyon2024|Old rotation scheme: company name + current year]], never fully deprecated.",
          },
        ],
      },
    },
  ],
};
