import type { LevelDef } from "./types";

export const LEVEL_13: LevelDef = {
  id: "level-13",
  index: 12,
  title: { en: "Alameda Regional Hospital", id: "Rumah Sakit Regional Alameda" },
  briefing: [
    { en: "Connection established.", id: "Koneksi berhasil." },
    { en: "Target: Alameda Regional Hospital.", id: "Target: Rumah Sakit Regional Alameda." },
    {
      en: "The patient portal is public-facing — the real claims system lives somewhere else.",
      id: "Portal pasien ini terbuka untuk publik — sistem klaim yang asli ada di tempat lain.",
    },
  ],
  entryNodeId: "alameda-public",
  successText: [
    { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
    { en: "You're in — internal claims dashboard unlocked.", id: "Kamu masuk — dashboard klaim internal terbuka." },
    { en: "LEVEL 13 COMPLETE.", id: "LEVEL 13 SELESAI." },
  ],
  parSeconds: 260,
  intro: {
    kicker: { en: "SIGNAL INTERCEPT", id: "SADAPAN SINYAL" },
    closer: { en: "A score isn't a diagnosis.", id: "Skor bukan diagnosis." },
    cards: [
      {
        id: "l13-context",
        kind: "system",
        channel: { en: "Internal Claims — Sentinel Feed", id: "Klaim Internal — Feed Sentinel" },
        author: { en: "Dashboard", id: "Dasbor" },
        body: [
          {
            en: "Auto-denials this week (Sentinel Score < 40): 61.",
            id: "Penolakan otomatis minggu ini (Sentinel Score < 40): 61.",
          },
        ],
      },
      {
        id: "l13-harm",
        kind: "victim",
        channel: { en: "Patient Portal — Message Center", id: "Portal Pasien — Pusat Pesan" },
        author: { en: "Patient (Case #5521)", id: "Pasien (Kasus #5521)" },
        meta: { en: "Follow-up #1", id: "Tindak lanjut #1" },
        body: [
          {
            en: "My physical therapy referral was denied — 'risk score below threshold.' Nobody examined me for this. What score? Whose?",
            id: "Rujukan fisioterapi saya ditolak — 'skor risiko di bawah ambang.' Gak ada yang periksa saya buat ini. Skor apa? Dari siapa?",
          },
        ],
      },
      {
        id: "l13-brushoff",
        kind: "system",
        channel: { en: "Patient Portal — Message Center", id: "Portal Pasien — Pusat Pesan" },
        author: { en: "Claims Support (auto)", id: "Dukungan Klaim (otomatis)" },
        body: [
          {
            en: "Your case has been reviewed per Sentinel Score protocol. Please resubmit with additional documentation.",
            id: "Kasus Anda telah ditinjau sesuai protokol Sentinel Score. Silakan ajukan ulang dengan dokumen tambahan.",
          },
        ],
      },
      {
        id: "l13-gloat",
        kind: "perp",
        channel: { en: "Internal Ops — #claims-integration", id: "Ops Internal — #claims-integration" },
        author: { en: "Claims Integration Lead", id: "Kepala Integrasi Klaim" },
        body: [
          {
            en: "Score comes straight from Meridian's feed — zip code weighted in now. We just apply the cutoff. Not our model, not our problem.",
            id: "Skornya langsung dari feed Meridian — kode pos sekarang ikut dihitung. Kita cuma terapkan ambangnya. Bukan model kita, bukan urusan kita.",
          },
        ],
      },
      {
        id: "l13-plan",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Public portal won't have logins — but it'll leak something pointing at the real system.",
            id: "Portal publik gak bakal punya login — tapi pasti ada yang bocor nunjuk ke sistem aslinya.",
          },
        ],
      },
    ],
  },
  outro: {
    kicker: { en: "FALLOUT", id: "DAMPAK" },
    closer: { en: "61 referrals just got a second look.", id: "61 rujukan baru saja ditinjau ulang." },
    cards: [
      {
        id: "l13-outro-action",
        kind: "player",
        channel: { en: "Session Notes — local", id: "Catatan Sesi — lokal" },
        author: { en: "You", id: "Kamu" },
        body: [
          {
            en: "Reused email/password combo. Straight into internal claims — grabbed the integration memo and reversed this week's auto-denials.",
            id: "Kombinasi email/password yang dipakai ulang. Langsung masuk ke klaim internal — ambil memo integrasi dan batalkan penolakan otomatis minggu ini.",
          },
        ],
        answers: "l13-plan",
      },
      {
        id: "l13-outro-relief",
        kind: "victim",
        channel: { en: "Patient Portal — Message Center", id: "Portal Pasien — Pusat Pesan" },
        author: { en: "Patient (Case #5521)", id: "Pasien (Kasus #5521)" },
        body: [
          {
            en: "Referral approved, no resubmission needed. Still don't know what a 'Sentinel Score' is, and I'd rather not find out the hard way again.",
            id: "Rujukan disetujui, tanpa perlu ajukan ulang. Masih gak tahu 'Sentinel Score' itu apa, dan lebih baik gak usah tahu lagi dengan cara yang sulit.",
          },
        ],
        answers: "l13-harm",
      },
      {
        id: "l13-outro-memo",
        kind: "public",
        channel: { en: "Internal Ops — #claims-integration", id: "Ops Internal — #claims-integration" },
        author: { en: "System", id: "Sistem" },
        body: [
          {
            en: "Sentinel Score integration memo exported. All auto-denials this week reversed pending manual review.",
            id: "Memo integrasi Sentinel Score diekspor. Semua penolakan otomatis minggu ini dibatalkan menunggu tinjauan manual.",
          },
        ],
        answers: "l13-gloat",
      },
      {
        id: "l13-outro-panic",
        kind: "perp",
        channel: { en: "Internal Ops — #claims-integration", id: "Ops Internal — #claims-integration" },
        author: { en: "Claims Integration Lead", id: "Kepala Integrasi Klaim" },
        body: [{ en: "who exported the integration memo", id: "siapa yang ekspor memo integrasi itu" }],
      },
    ],
  },
  nodes: [
    {
      id: "alameda-public",
      ip: "203.0.113.66",
      orgName: "Alameda Regional Hospital — Patient Portal",
      traceEnabled: false,
      ports: [{ port: 443, service: "https", banner: "nginx 1.21 | Alameda Regional patient portal" }],
      users: [],
      systemUsers: [],
      pivots: [
        {
          id: "to-internal",
          targetNodeId: "alameda-internal",
          label: { en: "Pivot to 192.168.30.9", id: "Pivot ke 192.168.30.9" },
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
            content: {
              en: "Alameda Regional Hospital patient portal.\nBook appointments, view referrals, message your care team.",
              id: "Portal pasien Rumah Sakit Regional Alameda.\nBuat janji temu, lihat rujukan, kirim pesan ke tim perawatanmu.",
            },
          },
          {
            name: "contact.txt",
            kind: "file",
            grantsFact: "read-staff-contacts",
            content: {
              en:
                "Need help with the patient app?\n\n" +
                "IT Support — [[username:tokafor|Also used for internal systems]] / " +
                "[[email:tokafor@alamedaregional.org|IT support contact — listed on several public pages]]\n" +
                "Front Desk — frontdesk@alamedaregional.org",
              id:
                "Butuh bantuan dengan aplikasi pasien?\n\n" +
                "IT Support — [[username:tokafor|Juga dipakai untuk sistem internal]] / " +
                "[[email:tokafor@alamedaregional.org|Kontak dukungan IT — tercantum di beberapa halaman publik]]\n" +
                "Front Desk — frontdesk@alamedaregional.org",
            },
          },
          {
            name: "robots.txt",
            kind: "file",
            grantsFact: "found-internal-ip",
            content: {
              en:
                "User-agent: *\n" +
                "Disallow: /admin\n" +
                "Disallow: /claims/internal\n" +
                "# TODO: retire link to the legacy claims dashboard " +
                "([[path:192.168.30.9|Leftover internal IP, left in a public robots.txt]]) once migration finishes",
              id:
                "User-agent: *\n" +
                "Disallow: /admin\n" +
                "Disallow: /claims/internal\n" +
                "# TODO: hapus link ke dashboard klaim lama " +
                "([[path:192.168.30.9|IP internal yang ketinggalan, ada di robots.txt publik]]) setelah migrasi selesai",
            },
          },
        ],
      },
    },
    {
      id: "alameda-internal",
      ip: "192.168.30.9",
      orgName: "Alameda Regional Hospital — Internal Claims",
      traceEnabled: true,
      ports: [{ port: 22, service: "ssh", banner: "OpenSSH 8.4 | claims-dashboard (internal, staff VPN only)" }],
      users: [{ username: "tokafor", password: "Riverbank77!", role: "IT admin" }],
      systemUsers: [
        { username: "tokafor", role: "IT admin" },
        { username: "root", role: "admin" },
      ],
      pivots: [
        {
          id: "to-public",
          targetNodeId: "alameda-public",
          label: { en: "Pivot to 203.0.113.66", id: "Pivot ke 203.0.113.66" },
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
            content: {
              en: "Internal claims dashboard. Authorized hospital staff only.\nContact IT if you've lost access.",
              id: "Dashboard klaim internal. Hanya untuk staf rumah sakit yang berwenang.\nHubungi IT kalau kamu kehilangan akses.",
            },
          },
        ],
      },
    },
  ],
};
