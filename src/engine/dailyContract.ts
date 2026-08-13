import type { LevelDef } from "../levels/types";

/**
 * A fresh, solvable-by-construction one-node contract generated purely from a UTC-day seed —
 * never persisted as a `LevelDef` itself (only the seed string is saved), since regenerating it
 * from the same seed always reproduces the exact same level. Deliberately scoped to the one
 * mechanic that's already generic across *any* clue value rather than a specific one —
 * `combineRules.ts`'s `username-pattern-to-password` recipe matches by clue *type*, not value
 * (see PROGRESS.md's Stage 22 notes) — so a procedurally-picked username/pattern/password triple
 * needs zero engine changes to stay winnable. No decode/crack/leak/honeypot/pivot content, and no
 * intro/outro scene: those would each need either a per-level dynamic rule table or authored
 * narrative beats, neither of which a once-a-day single-node contract earns back in play value.
 */

/** Deterministic 32-bit PRNG (mulberry32) — same seed always produces the same sequence. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a — turns the "YYYY-MM-DD" seed string into a 32-bit int to feed the PRNG. */
function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

function pickInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Today's date in UTC as "YYYY-MM-DD" — the Daily Contract's seed and its persisted identity. */
export function todayUtcSeed(now: number = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** The UTC calendar day immediately before `seed` — used to tell a same-day replay from a genuine streak continuation. */
export function previousUtcDay(seed: string): string {
  const [y, m, d] = seed.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export interface DailyStreakState {
  lastCompletedSeed: string | null;
  streak: number;
  longest: number;
}

/** Pure streak transition for completing `seed` — a repeat completion of the same day is a no-op, not a fresh +1. */
export function advanceDailyStreak(current: DailyStreakState, seed: string): DailyStreakState {
  if (current.lastCompletedSeed === seed) return current;
  const streak = current.lastCompletedSeed === previousUtcDay(seed) ? current.streak + 1 : 1;
  return { lastCompletedSeed: seed, streak, longest: Math.max(current.longest, streak) };
}

const ORG_NAMES = [
  "Kedai Kopi Meridian",
  "Toko Buku Anagram",
  "Bengkel Motor Laju",
  "Klinik Hewan Purnama",
  "Studio Foto Kilas",
  "Warung Digital Nusantara",
  "Percetakan Aksara",
  "Toko Kelontong Sejahtera",
  "Salon Kecantikan Wangi",
  "Agen Perjalanan Cakrawala",
  "Toko Sepatu Merdeka",
  "Katering Rasa Ibu",
];

const OWNER_NAMES = [
  "wulan",
  "bagas",
  "nadia",
  "rizky",
  "citra",
  "dimas",
  "ayu",
  "farhan",
  "intan",
  "galih",
  "sinta",
  "reza",
];

const REASONS = [
  {
    en: "Customers have been quietly overcharged for months and nobody's owned up to it.",
    id: "Pelanggan diam-diam dikenakan biaya lebih selama berbulan-bulan dan belum ada yang mengaku.",
  },
  {
    en: "A whistleblower's tip says the admin panel logs more about visitors than it should.",
    id: "Info dari whistleblower bilang panel admin mencatat data pengunjung lebih dari seharusnya.",
  },
  {
    en: "A pattern of near-identical five-star reviews doesn't add up.",
    id: "Pola review bintang lima yang nyaris identik terasa gak wajar.",
  },
  {
    en: "Refunds keep disappearing into a queue nobody ever clears.",
    id: "Refund terus menghilang di antrean yang gak pernah diproses.",
  },
] as const;

/** Deterministically builds today's (or any given seed's) Daily Contract — pure function of `seed`, so it's never persisted, only regenerated. */
export function generateDailyContract(seed: string): LevelDef {
  const rng = mulberry32(hashSeed(seed));
  const org = pick(rng, ORG_NAMES);
  const owner = pick(rng, OWNER_NAMES);
  const year = pickInt(rng, 1990, 2016);
  const reason = pick(rng, REASONS);
  // RFC 5737 documentation range, same convention as Level 2's 203.0.113.42 — never a real routable address.
  const ip = `203.0.113.${pickInt(rng, 1, 254)}`;
  const username = owner;
  const password = `${owner}${year}`;

  return {
    id: `daily-${seed}`,
    // Never resolved through LEVELS[index] — Stage 22's LevelSource discriminates campaign vs.
    // daily levels by kind, not by this index, so -1 is just a visible "not a campaign slot" tell.
    index: -1,
    title: { en: `Daily Contract — ${seed}`, id: `Kontrak Harian — ${seed}` },
    briefing: [
      { en: "Connection established.", id: "Koneksi berhasil." },
      { en: `Target: ${org}'s admin backend.`, id: `Target: backend admin ${org}.` },
      reason,
    ],
    entryNodeId: "target",
    successText: [
      { en: "ACCESS GRANTED.", id: "AKSES DIBERIKAN." },
      { en: "Contract complete.", id: "Kontrak selesai." },
    ],
    parSeconds: 100,
    coldOpen: true,
    nodes: [
      {
        id: "target",
        ip,
        orgName: org,
        traceEnabled: false,
        ports: [{ port: 443, service: "https", banner: `nginx | ${org} admin login` }],
        users: [{ username, password, role: "owner" }],
        systemUsers: [{ username, role: "owner" }],
        root: {
          name: "/",
          kind: "dir",
          children: [
            {
              name: "about-us.txt",
              kind: "file",
              content: {
                en: `${org} has been running the same way since ${year}. Fun fact: the very first admin handle around here was literally just the owner's name and the year — [[pattern:${password}|Owner's name + founding year, an old admin handle]] — from back when nobody worried much about security.`,
                id: `${org} sudah berjalan dengan cara yang sama sejak ${year}. Fakta menarik: handle admin pertama di sini dulu cuma nama pemilik ditambah tahun berdirinya — [[pattern:${password}|Nama pemilik + tahun berdiri, handle admin lama]] — dari masa saat belum ada yang terlalu peduli soal keamanan.`,
              },
            },
            {
              name: "backup",
              kind: "dir",
              children: [
                {
                  name: "README.txt",
                  kind: "file",
                  content: {
                    en: "Nightly backups land here automatically.\nRemember to purge old admin exports once you're done with them.",
                    id: "Backup malam otomatis tersimpan di sini.\nIngat untuk menghapus ekspor admin lama setelah selesai dipakai.",
                  },
                },
                {
                  name: "users_backup.csv",
                  kind: "file",
                  content: {
                    en: `export_date,admin_user,last_login\n${seed},[[username:${username}|Backup admin username]],${seed}`,
                    id: `export_date,admin_user,last_login\n${seed},[[username:${username}|Username admin backup]],${seed}`,
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}
