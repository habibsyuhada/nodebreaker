import type { LevelDef } from "./types";

export const LEVEL_15: LevelDef = {
  id: "level-15",
  index: 14,
  title: { en: "Union Home Care Services", id: "Union Home Care Services" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a home care agency's scheduling office.", id: "Target: kantor penjadwalan agensi perawatan rumah." },
    {
      en: "A front-desk account gets you in the door — the real records need admin.",
      id: "Akun loket depan bisa bikin kamu masuk — tapi arsip aslinya butuh akses admin.",
    },
  ],
  entryNodeId: "unionhomecare-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    {
      en: "You're in as frontdesk — scheduler-level access only.",
      id: "Kamu masuk sebagai frontdesk — cuma akses level penjadwal.",
    },
    { en: "The real records will need more than this.", id: "Arsip aslinya butuh lebih dari ini." },
  ],
  completionRequires: ["read-caregiver-records", "logs-falsified"],
  parSeconds: 280,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "There's a file. It just needs to be corrected.",
      id: "Berkasnya ada. Cuma perlu diperbaiki.",
    },
    cards: [
      {
        id: "l15-context",
        kind: "system",
        channel: { en: "Union Home Care — HR Case Log", id: "Union Home Care — Log Kasus HR" },
        author: { en: "HR System", id: "Sistem HR" },
        body: [
          {
            en: "Case #331 — Suspected timesheet fraud — status: SUSPENDED PENDING REVIEW",
            id: "Kasus #331 — Dugaan kecurangan timesheet — status: DISKORS MENUNGGU TINJAUAN",
          },
        ],
      },
      {
        id: "l15-harm",
        kind: "victim",
        channel: { en: "Union Home Care — HR Case Log", id: "Union Home Care — Log Kasus HR" },
        author: { en: "Ratih (Caregiver)", id: "Ratih (Perawat Rumah)" },
        meta: { en: "3rd shift flagged", id: "Shift ke-3 ditandai" },
        body: [
          {
            en: "The scheduling app says I wasn't at my client's house during my shift. I was there the whole time — the app's GPS has glitched before. Now I'm suspended without pay.",
            id: "Aplikasi jadwal bilang saya gak ada di rumah klien selama shift. Saya ada di sana sepanjang waktu — GPS aplikasinya memang pernah bermasalah sebelumnya. Sekarang saya diskors tanpa gaji.",
          },
        ],
      },
      {
        id: "l15-brushoff",
        kind: "system",
        channel: { en: "Union Home Care — HR Case Log", id: "Union Home Care — Log Kasus HR" },
        author: { en: "HR (auto-reply)", id: "HR (balasan otomatis)" },
        body: [
          {
            en: "The location-verification score flagged this shift automatically. Suspension stands pending manual review.",
            id: "Skor verifikasi lokasi menandai shift ini secara otomatis. Skors tetap berlaku menunggu tinjauan manual.",
          },
        ],
      },
      {
        id: "l15-gloat",
        kind: "perp",
        channel: { en: "DM — Ops Director to a scheduling vendor rep", id: "DM — Direktur Ops ke rep vendor penjadwalan" },
        author: { en: "Ops Director", id: "Direktur Ops" },
        body: [
          {
            en: "Your new location score flags 1 in 20 shifts as 'suspicious' on GPS drift alone. Fine by us — every flagged shift is one we don't have to pay out on this cycle.",
            id: "Skor lokasi baru kalian nandai 1 dari 20 shift sebagai 'mencurigakan' cuma karena GPS meleset. Buat kami gak masalah — tiap shift yang ditandai berarti satu gaji yang gak perlu kami bayar siklus ini.",
          },
        ],
      },
      {
        id: "l15-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Front-desk login first. Won't see the case file from there, but it'll get me close enough to clear the flag without tripping anything.",
            id: "Login loket depan dulu. Gak bakal langsung lihat berkas kasus dari situ, tapi cukup dekat buat hapus tanda itu tanpa memicu apa pun.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The case log looks like it was never touched.", id: "Log kasus terlihat seperti tak pernah disentuh." },
    cards: [
      {
        id: "l15-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Escalated, cleared the fraud flag on Ratih's case, then falsified the access log so it reads like the office caught its own GPS glitch.",
            id: "Eskalasi, hapus tanda kecurangan di kasus Ratih, lalu palsukan log akses supaya terlihat seperti kantor menemukan sendiri glitch GPS-nya.",
          },
        ],
        answers: "l15-plan",
      },
      {
        id: "l15-outro-relief",
        kind: "victim",
        channel: { en: "Union Home Care — HR Case Log", id: "Union Home Care — Log Kasus HR" },
        author: { en: "Ratih (Caregiver)", id: "Ratih (Perawat Rumah)" },
        body: [
          {
            en: "Suspension lifted, back pay included. HR called it a GPS calibration issue. I'm not asking questions.",
            id: "Skors dicabut, gaji yang tertahan ikut dibayar. HR bilang itu masalah kalibrasi GPS. Saya gak nanya-nanya lagi.",
          },
        ],
        answers: "l15-harm",
      },
      {
        id: "l15-outro-clean",
        kind: "system",
        channel: { en: "Union Home Care — Internal Audit", id: "Union Home Care — Audit Internal" },
        author: { en: "Audit System", id: "Sistem Audit" },
        body: [
          {
            en: "Case log restored, timestamp and access log both read clean. No discrepancy flagged.",
            id: "Log kasus dipulihkan, cap waktu dan log akses sama-sama terlihat bersih. Tidak ada kejanggalan yang tertandai.",
          },
        ],
        answers: "l15-gloat",
        requiresFacts: ["logs-falsified"],
      },
      {
        id: "l15-outro-panic",
        kind: "perp",
        channel: { en: "DM — Ops Director to a scheduling vendor rep", id: "DM — Direktur Ops ke rep vendor penjadwalan" },
        author: { en: "Ops Director", id: "Direktur Ops" },
        body: [
          {
            en: "case #331 is back on active pay, I don't know how",
            id: "kasus #331 kembali aktif dan dibayar, saya juga gak ngerti kenapa",
          },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "unionhomecare-srv",
      ip: "198.51.100.85",
      orgName: "Union Home Care Services",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "Apache 2.4 | Union Home Care scheduling portal" }],
      users: [{ username: "frontdesk", password: "HomeCare#19", role: "scheduler" }],
      systemUsers: [
        { username: "frontdesk", role: "scheduler" },
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
                name: "ticket_2210.txt",
                kind: "file",
                grantsFact: "read-ticket",
                content: {
                  en:
                    "Ticket #2210 — password reset for [[username:frontdesk|Front-desk scheduler account]].\n" +
                    "Temporary password issued: [[password:HomeCare#19|Never rotated after reset]]. " +
                    "Ask them to change it (they didn't).",
                  id:
                    "Tiket #2210 — reset password untuk [[username:frontdesk|Akun penjadwal loket depan]].\n" +
                    "Password sementara diterbitkan: [[password:HomeCare#19|Belum pernah diganti setelah direset]]. " +
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
                            "Drop zone for the nightly scheduling sync. Anything placed here gets picked " +
                            "up automatically — see the ops runbook for the schedule.",
                          id:
                            "Zona drop untuk sync penjadwalan malam hari. Apa pun yang ditaruh di sini akan " +
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
                    "Ops runbook — scheduling sync\n\n" +
                    "sync-job.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation — whatever's in there runs as-is.",
                  id:
                    "Ops runbook — sync penjadwalan\n\n" +
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
                name: "caregiver_records.csv",
                kind: "file",
                requiresFact: "privilege-escalated",
                grantsFact: "read-caregiver-records",
                content:
                  "id,name,status,flag_reason\n" +
                  "0041,Ratih,suspended,gps-drift-score\n" +
                  "0042,B. Colon,active,none\n" +
                  "0043,M. Ferreira,active,none",
              },
            ],
          },
        ],
      },
    },
  ],
};
