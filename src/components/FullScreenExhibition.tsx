import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import {
  createLightingDots,
  renderLightingDotsCanvas,
} from '../utils/ambientParticles';
import {
  getPlateParticlePalette,
  lerpPalette,
  sampleArtworkImagePalette,
  type PlateParticlePalette,
} from '../utils/exhibitionPalette';
import {
  flattenExhibitionPlates,
  getExhibitionProjectTabs,
  getNextExhibitionIndex,
} from '../utils/portfolioFilters';
import { classifyPlateSensoryMood, type SensoryMood } from '../utils/sensoryMood';
import { ArtworkImage } from './ArtworkImage';

interface FullScreenExhibitionProps {
  onSelectProject: (projectId: string) => void;
  onBackToWorks: () => void;
  onSkipToExpertise: () => void;
  onExhibitionMoodStateChange?: (isVisible: boolean, mood: SensoryMood) => void;
}

export function FullScreenExhibition({
  onSelectProject,
  onBackToWorks,
  onSkipToExpertise,
  onExhibitionMoodStateChange,
}: FullScreenExhibitionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const exhibitionCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparkSurgeRef = useRef<number>(0);
  const haloPulseRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const streakARef = useRef<HTMLDivElement>(null);
  const streakBRef = useRef<HTMLDivElement>(null);
  const horizonFlareRef = useRef<HTMLDivElement>(null);
  const rimFlashRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const lockUntilRef = useRef<number>(0);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    inStripOrTabs: boolean;
    inStage: boolean;
  } | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transitionId, setTransitionId] = useState<number>(0);

  const projectTabs = useMemo(
    () => getExhibitionProjectTabs(PORTFOLIO_PROJECTS),
    []
  );

  const plates = useMemo(
    () => flattenExhibitionPlates(PORTFOLIO_PROJECTS, selectedProjectId),
    [selectedProjectId]
  );

  const safeActiveIndex = plates.length > 0 ? Math.min(activeIndex, plates.length - 1) : 0;
  const currentPlate = plates[safeActiveIndex];
  const outgoingPlate =
    outgoingIndex !== null && outgoingIndex !== safeActiveIndex && outgoingIndex < plates.length
      ? plates[outgoingIndex]
      : null;

  const fallbackPalette = useMemo(
    () =>
      currentPlate
        ? getPlateParticlePalette(currentPlate)
        : {
            primary: [56, 189, 248] as [number, number, number],
            secondary: [232, 194, 120] as [number, number, number],
            highlight: [244, 241, 234] as [number, number, number],
          },
    [currentPlate]
  );

  const [activePalette, setActivePalette] = useState<PlateParticlePalette>(fallbackPalette);
  const currentPaletteRef = useRef<PlateParticlePalette>(fallbackPalette);
  const targetPaletteRef = useRef<PlateParticlePalette>(fallbackPalette);
  const [isExhibitionVisible, setIsExhibitionVisible] = useState(false);

  const activeExhibitionMood = useMemo(
    () =>
      currentPlate
        ? classifyPlateSensoryMood({
            projectId: currentPlate.projectId,
            caption: currentPlate.caption,
            subSeries: currentPlate.subSeries,
          })
        : 'neutral',
    [currentPlate]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsExhibitionVisible(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onExhibitionMoodStateChange?.(isExhibitionVisible, activeExhibitionMood);
  }, [isExhibitionVisible, activeExhibitionMood, onExhibitionMoodStateChange]);

  // Immediately update target palette from artwork metadata, then refine from decoded pixels
  useEffect(() => {
    targetPaletteRef.current = fallbackPalette;
    setActivePalette(fallbackPalette);
    if (!currentPlate?.src) return;

    let cancelled = false;
    const samplerImg = new Image();
    samplerImg.referrerPolicy = 'no-referrer';
    samplerImg.onload = () => {
      if (cancelled) return;
      const sampled = sampleArtworkImagePalette(samplerImg, fallbackPalette);
      targetPaletteRef.current = sampled;
      setActivePalette(sampled);
    };
    samplerImg.src = currentPlate.src;

    return () => {
      cancelled = true;
    };
  }, [currentPlate?.src, fallbackPalette]);

  const goToIndex = useCallback(
    (targetIndex: number, forcedDirection?: 1 | -1) => {
      if (plates.length <= 1) return;
      const bounded = ((targetIndex % plates.length) + plates.length) % plates.length;
      if (bounded === safeActiveIndex) return;

      const inferredDir: 1 | -1 =
        forcedDirection ?? (bounded > safeActiveIndex ? 1 : -1);
      setOutgoingIndex(safeActiveIndex);
      setDirection(inferredDir);
      setActiveIndex(bounded);
      setTransitionId((n) => n + 1);
    },
    [plates.length, safeActiveIndex]
  );

  const stepPlate = useCallback(
    (delta: number) => {
      if (plates.length <= 1) return;
      const nextIdx = getNextExhibitionIndex(safeActiveIndex, delta, plates.length);
      goToIndex(nextIdx, delta >= 0 ? 1 : -1);
    },
    [goToIndex, plates.length, safeActiveIndex]
  );

  const handleSelectFilter = (projectId: string) => {
    setSelectedProjectId(projectId);
    setOutgoingIndex(null);
    setActiveIndex(0);
    setDirection(1);
    setTransitionId((n) => n + 1);
  };

  // Preload adjacent artworks cleanly so frame switches stay immediate
  useEffect(() => {
    if (plates.length <= 1) return;
    const prevIdx = getNextExhibitionIndex(safeActiveIndex, -1, plates.length);
    const nextIdx = getNextExhibitionIndex(safeActiveIndex, 1, plates.length);
    [plates[prevIdx]?.src, plates[nextIdx]?.src].forEach((src) => {
      if (!src) return;
      const preload = new Image();
      preload.src = src;
    });
  }, [plates, safeActiveIndex]);

  // Keep active thumbnail centered inside the bottom strip without mutating window.scrollY
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const activeBtn = strip.querySelector<HTMLButtonElement>(
      `[data-thumb-index="${safeActiveIndex}"]`
    );
    if (!activeBtn) return;

    const targetLeft =
      activeBtn.offsetLeft - strip.clientWidth / 2 + activeBtn.clientWidth / 2;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [safeActiveIndex, selectedProjectId]);

  // Romantic, silky-smooth firefly & micro-bokeh drift matched dynamically to each artwork's palette at 60fps
  useEffect(() => {
    const canvas = exhibitionCanvasRef.current;
    const viewport = viewportRef.current;
    const section = sectionRef.current;
    if (!canvas || !viewport || !section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let lastTime = performance.now();
    const startTime = lastTime;
    let isVisible = true;

    const motes = createLightingDots(64);

    const resize = () => {
      const rect = viewport.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);

    const visObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    visObserver.observe(section);

    const draw = (now: number) => {
      const dtSec = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      const dtScale = dtSec * 60;
      lastTime = now;

      if (isVisible && width > 0 && height > 0) {
        // Smoothly morph particle color harmony toward the active artwork's palette
        currentPaletteRef.current = lerpPalette(
          currentPaletteRef.current,
          targetPaletteRef.current,
          Math.min(1, 0.045 * dtScale)
        );

        const surge = sparkSurgeRef.current;
        if (surge > 0.004) {
          sparkSurgeRef.current *= Math.pow(0.94, dtScale);
        } else {
          sparkSurgeRef.current = 0;
        }

        renderLightingDotsCanvas(
          ctx,
          motes,
          dtSec,
          (now - startTime) / 1000,
          width,
          height,
          currentPaletteRef.current,
          surge
        );
      }
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      visObserver.disconnect();
    };
  }, []);

  // Multi-layered light choreography + expressive 3D zoom & tilt (scale 0.78 -> 1, rotateY ±22deg, z -180 -> 0)
  useEffect(() => {
    if (transitionId === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setOutgoingIndex(null);
      return;
    }

    sparkSurgeRef.current = 1.65;

    const tl = gsap.timeline({
      onComplete: () => {
        setOutgoingIndex(null);
      },
    });

    if (outgoingRef.current) {
      tl.fromTo(
        outgoingRef.current,
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          z: 0,
          xPercent: 0,
        },
        {
          opacity: 0,
          scale: 0.78,
          rotateY: -22 * direction,
          z: -160,
          xPercent: -14 * direction,
          duration: 0.45,
          ease: 'power3.out',
        },
        0
      );
    }

    if (incomingRef.current) {
      tl.fromTo(
        incomingRef.current,
        {
          opacity: 0,
          scale: 0.78,
          rotateY: 22 * direction,
          z: -180,
          xPercent: 14 * direction,
          filter: 'brightness(1.52) contrast(1.1)',
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          z: 0,
          xPercent: 0,
          filter: 'brightness(1) contrast(1)',
          duration: 0.78,
          ease: 'expo.out',
          clearProps: 'transform,opacity,filter',
        },
        0.04
      );
    }

    if (haloPulseRef.current) {
      tl.fromTo(
        haloPulseRef.current,
        { opacity: 0.45, scale: 0.88 },
        { opacity: 1, scale: 1.18, duration: 0.34, ease: 'power2.out' },
        0
      ).to(
        haloPulseRef.current,
        { opacity: 0.78, scale: 1, duration: 0.6, ease: 'power3.out' },
        0.3
      );
    }

    if (burstRef.current) {
      tl.fromTo(
        burstRef.current,
        { opacity: 0, scale: 0.34 },
        {
          opacity: 1,
          scale: 1.46,
          duration: 0.32,
          ease: 'power2.out',
        },
        0
      ).to(
        burstRef.current,
        {
          opacity: 0,
          scale: 1.82,
          duration: 0.62,
          ease: 'power3.out',
        },
        0.26
      );
    }

    if (horizonFlareRef.current) {
      tl.fromTo(
        horizonFlareRef.current,
        { opacity: 0, scaleX: 0.18, scaleY: 0.8 },
        { opacity: 0.92, scaleX: 1.24, scaleY: 1.15, duration: 0.24, ease: 'power2.out' },
        0.02
      ).to(
        horizonFlareRef.current,
        { opacity: 0, scaleX: 1.4, scaleY: 0.7, duration: 0.44, ease: 'power3.out' },
        0.24
      );
    }

    if (streakARef.current) {
      tl.fromTo(
        streakARef.current,
        { opacity: 0, xPercent: -78 * direction },
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.24,
          ease: 'power2.out',
        },
        0
      ).to(
        streakARef.current,
        {
          opacity: 0,
          xPercent: 88 * direction,
          duration: 0.38,
          ease: 'power3.out',
        },
        0.2
      );
    }

    if (streakBRef.current) {
      tl.fromTo(
        streakBRef.current,
        { opacity: 0, xPercent: 78 * direction },
        {
          opacity: 0.96,
          xPercent: 0,
          duration: 0.26,
          ease: 'power2.out',
        },
        0.05
      ).to(
        streakBRef.current,
        {
          opacity: 0,
          xPercent: -88 * direction,
          duration: 0.4,
          ease: 'power3.out',
        },
        0.26
      );
    }

    if (rimFlashRef.current) {
      tl.fromTo(
        rimFlashRef.current,
        { opacity: 0, scale: 0.975 },
        {
          opacity: 1,
          scale: 1.006,
          duration: 0.24,
          ease: 'power2.out',
        },
        0
      ).to(
        rimFlashRef.current,
        {
          opacity: 0.22,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
        },
        0.22
      );
    }

    tl.fromTo(
      '.exhibition-meta-stagger',
      { y: 8, opacity: 0.35, scale: 0.985 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.28,
        stagger: 0.02,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [direction, transitionId]);

  // Strictly lock page scroll on mouse wheel & touch swipe inside #exhibition
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = performance.now();
      if (now < lockUntilRef.current) return;

      const primaryDelta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(primaryDelta) < 12) return;

      lockUntilRef.current = now + 280;
      stepPlate(primaryDelta > 0 ? 1 : -1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      const inStripOrTabs = Boolean(
        target?.closest('[data-thumb-strip="true"], [role="tablist"]')
      );
      const inStage = Boolean(target && viewportRef.current?.contains(target));
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        inStripOrTabs,
        inStage,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;

      // Allow horizontal finger scrolling on tabs/thumbnails, and normal page scroll outside the artwork stage
      if (touchStartRef.current.inStripOrTabs && Math.abs(dx) > Math.abs(dy)) {
        return;
      }
      if (!touchStartRef.current.inStage) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || e.changedTouches.length === 0) return;

      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;

      if (start.inStripOrTabs && Math.abs(dx) > Math.abs(dy)) {
        return;
      }
      if (!start.inStage) {
        return;
      }

      const now = performance.now();
      if (now < lockUntilRef.current) return;

      if (Math.abs(dy) >= 28 || Math.abs(dx) >= 34) {
        lockUntilRef.current = now + 340;
        const delta =
          Math.abs(dy) >= Math.abs(dx) ? (dy < 0 ? 1 : -1) : dx < 0 ? 1 : -1;
        stepPlate(delta);
      }
    };

    section.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    section.addEventListener('touchstart', handleTouchStart, {
      passive: true,
      capture: true,
    });
    section.addEventListener('touchmove', handleTouchMove, {
      passive: false,
      capture: true,
    });
    section.addEventListener('touchend', handleTouchEnd, {
      passive: true,
      capture: true,
    });

    return () => {
      section.removeEventListener('wheel', handleWheel, { capture: true });
      section.removeEventListener('touchstart', handleTouchStart, { capture: true });
      section.removeEventListener('touchmove', handleTouchMove, { capture: true });
      section.removeEventListener('touchend', handleTouchEnd, { capture: true });
    };
  }, [stepPlate]);

  // Keyboard arrow navigation when #exhibition is focused or dominates the viewport
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== 'ArrowRight' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowDown' &&
        e.key !== 'ArrowUp'
      ) {
        return;
      }

      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }
      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const stageDominatesViewport =
        rect.top <= window.innerHeight * 0.35 &&
        rect.bottom >= window.innerHeight * 0.65;
      const focusInsideStage = section.contains(document.activeElement);

      if (!stageDominatesViewport && !focusInsideStage) return;

      e.preventDefault();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        stepPlate(1);
      } else {
        stepPlate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepPlate]);

  if (!currentPlate) {
    return null;
  }

  return (
    <section
      id="exhibition"
      ref={sectionRef}
      data-lenis-prevent
      data-testid="exhibition-locked-stage"
      tabIndex={-1}
      aria-label="Locked Full-Screen Artwork Exhibition"
      className="relative w-full h-[100dvh] min-h-[600px] flex flex-col justify-between overflow-hidden pt-16 lg:pt-20 bg-[#050506]/68 border-b border-white/[0.08] outline-none"
    >
      {/* Top Control Strip: Counter, Project Filter Tabs, & Section Exit Links */}
      <div className="relative z-30 shrink-0 border-b border-white/10 bg-[#050506]/90">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4 min-w-0">
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-baseline gap-2.5">
              <p className="text-xs tracking-[0.18em] uppercase text-[#C8A46B] whitespace-nowrap">
                Exhibition
              </p>
              <span aria-hidden="true" className="text-white/25">
                ·
              </span>
              <span
                data-testid="exhibition-plate-counter"
                className="font-mono tabular-nums text-xs text-[#F4F1EA] whitespace-nowrap"
              >
                Plate {String(currentPlate.plateNumber).padStart(2, '0')} /{' '}
                {String(currentPlate.totalPlates).padStart(2, '0')}
              </span>
            </div>

            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onBackToWorks}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] text-[11px] text-[#B8B2A7] border border-white/10 hover:text-[#F4F1EA] whitespace-nowrap cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" aria-hidden="true" />
                <span>Works</span>
              </button>
              <button
                type="button"
                onClick={onSkipToExpertise}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] text-[11px] text-[#B8B2A7] border border-white/10 hover:text-[#C8A46B] whitespace-nowrap cursor-pointer"
              >
                <span>Skip</span>
                <ArrowDown className="w-3 h-3 text-[#C8A46B]" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-1 lg:justify-end">
            <div
              role="tablist"
              aria-label="Filter exhibition plates by project"
              className="flex items-center gap-1.5 min-w-0 overflow-x-auto pb-0.5 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {projectTabs.map((tab) => {
                const active = selectedProjectId === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => handleSelectFilter(tab.id)}
                    className={`px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap shrink-0 border cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B] ${
                      active
                        ? 'bg-[#F4F1EA] text-[#050506] border-[#F4F1EA]'
                        : 'bg-[#0C0C0F] text-[#B8B2A7] border-white/10 hover:border-[#C8A46B]/60 hover:text-[#F4F1EA]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`ml-1 font-mono tabular-nums text-[10px] ${
                        active ? 'text-[#050506]/70' : 'text-[#9A958C]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onBackToWorks}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#B8B2A7] border border-white/10 hover:border-[#C8A46B]/60 hover:text-[#F4F1EA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#C8A46B]" aria-hidden="true" />
                <span>Works</span>
              </button>
              <button
                type="button"
                onClick={onSkipToExpertise}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#B8B2A7] border border-white/10 hover:border-[#C8A46B]/60 hover:text-[#F4F1EA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Skip</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#C8A46B]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reactive Per-Artwork Atmospheric Accent Halo & Dual-Tone Bloom */}
      <div
        ref={haloPulseRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-700 will-change-transform opacity-75"
        style={{
          background: `radial-gradient(64% 58% at 50% 52%, rgba(${activePalette.primary.join(',')}, 0.28) 0%, rgba(${activePalette.secondary.join(',')}, 0.16) 36%, rgba(${activePalette.highlight.join(',')}, 0.08) 58%, rgba(5,5,6,0.72) 100%)`,
        }}
      />

      {/* Locked Center Artwork Frame (object-contain, Zero Cropping) */}
      <div
        ref={viewportRef}
        data-testid="exhibition-stage-viewport"
        className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-11 sm:px-16 lg:px-20 py-2 sm:py-3 overflow-hidden"
      >
        {/* Continuous Romantic Firefly & Bokeh Canvas Matched to Artwork Palette */}
        <canvas
          ref={exhibitionCanvasRef}
          data-testid="exhibition-sparks-canvas"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full z-10"
        />

        {/* Intensified Volumetric Radial Light Burst Harmonized to Artwork Palette */}
        <div
          ref={burstRef}
          data-testid="exhibition-light-burst"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 mix-blend-screen will-change-transform"
          style={{
            background: `radial-gradient(52% 58% at 50% 50%, rgba(${activePalette.highlight.join(',')}, 0.56) 0%, rgba(${activePalette.primary.join(',')}, 0.62) 26%, rgba(${activePalette.secondary.join(',')}, 0.44) 48%, transparent 82%)`,
          }}
        />

        {/* Anamorphic Horizontal Lens Flare Pulse */}
        <div
          ref={horizonFlareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 z-20 opacity-0 mix-blend-screen will-change-transform"
          style={{
            background: `radial-gradient(65% 50% at 50% 50%, rgba(${activePalette.highlight.join(',')}, 0.72) 0%, rgba(${activePalette.primary.join(',')}, 0.46) 38%, rgba(${activePalette.secondary.join(',')}, 0.3) 66%, transparent 100%)`,
          }}
        />

        {/* Dual High-Intensity Diagonal Lens Flare Sweeps */}
        <div
          ref={streakARef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-12 z-20 opacity-0 mix-blend-screen will-change-transform"
          style={{
            background: `linear-gradient(108deg, transparent 28%, rgba(${activePalette.primary.join(',')}, 0.65) 46%, rgba(255,255,255,0.82) 50%, rgba(${activePalette.primary.join(',')}, 0.5) 54%, transparent 72%)`,
          }}
        />
        <div
          ref={streakBRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-12 z-20 opacity-0 mix-blend-screen will-change-transform"
          style={{
            background: `linear-gradient(72deg, transparent 28%, rgba(${activePalette.secondary.join(',')}, 0.65) 46%, rgba(${activePalette.highlight.join(',')}, 0.8) 50%, rgba(${activePalette.secondary.join(',')}, 0.5) 54%, transparent 72%)`,
          }}
        />

        {/* Luminous Constant Perimeter Rim + Reactive Transition Border Flash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 sm:inset-4 lg:inset-6 z-20 border transition-[border-color,box-shadow] duration-500"
          style={{
            borderColor: `rgba(${activePalette.primary.join(',')}, 0.28)`,
            boxShadow: `inset 0 0 28px rgba(${activePalette.primary.join(',')}, 0.14), 0 0 24px rgba(${activePalette.secondary.join(',')}, 0.12)`,
          }}
        />
        <div
          ref={rimFlashRef}
          data-testid="exhibition-rim-flash"
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 sm:inset-4 lg:inset-6 z-20 opacity-20 border-2 will-change-transform transition-[border-color,box-shadow] duration-500"
          style={{
            borderColor: `rgb(${activePalette.primary.join(',')})`,
            boxShadow: `inset 0 0 72px rgba(${activePalette.primary.join(',')}, 0.62), 0 0 60px rgba(${activePalette.secondary.join(',')}, 0.64)`,
          }}
        />

        <button
          type="button"
          onClick={() => stepPlate(-1)}
          disabled={plates.length <= 1}
          aria-label="Previous artwork"
          data-cursor="Prev"
          className="absolute left-1.5 sm:left-5 lg:left-8 z-30 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-[#09090C]/90 border border-white/15 text-[#F4F1EA] hover:border-[#22D3EE] hover:text-[#22D3EE] hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] disabled:opacity-35 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B]"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>

        <div className="relative z-20 w-full h-full max-w-[1320px] flex items-center justify-center perspective-stage">
          {/* Outgoing Plate Layer During 3D Depth Transition */}
          {outgoingPlate && (
            <div
              ref={outgoingRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform preserve-3d"
            >
              <ArtworkImage
                src={outgoingPlate.src}
                alt=""
                priority
                fit="contain"
                className="max-w-full max-h-full w-auto h-auto shadow-[0_28px_90px_rgba(0,0,0,0.85)]"
              />
            </div>
          )}

          {/* Active Incoming Plate Layer */}
          <div
            ref={incomingRef}
            data-testid="exhibition-active-plate"
            data-plate-number={currentPlate.plateNumber}
            className="relative w-full h-full flex items-center justify-center will-change-transform preserve-3d"
          >
            <ArtworkImage
              src={currentPlate.src}
              alt={currentPlate.alt}
              priority
              fit="contain"
              className="max-w-full max-h-full w-auto h-auto shadow-[0_28px_90px_rgba(0,0,0,0.85)]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => stepPlate(1)}
          disabled={plates.length <= 1}
          aria-label="Next artwork"
          data-cursor="Next"
          className="absolute right-1.5 sm:right-5 lg:right-8 z-30 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-[#09090C]/90 border border-white/15 text-[#F4F1EA] hover:border-[#C8A46B] hover:text-[#C8A46B] hover:shadow-[0_0_24px_rgba(200,164,107,0.35)] disabled:opacity-35 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B]"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Compact Bottom Editorial Metadata & Thumbnail Strip */}
      <div className="relative z-20 shrink-0 border-t border-white/10 bg-[#050506]/90">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-10 py-2.5 sm:py-3 flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-[#9A958C]">
                <span className="exhibition-meta-stagger inline-block font-mono tabular-nums text-[#C8A46B]">
                  {String(currentPlate.plateNumber).padStart(2, '0')} /{' '}
                  {String(currentPlate.totalPlates).padStart(2, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="exhibition-meta-stagger inline-block text-[#F4F1EA]">
                  {currentPlate.brand}
                </span>
                <span aria-hidden="true">·</span>
                <span className="exhibition-meta-stagger inline-block">
                  {currentPlate.primaryDiscipline}
                </span>
                {currentPlate.subSeries && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="exhibition-meta-stagger inline-block">
                      {currentPlate.subSeries}
                    </span>
                  </>
                )}
              </div>
              <h3 className="exhibition-meta-stagger mt-0.5 font-serif text-base sm:text-xl lg:text-2xl font-normal text-[#F4F1EA] truncate">
                {currentPlate.caption}
              </h3>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className="hidden md:inline text-[11px] text-[#9A958C] whitespace-nowrap">
                Scroll or swipe to browse plates
              </span>
              <button
                type="button"
                onClick={() => onSelectProject(currentPlate.projectId)}
                data-cursor="Inspect"
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] text-xs font-medium tracking-wide bg-[#0C0C0F] border border-white/15 text-[#F4F1EA] hover:border-[#C8A46B] hover:text-[#C8A46B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B]"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#C8A46B]" aria-hidden="true" />
                <span>Open {currentPlate.projectTitle.split('—')[0].trim()} Series</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Compact Thumbnail Filmstrip */}
          <div
            ref={thumbStripRef}
            data-thumb-strip="true"
            role="list"
            aria-label="Exhibition artwork thumbnails"
            className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {plates.map((plate, idx) => {
              const isCurrent = idx === safeActiveIndex;
              return (
                <button
                  key={`${plate.projectId}-${plate.plateNumber}-${plate.src}`}
                  type="button"
                  data-thumb-index={idx}
                  onClick={() => goToIndex(idx)}
                  aria-label={`Select plate ${plate.plateNumber}: ${plate.caption}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 overflow-hidden border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B] ${
                    isCurrent
                      ? 'border-[#C8A46B] opacity-100 scale-100'
                      : 'border-white/15 opacity-55 hover:opacity-90 hover:border-white/40'
                  }`}
                >
                  <img
                    src={plate.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
