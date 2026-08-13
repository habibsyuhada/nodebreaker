import type { SpritePalette } from "../art/spriteEngine";
import type { LocalizedText } from "../i18n";

export interface ThemeColorTokens {
  bg: string;
  panel: string;
  panelAlt: string;
  border: string;
  text: string;
  textBright: string;
  textDim: string;
  accent: string;
  accentDim: string;
  warn: string;
  warnDim: string;
}

export interface Theme {
  id: string;
  name: LocalizedText;
  /** Shown in the Themes gallery while locked — how to unlock it. */
  hint: LocalizedText;
  colors: ThemeColorTokens;
}

export const BASE_THEME_ID = "phosphor-green";

/**
 * One entry per unlockable skin. Ids referenced elsewhere: `LevelDef.completionRewardThemeId`,
 * `BossRewardThemes.second`/`.third`, `AchievementDef.rewardThemeId`. Every id used by those
 * fields must exist here — there's no runtime fallback beyond `getThemeById` defaulting to the
 * base theme, which would silently mask a typo.
 */
export const THEMES: Theme[] = [
  {
    id: BASE_THEME_ID,
    name: { en: "Phosphor Green", id: "Hijau Fosfor" },
    hint: { en: "Default — yours from the start.", id: "Bawaan — sudah kamu miliki sejak awal." },
    colors: {
      bg: "#0a0c10",
      panel: "#0e1319",
      panelAlt: "#131a22",
      border: "#1e2830",
      text: "#a9c4b8",
      textBright: "#e3fbee",
      textDim: "#5c7568",
      accent: "#35e0a1",
      accentDim: "#17402f",
      warn: "#ff6b4a",
      warnDim: "#4a241a",
    },
  },
  {
    id: "daylight-terminal",
    name: { en: "Daylight Terminal", id: "Terminal Siang" },
    hint: { en: "Unlock: complete Level 1.", id: "Unlock: selesaikan Level 1." },
    colors: {
      bg: "#eef2ee",
      panel: "#e2e8e2",
      panelAlt: "#d5ddd5",
      border: "#b7c3b7",
      text: "#3a4a3f",
      textBright: "#0f1a13",
      textDim: "#5c6b60",
      accent: "#0e8f5c",
      accentDim: "#bfe6d2",
      warn: "#c23f22",
      warnDim: "#f3d3c4",
    },
  },
  // Chapter 1 — Halcyon Dynamics ("Ledger" family, amber/gold)
  {
    id: "ch1-ghost",
    name: { en: "Quiet Ledger", id: "Buku Sunyi" },
    hint: {
      en: "Unlock: Chapter 1 Boss — clear a 2nd distinct path.",
      id: "Unlock: Boss Chapter 1 — tuntaskan jalur berbeda ke-2.",
    },
    colors: {
      bg: "#0f0d09",
      panel: "#14100c",
      panelAlt: "#1b160f",
      border: "#2c2317",
      text: "#c4b394",
      textBright: "#fbe9c8",
      textDim: "#75664a",
      accent: "#e0b23a",
      accentDim: "#4a3712",
      warn: "#e0673a",
      warnDim: "#4a2012",
    },
  },
  {
    id: "ch1-breach",
    name: { en: "Loud Ledger", id: "Buku Berisik" },
    hint: {
      en: "Unlock: Chapter 1 Boss — clear a 3rd distinct path.",
      id: "Unlock: Boss Chapter 1 — tuntaskan jalur berbeda ke-3.",
    },
    colors: {
      bg: "#100b06",
      panel: "#16100a",
      panelAlt: "#1f160d",
      border: "#332413",
      text: "#d1b083",
      textBright: "#ffe9b8",
      textDim: "#7d6440",
      accent: "#ffb020",
      accentDim: "#4d3305",
      warn: "#ff4d2e",
      warnDim: "#4d1a0d",
    },
  },
  {
    id: "ch1-analyst",
    name: { en: "Rounding Error", id: "Selisih Pembulatan" },
    hint: {
      en: "Unlock: achievement — Ghost Protocol.",
      id: "Unlock: achievement — Protokol Hantu.",
    },
    colors: {
      bg: "#0e0b08",
      panel: "#130f0b",
      panelAlt: "#1a140e",
      border: "#2b2115",
      text: "#bfa384",
      textBright: "#f2dcb8",
      textDim: "#6e5a3f",
      accent: "#d98a3d",
      accentDim: "#402511",
      warn: "#d94f3d",
      warnDim: "#401b12",
    },
  },
  // Chapter 2 — Meridian Health Analytics ("Frostline" family, cyan/ice)
  {
    id: "ch2-ghost",
    name: { en: "Cold Signal", id: "Sinyal Dingin" },
    hint: {
      en: "Unlock: Chapter 2 Boss — clear a 2nd distinct path.",
      id: "Unlock: Boss Chapter 2 — tuntaskan jalur berbeda ke-2.",
    },
    colors: {
      bg: "#070d10",
      panel: "#0a1216",
      panelAlt: "#0e1a20",
      border: "#163037",
      text: "#9dc0c8",
      textBright: "#d8fbff",
      textDim: "#567478",
      accent: "#33d4e0",
      accentDim: "#123f45",
      warn: "#ff6b5a",
      warnDim: "#4a2018",
    },
  },
  {
    id: "ch2-breach",
    name: { en: "Shattered Ice", id: "Es Retak" },
    hint: {
      en: "Unlock: Chapter 2 Boss — clear a 3rd distinct path.",
      id: "Unlock: Boss Chapter 2 — tuntaskan jalur berbeda ke-3.",
    },
    colors: {
      bg: "#06090c",
      panel: "#0a1014",
      panelAlt: "#0e161c",
      border: "#17323b",
      text: "#a9d6de",
      textBright: "#e6fdff",
      textDim: "#5c8085",
      accent: "#2ee6ff",
      accentDim: "#0d454f",
      warn: "#ff5540",
      warnDim: "#4a1a10",
    },
  },
  {
    id: "ch2-analyst",
    name: { en: "Deep Current", id: "Arus Dalam" },
    hint: { en: "Unlock: achievement — One Week In.", id: "Unlock: achievement — Satu Minggu Berjalan." },
    colors: {
      bg: "#070a0d",
      panel: "#0b1116",
      panelAlt: "#10191f",
      border: "#1a333b",
      text: "#92b8c2",
      textBright: "#d1f2fb",
      textDim: "#4f6d75",
      accent: "#3aa0e0",
      accentDim: "#163f52",
      warn: "#e0553a",
      warnDim: "#431c12",
    },
  },
  // Chapter 3 — Ferrovia Systems ("Afterimage" family, magenta/violet)
  {
    id: "ch3-ghost",
    name: { en: "Static Bloom", id: "Mekar Statis" },
    hint: {
      en: "Unlock: Chapter 3 Boss — clear a 2nd distinct path.",
      id: "Unlock: Boss Chapter 3 — tuntaskan jalur berbeda ke-2.",
    },
    colors: {
      bg: "#0c0910",
      panel: "#100d16",
      panelAlt: "#16111f",
      border: "#2a1e37",
      text: "#bfa3c8",
      textBright: "#f2ddff",
      textDim: "#6c5675",
      accent: "#b35de0",
      accentDim: "#3a1a4a",
      warn: "#e0466f",
      warnDim: "#421622",
    },
  },
  {
    id: "ch3-breach",
    name: { en: "Feedback Loop", id: "Lingkar Umpan Balik" },
    hint: {
      en: "Unlock: Chapter 3 Boss — clear a 3rd distinct path.",
      id: "Unlock: Boss Chapter 3 — tuntaskan jalur berbeda ke-3.",
    },
    colors: {
      bg: "#0d0812",
      panel: "#120c19",
      panelAlt: "#191024",
      border: "#33203f",
      text: "#cf9de0",
      textBright: "#f7dcff",
      textDim: "#7a5285",
      accent: "#d43ee0",
      accentDim: "#421a49",
      warn: "#ff3d5e",
      warnDim: "#47131e",
    },
  },
  {
    id: "ch3-analyst",
    name: { en: "Ultraviolet", id: "Ultraviolet" },
    hint: { en: "Unlock: achievement — Speedrunner.", id: "Unlock: achievement — Pelari Cepat." },
    colors: {
      bg: "#0a0810",
      panel: "#0e0c17",
      panelAlt: "#131022",
      border: "#271d3d",
      text: "#a894c9",
      textBright: "#e1d6ff",
      textDim: "#5c5079",
      accent: "#7c5ee0",
      accentDim: "#241a49",
      warn: "#d9427a",
      warnDim: "#3d1524",
    },
  },
  // Chapter 4 — Aurelia Capital ("Undertow" family, blue/cobalt)
  {
    id: "ch4-ghost",
    name: { en: "Slack Tide", id: "Pasang Surut" },
    hint: {
      en: "Unlock: Chapter 4 Boss — clear a 2nd distinct path.",
      id: "Unlock: Boss Chapter 4 — tuntaskan jalur berbeda ke-2.",
    },
    colors: {
      bg: "#070a10",
      panel: "#0a0f16",
      panelAlt: "#0e151f",
      border: "#1a2537",
      text: "#9bb0c9",
      textBright: "#d6e6ff",
      textDim: "#556579",
      accent: "#4a7fe0",
      accentDim: "#17264a",
      warn: "#ff6b52",
      warnDim: "#4a2018",
    },
  },
  {
    id: "ch4-breach",
    name: { en: "Riptide", id: "Arus Balik" },
    hint: {
      en: "Unlock: Chapter 4 Boss — clear a 3rd distinct path.",
      id: "Unlock: Boss Chapter 4 — tuntaskan jalur berbeda ke-3.",
    },
    colors: {
      bg: "#06080d",
      panel: "#090d14",
      panelAlt: "#0d131c",
      border: "#17253c",
      text: "#a3bcdb",
      textBright: "#ddeaff",
      textDim: "#576b8a",
      accent: "#3d6bff",
      accentDim: "#131f4d",
      warn: "#ff3d3d",
      warnDim: "#4d1414",
    },
  },
  {
    id: "ch4-analyst",
    name: { en: "Cold War", id: "Perang Dingin" },
    hint: { en: "Unlock: achievement — Never There.", id: "Unlock: achievement — Tak Pernah Ada." },
    colors: {
      bg: "#070911",
      panel: "#0a0e17",
      panelAlt: "#0e1420",
      border: "#1c2a45",
      text: "#93aad0",
      textBright: "#ccdcff",
      textDim: "#4f6182",
      accent: "#5c8fe0",
      accentDim: "#1c2c49",
      warn: "#e0574f",
      warnDim: "#401b18",
    },
  },
];

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

const CSS_VAR_MAP: Record<keyof ThemeColorTokens, string> = {
  bg: "--color-bg",
  panel: "--color-panel",
  panelAlt: "--color-panel-alt",
  border: "--color-border",
  text: "--color-text",
  textBright: "--color-text-bright",
  textDim: "--color-text-dim",
  accent: "--color-accent",
  accentDim: "--color-accent-dim",
  warn: "--color-warn",
  warnDim: "--color-warn-dim",
};

/**
 * Runtime theme switch: overrides the same CSS custom properties Tailwind v4's `@theme` block in
 * index.css declares on `:root`. An inline style on `<html>` has higher specificity, so every
 * `bg-bg`/`text-accent`/`border-warn/40`/etc. utility recolors immediately — no CSS rebuild.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement.style;
  for (const key of Object.keys(CSS_VAR_MAP) as (keyof ThemeColorTokens)[]) {
    root.setProperty(CSS_VAR_MAP[key], theme.colors[key]);
  }
}

/** Derives the sprite renderer's 5-key palette from the same 11 tokens, so canvas art and CSS chrome never drift apart. */
export function toSpritePalette(colors: ThemeColorTokens): SpritePalette {
  return { o: colors.border, f: colors.panelAlt, h: colors.textBright, a: colors.accent, w: colors.warn };
}
