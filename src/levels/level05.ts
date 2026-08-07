import type { LevelDef } from "./types";

export const LEVEL_05: LevelDef = {
  id: "level-05",
  index: 4,
  title: "Riverside Health",
  briefing: [
    "Connection established.",
    "Target: Riverside Health.",
    "The patient portal is public-facing — the real records live somewhere else.",
  ],
  entryNodeId: "riverside-public",
  successText: ["ACCESS GRANTED.", "You're in — internal ops dashboard unlocked.", "LEVEL 5 COMPLETE."],
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: {
      en: "Some doors don't need to be opened to be broken into.",
      id: "Beberapa pintu gak perlu dibuka untuk dibobol.",
    },
    cards: [
      {
        id: "l5-context",
        kind: "system",
        channel: { en: "Internal Ops — Claims Queue", id: "Ops Internal — Antrean Klaim" },
        author: { en: "Dashboard", id: "Dasbor" },
        body: [
          {
            en: "Weekly denial rate: 34%. Team average: on target.",
            id: "Tingkat penolakan klaim minggu ini: 34%. Rata-rata tim: sesuai target.",
          },
        ],
      },
      {
        id: "l5-harm",
        kind: "victim",
        channel: { en: "Patient Portal — Message Center", id: "Portal Pasien — Pusat Pesan" },
        author: { en: "Patient (Case #8834)", id: "Pasien (Kasus #8834)" },
        meta: { en: "Follow-up #2", id: "Tindak lanjut #2" },
        body: [
          {
            en: "This is the second time my approved treatment has been denied at the last step. My doctor already submitted everything. What am I supposed to do?",
            id: "Ini kedua kalinya pengobatan yang sudah disetujui ditolak di langkah terakhir. Dokter saya sudah kirim semua berkasnya. Saya harus gimana?",
          },
        ],
      },
      {
        id: "l5-brushoff",
        kind: "system",
        channel: { en: "Patient Portal — Message Center", id: "Portal Pasien — Pusat Pesan" },
        author: { en: "Claims Support (auto)", id: "Dukungan Klaim (otomatis)" },
        body: [
          {
            en: "Your case has been reviewed per standard protocol. Please resubmit with additional documentation.",
            id: "Kasus Anda telah ditinjau sesuai protokol standar. Silakan ajukan ulang dengan dokumen tambahan.",
          },
        ],
      },
      {
        id: "l5-gloat",
        kind: "perp",
        channel: { en: "Internal Ops — #claims-team", id: "Ops Internal — #claims-team" },
        author: { en: "Ops Manager", id: "Manajer Ops" },
        body: [
          {
            en: "Deny once. Most of them don't come back. That's not policy, that's math.",
            id: "Tolak sekali dulu. Kebanyakan gak balik lagi. Itu bukan kebijakan, itu matematika.",
          },
          {
            en: "Keep the denial rate where it is — bonuses are tied to it this quarter.",
            id: "Jaga tingkat penolakan tetap di situ — bonus kuartal ini dihitung dari situ.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "The quota's gone. The records were never the point.", id: "Kuotanya sudah hilang. Rekam medis memang bukan tujuannya." },
    cards: [
      {
        id: "l5-outro-untouched",
        kind: "system",
        channel: { en: "Session Log — local", id: "Log Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Patient records: untouched. That was never what this was about.",
            id: "Rekam medis pasien: tidak disentuh. Itu bukan tujuannya dari awal.",
          },
        ],
      },
      {
        id: "l5-outro-relief",
        kind: "victim",
        channel: { en: "Patient Portal — Message Center", id: "Portal Pasien — Pusat Pesan" },
        author: { en: "Patient (Case #8834)", id: "Pasien (Kasus #8834)" },
        body: [
          {
            en: "Denial reversed, no resubmission needed. First good news from this portal in months.",
            id: "Penolakan dibatalkan, tanpa perlu ajukan ulang. Kabar baik pertama dari portal ini setelah berbulan-bulan.",
          },
        ],
        answers: "l5-harm",
      },
      {
        id: "l5-outro-memo",
        kind: "public",
        channel: { en: "Internal Ops — #claims-team", id: "Ops Internal — #claims-team" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Denial quota memo and bonus structure sheet exported. All pending denials this quarter reversed.",
            id: "Memo kuota penolakan dan lembar struktur bonus telah diekspor. Semua penolakan yang tertunda kuartal ini dibatalkan.",
          },
        ],
        answers: "l5-gloat",
      },
      {
        id: "l5-outro-panic",
        kind: "perp",
        channel: { en: "Internal Ops — #claims-team", id: "Ops Internal — #claims-team" },
        author: { en: "Ops Manager", id: "Manajer Ops" },
        body: [{ en: "who exported the quota memo", id: "siapa yang ekspor memo kuota itu" }],
      },
    ],
  },
  nodes: [
    {
      id: "riverside-public",
      ip: "203.0.113.55",
      orgName: "Riverside Health — Patient Portal",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.20 | Riverside Health public patient portal" }],
      users: [],
      systemUsers: [],
      pivots: [
        {
          id: "to-internal",
          targetNodeId: "riverside-internal",
          label: "Pivot to 192.168.20.5",
          requiredFacts: ["found-internal-ip"],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "about.txt",
            kind: "file",
            content:
              "Riverside Health patient portal.\nBook appointments, view test results, message your care team.",
          },
          {
            name: "contact.txt",
            kind: "file",
            grantsFact: "read-staff-contacts",
            content:
              "Need help logging into the patient app?\n\n" +
              "IT Support — [[username:jwilson|Also used for internal systems]] / " +
              "[[email:jwilson@riversidehealth.org|IT support contact — listed on several public pages]]\n" +
              "Front Desk — reception@riversidehealth.org\n" +
              "Billing — billing@riversidehealth.org",
          },
          {
            name: "robots.txt",
            kind: "file",
            grantsFact: "found-internal-ip",
            content:
              "User-agent: *\n" +
              "Disallow: /admin\n" +
              "Disallow: /patient-portal/internal\n" +
              "# TODO: retire link to the legacy ops dashboard " +
              "([[path:192.168.20.5|Leftover internal IP, left in a public robots.txt]]) once migration finishes",
          },
        ],
      },
    },
    {
      id: "riverside-internal",
      ip: "192.168.20.5",
      orgName: "Riverside Health — Internal Ops",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | ops-dashboard (internal, staff VPN only)" }],
      users: [{ username: "jwilson", password: "Sunshine88!", role: "IT admin" }],
      systemUsers: [
        { username: "jwilson", role: "IT admin" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-public",
          targetNodeId: "riverside-public",
          label: "Pivot to 203.0.113.55",
          requiredFacts: [],
        },
      ],
      root: {
        name: "/",
        kind: "dir",
        children: [
          {
            name: "README.txt",
            kind: "file",
            content:
              "Internal ops dashboard. Authorized hospital staff only.\nContact IT if you've lost access.",
          },
        ],
      },
    },
  ],
};
