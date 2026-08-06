import { createElement, useEffect, useRef } from "react";

/** One row of a sprite grid; each character is a palette key. "." is transparent. */
export type SpriteGrid = readonly string[];

/** Maps a grid character to a CSS color. "." is reserved for transparent. */
export type SpritePalette = Record<string, string>;

export function spriteSize(grid: SpriteGrid): { width: number; height: number } {
  return { width: grid[0]?.length ?? 0, height: grid.length };
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  grid: SpriteGrid,
  palette: SpritePalette,
): void {
  ctx.imageSmoothingEnabled = false;
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    for (let col = 0; col < line.length; col++) {
      const key = line[col];
      if (key === "." || key === " ") continue;
      const color = palette[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col, row, 1, 1);
    }
  }
}

interface SpriteProps {
  grid: SpriteGrid;
  palette: SpritePalette;
  /** Rendered CSS size in pixels (square). The canvas itself is native grid resolution, scaled with crisp edges. */
  size?: number;
  className?: string;
  title?: string;
}

/** Renders a pixel-grid sprite onto a canvas, scaled up crisply — no smoothing/blur. */
export function Sprite({ grid, palette, size = 32, className, title }: SpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = spriteSize(grid);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSprite(ctx, grid, palette);
  }, [grid, palette]);

  return createElement("canvas", {
    ref: canvasRef,
    width,
    height,
    className,
    role: title ? "img" : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    style: { width: size, height: size, imageRendering: "pixelated" },
  });
}
