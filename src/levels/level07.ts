import type { LevelDef } from "./types";

export const LEVEL_07: LevelDef = {
  id: "level-07",
  index: 6,
  title: { en: "Cityview Records Office", id: "Kantor Arsip Cityview" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: city records office.", id: "Target: kantor arsip kota." },
    {
      en: "A front-desk account gets you in the door — the real records need admin.",
      id: "Akun loket depan bisa bikin kamu masuk — tapi arsip aslinya butuh akses admin.",
    },
  ],
  entryNodeId: "cityview-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    {
      en: "You're in as tholloway — clerk-level access only.",
      id: "Kamu masuk sebagai tholloway — cuma akses level petugas.",
    },
    { en: "The real records will need more than this.", id: "Arsip aslinya butuh lebih dari ini." },
  ],
  completionRequires: ["read-citizen-records", "logs-falsified"],
  parSeconds: 280,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "There's a file. It just needs to be findable again.",
      id: "Berkasnya ada. Cuma perlu dibuat bisa ditemukan lagi.",
    },
    cards: [
      {
        id: "l7-context",
        kind: "system",
        channel: { en: "Cityview Records — Public Counter Log", id: "Cityview Records — Log Loket Publik" },
        author: { en: "Front Desk System", id: "Sistem Loket" },
        body: [
          {
            en: "Request #7724 — Deed lookup, Ward 3 — status: NOT FOUND",
            id: "Permohonan #7724 — Pencarian akta, Wilayah 3 — status: TIDAK DITEMUKAN",
          },
        ],
      },
      {
        id: "l7-harm",
        kind: "victim",
        channel: { en: "Cityview Records — Public Counter Log", id: "Cityview Records — Log Loket Publik" },
        author: { en: "The Santoso Family", id: "Keluarga Santoso" },
        meta: { en: "3rd visit", id: "Kunjungan ke-3" },
        body: [
          {
            en: "Our family's land deed has been on file since 1987. Now the counter says it doesn't exist. We have the original registration number.",
            id: "Akta tanah keluarga kami sudah tercatat sejak 1987. Sekarang loket bilang gak ada. Kami punya nomor registrasi aslinya.",
          },
        ],
      },
      {
        id: "l7-brushoff",
        kind: "system",
        channel: { en: "Cityview Records — Public Counter Log", id: "Cityview Records — Log Loket Publik" },
        author: { en: "Records Clerk (front desk)", id: "Petugas Arsip (loket depan)" },
        body: [
          {
            en: "The file was never there. Show me the file that says it was. Next in line, please.",
            id: "Berkasnya memang gak pernah ada. Coba tunjukkan berkas yang bilang itu ada. Silakan yang berikutnya.",
          },
        ],
      },
      {
        id: "l7-gloat",
        kind: "perp",
        channel: { en: "DM — Records Director to a developer contact", id: "DM — Direktur Arsip ke kontak pengembang" },
        author: { en: "Records Director", id: "Direktur Arsip" },
        body: [
          {
            en: "The file was never there. Show me the file that says it was.",
            id: "Berkasnya memang gak pernah ada. Coba tunjukkan berkas yang bilang itu ada.",
          },
          {
            en: "Ward 3 parcel's clear for your permit whenever you're ready.",
            id: "Bidang di Wilayah 3 sudah bersih, izin bisa jalan kapan saja.",
          },
        ],
      },
      {
        id: "l7-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Clerk-level login first. Won't see the deed from there, but it'll get me close enough to fix the register without tripping anything.",
            id: "Login level petugas dulu. Gak bakal langsung lihat akta dari situ, tapi cukup dekat buat perbaiki register tanpa memicu apa pun.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The register looks like it was never touched.", id: "Register terlihat seperti tak pernah disentuh." },
    cards: [
      {
        id: "l7-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Escalated, restored the deed's original entry, then falsified the access log so it reads like the office found its own mistake.",
            id: "Eskalasi, pulihkan entri asli akta, lalu palsukan log akses supaya terlihat seperti kantor menemukan kesalahannya sendiri.",
          },
        ],
        answers: "l7-plan",
      },
      {
        id: "l7-outro-relief",
        kind: "victim",
        channel: { en: "Cityview Records — Public Counter Log", id: "Cityview Records — Log Loket Publik" },
        author: { en: "The Santoso Family", id: "Keluarga Santoso" },
        body: [
          {
            en: "Deed's back in the register, original date and all. The clerk called it a filing error. We're not asking questions.",
            id: "Akta sudah kembali di register, lengkap dengan tanggal aslinya. Petugas bilang itu cuma kesalahan pengarsipan. Kami gak nanya-nanya lagi.",
          },
        ],
        answers: "l7-harm",
      },
      {
        id: "l7-outro-clean",
        kind: "system",
        channel: { en: "Cityview Records — Internal Audit", id: "Cityview Records — Audit Internal" },
        author: { en: "Audit System", id: "Sistem Audit" },
        body: [
          {
            en: "Register entry restored, timestamp and access log both read clean. No discrepancy flagged.",
            id: "Entri register dipulihkan, cap waktu dan log akses sama-sama terlihat bersih. Tidak ada kejanggalan yang tertandai.",
          },
        ],
        answers: "l7-gloat",
        requiresFacts: ["logs-falsified"],
      },
      {
        id: "l7-outro-panic",
        kind: "perp",
        channel: { en: "DM — Records Director to a developer contact", id: "DM — Direktur Arsip ke kontak pengembang" },
        author: { en: "Records Director", id: "Direktur Arsip" },
        body: [
          {
            en: "the parcel's back on file, I don't know how",
            id: "bidangnya muncul lagi di berkas, saya juga gak ngerti kenapa",
          },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "cityview-srv",
      ip: "198.51.100.77",
      orgName: "Cityview Municipal Records",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "Apache 2.4 | Cityview records portal" }],
      users: [{ username: "tholloway", password: "CityHall#22", role: "clerk" }],
      systemUsers: [
        { username: "tholloway", role: "clerk" },
        { username: "admin", role: "administrator" },
      ],
      privilegeEscalations: [
        {
          id: "drop-payload",
          label: { en: "Drop Payload", id: "Taruh Payload" },
          requiredFacts: ["found-cron-job", "found-dropbox"],
          grantsFact: "privilege-escalated",
          narrationText: [
            {
              en: "$ drop payload.trigger --target /srv/shared/dropbox",
              id: "$ drop payload.trigger --target /srv/shared/dropbox",
            },
            { en: "Waiting for the next sync cycle...", id: "Menunggu siklus sync berikutnya..." },
            {
              en: "sync-job.sh executed your payload as root.",
              id: "sync-job.sh menjalankan payload kamu sebagai root.",
            },
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
                name: "ticket_4482.txt",
                kind: "file",
                grantsFact: "read-ticket",
                content: {
                  en:
                    "Ticket #4482 — password reset for [[username:tholloway|Front-desk clerk account]].\n" +
                    "Temporary password issued: [[password:CityHall#22|Never rotated after reset]]. " +
                    "Ask them to change it (they didn't).",
                  id:
                    "Tiket #4482 — reset password untuk [[username:tholloway|Akun petugas loket depan]].\n" +
                    "Password sementara diterbitkan: [[password:CityHall#22|Belum pernah diganti setelah direset]]. " +
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
                            "Drop zone for the nightly records sync. Anything placed here gets picked " +
                            "up automatically — see the ops runbook for the schedule.",
                          id:
                            "Zona drop untuk sync arsip malam hari. Apa pun yang ditaruh di sini akan " +
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
                    "Ops runbook — records sync\n\n" +
                    "sync-job.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation — whatever's in there runs as-is.",
                  id:
                    "Ops runbook — sync arsip\n\n" +
                    "sync-job.sh berjalan sebagai root setiap 5 menit.\n" +
                    "Skrip ini membaca file *.trigger apa pun dari shared dropbox lalu menjalankannya, kemudian menghapusnya.\n" +
                    "Tidak ada validasi — apa pun isinya langsung dijalankan.",
                },
              },
            ],
          },
          {
            name: "records",
            kind: "dir",
            children: [
              {
                name: "citizen_records.csv",
                kind: "file",
                requiresFact: "privilege-escalated",
                grantsFact: "read-citizen-records",
                content:
                  "id,name,ward,status\n" +
                  "0091,J. Alvarez,Ward 3,active\n" +
                  "0092,R. Chen,Ward 1,active\n" +
                  "0093,M. Osei,Ward 4,pending",
              },
            ],
          },
        ],
      },
    },
  ],
};
