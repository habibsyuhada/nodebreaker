/** Procedural chiptune-style feedback via Web Audio — no audio files. */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

interface BeepOptions {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
}

function beep({ frequency, duration, type = "square", volume = 0.05, delay = 0 }: BeepOptions): void {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const start = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playClueSaved(): void {
  beep({ frequency: 880, duration: 0.09 });
  beep({ frequency: 1320, duration: 0.07, delay: 0.06 });
}

export function playClueDuplicate(): void {
  beep({ frequency: 220, duration: 0.08, type: "triangle" });
}

export function playCombineSuccess(): void {
  beep({ frequency: 660, duration: 0.08 });
  beep({ frequency: 990, duration: 0.08, delay: 0.07 });
  beep({ frequency: 1480, duration: 0.1, delay: 0.14 });
}

export function playCombineInvalid(): void {
  beep({ frequency: 200, duration: 0.09, type: "sawtooth", delay: 0 });
  beep({ frequency: 140, duration: 0.12, type: "sawtooth", delay: 0.08 });
}
