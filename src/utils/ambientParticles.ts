export type LightingDotKind = 'pinpoint' | 'bokeh';
export type LightingDotChannel = 'primary' | 'secondary' | 'highlight';

export interface LightingRgbPalette {
  primary: [number, number, number];
  secondary: [number, number, number];
  highlight: [number, number, number];
}

export interface LightingDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  phase: number;
  swayFreq: number;
  swayAmp: number;
  breathSpeed: number;
  flashOffset: number;
  kind: LightingDotKind;
  channel: LightingDotChannel;
}

function seededUnit(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const CHANNELS: readonly LightingDotChannel[] = [
  'primary',
  'secondary',
  'primary',
  'highlight',
  'secondary',
];

export function createLightingDots(count = 64): LightingDot[] {
  return Array.from({ length: count }, (_, idx) => {
    const r1 = seededUnit(idx * 5 + 1);
    const r2 = seededUnit(idx * 5 + 2);
    const r3 = seededUnit(idx * 5 + 3);
    const r4 = seededUnit(idx * 5 + 4);
    const r5 = seededUnit(idx * 7 + 11);

    // ~72% tiny crisp lightning pinpoint dots, ~28% delicate soft micro-bokeh orbs
    const isBokeh = idx % 7 === 0 || idx % 7 === 4;

    return {
      x: r1,
      y: r2,
      vx: 0.0024 + r3 * 0.0085, // gentle diagonal drift (normalized units/sec)
      vy: -(0.007 + r4 * 0.015), // weightless slow upward float (normalized units/sec)
      r: isBokeh ? 3.0 + r3 * 3.8 : 0.75 + r4 * 1.15,
      baseAlpha: isBokeh ? 0.16 + r5 * 0.18 : 0.48 + r1 * 0.44,
      phase: r4 * Math.PI * 2,
      swayFreq: 0.42 + r3 * 0.65,
      swayAmp: 0.007 + r5 * 0.013,
      breathSpeed: 0.55 + r2 * 0.95,
      flashOffset: r5 * Math.PI * 2,
      kind: isBokeh ? 'bokeh' : 'pinpoint',
      channel: CHANNELS[idx % CHANNELS.length],
    };
  });
}

export function stepLightingDot(
  dot: LightingDot,
  dtSeconds: number,
  elapsedSeconds: number,
  boost = 1
): LightingDot {
  const dt = Math.max(0, Math.min(0.06, dtSeconds));
  const sway =
    Math.sin(elapsedSeconds * dot.swayFreq + dot.phase) * dot.swayAmp +
    Math.cos(elapsedSeconds * (dot.swayFreq * 0.52) + dot.phase * 1.7) *
      (dot.swayAmp * 0.45);

  let nextX = dot.x + (dot.vx + sway) * boost * dt;
  let nextY = dot.y + dot.vy * boost * dt;

  if (nextY < -0.06) {
    nextY = 1.06;
    nextX = (nextX + 0.37) % 1;
  } else if (nextY > 1.06) {
    nextY = -0.06;
  }

  if (nextX < -0.06) nextX += 1.12;
  else if (nextX > 1.06) nextX -= 1.12;

  return {
    ...dot,
    x: nextX,
    y: nextY,
  };
}

export function computeLightingDotOpacity(
  dot: LightingDot,
  elapsedSeconds: number,
  surge = 0
): { alpha: number; flashBoost: number } {
  const breath =
    0.25 + 0.75 * (0.5 + 0.5 * Math.sin(elapsedSeconds * dot.breathSpeed + dot.phase));
  // Subtle crisp electric-pinpoint twinkle peak on top of smooth breathing
  const pulseWave = Math.max(
    0,
    Math.sin(elapsedSeconds * (dot.breathSpeed * 2.1 + 0.7) + dot.flashOffset)
  );
  const flashBoost = dot.kind === 'pinpoint' ? Math.pow(pulseWave, 6) * 0.45 : 0;
  const alpha = Math.min(
    0.98,
    dot.baseAlpha * breath * (1 + surge * 0.35 + flashBoost * 0.5)
  );
  return {
    alpha: Math.max(0, alpha),
    flashBoost,
  };
}

export function renderLightingDotsCanvas(
  ctx: CanvasRenderingContext2D,
  dots: LightingDot[],
  dtSeconds: number,
  elapsedSeconds: number,
  width: number,
  height: number,
  palette: LightingRgbPalette,
  surge = 0
): void {
  if (width <= 0 || height <= 0) return;

  const gentleBoost = 1 + surge * 1.45;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < dots.length; i++) {
    const next = stepLightingDot(dots[i], dtSeconds, elapsedSeconds, gentleBoost);
    dots[i] = next;

    const px = next.x * width;
    const py = next.y * height;
    const { alpha, flashBoost } = computeLightingDotOpacity(next, elapsedSeconds, surge);
    const rgb = palette[next.channel];
    const colorStr = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;

    if (next.kind === 'bokeh') {
      const outerR = next.r * (2.4 + alpha * 0.6);
      const grad = ctx.createRadialGradient(px, py, 0, px, py, outerR);
      grad.addColorStop(0, `rgba(${colorStr}, ${alpha * 0.58})`);
      grad.addColorStop(0.45, `rgba(${colorStr}, ${alpha * 0.22})`);
      grad.addColorStop(1, `rgba(${colorStr}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, outerR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft radial bloom around tiny crisp lighting/lightning pinpoint dot
      const bloomR = next.r * (3.6 + flashBoost * 2.2);
      const bloom = ctx.createRadialGradient(px, py, 0, px, py, bloomR);
      bloom.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, alpha * 0.78 + flashBoost * 0.35)})`);
      bloom.addColorStop(0.32, `rgba(${colorStr}, ${alpha * 0.45})`);
      bloom.addColorStop(1, `rgba(${colorStr}, 0)`);
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(px, py, bloomR, 0, Math.PI * 2);
      ctx.fill();

      // Crisp small luminous pinpoint dot core
      ctx.fillStyle = `rgba(${colorStr}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, next.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 0.85 + flashBoost * 0.4)})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.55, next.r * 0.52), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
