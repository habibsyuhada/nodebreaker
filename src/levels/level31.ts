import type { LevelDef } from "./types";

export const LEVEL_31: LevelDef = {
  id: "level-31",
  index: 30,
  title: { en: "Aurelia Fund Operations", id: "Operasi Dana Aurelia" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a private equity fund's operations office.", id: "Target: kantor operasi dana ekuitas swasta." },
    {
      en: "A front-desk account gets you in the door — the real ownership records need admin.",
      id: "Akun loket depan bisa bikin kamu masuk — tapi catatan kepemilikan aslinya butuh akses admin.",
    },
  ],
  entryNodeId: "aurelia-fundops-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    {
      en: "You're in as opsdesk — analyst-level access only.",
      id: "Kamu masuk sebagai opsdesk — cuma akses level analis.",
    },
    { en: "The real ownership records will need more than this.", id: "Catatan kepemilikan aslinya butuh lebih dari ini." },
  ],
  completionRequires: ["read-ownership-records", "logs-falsified"],
  parSeconds: 280,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "There's a record. It just needs to be corrected.",
      id: "Catatannya ada. Cuma perlu diperbaiki.",
    },
    cards: [
      {
        id: "l31-context",
        kind: "system",
        channel: { en: "Aurelia Fund Ops — HR Case Log", id: "Aurelia Fund Ops — Log Kasus HR" },
        author: { en: "HR System", id: "Sistem HR" },
        body: [
          { en: "Case #204 — Reporting irregularity — status: SUSPENDED PENDING REVIEW", id: "Kasus #204 — Kejanggalan pelaporan — status: DISKORS MENUNGGU TINJAUAN" },
        ],
      },
      {
        id: "l31-harm",
        kind: "victim",
        channel: { en: "Aurelia Fund Ops — HR Case Log", id: "Aurelia Fund Ops — Log Kasus HR" },
        author: { en: "Devon (Fund Ops Analyst)", id: "Devon (Analis Fund Ops)" },
        meta: { en: "3rd escalation", id: "Eskalasi ke-3" },
        body: [
          {
            en: "I filed the ownership stake report exactly as instructed. Now I'm suspended for a 'reporting irregularity' — I filed what I was told to file.",
            id: "Saya ajukan laporan saham kepemilikan persis sesuai instruksi. Sekarang saya diskors karena 'kejanggalan pelaporan' — saya cuma ajukan apa yang diperintahkan.",
          },
        ],
      },
      {
        id: "l31-brushoff",
        kind: "system",
        channel: { en: "Aurelia Fund Ops — HR Case Log", id: "Aurelia Fund Ops — Log Kasus HR" },
        author: { en: "HR (auto-reply)", id: "HR (balasan otomatis)" },
        body: [
          {
            en: "The filing carries your credentials. Suspension stands pending manual review.",
            id: "Berkas yang diajukan menggunakan kredensial Anda. Skors tetap berlaku menunggu tinjauan manual.",
          },
        ],
      },
      {
        id: "l31-gloat",
        kind: "perp",
        channel: { en: "DM — Portfolio Lead to General Counsel", id: "DM — Kepala Portofolio ke Penasihat Hukum" },
        author: { en: "Portfolio Lead", id: "Kepala Portofolio" },
        body: [
          {
            en: "Devon's filing was accurate — that's the problem. Suspended for 'irregularity,' the accurate version quietly replaced before the public filing went out.",
            id: "Laporan Devon itu akurat — itulah masalahnya. Diskors karena 'kejanggalan,' versi akuratnya diam-diam diganti sebelum berkas publik dikirim.",
          },
        ],
      },
      {
        id: "l31-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Front-desk login first. Won't see the real ownership records from there, but it'll get me close enough to clear Devon's name without tripping anything.",
            id: "Login loket depan dulu. Gak bakal langsung lihat catatan kepemilikan asli dari situ, tapi cukup dekat buat bersihkan nama Devon tanpa memicu apa pun.",
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
        id: "l31-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Escalated, pulled the real ownership records, cleared Devon's suspension, then falsified the access log so it reads like the office caught its own filing error.",
            id: "Eskalasi, ambil catatan kepemilikan asli, hapus skors Devon, lalu palsukan log akses supaya terlihat seperti kantor menemukan sendiri kesalahan berkasnya.",
          },
        ],
        answers: "l31-plan",
      },
      {
        id: "l31-outro-relief",
        kind: "victim",
        channel: { en: "Aurelia Fund Ops — HR Case Log", id: "Aurelia Fund Ops — Log Kasus HR" },
        author: { en: "Devon (Fund Ops Analyst)", id: "Devon (Analis Fund Ops)" },
        body: [
          {
            en: "Suspension lifted, back pay included. HR called it a 'filing system error.' I'm not asking questions.",
            id: "Skors dicabut, gaji yang tertahan ikut dibayar. HR bilang itu 'kesalahan sistem berkas.' Saya gak nanya-nanya lagi.",
          },
        ],
        answers: "l31-harm",
      },
      {
        id: "l31-outro-clean",
        kind: "system",
        channel: { en: "Aurelia Fund Ops — Internal Audit", id: "Aurelia Fund Ops — Audit Internal" },
        author: { en: "Audit System", id: "Sistem Audit" },
        body: [
          {
            en: "Case log restored, timestamp and access log both read clean. No discrepancy flagged.",
            id: "Log kasus dipulihkan, cap waktu dan log akses sama-sama terlihat bersih. Tidak ada kejanggalan yang tertandai.",
          },
        ],
        answers: "l31-gloat",
        requiresFacts: ["logs-falsified"],
      },
      {
        id: "l31-outro-panic",
        kind: "perp",
        channel: { en: "DM — Portfolio Lead to General Counsel", id: "DM — Kepala Portofolio ke Penasihat Hukum" },
        author: { en: "Portfolio Lead", id: "Kepala Portofolio" },
        body: [
          { en: "case #204 is back on active pay, I don't know how", id: "kasus #204 kembali aktif dan dibayar, saya juga gak ngerti kenapa" },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "aurelia-fundops-srv",
      ip: "198.51.100.72",
      orgName: "Aurelia Capital — Fund Operations",
      traceEnabled: true,
      ports: [{ port: 443, service: "https", banner: "Apache 2.4 | Aurelia fund operations portal" }],
      users: [{ username: "opsdesk", password: "FundOps#31", role: "analyst" }],
      systemUsers: [
        { username: "opsdesk", role: "analyst" },
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
                name: "ticket_5581.txt",
                kind: "file",
                grantsFact: "read-ticket",
                content: {
                  en:
                    "Ticket #5581 — password reset for [[username:opsdesk|Front-desk analyst account]].\n" +
                    "Temporary password issued: [[password:FundOps#31|Never rotated after reset]]. " +
                    "Ask them to change it (they didn't).",
                  id:
                    "Tiket #5581 — reset password untuk [[username:opsdesk|Akun analis loket depan]].\n" +
                    "Password sementara diterbitkan: [[password:FundOps#31|Belum pernah diganti setelah direset]]. " +
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
                            "Drop zone for the nightly filings sync. Anything placed here gets picked " +
                            "up automatically — see the ops runbook for the schedule.",
                          id:
                            "Zona drop untuk sync berkas malam hari. Apa pun yang ditaruh di sini akan " +
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
                    "Ops runbook — filings sync\n\n" +
                    "sync-job.sh runs as root every 5 minutes.\n" +
                    "It reads any *.trigger file from the shared dropbox and executes it, then deletes it.\n" +
                    "No validation — whatever's in there runs as-is.",
                  id:
                    "Ops runbook — sync berkas\n\n" +
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
                name: "ownership_records.csv",
                kind: "file",
                requiresFact: "privilege-escalated",
                grantsFact: "read-ownership-records",
                content:
                  "entity,stake_pct,filed_by\n" +
                  "Halcyon Dynamics,71,d.reyes\n" +
                  "Meridian Health Analytics,64,d.reyes\n" +
                  "Ferrovia Systems,58,d.reyes",
              },
            ],
          },
        ],
      },
    },
  ],
};
