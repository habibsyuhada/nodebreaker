import type { LevelDef } from "./types";

export const LEVEL_30: LevelDef = {
  id: "level-30",
  index: 29,
  title: { en: "Aurelia Compliance Archive", id: "Arsip Kepatuhan Aurelia" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a private equity fund's compliance server.", id: "Target: server kepatuhan dana ekuitas swasta." },
    {
      en: "Something here looks too easy to grab. Look before you touch anything.",
      id: "Ada sesuatu di sini yang kelihatannya terlalu gampang buat diambil. Lihat dulu sebelum kamu sentuh apa pun.",
    },
  ],
  entryNodeId: "aurelia-compliance",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — compliance console unlocked.", id: "Kamu masuk — konsol kepatuhan terbuka." },
    { en: "LEVEL 30 COMPLETE.", id: "LEVEL 30 SELESAI." },
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
        id: "l30-context",
        kind: "system",
        channel: { en: "#compliance", id: "#compliance" },
        author: { en: "Compliance Bot", id: "Bot Kepatuhan" },
        body: [
          { en: "Cross-holding conflict-of-interest review: closed, no findings.", id: "Tinjauan konflik kepentingan lintas aset: ditutup, tidak ada temuan." },
        ],
      },
      {
        id: "l30-harm",
        kind: "victim",
        channel: { en: "#compliance", id: "#compliance" },
        author: { en: "Junior Compliance Analyst", id: "Analis Kepatuhan Junior" },
        meta: { en: "Internal memo, ignored", id: "Memo internal, diabaikan" },
        body: [
          {
            en: "I flagged that three portfolio companies share board members and none of it's cross-referenced in our conflict-of-interest filings. Nobody's responded in six weeks.",
            id: "Saya laporkan tiga perusahaan portofolio berbagi anggota dewan dan gak satupun dicocokkan silang di berkas konflik kepentingan kami. Gak ada yang balas dalam enam minggu.",
          },
        ],
      },
      {
        id: "l30-brushoff",
        kind: "system",
        channel: { en: "#compliance", id: "#compliance" },
        author: { en: "Compliance Lead (auto-reply)", id: "Kepala Kepatuhan (balasan otomatis)" },
        body: [
          {
            en: "The review is closed per standard procedure. No further action required at this time.",
            id: "Tinjauannya ditutup sesuai prosedur standar. Tidak ada tindakan lebih lanjut yang diperlukan saat ini.",
          },
        ],
      },
      {
        id: "l30-gloat",
        kind: "perp",
        channel: { en: "#compliance-leads (private)", id: "#compliance-leads (privat)" },
        author: { en: "Compliance Lead", id: "Kepala Kepatuhan" },
        body: [
          {
            en: "We put a folder out there labeled 'conflict review — sealed.' Anything that opens it, we know exactly who's been asking questions.",
            id: "Kita taruh folder umpan berlabel 'tinjauan konflik — disegel.' Apa pun yang buka folder itu, kita langsung tahu siapa yang mulai banyak nanya.",
          },
          {
            en: "The analyst's memo is already buried. Nobody's cross-referencing the board seats.",
            id: "Memo analisnya udah dikubur. Gak bakal ada yang cocokkan kursi dewan direksinya.",
          },
        ],
      },
      {
        id: "l30-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Handoff note's got a login. Get in quiet, find the buried memo — and stay clear of whatever that folder trap is.",
            id: "Catatan handoff ada login. Masuk diam-diam, cari memo yang dikubur — dan hindari apa pun jebakan folder itu.",
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
        id: "l30-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Reopened the conflict review and mailed the analyst's original memo to the full board — the honeypot's watcher list came along as proof.",
            id: "Buka kembali tinjauan konflik dan kirim memo asli analis ke seluruh dewan direksi — daftar pengawas honeypot ikut terbawa sebagai bukti.",
          },
        ],
        answers: "l30-plan",
      },
      {
        id: "l30-outro-relief",
        kind: "victim",
        channel: { en: "#compliance", id: "#compliance" },
        author: { en: "Junior Compliance Analyst", id: "Analis Kepatuhan Junior" },
        body: [
          {
            en: "My memo's back on the board's desk, six weeks late but there. Whatever changed, thank you.",
            id: "Memo saya balik lagi ke meja dewan direksi, telat enam minggu tapi sampai juga. Apa pun yang berubah, terima kasih.",
          },
        ],
        answers: "l30-harm",
      },
      {
        id: "l30-outro-mailed",
        kind: "public",
        channel: { en: "#compliance — full-board", id: "#compliance — seluruh-dewan" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Cross-holding conflict memo mailed to the full board. Honeypot watcher list attached as proof of intent.",
            id: "Memo konflik lintas aset dikirim ke seluruh dewan direksi. Daftar pengawas honeypot dilampirkan sebagai bukti niat.",
          },
        ],
        answers: "l30-gloat",
      },
      {
        id: "l30-outro-panic",
        kind: "perp",
        channel: { en: "#compliance-leads (private)", id: "#compliance-leads (privat)" },
        author: { en: "Compliance Lead", id: "Kepala Kepatuhan" },
        body: [
          { en: "the watcher list wasn't supposed to leave this channel", id: "daftar pengawas itu harusnya gak keluar dari channel ini" },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "aurelia-compliance",
      ip: "203.0.113.128",
      orgName: "Aurelia Capital — Compliance Archive",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.9 | aurelia-compliance-srv" }],
      users: [{ username: "hnakamura", password: "C0nflictChk!", role: "compliance" }],
      systemUsers: [
        { username: "hnakamura", role: "compliance" },
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
              en: "Aurelia Capital compliance archive server. Contact IT before changing anything.",
              id: "Server arsip kepatuhan Aurelia Capital. Hubungi IT sebelum mengubah apa pun.",
            },
          },
          {
            name: "conflict_review",
            kind: "dir",
            metadata: [
              { label: { en: "owner", id: "pemilik" }, value: { en: "compliance-leads", id: "compliance-leads" } },
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
                { en: "[alert] intrusion sensor tripped in /conflict_review", id: "[alert] sensor intrusi terpicu di /conflict_review" },
                {
                  en: "[alert] directory access logged and escalated to compliance-leads",
                  id: "[alert] akses direktori tercatat dan dieskalasi ke compliance-leads",
                },
              ],
            },
            children: [
              {
                name: "notes.txt",
                kind: "file",
                content: {
                  en: "Backup admin access — [[password:Sealed2024!|Found in the conflict review folder]]",
                  id: "Akses admin backup — [[password:Sealed2024!|Ditemukan di folder tinjauan konflik]]",
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
                        '  File "sync.py", line 51, in <module>\n' +
                        "    raise IOError(\"cannot resolve fallback path\")\n" +
                        "IOError: fallback dir missing: " +
                        "[[path:/mnt/archive/memos_2024|Real data path, leaked in an app error stack trace]]",
                      id:
                        "Traceback (most recent call last):\n" +
                        '  File "sync.py", line 51, in <module>\n' +
                        "    raise IOError(\"cannot resolve fallback path\")\n" +
                        "IOError: fallback dir missing: " +
                        "[[path:/mnt/archive/memos_2024|Path data asli, bocor lewat stack trace error aplikasi]]",
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
                    name: "memos_2024",
                    kind: "dir",
                    children: [
                      {
                        name: "ops_handoff.txt",
                        kind: "file",
                        grantsFact: "read-handoff",
                        content: {
                          en:
                            "Ops handoff — shift notes.\n\n" +
                            "If the memo sync fails again, log in manually:\n" +
                            "[[username:hnakamura|Compliance account, mentioned in handoff notes]] / " +
                            "[[password:C0nflictChk!|Temporary password, meant to be rotated but wasn't]]",
                          id:
                            "Handoff ops — catatan shift.\n\n" +
                            "Kalau sync memo gagal lagi, login manual aja:\n" +
                            "[[username:hnakamura|Akun kepatuhan, disebut di catatan handoff]] / " +
                            "[[password:C0nflictChk!|Password sementara, harusnya diganti tapi gak pernah]]",
                        },
                      },
                      {
                        name: "analyst_memo.txt",
                        kind: "file",
                        grantsFact: "read-analyst-memo",
                        content: {
                          en:
                            "Junior analyst memo — buried, internal.\n\n" +
                            "Three portfolio companies (retail, health data, civic infrastructure) share overlapping " +
                            "board seats. No conflict-of-interest cross-reference filed. Escalated, no response.",
                          id:
                            "Memo analis junior — dikubur, internal.\n\n" +
                            "Tiga perusahaan portofolio (ritel, data kesehatan, infrastruktur kota) berbagi kursi " +
                            "dewan direksi yang tumpang tindih. Tidak ada berkas konflik kepentingan yang diajukan. Dieskalasi, tanpa respons.",
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
