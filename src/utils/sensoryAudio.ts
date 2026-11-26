import { getOrCreateSharedAudioContext, onCrtAudioUnlocked } from './crtAudio';
import { SENSORY_FADE_TIMING, type SensoryMood } from './sensoryMood';

interface MoodChannelNodes {
  masterGain: GainNode;
  cleanup: () => void;
}

class SensoryAudioEngine {
  private currentMood: SensoryMood = 'neutral';
  private isMuted = false;
  private initialized = false;
  private channels: Partial<Record<Exclude<SensoryMood, 'neutral'>, MoodChannelNodes>> = {};
  private eventTimer: number | null = null;
  private pinkNoiseBuffer: AudioBuffer | null = null;
  private unsubscribeUnlock: (() => void) | null = null;

  constructor() {
    this.unsubscribeUnlock = onCrtAudioUnlocked(() => {
      this.sync(this.currentMood, this.isMuted);
    });
  }

  private getPinkBuffer(ctx: AudioContext): AudioBuffer {
    if (this.pinkNoiseBuffer && this.pinkNoiseBuffer.sampleRate === ctx.sampleRate) {
      return this.pinkNoiseBuffer;
    }
    const seconds = 4;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      const pink = (b0 + b1 + b2 + b3 + b4 + white * 0.18) * 0.14;
      data[i] = Math.max(-1, Math.min(1, pink));
    }

    this.pinkNoiseBuffer = buffer;
    return buffer;
  }

  private ensureChannels(ctx: AudioContext) {
    if (this.initialized) return;
    this.initialized = true;
    const now = ctx.currentTime;
    const buffer = this.getPinkBuffer(ctx);

    // 1. ICED: Howling arctic wind + crystalline air
    const icedGain = ctx.createGain();
    icedGain.gain.setValueAtTime(0.0001, now);
    const icedNoise = ctx.createBufferSource();
    icedNoise.buffer = buffer;
    icedNoise.loop = true;

    const icedBand = ctx.createBiquadFilter();
    icedBand.type = 'bandpass';
    icedBand.frequency.setValueAtTime(480, now);
    icedBand.Q.setValueAtTime(2.3, now);

    const windLfo = ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.setValueAtTime(0.14, now);
    const windLfoDepth = ctx.createGain();
    windLfoDepth.gain.setValueAtTime(210, now);
    windLfo.connect(windLfoDepth);
    windLfoDepth.connect(icedBand.frequency);

    const icedHighAir = ctx.createBiquadFilter();
    icedHighAir.type = 'bandpass';
    icedHighAir.frequency.setValueAtTime(2400, now);
    icedHighAir.Q.setValueAtTime(1.4, now);
    const icedAirGain = ctx.createGain();
    icedAirGain.gain.setValueAtTime(0.18, now);

    icedNoise.connect(icedBand);
    icedBand.connect(icedGain);
    icedNoise.connect(icedHighAir);
    icedHighAir.connect(icedAirGain);
    icedAirGain.connect(icedGain);
    icedGain.connect(ctx.destination);

    icedNoise.start(now);
    windLfo.start(now);
    this.channels.iced = {
      masterGain: icedGain,
      cleanup: () => {
        icedNoise.stop();
        windLfo.stop();
      },
    };

    // 2. BOTANICAL: Soft warm forest breeze bed
    const botGain = ctx.createGain();
    botGain.gain.setValueAtTime(0.0001, now);
    const botNoise = ctx.createBufferSource();
    botNoise.buffer = buffer;
    botNoise.loop = true;

    const botFilter = ctx.createBiquadFilter();
    botFilter.type = 'bandpass';
    botFilter.frequency.setValueAtTime(540, now);
    botFilter.Q.setValueAtTime(0.8, now);

    const botLfo = ctx.createOscillator();
    botLfo.type = 'sine';
    botLfo.frequency.setValueAtTime(0.11, now);
    const botLfoDepth = ctx.createGain();
    botLfoDepth.gain.setValueAtTime(140, now);
    botLfo.connect(botLfoDepth);
    botLfoDepth.connect(botFilter.frequency);

    botNoise.connect(botFilter);
    botFilter.connect(botGain);
    botGain.connect(ctx.destination);

    botNoise.start(now);
    botLfo.start(now);
    this.channels.botanical = {
      masterGain: botGain,
      cleanup: () => {
        botNoise.stop();
        botLfo.stop();
      },
    };

    // 3. WATER: Soft flowing stream / clean hydration splash bed
    const waterGain = ctx.createGain();
    waterGain.gain.setValueAtTime(0.0001, now);
    const waterNoise = ctx.createBufferSource();
    waterNoise.buffer = buffer;
    waterNoise.loop = true;

    const waterLow = ctx.createBiquadFilter();
    waterLow.type = 'bandpass';
    waterLow.frequency.setValueAtTime(1180, now);
    waterLow.Q.setValueAtTime(1.1, now);

    const waterLfo = ctx.createOscillator();
    waterLfo.type = 'sine';
    waterLfo.frequency.setValueAtTime(0.28, now);
    const waterLfoDepth = ctx.createGain();
    waterLfoDepth.gain.setValueAtTime(280, now);
    waterLfo.connect(waterLfoDepth);
    waterLfoDepth.connect(waterLow.frequency);

    waterNoise.connect(waterLow);
    waterLow.connect(waterGain);
    waterGain.connect(ctx.destination);

    waterNoise.start(now);
    waterLfo.start(now);
    this.channels.water = {
      masterGain: waterGain,
      cleanup: () => {
        waterNoise.stop();
        waterLfo.stop();
      },
    };

    // 4. SMOKE: Velvet airy studio room tone paired with slow exhale gusts
    const smokeGain = ctx.createGain();
    smokeGain.gain.setValueAtTime(0.0001, now);
    const smokeNoise = ctx.createBufferSource();
    smokeNoise.buffer = buffer;
    smokeNoise.loop = true;

    const smokeFilter = ctx.createBiquadFilter();
    smokeFilter.type = 'lowpass';
    smokeFilter.frequency.setValueAtTime(360, now);
    smokeFilter.Q.setValueAtTime(0.7, now);

    smokeNoise.connect(smokeFilter);
    smokeFilter.connect(smokeGain);
    smokeGain.connect(ctx.destination);

    smokeNoise.start(now);
    this.channels.smoke = {
      masterGain: smokeGain,
      cleanup: () => {
        smokeNoise.stop();
      },
    };
  }

  private clearScheduledVoiceTimer() {
    if (this.eventTimer !== null) {
      window.clearTimeout(this.eventTimer);
      this.eventTimer = null;
    }
  }

  private scheduleNextMoodAccent() {
    this.clearScheduledVoiceTimer();
    if (this.isMuted || this.currentMood === 'neutral') return;

    const ctx = getOrCreateSharedAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    const channel = this.channels[this.currentMood];
    if (!channel) return;

    const mood = this.currentMood;
    let delayMs = 2400;

    if (mood === 'iced') {
      // Alternate delicate crystalline frost glint and soft distant rolling thunder
      if (Math.random() < 0.65) {
        this.triggerIceCrystalGlint(ctx, channel.masterGain);
        delayMs = 2400 + Math.random() * 2100;
      } else {
        this.triggerDistantThunder(ctx, channel.masterGain);
        delayMs = 4200 + Math.random() * 2800;
      }
    } else if (mood === 'botanical') {
      this.triggerBirdChirp(ctx, channel.masterGain);
      delayMs = 1700 + Math.random() * 2200;
    } else if (mood === 'water') {
      if (Math.random() < 0.6) {
        this.triggerWaterDroplet(ctx, channel.masterGain);
      } else {
        this.triggerWaterSplash(ctx, channel.masterGain);
      }
      delayMs = 900 + Math.random() * 1400;
    } else if (mood === 'smoke') {
      this.triggerVaporExhale(ctx, channel.masterGain);
      delayMs = 3100 + Math.random() * 1900;
    }

    this.eventTimer = window.setTimeout(() => {
      this.scheduleNextMoodAccent();
    }, delayMs);
  }

  private triggerIceCrystalGlint(ctx: AudioContext, dest: AudioNode) {
    const now = ctx.currentTime;
    const baseFreq = 2100 + Math.random() * 1400;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.015, now + 1.4);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.085, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 1.65);
  }

  private triggerDistantThunder(ctx: AudioContext, dest: AudioNode) {
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.getPinkBuffer(ctx);

    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.setValueAtTime(110, now);
    low.frequency.exponentialRampToValueAtTime(48, now + 2.8);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.65, now + 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    src.connect(low);
    low.connect(gain);
    gain.connect(dest);
    src.start(now);
    src.stop(now + 3.3);
  }

  private triggerBirdChirp(ctx: AudioContext, dest: AudioNode) {
    const baseNow = ctx.currentTime;
    const syllables = Math.random() < 0.55 ? 2 : 3;

    for (let i = 0; i < syllables; i++) {
      const start = baseNow + i * (0.12 + Math.random() * 0.06);
      const dur = 0.075 + Math.random() * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const fStart = 2400 + Math.random() * 900;
      const fPeak = fStart * (1.22 + Math.random() * 0.18);
      const fEnd = fStart * (0.94 + Math.random() * 0.12);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fStart, start);
      osc.frequency.exponentialRampToValueAtTime(fPeak, start + dur * 0.45);
      osc.frequency.exponentialRampToValueAtTime(fEnd, start + dur);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.28, start + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(start);
      osc.stop(start + dur + 0.01);
    }
  }

  private triggerWaterDroplet(ctx: AudioContext, dest: AudioNode) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const base = 460 + Math.random() * 340;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 2.35, now + 0.068);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.095);
  }

  private triggerWaterSplash(ctx: AudioContext, dest: AudioNode) {
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.getPinkBuffer(ctx);

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.setValueAtTime(860, now);
    band.frequency.exponentialRampToValueAtTime(2150, now + 0.24);
    band.Q.setValueAtTime(1.6, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

    src.connect(band);
    band.connect(gain);
    gain.connect(dest);
    src.start(now);
    src.stop(now + 0.38);
  }

  private triggerVaporExhale(ctx: AudioContext, dest: AudioNode) {
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.getPinkBuffer(ctx);

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.setValueAtTime(1180, now);
    band.frequency.exponentialRampToValueAtTime(340, now + 2.2);
    band.Q.setValueAtTime(0.85, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.75, now + 0.42);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    src.connect(band);
    band.connect(gain);
    gain.connect(dest);
    src.start(now);
    src.stop(now + 2.5);
  }

  public sync(nextMood: SensoryMood, nextMuted: boolean) {
    const moodChanged = nextMood !== this.currentMood || nextMuted !== this.isMuted;
    this.currentMood = nextMood;
    this.isMuted = nextMuted;

    const ctx = getOrCreateSharedAudioContext();
    if (!ctx) return;

    if (ctx.state !== 'running') {
      this.clearScheduledVoiceTimer();
      return;
    }

    this.ensureChannels(ctx);
    const now = ctx.currentTime;

    const targetVolumes: Record<Exclude<SensoryMood, 'neutral'>, number> = {
      iced: 0.056,
      botanical: 0.042,
      water: 0.044,
      smoke: 0.04,
    };

    (Object.keys(this.channels) as Array<Exclude<SensoryMood, 'neutral'>>).forEach(
      (channelMood) => {
        const node = this.channels[channelMood];
        if (!node) return;
        const param = node.masterGain.gain;
        const shouldBeActive = !nextMuted && nextMood === channelMood;
        const fadeOut = nextMuted
          ? SENSORY_FADE_TIMING.muteFadeOutSec
          : SENSORY_FADE_TIMING.fadeOutSec;

        try {
          param.cancelScheduledValues(now);
          param.setValueAtTime(Math.max(0.0001, param.value), now);
          if (shouldBeActive) {
            param.linearRampToValueAtTime(
              targetVolumes[channelMood],
              now + SENSORY_FADE_TIMING.fadeInSec
            );
          } else {
            param.exponentialRampToValueAtTime(0.0001, now + fadeOut);
          }
        } catch {
          // ignore Web Audio automation edge errors
        }
      }
    );

    if (nextMuted || nextMood === 'neutral') {
      this.clearScheduledVoiceTimer();
    } else if (moodChanged || this.eventTimer === null) {
      this.clearScheduledVoiceTimer();
      // Slight stagger after fade-in begins so transition feels velvety rather than abrupt
      this.eventTimer = window.setTimeout(() => {
        this.scheduleNextMoodAccent();
      }, 420);
    }
  }

  public dispose() {
    this.clearScheduledVoiceTimer();
    this.unsubscribeUnlock?.();
    this.unsubscribeUnlock = null;
    (Object.values(this.channels) as Array<MoodChannelNodes | undefined>).forEach((ch) => {
      try {
        ch?.cleanup();
      } catch {
        // ignore stop errors
      }
    });
    this.channels = {};
    this.initialized = false;
  }
}

let sharedEngine: SensoryAudioEngine | null = null;

export function syncSensorySoundscape(mood: SensoryMood, isMuted: boolean): void {
  if (typeof window === 'undefined') return;
  if (!sharedEngine) {
    sharedEngine = new SensoryAudioEngine();
  }
  sharedEngine.sync(mood, isMuted);
}
