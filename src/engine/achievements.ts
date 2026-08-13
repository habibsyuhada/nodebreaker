import type { LocalizedText } from "../i18n";
import { LEVELS } from "../levels";
import type { Rank, RunResult } from "./runMetrics";

/**
 * Everything an achievement's condition can read. Deliberately a narrow, standalone shape
 * (not `ProfileState` itself) so this file never has to import from `store/gameStore.ts` — that
 * module already imports `ACHIEVEMENTS`/`evaluateAchievements` from here, and a two-way import
 * would be circular.
 */
export interface AchievementContext {
  counters: Record<string, number>;
  completedLevels: Record<string, true>;
  bestRuns: Record<string, RunResult>;
  daily: { streak: number; longest: number };
}

export interface AchievementDef {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  isEarned: (ctx: AchievementContext) => boolean;
  /** Theme.id (src/engine/theme.ts) unlocked the first time this achievement is earned. */
  rewardThemeId?: string;
}

function counter(ctx: AchievementContext, key: string): number {
  return ctx.counters[key] ?? 0;
}

function ranksOf(ctx: AchievementContext): Rank[] {
  return LEVELS.map((l) => ctx.bestRuns[l.id]?.rank).filter((r): r is Rank => r !== undefined);
}

/**
 * ~20-24 local achievements, grouped by what they reward: campaign progression, run quality,
 * tradecraft (repeated use of a specific action), risk-taking gone wrong, and the Daily Contract.
 * Every condition reads only from `AchievementContext` — never from React state or the live
 * store — so `evaluateAchievements` stays a pure function callable from `bumpCounter` and
 * `markLevelComplete` alike.
 */
export const ACHIEVEMENTS: AchievementDef[] = [
  // Campaign progression
  {
    id: "first-breach",
    name: { en: "First Breach", id: "Bobol Pertama" },
    description: { en: "Complete your first target.", id: "Selesaikan target pertamamu." },
    isEarned: (ctx) => Object.keys(ctx.completedLevels).length >= 1,
  },
  {
    id: "campaign-complete",
    name: { en: "Full Clear", id: "Bersih Total" },
    description: { en: "Complete all 32 campaign levels.", id: "Selesaikan semua 32 level kampanye." },
    isEarned: (ctx) => LEVELS.every((l) => ctx.completedLevels[l.id]),
  },
  {
    id: "first-ghost",
    name: { en: "Ghost Protocol", id: "Protokol Hantu" },
    description: { en: "Earn a GHOST rank on any level.", id: "Raih rank GHOST di level mana pun." },
    isEarned: (ctx) => ranksOf(ctx).includes("GHOST"),
  },
  {
    id: "ghost-sweep",
    name: { en: "Never There", id: "Tak Pernah Ada" },
    description: {
      en: "Earn a GHOST rank on every campaign level.",
      id: "Raih rank GHOST di semua level kampanye.",
    },
    isEarned: (ctx) => LEVELS.every((l) => ctx.bestRuns[l.id]?.rank === "GHOST"),
    rewardThemeId: "ch4-analyst",
  },
  {
    id: "speedrunner",
    name: { en: "Speedrunner", id: "Pelari Cepat" },
    description: {
      en: "Finish a level faster than its par time.",
      id: "Selesaikan level lebih cepat dari waktu parnya.",
    },
    isEarned: (ctx) =>
      LEVELS.some((l) => {
        const best = ctx.bestRuns[l.id];
        return best !== undefined && best.elapsedMs / 1000 < (l.parSeconds ?? 240);
      }),
  },
  {
    id: "untouchable",
    name: { en: "Untouchable", id: "Tak Tersentuh" },
    description: {
      en: "Complete a level without ever raising trace.",
      id: "Selesaikan level tanpa pernah menaikkan trace.",
    },
    isEarned: (ctx) => Object.values(ctx.bestRuns).some((r) => r.peakTrace === 0),
  },

  // Tradecraft — repeated use of a specific action, lifetime across every run
  {
    id: "scanner",
    name: { en: "Scanner", id: "Pemindai" },
    description: { en: "Run Scan Ports 25 times.", id: "Jalankan Scan Port 25 kali." },
    isEarned: (ctx) => counter(ctx, "scans") >= 25,
  },
  {
    id: "locksmith",
    name: { en: "Locksmith", id: "Tukang Kunci" },
    description: { en: "Crack 5 password hashes.", id: "Bongkar 5 hash password." },
    isEarned: (ctx) => counter(ctx, "hashesCracked") >= 5,
    rewardThemeId: "ch1-analyst",
  },
  {
    id: "codebreaker",
    name: { en: "Codebreaker", id: "Pemecah Kode" },
    description: { en: "Decode 10 encoded clues.", id: "Decode 10 petunjuk terenkode." },
    isEarned: (ctx) => counter(ctx, "decodes") >= 10,
    rewardThemeId: "ch3-analyst",
  },
  {
    id: "leak-hunter",
    name: { en: "Leak Hunter", id: "Pemburu Leak" },
    description: { en: "Find 5 passwords via a leak database.", id: "Temukan 5 password lewat leak database." },
    isEarned: (ctx) => counter(ctx, "leakHits") >= 5,
  },
  {
    id: "combiner",
    name: { en: "Combiner", id: "Penggabung" },
    description: { en: "Successfully combine 15 clue pairs.", id: "Berhasil gabungkan 15 pasang petunjuk." },
    isEarned: (ctx) => counter(ctx, "combines") >= 15,
  },
  {
    id: "archivist",
    name: { en: "Archivist", id: "Arsiparis" },
    description: { en: "Save 100 clues, lifetime.", id: "Simpan 100 petunjuk, seumur hidup." },
    isEarned: (ctx) => counter(ctx, "cluesSaved") >= 100,
  },
  {
    id: "cleaner",
    name: { en: "Cleaner", id: "Pembersih" },
    description: { en: "Delete or falsify logs 10 times.", id: "Hapus atau palsukan log 10 kali." },
    isEarned: (ctx) => counter(ctx, "logsCleared") >= 10,
  },
  {
    id: "ghost-in-the-wire",
    name: { en: "Ghost in the Wire", id: "Hantu di Kabel" },
    description: { en: "Go quiet (Hide) 10 times.", id: "Bersembunyi (Hide) 10 kali." },
    isEarned: (ctx) => counter(ctx, "wentQuiet") >= 10,
  },
  {
    id: "cartographer",
    name: { en: "Cartographer", id: "Kartografer" },
    description: { en: "Open the Network Map 20 times.", id: "Buka Peta Jaringan 20 kali." },
    isEarned: (ctx) => counter(ctx, "networkMapOpens") >= 20,
  },
  {
    id: "pivot-master",
    name: { en: "Pivot Master", id: "Ahli Pivot" },
    description: { en: "Pivot to another node 10 times.", id: "Pivot ke node lain 10 kali." },
    isEarned: (ctx) => counter(ctx, "pivots") >= 10,
  },
  {
    id: "privilege-climber",
    name: { en: "Privilege Climber", id: "Pemanjat Akses" },
    description: { en: "Escalate privilege 10 times.", id: "Naikkan hak akses 10 kali." },
    isEarned: (ctx) => counter(ctx, "escalations") >= 10,
  },
  {
    id: "backdoor-dealer",
    name: { en: "Backdoor Dealer", id: "Penjual Backdoor" },
    description: { en: "Plant 10 backdoors.", id: "Pasang 10 backdoor." },
    isEarned: (ctx) => counter(ctx, "backdoorsPlanted") >= 10,
  },

  // Risk gone wrong — the counters that go up when things go loud, not quiet
  {
    id: "burned-once",
    name: { en: "Burned", id: "Terbakar" },
    description: { en: "Get caught — a node goes burned.", id: "Tertangkap — sebuah node terbakar." },
    isEarned: (ctx) => counter(ctx, "burns") >= 1,
  },
  {
    id: "brute-forcer",
    name: { en: "Brute Forcer", id: "Pemaksa Kasar" },
    description: { en: "Rack up 20 failed logins, lifetime.", id: "Kumpulkan 20 login gagal, seumur hidup." },
    isEarned: (ctx) => counter(ctx, "failedLogins") >= 20,
  },
  {
    id: "honeypot-magnet",
    name: { en: "Honeypot Magnet", id: "Magnet Honeypot" },
    description: { en: "Trip 5 honeypots, lifetime.", id: "Kena 5 honeypot, seumur hidup." },
    isEarned: (ctx) => counter(ctx, "honeypotsTotal") >= 5,
  },

  // Daily Contract
  {
    id: "contractor",
    name: { en: "Contractor", id: "Kontraktor" },
    description: { en: "Complete your first Daily Contract.", id: "Selesaikan Kontrak Harian pertamamu." },
    isEarned: (ctx) => ctx.daily.longest >= 1,
  },
  {
    id: "week-streak",
    name: { en: "One Week In", id: "Satu Minggu Berjalan" },
    description: { en: "Reach a 7-day Daily Contract streak.", id: "Raih rentetan Kontrak Harian 7 hari." },
    isEarned: (ctx) => ctx.daily.longest >= 7,
    rewardThemeId: "ch2-analyst",
  },
  {
    id: "dedicated",
    name: { en: "Dedicated", id: "Berdedikasi" },
    description: { en: "Reach a 30-day Daily Contract streak.", id: "Raih rentetan Kontrak Harian 30 hari." },
    isEarned: (ctx) => ctx.daily.longest >= 30,
  },
];

/** Every achievement id in `ctx` newly earned that isn't already in `unlocked`. */
export function newlyEarned(ctx: AchievementContext, unlocked: Record<string, number>): AchievementDef[] {
  return ACHIEVEMENTS.filter((a) => !unlocked[a.id] && a.isEarned(ctx));
}
