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
];

export function chapterOf(levelId: string): ChapterDef | undefined {
  return CHAPTERS.find((c) => c.levelIds.includes(levelId));
}

export function isBossLevel(levelId: string): boolean {
  return CHAPTERS.some((c) => c.bossLevelId === levelId);
}
