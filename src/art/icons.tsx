/**
 * Hand-written blocky/pixel UI icons as inline SVG rect grids.
 * No external icon library or image assets. "." is transparent, "o" uses
 * currentColor (so it inherits button/tab text color), "a" uses the accent color.
 */
import type { ReactElement } from "react";

type IconGrid = readonly string[];

interface PixelIconProps {
  grid: IconGrid;
  size?: number;
  className?: string;
}

function PixelIcon({ grid, size = 20, className }: PixelIconProps) {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  const rects: ReactElement[] = [];

  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = row[x];
      if (key === ".") continue;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1}
          height={1}
          fill={key === "a" ? "var(--color-accent)" : "currentColor"}
        />,
      );
    }
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}

const TERMINAL_GRID: IconGrid = [
  "oooooooooo",
  "o........o",
  "o.a......o",
  "o..a.....o",
  "o.a......o",
  "o..aaa...o",
  "o........o",
  "o........o",
  "o........o",
  "oooooooooo",
];

const FILES_GRID: IconGrid = [
  "..oooo....",
  ".oaaaaoo..",
  "oaaaaaaaao",
  "oaaaaaaaao",
  "oaaaaaaaao",
  "oaaaaaaaao",
  "oaaaaaaaao",
  "oaaaaaaaao",
  "oooooooooo",
  "..........",
];

const CLUES_GRID: IconGrid = [
  "oooooo....",
  "o....o....",
  "o.....o...",
  "o......oo.",
  "o.......o.",
  "o..aaa..o.",
  "o..aaa..o.",
  "o.......o.",
  "oooooooo..",
  "..........",
];

const DOC_GRID: IconGrid = [
  "oooooo....",
  "o....o....",
  "o.....o...",
  "o......oo.",
  "o.......o.",
  "o.......o.",
  "o.......o.",
  "o.......o.",
  "oooooooo..",
  "..........",
];

const SPEAKER_ON_GRID: IconGrid = [
  "..........",
  "...oo.....",
  "..ooooa...",
  ".oooo.a...",
  "oooooo.a..",
  "oooooo.a..",
  ".oooo.a...",
  "..ooooa...",
  "...oo.....",
  "..........",
];

const SPEAKER_MUTED_GRID: IconGrid = [
  "..........",
  "...oo.....",
  "..ooooo...",
  ".oooo..o..",
  "oooooo.o..",
  "ooooooo...",
  ".oooo.o...",
  "..ooooo...",
  "...oo.....",
  "..........",
];

const SETTINGS_GRID: IconGrid = [
  "...oo.....",
  "...oo.....",
  "o..oo..o..",
  "oo.oo.oo..",
  "oooooooo..",
  "oooooooo..",
  "oo.oo.oo..",
  "o..oo..o..",
  "...oo.....",
  "...oo.....",
];

export function IconTerminal(props: { size?: number; className?: string }) {
  return <PixelIcon grid={TERMINAL_GRID} {...props} />;
}

export function IconFiles(props: { size?: number; className?: string }) {
  return <PixelIcon grid={FILES_GRID} {...props} />;
}

export function IconClues(props: { size?: number; className?: string }) {
  return <PixelIcon grid={CLUES_GRID} {...props} />;
}

export function IconDoc(props: { size?: number; className?: string }) {
  return <PixelIcon grid={DOC_GRID} {...props} />;
}

export function IconSettings(props: { size?: number; className?: string }) {
  return <PixelIcon grid={SETTINGS_GRID} {...props} />;
}

export function IconSpeakerOn(props: { size?: number; className?: string }) {
  return <PixelIcon grid={SPEAKER_ON_GRID} {...props} />;
}

export function IconSpeakerMuted(props: { size?: number; className?: string }) {
  return <PixelIcon grid={SPEAKER_MUTED_GRID} {...props} />;
}
