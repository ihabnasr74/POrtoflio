import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESIGNER_PROFILE, PORTFOLIO_PROJECTS } from '../data/portfolioData';
import {
  flattenExhibitionPlates,
  getNextExhibitionIndex,
  type ExhibitionPlate,
} from '../utils/portfolioFilters';
import { playCrtChannelSwitchSound, unlockCrtAudio } from '../utils/crtAudio';
import { getCrtGlowPalette } from '../utils/exhibitionPalette';
import { classifyPlateSensoryMood, type SensoryMood } from '../utils/sensoryMood';
import { ArtworkImage } from './ArtworkImage';
import { MagneticButton } from './MagneticButton';
import { KineticWatermark } from './KineticWatermark';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExploreWorks: () => void;
  onSelectProject: (projectId: string) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onHeroMoodStateChange?: (isVisible: boolean, mood: SensoryMood) => void;
}

const AUTO_CYCLE_MS = 1600;
const STATIC_BURST_MS = 280;

function CrtPlateVisual({
  plate,
  priority = false,
}: {
  plate: ExhibitionPlate;
  priority?: boolean;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#05070A]">
      {/* Subtle dark-studio ambient glass fill preventing harsh borders on portrait or widescreen plates */}
      <img
        src={plate.src}
        alt=""
        aria-hidden="true"
        decoding="async"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-30 brightness-[0.42] saturate-125 select-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_44%,rgba(4,5,8,0.82)_100%)]"
      />
      <ArtworkImage
        src={plate.src}
        alt={plate.alt}
        testId="crt-plate-image"
        priority={priority}
        fit="contain"
        className="relative z-10 w-full h-full object-contain object-center block p-2 sm:p-2.5"
      />
    </div>
  );
}

export function HeroSection({
  onExploreWorks,
  onSelectProject,
  isMuted,
  onToggleSound,
  onHeroMoodStateChange,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleLinesRef = useRef<HTMLDivElement>(null);
  const leftParallaxRef = useRef<HTMLDivElement>(null);
  const stageParallaxRef = useRef<HTMLDivElement>(null);
  const metricsParallaxRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // CRT screen & analog transition refs
  const incomingRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const glowPulseRef = useRef<HTMLDivElement>(null);
  const metaRefreshRef = useRef<HTMLDivElement>(null);
  const beamLineRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const allPlates = useMemo(() => flattenExhibitionPlates(PORTFOLIO_PROJECTS, 'all'), []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transitionId, setTransitionId] = useState(0);
  const [isTuning, setIsTuning] = useState(false);
  const [dialAngle, setDialAngle] = useState(18);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lx: 50, ly: 40 });

  const activePlate = allPlates[activeIndex] ?? allPlates[0];
  const outgoingPlate = outgoingIndex !== null ? allPlates[outgoingIndex] : null;
  const totalPlates = allPlates.length;
  const glowPalette = useMemo(() => getCrtGlowPalette(activePlate), [activePlate]);
  const activeSensoryMood = useMemo(
    () =>
      classifyPlateSensoryMood({
        projectId: activePlate.projectId,
        caption: activePlate.caption,
        subSeries: activePlate.subSeries,
      }),
    [activePlate.caption, activePlate.projectId, activePlate.subSeries]
  );

  useEffect(() => {
    onHeroMoodStateChange?.(isHeroVisible, activeSensoryMood);
  }, [isHeroVisible, activeSensoryMood, onHeroMoodStateChange]);

  const stepPlate = useCallback(
    (delta: 1 | -1, fromUserGesture = false) => {
      if (allPlates.length <= 1) return;
      if (fromUserGesture) {
        unlockCrtAudio(isMutedRef.current);
      }
      setActiveIndex((prev) => {
        const next = getNextExhibitionIndex(prev, delta, allPlates.length);
        setOutgoingIndex(prev);
        setDirection(delta);
        setDialAngle((angle) => angle + delta * 28);
        setTransitionId((n) => n + 1);
        return next;
      });
    },
    [allPlates.length]
  );

  // Track whether #hero is visible so channel cycling begins cleanly on CH 01
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsHeroVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Brisk 1.6s sequential auto-cycling through ALL artworks; pauses cleanly on hover or Pause button
  useEffect(() => {
    if (!isHeroVisible || isHovered || isPaused || allPlates.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      stepPlate(1);
    }, AUTO_CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [isHeroVisible, isHovered, isPaused, allPlates.length, stepPlate]);

  // Preload upcoming channels seamlessly so beam lock-in is instant
  useEffect(() => {
    if (allPlates.length === 0) return;
    const upcoming = [
      getNextExhibitionIndex(activeIndex, 1, allPlates.length),
      getNextExhibitionIndex(activeIndex, 2, allPlates.length),
      getNextExhibitionIndex(activeIndex, -1, allPlates.length),
    ];
    upcoming.forEach((idx) => {
      const preload = new Image();
      preload.referrerPolicy = 'no-referrer';
      preload.src = allPlates[idx].src;
    });
  }, [activeIndex, allPlates]);

  // GSAP entrance reveals & dramatic multi-layer scroll parallax
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !titleLinesRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const heroNameTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 96%',
          once: true,
        },
      });

      heroNameTl.fromTo(
        '.hero-name-char',
        {
          yPercent: 24,
          opacity: 0,
          rotateX: -14,
          scale: 0.96,
          filter: 'blur(4px)',
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.62,
          stagger: 0.028,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter',
        },
        0
      );

      heroNameTl
        .fromTo(
          '.hero-title-slash',
          { xPercent: -135, opacity: 0 },
          { xPercent: 145, opacity: 0.72, duration: 0.78, ease: 'power3.inOut' },
          0.1
        )
        .to(
          '.hero-title-slash',
          { opacity: 0, duration: 0.24, ease: 'power2.in' },
          0.66
        );

      gsap.from('.hero-reveal', {
        y: 22,
        opacity: 0,
        scale: 0.96,
        duration: 0.56,
        stagger: 0.05,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 96%',
          once: true,
        },
      });

      gsap.from('.hero-stage-card', {
        y: 36,
        opacity: 0,
        scale: 0.92,
        rotateX: 8,
        duration: 0.68,
        delay: 0.04,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 96%',
          once: true,
        },
      });
    }, sectionRef);

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      if (leftParallaxRef.current) {
        gsap.fromTo(
          leftParallaxRef.current,
          { yPercent: 8 },
          {
            yPercent: -24,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (stageParallaxRef.current) {
        gsap.fromTo(
          stageParallaxRef.current,
          { yPercent: -10, scale: 1.02 },
          {
            yPercent: 10,
            scale: 0.96,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (metricsParallaxRef.current) {
        gsap.fromTo(
          metricsParallaxRef.current,
          { y: 18 },
          {
            y: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  // Realistic ~280ms analog CRT static burst, sync roll, chromatic split & phosphor beam lock-in
  useEffect(() => {
    if (transitionId === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setOutgoingIndex(null);
      setIsTuning(false);
      return;
    }

    setIsTuning(true);
    playCrtChannelSwitchSound(isMutedRef.current);
    let rafId = 0;
    let clearTimer = 0;
    const startTime = performance.now();
    const canvas = staticCanvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const clearStaticCanvas = () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (canvas && ctx) {
      const w = 180;
      const h = 135;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      const imgData = ctx.createImageData(w, h);

      const renderNoise = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / STATIC_BURST_MS);

        if (elapsed >= STATIC_BURST_MS) {
          clearStaticCanvas();
          return;
        }

        const data = imgData.data;
        const intensity = progress < 0.5 ? 1 : Math.max(0, 1 - (progress - 0.5) * 2);
        const tearBandY = Math.floor(((elapsed * 0.65) % 1) * h);

        for (let y = 0; y < h; y++) {
          const inTearBand = Math.abs(y - tearBandY) < 7;
          const rowBias = inTearBand ? 55 : 0;
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const grain = Math.random() * 255;
            const v = Math.min(255, grain + rowBias);
            // Slight cyan/warm-gold phosphor tint inside crisp monochrome CRT snow
            data[i] = v;
            data[i + 1] = Math.min(255, v + (inTearBand ? 14 : 4));
            data[i + 2] = Math.min(255, v + (inTearBand ? 24 : 8));
            data[i + 3] = Math.floor(235 * intensity);
          }
        }
        ctx.putImageData(imgData, 0, 0);
        rafId = requestAnimationFrame(renderNoise);
      };

      renderNoise();
      clearTimer = window.setTimeout(() => {
        cancelAnimationFrame(rafId);
        clearStaticCanvas();
        setIsTuning(false);
      }, STATIC_BURST_MS);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        cancelAnimationFrame(rafId);
        window.clearTimeout(clearTimer);
        clearStaticCanvas();
        setOutgoingIndex(null);
        setIsTuning(false);
      },
    });

    // Outgoing signal loss: horizontal sync roll & vertical collapse without CSS color filters
    if (outgoingRef.current) {
      tl.fromTo(
        outgoingRef.current,
        {
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          skewX: 0,
        },
        {
          opacity: 0,
          xPercent: -6 * direction,
          yPercent: -12 * direction,
          scaleY: 0.14,
          scaleX: 1.09,
          skewX: 8 * direction,
          duration: 0.12,
          ease: 'power2.in',
        },
        0
      );
    }

    // Horizontal phosphor beam flash across the CRT middle during lock-in
    if (beamLineRef.current) {
      tl.fromTo(
        beamLineRef.current,
        { opacity: 0.95, scaleX: 0.25, scaleY: 1 },
        { opacity: 0, scaleX: 1.15, scaleY: 3.5, duration: 0.22, ease: 'power3.out' },
        0.06
      );
    }

    // Incoming artwork: true-color unfiltered beam lock-in settling cleanly to crisp full-frame
    if (incomingRef.current) {
      tl.fromTo(
        incomingRef.current,
        {
          opacity: 0,
          yPercent: 9 * direction,
          xPercent: 3 * direction,
          scaleY: 0.08,
          scaleX: 1.07,
          skewX: -5 * direction,
        },
        {
          opacity: 1,
          yPercent: 0,
          xPercent: 0,
          scaleY: 1,
          scaleX: 1,
          skewX: 0,
          duration: 0.19,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        },
        0.09
      );
    }

    // Ambient CRT phosphor spill pulse onto surrounding hero backdrop
    if (glowPulseRef.current) {
      tl.fromTo(
        glowPulseRef.current,
        { opacity: 0.45, scale: 0.94 },
        { opacity: 1, scale: 1.06, duration: 0.12, ease: 'power2.out' },
        0
      ).to(
        glowPulseRef.current,
        { opacity: 0.65, scale: 1, duration: 0.16, ease: 'power2.out' },
        0.12
      );
    }

    if (metaRefreshRef.current) {
      tl.fromTo(
        metaRefreshRef.current,
        { opacity: 0.45, y: 4 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        0.08
      );
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(clearTimer);
      clearStaticCanvas();
      tl.kill();
    };
  }, [transitionId, direction]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - ny) * 6,
      ry: (nx - 0.5) * 8,
      lx: Math.round(nx * 100),
      ly: Math.round(ny * 100),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, lx: 50, ly: 40 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const diff = touchStartXRef.current - endX;
    touchStartXRef.current = null;
    if (Math.abs(diff) > 36) {
      stepPlate(diff > 0 ? 1 : -1);
    }
  };

  const progressPercent = totalPlates > 0 ? ((activeIndex + 1) / totalPlates) * 100 : 0;

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative scroll-mt-16 md:scroll-mt-20 min-h-screen flex flex-col justify-between pt-24 sm:pt-28 md:pt-28 pb-8 sm:pb-10 px-5 sm:px-8 lg:px-12 overflow-hidden bg-[#06080D]/28"
    >
      <KineticWatermark text="IHAB NASR · PACKAGING · IDENTITY" direction={-1} className="top-20" />

      {/* Top Luminous Rim Seam */}
      <div
        aria-hidden="true"
        className="animate-rim-glow pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/70 to-transparent shadow-[0_0_22px_rgba(34,211,238,0.45)]"
      />

      {/* Persistent Ambient Hero Studio Glows + Pointer-Reactive Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 56% at 18% 42%, rgba(200, 164, 107, 0.13) 0%, transparent 72%), radial-gradient(64% 60% at 78% 48%, rgba(34, 211, 238, 0.14) 0%, rgba(16, 56, 78, 0.16) 45%, transparent 78%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(720px circle at ${tilt.lx}% ${tilt.ly}%, rgba(200, 164, 107, 0.2), rgba(34, 211, 238, 0.11) 42%, transparent 72%)`,
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-grain opacity-50" />

      {/* Main Split Composition */}
      <div
        ref={titleLinesRef}
        className="relative z-10 mx-auto w-full max-w-[1440px] flex-1 grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-8 items-center py-3 sm:py-6 md:py-10 perspective-stage"
      >
        {/* Left: Monumental Typography & Identity */}
        <div
          ref={leftParallaxRef}
          className="lg:col-span-5 flex flex-col justify-center will-change-transform"
        >
          <div className="hero-reveal flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.2em] uppercase text-[#C8A46B]">
            <span className="whitespace-nowrap">Graphic Designer</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="whitespace-nowrap">Creative Visual Designer</span>
          </div>

          <h1
            aria-label="Ihab Nasr"
            data-testid="hero-name-heading"
            className="relative mt-4 sm:mt-5 font-serif text-[clamp(3.25rem,6.7vw,6.25rem)] leading-[1.04] tracking-[0.02em] font-light text-[#F4F1EA] py-1 [perspective:900px]"
          >
            <span className="block pb-0.5">
              {'Ihab'.split('').map((ch, i) => (
                <span
                  key={`hero-first-${i}`}
                  className="hero-name-char inline-block px-[0.015em] bg-gradient-to-b from-[#FFFFFF] via-[#E5EAF1] to-[#9BA6B6] bg-clip-text text-transparent will-change-[transform,opacity,filter]"
                >
                  {ch}
                </span>
              ))}
            </span>
            <span className="block pb-0.5">
              {'Nasr'.split('').map((ch, i) => (
                <span
                  key={`hero-last-${i}`}
                  className="hero-name-char inline-block px-[0.015em] bg-gradient-to-b from-[#F4DFB4] via-[#C8A46B] to-[#9B783E] bg-clip-text text-transparent will-change-[transform,opacity,filter]"
                >
                  {ch}
                </span>
              ))}
            </span>

            {/* Subtle Chromatic Silver-and-Gold Sheen Sweeping Across Slender Letterforms */}
            <span
              aria-hidden="true"
              className="hero-title-slash pointer-events-none absolute -inset-y-4 -inset-x-6 opacity-0 mix-blend-screen will-change-transform"
              style={{
                background:
                  'linear-gradient(108deg, transparent 34%, rgba(226,232,240,0.45) 45%, rgba(255,255,255,0.88) 50%, rgba(200,164,107,0.48) 55%, transparent 66%)',
              }}
            />
          </h1>

          <p className="hero-reveal mt-5 sm:mt-6 text-xs sm:text-sm lg:text-[13px] xl:text-sm tracking-[0.04em] uppercase text-[#B8B2A7] font-medium">
            {DESIGNER_PROFILE.disciplines.join(' — ')}
          </p>

          <p className="hero-reveal mt-4 sm:mt-5 max-w-xl text-[15px] sm:text-base md:text-lg leading-relaxed text-[#9A958C]">
            {DESIGNER_PROFILE.bioLead} Sculpting cohesive brand identities, shelf-commanding packaging systems, and atmospheric product visuals.
          </p>

          <div className="hero-reveal mt-7 sm:mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-6">
            <MagneticButton
              onClick={onExploreWorks}
              cursorLabel="Explore"
              className="inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase bg-[#F4F1EA] text-[#050506] hover:bg-[#C8A46B] transition-colors"
            >
              <span>Explore Selected Works</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </MagneticButton>

            <a
              href="#pinned-showcase"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pinned-showcase')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#B8B2A7] hover:text-[#F4F1EA] transition-colors py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A46B]"
            >
              <ArrowDown className="w-3.5 h-3.5 text-[#C8A46B]" aria-hidden="true" />
              <span>Scroll Reel</span>
            </a>
          </div>
        </div>

        {/* Right: Monumental Vintage CRT Television */}
        <div className="lg:col-span-7 flex items-center justify-center lg:pl-4">
          <div
            ref={stageParallaxRef}
            className="relative w-full max-w-[820px] mx-auto will-change-transform"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >

            <div
              ref={stageRef}
              data-testid="hero-3d-stage"
              role="region"
              aria-roledescription="carousel"
              aria-label={`Retro CRT Television broadcasting all ${totalPlates} portfolio artworks`}
              className="hero-stage-card relative w-full perspective-stage transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${tilt.rx * 0.85}deg) rotateY(${tilt.ry * 0.85}deg)`,
              }}
            >
              {/* Ambient CRT Phosphor Glow Spilling Onto Dark Hero Stage */}
              <div
                ref={glowPulseRef}
                aria-hidden="true"
                className="pointer-events-none absolute -inset-12 -z-10 opacity-75 mix-blend-screen will-change-transform transition-[background] duration-500"
                style={{
                  background: `radial-gradient(66% 62% at 46% 44%, rgba(${glowPalette.primaryRgb}, 0.34) 0%, rgba(${glowPalette.secondaryRgb}, 0.2) 38%, rgba(200,164,107,0.14) 64%, transparent 82%)`,
                }}
              />

              {/* Dark-Metallic & Brushed-Charcoal Vintage CRT Television Chassis */}
              <div className="relative rounded-[22px] sm:rounded-[30px] border border-white/20 bg-gradient-to-b from-[#23262F] via-[#12141A] to-[#08090C] p-2.5 sm:p-4 lg:p-5 shadow-[0_38px_90px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-2px_8px_rgba(0,0,0,0.85)]">
                {/* Subtle Brushed Metallic Top Rim Highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#22D3EE]/55 via-50% to-transparent"
                />

                {/* Corner Machined Chassis Screws */}
                <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-3 w-1.5 h-1.5 rounded-full bg-[#3A3F4B] border border-black/70 shadow-inner" />
                <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-3 w-1.5 h-1.5 rounded-full bg-[#3A3F4B] border border-black/70 shadow-inner" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-3 w-1.5 h-1.5 rounded-full bg-[#3A3F4B] border border-black/70 shadow-inner" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-3 w-1.5 h-1.5 rounded-full bg-[#3A3F4B] border border-black/70 shadow-inner" />

                {/* Inner Cabinet Layout: Larger Curved Screen Bay + Tactile Brushed Tuner Panel */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-stretch">
                  {/* Left: Molded CRT Bezel & Larger Curved Phosphor Glass Tube */}
                  <div className="relative flex-1 min-w-0 rounded-[18px] sm:rounded-[22px] border-[3px] border-[#050608] bg-[#040507] p-1.5 shadow-[inset_0_8px_28px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.1)]">
                    <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[450px] lg:h-[515px] xl:h-[540px] rounded-[13px] sm:rounded-[16px] overflow-hidden bg-[#05070A] shadow-[inset_0_0_40px_rgba(0,0,0,0.9)]">
                      {/* Clickable Full-Frame CRT Screen Triggering Full Project Series Modal */}
                      <button
                        type="button"
                        data-testid="hero-active-card"
                        onClick={() => {
                          unlockCrtAudio(isMutedRef.current);
                          onSelectProject(activePlate.projectId);
                        }}
                        data-cursor="Inspect"
                        aria-label={`Inspect ${activePlate.projectTitle} — ${activePlate.caption}`}
                        className="group absolute inset-0 block w-full h-full p-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#22D3EE]"
                      >
                        {/* Outgoing Artwork Layer (Signal Loss) */}
                        {outgoingPlate && (
                          <div
                            ref={outgoingRef}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 w-full h-full will-change-transform"
                          >
                            <CrtPlateVisual plate={outgoingPlate} priority />
                          </div>
                        )}

                        {/* Incoming / Active Centered Full-Artwork Layer */}
                        <div
                          ref={incomingRef}
                          data-plate-number={activePlate.plateNumber}
                          className="absolute inset-0 w-full h-full will-change-transform transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                        >
                          <CrtPlateVisual plate={activePlate} priority />
                        </div>

                        {/* Horizontal Phosphor Beam Flash Line on Signal Lock */}
                        <div
                          ref={beamLineRef}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] z-20 opacity-0 bg-gradient-to-r from-transparent via-[#E6FCFF] to-transparent shadow-[0_0_24px_rgba(34,211,238,0.9)]"
                        />

                        {/* High-Frequency Analog Static Snow Canvas Overlay */}
                        <canvas
                          ref={staticCanvasRef}
                          data-testid="crt-static-canvas"
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-0 w-full h-full z-20 mix-blend-screen [image-rendering:pixelated] ${
                            isTuning ? 'opacity-100' : 'opacity-0'
                          }`}
                        />

                        {/* True-Color Unfiltered CRT Glass Rim Frame (Zero Color Wash or Contrast Tint) */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 z-30 rounded-[15px] border border-white/[0.08]"
                        />

                        {/* Subtle CRT OSD Channel Overlay Top-Left */}
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute top-2.5 left-3 z-30 font-mono text-[10px] tracking-[0.16em] uppercase px-1.5 py-0.5 bg-black/55 border border-white/10 transition-colors duration-150 ${
                            isTuning
                              ? 'text-[#FDE68A] border-[#C8A46B]/50'
                              : 'text-[#67E8F9]/90 border-[#22D3EE]/30'
                          }`}
                        >
                          CH {String(activePlate.plateNumber).padStart(2, '0')}
                        </span>

                        {/* Inspect Series Arrow Top-Right */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-2.5 right-2.5 z-30 w-7 h-7 flex items-center justify-center bg-black/65 border border-white/15 text-[#F4F1EA]/85 group-hover:bg-[#C8A46B] group-hover:text-[#050506] group-hover:border-[#C8A46B] transition-colors"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Brushed-Metal Vintage Tuner Control Column */}
                  <div className="shrink-0 sm:w-[92px] rounded-[14px] border border-white/10 bg-gradient-to-b from-[#1B1D24] via-[#13151B] to-[#0C0D11] px-2.5 sm:px-3 py-2 sm:py-3 flex sm:flex-col items-center justify-between gap-2 sm:gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    {/* Power / Signal LED + Brand Plate */}
                    <div className="flex sm:flex-col items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={`w-2 h-2 rounded-full transition-all duration-150 ${
                            isTuning
                              ? 'bg-[#FBBF24] shadow-[0_0_10px_#FBBF24]'
                              : isPaused || isHovered
                                ? 'bg-[#C8A46B] shadow-[0_0_8px_rgba(200,164,107,0.7)]'
                                : 'bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]'
                          }`}
                        />
                        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#9A958C]">
                          {isTuning ? 'SYNC' : isPaused || isHovered ? 'HOLD' : 'LOCK'}
                        </span>
                      </div>
                      <span className="hidden sm:block text-[8px] font-mono tracking-[0.22em] uppercase text-[#C8A46B]/80 border-b border-white/10 pb-1">
                        IHAB · CRT
                      </span>
                    </div>

                    {/* Tactile Rotary Channel Selector Dial + Contrast Knob */}
                    <div className="flex sm:flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={() => stepPlate(1, true)}
                        aria-label="Turn rotary channel dial to next artwork"
                        title="Next channel"
                        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/25 bg-[radial-gradient(circle_at_32%_28%,#3A3F4B_0%,#151820_64%,#0A0B0F_100%)] shadow-[0_6px_14px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.22)] flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B]"
                      >
                        <span
                          aria-hidden="true"
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 bg-[#181B22] flex items-start justify-center pt-1 transition-transform duration-200 ease-out"
                          style={{ transform: `rotate(${dialAngle}deg)` }}
                        >
                          <span className="w-[2.5px] h-2.5 rounded-full bg-[#C8A46B] shadow-[0_0_6px_rgba(200,164,107,0.8)]" />
                        </span>
                      </button>

                      {/* Decorative Secondary Fine-Tune Dial (Desktop) */}
                      <div
                        aria-hidden="true"
                        className="hidden sm:flex w-8 h-8 rounded-full border border-white/15 bg-[radial-gradient(circle_at_35%_30%,#2D313B_0%,#111319_70%)] shadow-[0_4px_10px_rgba(0,0,0,0.75)] items-center justify-center"
                      >
                        <div className="w-5 h-5 rounded-full border border-white/10 flex items-start justify-center pt-0.5 rotate-[-35deg]">
                          <span className="w-[2px] h-1.5 bg-[#22D3EE]/70 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Channel Stepper Push-Buttons, Audio Mute Toggle & Speaker Grille */}
                    <div className="flex sm:flex-col items-center gap-1.5 sm:gap-2 w-auto sm:w-full">
                      <div className="flex items-center gap-1.5 sm:gap-1">
                        <button
                          type="button"
                          onClick={() => stepPlate(-1, true)}
                          aria-label="Previous portfolio artwork"
                          data-cursor="CH−"
                          className="w-9 h-9 sm:w-8 sm:h-7 flex items-center justify-center rounded-[4px] border border-white/15 bg-[#0C0E13] text-[#D4CFC5] hover:border-[#22D3EE] hover:text-[#22D3EE] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C8A46B]"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepPlate(1, true)}
                          aria-label="Next portfolio artwork"
                          data-cursor="CH+"
                          className="w-9 h-9 sm:w-8 sm:h-7 flex items-center justify-center rounded-[4px] border border-white/15 bg-[#0C0E13] text-[#D4CFC5] hover:border-[#C8A46B] hover:text-[#C8A46B] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C8A46B]"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          unlockCrtAudio(isMutedRef.current);
                          setIsPaused((p) => !p);
                        }}
                        aria-label={
                          isPaused
                            ? 'Resume automatic artwork cycle'
                            : 'Pause automatic artwork cycle'
                        }
                        className="w-9 h-9 sm:w-full sm:h-6 flex items-center justify-center gap-1 rounded-[4px] border border-white/15 bg-[#0C0E13] text-[9px] font-mono tracking-[0.14em] uppercase text-[#B8B2A7] hover:text-[#F4F1EA] hover:border-[#22D3EE]/70 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C8A46B]"
                      >
                        {isPaused ? (
                          <Play className="w-3.5 h-3.5 sm:w-3 sm:h-3" aria-hidden="true" />
                        ) : (
                          <Pause className="w-3.5 h-3.5 sm:w-3 sm:h-3" aria-hidden="true" />
                        )}
                        <span className="hidden sm:inline">{isPaused ? 'PLAY' : 'HOLD'}</span>
                      </button>

                      {/* Mute / Unmute TV Static & Ambient Audio Toggle */}
                      <button
                        type="button"
                        data-testid="crt-sound-toggle"
                        aria-pressed={!isMuted}
                        onClick={() => {
                          const willUnmute = isMuted;
                          onToggleSound();
                          if (willUnmute) {
                            playCrtChannelSwitchSound(false, true);
                          }
                        }}
                        aria-label={
                          isMuted
                            ? 'Unmute CRT channel sound effects'
                            : 'Mute CRT channel sound effects'
                        }
                        className={`w-9 h-9 sm:w-full sm:h-6 flex items-center justify-center gap-1 rounded-[4px] border text-[9px] font-mono tracking-[0.12em] uppercase transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C8A46B] ${
                          isMuted
                            ? 'border-white/15 bg-[#0C0E13] text-[#78746C] hover:text-[#F4F1EA] hover:border-white/30'
                            : 'border-[#22D3EE]/40 bg-[#0C141A] text-[#67E8F9] hover:border-[#C8A46B] hover:text-[#C8A46B]'
                        }`}
                      >
                        {isMuted ? (
                          <VolumeX className="w-3.5 h-3.5 sm:w-3 sm:h-3" aria-hidden="true" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" aria-hidden="true" />
                        )}
                        <span className="hidden sm:inline">{isMuted ? 'MUTED' : 'SOUND'}</span>
                      </button>

                      {/* Etched Acoustic Speaker Louvers */}
                      <div
                        aria-hidden="true"
                        className="hidden sm:flex flex-col gap-[3px] w-full pt-1 px-1"
                      >
                        <span className="block h-[2px] w-full rounded-full bg-black/90 border-b border-white/10" />
                        <span className="block h-[2px] w-full rounded-full bg-black/90 border-b border-white/10" />
                        <span className="block h-[2px] w-full rounded-full bg-black/90 border-b border-white/10" />
                        <span className="block h-[2px] w-full rounded-full bg-black/90 border-b border-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cast-Aluminum Low-Profile TV Pedestal Neck & Foot */}
              <div aria-hidden="true" className="mx-auto flex flex-col items-center">
                <div className="w-24 h-2.5 bg-gradient-to-b from-[#0A0B0E] to-[#1D2028] border-x border-white/10" />
                <div className="w-44 sm:w-52 h-1.5 rounded-b-sm bg-gradient-to-r from-transparent via-[#2E323E] to-transparent border-t border-white/15" />
              </div>

              {/* Live Channel Readout & Series Bar Below Television */}
              <div className="mt-2.5 border border-white/15 bg-[#08090D]/85 backdrop-blur-lg px-3.5 sm:px-4 py-3">
                {/* Channel Progress Track */}
                <div
                  aria-hidden="true"
                  className="w-full h-[2px] bg-white/10 overflow-hidden mb-2.5"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#22D3EE] via-[#E8D5B5] to-[#C8A46B] transition-[width] duration-200 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div ref={metaRefreshRef} className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono tracking-[0.12em] uppercase">
                      <span
                        data-testid="hero-plate-counter"
                        className="tabular-nums text-[#22D3EE]"
                      >
                        CH {String(activePlate.plateNumber).padStart(2, '0')} /{' '}
                        {String(totalPlates).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true" className="text-white/25">·</span>
                      <span className="text-[#C8A46B] truncate">{activePlate.projectTitle}</span>
                    </div>
                    <p
                      data-testid="hero-plate-title"
                      className="mt-1 text-sm font-medium text-[#F4F1EA] truncate"
                    >
                      {activePlate.caption}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProject(activePlate.projectId)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 min-h-[36px] border border-white/15 text-[10px] font-mono tracking-[0.12em] uppercase text-[#F4F1EA] hover:border-[#C8A46B] hover:text-[#C8A46B] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B]"
                  >
                    <span>Series</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Archive Strip with subtle scroll depth */}
      <div
        ref={metricsParallaxRef}
        className="relative z-10 mx-auto w-full max-w-[1440px] border-t border-white/10 mt-6 sm:mt-8 lg:mt-4 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs will-change-transform"
      >
        <div>
          <span className="block font-mono tabular-nums text-lg text-[#F4F1EA]">
            {String(PORTFOLIO_PROJECTS.length).padStart(2, '0')}
          </span>
          <span className="text-[#9A958C]">Selected Commissions</span>
        </div>
        <div>
          <span className="block font-mono tabular-nums text-lg text-[#F4F1EA]">
            {totalPlates}
          </span>
          <span className="text-[#9A958C]">Original Artworks Preserved</span>
        </div>
        <div>
          <span className="block font-mono tabular-nums text-lg text-[#F4F1EA]">04</span>
          <span className="text-[#9A958C]">Core Design Disciplines</span>
        </div>
        <div className="flex sm:justify-end items-center">
          <span className="text-[#B8B2A7]">Brand Identity · Packaging · Advertising</span>
        </div>
      </div>
    </section>
  );
}
