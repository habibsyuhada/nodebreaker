import type { LevelDef } from "./types";

export const LEVEL_24: LevelDef = {
  id: "level-24",
  index: 23,
  title: { en: "Ferrovia Systems", id: "Ferrovia Systems" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    {
      en: "Target: Ferrovia Systems — the Civic OS control network.",
      id: "Target: Ferrovia Systems — jaringan kontrol Civic OS.",
    },
    {
      en: "Three ways in — quiet archive access, backdoor persistence, or a toll partner's own",
      id: "Tiga cara masuk — akses arsip senyap, persistence lewat backdoor, atau rotasi ceroboh",
    },
    {
      en: "sloppy rotation. Pick one route. The proof only needs one way through.",
      id: "milik mitra tol sendiri. Pilih satu jalur. Buktinya cuma butuh satu jalan masuk.",
    },
  ],
  entryNodeId: "civicos-gateway",
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
    { id: "analyst", label: { en: "Analyst", id: "Analyst" }, requiredFacts: ["vendor-correlated-complete"] },
  ],
  bossRewardThemes: { second: "ch3-ghost", third: "ch3-breach" },
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Stitch them together.", id: "Sambungkan semuanya." },
    cards: [
      {
        id: "l24-context",
        kind: "system",
        channel: { en: "Ferrovia Systems — Municipal Contract Deck (leaked slide 9)", id: "Ferrovia Systems — Slide Kontrak Kota (bocor, slide 9)" },
        author: { en: "Corporate Strategy", id: "Strategi Korporat" },
        body: [
          {
            en: "Civic OS modules, Q3: 4 city-facing systems generating toll and contract-tier revenue.",
            id: "Modul Civic OS, Q3: 4 sistem menghadap warga yang menghasilkan pendapatan tol dan tier kontrak.",
          },
        ],
      },
      {
        id: "l24-harm",
        kind: "system",
        channel: { en: "Ferrovia Systems — Municipal Contract Deck (leaked slide 9)", id: "Ferrovia Systems — Slide Kontrak Kota (bocor, slide 9)" },
        author: { en: "Corporate Strategy", id: "Strategi Korporat" },
        body: [
          {
            en: "Civic Transit — zone-throttled transfer windows, live. Elm Street Grid — tier-weighted restoration queue, live. Cityline Dispatch — contract-tier routing, live. Greenway Signals — toll-diversion timing, live.",
            id: "Civic Transit — jendela transfer dibatasi per zona, aktif. Elm Street Grid — antrean pemulihan dibobot tier, aktif. Cityline Dispatch — routing tier kontrak, aktif. Sinyal Greenway — waktu pengalihan tol, aktif.",
          },
        ],
      },
      {
        id: "l24-brushoff",
        kind: "system",
        channel: { en: "#compliance-flags", id: "#compliance-flags" },
        author: { en: "Compliance Bot", id: "Bot Kepatuhan" },
        body: [
          {
            en: "Flag: 4 civic modules under active resident or worker complaints. Status: acknowledged, no action required.",
            id: "Tanda: 4 modul warga sedang dalam keluhan warga atau pekerja aktif. Status: diketahui, tidak perlu tindakan.",
          },
        ],
      },
      {
        id: "l24-gloat",
        kind: "perp",
        channel: { en: "DM — Board Member to CEO", id: "DM — Anggota Dewan ke CEO" },
        author: { en: "Board Member", id: "Anggota Dewan" },
        body: [
          {
            en: "Every one of those is a city department's problem with our contract number in a footnote. Nobody stitches them together.",
            id: "Semua itu cuma masalah dinas kota yang ada nomor kontrak kita di catatan kaki. Gak ada yang bakal menyambungkan semuanya.",
          },
          { en: "Keep the modules siloed. That's the whole plan.", id: "Jaga modulnya tetap terpisah. Itu seluruh rencananya." },
        ],
      },
      {
        id: "l24-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Three ways into this network — recon-only, backdoors, or their own toll partner's sloppy rotation. One's enough. Get in, get proof, get out.",
            id: "Tiga cara masuk ke jaringan ini — recon murni, backdoor, atau rotasi ceroboh milik mitra tol mereka sendiri. Satu saja cukup. Masuk, ambil bukti, keluar.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Every module just got a name behind it.", id: "Setiap modul sekarang punya nama di baliknya." },
    cards: [
      {
        id: "l24-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Didn't need every system — just enough proof from one way in. Ran the correlation anyway once I was out.",
            id: "Gak perlu semua sistem — cukup bukti dari satu jalan masuk saja. Tetap jalankan korelasi begitu sudah keluar.",
          },
        ],
        answers: "l24-plan",
      },
      {
        id: "l24-outro-correlate",
        kind: "public",
        channel: { en: "correlate --sources civic-modules — output", id: "correlate --sources civic-modules — keluaran" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Cross-reference complete. Ferrovia Systems named as the common contractor across 4 civic complaints.",
            id: "Pencocokan silang selesai. Ferrovia Systems teridentifikasi sebagai kontraktor bersama di 4 keluhan warga.",
          },
        ],
        answers: "l24-gloat",
      },
      {
        id: "l24-outro-transit",
        kind: "system",
        channel: { en: "Civic Transit — Fare Systems", id: "Civic Transit — Sistem Tarif" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Zone override table reverted city-wide. Every ward now gets the same 90-minute transfer window.",
            id: "Tabel override zona dikembalikan di seluruh kota. Semua wilayah sekarang dapat jendela transfer 90 menit yang sama.",
          },
        ],
      },
      {
        id: "l24-outro-grid",
        kind: "system",
        channel: { en: "Elm Street Grid — Restoration", id: "Elm Street Grid — Pemulihan" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Restoration queue reordered by outage duration, contract-tier weighting removed.",
            id: "Antrean pemulihan diurutkan ulang berdasarkan durasi pemadaman, pembobotan tier kontrak dihapus.",
          },
        ],
      },
      {
        id: "l24-outro-cityline",
        kind: "system",
        channel: { en: "Cityline Emergency Dispatch", id: "Cityline Emergency Dispatch" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Routing table reverted to distance-based dispatch. Priya's flags reopened and confirmed.",
            id: "Tabel routing dikembalikan ke dispatch berbasis jarak. Laporan Priya dibuka kembali dan dikonfirmasi.",
          },
        ],
      },
      {
        id: "l24-outro-greenway",
        kind: "victim",
        channel: { en: "Greenway Depot — Maintenance Log", id: "Depot Greenway — Log Perawatan" },
        author: { en: "Omar (Signal Technician)", id: "Omar (Teknisi Sinyal)" },
        body: [
          {
            en: "(unrelated, probably) — first shift in weeks nobody's asked me about 5th & Main.",
            id: "(gak ada hubungannya, mungkin) — shift pertama dalam berminggu-minggu gak ada yang tanya soal 5th & Main.",
          },
        ],
        answers: "l24-harm",
      },
      {
        id: "l24-outro-panic",
        kind: "perp",
        channel: { en: "DM — Board Member to CEO", id: "DM — Anggota Dewan ke CEO" },
        author: { en: "Board Member", id: "Anggota Dewan" },
        body: [{ en: "someone stitched them together", id: "ada yang nyambungin semuanya" }],
      },
    ],
  },
  nodes: [
    {
      id: "civicos-gateway",
      ip: "203.0.113.240",
      orgName: "Ferrovia Systems — Civic OS Gateway",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.24 | Ferrovia Civic OS gateway" }],
      users: [{ username: "civicguest", password: "Ferrovia@Gate1", role: "guest" }],
      systemUsers: [
        { username: "civicguest", role: "guest" },
        { username: "root", role: "admin" },
      ],
      backdoors: [
        {
          id: "backdoor-gateway",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: [],
          grantsFact: "backdoor-gateway",
          narrationText: [
            "$ plant backdoor --target authorized_keys",
            { en: "Adding a spare key to the gateway's authorized_keys...", id: "Menambahkan kunci cadangan ke authorized_keys milik gateway..." },
            {
              en: "Backdoor planted — this foothold will survive a password rotation.",
              id: "Backdoor tertanam — pijakan ini akan bertahan meski password dirotasi.",
            },
          ],
        },
      ],
      pivots: [
        {
          id: "to-archive",
          targetNodeId: "civicos-archive",
          label: { en: "Pivot to 192.168.60.12", id: "Pivot ke 192.168.60.12" },
          requiredFacts: ["found-archive-ip"],
        },
        {
          id: "to-control",
          targetNodeId: "civicos-control",
          label: { en: "Pivot to 192.168.60.20", id: "Pivot ke 192.168.60.20" },
          requiredFacts: ["found-control-ip"],
        },
        {
          id: "to-vendor",
          targetNodeId: "civicos-vendor",
          label: { en: "Pivot to 198.51.100.95", id: "Pivot ke 198.51.100.95" },
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
                name: "gateway_access.txt",
                kind: "file",
                grantsFact: "read-gateway-note",
                content: {
                  en:
                    "Temporary gateway access for the new contractor —\n" +
                    "[[username:civicguest|Shared guest gateway account]] / " +
                    "[[password:Ferrovia@Gate1|Rotates monthly, but nobody's rotated it]]",
                  id:
                    "Akses gateway sementara untuk kontraktor baru —\n" +
                    "[[username:civicguest|Akun gateway tamu bersama]] / " +
                    "[[password:Ferrovia@Gate1|Dirotasi tiap bulan, tapi belum pernah dirotasi]]",
                },
              },
            ],
          },
          {
            name: "archive-note.txt",
            kind: "file",
            grantsFact: "found-archive-ip",
            content: {
              en:
                "Internal directory — civic module config archive: " +
                "[[path:192.168.60.12|Archive system, internal-only]]. Read-only login: " +
                "[[username:civicarchive|Archive read-only account, also valid on the annex]] / " +
                "[[password:M0duleArch!ve|Shared across archive and annex, never rotated]]. " +
                "Contact IT for VPN routes to other internal systems.",
              id:
                "Direktori internal — arsip config modul warga: " +
                "[[path:192.168.60.12|Sistem arsip, hanya internal]]. Login baca-saja: " +
                "[[username:civicarchive|Akun baca-saja arsip, juga berlaku di annex]] / " +
                "[[password:M0duleArch!ve|Dipakai bersama di arsip dan annex, tidak pernah dirotasi]]. " +
                "Hubungi IT untuk rute VPN ke sistem internal lainnya.",
            },
          },
          {
            name: "control-note.txt",
            kind: "file",
            grantsFact: "found-control-ip",
            content: {
              en:
                "Civic control ops has moved: [[path:192.168.60.20|Civic control server, internal-only]]. " +
                "Old bookmarks will 404.",
              id:
                "Ops kontrol warga sudah pindah: [[path:192.168.60.20|Server kontrol warga, hanya internal]]. " +
                "Bookmark lama akan 404.",
            },
          },
          {
            name: "vendor-note.txt",
            kind: "file",
            grantsFact: "found-vendor-ip",
            content: {
              en:
                "Partner integration reminder: TollLine Partners API bridge — " +
                "[[path:198.51.100.95|TollLine Partners API bridge, external]]. " +
                "Contact updated after the last integration review.",
              id:
                "Pengingat integrasi mitra: jembatan API TollLine Partners — " +
                "[[path:198.51.100.95|Jembatan API TollLine Partners, eksternal]]. " +
                "Kontak diperbarui setelah tinjauan integrasi terakhir.",
            },
          },
        ],
      },
    },
    {
      id: "civicos-archive",
      ip: "192.168.60.12",
      orgName: "Ferrovia Systems — Civic Module Archive",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | civic-archive-srv" }],
      users: [{ username: "civicarchive", password: "M0duleArch!ve", role: "archive read-only" }],
      systemUsers: [
        { username: "civicarchive", role: "archive read-only" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-annex",
          targetNodeId: "civicos-archive-annex",
          label: { en: "Pivot to 192.168.60.13", id: "Pivot ke 192.168.60.13" },
          requiredFacts: ["found-annex-ip"],
        },
        {
          id: "to-gateway",
          targetNodeId: "civicos-gateway",
          label: { en: "Pivot to 203.0.113.240", id: "Pivot ke 203.0.113.240" },
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "module_status.csv",
            kind: "file",
            grantsFact: "read-archive-data",
            content:
              "module,ward,status\n" +
              "transit,ward3,throttled\n" +
              "grid,ward3,deprioritized\n" +
              "dispatch,ward3,deprioritized",
          },
          {
            name: "annex-note.txt",
            kind: "file",
            grantsFact: "found-annex-ip",
            content: {
              en:
                "Reminder: contract-tier weighting tables moved to " +
                "[[path:192.168.60.13|Archive annex, internal-only]]. Update your bookmarks.",
              id:
                "Pengingat: tabel pembobotan tier kontrak pindah ke " +
                "[[path:192.168.60.13|Anex arsip, hanya internal]]. Perbarui bookmark kamu.",
            },
          },
        ],
      },
    },
    {
      id: "civicos-archive-annex",
      ip: "192.168.60.13",
      orgName: "Ferrovia Systems — Contract Tier Annex",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | contract-tier-annex-srv" }],
      users: [{ username: "civicarchive", password: "M0duleArch!ve", role: "archive read-only" }],
      systemUsers: [
        { username: "civicarchive", role: "archive read-only" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-archive",
          targetNodeId: "civicos-archive",
          label: { en: "Pivot to 192.168.60.12", id: "Pivot ke 192.168.60.12" },
          requiredFacts: [],
        },
      ],
      privilegeEscalations: [
        {
          id: "quiet-export",
          label: { en: "Quiet Export", id: "Ekspor Senyap" },
          requiredFacts: ["read-archive-data", "read-annex-weights"],
          grantsFact: "quiet-export-complete",
          narrationText: [
            "$ export --mode quiet --sources archive,annex",
            {
              en: "No privilege escalation, no backdoor — just what was already readable.",
              id: "Tanpa eskalasi privilese, tanpa backdoor — cuma yang memang sudah bisa dibaca.",
            },
            { en: "Export complete — clean exit.", id: "Ekspor selesai — keluar bersih." },
            { en: "LEVEL 24 COMPLETE — GHOST ROUTE.", id: "LEVEL 24 SELESAI — JALUR GHOST." },
          ],
          requiredFactHints: {
            "read-archive-data": {
              en: "Haven't pulled the module status archive yet — read module_status.csv on the Archive (192.168.60.12).",
              id: "Belum ambil arsip status modul — baca module_status.csv di Archive (192.168.60.12).",
            },
            "read-annex-weights": {
              en: "Haven't read the tier weighting table yet.",
              id: "Belum baca tabel pembobotan tier.",
            },
          },
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "tier_weights.csv",
            kind: "file",
            grantsFact: "read-annex-weights",
            content: "contract_tier,priority_weight\npremium,1.0\nstandard,0.6\nbasic,0.3",
          },
        ],
      },
    },
    {
      id: "civicos-control",
      ip: "192.168.60.20",
      orgName: "Ferrovia Systems — Civic Control Server",
      traceEnabled: true,
      adminOnlineThreshold: 55,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | civic-control-srv" }],
      users: [{ username: "controlops", password: "Grid$ecure9", role: "control ops" }],
      systemUsers: [
        { username: "controlops", role: "control ops" },
        { username: "root", role: "admin" },
      ],
      privilegeEscalations: [
        {
          id: "escalate-control",
          label: { en: "Drop Payload", id: "Jatuhkan Payload" },
          requiredFacts: ["found-cron-job-control", "found-dropbox-control"],
          grantsFact: "privilege-escalated",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            { en: "Waiting for the next sync cycle...", id: "Menunggu siklus sinkronisasi berikutnya..." },
            {
              en: "control-sync.sh executed your payload as root.",
              id: "control-sync.sh menjalankan payload kamu sebagai root.",
            },
            {
              en: "Privilege escalation successful — admin-level access granted.",
              id: "Eskalasi privilese berhasil — akses level admin diberikan.",
            },
          ],
          requiredFactHints: {
            "found-cron-job-control": {
              en: "You don't know what runs as root yet — check the ops runbook.",
              id: "Kamu belum tahu apa yang berjalan sebagai root — cek ops runbook.",
            },
            "found-dropbox-control": {
              en: "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
              id: "Kamu belum tahu di mana harus menaruh payload — cek /srv/shared/dropbox.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-control",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated"],
          grantsFact: "backdoor-control",
          narrationText: [
            "$ plant backdoor --target cron.d/control-sync",
            { en: "Hiding a persistent hook inside the sync job...", id: "Menyembunyikan hook persisten di dalam job sinkronisasi..." },
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
          id: "to-gateway",
          targetNodeId: "civicos-gateway",
          label: { en: "Pivot to 203.0.113.240", id: "Pivot ke 203.0.113.240" },
          requiredFacts: [],
        },
        {
          id: "to-backup",
          targetNodeId: "civicos-control-backup",
          label: { en: "Pivot to 192.168.60.21", id: "Pivot ke 192.168.60.21" },
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
            grantsFact: "read-control-contacts",
            content: {
              en:
                "Control ops contact — [[username:controlops|Control systems account]] / " +
                "[[password:Grid$ecure9|Shared by IT after the last reset]]",
              id:
                "Kontak operasi kontrol — [[username:controlops|Akun sistem kontrol]] / " +
                "[[password:Grid$ecure9|Dibagikan IT setelah reset terakhir]]",
            },
          },
          {
            name: "backup-note.txt",
            kind: "file",
            grantsFact: "found-backup-ip",
            content: {
              en:
                "Nightly control-config backups now route through the ops vault: " +
                "[[path:192.168.60.21|Backup vault, internal-only]]. Service login: " +
                "[[username:backupsvc|Backup service account]] / " +
                "[[password:V4ultControl!|Shared with the nightly job, never rotated]].",
              id:
                "Backup config kontrol malam hari sekarang lewat brankas ops: " +
                "[[path:192.168.60.21|Brankas backup, hanya internal]]. Login servis: " +
                "[[username:backupsvc|Akun servis backup]] / " +
                "[[password:V4ultControl!|Dipakai bersama job malam hari, tidak pernah dirotasi]].",
            },
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job-control",
                content: {
                  en:
                    "Ops runbook — control sync\n\n" +
                    "control-sync.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation.",
                  id:
                    "Runbook operasi — sinkronisasi kontrol\n\n" +
                    "control-sync.sh berjalan sebagai root setiap 5 menit.\n" +
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
                        grantsFact: "found-dropbox-control",
                        content: {
                          en: "Drop zone for the nightly control sync. Anything placed here gets picked up automatically.",
                          id: "Zona drop untuk sinkronisasi kontrol malam hari. Apa pun yang ditaruh di sini akan otomatis diambil.",
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
      id: "civicos-control-backup",
      ip: "192.168.60.21",
      orgName: "Ferrovia Systems — Control Ops Backup",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | control-backup-srv" }],
      users: [{ username: "backupsvc", password: "V4ultControl!", role: "backup service" }],
      systemUsers: [
        { username: "backupsvc", role: "backup service" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-control",
          targetNodeId: "civicos-control",
          label: { en: "Pivot to 192.168.60.20", id: "Pivot ke 192.168.60.20" },
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
            { en: "Waiting for the next sync cycle...", id: "Menunggu siklus sinkronisasi berikutnya..." },
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
          requiredFacts: ["backdoor-gateway", "backdoor-control", "backdoor-control-backup"],
          grantsFact: "breach-export-complete",
          narrationText: [
            "$ export --mode backdoor --hosts gateway,control,backup",
            { en: "Pulling through every planted backdoor at once.", id: "Menarik data lewat semua backdoor yang tertanam sekaligus." },
            { en: "Export complete — loud, but total.", id: "Ekspor selesai — berisik, tapi menyeluruh." },
            { en: "LEVEL 24 COMPLETE — BREACH ROUTE.", id: "LEVEL 24 SELESAI — JALUR BREACH." },
          ],
          requiredFactHints: {
            "backdoor-gateway": {
              en: "No persistent foothold on the Gateway (203.0.113.240) — plant a backdoor there.",
              id: "Belum ada pijakan persisten di Gateway (203.0.113.240) — tanam backdoor di sana.",
            },
            "backdoor-control": {
              en: "No persistent foothold on Civic Control (192.168.60.20) — escalate privileges there and plant a backdoor.",
              id: "Belum ada pijakan persisten di Civic Control (192.168.60.20) — eskalasi privilese di sana dan tanam backdoor.",
            },
            "backdoor-control-backup": {
              en: "No persistent foothold on this backup vault yet — escalate privileges here first.",
              id: "Belum ada pijakan persisten di brankas backup ini — eskalasi privilese di sini dulu.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-control-backup",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated-backup"],
          grantsFact: "backdoor-control-backup",
          narrationText: [
            "$ plant backdoor --target cron.d/backup-sync",
            { en: "Hiding a persistent hook inside the sync job...", id: "Menyembunyikan hook persisten di dalam job sinkronisasi..." },
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
                          en: "Drop zone for the nightly backup sync. Anything placed here gets picked up automatically.",
                          id: "Zona drop untuk sinkronisasi backup malam hari. Apa pun yang ditaruh di sini akan otomatis diambil.",
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
      id: "civicos-vendor",
      ip: "198.51.100.95",
      orgName: "TollLine Partners — API Bridge",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.22 | Partner API bridge" }],
      users: [{ username: "civicapi", password: "T0llLine#Route", role: "partner integration" }],
      systemUsers: [
        { username: "civicapi", role: "partner integration" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-gateway",
          targetNodeId: "civicos-gateway",
          label: { en: "Pivot to 203.0.113.240", id: "Pivot ke 203.0.113.240" },
          requiredFacts: [],
        },
      ],
      privilegeEscalations: [
        {
          id: "correlate-vendor",
          label: { en: "Correlate Feed", id: "Korelasi Feed" },
          requiredFacts: ["read-vendor-onboarding", "read-vendor-feed"],
          grantsFact: "vendor-correlated-complete",
          narrationText: [
            "$ correlate --source vendor-feed",
            {
              en: "Cross-referencing the partner's own feed logs against Ferrovia's timing exports.",
              id: "Mencocokkan silang log feed milik mitra dengan ekspor waktu Ferrovia.",
            },
            {
              en: "Match found — same diversion parameters pushed from Ferrovia's side.",
              id: "Kecocokan ditemukan — parameter pengalihan yang sama didorong dari sisi Ferrovia.",
            },
            { en: "LEVEL 24 COMPLETE — ANALYST ROUTE.", id: "LEVEL 24 SELESAI — JALUR ANALYST." },
          ],
          requiredFactHints: {
            "read-vendor-onboarding": {
              en: "Haven't read the partner onboarding notice yet.",
              id: "Belum baca pemberitahuan onboarding mitra.",
            },
            "read-vendor-feed": {
              en: "Haven't read the feed log yet — log in first.",
              id: "Belum baca log feed — login dulu.",
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
                "Partner API bridge — [[username:civicapi|Partner integration account]] / rotation pattern " +
                "encoded below (finance insisted): " +
                "[[encoded:VDBsbExpbmUjUm91dGU=|Encoded password pattern left in onboarding notes]]",
              id:
                "Jembatan API mitra — [[username:civicapi|Akun integrasi mitra]] / pola rotasi " +
                "terenkode di bawah (permintaan finance): " +
                "[[encoded:VDBsbExpbmUjUm91dGU=|Pola password terenkode yang tertinggal di catatan onboarding]]",
            },
          },
          {
            name: "feed_log.txt",
            kind: "file",
            grantsFact: "read-vendor-feed",
            content: {
              en:
                "Signal diversion feed log — parameters received from Ferrovia: intersection=5th&Main, " +
                "extra_red_seconds=40. Applied to signal controller automatically.",
              id:
                "Log feed pengalihan sinyal — parameter diterima dari Ferrovia: intersection=5th&Main, " +
                "extra_red_seconds=40. Diterapkan otomatis ke pengontrol sinyal.",
            },
          },
        ],
      },
    },
  ],
};
