export interface CrtAudioEligibility {
  isMuted: boolean;
  hasAudioContext: boolean;
  prefersReducedMotion?: boolean;
}

export const CRT_STATIC_CONFIG = {
  durationSec: 0.34,
  attackSec: 0.018,
  decayEndSec: 0.33,
  peakGain: 0.085,
  highpassHz: 420,
  bandpassHz: 1850,
  bandpassQ: 0.65,
  lowpassHz: 4800,
} as const;

export function shouldPlayCrtSound({
  isMuted,
  hasAudioContext,
}: CrtAudioEligibility): boolean {
  return !isMuted && hasAudioContext;
}

export function computeSoundStateAfterToggle(currentMuted: boolean): boolean {
  return !currentMuted;
}

let sharedAudioCtx: AudioContext | null = null;
let cachedNoiseBuffer: AudioBuffer | null = null;
const unlockListeners = new Set<() => void>();

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return win.AudioContext ?? win.webkitAudioContext ?? null;
}

export function getOrCreateSharedAudioContext(): AudioContext | null {
  const Ctor = getAudioContextCtor();
  if (!Ctor) return null;

  if (!sharedAudioCtx) {
    try {
      sharedAudioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  return sharedAudioCtx;
}

export function onCrtAudioUnlocked(listener: () => void): () => void {
  unlockListeners.add(listener);
  return () => {
    unlockListeners.delete(listener);
  };
}

function notifyUnlockListeners() {
  unlockListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore listener errors
    }
  });
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }

  const length = Math.floor(ctx.sampleRate * (CRT_STATIC_CONFIG.durationSec + 0.04));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Soft pink-weighted white noise for authentic analog CRT "shhh" static air
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.997 * b0 + white * 0.029;
    b1 = 0.985 * b1 + white * 0.032;
    b2 = 0.95 * b2 + white * 0.048;
    const pink = b0 + b1 + b2 + white * 0.18;
    data[i] = Math.max(-1, Math.min(1, pink * 0.68 + white * 0.32));
  }
  cachedNoiseBuffer = buffer;
  return buffer;
}

/**
 * Unlocks/resumes the singleton Web Audio context on user gesture without
 * starting any continuous background drone or synth pad music.
 */
export function unlockCrtAudio(isMuted = false): boolean {
  const ctx = getOrCreateSharedAudioContext();
  if (!ctx) return false;

  if (ctx.state === 'suspended') {
    ctx
      .resume()
      .then(() => {
        if (!isMuted && ctx.state === 'running') {
          notifyUnlockListeners();
        }
      })
      .catch(() => {});
  } else if (ctx.state === 'running' && !isMuted) {
    notifyUnlockListeners();
  }

  return ctx.state === 'running';
}

/**
 * Synthesizes a crisp, brief, realistic analog CRT static / white-noise hiss ("shhh")
 * lasting ~0.34s on artwork channel transitions.
 */
export function playCrtChannelSwitchSound(
  isMuted: boolean,
  forceUnlockAttempt = false
): boolean {
  const ctx = getOrCreateSharedAudioContext();
  if (!ctx) return false;

  if (forceUnlockAttempt && ctx.state === 'suspended') {
    ctx
      .resume()
      .then(() => {
        if (!isMuted && ctx.state === 'running') {
          notifyUnlockListeners();
        }
      })
      .catch(() => {});
  }

  if (
    !shouldPlayCrtSound({
      isMuted,
      hasAudioContext: ctx.state === 'running',
    })
  ) {
    return false;
  }

  try {
    const now = ctx.currentTime;
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = getNoiseBuffer(ctx);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(CRT_STATIC_CONFIG.highpassHz, now);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(CRT_STATIC_CONFIG.bandpassHz, now);
    bandpass.Q.setValueAtTime(CRT_STATIC_CONFIG.bandpassQ, now);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(CRT_STATIC_CONFIG.lowpassHz, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(
      CRT_STATIC_CONFIG.peakGain,
      now + CRT_STATIC_CONFIG.attackSec
    );
    noiseGain.gain.exponentialRampToValueAtTime(
      0.032,
      now + CRT_STATIC_CONFIG.durationSec * 0.45
    );
    noiseGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + CRT_STATIC_CONFIG.decayEndSec
    );

    noiseSource.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + CRT_STATIC_CONFIG.durationSec);

    return true;
  } catch {
    return false;
  }
}

export function isCrtAudioUnlocked(): boolean {
  return sharedAudioCtx?.state === 'running';
}
