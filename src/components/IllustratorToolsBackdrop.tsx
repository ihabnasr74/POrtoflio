import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function PenToolGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M44 8L56 20L49 27L37 15L44 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M37 15L18 24L10 54L40 46L49 27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10 54L27 37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="29" cy="35" r="3.2" stroke="#E8C278" strokeWidth="1.9" />
      <rect x="7" y="51" width="6" height="6" stroke="#22D3EE" strokeWidth="1.8" />
    </svg>
  );
}

function DirectSelectGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 10L48 33L32 36L24 52L16 10Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <line x1="16" y1="10" x2="6" y2="20" stroke="#E8C278" strokeWidth="1.6" strokeDasharray="3 3" />
      <circle cx="6" cy="20" r="3.2" stroke="#E8C278" strokeWidth="1.8" />
      <rect x="13" y="7" width="6" height="6" stroke="#22D3EE" strokeWidth="1.8" />
    </svg>
  );
}

function EyedropperGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M40 12C44 8 50 8 54 12C58 16 58 22 54 26L46 34L32 20L40 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M29 17L47 35" stroke="#E8C278" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M34 22L14 42L12 52L22 50L42 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="56" r="3" stroke="#22D3EE" strokeWidth="1.8" />
    </svg>
  );
}

function ShapeBuilderGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle cx="26" cy="26" r="14" stroke="currentColor" strokeWidth="1.9" />
      <rect x="26" y="26" width="26" height="26" rx="4" stroke="#E8C278" strokeWidth="1.9" strokeDasharray="4 3" />
      <path d="M44 44L56 50L50 56L44 44Z" stroke="#22D3EE" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

function BezierCurveWireframe({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 140" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 112 C 62 18, 128 18, 136 72 C 144 124, 206 118, 244 28"
        stroke="url(#bezierWireGrad)"
        strokeWidth="2"
      />
      <line x1="16" y1="112" x2="62" y2="18" stroke="#22D3EE" strokeOpacity="0.82" strokeWidth="1.35" />
      <line x1="244" y1="28" x2="206" y2="118" stroke="#E8C278" strokeOpacity="0.82" strokeWidth="1.35" />
      <circle cx="62" cy="18" r="4.2" stroke="#22D3EE" strokeWidth="1.7" />
      <circle cx="206" cy="118" r="4.2" stroke="#E8C278" strokeWidth="1.7" />
      <rect x="12" y="108" width="8" height="8" stroke="#22D3EE" strokeWidth="1.7" />
      <rect x="132" y="68" width="8" height="8" stroke="#F4F1EA" strokeWidth="1.7" />
      <rect x="240" y="24" width="8" height="8" stroke="#E8C278" strokeWidth="1.7" />
      <defs>
        <linearGradient id="bezierWireGrad" x1="16" y1="112" x2="244" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#F4F1EA" stopOpacity="0.85" />
          <stop offset="1" stopColor="#E8C278" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ArtboardCropCluster({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" fill="none" className={className} aria-hidden="true">
      <circle cx="90" cy="90" r="64" stroke="#22D3EE" strokeOpacity="0.68" strokeWidth="1.4" strokeDasharray="5 5" />
      <circle cx="90" cy="90" r="38" stroke="#E8C278" strokeOpacity="0.72" strokeWidth="1.4" />
      <rect x="26" y="26" width="128" height="128" stroke="currentColor" strokeOpacity="0.62" strokeWidth="1.35" strokeDasharray="4 4" />
      <rect x="22" y="22" width="8" height="8" fill="#06080D" stroke="#22D3EE" strokeWidth="1.6" />
      <rect x="150" y="22" width="8" height="8" fill="#06080D" stroke="#E8C278" strokeWidth="1.6" />
      <rect x="22" y="150" width="8" height="8" fill="#06080D" stroke="#E8C278" strokeWidth="1.6" />
      <rect x="150" y="150" width="8" height="8" fill="#06080D" stroke="#22D3EE" strokeWidth="1.6" />
      <line x1="90" y1="14" x2="90" y2="166" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.15" />
      <line x1="14" y1="90" x2="166" y2="90" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.15" />
    </svg>
  );
}

export function IllustratorToolsBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const deepPlaneRef = useRef<HTMLDivElement>(null);
  const midPlaneRef = useRef<HTMLDivElement>(null);
  const forePlaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      // Deep background depth layer — calm, inertia-smoothed drift
      if (deepPlaneRef.current) {
        gsap.fromTo(
          deepPlaneRef.current,
          { yPercent: 18, xPercent: -4, rotate: -4 },
          {
            yPercent: -20,
            xPercent: 4,
            rotate: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Mid depth layer — counter-drifting Illustrator tool icons
      if (midPlaneRef.current) {
        gsap.fromTo(
          midPlaneRef.current,
          { yPercent: 34, xPercent: 6, rotate: 7 },
          {
            yPercent: -38,
            xPercent: -6,
            rotate: -9,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Foreground-mid depth layer — faster parallax separation with silky inertia
      if (forePlaneRef.current) {
        gsap.fromTo(
          forePlaneRef.current,
          { yPercent: 54, xPercent: -5, scale: 0.94, rotate: -12 },
          {
            yPercent: -56,
            xPercent: 5,
            scale: 1.07,
            rotate: 14,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>('.ai-parallax-glyph').forEach((glyph, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        gsap.to(glyph, {
          rotate: dir * (18 + (idx % 3) * 8),
          y: dir * 32,
          x: -dir * 14,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      data-testid="illustrator-parallax-layer"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full overflow-hidden"
    >
      {/* Deep Background Plane: Luminous Artboard Grids & Large Curved Bezier Wireframes */}
      <div ref={deepPlaneRef} className="absolute -inset-12 will-change-transform">
        <div className="ai-parallax-glyph absolute top-[11%] left-[5%] animate-aura-pulse">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22)_0%,transparent_70%)] blur-xl" />
          <ArtboardCropCluster className="relative w-52 h-52 text-[#22D3EE]/42 drop-shadow-[0_0_16px_rgba(34,211,238,0.42)]" />
        </div>

        <div className="ai-parallax-glyph absolute top-[52%] right-[3%] animate-aura-pulse">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(200,164,107,0.22)_0%,transparent_70%)] blur-xl" />
          <BezierCurveWireframe className="relative w-76 h-44 opacity-45 drop-shadow-[0_0_16px_rgba(232,194,120,0.4)]" />
        </div>

        <div className="ai-parallax-glyph absolute bottom-[8%] left-[16%] animate-aura-pulse">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(200,164,107,0.2)_0%,transparent_70%)] blur-xl" />
          <ArtboardCropCluster className="relative w-48 h-48 text-[#E8C278]/40 drop-shadow-[0_0_16px_rgba(232,194,120,0.38)]" />
        </div>
      </div>

      {/* Mid Parallax Plane: Illuminated Adobe Illustrator Vector Tools */}
      <div ref={midPlaneRef} className="absolute -inset-16 will-change-transform">
        <div className="ai-parallax-glyph absolute top-[16%] right-[11%] animate-aura-pulse">
          <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.26)_0%,transparent_72%)] blur-xl" />
          <PenToolGlyph className="relative w-20 h-20 sm:w-24 sm:h-24 text-[#22D3EE]/46 drop-shadow-[0_0_20px_rgba(34,211,238,0.55)]" />
        </div>

        <div className="ai-parallax-glyph absolute top-[43%] left-[7%] animate-aura-pulse">
          <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(232,194,120,0.24)_0%,transparent_72%)] blur-xl" />
          <ShapeBuilderGlyph className="relative w-20 h-20 sm:w-24 sm:h-24 text-[#E8C278]/46 drop-shadow-[0_0_20px_rgba(232,194,120,0.52)]" />
        </div>

        <div className="ai-parallax-glyph absolute bottom-[21%] right-[14%] animate-aura-pulse">
          <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24)_0%,transparent_72%)] blur-xl" />
          <EyedropperGlyph className="relative w-18 h-18 sm:w-22 sm:h-22 text-[#22D3EE]/44 drop-shadow-[0_0_18px_rgba(34,211,238,0.5)]" />
        </div>

        <BezierCurveWireframe className="ai-parallax-glyph absolute top-[25%] left-[27%] w-68 h-38 opacity-38 -rotate-12 drop-shadow-[0_0_14px_rgba(34,211,238,0.38)]" />
      </div>

      {/* Foreground-Mid Parallax Plane: Glowing Direct Selection Arrows, Pen Nibs & Anchor Nodes */}
      <div ref={forePlaneRef} className="absolute -inset-20 will-change-transform">
        <div className="ai-parallax-glyph absolute top-[30%] right-[23%] animate-aura-pulse">
          <div className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24)_0%,transparent_72%)] blur-lg" />
          <DirectSelectGlyph className="relative w-16 h-16 sm:w-20 sm:h-20 text-[#F4F1EA]/42 drop-shadow-[0_0_18px_rgba(34,211,238,0.5)]" />
        </div>

        <div className="ai-parallax-glyph absolute bottom-[32%] left-[21%] animate-aura-pulse">
          <div className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24)_0%,transparent_72%)] blur-lg" />
          <PenToolGlyph className="relative w-14 h-14 sm:w-16 sm:h-16 text-[#22D3EE]/44 drop-shadow-[0_0_18px_rgba(34,211,238,0.52)]" />
        </div>

        <div className="ai-parallax-glyph absolute top-[71%] right-[7%] animate-aura-pulse">
          <div className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(232,194,120,0.24)_0%,transparent_72%)] blur-lg" />
          <DirectSelectGlyph className="relative w-14 h-14 sm:w-16 sm:h-16 text-[#E8C278]/44 drop-shadow-[0_0_18px_rgba(232,194,120,0.48)]" />
        </div>
      </div>
    </div>
  );
}
