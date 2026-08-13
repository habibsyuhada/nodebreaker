import type { LevelDef } from "./types";

export const LEVEL_22: LevelDef = {
  id: "level-22",
  index: 21,
  title: { en: "Cityline Emergency Dispatch", id: "Cityline Emergency Dispatch" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: an emergency dispatch vendor's ops server.", id: "Target: server operasional vendor dispatch darurat." },
    {
      en: "Something here looks too easy to grab. Look before you touch anything.",
      id: "Ada sesuatu di sini yang kelihatannya terlalu gampang buat diambil. Lihat dulu sebelum kamu sentuh apa pun.",
    },
  ],
  entryNodeId: "cityline-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — dispatch console unlocked.", id: "Kamu masuk — konsol dispatch terbuka." },
    { en: "LEVEL 22 COMPLETE.", id: "LEVEL 22 SELESAI." },
  ],
  parSeconds: 240,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "That folder was never about a trap. Now it's evidence.",
      id: "Folder itu awalnya bukan soal jebakan. Sekarang jadi bukti.",
    },
    cards: [
      {
        id: "l22-context",
        kind: "system",
        channel: { en: "#dispatch-ops", id: "#dispatch-ops" },
        author: { en: "Dispatch Bot", id: "Bot Dispatch" },
        body: [
          { en: "Zone routing table — synced. Contract-tier weighting: active.", id: "Tabel routing zona — tersinkron. Pembobotan tier kontrak: aktif." },
        ],
      },
      {
        id: "l22-harm",
        kind: "victim",
        channel: { en: "#dispatch-ops", id: "#dispatch-ops" },
        author: { en: "Priya (EMT dispatcher)", id: "Priya (dispatcher EMT)" },
        meta: { en: "Shift log", id: "Log shift" },
        body: [
          {
            en: "The routing system keeps sending the closer unit past a call in Ward 3 to cover a lower-priority call in Ward 1 instead. I flagged it three times.",
            id: "Sistem routing terus kirim unit terdekat lewat panggilan di Wilayah 3 buat nutupin panggilan prioritas lebih rendah di Wilayah 1. Saya sudah laporkan tiga kali.",
          },
        ],
      },
      {
        id: "l22-brushoff",
        kind: "system",
        channel: { en: "#dispatch-ops", id: "#dispatch-ops" },
        author: { en: "Ops Support (auto-reply)", id: "Dukungan Ops (balasan otomatis)" },
        body: [
          {
            en: "The routing table follows contracted service levels. No manual override needed.",
            id: "Tabel routing mengikuti tingkat layanan yang dikontrak. Tidak perlu override manual.",
          },
        ],
      },
      {
        id: "l22-gloat",
        kind: "perp",
        channel: { en: "#dispatch-contracts (private)", id: "#dispatch-contracts (privat)" },
        author: { en: "Ops Security", id: "Keamanan Ops" },
        body: [
          {
            en: "We put a folder out there labeled 'response audit.' Anything that opens it, we know exactly who's been asking questions.",
            id: "Kita taruh folder umpan berlabel 'audit respons.' Apa pun yang buka folder itu, kita langsung tahu siapa yang mulai banyak nanya.",
          },
          {
            en: "Priya's flags are already closed as 'resolved.' Nobody's cross-referencing response times against contract tier.",
            id: "Laporan Priya udah ditutup sebagai 'terselesaikan.' Gak bakal ada yang cocokkan waktu respons sama tier kontrak.",
          },
        ],
      },
      {
        id: "l22-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Handoff note's got a login. Get in quiet, find the routing memo — and stay clear of whatever that folder trap is.",
            id: "Catatan handoff ada login. Masuk diam-diam, cari memo routing — dan hindari apa pun jebakan folder itu.",
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
        id: "l22-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Reordered the routing table by distance, not contract tier, and mailed the routing memo to every dispatcher on shift — the honeypot's watcher list came along as proof.",
            id: "Urutkan ulang tabel routing berdasarkan jarak, bukan tier kontrak, dan kirim memo routing ke semua dispatcher yang bertugas — daftar pengawas honeypot ikut terbawa sebagai bukti.",
          },
        ],
        answers: "l22-plan",
      },
      {
        id: "l22-outro-relief",
        kind: "victim",
        channel: { en: "#dispatch-ops", id: "#dispatch-ops" },
        author: { en: "Priya (EMT dispatcher)", id: "Priya (dispatcher EMT)" },
        body: [
          {
            en: "Routing's by distance now, matches what I've been flagging for months. Every dispatcher on shift got the memo too.",
            id: "Routing-nya sekarang berdasarkan jarak, cocok sama yang saya laporkan berbulan-bulan. Semua dispatcher yang bertugas juga dapat memonya.",
          },
        ],
        answers: "l22-harm",
      },
      {
        id: "l22-outro-mailed",
        kind: "public",
        channel: { en: "#dispatch-ops — all-shift", id: "#dispatch-ops — semua-shift" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Contract-tier routing memo mailed to every dispatcher. Honeypot watcher list attached as proof of intent.",
            id: "Memo routing tier kontrak dikirim ke semua dispatcher. Daftar pengawas honeypot dilampirkan sebagai bukti niat.",
          },
        ],
        answers: "l22-gloat",
      },
      {
        id: "l22-outro-panic",
        kind: "perp",
        channel: { en: "#dispatch-contracts (private)", id: "#dispatch-contracts (privat)" },
        author: { en: "Ops Security", id: "Keamanan Ops" },
        body: [
          { en: "the watcher list wasn't supposed to leave this channel", id: "daftar pengawas itu harusnya gak keluar dari channel ini" },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "cityline-srv",
      ip: "203.0.113.115",
      orgName: "Cityline Emergency Dispatch",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.9 | cityline-dispatch-srv" }],
      users: [{ username: "kbrennan", password: "R3sp0nseTm!", role: "dispatch ops" }],
      systemUsers: [
        { username: "kbrennan", role: "dispatch ops" },
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
              en: "Cityline Emergency Dispatch server. Contact IT before changing anything.",
              id: "Server Cityline Emergency Dispatch. Hubungi IT sebelum mengubah apa pun.",
            },
          },
          {
            name: "response_audit",
            kind: "dir",
            metadata: [
              { label: { en: "owner", id: "pemilik" }, value: { en: "ops-security", id: "ops-security" } },
              {
                label: { en: "modified", id: "dimodifikasi" },
                value: { en: "3 minutes ago", id: "3 menit yang lalu" },
              },
              {
                label: { en: "note", id: "catatan" },
                value: { en: "access-monitored directory", id: "direktori dengan akses termonitor" },
              },
            ],
            honeypot: {
              tracePenalty: 35,
              triggeredFact: "honeypot-triggered",
              warningText: [
                { en: "[alert] intrusion sensor tripped in /response_audit", id: "[alert] sensor intrusi terpicu di /response_audit" },
                {
                  en: "[alert] directory access logged and escalated to ops-security",
                  id: "[alert] akses direktori tercatat dan dieskalasi ke ops-security",
                },
              ],
            },
            children: [
              {
                name: "notes.txt",
                kind: "file",
                content: {
                  en: "Backup admin access — [[password:Audit2024!|Found in the response audit folder]]",
                  id: "Akses admin backup — [[password:Audit2024!|Ditemukan di folder audit respons]]",
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
                    name: "app_error.log",
                    kind: "file",
                    grantsFact: "read-error-log",
                    content: {
                      en:
                        "Traceback (most recent call last):\n" +
                        '  File "sync.py", line 73, in <module>\n' +
                        "    raise IOError(\"cannot resolve fallback path\")\n" +
                        "IOError: fallback dir missing: " +
                        "[[path:/mnt/archive/routing_2024|Real data path, leaked in an app error stack trace]]",
                      id:
                        "Traceback (most recent call last):\n" +
                        '  File "sync.py", line 73, in <module>\n' +
                        "    raise IOError(\"cannot resolve fallback path\")\n" +
                        "IOError: fallback dir missing: " +
                        "[[path:/mnt/archive/routing_2024|Path data asli, bocor lewat stack trace error aplikasi]]",
                    },
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
                    name: "routing_2024",
                    kind: "dir",
                    children: [
                      {
                        name: "ops_handoff.txt",
                        kind: "file",
                        grantsFact: "read-handoff",
                        content: {
                          en:
                            "Ops handoff — shift notes.\n\n" +
                            "If the routing sync fails again, log in manually:\n" +
                            "[[username:kbrennan|Dispatch ops account, mentioned in handoff notes]] / " +
                            "[[password:R3sp0nseTm!|Temporary password, meant to be rotated but wasn't]]",
                          id:
                            "Handoff ops — catatan shift.\n\n" +
                            "Kalau sync routing gagal lagi, login manual aja:\n" +
                            "[[username:kbrennan|Akun ops dispatch, disebut di catatan handoff]] / " +
                            "[[password:R3sp0nseTm!|Password sementara, harusnya diganti tapi gak pernah]]",
                        },
                      },
                      {
                        name: "routing_memo.txt",
                        kind: "file",
                        grantsFact: "read-routing-memo",
                        content: {
                          en:
                            "Contract-tier routing memo — internal.\n\n" +
                            "Response routing weighted by contract tier, not distance. " +
                            "Ward 3 flagged repeatedly by dispatchers; flags closed as resolved without a table change.",
                          id:
                            "Memo routing tier kontrak — internal.\n\n" +
                            "Routing respons dibobot berdasarkan tier kontrak, bukan jarak. " +
                            "Wilayah 3 ditandai berulang kali oleh dispatcher; laporan ditutup sebagai selesai tanpa perubahan tabel.",
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
  ],
};
