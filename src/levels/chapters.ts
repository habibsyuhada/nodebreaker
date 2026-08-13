import type { LocalizedText } from "../i18n";

export interface ChapterDef {
  id: string;
  title: LocalizedText;
  tagline: LocalizedText;
  /** 8 level ids, in the same order as their position in LEVELS — the last one is the boss. */
  levelIds: string[];
  bossLevelId: string;
}

export const CHAPTERS: ChapterDef[] = [
  {
    id: "chapter-1",
    title: { en: "Chapter 1 — Local Signal", id: "Chapter 1 — Sinyal Lokal" },
    tagline: {
      en: "Close to home: a neighbor, a landlord, a hospital, a corporate network.",
      id: "Dekat rumah: tetangga, pemilik gedung, rumah sakit, jaringan korporat.",
    },
    levelIds: [
      "level-01",
      "level-02",
      "level-03",
      "level-04",
      "level-05",
      "level-06",
      "level-07",
      "level-08",
    ],
    bossLevelId: "level-08",
  },
  {
    id: "chapter-2",
    title: { en: "Chapter 2 — Sentinel Score", id: "Chapter 2 — Sentinel Score" },
    tagline: {
      en: "A health data broker's score decides who gets covered — and who gets flagged.",
      id: "Skor milik broker data kesehatan menentukan siapa yang tercakup — dan siapa yang ditandai.",
    },
    levelIds: [
      "level-09",
      "level-10",
      "level-11",
      "level-12",
      "level-13",
      "level-14",
      "level-15",
      "level-16",
    ],
    bossLevelId: "level-16",
  },
  {
    id: "chapter-3",
    title: { en: "Chapter 3 — Civic OS", id: "Chapter 3 — Civic OS" },
    tagline: {
      en: "A smart-city contractor decides whose lights, buses, and calls get priority.",
      id: "Kontraktor kota pintar menentukan siapa yang diprioritaskan — lampu, bus, dan panggilan darurat.",
    },
    levelIds: [
      "level-17",
      "level-18",
      "level-19",
      "level-20",
      "level-21",
      "level-22",
      "level-23",
      "level-24",
    ],
    bossLevelId: "level-24",
  },
  {
    id: "chapter-4",
    title: { en: "Chapter 4 — Cap Table", id: "Chapter 4 — Cap Table" },
    tagline: {
      en: "Three networks, three names on paper — one fund behind all of them.",
      id: "Tiga jaringan, tiga nama di atas kertas — satu dana di balik semuanya.",
    },
    levelIds: [
      "level-25",
      "level-26",
      "level-27",
      "level-28",
      "level-29",
      "level-30",
      "level-31",
      "level-32",
    ],
    bossLevelId: "level-32",
  },
];

export function chapterOf(levelId: string): ChapterDef | undefined {
  return CHAPTERS.find((c) => c.levelIds.includes(levelId));
}

export function isBossLevel(levelId: string): boolean {
  return CHAPTERS.some((c) => c.bossLevelId === levelId);
}
