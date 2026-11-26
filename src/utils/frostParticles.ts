export interface FrostFlake {
  x: number;
  y: number;
  layer: 0 | 1 | 2;
  radius: number;
  speedY: number;
  driftX: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rotation: number;
  spinSpeed: number;
  opacity: number;
  crystalline: boolean;
}

export function createFrostFlakes(count = 96): FrostFlake[] {
  return Array.from({ length: count }, (_, idx) => {
    const mod = idx % 10;
    const layer: 0 | 1 | 2 = mod < 4 ? 0 : mod < 8 ? 1 : 2;
    const seed1 = Math.sin((idx + 1) * 12.9898) * 43758.5453;
    const rand1 = seed1 - Math.floor(seed1);
    const seed2 = Math.sin((idx + 1) * 78.233) * 19341.131;
    const rand2 = seed2 - Math.floor(seed2);
    const seed3 = Math.sin((idx + 1) * 41.719) * 31415.926;
    const rand3 = seed3 - Math.floor(seed3);

    const crystalline = layer === 2 && idx % 3 === 0;
    const radius =
      layer === 0
        ? 1.1 + rand1 * 1.4
        : layer === 1
          ? 2.0 + rand1 * 1.9
          : crystalline
            ? 4.2 + rand1 * 3.4
            : 2.9 + rand1 * 2.1;

    return {
      x: rand1,
      y: rand2,
      layer,
      radius,
      speedY:
        layer === 0
          ? 0.018 + rand3 * 0.018
          : layer === 1
            ? 0.036 + rand3 * 0.028
            : 0.056 + rand3 * 0.036,
      driftX: -0.008 + rand2 * 0.016,
      swayAmp: layer === 0 ? 0.012 : layer === 1 ? 0.022 : 0.03,
      swayFreq: 0.65 + rand3 * 0.9,
      phase: rand1 * Math.PI * 2,
      rotation: rand2 * Math.PI * 2,
      spinSpeed: (rand3 - 0.5) * 0.85,
      opacity:
        layer === 0
          ? 0.24 + rand1 * 0.22
          : layer === 1
            ? 0.42 + rand1 * 0.28
            : 0.56 + rand1 * 0.34,
      crystalline,
    };
  });
}

export function stepFrostFlakes(
  flakes: FrostFlake[],
  dtSec: number,
  elapsedSec: number
): void {
  const clampedDt = Math.min(0.05, Math.max(0.001, dtSec));
  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];
    f.y += f.speedY * clampedDt;
    f.x +=
      (f.driftX + Math.sin(elapsedSec * f.swayFreq + f.phase) * f.swayAmp) *
      clampedDt;
    f.rotation += f.spinSpeed * clampedDt;

    if (f.y > 1.05) {
      f.y = -0.05;
    }
    if (f.x > 1.06) {
      f.x -= 1.12;
    } else if (f.x < -0.06) {
      f.x += 1.12;
    }
  }
}

function drawIceCrystal(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  r: number,
  rotation: number,
  alpha: number
) {
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(rotation);
  ctx.strokeStyle = `rgba(218, 244, 255, ${alpha.toFixed(3)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let arm = 0; arm < 6; arm++) {
    const angle = (arm * Math.PI) / 3;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(cos * r, sin * r);

    const bx = cos * r * 0.58;
    const by = sin * r * 0.58;
    const branchLen = r * 0.34;
    ctx.moveTo(bx, by);
    ctx.lineTo(
      bx + Math.cos(angle + 0.65) * branchLen,
      by + Math.sin(angle + 0.65) * branchLen
    );
    ctx.moveTo(bx, by);
    ctx.lineTo(
      bx + Math.cos(angle - 0.65) * branchLen,
      by + Math.sin(angle - 0.65) * branchLen
    );
  }
  ctx.stroke();
  ctx.restore();
}

export function renderFrostSnowCanvas(
  ctx: CanvasRenderingContext2D,
  flakes: FrostFlake[],
  dtSec: number,
  elapsedSec: number,
  width: number,
  height: number,
  visibilityOpacity: number
): void {
  ctx.clearRect(0, 0, width, height);
  if (visibilityOpacity <= 0.01) return;

  stepFrostFlakes(flakes, dtSec, elapsedSec);

  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];
    const px = f.x * width;
    const py = f.y * height;
    const pulse = 0.78 + 0.22 * Math.sin(elapsedSec * 1.4 + f.phase);
    const alpha = Math.min(1, f.opacity * pulse * visibilityOpacity);

    if (f.crystalline) {
      drawIceCrystal(ctx, px, py, f.radius, f.rotation, alpha * 0.88);
    } else {
      const glowRadius = f.radius * (f.layer === 0 ? 2.8 : 2.2);
      const grad = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
      if (f.layer === 2) {
        grad.addColorStop(0, `rgba(240, 249, 255, ${alpha.toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(186, 230, 253, ${(alpha * 0.58).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(125, 211, 252, 0)');
      } else {
        grad.addColorStop(0, `rgba(224, 242, 254, ${alpha.toFixed(3)})`);
        grad.addColorStop(0.55, `rgba(147, 197, 253, ${(alpha * 0.36).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
