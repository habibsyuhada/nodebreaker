import type { LevelDef } from "./types";

export const LEVEL_32: LevelDef = {
  id: "level-32",
  index: 31,
  title: { en: "Aurelia Capital", id: "Aurelia Capital" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    {
      en: "Target: Aurelia Capital — the fund behind all of it.",
      id: "Target: Aurelia Capital — dana di balik semuanya.",
    },
    {
      en: "Three ways in — quiet archive access, backdoor persistence, or a shell company's",
      id: "Tiga cara masuk — akses arsip senyap, persistence lewat backdoor, atau rotasi ceroboh",
    },
    {
      en: "own sloppy rotation. Pick one route. The proof only needs one way through.",
      id: "milik perusahaan cangkang sendiri. Pilih satu jalur. Buktinya cuma butuh satu jalan masuk.",
    },
  ],
  entryNodeId: "aurelia-gateway",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    {
      en: "You're in. Everything you've traced so far leads here.",
      id: "Kamu masuk. Semua yang sudah kamu telusuri selama ini berujung di sini.",
    },
  ],
  parSeconds: 960,
  winPaths: [
    { id: "ghost", label: { en: "Ghost", id: "Ghost" }, requiredFacts: ["quiet-export-complete"] },
    { id: "breach", label: { en: "Breach", id: "Breach" }, requiredFacts: ["breach-export-complete"] },
    { id: "analyst", label: { en: "Analyst", id: "Analyst" }, requiredFacts: ["vendor-correlated-complete"] },
  ],
  bossRewardThemes: { second: "ch4-ghost", third: "ch4-breach" },
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Every rounding error, every score, every override. One name.", id: "Setiap selisih pembulatan, setiap skor, setiap override. Satu nama." },
    cards: [
      {
        id: "l32-context",
        kind: "system",
        channel: { en: "Aurelia Capital — Fund III LPA (leaked exhibit C)", id: "Aurelia Capital — LPA Fund III (bocor, lampiran C)" },
        author: { en: "Fund Structuring", id: "Struktur Dana" },
        body: [
          {
            en: "Controlling stakes, confirmed: Halcyon Dynamics (71%), Meridian Health Analytics (64%), Ferrovia Systems (58%).",
            id: "Saham pengendali, dikonfirmasi: Halcyon Dynamics (71%), Meridian Health Analytics (64%), Ferrovia Systems (58%).",
          },
        ],
      },
      {
        id: "l32-harm",
        kind: "system",
        channel: { en: "Aurelia Capital — Fund III LPA (leaked exhibit C)", id: "Aurelia Capital — LPA Fund III (bocor, lampiran C)" },
        author: { en: "Fund Structuring", id: "Struktur Dana" },
        body: [
          {
            en: "Halcyon — data harvesting, exposed. Meridian — discriminatory scoring, exposed. Ferrovia — tiered civic throttling, exposed. All three funded from the same call.",
            id: "Halcyon — pengumpulan data, terbongkar. Meridian — skor diskriminatif, terbongkar. Ferrovia — pembatasan warga bertingkat, terbongkar. Ketiganya didanai dari panggilan modal yang sama.",
          },
        ],
      },
      {
        id: "l32-brushoff",
        kind: "system",
        channel: { en: "#compliance-flags", id: "#compliance-flags" },
        author: { en: "Compliance Bot", id: "Bot Kepatuhan" },
        body: [
          {
            en: "Flag: 3 portfolio companies under separate active public scrutiny. Status: acknowledged, no cross-reference required.",
            id: "Tanda: 3 perusahaan portofolio sedang dalam sorotan publik terpisah. Status: diketahui, tidak perlu pencocokan silang.",
          },
        ],
      },
      {
        id: "l32-gloat",
        kind: "perp",
        channel: { en: "DM — Managing Partner to General Counsel", id: "DM — Mitra Pengelola ke Penasihat Hukum" },
        author: { en: "Managing Partner", id: "Mitra Pengelola" },
        body: [
          {
            en: "Three separate scandals, three separate news cycles, three separate apologies from three separate CEOs. Nobody ever looks at who's behind the cap table.",
            id: "Tiga skandal terpisah, tiga siklus berita terpisah, tiga permintaan maaf terpisah dari tiga CEO terpisah. Gak ada yang pernah lihat siapa di balik cap table-nya.",
          },
          { en: "That's the whole structure. That's the whole point.", id: "Itulah seluruh strukturnya. Itulah seluruh maksudnya." },
        ],
      },
      {
        id: "l32-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Halcyon, Meridian, Ferrovia — three networks, three names on paper. One fund behind the cap table. Three ways into this one too. One's enough — get in, get proof, get out.",
            id: "Halcyon, Meridian, Ferrovia — tiga jaringan, tiga nama di atas kertas. Satu dana di balik cap table-nya. Tiga cara masuk ke sini juga. Satu saja cukup — masuk, ambil bukti, keluar.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Every rounding error just got the same name.", id: "Setiap selisih pembulatan sekarang punya nama yang sama." },
    cards: [
      {
        id: "l32-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Didn't need every system — just enough proof from one way in. Ran the full correlation once I was out: three networks, one cap table.",
            id: "Gak perlu semua sistem — cukup bukti dari satu jalan masuk saja. Jalankan korelasi penuh begitu sudah keluar: tiga jaringan, satu cap table.",
          },
        ],
        answers: "l32-plan",
      },
      {
        id: "l32-outro-correlate",
        kind: "public",
        channel: { en: "correlate --sources halcyon,meridian,ferrovia — output", id: "correlate --sources halcyon,meridian,ferrovia — keluaran" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Cross-reference complete. Aurelia Capital named as the controlling owner across all three networks and every case they touched.",
            id: "Pencocokan silang selesai. Aurelia Capital teridentifikasi sebagai pemilik pengendali di ketiga jaringan dan setiap kasus yang mereka sentuh.",
          },
        ],
        answers: "l32-gloat",
      },
      {
        id: "l32-outro-halcyon",
        kind: "system",
        channel: { en: "Halcyon Dynamics — Board", id: "Halcyon Dynamics — Dewan Direksi" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Funding source disclosed. Every case tied to Halcyon now names Aurelia as controlling owner.",
            id: "Sumber pendanaan diungkap. Setiap kasus yang terkait Halcyon sekarang menyebut Aurelia sebagai pemilik pengendali.",
          },
        ],
      },
      {
        id: "l32-outro-meridian",
        kind: "system",
        channel: { en: "Meridian Health Analytics — Board", id: "Meridian Health Analytics — Dewan Direksi" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Sentinel Score model referred for regulatory review. Aurelia named as majority owner in the filing.",
            id: "Model Sentinel Score dirujuk untuk tinjauan regulator. Aurelia disebut sebagai pemilik mayoritas di berkasnya.",
          },
        ],
      },
      {
        id: "l32-outro-ferrovia",
        kind: "system",
        channel: { en: "Ferrovia Systems — Board", id: "Ferrovia Systems — Dewan Direksi" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Civic OS contracts referred for municipal review. Aurelia named as controlling owner in the filing.",
            id: "Kontrak Civic OS dirujuk untuk tinjauan kota. Aurelia disebut sebagai pemilik pengendali di berkasnya.",
          },
        ],
      },
      {
        id: "l32-outro-devon",
        kind: "victim",
        channel: { en: "Aurelia Fund Ops — HR Case Log", id: "Aurelia Fund Ops — Log Kasus HR" },
        author: { en: "Devon (Fund Ops Analyst)", id: "Devon (Analis Fund Ops)" },
        body: [
          {
            en: "(unrelated, probably) — first week back at work nobody's asked me to file anything strange.",
            id: "(gak ada hubungannya, mungkin) — minggu pertama kerja lagi gak ada yang minta saya ajukan hal aneh.",
          },
        ],
        answers: "l32-harm",
      },
      {
        id: "l32-outro-panic",
        kind: "perp",
        channel: { en: "DM — Managing Partner to General Counsel", id: "DM — Mitra Pengelola ke Penasihat Hukum" },
        author: { en: "Managing Partner", id: "Mitra Pengelola" },
        body: [{ en: "someone stitched all three together", id: "ada yang nyambungin ketiganya sekaligus" }],
      },
    ],
  },
  nodes: [
    {
      id: "aurelia-gateway",
      ip: "203.0.113.255",
      orgName: "Aurelia Capital — Fund Gateway",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.24 | Aurelia Capital fund gateway" }],
      users: [{ username: "fundguest", password: "Aurelia@Gate1", role: "guest" }],
      systemUsers: [
        { username: "fundguest", role: "guest" },
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
          id: "to-halcyon-record",
          targetNodeId: "aurelia-halcyon-record",
          label: { en: "Pivot to 192.168.90.12", id: "Pivot ke 192.168.90.12" },
          requiredFacts: ["found-halcyon-record-ip"],
        },
        {
          id: "to-ferrovia-transfer",
          targetNodeId: "aurelia-ferrovia-transfer",
          label: { en: "Pivot to 192.168.90.20", id: "Pivot ke 192.168.90.20" },
          requiredFacts: ["found-ferrovia-transfer-ip"],
        },
        {
          id: "to-meridian-extranet",
          targetNodeId: "aurelia-meridian-extranet",
          label: { en: "Pivot to 198.51.100.99", id: "Pivot ke 198.51.100.99" },
          requiredFacts: ["found-meridian-extranet-ip"],
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
                    "[[username:fundguest|Shared guest gateway account]] / " +
                    "[[password:Aurelia@Gate1|Rotates monthly, but nobody's rotated it]]",
                  id:
                    "Akses gateway sementara untuk kontraktor baru —\n" +
                    "[[username:fundguest|Akun gateway tamu bersama]] / " +
                    "[[password:Aurelia@Gate1|Dirotasi tiap bulan, tapi belum pernah dirotasi]]",
                },
              },
            ],
          },
          {
            name: "halcyon-record-note.txt",
            kind: "file",
            grantsFact: "found-halcyon-record-ip",
            content: {
              en:
                "Internal directory — Halcyon funding record archive: " +
                "[[path:192.168.90.12|Archive system, internal-only]]. Read-only login: " +
                "[[username:fundarchive|Archive read-only account, also valid on the annex]] / " +
                "[[password:F0undingRec!ve|Shared across archive and annex, never rotated]]. " +
                "Contact IT for VPN routes to other internal systems.",
              id:
                "Direktori internal — arsip catatan pendanaan Halcyon: " +
                "[[path:192.168.90.12|Sistem arsip, hanya internal]]. Login baca-saja: " +
                "[[username:fundarchive|Akun baca-saja arsip, juga berlaku di annex]] / " +
                "[[password:F0undingRec!ve|Dipakai bersama di arsip dan annex, tidak pernah dirotasi]]. " +
                "Hubungi IT untuk rute VPN ke sistem internal lainnya.",
            },
          },
          {
            name: "ferrovia-transfer-note.txt",
            kind: "file",
            grantsFact: "found-ferrovia-transfer-ip",
            content: {
              en:
                "Ferrovia transfer ops has moved: [[path:192.168.90.20|Transfer infrastructure, internal-only]]. " +
                "Old bookmarks will 404.",
              id:
                "Ops transfer Ferrovia sudah pindah: [[path:192.168.90.20|Infrastruktur transfer, hanya internal]]. " +
                "Bookmark lama akan 404.",
            },
          },
          {
            name: "meridian-extranet-note.txt",
            kind: "file",
            grantsFact: "found-meridian-extranet-ip",
            content: {
              en:
                "Partner integration reminder: Meridian compliance extranet — " +
                "[[path:198.51.100.99|Meridian compliance extranet, external]]. " +
                "Contact updated after the last structuring review.",
              id:
                "Pengingat integrasi mitra: extranet kepatuhan Meridian — " +
                "[[path:198.51.100.99|Extranet kepatuhan Meridian, eksternal]]. " +
                "Kontak diperbarui setelah tinjauan struktur terakhir.",
            },
          },
        ],
      },
    },
    {
      id: "aurelia-halcyon-record",
      ip: "192.168.90.12",
      orgName: "Aurelia Capital — Halcyon Funding Record",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | halcyon-funding-srv" }],
      users: [{ username: "fundarchive", password: "F0undingRec!ve", role: "archive read-only" }],
      systemUsers: [
        { username: "fundarchive", role: "archive read-only" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-annex",
          targetNodeId: "aurelia-halcyon-annex",
          label: { en: "Pivot to 192.168.90.13", id: "Pivot ke 192.168.90.13" },
          requiredFacts: ["found-annex-ip"],
        },
        {
          id: "to-gateway",
          targetNodeId: "aurelia-gateway",
          label: { en: "Pivot to 203.0.113.255", id: "Pivot ke 203.0.113.255" },
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "funding_record.csv",
            kind: "file",
            grantsFact: "read-halcyon-record",
            content: "round,entity,amount_usd,date\nA,Halcyon Dynamics,42000000,2019-03-11\nB,Halcyon Dynamics,88000000,2021-07-02",
          },
          {
            name: "annex-note.txt",
            kind: "file",
            grantsFact: "found-annex-ip",
            content: {
              en:
                "Reminder: board-seat cross-reference moved to " +
                "[[path:192.168.90.13|Archive annex, internal-only]]. Update your bookmarks.",
              id:
                "Pengingat: pencocokan silang kursi dewan direksi pindah ke " +
                "[[path:192.168.90.13|Anex arsip, hanya internal]]. Perbarui bookmark kamu.",
            },
          },
        ],
      },
    },
    {
      id: "aurelia-halcyon-annex",
      ip: "192.168.90.13",
      orgName: "Aurelia Capital — Board Seat Annex",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | board-seat-annex-srv" }],
      users: [{ username: "fundarchive", password: "F0undingRec!ve", role: "archive read-only" }],
      systemUsers: [
        { username: "fundarchive", role: "archive read-only" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-record",
          targetNodeId: "aurelia-halcyon-record",
          label: { en: "Pivot to 192.168.90.12", id: "Pivot ke 192.168.90.12" },
          requiredFacts: [],
        },
      ],
      privilegeEscalations: [
        {
          id: "quiet-export",
          label: { en: "Quiet Export", id: "Ekspor Senyap" },
          requiredFacts: ["read-halcyon-record", "read-board-seats"],
          grantsFact: "quiet-export-complete",
          narrationText: [
            "$ export --mode quiet --sources record,annex",
            {
              en: "No privilege escalation, no backdoor — just what was already readable.",
              id: "Tanpa eskalasi privilese, tanpa backdoor — cuma yang memang sudah bisa dibaca.",
            },
            { en: "Export complete — clean exit.", id: "Ekspor selesai — keluar bersih." },
            { en: "LEVEL 32 COMPLETE — GHOST ROUTE.", id: "LEVEL 32 SELESAI — JALUR GHOST." },
          ],
          requiredFactHints: {
            "read-halcyon-record": {
              en: "Haven't pulled the funding record yet — read funding_record.csv on the Record archive (192.168.90.12).",
              id: "Belum ambil catatan pendanaan — baca funding_record.csv di Record archive (192.168.90.12).",
            },
            "read-board-seats": {
              en: "Haven't read the board-seat cross-reference yet.",
              id: "Belum baca pencocokan silang kursi dewan direksi.",
            },
          },
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "board_seats.csv",
            kind: "file",
            grantsFact: "read-board-seats",
            content:
              "entity,board_seat,filled_by\n" +
              "Halcyon Dynamics,Chair,Aurelia Managing Partner\n" +
              "Meridian Health Analytics,Chair,Aurelia Managing Partner\n" +
              "Ferrovia Systems,Chair,Aurelia Managing Partner",
          },
        ],
      },
    },
    {
      id: "aurelia-ferrovia-transfer",
      ip: "192.168.90.20",
      orgName: "Aurelia Capital — Ferrovia Transfer Infrastructure",
      traceEnabled: true,
      adminOnlineThreshold: 55,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | transfer-internal-srv" }],
      users: [{ username: "transferops", password: "Wire$ecure9", role: "transfer ops" }],
      systemUsers: [
        { username: "transferops", role: "transfer ops" },
        { username: "root", role: "admin" },
      ],
      privilegeEscalations: [
        {
          id: "escalate-transfer",
          label: { en: "Drop Payload", id: "Jatuhkan Payload" },
          requiredFacts: ["found-cron-job-transfer", "found-dropbox-transfer"],
          grantsFact: "privilege-escalated",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            { en: "Waiting for the next sync cycle...", id: "Menunggu siklus sinkronisasi berikutnya..." },
            {
              en: "transfer-sync.sh executed your payload as root.",
              id: "transfer-sync.sh menjalankan payload kamu sebagai root.",
            },
            {
              en: "Privilege escalation successful — admin-level access granted.",
              id: "Eskalasi privilese berhasil — akses level admin diberikan.",
            },
          ],
          requiredFactHints: {
            "found-cron-job-transfer": {
              en: "You don't know what runs as root yet — check the ops runbook.",
              id: "Kamu belum tahu apa yang berjalan sebagai root — cek ops runbook.",
            },
            "found-dropbox-transfer": {
              en: "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
              id: "Kamu belum tahu di mana harus menaruh payload — cek /srv/shared/dropbox.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-transfer",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated"],
          grantsFact: "backdoor-transfer",
          narrationText: [
            "$ plant backdoor --target cron.d/transfer-sync",
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
          targetNodeId: "aurelia-gateway",
          label: { en: "Pivot to 203.0.113.255", id: "Pivot ke 203.0.113.255" },
          requiredFacts: [],
        },
        {
          id: "to-backup",
          targetNodeId: "aurelia-ferrovia-backup",
          label: { en: "Pivot to 192.168.90.21", id: "Pivot ke 192.168.90.21" },
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
            grantsFact: "read-transfer-contacts",
            content: {
              en:
                "Transfer ops contact — [[username:transferops|Transfer systems account]] / " +
                "[[password:Wire$ecure9|Shared by IT after the last reset]]",
              id:
                "Kontak operasi transfer — [[username:transferops|Akun sistem transfer]] / " +
                "[[password:Wire$ecure9|Dibagikan IT setelah reset terakhir]]",
            },
          },
          {
            name: "backup-note.txt",
            kind: "file",
            grantsFact: "found-backup-ip",
            content: {
              en:
                "Nightly transfer-ledger backups now route through the ops vault: " +
                "[[path:192.168.90.21|Backup vault, internal-only]]. Service login: " +
                "[[username:backupsvc|Backup service account]] / " +
                "[[password:V4ultTransfer!|Shared with the nightly job, never rotated]].",
              id:
                "Backup buku besar transfer malam hari sekarang lewat brankas ops: " +
                "[[path:192.168.90.21|Brankas backup, hanya internal]]. Login servis: " +
                "[[username:backupsvc|Akun servis backup]] / " +
                "[[password:V4ultTransfer!|Dipakai bersama job malam hari, tidak pernah dirotasi]].",
            },
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job-transfer",
                content: {
                  en:
                    "Ops runbook — transfer sync\n\n" +
                    "transfer-sync.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation.",
                  id:
                    "Runbook operasi — sinkronisasi transfer\n\n" +
                    "transfer-sync.sh berjalan sebagai root setiap 5 menit.\n" +
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
                        grantsFact: "found-dropbox-transfer",
                        content: {
                          en: "Drop zone for the nightly transfer sync. Anything placed here gets picked up automatically.",
                          id: "Zona drop untuk sinkronisasi transfer malam hari. Apa pun yang ditaruh di sini akan otomatis diambil.",
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
      id: "aurelia-ferrovia-backup",
      ip: "192.168.90.21",
      orgName: "Aurelia Capital — Transfer Ops Backup",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | transfer-backup-srv" }],
      users: [{ username: "backupsvc", password: "V4ultTransfer!", role: "backup service" }],
      systemUsers: [
        { username: "backupsvc", role: "backup service" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-transfer",
          targetNodeId: "aurelia-ferrovia-transfer",
          label: { en: "Pivot to 192.168.90.20", id: "Pivot ke 192.168.90.20" },
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
          requiredFacts: ["backdoor-gateway", "backdoor-transfer", "backdoor-transfer-backup"],
          grantsFact: "breach-export-complete",
          narrationText: [
            "$ export --mode backdoor --hosts gateway,transfer,backup",
            { en: "Pulling through every planted backdoor at once.", id: "Menarik data lewat semua backdoor yang tertanam sekaligus." },
            { en: "Export complete — loud, but total.", id: "Ekspor selesai — berisik, tapi menyeluruh." },
            { en: "LEVEL 32 COMPLETE — BREACH ROUTE.", id: "LEVEL 32 SELESAI — JALUR BREACH." },
          ],
          requiredFactHints: {
            "backdoor-gateway": {
              en: "No persistent foothold on the Gateway (203.0.113.255) — plant a backdoor there.",
              id: "Belum ada pijakan persisten di Gateway (203.0.113.255) — tanam backdoor di sana.",
            },
            "backdoor-transfer": {
              en: "No persistent foothold on the Transfer Infrastructure (192.168.90.20) — escalate privileges there and plant a backdoor.",
              id: "Belum ada pijakan persisten di Transfer Infrastructure (192.168.90.20) — eskalasi privilese di sana dan tanam backdoor.",
            },
            "backdoor-transfer-backup": {
              en: "No persistent foothold on this backup vault yet — escalate privileges here first.",
              id: "Belum ada pijakan persisten di brankas backup ini — eskalasi privilese di sini dulu.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-transfer-backup",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated-backup"],
          grantsFact: "backdoor-transfer-backup",
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
      id: "aurelia-meridian-extranet",
      ip: "198.51.100.99",
      orgName: "Meridian Health Analytics — Compliance Extranet",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.22 | Partner compliance extranet" }],
      users: [{ username: "aureliaapi", password: "Aur3liaLink#7", role: "structuring liaison" }],
      systemUsers: [
        { username: "aureliaapi", role: "structuring liaison" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-gateway",
          targetNodeId: "aurelia-gateway",
          label: { en: "Pivot to 203.0.113.255", id: "Pivot ke 203.0.113.255" },
          requiredFacts: [],
        },
      ],
      privilegeEscalations: [
        {
          id: "correlate-vendor",
          label: { en: "Correlate Structuring", id: "Korelasi Struktur" },
          requiredFacts: ["read-vendor-onboarding", "read-vendor-ledger"],
          grantsFact: "vendor-correlated-complete",
          narrationText: [
            "$ correlate --source structuring-ledger",
            {
              en: "Cross-referencing the extranet's own structuring ledger against Aurelia's cap table.",
              id: "Mencocokkan silang buku besar struktur milik extranet dengan cap table Aurelia.",
            },
            {
              en: "Match found — same controlling entity across all three portfolio companies.",
              id: "Kecocokan ditemukan — entitas pengendali yang sama di ketiga perusahaan portofolio.",
            },
            { en: "LEVEL 32 COMPLETE — ANALYST ROUTE.", id: "LEVEL 32 SELESAI — JALUR ANALYST." },
          ],
          requiredFactHints: {
            "read-vendor-onboarding": {
              en: "Haven't read the structuring liaison onboarding notice yet.",
              id: "Belum baca pemberitahuan onboarding liaison struktur.",
            },
            "read-vendor-ledger": {
              en: "Haven't read the structuring ledger yet — log in first.",
              id: "Belum baca buku besar struktur — login dulu.",
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
                "Compliance extranet — [[username:aureliaapi|Structuring liaison account]] / rotation pattern " +
                "encoded below (finance insisted): " +
                "[[encoded:QXVyM2xpYUxpbmsjNw==|Encoded password pattern left in onboarding notes]]",
              id:
                "Extranet kepatuhan — [[username:aureliaapi|Akun liaison struktur]] / pola rotasi " +
                "terenkode di bawah (permintaan finance): " +
                "[[encoded:QXVyM2xpYUxpbmsjNw==|Pola password terenkode yang tertinggal di catatan onboarding]]",
            },
          },
          {
            name: "structuring_ledger.txt",
            kind: "file",
            grantsFact: "read-vendor-ledger",
            content: {
              en:
                "Structuring ledger — controlling entity for all three cap tables: Aurelia Capital Fund III. " +
                "Same routing token used on every disbursement.",
              id:
                "Buku besar struktur — entitas pengendali untuk ketiga cap table: Aurelia Capital Fund III. " +
                "Token routing yang sama dipakai di setiap pencairan.",
            },
          },
        ],
      },
    },
  ],
};
