import type { LevelDef } from "./types";

export const LEVEL_14: LevelDef = {
  id: "level-14",
  index: 13,
  title: { en: "Coastal Life & Health", id: "Coastal Life & Health" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: a regional health insurer's ops server.", id: "Target: server operasional asuransi kesehatan regional." },
    {
      en: "Something here looks too easy to grab. Look before you touch anything.",
      id: "Ada sesuatu di sini yang kelihatannya terlalu gampang buat diambil. Lihat dulu sebelum kamu sentuh apa pun.",
    },
  ],
  entryNodeId: "coastal-srv",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — underwriting console unlocked.", id: "Kamu masuk — konsol underwriting terbuka." },
    { en: "LEVEL 14 COMPLETE.", id: "LEVEL 14 SELESAI." },
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
        id: "l14-context",
        kind: "system",
        channel: { en: "#underwriting", id: "#underwriting" },
        author: { en: "Sentinel Feed Bot", id: "Bot Feed Sentinel" },
        body: [
          { en: "Q2 denial quota: on track. Bonus pool: unaffected.", id: "Kuota penolakan Q2: sesuai target. Kolam bonus: tidak terganggu." },
        ],
      },
      {
        id: "l14-harm",
        kind: "victim",
        channel: { en: "#underwriting", id: "#underwriting" },
        author: { en: "Deborah (Policyholder #6612)", id: "Deborah (Pemegang Polis #6612)" },
        meta: { en: "Appeal #2", id: "Banding #2" },
        body: [
          {
            en: "My coverage renewal was denied over a 'Sentinel Score' that dropped after I moved zip codes. Same job, same income, same everything else.",
            id: "Perpanjangan cakupan saya ditolak karena 'Sentinel Score' yang turun setelah saya pindah kode pos. Pekerjaan sama, penghasilan sama, semuanya sama.",
          },
        ],
      },
      {
        id: "l14-brushoff",
        kind: "system",
        channel: { en: "#underwriting", id: "#underwriting" },
        author: { en: "Underwriting (auto-reply)", id: "Underwriting (balasan otomatis)" },
        body: [
          {
            en: "The score is a proprietary risk model output. Appeals require documentation the model does not use.",
            id: "Skornya adalah keluaran model risiko milik perusahaan. Banding memerlukan dokumen yang tidak dipakai model.",
          },
        ],
      },
      {
        id: "l14-gloat",
        kind: "perp",
        channel: { en: "#underwriting-leads (private)", id: "#underwriting-leads (privat)" },
        author: { en: "Underwriting Director", id: "Direktur Underwriting" },
        body: [
          {
            en: "We put a folder out there labeled 'quota review.' Anything that opens it, we know exactly who's been asking questions.",
            id: "Kita taruh folder umpan berlabel 'tinjauan kuota.' Apa pun yang buka folder itu, kita langsung tahu siapa yang mulai banyak nanya.",
          },
          {
            en: "Deborah's appeal is already denied. Nobody's cross-referencing zip codes against the old model.",
            id: "Banding Deborah udah ditolak. Gak bakal ada yang cocokkan kode pos sama model lama.",
          },
        ],
      },
      {
        id: "l14-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Handoff note's got a login. Get in quiet, find the quota memo — and stay clear of whatever that folder trap is.",
            id: "Catatan handoff ada login. Masuk diam-diam, cari memo kuota — dan hindari apa pun jebakan folder itu.",
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
        id: "l14-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Restored Deborah's appeal and mailed the quota memo to the whole policyholder roster — the honeypot's watcher list came along as proof.",
            id: "Pulihkan banding Deborah dan kirim memo kuota ke semua pemegang polis — daftar pengawas honeypot ikut terbawa sebagai bukti.",
          },
        ],
        answers: "l14-plan",
      },
      {
        id: "l14-outro-relief",
        kind: "victim",
        channel: { en: "#underwriting", id: "#underwriting" },
        author: { en: "Deborah (Policyholder #6612)", id: "Deborah (Pemegang Polis #6612)" },
        body: [
          {
            en: "Appeal approved, coverage renewed. Still don't know why the zip code mattered in the first place.",
            id: "Banding disetujui, cakupan diperpanjang. Masih gak ngerti kenapa kode pos itu bisa berpengaruh dari awal.",
          },
        ],
        answers: "l14-harm",
      },
      {
        id: "l14-outro-mailed",
        kind: "public",
        channel: { en: "#underwriting — all-policyholders", id: "#underwriting — semua-pemegang-polis" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Q2 denial quota memo mailed to every policyholder on the appeal list. Honeypot watcher list attached as proof of intent.",
            id: "Memo kuota penolakan Q2 dikirim ke semua pemegang polis di daftar banding. Daftar pengawas honeypot dilampirkan sebagai bukti niat.",
          },
        ],
        answers: "l14-gloat",
      },
      {
        id: "l14-outro-panic",
        kind: "perp",
        channel: { en: "#underwriting-leads (private)", id: "#underwriting-leads (privat)" },
        author: { en: "Underwriting Director", id: "Direktur Underwriting" },
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
      id: "coastal-srv",
      ip: "203.0.113.91",
      orgName: "Coastal Life & Health Insurance",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.9 | coastal-underwriting-srv" }],
      users: [{ username: "rortiz", password: "Underwrt3r!", role: "underwriting" }],
      systemUsers: [
        { username: "rortiz", role: "underwriting" },
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
              en: "Coastal Life & Health underwriting server. Contact IT before changing anything.",
              id: "Server underwriting Coastal Life & Health. Hubungi IT sebelum mengubah apa pun.",
            },
          },
          {
            name: "quota_review",
            kind: "dir",
            metadata: [
              { label: { en: "owner", id: "pemilik" }, value: { en: "underwriting-leads", id: "underwriting-leads" } },
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
                {
                  en: "[alert] intrusion sensor tripped in /quota_review",
                  id: "[alert] sensor intrusi terpicu di /quota_review",
                },
                {
                  en: "[alert] directory access logged and escalated to underwriting-leads",
                  id: "[alert] akses direktori tercatat dan dieskalasi ke underwriting-leads",
                },
              ],
            },
            children: [
              {
                name: "notes.txt",
                kind: "file",
                content: {
                  en: "Backup admin access — [[password:Quota2024!|Found in the quota review folder]]",
                  id: "Akses admin backup — [[password:Quota2024!|Ditemukan di folder tinjauan kuota]]",
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
                        '  File "sync.py", line 61, in <module>\n' +
                        "    raise IOError(\"cannot resolve fallback path\")\n" +
                        "IOError: fallback dir missing: " +
                        "[[path:/mnt/archive/appeals_2024|Real data path, leaked in an app error stack trace]]",
                      id:
                        "Traceback (most recent call last):\n" +
                        '  File "sync.py", line 61, in <module>\n' +
                        "    raise IOError(\"cannot resolve fallback path\")\n" +
                        "IOError: fallback dir missing: " +
                        "[[path:/mnt/archive/appeals_2024|Path data asli, bocor lewat stack trace error aplikasi]]",
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
                    name: "appeals_2024",
                    kind: "dir",
                    children: [
                      {
                        name: "ops_handoff.txt",
                        kind: "file",
                        grantsFact: "read-handoff",
                        content: {
                          en:
                            "Ops handoff — shift notes.\n\n" +
                            "If the appeals sync fails again, log in manually:\n" +
                            "[[username:rortiz|Underwriting account, mentioned in handoff notes]] / " +
                            "[[password:Underwrt3r!|Temporary password, meant to be rotated but wasn't]]",
                          id:
                            "Handoff ops — catatan shift.\n\n" +
                            "Kalau sync banding gagal lagi, login manual aja:\n" +
                            "[[username:rortiz|Akun underwriting, disebut di catatan handoff]] / " +
                            "[[password:Underwrt3r!|Password sementara, harusnya diganti tapi gak pernah]]",
                        },
                      },
                      {
                        name: "quota_memo.txt",
                        kind: "file",
                        grantsFact: "read-quota-memo",
                        content: {
                          en:
                            "Q2 denial quota memo — internal.\n\n" +
                            "Team bonuses scale with denial rate. Sentinel Score cutoff set to hit quota, " +
                            "not clinical accuracy. Zip code weighting confirmed as primary driver.",
                          id:
                            "Memo kuota penolakan Q2 — internal.\n\n" +
                            "Bonus tim skalanya ikut tingkat penolakan. Ambang Sentinel Score diatur untuk " +
                            "capai kuota, bukan akurasi klinis. Pembobotan kode pos dikonfirmasi jadi faktor utama.",
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
