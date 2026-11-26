export interface SubtitleSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  twinklePhase: number;
  twinkleSpeed: number;
}

const WHITE_SILVER_PALETTE = [
  '#FFFFFF',
  '#FFFFFF',
  '#F8FAFC',
  '#F1F5F9',
  '#E2E8F0',
  '#CBD5E1',
] as const;

export interface SpawnLetterBurstOptions {
  x: number;
  y: number;
  spreadX?: number;
  spreadY?: number;
  count?: number;
  random?: () => number;
}

export function spawnSubtitleLetterBurst({
  x,
  y,
  spreadX = 10,
  spreadY = 7,
  count = 6,
  random = Math.random,
}: SpawnLetterBurstOptions): SubtitleSpark[] {
  const sparks: SubtitleSpark[] = [];
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2;
    const speed = 14 + random() * 44;
    const maxLife = 0.42 + random() * 0.44;
    const color =
      WHITE_SILVER_PALETTE[Math.floor(random() * WHITE_SILVER_PALETTE.length)] ?? '#FFFFFF';
    const baseAlpha = 0.72 + random() * 0.28;

    sparks.push({
      x: x + (random() - 0.5) * spreadX,
      y: y + (random() - 0.5) * spreadY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (8 + random() * 16),
      radius: 0.6 + random() * 1.65,
      baseAlpha,
      alpha: baseAlpha,
      life: 0,
      maxLife,
      color,
      twinklePhase: random() * Math.PI * 2,
      twinkleSpeed: 16 + random() * 20,
    });
  }
  return sparks;
}

export function stepSubtitleParticles(
  particles: readonly SubtitleSpark[],
  dtSeconds: number
): SubtitleSpark[] {
  if (dtSeconds <= 0) return [...particles];
  const clampedDt = Math.min(0.05, dtSeconds);
  const drag = Math.pow(0.28, clampedDt);
  const next: SubtitleSpark[] = [];

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const life = p.life + clampedDt;
    if (life >= p.maxLife) continue;

    const progress = life / p.maxLife;
    const fadeEnvelope =
      progress < 0.16 ? progress / 0.16 : Math.pow(1 - (progress - 0.16) / 0.84, 1.45);
    const glint = 0.65 + 0.35 * Math.sin(p.twinklePhase + life * p.twinkleSpeed);
    const alpha = Math.max(0, Math.min(1, p.baseAlpha * fadeEnvelope * glint));

    const vx = p.vx * drag;
    const vy = p.vy * drag - 6 * clampedDt;

    next.push({
      ...p,
      x: p.x + vx * clampedDt,
      y: p.y + vy * clampedDt,
      vx,
      vy,
      life,
      alpha,
    });
  }

  return next;
}

export function computeSubtitleRevealIndex(
  elapsedSec: number,
  sweepDurationSec: number,
  totalChars: number
): number {
  if (totalChars <= 0 || sweepDurationSec <= 0) return 0;
  const clamped = Math.max(0, Math.min(1, elapsedSec / sweepDurationSec));
  return Math.min(totalChars, Math.floor(clamped * totalChars + 0.0001));
}
