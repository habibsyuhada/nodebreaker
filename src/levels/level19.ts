import type { LevelDef } from "./types";

export const LEVEL_19: LevelDef = {
  id: "level-19",
  index: 18,
  title: { en: "Greenfield Auto Repair", id: "Bengkel Greenfield" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: an auto repair shop's service record server.", id: "Target: server catatan servis bengkel mobil." },
    {
      en: "This one has monitoring. TRACE will climb the longer you linger —",
      id: "Yang ini dipantau. TRACE akan naik semakin lama kamu berada di sini —",
    },
    {
      en: "get in, get what you need, and cover your tracks before you go.",
      id: "masuk, ambil yang kamu butuhkan, dan hapus jejak sebelum keluar.",
    },
  ],
  entryNodeId: "greenfield-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — service record server unlocked.", id: "Kamu masuk — server catatan servis terbuka." },
    { en: "LEVEL 19 COMPLETE.", id: "LEVEL 19 SELESAI." },
  ],
  parSeconds: 180,
  completionRequires: ["logs-deleted"],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Time to change what the record says.", id: "Saatnya ubah apa yang tertulis di catatan." },
    cards: [
      {
        id: "l19-context",
        kind: "system",
        channel: { en: "#shop-ops", id: "#shop-ops" },
        author: { en: "IT Helpdesk", id: "Helpdesk IT" },
        body: [
          { en: "Ticket #3390 — SSH host key renewal — still pending.", id: "Tiket #3390 — perpanjangan kunci host SSH — masih tertunda." },
        ],
      },
      {
        id: "l19-harm",
        kind: "victim",
        channel: { en: "#shop-ops", id: "#shop-ops" },
        author: { en: "T. Alvarado (Customer)", id: "T. Alvarado (Pelanggan)" },
        meta: { en: "Warranty claim", id: "Klaim garansi" },
        body: [
          {
            en: "The transmission failed under warranty. Now the record shows I skipped a scheduled service I have a receipt for. Warranty's denied.",
            id: "Transmisinya rusak masih dalam masa garansi. Sekarang catatannya bilang saya lewatkan servis terjadwal padahal saya punya kwitansinya. Garansi ditolak.",
          },
        ],
      },
      {
        id: "l19-brushoff",
        kind: "system",
        channel: { en: "#shop-ops", id: "#shop-ops" },
        author: { en: "Service Manager", id: "Manajer Servis" },
        body: [
          {
            en: "The record shows what it shows. That's what the warranty company will see.",
            id: "Catatannya bilang apa yang tertulis. Itu yang bakal dilihat pihak garansi.",
          },
        ],
      },
      {
        id: "l19-gloat",
        kind: "perp",
        channel: { en: "DM — Service Manager to shop owner", id: "DM — Manajer Servis ke pemilik bengkel" },
        author: { en: "Service Manager", id: "Manajer Servis" },
        body: [
          {
            en: "Backdated a 'missed service' entry before the claim went in. Paper says he skipped it. Nobody looks past the paper.",
            id: "Tambahkan entri 'servis terlewat' dengan tanggal mundur sebelum klaimnya masuk. Di kertas dia yang lewatkan. Gak ada yang lihat lebih jauh dari kertas.",
          },
          { en: "Claim's denied — for us.", id: "Klaimnya ditolak — buat kita." },
        ],
      },
      {
        id: "l19-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need the real service record before the claim closes. Whatever's actually in there, I need to see it first.",
            id: "Perlu catatan servis asli sebelum klaimnya ditutup. Apa pun isi aslinya, saya harus lihat duluan.",
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
        id: "l19-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored the real service record and the manager's backdated edit instructions. Deleted my own tracks — his stayed exactly where they were.",
            id: "Pulihkan catatan servis asli dan instruksi edit tanggal mundur dari manajer. Hapus jejak saya sendiri — jejak dia dibiarkan persis di tempatnya.",
          },
        ],
        answers: "l19-plan",
      },
      {
        id: "l19-outro-relief",
        kind: "victim",
        channel: { en: "#shop-ops", id: "#shop-ops" },
        author: { en: "T. Alvarado (Customer)", id: "T. Alvarado (Pelanggan)" },
        meta: { en: "After review", id: "Setelah ditinjau" },
        body: [
          {
            en: "Warranty approved. Record shows the real service history now, and the transmission's covered.",
            id: "Garansi disetujui. Catatannya sekarang nunjukin riwayat servis yang asli, dan transmisinya dicover.",
          },
        ],
        answers: "l19-harm",
      },
      {
        id: "l19-outro-panic",
        kind: "perp",
        channel: { en: "DM — Service Manager to shop owner", id: "DM — Manajer Servis ke pemilik bengkel" },
        author: { en: "Service Manager", id: "Manajer Servis" },
        body: [{ en: "why does the record say something else now", id: "kenapa sekarang catatannya bilang hal lain" }],
      },
    ],
  },
  nodes: [
    {
      id: "greenfield-srv",
      ip: "198.51.100.44",
      orgName: "Greenfield Auto Repair",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 7.4 | Ubuntu 18.04 greenfield-srv" }],
      users: [{ username: "jalvarado", password: "Greenf1eld#24", role: "technician" }],
      systemUsers: [
        { username: "admin", role: "shop owner" },
        { username: "jalvarado", role: "technician" },
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
                      en: "2024-03-11 09:02  [[username:jalvarado|Account name flagged in the log]] login OK  from 10.0.0.9 (internal)\n2024-03-11 09:15  jalvarado login OK  from 10.0.0.9 (internal)\n2024-03-12 23:41  jalvarado login OK  from 172.16.5.201 (unrecognized) — [[pattern:11:41pm from an unrecognized host|Suspicious: this session doesn't look like jalvarado]]\n2024-03-12 23:44  jalvarado ran: edit_record.sh --vin 1FT7X2 --add missed-service",
                      id: "2024-03-11 09:02  [[username:jalvarado|Nama akun yang ditandai dalam log]] login OK  from 10.0.0.9 (internal)\n2024-03-11 09:15  jalvarado login OK  from 10.0.0.9 (internal)\n2024-03-12 23:41  jalvarado login OK  from 172.16.5.201 (unrecognized) — [[pattern:11:41pm from an unrecognized host|Mencurigakan: sesi ini kelihatannya bukan jalvarado]]\n2024-03-12 23:44  jalvarado ran: edit_record.sh --vin 1FT7X2 --add missed-service",
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
                name: "jalvarado",
                kind: "dir",
                children: [
                  {
                    name: ".bash_history",
                    kind: "file",
                    grantsFact: "read-history",
                    content: {
                      en: "cd /var/www/records\nls -la\nmysql -u jalvarado -p'[[password:Greenf1eld#24|Password typed straight into the shell]]' service_db\nexit",
                      id: "cd /var/www/records\nls -la\nmysql -u jalvarado -p'[[password:Greenf1eld#24|Password diketik langsung di shell]]' service_db\nexit",
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
              en: "Greenfield Auto Repair service record server. IT ticket #3390: renew the SSH host key (still pending).",
              id: "Server catatan servis Bengkel Greenfield. Tiket IT #3390: perpanjang SSH host key (masih tertunda).",
            },
          },
        ],
      },
    },
  ],
};
