import type { LevelDef } from "./types";

export const LEVEL_04: LevelDef = {
  id: "level-04",
  index: 3,
  title: "Nimbus Startup",
  briefing: [
    "Connection established.",
    "Target: a startup's staging deploy box.",
    "Nothing here is guarded well, but nothing is handed to you either —",
    "decode, compare, and crack your way in.",
  ],
  entryNodeId: "nimbus-app",
  successText: ["ACCESS GRANTED.", "You're in — deploy pipeline unlocked.", "LEVEL 4 COMPLETE."],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "The NDA doesn't cover a public document.",
      id: "NDA gak berlaku buat dokumen publik.",
    },
    cards: [
      {
        id: "l4-context",
        kind: "system",
        channel: { en: "#eng-standup", id: "#eng-standup" },
        author: { en: "Platform Bot", id: "Bot Platform" },
        body: [
          {
            en: "Deploy pipeline green. Staging: nimbus-app. Next release: Friday.",
            id: "Deploy pipeline hijau. Staging: nimbus-app. Rilis berikutnya: Jumat.",
          },
        ],
      },
      {
        id: "l4-harm",
        kind: "victim",
        channel: { en: "#eng-standup", id: "#eng-standup" },
        author: { en: "Yosef (Backend)", id: "Yosef (Backend)" },
        meta: { en: "3 weeks ago", id: "3 minggu lalu" },
        body: [
          {
            en: "The analytics SDK is collecting way more than the consent screen says. I flagged this in writing twice. Can we fix the consent copy before Friday's release?",
            id: "SDK analitik ini ngumpulin data jauh lebih banyak dari yang tertulis di layar consent. Saya sudah laporkan tertulis dua kali. Bisa tolong perbaiki teks consent-nya sebelum rilis Jumat?",
          },
        ],
      },
      {
        id: "l4-brushoff",
        kind: "system",
        channel: { en: "#legal-eng", id: "#legal-eng" },
        author: { en: "Legal (auto-thread)", id: "Legal (thread otomatis)" },
        body: [
          {
            en: "Reviewed. Consent screen is defensible as written. No changes needed for Friday.",
            id: "Sudah ditinjau. Layar consent sudah bisa dipertahankan secara hukum apa adanya. Tidak perlu perubahan untuk Jumat.",
          },
        ],
      },
      {
        id: "l4-gloat",
        kind: "perp",
        channel: { en: "DM — Platform Lead to Legal", id: "DM — Platform Lead ke Legal" },
        author: { en: "Platform Lead", id: "Platform Lead" },
        body: [
          {
            en: "Legal says the consent screen is defensible. He signed an NDA on the way out. He's a line item now.",
            id: "Legal bilang layar consent-nya aman secara hukum. Dia teken NDA pas keluar. Sekarang dia cuma jadi baris di laporan.",
          },
          { en: "Ship it Friday.", id: "Rilis aja hari Jumat." },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "It's out now.", id: "Sekarang sudah tersebar." },
    cards: [
      {
        id: "l4-outro-relief",
        kind: "victim",
        channel: { en: "Personal blog — unlisted, now public", id: "Blog pribadi — tak terdaftar, kini publik" },
        author: { en: "Yosef (Backend)", id: "Yosef (Backend)" },
        body: [
          {
            en: "I can finally say this without breaking anything: I was right, and now everyone can see the config that proves it.",
            id: "Akhirnya saya bisa ngomong ini tanpa melanggar apa pun: saya benar, dan sekarang semua orang bisa lihat konfigurasi yang membuktikannya.",
          },
        ],
        answers: "l4-harm",
      },
      {
        id: "l4-outro-press",
        kind: "public",
        channel: { en: "Tech Press — Breaking", id: "Media Teknologi — Berita Terbaru" },
        author: { en: "@dataleaks_daily", id: "@dataleaks_daily" },
        body: [
          {
            en: "Leaked config + suppressed internal memo show Nimbus SDK over-collecting far beyond its consent screen.",
            id: "Konfigurasi bocor + memo internal yang dibungkam menunjukkan SDK Nimbus mengumpulkan data jauh melebihi layar consent-nya.",
          },
        ],
        answers: "l4-gloat",
      },
      {
        id: "l4-outro-panic",
        kind: "perp",
        channel: { en: "DM — Platform Lead to Legal", id: "DM — Platform Lead ke Legal" },
        author: { en: "Platform Lead", id: "Platform Lead" },
        body: [
          {
            en: "how is this out, he signed the NDA",
            id: "kok ini bisa bocor, dia kan udah teken NDA",
          },
        ],
      },
    ],
  },
  nodes: [
    {
      id: "nimbus-app",
      ip: "203.0.113.201",
      orgName: "Nimbus Systems",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.2 | nimbus-app (staging)" }],
      users: [{ username: "deploy-bot", password: "Aut0Deploy#9", role: "deployment service account" }],
      systemUsers: [
        { username: "deploy-bot", role: "service account" },
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
                name: "deploy.py",
                kind: "file",
                grantsFact: "read-deploy-script",
                content:
                  "# main deploy script — don't touch without asking platform team\n" +
                  "# legacy service login moved here during the migration\n" +
                  "# b64: [[encoded:ZGVwbG95LWJvdA==|Base64 comment left in by a careless dev]]\n" +
                  "import subprocess\n\n" +
                  'def deploy():\n    subprocess.run(["./push.sh"])\n',
              },
            ],
          },
          {
            name: "etc",
            kind: "dir",
            children: [
              {
                name: "config.old.yml",
                kind: "file",
                grantsFact: "read-config-old",
                content:
                  "service: nimbus-app\n" +
                  "username: deploy-bot\n" +
                  "password_hash: [[hash:5f4dcc3b5aa765d61d8327deb882cf99|Old hash — superseded]]\n" +
                  "updated: 2023-11-02",
              },
              {
                name: "config.new.yml",
                kind: "file",
                grantsFact: "read-config-new",
                content:
                  "service: nimbus-app\n" +
                  "username: deploy-bot\n" +
                  "password_hash: [[hash:9f86d081884c7d659a2feaa0c55ad015|New hash after last rotation]]\n" +
                  "updated: 2024-06-18",
              },
            ],
          },
          {
            name: "README.txt",
            kind: "file",
            content:
              "Nimbus Systems staging deploy box.\nIf access breaks, check with the platform team before touching creds.",
          },
        ],
      },
      compares: [
        {
          id: "configs",
          label: "Compare Configs",
          pathA: ["etc", "config.old.yml"],
          pathB: ["etc", "config.new.yml"],
          requiredFacts: ["read-config-old", "read-config-new"],
          grantsFact: "compared-configs",
        },
      ],
    },
  ],
};
