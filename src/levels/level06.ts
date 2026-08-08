import type { LevelDef } from "./types";

export const LEVEL_06: LevelDef = {
  id: "level-06",
  index: 5,
  title: "Fleetline Logistics",
  briefing: [
    "Connection established.",
    "Target: a regional shipping company's ops server.",
    "Something here looks too easy to grab. Look before you touch anything.",
  ],
  entryNodeId: "fleetline-srv",
  successText: ["ACCESS GRANTED.", "You're in — logistics ops console unlocked.", "LEVEL 6 COMPLETE."],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "That folder was never about a trap. Now it's evidence.",
      id: "Folder itu awalnya bukan soal jebakan. Sekarang jadi bukti.",
    },
    cards: [
      {
        id: "l6-context",
        kind: "system",
        channel: { en: "#dispatch", id: "#dispatch" },
        author: { en: "Fleet Bot", id: "Bot Armada" },
        body: [
          {
            en: "Route 12 — shift closed. Timesheet auto-synced.",
            id: "Rute 12 — shift selesai. Timesheet tersinkron otomatis.",
          },
        ],
      },
      {
        id: "l6-harm",
        kind: "victim",
        channel: { en: "#dispatch", id: "#dispatch" },
        author: { en: "Bayu (Driver, Route 12)", id: "Bayu (Sopir, Rute 12)" },
        meta: { en: "Termination notice", id: "Surat pemutusan kerja" },
        body: [
          {
            en: "I stopped for 9 minutes because the loading dock was blocked, it's on the dashcam. My timesheet says something else now and HR won't look at the video.",
            id: "Saya berhenti 9 menit karena dermaga muat lagi diblokir, ada di rekaman dashcam. Timesheet saya sekarang beda dan HR gak mau lihat videonya.",
          },
        ],
      },
      {
        id: "l6-brushoff",
        kind: "system",
        channel: { en: "#dispatch", id: "#dispatch" },
        author: { en: "HR (auto-reply)", id: "HR (balasan otomatis)" },
        body: [
          {
            en: "The timesheet is the system of record. Dashcam footage is not part of the review process.",
            id: "Timesheet adalah catatan resmi sistem. Rekaman dashcam bukan bagian dari proses peninjauan.",
          },
        ],
      },
      {
        id: "l6-gloat",
        kind: "perp",
        channel: { en: "#security-ops (private)", id: "#security-ops (privat)" },
        author: { en: "Ops Security", id: "Keamanan Ops" },
        body: [
          {
            en: "We put a folder out there. Anything that opens it, we know exactly who to let go.",
            id: "Kita taruh folder umpan di situ. Apa pun yang buka folder itu, kita langsung tahu siapa yang harus dipecat.",
          },
          {
            en: "Bayu's file's already edited. Nobody's going back to check a video.",
            id: "File Bayu udah diedit. Gak bakal ada yang balik ngecek video.",
          },
        ],
      },
      {
        id: "l6-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Handoff note's got Drake's login. Get in quiet, find the pre-edit timesheet — and stay clear of whatever that folder trap is.",
            id: "Catatan handoff ada login Drake. Masuk diam-diam, cari timesheet asli — dan hindari apa pun jebakan folder itu.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The watcher list is the proof now.", id: "Daftar pengawas itu sekarang jadi buktinya." },
    cards: [
      {
        id: "l6-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored the pre-edit sheet and mailed it to the whole roster — the honeypot's watcher list came along as proof.",
            id: "Pulihkan sheet asli dan kirim ke semua sopir — daftar pengawas honeypot ikut terbawa sebagai bukti.",
          },
        ],
        answers: "l6-plan",
      },
      {
        id: "l6-outro-relief",
        kind: "victim",
        channel: { en: "#dispatch", id: "#dispatch" },
        author: { en: "Bayu (Driver, Route 12)", id: "Bayu (Sopir, Rute 12)" },
        body: [
          {
            en: "Original timesheet's back, matches the dashcam exactly. Every driver on the roster got a copy too.",
            id: "Timesheet asli udah balik, cocok persis sama dashcam. Semua sopir di daftar juga dapat salinannya.",
          },
        ],
        answers: "l6-harm",
      },
      {
        id: "l6-outro-mailed",
        kind: "public",
        channel: { en: "#dispatch — all-drivers", id: "#dispatch — semua-sopir" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Pre-edit timesheets for the last quarter mailed to every driver. Honeypot watcher list attached as proof of intent.",
            id: "Timesheet sebelum diedit untuk kuartal terakhir dikirim ke semua sopir. Daftar pengawas honeypot dilampirkan sebagai bukti niat.",
          },
        ],
        answers: "l6-gloat",
      },
      {
        id: "l6-outro-panic",
        kind: "perp",
        channel: { en: "#security-ops (private)", id: "#security-ops (privat)" },
        author: { en: "Ops Security", id: "Keamanan Ops" },
        body: [
          {
            en: "the watcher list wasn't supposed to leave this channel",
            id: "daftar pengawas itu harusnya gak keluar dari channel ini",
          },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "fleetline-srv",
      ip: "203.0.113.88",
      orgName: "Fleetline Logistics",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.9 | fleetline-ops-srv" }],
      users: [{ username: "mdrake", password: "Fr8Handl3r!", role: "ops" }],
      systemUsers: [
        { username: "mdrake", role: "ops" },
        { username: "root", role: "admin" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "README.txt",
            kind: "file",
            content: "Fleetline Logistics ops server. Contact IT before changing anything.",
          },
          {
            name: "payroll_export",
            kind: "dir",
            metadata: [
              { label: "owner", value: "security-ops" },
              { label: "modified", value: "3 minutes ago" },
              { label: "note", value: "access-monitored directory" },
            ],
            honeypot: {
              tracePenalty: 35,
              triggeredFact: "honeypot-triggered",
              warningText: [
                "[alert] intrusion sensor tripped in /payroll_export",
                "[alert] directory access logged and escalated to security-ops",
              ],
            },
            children: [
              {
                name: "notes.txt",
                kind: "file",
                content:
                  "Backup admin access — [[password:Payr0ll2024!|Found in the payroll backup folder]]",
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
                    name: "app_error.log",
                    kind: "file",
                    grantsFact: "read-error-log",
                    content:
                      "Traceback (most recent call last):\n" +
                      '  File "sync.py", line 88, in <module>\n' +
                      "    raise IOError(\"cannot resolve fallback path\")\n" +
                      "IOError: fallback dir missing: " +
                      "[[path:/mnt/archive/manifests_2024|Real data path, leaked in an app error stack trace]]",
                  },
                ],
              },
            ],
          },
          {
            name: "mnt",
            kind: "dir",
            children: [
              {
                name: "archive",
                kind: "dir",
                children: [
                  {
                    name: "manifests_2024",
                    kind: "dir",
                    children: [
                      {
                        name: "ops_handoff.txt",
                        kind: "file",
                        grantsFact: "read-handoff",
                        content:
                          "Ops handoff — shift notes.\n\n" +
                          "If the sync job fails again, log in manually:\n" +
                          "[[username:mdrake|Ops account, mentioned in handoff notes]] / " +
                          "[[password:Fr8Handl3r!|Temporary password, meant to be rotated but wasn't]]",
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
  ],
};
