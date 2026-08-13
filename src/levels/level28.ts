import type { LevelDef } from "./types";

export const LEVEL_28: LevelDef = {
  id: "level-28",
  index: 27,
  title: { en: "Aurelia Portfolio Reporting", id: "Pelaporan Portofolio Aurelia" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a private equity fund's staging server.", id: "Target: server staging dana ekuitas swasta." },
    {
      en: "Nothing here is guarded well, but nothing is handed to you either —",
      id: "Gak ada yang dijaga ketat di sini, tapi juga gak ada yang dikasih cuma-cuma —",
    },
    {
      en: "decode, compare, and crack your way in.",
      id: "decode, bandingkan, dan retas jalan masukmu sendiri.",
    },
  ],
  entryNodeId: "aurelia-portfolio",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — disclosure staging unlocked.", id: "Kamu masuk — staging disclosure terbuka." },
    { en: "LEVEL 28 COMPLETE.", id: "LEVEL 28 SELESAI." },
  ],
  parSeconds: 220,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "Three names. One owner.", id: "Tiga nama. Satu pemilik." },
    cards: [
      {
        id: "l28-context",
        kind: "system",
        channel: { en: "#aurelia-reporting", id: "#aurelia-reporting" },
        author: { en: "Platform Bot", id: "Bot Platform" },
        body: [
          { en: "Config sync — staging updated. Quarterly disclosure module v7.2.", id: "Sinkronisasi config — staging diperbarui. Modul disclosure kuartalan v7.2." },
        ],
      },
      {
        id: "l28-harm",
        kind: "victim",
        channel: { en: "Public Filing — Shareholder Inquiry", id: "Berkas Publik — Pertanyaan Pemegang Saham" },
        author: { en: "Minority Shareholder", id: "Pemegang Saham Minoritas" },
        meta: { en: "Forwarded internally", id: "Diteruskan secara internal" },
        body: [
          {
            en: "The public filing lists 'diversified holdings, undisclosed.' That's not a real answer. Whose companies are these?",
            id: "Berkas publiknya menyebut 'aset terdiversifikasi, tidak diungkapkan.' Itu bukan jawaban sungguhan. Perusahaan siapa saja itu?",
          },
        ],
      },
      {
        id: "l28-gloat",
        kind: "perp",
        channel: { en: "DM — Portfolio Lead to General Counsel", id: "DM — Kepala Portofolio ke Penasihat Hukum" },
        author: { en: "Portfolio Lead", id: "Kepala Portofolio" },
        body: [
          {
            en: "v7.2 quietly names all three in the internal staging config — same public filing, buried internal detail. Legal signed off.",
            id: "v7.2 diam-diam menyebut ketiganya di config staging internal — berkas publik sama, detail internal dikubur. Legal sudah setuju.",
          },
          { en: "Nobody reads the staging diff.", id: "Gak ada yang baca perbandingan staging." },
        ],
      },
      {
        id: "l28-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Need into the staging box. If the disclosure really widened, the old and new configs will say different things.",
            id: "Perlu masuk ke box staging. Kalau disclosure-nya benar diperluas, config lama dan baru bakal beda isinya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "Three names, out in the open.", id: "Tiga nama, sekarang terbuka." },
    cards: [
      {
        id: "l28-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Pulled both configs side by side. The buried holdings list came with them — three names I already recognized.",
            id: "Ambil kedua config berdampingan. Daftar aset yang dikubur ikut terbawa — tiga nama yang sudah saya kenal.",
          },
        ],
        answers: "l28-plan",
      },
      {
        id: "l28-outro-relief",
        kind: "victim",
        channel: { en: "Public Filing — Shareholder Inquiry", id: "Berkas Publik — Pertanyaan Pemegang Saham" },
        author: { en: "Minority Shareholder", id: "Pemegang Saham Minoritas" },
        body: [
          {
            en: "Finally, a real answer. Now I know exactly which companies my dividend's been coming from.",
            id: "Akhirnya, jawaban sungguhan. Sekarang saya tahu persis perusahaan mana yang jadi sumber dividen saya.",
          },
        ],
        answers: "l28-harm",
      },
      {
        id: "l28-outro-press",
        kind: "public",
        channel: { en: "Tech Press — Breaking", id: "Media Teknologi — Berita Terbaru" },
        author: { en: "@dataleaks_daily", id: "@dataleaks_daily" },
        body: [
          {
            en: "Leaked configs show a private equity fund quietly holds stakes in three companies already under separate public scrutiny.",
            id: "Config bocor menunjukkan dana ekuitas swasta diam-diam memiliki saham di tiga perusahaan yang sudah dalam sorotan publik terpisah.",
          },
        ],
        answers: "l28-gloat",
      },
      {
        id: "l28-outro-panic",
        kind: "perp",
        channel: { en: "DM — Portfolio Lead to General Counsel", id: "DM — Kepala Portofolio ke Penasihat Hukum" },
        author: { en: "Portfolio Lead", id: "Kepala Portofolio" },
        body: [{ en: "the holdings list is trending, who leaked the diff", id: "daftar asetnya lagi rame dibahas, siapa yang bocorin diff-nya" }],
      },
    ],
  },
  nodes: [
    {
      id: "aurelia-portfolio",
      ip: "203.0.113.250",
      orgName: "Aurelia Capital — Portfolio Reporting (Staging)",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.6 | aurelia-portfolio (staging)" }],
      users: [{ username: "portfoliosvc", password: "St4keHidden#2", role: "deployment service account" }],
      systemUsers: [
        { username: "portfoliosvc", role: "service account" },
        { username: "root", role: "admin" },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "src",
            kind: "dir",
            children: [
              {
                name: "sync_config.py",
                kind: "file",
                grantsFact: "read-sync-script",
                content: {
                  en:
                    "# staging config sync — don't touch without asking platform team\n" +
                    "# legacy service login moved here during the migration\n" +
                    "# b64: [[encoded:cG9ydGZvbGlvc3Zj|Base64 comment left in by a careless dev]]\n" +
                    "import subprocess\n",
                  id:
                    "# sinkronisasi config staging — jangan diubah tanpa izin tim platform\n" +
                    "# login service lama dipindahkan ke sini saat migrasi\n" +
                    "# b64: [[encoded:cG9ydGZvbGlvc3Zj|Komentar Base64 yang ketinggalan dari dev yang ceroboh]]\n" +
                    "import subprocess\n",
                },
              },
            ],
          },
          {
            name: "etc",
            kind: "dir",
            children: [
              {
                name: "disclosure.old.yml",
                kind: "file",
                grantsFact: "read-disclosure-old",
                content: {
                  en:
                    "module: quarterly-disclosure\n" +
                    "holdings: diversified, undisclosed\n" +
                    "password_hash: [[hash:5f4dcc3b5aa765d61d8327deb882cf99|Old hash — superseded]]\n" +
                    "updated: 2023-07-01",
                  id:
                    "module: quarterly-disclosure\n" +
                    "holdings: diversified, undisclosed\n" +
                    "password_hash: [[hash:5f4dcc3b5aa765d61d8327deb882cf99|Hash lama — sudah diganti]]\n" +
                    "updated: 2023-07-01",
                },
              },
              {
                name: "disclosure.new.yml",
                kind: "file",
                grantsFact: "read-disclosure-new",
                content: {
                  en:
                    "module: quarterly-disclosure\n" +
                    "holdings: Halcyon Dynamics, Meridian Health Analytics, Ferrovia Systems\n" +
                    "password_hash: [[hash:a1b2c3d4e5f6789012345678901234ab|New hash after last rotation]]\n" +
                    "updated: 2024-08-02",
                  id:
                    "module: quarterly-disclosure\n" +
                    "holdings: Halcyon Dynamics, Meridian Health Analytics, Ferrovia Systems\n" +
                    "password_hash: [[hash:a1b2c3d4e5f6789012345678901234ab|Hash baru setelah rotasi terakhir]]\n" +
                    "updated: 2024-08-02",
                },
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content: {
              en: "Aurelia Capital portfolio reporting staging server.\nIf access breaks, check with the platform team before touching creds.",
              id: "Server staging pelaporan portofolio Aurelia Capital.\nKalau akses gak berfungsi, hubungi tim platform dulu sebelum mengubah kredensial.",
            },
          },
        ],
      },
      compares: [
        {
          id: "disclosure-configs",
          label: { en: "Compare Configs", id: "Bandingkan Config" },
          pathA: ["etc", "disclosure.old.yml"],
          pathB: ["etc", "disclosure.new.yml"],
          requiredFacts: ["read-disclosure-old", "read-disclosure-new"],
          grantsFact: "compared-disclosure-configs",
        },
      ],
    },
  ],
};
