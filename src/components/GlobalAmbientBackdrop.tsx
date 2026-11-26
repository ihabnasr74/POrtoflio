import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  createLightingDots,
  renderLightingDotsCanvas,
  type LightingRgbPalette,
} from '../utils/ambientParticles';
import { IllustratorToolsBackdrop } from './IllustratorToolsBackdrop';

gsap.registerPlugin(ScrollTrigger);

const GLOBAL_LIGHTING_PALETTE: LightingRgbPalette = {
  primary: [56, 217, 240],
  secondary: [232, 194, 120],
  highlight: [244, 248, 255],
};

export function GlobalAmbientBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const postIntroAtmosphereRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);
  const volumetricBeamRef = useRef<HTMLDivElement>(null);
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      reduced ||
      !containerRef.current ||
      !postIntroAtmosphereRef.current ||
      !glowLayerRef.current ||
      !volumetricBeamRef.current
    ) {
      return;
    }

    let ctx: gsap.Context | null = null;
    const rafId = requestAnimationFrame(() => {
      if (
        !containerRef.current ||
        !postIntroAtmosphereRef.current ||
        !glowLayerRef.current ||
        !volumetricBeamRef.current
      ) {
        return;
      }
      const heroTrigger = document.getElementById('hero') ?? document.documentElement;

      ctx = gsap.context(() => {
        // Keep the first screen (#intro) focused on the pre-logo Illustrator animation; reveal parallax tool icons once #hero enters
        gsap.fromTo(
          postIntroAtmosphereRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            immediateRender: true,
            scrollTrigger: {
              trigger: heroTrigger,
              start: 'top 95%',
              end: 'top 30%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        // Counter-parallax on deeper ambient rim glow pools after #intro
        gsap.fromTo(
          glowLayerRef.current,
          { opacity: 0.65, yPercent: 18, xPercent: -8, scale: 0.94 },
          {
            opacity: 1,
            yPercent: -18,
            xPercent: 8,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.85,
            },
          }
        );

        // Subtle sweeping cyan & gold volumetric light beams across sections
        gsap.fromTo(
          volumetricBeamRef.current,
          { xPercent: -26, yPercent: -10, rotate: -14, opacity: 0.55 },
          {
            xPercent: 26,
            yPercent: 10,
            rotate: 14,
            opacity: 0.9,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.75,
            },
          }
        );
      }, containerRef);
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  // Fluid, native-frame ambient sparkles & soft glowing light particles across all pages
  useEffect(() => {
    const canvas = ambientCanvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let prevTime = performance.now();
    const startTime = prevTime;

    const dots = createLightingDots(62);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - prevTime) / 1000));
      prevTime = now;
      const elapsed = (now - startTime) / 1000;

      renderLightingDotsCanvas(
        ctx,
        dots,
        dt,
        elapsed,
        width,
        height,
        GLOBAL_LIGHTING_PALETTE,
        0
      );

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="global-ambient-backdrop"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#06080D]"
    >
      {/* Always-On Soft Studio Ambient Lighting (Breaks Up Solid Black Across #intro, #hero & All Pages) */}
      <div
        data-testid="ambient-studio-lighting"
        className="absolute inset-0 w-full h-full"
      >
        {/* Central Deep Sapphire-Teal Studio Dome */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 84% 66% at 50% 38%, rgba(18, 62, 84, 0.42) 0%, rgba(12, 29, 44, 0.24) 46%, rgba(6, 8, 13, 0) 80%)',
          }}
        />
        {/* Soft Warm Amber Corner Fill & Cool Cyan Upper-Left Rim Glow */}
        <div className="animate-orb-a absolute -top-28 -left-24 w-[760px] h-[760px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.16)_0%,rgba(22,82,110,0.09)_42%,transparent_72%)] blur-2xl" />
        <div className="animate-orb-b absolute -bottom-32 -right-24 w-[820px] h-[820px] rounded-full bg-[radial-gradient(circle,rgba(200,164,107,0.14)_0%,rgba(148,104,52,0.08)_44%,transparent_74%)] blur-2xl" />
        {/* Delicate Upper-Right Champagne Studio Bloom */}
        <div className="animate-aura-pulse absolute top-[12%] right-[8%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,194,120,0.09)_0%,rgba(34,211,238,0.06)_48%,transparent_76%)] blur-2xl" />
      </div>

      {/* Post-Intro Atmospheric Depth + Parallax Adobe Illustrator Vector Tools */}
      <div
        ref={postIntroAtmosphereRef}
        className="absolute inset-0 w-full h-full opacity-0"
      >
        <div
          ref={volumetricBeamRef}
          className="absolute -inset-24 will-change-transform mix-blend-screen"
        >
          <div
            className="w-full h-full animate-god-ray"
            style={{
              background:
                'linear-gradient(112deg, transparent 14%, rgba(34,211,238,0.22) 34%, rgba(255,255,255,0.09) 46%, rgba(200,164,107,0.22) 58%, transparent 80%)',
            }}
          />
        </div>

        <div
          ref={glowLayerRef}
          className="absolute inset-0 will-change-transform mix-blend-screen"
        >
          <div className="absolute -top-24 -left-20 w-[820px] h-[820px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24)_0%,rgba(34,211,238,0.08)_46%,transparent_74%)] animate-aura-pulse" />
          <div className="absolute -bottom-24 -right-20 w-[820px] h-[820px] rounded-full bg-[radial-gradient(circle,rgba(200,164,107,0.24)_0%,rgba(200,164,107,0.08)_46%,transparent_74%)] animate-aura-pulse" />
        </div>

        {/* Scattered Adobe Illustrator Vector Tools & Wireframes Parallax Layer */}
        <IllustratorToolsBackdrop />
      </div>

      {/* Always-Active Smooth Fluid Sparkles & Light Particles */}
      <canvas
        ref={ambientCanvasRef}
        data-testid="ambient-sparkles-canvas"
        className="absolute inset-0 w-full h-full opacity-90"
      />

      {/* Gentle Studio Edge Vignette Preserving Edge Contrast Without Crushing Center Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(4,5,8,0.44)_100%)]" />
    </div>
  );
}
