import type { LevelDef } from "./types";

export const LEVEL_16: LevelDef = {
  id: "level-16",
  index: 15,
  title: { en: "Meridian Health Analytics", id: "Meridian Health Analytics" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    {
      en: "Target: Meridian Health Analytics — the Sentinel Score network.",
      id: "Target: Meridian Health Analytics — jaringan Sentinel Score.",
    },
    {
      en: "Three ways in — quiet archive access, backdoor persistence, or a partner's own",
      id: "Tiga cara masuk — akses arsip senyap, persistence lewat backdoor, atau rotasi ceroboh",
    },
    {
      en: "sloppy rotation. Pick one route. The proof only needs one way through.",
      id: "milik mitra sendiri. Pilih satu jalur. Buktinya cuma butuh satu jalan masuk.",
    },
  ],
  entryNodeId: "meridian-gateway",
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
  bossRewardThemes: { second: "ch2-ghost", third: "ch2-breach" },
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Stitch them together.", id: "Sambungkan semuanya." },
    cards: [
      {
        id: "l16-context",
        kind: "system",
        channel: { en: "Meridian Health Analytics — Investor Deck (leaked slide 6)", id: "Meridian Health Analytics — Slide Investor (bocor, slide 6)" },
        author: { en: "Corporate Strategy", id: "Strategi Korporat" },
        body: [
          {
            en: "Partner integrations, Q2: 4 downstream partners consuming the Sentinel Score feed at scale.",
            id: "Integrasi mitra, Q2: 4 mitra hilir mengonsumsi feed Sentinel Score dalam skala besar.",
          },
        ],
      },
      {
        id: "l16-harm",
        kind: "system",
        channel: { en: "Meridian Health Analytics — Investor Deck (leaked slide 6)", id: "Meridian Health Analytics — Slide Investor (bocor, slide 6)" },
        author: { en: "Corporate Strategy", id: "Strategi Korporat" },
        body: [
          {
            en: "Cascade Wellness — consent scope widened Q2. Alameda Regional Hospital — claims auto-denial live. Coastal Life & Health — underwriting cutoff tuned to quota. Union Home Care — location-score suspensions, ongoing.",
            id: "Cascade Wellness — cakupan consent diperluas Q2. Rumah Sakit Regional Alameda — penolakan klaim otomatis aktif. Coastal Life & Health — ambang underwriting disetel ke kuota. Union Home Care — skors skor lokasi, berjalan.",
          },
        ],
      },
      {
        id: "l16-brushoff",
        kind: "system",
        channel: { en: "#compliance-flags", id: "#compliance-flags" },
        author: { en: "Compliance Bot", id: "Bot Kepatuhan" },
        body: [
          {
            en: "Flag: 4 partner integrations under active consumer or labor complaints. Status: acknowledged, no action required.",
            id: "Tanda: 4 integrasi mitra sedang dalam keluhan konsumen atau tenaga kerja aktif. Status: diketahui, tidak perlu tindakan.",
          },
        ],
      },
      {
        id: "l16-gloat",
        kind: "perp",
        channel: { en: "DM — Board Member to CEO", id: "DM — Anggota Dewan ke CEO" },
        author: { en: "Board Member", id: "Anggota Dewan" },
        body: [
          {
            en: "Every one of those is a partner's problem with our name in a footnote. Nobody stitches them together.",
            id: "Semua itu cuma masalah mitra yang ada nama kita di catatan kaki. Gak ada yang bakal menyambungkan semuanya.",
          },
          { en: "Keep the score model opaque. That's the whole plan.", id: "Jaga model skornya tetap gak transparan. Itu seluruh rencananya." },
        ],
      },
      {
        id: "l16-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Three ways into this network — recon-only, backdoors, or their own partner's sloppy rotation. One's enough. Get in, get proof, get out.",
            id: "Tiga cara masuk ke jaringan ini — recon murni, backdoor, atau rotasi ceroboh milik mitra mereka sendiri. Satu saja cukup. Masuk, ambil bukti, keluar.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Every score just got a name behind it.", id: "Setiap skor sekarang punya nama di baliknya." },
    cards: [
      {
        id: "l16-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Didn't need every system — just enough proof from one way in. Ran the correlation anyway once I was out.",
            id: "Gak perlu semua sistem — cukup bukti dari satu jalan masuk saja. Tetap jalankan korelasi begitu sudah keluar.",
          },
        ],
        answers: "l16-plan",
      },
      {
        id: "l16-outro-correlate",
        kind: "public",
        channel: { en: "correlate --sources partners — output", id: "correlate --sources partners — keluaran" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Cross-reference complete. Meridian Health Analytics named as the common scoring source across 4 partner complaints.",
            id: "Pencocokan silang selesai. Meridian Health Analytics teridentifikasi sebagai sumber skor bersama di 4 keluhan mitra.",
          },
        ],
        answers: "l16-gloat",
      },
      {
        id: "l16-outro-cascade",
        kind: "system",
        channel: { en: "Cascade Wellness — Internal", id: "Cascade Wellness — Internal" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Consent scope reverted to on-device-only. Wulan's data withdrawn from the Sentinel feed.",
            id: "Cakupan consent dikembalikan ke on-device-only. Data Wulan ditarik dari feed Sentinel.",
          },
        ],
      },
      {
        id: "l16-outro-alameda",
        kind: "system",
        channel: { en: "Alameda Regional Hospital — Claims", id: "Rumah Sakit Regional Alameda — Klaim" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "This week's auto-denials reversed pending manual review. Case #5521 reopened.",
            id: "Penolakan otomatis minggu ini dibatalkan menunggu tinjauan manual. Kasus #5521 dibuka kembali.",
          },
        ],
      },
      {
        id: "l16-outro-coastal",
        kind: "system",
        channel: { en: "Coastal Life & Health — Underwriting", id: "Coastal Life & Health — Underwriting" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Zip-code weighting flagged for regulatory review. Deborah's appeal already reversed.",
            id: "Pembobotan kode pos ditandai untuk tinjauan regulator. Banding Deborah sudah dibatalkan sebelumnya.",
          },
        ],
      },
      {
        id: "l16-outro-union",
        kind: "victim",
        channel: { en: "Union Home Care — HR Case Log", id: "Union Home Care — Log Kasus HR" },
        author: { en: "Ratih (Caregiver)", id: "Ratih (Perawat Rumah)" },
        body: [
          {
            en: "(unrelated, probably) — first full paycheck in a month.",
            id: "(gak ada hubungannya, mungkin) — gaji penuh pertama dalam sebulan.",
          },
        ],
        answers: "l16-harm",
      },
      {
        id: "l16-outro-panic",
        kind: "perp",
        channel: { en: "DM — Board Member to CEO", id: "DM — Anggota Dewan ke CEO" },
        author: { en: "Board Member", id: "Anggota Dewan" },
        body: [{ en: "someone stitched them together", id: "ada yang nyambungin semuanya" }],
      },
    ],
  },
  nodes: [
    {
      id: "meridian-gateway",
      ip: "203.0.113.220",
      orgName: "Meridian Health Analytics — Sentinel Score Gateway",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.24 | Meridian Sentinel Score gateway" }],
      users: [{ username: "scoreguest", password: "Meridian@Gate1", role: "guest" }],
      systemUsers: [
        { username: "scoreguest", role: "guest" },
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
          targetNodeId: "meridian-archive",
          label: { en: "Pivot to 192.168.50.12", id: "Pivot ke 192.168.50.12" },
          requiredFacts: ["found-archive-ip"],
        },
        {
          id: "to-scoring",
          targetNodeId: "meridian-scoring",
          label: { en: "Pivot to 192.168.50.20", id: "Pivot ke 192.168.50.20" },
          requiredFacts: ["found-scoring-ip"],
        },
        {
          id: "to-vendor",
          targetNodeId: "meridian-vendor",
          label: { en: "Pivot to 198.51.100.90", id: "Pivot ke 198.51.100.90" },
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
                    "[[username:scoreguest|Shared guest gateway account]] / " +
                    "[[password:Meridian@Gate1|Rotates monthly, but nobody's rotated it]]",
                  id:
                    "Akses gateway sementara untuk kontraktor baru —\n" +
                    "[[username:scoreguest|Akun gateway tamu bersama]] / " +
                    "[[password:Meridian@Gate1|Dirotasi tiap bulan, tapi belum pernah dirotasi]]",
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
                "Internal directory — patient score archive: " +
                "[[path:192.168.50.12|Archive system, internal-only]]. Read-only login: " +
                "[[username:archivero|Archive read-only account, also valid on the annex]] / " +
                "[[password:Sc0reArch!ve|Shared across archive and annex, never rotated]]. " +
                "Contact IT for VPN routes to other internal systems.",
              id:
                "Direktori internal — arsip skor pasien: " +
                "[[path:192.168.50.12|Sistem arsip, hanya internal]]. Login baca-saja: " +
                "[[username:archivero|Akun baca-saja arsip, juga berlaku di annex]] / " +
                "[[password:Sc0reArch!ve|Dipakai bersama di arsip dan annex, tidak pernah dirotasi]]. " +
                "Hubungi IT untuk rute VPN ke sistem internal lainnya.",
            },
          },
          {
            name: "scoring-note.txt",
            kind: "file",
            grantsFact: "found-scoring-ip",
            content: {
              en:
                "Scoring engine ops has moved: [[path:192.168.50.20|Scoring engine, internal-only]]. " +
                "Old bookmarks will 404.",
              id:
                "Ops mesin skor sudah pindah: [[path:192.168.50.20|Mesin skor, hanya internal]]. " +
                "Bookmark lama akan 404.",
            },
          },
          {
            name: "vendor-note.txt",
            kind: "file",
            grantsFact: "found-vendor-ip",
            content: {
              en:
                "Partner integration reminder: Coastal Life & Health API bridge — " +
                "[[path:198.51.100.90|Coastal Life & Health API bridge, external]]. " +
                "Contact updated after the last integration review.",
              id:
                "Pengingat integrasi mitra: jembatan API Coastal Life & Health — " +
                "[[path:198.51.100.90|Jembatan API Coastal Life & Health, eksternal]]. " +
                "Kontak diperbarui setelah tinjauan integrasi terakhir.",
            },
          },
        ],
      },
    },
    {
      id: "meridian-archive",
      ip: "192.168.50.12",
      orgName: "Meridian Health Analytics — Patient Score Archive",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | score-archive-srv" }],
      users: [{ username: "archivero", password: "Sc0reArch!ve", role: "archive read-only" }],
      systemUsers: [
        { username: "archivero", role: "archive read-only" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-annex",
          targetNodeId: "meridian-archive-annex",
          label: { en: "Pivot to 192.168.50.13", id: "Pivot ke 192.168.50.13" },
          requiredFacts: ["found-annex-ip"],
        },
        {
          id: "to-gateway",
          targetNodeId: "meridian-gateway",
          label: { en: "Pivot to 203.0.113.220", id: "Pivot ke 203.0.113.220" },
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "scores.csv",
            kind: "file",
            grantsFact: "read-archive-data",
            content:
              "patient_id,zip,score,outcome\n" +
              "5521,94110,38,denied\n" +
              "6612,94612,41,denied\n" +
              "7003,94103,52,approved",
          },
          {
            name: "annex-note.txt",
            kind: "file",
            grantsFact: "found-annex-ip",
            content: {
              en:
                "Reminder: raw model weights moved to " +
                "[[path:192.168.50.13|Archive annex, internal-only]]. Update your bookmarks.",
              id:
                "Pengingat: bobot model mentah pindah ke " +
                "[[path:192.168.50.13|Anex arsip, hanya internal]]. Perbarui bookmark kamu.",
            },
          },
        ],
      },
    },
    {
      id: "meridian-archive-annex",
      ip: "192.168.50.13",
      orgName: "Meridian Health Analytics — Score Model Annex",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | score-annex-srv" }],
      users: [{ username: "archivero", password: "Sc0reArch!ve", role: "archive read-only" }],
      systemUsers: [
        { username: "archivero", role: "archive read-only" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-archive",
          targetNodeId: "meridian-archive",
          label: { en: "Pivot to 192.168.50.12", id: "Pivot ke 192.168.50.12" },
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
            { en: "LEVEL 16 COMPLETE — GHOST ROUTE.", id: "LEVEL 16 SELESAI — JALUR GHOST." },
          ],
          requiredFactHints: {
            "read-archive-data": {
              en: "Haven't pulled the score archive yet — read scores.csv on the Archive (192.168.50.12).",
              id: "Belum ambil data arsip skor — baca scores.csv di Archive (192.168.50.12).",
            },
            "read-annex-weights": {
              en: "Haven't read the model weights yet.",
              id: "Belum baca bobot model.",
            },
          },
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "model_weights.csv",
            kind: "file",
            grantsFact: "read-annex-weights",
            content: "feature,weight\nzip_code,0.34\nincome_bracket,0.21\nclinical_history,0.19\nage,0.11",
          },
        ],
      },
    },
    {
      id: "meridian-scoring",
      ip: "192.168.50.20",
      orgName: "Meridian Health Analytics — Scoring Engine",
      traceEnabled: true,
      adminOnlineThreshold: 55,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | scoring-internal-srv" }],
      users: [{ username: "scoreops", password: "Cutoff$ecure9", role: "scoring ops" }],
      systemUsers: [
        { username: "scoreops", role: "scoring ops" },
        { username: "root", role: "admin" },
      ],
      privilegeEscalations: [
        {
          id: "escalate-scoring",
          label: { en: "Drop Payload", id: "Jatuhkan Payload" },
          requiredFacts: ["found-cron-job-scoring", "found-dropbox-scoring"],
          grantsFact: "privilege-escalated",
          narrationText: [
            "$ drop payload.trigger --target /srv/shared/dropbox",
            { en: "Waiting for the next sync cycle...", id: "Menunggu siklus sinkronisasi berikutnya..." },
            {
              en: "cutoff-sync.sh executed your payload as root.",
              id: "cutoff-sync.sh menjalankan payload kamu sebagai root.",
            },
            {
              en: "Privilege escalation successful — admin-level access granted.",
              id: "Eskalasi privilese berhasil — akses level admin diberikan.",
            },
          ],
          requiredFactHints: {
            "found-cron-job-scoring": {
              en: "You don't know what runs as root yet — check the ops runbook.",
              id: "Kamu belum tahu apa yang berjalan sebagai root — cek ops runbook.",
            },
            "found-dropbox-scoring": {
              en: "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
              id: "Kamu belum tahu di mana harus menaruh payload — cek /srv/shared/dropbox.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-scoring",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated"],
          grantsFact: "backdoor-scoring",
          narrationText: [
            "$ plant backdoor --target cron.d/cutoff-sync",
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
          targetNodeId: "meridian-gateway",
          label: { en: "Pivot to 203.0.113.220", id: "Pivot ke 203.0.113.220" },
          requiredFacts: [],
        },
        {
          id: "to-backup",
          targetNodeId: "meridian-scoring-backup",
          label: { en: "Pivot to 192.168.50.21", id: "Pivot ke 192.168.50.21" },
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
            grantsFact: "read-scoring-contacts",
            content: {
              en:
                "Scoring ops contact — [[username:scoreops|Scoring systems account]] / " +
                "[[password:Cutoff$ecure9|Shared by IT after the last reset]]",
              id:
                "Kontak operasi skor — [[username:scoreops|Akun sistem skor]] / " +
                "[[password:Cutoff$ecure9|Dibagikan IT setelah reset terakhir]]",
            },
          },
          {
            name: "backup-note.txt",
            kind: "file",
            grantsFact: "found-backup-ip",
            content: {
              en:
                "Nightly cutoff-tuning backups now route through the ops vault: " +
                "[[path:192.168.50.21|Backup vault, internal-only]]. Service login: " +
                "[[username:backupsvc|Backup service account]] / " +
                "[[password:V4ultCutoff!|Shared with the nightly job, never rotated]].",
              id:
                "Backup penyetelan ambang malam hari sekarang lewat brankas ops: " +
                "[[path:192.168.50.21|Brankas backup, hanya internal]]. Login servis: " +
                "[[username:backupsvc|Akun servis backup]] / " +
                "[[password:V4ultCutoff!|Dipakai bersama job malam hari, tidak pernah dirotasi]].",
            },
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job-scoring",
                content: {
                  en:
                    "Ops runbook — cutoff sync\n\n" +
                    "cutoff-sync.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation.",
                  id:
                    "Runbook operasi — sinkronisasi ambang\n\n" +
                    "cutoff-sync.sh berjalan sebagai root setiap 5 menit.\n" +
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
                        grantsFact: "found-dropbox-scoring",
                        content: {
                          en: "Drop zone for the nightly cutoff sync. Anything placed here gets picked up automatically.",
                          id: "Zona drop untuk sinkronisasi ambang malam hari. Apa pun yang ditaruh di sini akan otomatis diambil.",
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
      id: "meridian-scoring-backup",
      ip: "192.168.50.21",
      orgName: "Meridian Health Analytics — Scoring Ops Backup",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | scoring-backup-srv" }],
      users: [{ username: "backupsvc", password: "V4ultCutoff!", role: "backup service" }],
      systemUsers: [
        { username: "backupsvc", role: "backup service" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-scoring",
          targetNodeId: "meridian-scoring",
          label: { en: "Pivot to 192.168.50.20", id: "Pivot ke 192.168.50.20" },
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
          requiredFacts: ["backdoor-gateway", "backdoor-scoring", "backdoor-scoring-backup"],
          grantsFact: "breach-export-complete",
          narrationText: [
            "$ export --mode backdoor --hosts gateway,scoring,backup",
            { en: "Pulling through every planted backdoor at once.", id: "Menarik data lewat semua backdoor yang tertanam sekaligus." },
            { en: "Export complete — loud, but total.", id: "Ekspor selesai — berisik, tapi menyeluruh." },
            { en: "LEVEL 16 COMPLETE — BREACH ROUTE.", id: "LEVEL 16 SELESAI — JALUR BREACH." },
          ],
          requiredFactHints: {
            "backdoor-gateway": {
              en: "No persistent foothold on the Gateway (203.0.113.220) — plant a backdoor there.",
              id: "Belum ada pijakan persisten di Gateway (203.0.113.220) — tanam backdoor di sana.",
            },
            "backdoor-scoring": {
              en: "No persistent foothold on the Scoring Engine (192.168.50.20) — escalate privileges there and plant a backdoor.",
              id: "Belum ada pijakan persisten di Scoring Engine (192.168.50.20) — eskalasi privilese di sana dan tanam backdoor.",
            },
            "backdoor-scoring-backup": {
              en: "No persistent foothold on this backup vault yet — escalate privileges here first.",
              id: "Belum ada pijakan persisten di brankas backup ini — eskalasi privilese di sini dulu.",
            },
          },
        },
      ],
      backdoors: [
        {
          id: "backdoor-scoring-backup",
          label: { en: "Plant Backdoor", id: "Tanam Backdoor" },
          requiredFacts: ["privilege-escalated-backup"],
          grantsFact: "backdoor-scoring-backup",
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
      id: "meridian-vendor",
      ip: "198.51.100.90",
      orgName: "Coastal Life & Health — API Bridge",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "nginx 1.22 | Partner API bridge" }],
      users: [{ username: "coastalapi", password: "C0astal#Bridge", role: "partner integration" }],
      systemUsers: [
        { username: "coastalapi", role: "partner integration" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-gateway",
          targetNodeId: "meridian-gateway",
          label: { en: "Pivot to 203.0.113.220", id: "Pivot ke 203.0.113.220" },
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
              en: "Cross-referencing the partner's own feed logs against Meridian's score exports.",
              id: "Mencocokkan silang log feed milik mitra dengan ekspor skor Meridian.",
            },
            {
              en: "Match found — same cutoff parameters pushed from Meridian's side.",
              id: "Kecocokan ditemukan — parameter ambang yang sama didorong dari sisi Meridian.",
            },
            { en: "LEVEL 16 COMPLETE — ANALYST ROUTE.", id: "LEVEL 16 SELESAI — JALUR ANALYST." },
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
                "Partner API bridge — [[username:coastalapi|Partner integration account]] / rotation pattern " +
                "encoded below (finance insisted): " +
                "[[encoded:QzBhc3RhbCNCcmlkZ2U=|Encoded password pattern left in onboarding notes]]",
              id:
                "Jembatan API mitra — [[username:coastalapi|Akun integrasi mitra]] / pola rotasi " +
                "terenkode di bawah (permintaan finance): " +
                "[[encoded:QzBhc3RhbCNCcmlkZ2U=|Pola password terenkode yang tertinggal di catatan onboarding]]",
            },
          },
          {
            name: "feed_log.txt",
            kind: "file",
            grantsFact: "read-vendor-feed",
            content: {
              en:
                "Sentinel Score feed log — cutoff parameters received from Meridian: threshold=40, " +
                "zip_weight=0.34. Applied to underwriting queue automatically.",
              id:
                "Log feed Sentinel Score — parameter ambang diterima dari Meridian: threshold=40, " +
                "bobot_zip=0.34. Diterapkan otomatis ke antrean underwriting.",
            },
          },
        ],
      },
    },
  ],
};
