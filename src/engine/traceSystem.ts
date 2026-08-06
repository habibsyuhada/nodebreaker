export const TRACE_MAX = 100;
export const TRACE_TICK_PERCENT = 2;
export const TRACE_TICK_INTERVAL_MS = 5000;
export const TRACE_HOT_THRESHOLD = 70;
export const TRACE_WARM_THRESHOLD = 40;

export interface AmbientTraceLog {
  /** Fires the first time trace reaches this percent. */
  atPercent: number;
  text: string;
}

/** Ambient system-log noise that appears automatically as trace climbs — makes the pressure feel organic. */
export const AMBIENT_TRACE_LOGS: AmbientTraceLog[] = [
  { atPercent: 25, text: "[monitor] connection logged from unfamiliar host" },
  { atPercent: 50, text: "[monitor] session anomaly flagged for review" },
  { atPercent: 75, text: "[monitor] admin session started — investigating" },
  { atPercent: 92, text: "[monitor] security alert escalated to on-call admin" },
];

export function clampTrace(value: number): number {
  return Math.max(0, Math.min(TRACE_MAX, value));
}

export function traceLogFactId(atPercent: number): string {
  return `trace-log-${atPercent}`;
}
