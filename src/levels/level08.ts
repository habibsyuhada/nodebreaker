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
      en: "Three ways in — quiet recon, backdoor persistence, or the vendor's own sloppy",
      id: "Tiga cara masuk — recon senyap, persistence lewat backdoor, atau rotasi ceroboh",
    },
    {
      en: "rotation. Pick one route. The proof only needs one way through.",
      id: "milik vendor sendiri. Pilih satu jalur. Buktinya cuma butuh satu jalan masuk.",
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
  winPaths: [
    { id: "ghost", label: { en: "Ghost", id: "Ghost" }, requiredFacts: ["quiet-export-complete"] },
    { id: "breach", label: { en: "Breach", id: "Breach" }, requiredFacts: ["breach-export-complete"] },
    { id: "analyst", label: { en: "Analyst", id: "Analyst" }, requiredFacts: ["vendor-ledger-correlated"] },
  ],
  bossRewardThemes: { second: "ch1-ghost", third: "ch1-breach" },
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
            en: "Three ways into this network — recon-only, backdoors, or their own vendor's sloppy rotation. One's enough. Get in, get proof, get out.",
            id: "Tiga cara masuk ke jaringan ini — recon murni, backdoor, atau rotasi ceroboh milik vendor mereka sendiri. Satu saja cukup. Masuk, ambil bukti, keluar.",
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
            en: "Didn't need every system — just enough proof from one way in. Ran the correlation anyway once I was out.",
            id: "Gak perlu semua sistem — cukup bukti dari satu jalan masuk saja. Tetap jalankan korelasi begitu sudah keluar.",
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
        {
          id: "to-vendor",
          targetNodeId: "halcyon-vendor",
          label: { en: "Pivot to 198.51.100.77", id: "Pivot ke 198.51.100.77" },
          requiredFacts: ["found-vendor-ip"],
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
          {
            name: "vendor-note.txt",
            kind: "file",
            grantsFact: "found-vendor-ip",
            content: {
              en:
                "Contract renewal reminder: Nimbus Systems vendor extranet — " +
                "[[path:198.51.100.77|Nimbus Systems vendor extranet, external]]. " +
                "Points of contact updated after the acquisition.",
              id:
                "Pengingat perpanjangan kontrak: extranet vendor Nimbus Systems — " +
                "[[path:198.51.100.77|Extranet vendor Nimbus Systems, eksternal]]. " +
                "Kontak diperbarui setelah akuisisi.",
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
          id: "to-hr-archive",
          targetNodeId: "halcyon-hr-archive",
          label: { en: "Pivot to 192.168.40.13", id: "Pivot ke 192.168.40.13" },
          requiredFacts: ["found-archive-ip"],
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
          {
            name: "archive_access.txt",
            kind: "file",
            grantsFact: "found-archive-ip",
            content: {
              en:
                "Cold storage archive — " +
                "[[path:192.168.40.13|HR records archive, internal-only]]. Service login: " +
                "[[username:archivebot|Archive service account]] / " +
                "[[password:C0ldStorage!7|Rotated once, never since]].",
              id:
                "Arsip penyimpanan dingin — " +
                "[[path:192.168.40.13|Arsip rekam HR, hanya internal]]. Login servis: " +
                "[[username:archivebot|Akun servis arsip]] / " +
                "[[password:C0ldStorage!7|Pernah dirotasi sekali, tidak pernah lagi]].",
            },
          },
        ],
      },
    },
    {
      id: "halcyon-hr-archive",
      ip: "192.168.40.13",
      orgName: "Halcyon Dynamics — HR Records Archive",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | hr-archive-srv" }],
      users: [{ username: "archivebot", password: "C0ldStorage!7", role: "archive service" }],
      systemUsers: [
        { username: "archivebot", role: "archive service" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-hr",
          targetNodeId: "halcyon-hr",
          label: { en: "Pivot to 192.168.40.12", id: "Pivot ke 192.168.40.12" },
          requiredFacts: [],
        },
      ],
      privilegeEscalations: [
        {
          id: "quiet-export",
          label: { en: "Quiet Export", id: "Ekspor Senyap" },
          requiredFacts: ["read-hr-data", "read-hr-archive"],
          grantsFact: "quiet-export-complete",
          narrationText: [
            "$ export --mode quiet --sources hr,archive",
            {
              en: "No privilege escalation, no backdoor — just what was already readable.",
              id: "Tanpa eskalasi privilese, tanpa backdoor — cuma yang memang sudah bisa dibaca.",
            },
            { en: "Export complete — clean exit.", id: "Ekspor selesai — keluar bersih." },
            { en: "LEVEL 8 COMPLETE — GHOST ROUTE.", id: "LEVEL 8 SELESAI — JALUR GHOST." },
          ],
          requiredFactHints: {
            "read-hr-data": {
              en: "Haven't pulled the employee roster yet — read employee_roster.csv on HR (192.168.40.12).",
              id: "Belum ambil data roster karyawan — baca employee_roster.csv di HR (192.168.40.12).",
            },
            "read-hr-archive": {
              en: "Haven't read the archived reviews yet.",
              id: "Belum baca ulasan arsip.",
            },
          },
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "archived_reviews.csv",
            kind: "file",
            grantsFact: "read-hr-archive",
            content:
              "id,name,dept,note\n" +
              "201,A. Kim,Engineering,flagged 2022 restructuring\n" +
              "202,B. Torres,Sales,flagged 2023 layoff wave\n" +
              "203,C. Nguyen,Legal,flagged NDA dispute",
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
        {
          id: "to-backup",
          targetNodeId: "halcyon-finance-backup",
          label: { en: "Pivot to 192.168.40.21", id: "Pivot ke 192.168.40.21" },
          requiredFacts: ["found-backup-ip"],
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
            name: "backup-note.txt",
            kind: "file",
            grantsFact: "found-backup-ip",
            content: {
              en:
                "Nightly backups now route through the ops cloud vault: " +
                "[[path:192.168.40.21|Backup vault, internal-only]]. Service login: " +
                "[[username:backupsvc|Backup service account]] / " +
                "[[password:C1oudVault#3|Shared with the nightly job, never rotated]].",
              id:
                "Backup malam hari sekarang lewat brankas cloud ops: " +
                "[[path:192.168.40.21|Brankas backup, hanya internal]]. Login servis: " +
                "[[username:backupsvc|Akun servis backup]] / " +
                "[[password:C1oudVault#3|Dipakai bersama job malam hari, tidak pernah dirotasi]].",
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
      id: "halcyon-finance-backup",
      ip: "192.168.40.21",
      orgName: "Halcyon Dynamics — Ops Cloud Backup",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | backup-internal-srv" }],
      users: [{ username: "backupsvc", password: "C1oudVault#3", role: "backup service" }],
      systemUsers: [
        { username: "backupsvc", role: "backup service" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-finance",
          targetNodeId: "halcyon-finance",
          label: { en: "Pivot to 192.168.40.20", id: "Pivot ke 192.168.40.20" },
          requiredFacts: [],
        },
      ],
      privilegeEscalations: [
        {
          id: "escalate-backup",
          label: { en: "Drop Payload", id: "Jatuhkan Payload" },
          requiredFacts: ["found-backup-cron", "found-backup-dropbox"],
          grantsFact: "privilege-escalated-backup",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            {
              en: "Waiting for the next sync cycle...",
              id: "Menunggu siklus sinkronisasi berikutnya...",
            },
            {
              en: "backup-sync.sh executed your payload as root.",
              id: "backup-sync.sh menjalankan payload kamu sebagai root.",
            },
            {
              en: "Privilege escalation successful — admin-level access granted.",
              id: "Eskalasi privilese berhasil — akses level admin diberikan.",
            },
          ],
          requiredFactHints: {
            "found-backup-cron": {
              en: "You don't know what runs as root yet — check the ops runbook.",
              id: "Kamu belum tahu apa yang berjalan sebagai root — cek ops runbook.",
            },
            "found-backup-dropbox": {
              en: "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
              id: "Kamu belum tahu di mana harus menaruh payload — cek /srv/shared/dropbox.",
            },
          },
        },
        {
          id: "breach-export",
          label: { en: "Breach Export", id: "Ekspor Paksa" },
          requiredFacts: ["backdoor-edge", "backdoor-finance", "backdoor-backup"],
          grantsFact: "breach-export-complete",
          narrationText: [
            "$ export --mode backdoor --hosts edge,finance,backup",
            {
              en: "Pulling through every planted backdoor at once.",
              id: "Menarik data lewat semua backdoor yang tertanam sekaligus.",
            },
            { en: "Export complete — loud, but total.", id: "Ekspor selesai — berisik, tapi menyeluruh." },
            { en: "LEVEL 8 COMPLETE — BREACH ROUTE.", id: "LEVEL 8 SELESAI — JALUR BREACH." },
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
            "backdoor-backup": {
              en: "No persistent foothold on this backup vault yet — escalate privileges here first.",
              id: "Belum ada pijakan persisten di brankas backup ini — eskalasi privilese di sini dulu.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-backup",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated-backup"],
          grantsFact: "backdoor-backup",
          narrationText: [
            "$ plant backdoor --target cron.d/backup-sync",
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
            "privilege-escalated-backup": {
              en: "You need root on this system first — escalate privileges (Drop Payload) before planting a backdoor.",
              id: "Kamu butuh akses root di sistem ini dulu — eskalasi privilese (Jatuhkan Payload) sebelum menanam backdoor.",
            },
          },
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-backup-cron",
                content: {
                  en:
                    "Ops runbook — backup sync\n\n" +
                    "backup-sync.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation.",
                  id:
                    "Runbook operasi — sinkronisasi backup\n\n" +
                    "backup-sync.sh berjalan sebagai root setiap 5 menit.\n" +
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
                        grantsFact: "found-backup-dropbox",
                        content: {
                          en:
                            "Drop zone for the nightly backup sync. Anything placed here gets picked " +
                            "up automatically.",
                          id:
                            "Zona drop untuk sinkronisasi backup malam hari. Apa pun yang ditaruh di sini " +
                            "akan otomatis diambil.",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "halcyon-vendor",
      ip: "198.51.100.77",
      orgName: "Nimbus Systems — Vendor Extranet",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.22 | Vendor extranet portal" }],
      users: [{ username: "vendorops", password: "N1mbus#Vend0r", role: "vendor ops" }],
      systemUsers: [
        { username: "vendorops", role: "vendor ops" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-edge",
          targetNodeId: "halcyon-edge",
          label: { en: "Pivot to 203.0.113.150", id: "Pivot ke 203.0.113.150" },
          requiredFacts: [],
        },
      ],
      privilegeEscalations: [
        {
          id: "correlate-ledger",
          label: { en: "Correlate Ledger", id: "Korelasi Buku Besar" },
          requiredFacts: ["read-vendor-onboarding", "read-vendor-ledger"],
          grantsFact: "vendor-ledger-correlated",
          narrationText: [
            "$ correlate --source vendor-ledger",
            {
              en: "Cross-referencing the vendor's own export logs against Halcyon's contracts.",
              id: "Mencocokkan silang log ekspor milik vendor dengan kontrak Halcyon.",
            },
            {
              en: "Match found — same routing token as the acquisition paperwork.",
              id: "Kecocokan ditemukan — token routing yang sama dengan berkas akuisisi.",
            },
            { en: "LEVEL 8 COMPLETE — ANALYST ROUTE.", id: "LEVEL 8 SELESAI — JALUR ANALYST." },
          ],
          requiredFactHints: {
            "read-vendor-onboarding": {
              en: "Haven't read the vendor onboarding notice yet.",
              id: "Belum baca pemberitahuan onboarding vendor.",
            },
            "read-vendor-ledger": {
              en: "Haven't read the ledger export yet — log in first.",
              id: "Belum baca ekspor buku besar — login dulu.",
            },
          },
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "onboarding.txt",
            kind: "file",
            grantsFact: "read-vendor-onboarding",
            content: {
              en:
                "Vendor extranet — [[username:vendorops|Extranet vendor account]] / rotation pattern " +
                "encoded below (finance insisted): " +
                "[[encoded:TjFtYnVzI1ZlbmQwcg==|Encoded password pattern left in onboarding notes]]",
              id:
                "Extranet vendor — [[username:vendorops|Akun vendor extranet]] / pola rotasi " +
                "terenkode di bawah (permintaan finance): " +
                "[[encoded:TjFtYnVzI1ZlbmQwcg==|Pola password terenkode yang tertinggal di catatan onboarding]]",
            },
          },
          {
            name: "ledger_export.txt",
            kind: "file",
            grantsFact: "read-vendor-ledger",
            content: {
              en:
                "Nimbus Systems acquisition ledger — internal routing token: " +
                "[[hash:5f8a0c2e91b6d4317aa4e2c9f0b1d6a3|Checksum on the ledger export]]",
              id:
                "Buku besar akuisisi Nimbus Systems — token routing internal: " +
                "[[hash:5f8a0c2e91b6d4317aa4e2c9f0b1d6a3|Checksum pada ekspor buku besar]]",
            },
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
