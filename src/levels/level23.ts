import type { LevelDef } from "./types";

export const LEVEL_23: LevelDef = {
  id: "level-23",
  index: 22,
  title: { en: "Greenway Traffic Signal Depot", id: "Depot Sinyal Lalu Lintas Greenway" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a traffic signal maintenance depot.", id: "Target: depot perawatan sinyal lalu lintas." },
    {
      en: "A front-desk account gets you in the door — the real signal timing needs admin.",
      id: "Akun loket depan bisa bikin kamu masuk — tapi pengaturan waktu sinyal aslinya butuh akses admin.",
    },
  ],
  entryNodeId: "greenway-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    {
      en: "You're in as depotdesk — technician-level access only.",
      id: "Kamu masuk sebagai depotdesk — cuma akses level teknisi.",
    },
    { en: "The real signal timing will need more than this.", id: "Pengaturan sinyal aslinya butuh lebih dari ini." },
  ],
  completionRequires: ["read-signal-timing", "logs-falsified"],
  parSeconds: 280,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "There's a file. It just needs to be corrected.",
      id: "Berkasnya ada. Cuma perlu diperbaiki.",
    },
    cards: [
      {
        id: "l23-context",
        kind: "system",
        channel: { en: "Greenway Depot — Maintenance Log", id: "Depot Greenway — Log Perawatan" },
        author: { en: "Depot System", id: "Sistem Depot" },
        body: [
          { en: "Case #118 — Signal malfunction, 5th & Main — status: TECHNICIAN WRITE-UP FILED", id: "Kasus #118 — Malfungsi sinyal, 5th & Main — status: SURAT PERINGATAN TEKNISI DIAJUKAN" },
        ],
      },
      {
        id: "l23-harm",
        kind: "victim",
        channel: { en: "Greenway Depot — Maintenance Log", id: "Depot Greenway — Log Perawatan" },
        author: { en: "Omar (Signal Technician)", id: "Omar (Teknisi Sinyal)" },
        meta: { en: "3rd shift flagged", id: "Shift ke-3 ditandai" },
        body: [
          {
            en: "I reported the red light at 5th & Main running 40 seconds longer than spec. Now I'm written up for 'unauthorized timing changes' — I never touched the timing, I just reported it.",
            id: "Saya laporkan lampu merah di 5th & Main jalan 40 detik lebih lama dari spesifikasi. Sekarang saya kena surat peringatan atas 'perubahan waktu tanpa izin' — saya gak pernah utak-atik waktunya, saya cuma laporkan.",
          },
        ],
      },
      {
        id: "l23-brushoff",
        kind: "system",
        channel: { en: "Greenway Depot — Maintenance Log", id: "Depot Greenway — Log Perawatan" },
        author: { en: "HR (auto-reply)", id: "HR (balasan otomatis)" },
        body: [
          {
            en: "The timing log shows your credentials on the last change. The write-up stands pending review.",
            id: "Log waktu nunjukin kredensial kamu di perubahan terakhir. Surat peringatan tetap berlaku menunggu tinjauan.",
          },
        ],
      },
      {
        id: "l23-gloat",
        kind: "perp",
        channel: { en: "DM — Civic OS Contracts Lead to a toll-road partner", id: "DM — Kepala Kontrak Civic OS ke mitra jalan tol" },
        author: { en: "Civic OS Contracts Lead", id: "Kepala Kontrak Civic OS" },
        body: [
          {
            en: "Extra 40 seconds on 5th & Main pushes another 12% of through-traffic onto your toll route. Blamed it on a technician timing error — paperwork's clean.",
            id: "Tambahan 40 detik di 5th & Main dorong 12% lebih banyak lalu lintas ke rute tol kalian. Salahkan itu ke kesalahan waktu teknisi — berkasnya bersih.",
          },
        ],
      },
      {
        id: "l23-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Front-desk login first. Won't see the real timing config from there, but it'll get me close enough to clear Omar's name without tripping anything.",
            id: "Login loket depan dulu. Gak bakal langsung lihat config waktu asli dari situ, tapi cukup dekat buat bersihkan nama Omar tanpa memicu apa pun.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The timing log looks like it was never touched.", id: "Log waktu terlihat seperti tak pernah disentuh." },
    cards: [
      {
        id: "l23-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Escalated, pulled the real timing config, cleared Omar's write-up, then falsified the access log so it reads like the depot caught its own contractor's change.",
            id: "Eskalasi, ambil config waktu asli, hapus surat peringatan Omar, lalu palsukan log akses supaya terlihat seperti depot menemukan sendiri perubahan kontraktornya.",
          },
        ],
        answers: "l23-plan",
      },
      {
        id: "l23-outro-relief",
        kind: "victim",
        channel: { en: "Greenway Depot — Maintenance Log", id: "Depot Greenway — Log Perawatan" },
        author: { en: "Omar (Signal Technician)", id: "Omar (Teknisi Sinyal)" },
        body: [
          {
            en: "Write-up cleared, timing back to spec. Supervisor called it a 'contractor configuration error.' I'm not asking questions.",
            id: "Surat peringatan dihapus, waktu kembali sesuai spesifikasi. Supervisor bilang itu 'kesalahan konfigurasi kontraktor.' Saya gak nanya-nanya lagi.",
          },
        ],
        answers: "l23-harm",
      },
      {
        id: "l23-outro-clean",
        kind: "system",
        channel: { en: "Greenway Depot — Internal Audit", id: "Depot Greenway — Audit Internal" },
        author: { en: "Audit System", id: "Sistem Audit" },
        body: [
          {
            en: "Timing log restored, timestamp and access log both read clean. No discrepancy flagged.",
            id: "Log waktu dipulihkan, cap waktu dan log akses sama-sama terlihat bersih. Tidak ada kejanggalan yang tertandai.",
          },
        ],
        answers: "l23-gloat",
        requiresFacts: ["logs-falsified"],
      },
      {
        id: "l23-outro-panic",
        kind: "perp",
        channel: { en: "DM — Civic OS Contracts Lead to a toll-road partner", id: "DM — Kepala Kontrak Civic OS ke mitra jalan tol" },
        author: { en: "Civic OS Contracts Lead", id: "Kepala Kontrak Civic OS" },
        body: [
          { en: "5th & Main is back to spec, I don't know how", id: "5th & Main balik sesuai spesifikasi, saya juga gak ngerti kenapa" },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "greenway-srv",
      ip: "198.51.100.60",
      orgName: "Greenway Traffic Signal Depot",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "Apache 2.4 | Greenway depot portal" }],
      users: [{ username: "depotdesk", password: "SignalOps#8", role: "technician" }],
      systemUsers: [
        { username: "depotdesk", role: "technician" },
        { username: "admin", role: "administrator" },
      ],
      privilegeEscalations: [
        {
          id: "drop-payload",
          label: { en: "Drop Payload", id: "Taruh Payload" },
          requiredFacts: ["found-cron-job", "found-dropbox"],
          grantsFact: "privilege-escalated",
          narrationText: [
            { en: "$ drop payload.trigger --target /srv/shared/dropbox", id: "$ drop payload.trigger --target /srv/shared/dropbox" },
            { en: "Waiting for the next sync cycle...", id: "Menunggu siklus sync berikutnya..." },
            { en: "sync-job.sh executed your payload as root.", id: "sync-job.sh menjalankan payload kamu sebagai root." },
            {
              en: "Privilege escalation successful — admin-level access granted.",
              id: "Eskalasi privilese berhasil — akses level admin diberikan.",
            },
          ],
          requiredFactHints: {
            "found-cron-job": {
              en: "You don't know what runs as root yet — check the ops runbook.",
              id: "Kamu belum tahu apa yang jalan sebagai root — cek ops runbook.",
            },
            "found-dropbox": {
              en: "You don't know where to drop the payload yet — check /srv/shared/dropbox.",
              id: "Kamu belum tahu ke mana taruh payload-nya — cek /srv/shared/dropbox.",
            },
          },
        },
      ],
      logFalsification: {
        requiredFacts: ["found-log-template"],
        tracePenaltyReduction: 15,
        label: { en: "Falsify Logs", id: "Palsukan Log" },
      },
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "helpdesk_tickets",
            kind: "dir",
            children: [
              {
                name: "ticket_3390.txt",
                kind: "file",
                grantsFact: "read-ticket",
                content: {
                  en:
                    "Ticket #3390 — password reset for [[username:depotdesk|Front-desk technician account]].\n" +
                    "Temporary password issued: [[password:SignalOps#8|Never rotated after reset]]. " +
                    "Ask them to change it (they didn't).",
                  id:
                    "Tiket #3390 — reset password untuk [[username:depotdesk|Akun teknisi loket depan]].\n" +
                    "Password sementara diterbitkan: [[password:SignalOps#8|Belum pernah diganti setelah direset]]. " +
                    "Diminta untuk menggantinya (gak diganti).",
                },
              },
            ],
          },
          {
            name: "var",
            kind: "dir",
            children: [
              {
                name: "log",
                kind: "dir",
                children: [
                  {
                    name: "README.txt",
                    kind: "file",
                    grantsFact: "found-log-template",
                    content: {
                      en:
                        "Reference format for routine access entries:\n" +
                        "<timestamp> <user> login OK from <internal-ip>\n\n" +
                        "Audit reviews flag anything that doesn't match this pattern — " +
                        "including gaps left by deleted entries.",
                      id:
                        "Format referensi untuk entri akses rutin:\n" +
                        "<timestamp> <user> login OK from <internal-ip>\n\n" +
                        "Audit akan menandai apa pun yang tidak cocok dengan pola ini — " +
                        "termasuk celah yang ditinggalkan oleh entri yang dihapus.",
                    },
                  },
                ],
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
                        grantsFact: "found-dropbox",
                        content: {
                          en:
                            "Drop zone for the nightly signal-config sync. Anything placed here gets picked " +
                            "up automatically — see the ops runbook for the schedule.",
                          id:
                            "Zona drop untuk sync config sinyal malam hari. Apa pun yang ditaruh di sini akan " +
                            "otomatis diambil — lihat ops runbook untuk jadwalnya.",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "ops",
            kind: "dir",
            children: [
              {
                name: "runbook.txt",
                kind: "file",
                grantsFact: "found-cron-job",
                content: {
                  en:
                    "Ops runbook — signal config sync\n\n" +
                    "sync-job.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation — whatever's in there runs as-is.",
                  id:
                    "Ops runbook — sync config sinyal\n\n" +
                    "sync-job.sh berjalan sebagai root setiap 5 menit.\n" +
                    "Skrip ini membaca file *.trigger apa pun dari shared dropbox lalu menjalankannya, kemudian menghapusnya.\n" +
                    "Tidak ada validasi — apa pun isinya langsung dijalankan.",
                },
              },
            ],
          },
          {
            name: "signals",
            kind: "dir",
            children: [
              {
                name: "timing_config.csv",
                kind: "file",
                requiresFact: "privilege-escalated",
                grantsFact: "read-signal-timing",
                content:
                  "intersection,red_seconds,spec_seconds,changed_by\n" +
                  "5th & Main,78,38,contractor-civicos\n" +
                  "6th & Oak,40,40,none\n" +
                  "7th & Pine,42,40,none",
              },
            ],
          },
        ],
      },
    },
  ],
};
