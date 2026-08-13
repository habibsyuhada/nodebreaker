import type { LevelDef } from "./types";

export const LEVEL_27: LevelDef = {
  id: "level-27",
  index: 26,
  title: { en: "Lakeside Marina", id: "Marina Lakeside" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a marina's berth records server.", id: "Target: server catatan dermaga marina." },
    {
      en: "This one has monitoring. TRACE will climb the longer you linger —",
      id: "Yang ini dipantau. TRACE akan naik semakin lama kamu berada di sini —",
    },
    {
      en: "get in, get what you need, and cover your tracks before you go.",
      id: "masuk, ambil yang kamu butuhkan, dan hapus jejak sebelum keluar.",
    },
  ],
  entryNodeId: "lakeside-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — berth records server unlocked.", id: "Kamu masuk — server catatan dermaga terbuka." },
    { en: "LEVEL 27 COMPLETE.", id: "LEVEL 27 SELESAI." },
  ],
  parSeconds: 180,
  completionRequires: ["logs-deleted"],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Time to change what the record says.", id: "Saatnya ubah apa yang tertulis di catatan." },
    cards: [
      {
        id: "l27-context",
        kind: "system",
        channel: { en: "#marina-ops", id: "#marina-ops" },
        author: { en: "IT Helpdesk", id: "Helpdesk IT" },
        body: [
          { en: "Ticket #5512 — SSH host key renewal — still pending.", id: "Tiket #5512 — perpanjangan kunci host SSH — masih tertunda." },
        ],
      },
      {
        id: "l27-harm",
        kind: "victim",
        channel: { en: "#marina-ops", id: "#marina-ops" },
        author: { en: "R. Delacroix (Berth 22)", id: "R. Delacroix (Dermaga 22)" },
        meta: { en: "Insurance claim", id: "Klaim asuransi" },
        body: [
          {
            en: "The hull damage happened during the marina's own crane transfer. Now the record shows I requested an unsupervised late-night lift. Insurance denied my claim.",
            id: "Kerusakan lambungnya kejadian saat pemindahan crane milik marina sendiri. Sekarang catatannya bilang saya minta pengangkatan tanpa pengawasan tengah malam. Klaim asuransi saya ditolak.",
          },
        ],
      },
      {
        id: "l27-brushoff",
        kind: "system",
        channel: { en: "#marina-ops", id: "#marina-ops" },
        author: { en: "Dockmaster", id: "Kepala Dermaga" },
        body: [
          {
            en: "The record shows what it shows. That's what the insurer will see.",
            id: "Catatannya bilang apa yang tertulis. Itu yang bakal dilihat pihak asuransi.",
          },
        ],
      },
      {
        id: "l27-gloat",
        kind: "perp",
        channel: { en: "DM — Dockmaster to marina owner", id: "DM — Kepala Dermaga ke pemilik marina" },
        author: { en: "Dockmaster", id: "Kepala Dermaga" },
        body: [
          {
            en: "Backdated a 'client-requested lift' entry before the claim went in. Paper says he asked for it. Nobody looks past the paper.",
            id: "Tambahkan entri 'pengangkatan atas permintaan klien' dengan tanggal mundur sebelum klaimnya masuk. Di kertas dia yang minta. Gak ada yang lihat lebih jauh dari kertas.",
          },
          { en: "Claim's denied — for us.", id: "Klaimnya ditolak — buat kita." },
        ],
      },
      {
        id: "l27-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need the real crane log before the claim closes. Whatever's actually in there, I need to see it first.",
            id: "Perlu log crane asli sebelum klaimnya ditutup. Apa pun isi aslinya, saya harus lihat duluan.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The record says something else now.", id: "Sekarang catatannya bilang hal lain." },
    cards: [
      {
        id: "l27-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored the real crane log and the dockmaster's backdated edit instructions. Deleted my own tracks — his stayed exactly where they were.",
            id: "Pulihkan log crane asli dan instruksi edit tanggal mundur dari kepala dermaga. Hapus jejak saya sendiri — jejak dia dibiarkan persis di tempatnya.",
          },
        ],
        answers: "l27-plan",
      },
      {
        id: "l27-outro-relief",
        kind: "victim",
        channel: { en: "#marina-ops", id: "#marina-ops" },
        author: { en: "R. Delacroix (Berth 22)", id: "R. Delacroix (Dermaga 22)" },
        meta: { en: "After review", id: "Setelah ditinjau" },
        body: [
          {
            en: "Claim approved. Record shows the real crane log now, and the repair's covered.",
            id: "Klaim disetujui. Catatannya sekarang nunjukin log crane yang asli, dan perbaikannya dicover.",
          },
        ],
        answers: "l27-harm",
      },
      {
        id: "l27-outro-panic",
        kind: "perp",
        channel: { en: "DM — Dockmaster to marina owner", id: "DM — Kepala Dermaga ke pemilik marina" },
        author: { en: "Dockmaster", id: "Kepala Dermaga" },
        body: [{ en: "why does the record say something else now", id: "kenapa sekarang catatannya bilang hal lain" }],
      },
    ],
  },
  nodes: [
    {
      id: "lakeside-srv",
      ip: "198.51.100.51",
      orgName: "Lakeside Marina",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 7.4 | Ubuntu 18.04 lakeside-srv" }],
      users: [{ username: "rdelacroix", password: "Lakes1de#27", role: "dockhand" }],
      systemUsers: [
        { username: "admin", role: "dockmaster" },
        { username: "rdelacroix", role: "dockhand" },
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
                    content: {
                      en: "2024-07-09 09:02  [[username:rdelacroix|Account name flagged in the log]] login OK  from 10.0.1.4 (internal)\n2024-07-09 09:15  rdelacroix login OK  from 10.0.1.4 (internal)\n2024-07-10 01:12  rdelacroix login OK  from 192.0.2.77 (unrecognized) — [[pattern:1:12am from an unrecognized host|Suspicious: this session doesn't look like rdelacroix]]\n2024-07-10 01:16  rdelacroix ran: edit_record.sh --berth 22 --add client-requested-lift",
                      id: "2024-07-09 09:02  [[username:rdelacroix|Nama akun yang ditandai dalam log]] login OK  from 10.0.1.4 (internal)\n2024-07-09 09:15  rdelacroix login OK  from 10.0.1.4 (internal)\n2024-07-10 01:12  rdelacroix login OK  from 192.0.2.77 (unrecognized) — [[pattern:1:12am from an unrecognized host|Mencurigakan: sesi ini kelihatannya bukan rdelacroix]]\n2024-07-10 01:16  rdelacroix ran: edit_record.sh --berth 22 --add client-requested-lift",
                    },
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
                name: "rdelacroix",
                kind: "dir",
                children: [
                  {
                    name: ".bash_history",
                    kind: "file",
                    grantsFact: "read-history",
                    content: {
                      en: "cd /var/www/records\nls -la\nmysql -u rdelacroix -p'[[password:Lakes1de#27|Password typed straight into the shell]]' berth_db\nexit",
                      id: "cd /var/www/records\nls -la\nmysql -u rdelacroix -p'[[password:Lakes1de#27|Password diketik langsung di shell]]' berth_db\nexit",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content: {
              en: "Lakeside Marina berth records server. IT ticket #5512: renew the SSH host key (still pending).",
              id: "Server catatan dermaga Marina Lakeside. Tiket IT #5512: perpanjang SSH host key (masih tertunda).",
            },
          },
        ],
      },
    },
  ],
};
