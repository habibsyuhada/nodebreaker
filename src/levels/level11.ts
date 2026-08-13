import type { LevelDef } from "./types";

export const LEVEL_11: LevelDef = {
  id: "level-11",
  index: 10,
  title: { en: "Palisade Manufacturing", id: "Palisade Manufacturing" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a factory's timekeeping server.", id: "Target: server pencatatan waktu kerja pabrik." },
    {
      en: "This one has monitoring. TRACE will climb the longer you linger — and not every",
      id: "Yang ini dipantau. TRACE akan naik semakin lama kamu berada di sini — dan gak semua",
    },
    {
      en: "account you find in here is what it looks like. Verify before you log in.",
      id: "akun yang kamu temukan di sini sesuai kelihatannya. Verifikasi dulu sebelum login.",
    },
  ],
  entryNodeId: "palisade-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — timekeeping server unlocked.", id: "Kamu masuk — server pencatatan waktu terbuka." },
  ],
  completionRequires: ["logs-deleted"],
  parSeconds: 200,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Time to put the hours back.", id: "Saatnya kembalikan jam kerjanya." },
    cards: [
      {
        id: "l11-context",
        kind: "system",
        channel: { en: "#floor-ops", id: "#floor-ops" },
        author: { en: "Timekeeping Bot", id: "Bot Pencatatan Waktu" },
        body: [
          { en: "Payroll export batch — completed, 214 records.", id: "Batch ekspor payroll — selesai, 214 catatan." },
        ],
      },
      {
        id: "l11-harm",
        kind: "victim",
        channel: { en: "#floor-ops", id: "#floor-ops" },
        author: { en: "Farah (Line 2)", id: "Farah (Jalur 2)" },
        meta: { en: "Payday", id: "Hari gajian" },
        body: [
          {
            en: "My check is short six hours of overtime again. The clock-in app shows I worked them. Payroll says 'system record shows otherwise.'",
            id: "Gaji saya kurang enam jam lembur lagi. Aplikasi absen nunjukin saya kerja jam itu. Payroll bilang 'catatan sistem bilang lain.'",
          },
        ],
      },
      {
        id: "l11-gloat",
        kind: "perp",
        channel: { en: "DM — Floor Manager to Payroll Lead", id: "DM — Manajer Lantai ke Kepala Payroll" },
        author: { en: "Floor Manager", id: "Manajer Lantai" },
        body: [
          {
            en: "Trim two hours off everyone's overtime before the export runs. Nobody double-checks the raw clock data against the export.",
            id: "Potong dua jam lembur semua orang sebelum ekspor jalan. Gak ada yang cek ulang data absen mentah sama hasil ekspornya.",
          },
        ],
      },
      {
        id: "l11-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need the raw clock data before it's overwritten. There's more than one account floating around in here — worth checking which one's actually real.",
            id: "Perlu data absen mentah sebelum ditimpa. Ada lebih dari satu akun berkeliaran di sini — ada baiknya cek dulu mana yang benar-benar asli.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The trim job stopped running.", id: "Job pemotongan itu berhenti jalan." },
    cards: [
      {
        id: "l11-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored the raw clock data to the export and wiped my own session out of the access log on the way out.",
            id: "Pulihkan data absen mentah ke hasil ekspor dan hapus jejak sesi saya sendiri dari log akses saat keluar.",
          },
        ],
        answers: "l11-plan",
      },
      {
        id: "l11-outro-relief",
        kind: "victim",
        channel: { en: "#floor-ops", id: "#floor-ops" },
        author: { en: "Farah (Line 2)", id: "Farah (Jalur 2)" },
        meta: { en: "Next payday", id: "Gajian berikutnya" },
        body: [
          {
            en: "Six hours showed up on this check, no explanation given. First time the numbers actually matched the clock.",
            id: "Enam jam itu muncul di gaji kali ini, gak ada penjelasan. Pertama kalinya angkanya cocok sama absen.",
          },
        ],
        answers: "l11-harm",
      },
      {
        id: "l11-outro-panic",
        kind: "perp",
        channel: { en: "DM — Floor Manager to Payroll Lead", id: "DM — Manajer Lantai ke Kepala Payroll" },
        author: { en: "Floor Manager", id: "Manajer Lantai" },
        body: [{ en: "the trim job isn't applying anymore, who touched it", id: "job pemotongannya gak jalan lagi, siapa yang utak-atik" }],
      },
    ],
  },
  nodes: [
    {
      id: "palisade-srv",
      ip: "198.51.100.30",
      orgName: "Palisade Manufacturing — Timekeeping Server",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.2 | palisade-timekeeping-srv" }],
      users: [
        { username: "hrpayroll", password: "Payr0ll#Edit", role: "HR payroll" },
        {
          username: "auditwatch",
          password: "W3Watch4U!",
          role: "compliance",
          decoy: true,
          decoyTracePenalty: 25,
          decoyWarningText: [
            {
              en: "[alert] auditwatch is a monitored compliance account — this session has been logged and flagged.",
              id: "[alert] auditwatch adalah akun kepatuhan yang dipantau — sesi ini sudah tercatat dan ditandai.",
            },
          ],
        },
      ],
      systemUsers: [
        { username: "hrpayroll", role: "HR payroll" },
        { username: "auditwatch", role: "compliance" },
        { username: "root", role: "admin" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "shift_export.txt",
            kind: "file",
            grantsFact: "found-hr-creds",
            content: {
              en:
                "IT handoff — payroll edit access.\n\n" +
                "If the export batch needs a manual fix, use the payroll account: " +
                "[[username:hrpayroll|HR payroll account]] / " +
                "[[password:Payr0ll#Edit|Shared by IT after the last reset]]",
              id:
                "Serah terima IT — akses edit payroll.\n\n" +
                "Kalau batch ekspor perlu perbaikan manual, pakai akun payroll: " +
                "[[username:hrpayroll|Akun HR payroll]] / " +
                "[[password:Payr0ll#Edit|Dibagikan IT setelah reset terakhir]]",
            },
          },
          {
            name: "compliance",
            kind: "dir",
            metadata: [
              {
                label: { en: "access", id: "akses" },
                value: {
                  en: "restricted — flagged for review team monitoring",
                  id: "dibatasi — ditandai untuk pemantauan tim peninjau",
                },
              },
            ],
            children: [
              {
                name: "escalation_account.txt",
                kind: "file",
                grantsFact: "found-audit-creds",
                content: {
                  en:
                    "Escalation account — use only if the payroll login fails: " +
                    "[[username:auditwatch|Escalation account]] / " +
                    "[[password:W3Watch4U!|Shared compliance credential]]",
                  id:
                    "Akun eskalasi — pakai hanya kalau login payroll gagal: " +
                    "[[username:auditwatch|Akun eskalasi]] / " +
                    "[[password:W3Watch4U!|Kredensial kepatuhan bersama]]",
                },
              },
            ],
          },
          {
            name: "timesheets",
            kind: "dir",
            children: [
              {
                name: "farah_raw.csv",
                kind: "file",
                grantsFact: "read-raw-timesheet",
                content:
                  "date,clock_in,clock_out,overtime_hrs\n" +
                  "2024-05-06,07:58,18:04,2.0\n" +
                  "2024-05-07,07:55,19:10,3.0\n" +
                  "2024-05-08,08:00,18:55,1.0",
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
                    name: "access.log",
                    kind: "file",
                    content: {
                      en: "2024-05-08 07:50  hrpayroll login OK from 10.0.2.11 (internal)\n2024-05-08 21:40  floor-manager ran: trim_overtime.py --target line2",
                      id: "2024-05-08 07:50  hrpayroll login OK from 10.0.2.11 (internal)\n2024-05-08 21:40  floor-manager ran: trim_overtime.py --target line2",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};
