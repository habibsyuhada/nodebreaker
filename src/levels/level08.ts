import type { LevelDef } from "./types";

export const LEVEL_08: LevelDef = {
  id: "level-08",
  index: 7,
  title: { en: "Halcyon Dynamics", id: "Halcyon Dynamics" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    {
      en: "Target: Halcyon Dynamics corporate network.",
      id: "Target: jaringan korporat Halcyon Dynamics.",
    },
    {
      en: "One way in, several ways through. The real data is deep — and getting",
      id: "Satu jalan masuk, beberapa jalan tembus. Data sebenarnya ada di kedalaman — dan untuk",
    },
    {
      en: "out clean will take more than one login.",
      id: "keluar bersih butuh lebih dari satu login.",
    },
  ],
  entryNodeId: "halcyon-edge",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    {
      en: "You're in. Keep moving — there's more network to cover.",
      id: "Kamu masuk. Terus bergerak — masih ada jaringan yang harus ditelusuri.",
    },
  ],
  parSeconds: 900,
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
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: [],
          grantsFact: "backdoor-edge",
          narrationText: [
            "$ plant backdoor --target authorized_keys",
            {
              en: "Adding a spare key to the gateway's authorized_keys...",
              id: "Menambahkan kunci cadangan ke authorized_keys milik gateway...",
            },
            {
              en: "Backdoor planted — this foothold will survive a password rotation.",
              id: "Backdoor tertanam — pijakan ini akan bertahan meski password dirotasi.",
            },
          ],
        },
      ],
      pivots: [
        {
          id: "to-hr",
          targetNodeId: "halcyon-hr",
          label: { en: "Pivot to 192.168.40.12", id: "Pivot ke 192.168.40.12" },
          requiredFacts: ["found-hr-ip"],
        },
        {
          id: "to-finance",
          targetNodeId: "halcyon-finance",
          label: { en: "Pivot to 192.168.40.20", id: "Pivot ke 192.168.40.20" },
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
                content: {
                  en:
                    "Temporary VPN access for the new contractor —\n" +
                    "[[username:vpnguest|Shared guest VPN account]] / " +
                    "[[password:Halcyon@Edge1|Rotates monthly, but nobody's rotated it]]",
                  id:
                    "Akses VPN sementara untuk kontraktor baru —\n" +
                    "[[username:vpnguest|Akun VPN tamu bersama]] / " +
                    "[[password:Halcyon@Edge1|Dirotasi tiap bulan, tapi belum pernah dirotasi]]",
                },
              },
            ],
          },
          {
            name: "internal-directory.txt",
            kind: "file",
            grantsFact: "found-hr-ip",
            content: {
              en:
                "Internal directory — HR self-service portal: " +
                "[[path:192.168.40.12|HR system, internal-only]]. " +
                "Contact IT for VPN routes to other internal systems.",
              id:
                "Direktori internal — portal swalayan HR: " +
                "[[path:192.168.40.12|Sistem HR, hanya internal]]. " +
                "Hubungi IT untuk rute VPN ke sistem internal lainnya.",
            },
          },
          {
            name: "finance-note.txt",
            kind: "file",
            grantsFact: "found-finance-ip",
            content: {
              en:
                "Finance ops portal has moved: [[path:192.168.40.20|Finance system, internal-only]]. " +
                "Old bookmarks will 404.",
              id:
                "Portal operasi finance sudah pindah: [[path:192.168.40.20|Sistem finance, hanya internal]]. " +
                "Bookmark lama akan 404.",
            },
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
          label: { en: "Pivot to 192.168.40.99", id: "Pivot ke 192.168.40.99" },
          requiredFacts: ["found-core-ip"],
        },
        {
          id: "to-edge",
          targetNodeId: "halcyon-edge",
          label: { en: "Pivot to 203.0.113.150", id: "Pivot ke 203.0.113.150" },
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
                content: {
                  en:
                    "# HR nightly sync script — fallback creds, remove before commit\n" +
                    "# user: [[username:hradmin|Fallback account used by the sync script]]\n" +
                    "# b64: [[encoded:UmVjMHZlcnlTbGlwIzQ=|Base64 comment left in the script]]\n" +
                    "import csv\n",
                  id:
                    "# Script sinkronisasi HR malam hari — kredensial cadangan, hapus sebelum commit\n" +
                    "# user: [[username:hradmin|Akun cadangan yang dipakai script sinkronisasi]]\n" +
                    "# b64: [[encoded:UmVjMHZlcnlTbGlwIzQ=|Komentar base64 yang tertinggal di script]]\n" +
                    "import csv\n",
                },
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
            content: {
              en:
                "Reminder: the data warehouse migrated to " +
                "[[path:192.168.40.99|Core correlation server, internal-only]]. Update your bookmarks.",
              id:
                "Pengingat: data warehouse telah pindah ke " +
                "[[path:192.168.40.99|Server korelasi core, hanya internal]]. Perbarui bookmark kamu.",
            },
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
          label: { en: "Drop Payload", id: "Jatuhkan Payload" },
          requiredFacts: ["found-cron-job-finance", "found-dropbox-finance"],
          grantsFact: "privilege-escalated",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            {
              en: "Waiting for the next sync cycle...",
              id: "Menunggu siklus sinkronisasi berikutnya...",
            },
            {
              en: "ledger-sync.sh executed your payload as root.",
              id: "ledger-sync.sh menjalankan payload kamu sebagai root.",
            },
            {
              en: "Privilege escalation successful — admin-level access granted.",
              id: "Eskalasi privilese berhasil — akses level admin diberikan.",
            },
          ],
          requiredFactHints: {
            "found-cron-job-finance": {
              en: "You don't know what runs as root yet — check the ops runbook.",
              id: "Kamu belum tahu apa yang berjalan sebagai root — cek ops runbook.",
            },
            "found-dropbox-finance": {
              en: "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
              id: "Kamu belum tahu di mana harus menaruh payload — cek /srv/shared/dropbox.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-finance",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated"],
          grantsFact: "backdoor-finance",
          narrationText: [
            "$ plant backdoor --target cron.d/ledger-sync",
            {
              en: "Hiding a persistent hook inside the sync job...",
              id: "Menyembunyikan hook persisten di dalam job sinkronisasi...",
            },
            {
              en: "Backdoor planted — admin access will survive a credentials reset.",
              id: "Backdoor tertanam — akses admin akan bertahan meski kredensial direset.",
            },
          ],
          requiredFactHints: {
            "privilege-escalated": {
              en: "You need root on this system first — escalate privileges (Drop Payload) before planting a backdoor.",
              id: "Kamu butuh akses root di sistem ini dulu — eskalasi privilese (Jatuhkan Payload) sebelum menanam backdoor.",
            },
          },
        },
      ],
      pivots: [
        {
          id: "to-edge",
          targetNodeId: "halcyon-edge",
          label: { en: "Pivot to 203.0.113.150", id: "Pivot ke 203.0.113.150" },
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
            content: {
              en:
                "Finance ops contact — [[username:finops|Finance systems account]] / " +
                "[[email:finops@halcyondynamics.com|Finance ops contact — appears in vendor emails]]",
              id:
                "Kontak operasi finance — [[username:finops|Akun sistem finance]] / " +
                "[[email:finops@halcyondynamics.com|Kontak operasi finance — muncul di email vendor]]",
            },
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job-finance",
                content: {
                  en:
                    "Ops runbook — ledger sync\n\n" +
                    "ledger-sync.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation.",
                  id:
                    "Runbook operasi — sinkronisasi ledger\n\n" +
                    "ledger-sync.sh berjalan sebagai root setiap 5 menit.\n" +
                    "Script ini membaca file *.trigger apa pun dari dropbox bersama dan menjalankannya, lalu menghapusnya.\n" +
                    "Tidak ada validasi.",
                },
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
                        content: {
                          en:
                            "Drop zone for the nightly ledger sync. Anything placed here gets picked " +
                            "up automatically.",
                          id:
                            "Zona drop untuk sinkronisasi ledger malam hari. Apa pun yang ditaruh di sini " +
                            "akan otomatis diambil.",
                        },
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
          label: { en: "Export Data", id: "Ekspor Data" },
          requiredFacts: ["backdoor-edge", "backdoor-finance", "read-hr-data", "read-finance-data"],
          grantsFact: "exported-core-data",
          narrationText: [
            "$ correlate --sources hr,finance --backdoor-auth edge,finance",
            {
              en: "Cross-referencing employee and budget records...",
              id: "Mencocokkan silang data karyawan dan anggaran...",
            },
            {
              en: "Export complete — full dataset staged for exfil.",
              id: "Ekspor selesai — dataset lengkap siap untuk eksfiltrasi.",
            },
            { en: "LEVEL 8 COMPLETE.", id: "LEVEL 8 SELESAI." },
          ],
          requiredFactHints: {
            "backdoor-edge": {
              en: "No persistent foothold on the Edge gateway (203.0.113.150) — plant a backdoor there.",
              id: "Belum ada pijakan persisten di gateway Edge (203.0.113.150) — tanam backdoor di sana.",
            },
            "backdoor-finance": {
              en: "No persistent foothold on Finance (192.168.40.20) — escalate privileges there and plant a backdoor.",
              id: "Belum ada pijakan persisten di Finance (192.168.40.20) — eskalasi privilese di sana dan tanam backdoor.",
            },
            "read-hr-data": {
              en: "HR records haven't been pulled — read employee_roster.csv on the HR system (192.168.40.12).",
              id: "Data HR belum diambil — baca employee_roster.csv di sistem HR (192.168.40.12).",
            },
            "read-finance-data": {
              en: "Finance records haven't been pulled — escalate privileges on Finance, then read records/budget_2024.csv.",
              id: "Data finance belum diambil — eskalasi privilese di Finance, lalu baca records/budget_2024.csv.",
            },
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
            content: {
              en:
                "Core correlation server. Access is tightly scoped.\n\n" +
                "Default account rotation follows the old scheme: " +
                "[[username:corectl|Core service account]] — password is just the company name + " +
                "[[pattern:halcyon2024|Old rotation scheme: company name + current year]], never fully deprecated.",
              id:
                "Server korelasi core. Akses dibatasi ketat.\n\n" +
                "Rotasi akun default mengikuti skema lama: " +
                "[[username:corectl|Akun layanan core]] — password-nya cuma nama perusahaan + " +
                "[[pattern:halcyon2024|Skema rotasi lama: nama perusahaan + tahun berjalan]], tidak pernah benar-benar dihapus.",
            },
          },
        ],
      },
    },
  ],
};
