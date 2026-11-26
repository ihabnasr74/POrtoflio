import { useEffect, useRef, useState } from 'react';
import {
  createFrostFlakes,
  renderFrostSnowCanvas,
} from '../utils/frostParticles';

interface FrostViewportOverlayProps {
  isActive: boolean;
}

export function FrostViewportOverlay({ isActive }: FrostViewportOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strengthRef = useRef<number>(isActive ? 1 : 0);
  const targetRef = useRef<number>(isActive ? 1 : 0);
  const [shouldRenderLoop, setShouldRenderLoop] = useState(isActive);

  useEffect(() => {
    targetRef.current = isActive ? 1 : 0;

    if (isActive) {
      setShouldRenderLoop(true);
      return;
    }

    const stopTimer = window.setTimeout(() => {
      if (targetRef.current === 0) {
        setShouldRenderLoop(false);
      }
    }, 560);

    return () => {
      window.clearTimeout(stopTimer);
    };
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let lastTime = performance.now();
    const startTime = lastTime;
    const flakes = createFrostFlakes(96);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = (now: number) => {
      const particleDtSec = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const target = targetRef.current;
      strengthRef.current += (target - strengthRef.current) * Math.min(1, particleDtSec * 8);

      if (width > 0 && height > 0) {
        renderFrostSnowCanvas(
          ctx,
          flakes,
          particleDtSec,
          (now - startTime) / 1000,
          width,
          height,
          Math.max(0.35, strengthRef.current)
        );
      }

      rafId = requestAnimationFrame(draw);
    };

    if (shouldRenderLoop) {
      rafId = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [shouldRenderLoop]);

  return (
    <div
      data-testid="frost-viewport-overlay"
      data-frost-active={isActive ? 'true' : 'false'}
      aria-hidden="true"
      style={{ opacity: isActive ? 1 : 0 }}
      className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-500 ease-out will-change-[opacity]"
    >
      {/* Perimeter Wintry Mist & Ice Haze Frame (Center 72% stays razor-sharp, zero compositor stall) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 78% 74% at 50% 50%, transparent 56%, rgba(147, 213, 250, 0.08) 78%, rgba(224, 242, 254, 0.18) 100%)',
        }}
      />

      {/* Creeping Glacial Cyan & Frost-White Corner Vignettes */}
      <div
        className={`absolute inset-0 transition-transform duration-700 ease-out ${
          isActive ? 'scale-100' : 'scale-[1.06]'
        }`}
        style={{
          background: [
            'radial-gradient(50% 45% at 0% 0%, rgba(224, 242, 254, 0.28) 0%, rgba(125, 211, 252, 0.14) 38%, rgba(56, 189, 248, 0.04) 64%, transparent 82%)',
            'radial-gradient(50% 45% at 100% 0%, rgba(224, 242, 254, 0.28) 0%, rgba(125, 211, 252, 0.14) 38%, rgba(56, 189, 248, 0.04) 64%, transparent 82%)',
            'radial-gradient(50% 45% at 0% 100%, rgba(224, 242, 254, 0.26) 0%, rgba(125, 211, 252, 0.12) 38%, rgba(56, 189, 248, 0.04) 64%, transparent 82%)',
            'radial-gradient(50% 45% at 100% 100%, rgba(224, 242, 254, 0.26) 0%, rgba(125, 211, 252, 0.12) 38%, rgba(56, 189, 248, 0.04) 64%, transparent 82%)',
            'linear-gradient(to bottom, rgba(224, 242, 254, 0.16) 0%, transparent 10%, transparent 90%, rgba(224, 242, 254, 0.16) 100%)',
            'linear-gradient(to right, rgba(186, 230, 253, 0.14) 0%, transparent 8%, transparent 92%, rgba(186, 230, 253, 0.14) 100%)',
          ].join(', '),
          boxShadow: 'inset 0 0 110px rgba(186, 230, 253, 0.24)',
        }}
      />

      {/* Organic Feather-Fine Crystalline Ice Ferns Creeping Softly From Corners */}
      {[
        'top-0 left-0',
        'top-0 right-0 -scale-x-100',
        'bottom-0 left-0 -scale-y-100',
        'bottom-0 right-0 -scale-x-100 -scale-y-100',
      ].map((posClass, idx) => (
        <svg
          key={posClass}
          viewBox="0 0 280 280"
          fill="none"
          className={`absolute ${posClass} w-44 h-44 sm:w-64 sm:h-64 lg:w-72 lg:h-72 text-[#E0F2FE]/32 blur-[0.35px] transition-opacity duration-700 ease-out ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: isActive ? undefined : `scale(${0.88 + idx * 0.01})`,
          }}
        >
          <defs>
            <linearGradient id={`frost-grad-${idx}`} x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
              <stop offset="45%" stopColor="#BAE6FD" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 0 Q58 28 118 92 Q146 120 184 134 M42 26 Q76 14 114 28 M68 50 Q108 46 144 68 M96 78 Q88 116 106 148 M0 42 Q32 78 66 132 Q80 156 84 196 M24 72 Q6 102 18 142 M46 104 Q76 120 112 126 M78 0 Q96 34 140 52 M122 0 Q138 22 178 26"
            stroke={`url(#frost-grad-${idx})`}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M12 10 Q42 54 78 82 M18 110 Q48 134 62 172 M116 18 Q154 32 192 22"
            stroke={`url(#frost-grad-${idx})`}
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </svg>
      ))}

      {/* Multi-Layered 60fps Snowfall & Crystalline Flakes Canvas */}
      <canvas
        ref={canvasRef}
        data-testid="frost-snow-canvas"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
