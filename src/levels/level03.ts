import type { LevelDef } from "./types";

export const LEVEL_03: LevelDef = {
  id: "level-03",
  index: 2,
  title: "Ledger & Co. Accounting",
  briefing: [
    "Connection established.",
    "Target: a small accounting firm's file server.",
    "This one has monitoring. TRACE will climb the longer you linger —",
    "get in, get what you need, and cover your tracks before you go.",
  ],
  entryNodeId: "ledger-srv",
  successText: ["ACCESS GRANTED.", "You're in — file server unlocked.", "LEVEL 3 COMPLETE."],
  completionRequires: ["logs-deleted"],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "Time to change what the paper says.",
      id: "Saatnya ubah apa yang tertulis di kertas.",
    },
    cards: [
      {
        id: "l3-context",
        kind: "system",
        channel: { en: "#firm-ops", id: "#firm-ops" },
        author: { en: "IT Helpdesk", id: "Helpdesk IT" },
        body: [
          {
            en: "Ticket #4471 — SSH host key renewal — still pending.",
            id: "Tiket #4471 — perpanjangan kunci host SSH — masih tertunda.",
          },
        ],
      },
      {
        id: "l3-harm",
        kind: "victim",
        channel: { en: "#firm-ops", id: "#firm-ops" },
        author: { en: "J. Martin (Bookkeeping)", id: "J. Martin (Bagian Pembukuan)" },
        meta: { en: "Mon 9:14 AM", id: "Sen 09:14" },
        body: [
          {
            en: "Why does the export log show ME running mysqldump at 2:47 AM? I was asleep. Someone needs to look at this before Friday's audit.",
            id: "Kenapa log export nunjukin SAYA yang jalanin mysqldump jam 2:47 pagi? Saya lagi tidur. Ini harus dicek sebelum audit hari Jumat.",
          },
        ],
      },
      {
        id: "l3-brushoff",
        kind: "system",
        channel: { en: "#firm-ops", id: "#firm-ops" },
        author: { en: "Partner — R. Voss", id: "Partner — R. Voss" },
        body: [
          {
            en: "The log has your username on it, Martin. That's what the audit will see. Let's discuss after Friday.",
            id: "Log-nya ada nama akun kamu, Martin. Itu yang bakal dilihat auditor. Kita bahas setelah hari Jumat.",
          },
        ],
      },
      {
        id: "l3-gloat",
        kind: "perp",
        channel: { en: "DM — R. Voss to a partner", id: "DM — R. Voss ke partner lain" },
        author: { en: "R. Voss", id: "R. Voss" },
        body: [
          {
            en: "He signed off on the export. Paper says his name. Nobody looks past the paper.",
            id: "Dia yang tanda tangan di export itu. Di kertas namanya dia. Gak ada yang lihat lebih jauh dari kertas.",
          },
          { en: "Friday's audit closes clean — for us.", id: "Audit Jumat kelar bersih — buat kita." },
        ],
      },
      {
        id: "l3-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need Martin's login before Friday's audit closes. Whatever's really in that export, I need to see it first.",
            id: "Perlu login Martin sebelum audit Jumat ditutup. Apa pun isi asli export itu, saya harus lihat duluan.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: {
      en: "The paper says something else now.",
      id: "Sekarang kertasnya bilang hal lain.",
    },
    cards: [
      {
        id: "l3-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Pulled the real export and Voss's edit instructions. Deleted my own tracks — left his exactly where they were.",
            id: "Ambil export asli dan instruksi edit dari Voss. Hapus jejak saya sendiri — jejak dia dibiarkan persis di tempatnya.",
          },
        ],
        answers: "l3-plan",
      },
      {
        id: "l3-outro-clear",
        kind: "victim",
        channel: { en: "#firm-ops", id: "#firm-ops" },
        author: { en: "J. Martin (Bookkeeping)", id: "J. Martin (Bagian Pembukuan)" },
        meta: { en: "Fri, after audit", id: "Jumat, setelah audit" },
        body: [
          {
            en: "Audit's over. My name's clear — the real export trail went to the regulator instead. Still don't know who to thank.",
            id: "Audit sudah selesai. Nama saya bersih — jejak export yang asli malah dikirim ke regulator. Masih gak tahu harus berterima kasih ke siapa.",
          },
        ],
        answers: "l3-harm",
      },
      {
        id: "l3-outro-notice",
        kind: "public",
        channel: { en: "Regulatory Filing — Public Notice", id: "Berkas Regulator — Pengumuman Publik" },
        author: { en: "State Accountancy Board", id: "Dewan Akuntansi Negara" },
        body: [
          {
            en: "Investigation opened into Ledger & Co. partner R. Voss following an anonymous evidence submission.",
            id: "Investigasi dibuka terhadap partner Ledger & Co., R. Voss, menyusul laporan bukti anonim.",
          },
        ],
        answers: "l3-gloat",
      },
      {
        id: "l3-outro-panic",
        kind: "perp",
        channel: { en: "DM — R. Voss to a partner", id: "DM — R. Voss ke partner lain" },
        author: { en: "R. Voss", id: "R. Voss" },
        body: [
          { en: "why does the paper say MY name now", id: "kenapa sekarang kertasnya ada nama GUE" },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "ledger-srv",
      ip: "198.51.100.15",
      orgName: "Ledger & Co. Accounting",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 7.4 | Ubuntu 18.04 accounting-srv" }],
      users: [{ username: "jmartin", password: "Ledger#2024", role: "accountant" }],
      systemUsers: [
        { username: "admin", role: "sysadmin" },
        { username: "jmartin", role: "accountant" },
        { username: "backup-svc", role: "service account" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
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
                    grantsFact: "read-access-log",
                    content:
                      "2024-01-14 09:02  [[username:jmartin|Account name flagged in the log]] login OK  from 10.0.0.14 (internal)\n2024-01-14 09:15  jmartin login OK  from 10.0.0.14 (internal)\n2024-01-15 02:47  jmartin login OK  from 185.23.44.109 (unrecognized) — [[pattern:2:47am from an unrecognized host|Suspicious: this session doesn't look like jmartin]]\n2024-01-15 02:49  jmartin ran: mysqldump ledger_db > export.sql",
                  },
                ],
              },
            ],
          },
          {
            name: "home",
            kind: "dir",
            children: [
              {
                name: "jmartin",
                kind: "dir",
                children: [
                  {
                    name: ".bash_history",
                    kind: "file",
                    grantsFact: "read-history",
                    content:
                      "cd /var/www/ledger\nls -la\nmysql -u jmartin -p'[[password:Ledger#2024|Password typed straight into the shell]]' ledger_db\nexit",
                  },
                ],
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content: "Ledger & Co. file server. IT ticket #4471: renew the SSH host key (still pending).",
          },
        ],
      },
    },
  ],
};
