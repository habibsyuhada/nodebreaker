/** Procedural chiptune-style feedback via Web Audio — no audio files. */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

/**
 * Every sound routes through one master gain rather than straight to `destination`, so muting is
 * a single gain change instead of a flag every `play*` function has to remember to check.
 * Mirrored from the store's `profile.audio`; kept in module scope so a sound triggered before the
 * store has rehydrated still respects the last applied setting.
 */
let output: { muted: boolean; volume: number } = { muted: false, volume: 0.8 };

function applyOutput(): void {
  if (masterGain) masterGain.gain.value = output.muted ? 0 : output.volume;
}

/** Called by the store whenever `profile.audio` changes, and once after the save rehydrates. */
export function setAudioOutput(next: { muted: boolean; volume: number }): void {
  output = { muted: next.muted, volume: Math.max(0, Math.min(1, next.volume)) };
  applyOutput();
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    applyOutput();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

/**
 * The node every sound connects to instead of `ctx.destination`. Returns null only when audio is
 * unavailable entirely, in which case callers bail out the same way they already did.
 */
function getOutputNode(): AudioNode | null {
  const audioCtx = getContext();
  if (!audioCtx || !masterGain) return null;
  return masterGain;
}

interface BeepOptions {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
}

function beep({ frequency, duration, type = "square", volume = 0.05, delay = 0 }: BeepOptions): void {
  if (output.muted) return;
  const audioCtx = getContext();
  const out = getOutputNode();
  if (!audioCtx || !out) return;
  const start = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(out);
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

interface NoiseBurstOptions {
  duration: number;
  volume?: number;
  delay?: number;
  /** Bandpass center frequency — higher = thinner/clickier, lower = harsher/broader. */
  filterFreq?: number;
}

/** White-noise burst through a bandpass filter — the "noise generator" texture, distinct from beep()'s pure tones. */
function noiseBurst({ duration, volume = 0.04, delay = 0, filterFreq = 2000 }: NoiseBurstOptions): void {
  if (output.muted) return;
  const audioCtx = getContext();
  const out = getOutputNode();
  if (!audioCtx || !out) return;
  const start = audioCtx.currentTime + delay;
  const sampleCount = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
  const buffer = audioCtx.createBuffer(1, sampleCount, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) data[i] = Math.random() * 2 - 1;

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(out);
  source.start(start);
  source.stop(start + duration);
}

/** Very short, quiet click — one per revealed terminal character (throttled by the caller). */
export function playTypeTick(): void {
  noiseBurst({ duration: 0.012, volume: 0.018, filterFreq: 3800 });
}

/** Harsh double burst for "something just went wrong" moments — burned, trace crossing hot. */
export function playGlitch(): void {
  noiseBurst({ duration: 0.05, volume: 0.06, filterFreq: 700 });
  noiseBurst({ duration: 0.09, volume: 0.05, delay: 0.045, filterFreq: 1500 });
}

/** Low periodic pulse for ambient tension while trace is elevated on a monitored node. */
export function playAmbientPulse(): void {
  beep({ frequency: 58, duration: 1.4, type: "sine", volume: 0.022 });
  beep({ frequency: 87, duration: 1.1, type: "sine", volume: 0.013, delay: 0.15 });
}
