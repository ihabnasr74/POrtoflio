import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { DESIGNER_PROFILE } from '../data/portfolioData';
import {
  computeLoneToolSweepBounds,
  hasLeftIntroStage,
  shouldPrehideIntroStage,
  shouldResetIntroForReturn,
} from '../utils/introLifecycle';
import { unlockCrtAudio } from '../utils/crtAudio';
import { IllustratorIntroSequence } from './IllustratorIntroSequence';
import { MagneticButton } from './MagneticButton';

interface IntroEmblemHeroProps {
  onEnterPortfolio: () => void;
  logoDockProgress: number;
}

export function IntroEmblemHero({
  onEnterPortfolio,
  logoDockProgress,
}: IntroEmblemHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRevealRef = useRef<HTMLDivElement>(null);
  const logoClipRevealRef = useRef<HTMLDivElement>(null);
  const scanlineBeamRef = useRef<HTMLDivElement>(null);
  const prismGlintRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);

  const subtitleContainerRef = useRef<HTMLDivElement>(null);
  const subtitleMaskRef = useRef<HTMLDivElement>(null);
  const subtitleTextRef = useRef<HTMLParagraphElement>(null);
  const cameraFlashWideRef = useRef<HTMLDivElement>(null);
  const cameraFlashCoreRef = useRef<HTMLDivElement>(null);

  // Pixar-style Lone Illustrator Tool + White Light Sweep Refs
  const loneToolRef = useRef<HTMLDivElement>(null);
  const loneToolHaloRef = useRef<HTMLDivElement>(null);
  const loneToolFlareRef = useRef<HTMLDivElement>(null);
  const lightBeamHeadRef = useRef<HTMLDivElement>(null);
  const lightBeamRibbonRef = useRef<HTMLDivElement>(null);

  const [introCycleId, setIntroCycleId] = useState(0);
  const [swarmActive, setSwarmActive] = useState(true);
  const [logoRevealed, setLogoRevealed] = useState(false);
  const [loneToolActive, setLoneToolActive] = useState(false);
  const [ctaRevealed, setCtaRevealed] = useState(false);

  const hasLeftIntroRef = useRef(false);
  const prevProgressRef = useRef(logoDockProgress);
  const hasPlayedRevealRef = useRef(false);
  const hasPlayedLoneToolRef = useRef(false);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const loneToolTlRef = useRef<gsap.core.Timeline | null>(null);
  const ctaTlRef = useRef<gsap.core.Tween | null>(null);

  const logoDockProgressRef = useRef(logoDockProgress);
  logoDockProgressRef.current = logoDockProgress;

  const handleRevealLogo = useCallback(() => {
    setLogoRevealed(true);
  }, []);

  const handleLoneToolStart = useCallback(() => {
    setLoneToolActive(true);
  }, []);

  // Synchronous pre-paint enforcement: hide emblem, lone tool, subtitle, and CTAs immediately upon
  // leaving #intro or re-entering from below so zero pre-animation frame can flash.
  useLayoutEffect(() => {
    const prevProgress = prevProgressRef.current;
    prevProgressRef.current = logoDockProgress;

    const resetVisualNodesToHidden = () => {
      revealTlRef.current?.kill();
      revealTlRef.current = null;
      loneToolTlRef.current?.kill();
      loneToolTlRef.current = null;
      ctaTlRef.current?.kill();
      ctaTlRef.current = null;

      hasPlayedRevealRef.current = false;
      hasPlayedLoneToolRef.current = false;

      if (logoRevealRef.current) {
        gsap.set(logoRevealRef.current, { autoAlpha: 0, scale: 0.94 });
      }
      if (logoClipRevealRef.current) {
        gsap.set(logoClipRevealRef.current, {
          clipPath: 'polygon(-35% 0%, -35% 0%, -65% 100%, -65% 100%)',
        });
      }
      if (scanlineBeamRef.current) {
        gsap.set(scanlineBeamRef.current, { opacity: 0, xPercent: -120 });
      }
      if (prismGlintRef.current) {
        gsap.set(prismGlintRef.current, { opacity: 0, xPercent: -100 });
      }
      if (subtitleMaskRef.current) {
        gsap.set(subtitleMaskRef.current, {
          autoAlpha: 0,
          clipPath: 'inset(-12px 100% -12px 0%)',
        });
      }
      if (subtitleTextRef.current) {
        gsap.set(subtitleTextRef.current, {
          opacity: 0,
          filter: 'blur(6px)',
          clearProps: 'textShadow',
        });
      }
      if (loneToolRef.current) {
        gsap.set(loneToolRef.current, {
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50,
          x: -14,
          y: 48,
          scale: 0.72,
          rotate: -12,
          clearProps: 'filter',
        });
      }
      if (loneToolHaloRef.current) {
        gsap.set(loneToolHaloRef.current, { opacity: 0, scale: 0.6 });
      }
      if (loneToolFlareRef.current) {
        gsap.set(loneToolFlareRef.current, { opacity: 0, scale: 0.25 });
      }
      if (lightBeamHeadRef.current) {
        gsap.set(lightBeamHeadRef.current, {
          opacity: 0,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          scale: 0.6,
        });
      }
      if (lightBeamRibbonRef.current) {
        gsap.set(lightBeamRibbonRef.current, {
          opacity: 0,
          yPercent: -50,
          scaleX: 0,
        });
      }
      if (cameraFlashWideRef.current) {
        gsap.set(cameraFlashWideRef.current, { opacity: 0, scale: 0.62 });
      }
      if (cameraFlashCoreRef.current) {
        gsap.set(cameraFlashCoreRef.current, { opacity: 0, scale: 0.55 });
      }
      gsap.set('.subtitle-accent-rule', { scaleX: 0, opacity: 0 });
      if (ctaContainerRef.current) {
        gsap.set(ctaContainerRef.current, { autoAlpha: 0, y: 14 });
      }
    };

    if (hasLeftIntroStage(logoDockProgress)) {
      hasLeftIntroRef.current = true;
    }

    if (shouldResetIntroForReturn(hasLeftIntroRef.current, logoDockProgress)) {
      hasLeftIntroRef.current = false;
      resetVisualNodesToHidden();
      setLogoRevealed(false);
      setLoneToolActive(false);
      setCtaRevealed(false);
      setSwarmActive(true);
      setIntroCycleId((c) => c + 1);
      return;
    }

    if (
      shouldPrehideIntroStage({
        wasAwayFromTop: hasLeftIntroRef.current,
        logoDockProgress,
        prevProgress,
      })
    ) {
      resetVisualNodesToHidden();
      if (swarmActive) setSwarmActive(false);
      if (logoRevealed) setLogoRevealed(false);
      if (loneToolActive) setLoneToolActive(false);
      if (ctaRevealed) setCtaRevealed(false);
      return;
    }

    if (hasLeftIntroStage(logoDockProgress) && swarmActive) {
      setSwarmActive(false);
    }

    // If user starts scrolling down early before the lone tool sweep completes, reveal cleanly
    if (!hasLeftIntroRef.current && logoDockProgress > 0.06) {
      if (!logoRevealed) setLogoRevealed(true);
      if (!loneToolActive) setLoneToolActive(true);
      if (!ctaRevealed) setCtaRevealed(true);
    }
  }, [logoDockProgress, logoRevealed, loneToolActive, ctaRevealed, swarmActive]);

  // Animate bottom CTAs gently once revealed
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setLogoRevealed(true);
      setLoneToolActive(true);
      setCtaRevealed(true);
      if (ctaContainerRef.current) {
        gsap.set(ctaContainerRef.current, { autoAlpha: 1, y: 0 });
      }
      return;
    }
    if (!ctaRevealed || !ctaContainerRef.current) return;

    ctaTlRef.current?.kill();
    ctaTlRef.current = gsap.fromTo(
      ctaContainerRef.current,
      { y: 14, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.72,
        ease: 'power3.out',
        clearProps: 'transform',
      }
    );

    return () => {
      ctaTlRef.current?.kill();
      if (ctaTlRef.current) ctaTlRef.current = null;
    };
  }, [ctaRevealed, introCycleId]);

  // Diagonal holographic scanline & liquid-chrome materialization sweep revealing the cropped IHAB emblem
  useEffect(() => {
    if (!logoRevealed || hasPlayedRevealRef.current) return;
    if (!logoRevealRef.current || !logoClipRevealRef.current) return;
    hasPlayedRevealRef.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || (!hasLeftIntroRef.current && logoDockProgressRef.current > 0.06)) {
      gsap.set(logoRevealRef.current, { autoAlpha: 1, scale: 1 });
      gsap.set(logoClipRevealRef.current, { clearProps: 'clipPath' });
      setLoneToolActive(true);
      setCtaRevealed(true);
      return;
    }

    const tl = gsap.timeline();
    revealTlRef.current = tl;

    // Base metallic emblem container fades & expands gently
    tl.fromTo(
      logoRevealRef.current,
      { autoAlpha: 0, scale: 0.94 },
      { autoAlpha: 1, scale: 1, duration: 0.98, ease: 'power3.out', clearProps: 'transform' },
      0
    );

    // Progressive diagonal vector-to-metallic silhouette sweep across the emblem
    tl.fromTo(
      logoClipRevealRef.current,
      { clipPath: 'polygon(-35% 0%, -35% 0%, -65% 100%, -65% 100%)' },
      {
        clipPath: 'polygon(-10% 0%, 145% 0%, 115% 100%, -40% 100%)',
        duration: 1.15,
        ease: 'power3.out',
        clearProps: 'clipPath',
      },
      0.04
    );

    // Iridescent cyan-and-silver holographic scanline refraction beam riding the leading edge
    if (scanlineBeamRef.current) {
      tl.fromTo(
        scanlineBeamRef.current,
        { xPercent: -120 },
        { xPercent: 145, duration: 1.15, ease: 'power3.out' },
        0.04
      );
      tl.fromTo(
        scanlineBeamRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' },
        0.04
      ).to(
        scanlineBeamRef.current,
        { opacity: 0, duration: 0.35, ease: 'power2.in' },
        0.86
      );
    }

    // Reactive chromatic prism glint flashing softly along metallic bevel edges as it locks
    if (prismGlintRef.current) {
      tl.fromTo(
        prismGlintRef.current,
        { xPercent: -100 },
        { xPercent: 125, duration: 0.9, ease: 'power3.out' },
        0.64
      );
      tl.fromTo(
        prismGlintRef.current,
        { opacity: 0 },
        { opacity: 0.85, duration: 0.28, ease: 'power2.out' },
        0.64
      ).to(
        prismGlintRef.current,
        { opacity: 0, duration: 0.38, ease: 'power3.out' },
        1.14
      );
    }

    // Fallback handoff if onLoneToolStart didn't already trigger from swarm completion
    tl.call(() => setLoneToolActive(true), [], 0.72);

    return () => {
      tl.kill();
      if (revealTlRef.current === tl) {
        revealTlRef.current = null;
      }
    };
  }, [logoRevealed, introCycleId]);

  // Pixar-style "Lone Illustrator Tool" Search, Weightless Arc Swoop, White Light Sweep & Masked Subtitle Reveal
  useLayoutEffect(() => {
    if (!loneToolActive || !logoRevealed || hasPlayedLoneToolRef.current) return;
    if (!subtitleMaskRef.current || !subtitleTextRef.current) return;
    hasPlayedLoneToolRef.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || (!hasLeftIntroRef.current && logoDockProgressRef.current > 0.06)) {
      gsap.set(subtitleMaskRef.current, { autoAlpha: 1, clearProps: 'clipPath' });
      gsap.set(subtitleTextRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' });
      if (loneToolRef.current) gsap.set(loneToolRef.current, { autoAlpha: 0 });
      if (lightBeamHeadRef.current) gsap.set(lightBeamHeadRef.current, { opacity: 0 });
      if (lightBeamRibbonRef.current) gsap.set(lightBeamRibbonRef.current, { opacity: 0 });
      if (cameraFlashWideRef.current) gsap.set(cameraFlashWideRef.current, { opacity: 0 });
      if (cameraFlashCoreRef.current) gsap.set(cameraFlashCoreRef.current, { opacity: 0 });
      gsap.set('.subtitle-accent-rule', { scaleX: 1, opacity: 0.65 });
      setCtaRevealed(true);
      return;
    }

    const subtitleWidth = subtitleTextRef.current.getBoundingClientRect().width || 240;
    const viewportWidth = window.innerWidth || 1024;
    const bounds = computeLoneToolSweepBounds(subtitleWidth, viewportWidth);
    const sweepSpan = bounds.rightX - bounds.leftX;

    const tl = gsap.timeline();
    loneToolTlRef.current = tl;

    // Prepare subtitle masked off at 100% right inset until the white beam sweeps across
    gsap.set(subtitleMaskRef.current, {
      autoAlpha: 1,
      clipPath: 'inset(-12px 100% -12px 0%)',
    });
    gsap.set(subtitleTextRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(6px)',
      textShadow: '0 0 24px rgba(255,255,255,0.85), 0 0 10px rgba(255,255,255,0.55)',
    });

    if (loneToolRef.current) {
      // Beat 1 (0.00s -> 0.40s): Left behind alone after fellow tools vanish — playful bounce & double-take
      tl.fromTo(
        loneToolRef.current,
        { autoAlpha: 0, xPercent: -50, yPercent: -50, x: -12, y: 50, scale: 0.62, rotate: -14 },
        { autoAlpha: 1, xPercent: -50, yPercent: -50, x: -10, y: 44, scale: 1.08, rotate: -8, duration: 0.22, ease: 'back.out(2.4)' },
        0
      ).to(
        loneToolRef.current,
        { scale: 1, rotate: 18, y: 42, duration: 0.18, ease: 'power2.inOut' },
        0.22
      );

      if (loneToolHaloRef.current) {
        tl.fromTo(
          loneToolHaloRef.current,
          { opacity: 0, scale: 0.65 },
          { opacity: 0.72, scale: 1.08, duration: 0.3, ease: 'power2.out' },
          0.06
        );
      }

      // Beat 2 (0.40s -> 1.20s): Organic curious search darts ("Wait... where did everyone go?")
      tl.to(
        loneToolRef.current,
        { x: bounds.searchRightX, y: 28, rotate: 24, duration: 0.24, ease: 'power3.out' },
        0.4
      )
        .to(
          loneToolRef.current,
          { rotate: 34, y: 26, duration: 0.1, ease: 'sine.inOut' },
          0.64
        )
        .to(
          loneToolRef.current,
          { x: bounds.searchLeftX, y: 46, rotate: -26, duration: 0.26, ease: 'power3.inOut' },
          0.74
        )
        // Brief eager anticipation dip as it spots the empty baseline beneath the IHAB logo
        .to(
          loneToolRef.current,
          {
            x: bounds.leftX - 8,
            y: 22,
            rotate: -34,
            scaleX: 1.06,
            scaleY: 0.92,
            duration: 0.2,
            ease: 'power2.inOut',
          },
          1.0
        );

      // Beat 3 (1.20s -> 1.56s): Graceful weightless arc upward and down onto left edge of subtitle baseline
      tl.to(
        loneToolRef.current,
        {
          x: bounds.leftX - 2,
          y: -24,
          rotate: -6,
          scaleX: 0.96,
          scaleY: 1.06,
          duration: 0.18,
          ease: 'power2.out',
        },
        1.2
      ).to(
        loneToolRef.current,
        {
          x: bounds.leftX + 10,
          y: -8,
          rotate: 4,
          scaleX: 1.06,
          scaleY: 0.96,
          duration: 0.18,
          ease: 'power2.in',
        },
        1.38
      );

      // Beat 4 (1.56s -> 2.38s): Rapid, fluid left-to-right glide sketching directly across the subtitle line
      tl.to(
        loneToolRef.current,
        {
          x: bounds.rightX + 10,
          y: -8,
          rotate: 10,
          scale: 1.04,
          duration: 0.82,
          ease: 'power2.inOut',
        },
        1.56
      );

      // Beat 5 (2.34s -> 2.82s): Tool lifts lightly at the right edge and dissolves cleanly into white light
      tl.to(
        loneToolRef.current,
        {
          x: bounds.rightX + 24,
          y: -22,
          rotate: 22,
          scale: 1.32,
          autoAlpha: 0,
          filter: 'blur(6px)',
          duration: 0.48,
          ease: 'power3.out',
        },
        2.34
      );

      if (loneToolHaloRef.current) {
        tl.to(
          loneToolHaloRef.current,
          { opacity: 1, scale: 1.45, duration: 0.28, ease: 'power2.out' },
          1.54
        ).to(
          loneToolHaloRef.current,
          { opacity: 0, scale: 2.1, duration: 0.44, ease: 'power3.out' },
          2.32
        );
      }

      if (loneToolFlareRef.current) {
        tl.fromTo(
          loneToolFlareRef.current,
          { opacity: 0, scale: 0.25 },
          { opacity: 0.95, scale: 1.5, duration: 0.24, ease: 'power2.out' },
          2.3
        ).to(
          loneToolFlareRef.current,
          { opacity: 0, scale: 2.4, duration: 0.46, ease: 'power3.out' },
          2.5
        );
      }
    }

    // Luminous Pure-White Light Beam & Trailing Ribbon Riding the Tool's Sweep (1.56s -> 2.38s)
    if (lightBeamHeadRef.current) {
      tl.fromTo(
        lightBeamHeadRef.current,
        { opacity: 0, xPercent: -50, yPercent: -50, x: bounds.leftX, scale: 0.65 },
        { opacity: 1, xPercent: -50, yPercent: -50, scale: 1.15, duration: 0.14, ease: 'power2.out' },
        1.52
      )
        .to(
          lightBeamHeadRef.current,
          { x: bounds.rightX, duration: 0.82, ease: 'power2.inOut' },
          1.56
        )
        .to(
          lightBeamHeadRef.current,
          { opacity: 0, scale: 1.7, duration: 0.42, ease: 'power3.out' },
          2.34
        );
    }

    if (lightBeamRibbonRef.current) {
      gsap.set(lightBeamRibbonRef.current, {
        width: sweepSpan,
        left: '50%',
        yPercent: -50,
        x: bounds.leftX,
        transformOrigin: 'left center',
      });
      tl.fromTo(
        lightBeamRibbonRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 0.9, scaleX: 1, duration: 0.82, ease: 'power2.inOut' },
        1.56
      ).to(
        lightBeamRibbonRef.current,
        { opacity: 0, duration: 0.56, ease: 'power3.out' },
        2.16
      );
    }

    // Wide & Core Soft White Studio Light Wash Expanding Gently Behind the Sweep
    if (cameraFlashWideRef.current) {
      tl.fromTo(
        cameraFlashWideRef.current,
        { opacity: 0, scale: 0.68 },
        { opacity: 0.68, scale: 1.04, duration: 0.55, ease: 'power2.out' },
        1.56
      ).to(
        cameraFlashWideRef.current,
        { opacity: 0, scale: 1.28, duration: 1.05, ease: 'power3.out' },
        2.1
      );
    }

    if (cameraFlashCoreRef.current) {
      tl.fromTo(
        cameraFlashCoreRef.current,
        { opacity: 0, scale: 0.58 },
        { opacity: 0.84, scale: 1.06, duration: 0.48, ease: 'power2.out' },
        1.6
      ).to(
        cameraFlashCoreRef.current,
        { opacity: 0, scale: 1.32, duration: 0.92, ease: 'power3.out' },
        2.06
      );
    }

    // Immediate Wake Masked Reveal + Optical Sharpness Settle for "GRAPHIC DESIGNER"
    tl.fromTo(
      subtitleMaskRef.current,
      { clipPath: 'inset(-12px 100% -12px 0%)' },
      {
        clipPath: 'inset(-12px 0% -12px 0%)',
        duration: 0.82,
        ease: 'power2.inOut',
        clearProps: 'clipPath',
      },
      1.56
    );

    tl.to(
      subtitleTextRef.current,
      {
        filter: 'blur(0px)',
        textShadow: '0 0 0px rgba(255,255,255,0)',
        duration: 0.72,
        ease: 'power3.out',
        clearProps: 'filter,textShadow',
      },
      1.86
    );

    // Left & right hairline rules extend symmetrically as the beam enters & exits
    tl.fromTo(
      '.subtitle-accent-rule-left',
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.65, duration: 0.56, ease: 'power3.out' },
      1.46
    );
    tl.fromTo(
      '.subtitle-accent-rule-right',
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.65, duration: 0.62, ease: 'power3.out' },
      2.18
    );

    // Reveal Enter Portfolio CTA smoothly right as the subtitle locks cleanly into view
    tl.call(() => setCtaRevealed(true), [], 2.05);

    return () => {
      tl.kill();
      if (loneToolTlRef.current === tl) {
        loneToolTlRef.current = null;
      }
    };
  }, [loneToolActive, logoRevealed, introCycleId]);

  // Clear clip-path immediately if user begins scrolling mid-reveal
  useEffect(() => {
    if (logoDockProgress > 0.06) {
      if (logoClipRevealRef.current) {
        gsap.set(logoClipRevealRef.current, { clearProps: 'clipPath' });
      }
      if (subtitleMaskRef.current) {
        gsap.set(subtitleMaskRef.current, { autoAlpha: 1, clearProps: 'clipPath' });
      }
      if (subtitleTextRef.current) {
        gsap.set(subtitleTextRef.current, { opacity: 1, filter: 'blur(0px)' });
      }
      if (loneToolRef.current) {
        gsap.set(loneToolRef.current, { autoAlpha: 0 });
      }
      gsap.set('.subtitle-accent-rule', { scaleX: 1, opacity: 0.65 });
    }
  }, [logoDockProgress]);

  const handleEnter = () => {
    unlockCrtAudio();
    onEnterPortfolio();
  };

  const subtitleScrollFade = Math.max(0, 1 - logoDockProgress * 2.4);

  return (
    <section
      id="intro"
      ref={sectionRef}
      aria-label="Ihab Nasr Portfolio Entrance"
      className="relative w-full h-[100dvh] min-h-[600px] flex flex-col items-center justify-end pb-8 sm:pb-11 px-5 sm:px-8 lg:px-12 overflow-hidden bg-transparent border-b border-white/[0.08]"
    >
      {/* Subtle Top Vignette for Navbar Legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050506]/80 via-[#050506]/25 to-transparent"
      />

      {/* Unified Pre-Logo Collaborative Design Swarm Sequence (Replays In-Place at Center on Initial Load & Scroll-Up Return) */}
      {swarmActive && (
        <IllustratorIntroSequence
          key={introCycleId}
          onRevealLogo={handleRevealLogo}
          onLoneToolStart={handleLoneToolStart}
        />
      )}

      {/* Centerpiece Transparent IHAB Emblem + Lone Illustrator Tool Sweep + "GRAPHIC DESIGNER" Subtitle */}
      <div
        data-testid="intro-logo-stage"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-10"
      >
        <div className="relative flex items-center justify-center -translate-y-[7vh] sm:-translate-y-[6vh]">
          <div data-testid="intro-center-logo-frame">
            <div
              ref={logoRevealRef}
              style={{
                opacity: logoRevealed ? undefined : 0,
                visibility: logoRevealed ? 'visible' : 'hidden',
              }}
              className="relative will-change-transform"
            >
              {/* Soft Elliptical Studio Aura Behind Emblem */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-24 rounded-full bg-[radial-gradient(ellipse_55%_48%_at_50%_50%,rgba(34,211,238,0.16)_0%,rgba(200,164,107,0.06)_44%,transparent_76%)] blur-2xl"
              />

              <div className={logoDockProgress < 0.04 ? 'animate-logo-float' : ''}>
                <div
                  ref={logoClipRevealRef}
                  data-testid="logo-emblem-crop-box"
                  className="relative w-[min(88vw,760px,94dvh)] aspect-[1716/838] overflow-hidden"
                >
                  <img
                    src={DESIGNER_PROFILE.emblemHeroSrc}
                    alt={DESIGNER_PROFILE.emblemHeroAlt}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    data-testid="global-ambient-emblem"
                    style={{
                      clipPath: 'inset(0 0 8.7% 0)',
                      WebkitMaskImage:
                        'radial-gradient(ellipse 98% 96% at 50% 48%, #000 84%, transparent 100%)',
                      maskImage:
                        'radial-gradient(ellipse 98% 96% at 50% 48%, #000 84%, transparent 100%)',
                    }}
                    className="w-full h-auto max-w-none block select-none"
                  />

                  {/* Diagonal Holographic Liquid-Chrome Refraction Scanline */}
                  <div
                    ref={scanlineBeamRef}
                    data-testid="logo-holographic-scanline"
                    className="pointer-events-none absolute -inset-y-8 -inset-x-10 opacity-0 mix-blend-screen will-change-transform"
                    style={{
                      background:
                        'linear-gradient(108deg, transparent 36%, rgba(34,211,238,0.48) 45%, rgba(255,255,255,0.95) 50%, rgba(186,230,253,0.6) 54%, rgba(200,164,107,0.35) 59%, transparent 66%)',
                    }}
                  />

                  {/* Chromatic Prism Bevel Glint on Materialization Lock */}
                  <div
                    ref={prismGlintRef}
                    className="pointer-events-none absolute -inset-y-6 -inset-x-8 opacity-0 mix-blend-screen will-change-transform"
                    style={{
                      background:
                        'linear-gradient(116deg, transparent 34%, rgba(34,211,238,0.38) 44%, rgba(244,241,234,0.72) 49%, rgba(232,194,120,0.42) 55%, transparent 64%)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle Stage: Lone Illustrator Tool Choreography + Luminous White Beam + "GRAPHIC DESIGNER" */}
          <div
            ref={subtitleContainerRef}
            data-testid="intro-subtitle-container"
            className="absolute top-full inset-x-0 mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-5 px-4 whitespace-nowrap"
            style={{
              opacity: subtitleScrollFade,
              transform: `translate3d(0, ${-logoDockProgress * 18}px, 0)`,
            }}
          >
            {/* Wide Soft Diffused White Studio Light Bloom (Unclipped) */}
            <div
              ref={cameraFlashWideRef}
              data-testid="subtitle-camera-flash-wide"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(98vw,1120px)] h-[380px] sm:h-[460px] opacity-0 mix-blend-screen blur-3xl will-change-[transform,opacity]"
              style={{
                background:
                  'radial-gradient(ellipse 58% 48% at 50% 50%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 26%, rgba(248,250,252,0.1) 48%, transparent 74%)',
              }}
            />

            {/* Soft Core White Glow Centered Over Typography */}
            <div
              ref={cameraFlashCoreRef}
              data-testid="subtitle-camera-flash-core"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,680px)] h-[180px] sm:h-[220px] opacity-0 mix-blend-screen blur-2xl will-change-[transform,opacity]"
              style={{
                background:
                  'radial-gradient(ellipse 56% 48% at 50% 50%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.42) 30%, rgba(241,245,249,0.14) 54%, transparent 74%)',
              }}
            />

            {/* Pure-White Luminous Ribbon Trail Painted Across the Baseline */}
            <div
              ref={lightBeamRibbonRef}
              data-testid="lone-tool-light-ribbon"
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 h-[22px] sm:h-[26px] opacity-0 mix-blend-screen blur-md will-change-transform"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.72) 55%, rgba(255,255,255,0.96) 92%, transparent 100%)',
              }}
            />

            {/* Traveling Pure-White Leading Beam Core Following the Lone Tool Nib */}
            <div
              ref={lightBeamHeadRef}
              data-testid="lone-tool-light-beam"
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 w-24 h-12 sm:w-28 sm:h-14 opacity-0 mix-blend-screen blur-lg will-change-transform"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(241,245,249,0.72) 36%, rgba(186,230,253,0.28) 64%, transparent 80%)',
              }}
            />

            {/* Expressive Pixar-Style Lone Luminous Adobe Illustrator Pen Tool */}
            <div
              ref={loneToolRef}
              data-testid="lone-illustrator-tool"
              aria-hidden="true"
              style={{ opacity: 0, visibility: loneToolActive ? 'visible' : 'hidden' }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-30 will-change-transform"
            >
              {/* Soft Expressive White & Cyan Aura Around Lone Tool */}
              <div
                ref={loneToolHaloRef}
                className="pointer-events-none absolute -inset-5 rounded-full opacity-0 mix-blend-screen blur-md"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(186,230,253,0.4) 44%, transparent 74%)',
                }}
              />
              {/* End-of-Pass Starlight Dissolution Flare */}
              <div
                ref={loneToolFlareRef}
                className="pointer-events-none absolute -inset-8 rounded-full opacity-0 mix-blend-screen blur-lg"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.68) 34%, transparent 72%)',
                }}
              />
              <svg
                viewBox="0 0 44 44"
                fill="none"
                className="relative w-10 h-10 sm:w-11 sm:h-11 drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]"
              >
                {/* Pen Tool Collar */}
                <path
                  d="M29.5 6.5L37.5 14.5L32.5 19.5L24.5 11.5L29.5 6.5Z"
                  fill="#121D2D"
                  stroke="#FFFFFF"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
                {/* Luminous Vector Pen Nib Body */}
                <path
                  d="M24.5 11.5L12 16.8L6.5 37.5L27.2 32L32.5 19.5"
                  fill="rgba(22, 34, 52, 0.94)"
                  stroke="#FFFFFF"
                  strokeWidth="1.85"
                  strokeLinejoin="round"
                />
                {/* Ink Split Line + Bright Nib Tip Spark */}
                <path
                  d="M6.5 37.5L18.5 25.5"
                  stroke="#FFFFFF"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="24" r="2.3" fill="#FFFFFF" />
                <circle cx="6.5" cy="37.5" r="2.6" fill="#FFFFFF" />
              </svg>
            </div>

            <span className="subtitle-accent-rule subtitle-accent-rule-left relative z-10 block w-5 sm:w-8 md:w-12 h-px origin-right bg-gradient-to-r from-transparent to-[#22D3EE]/70 opacity-0" />

            <div
              ref={subtitleMaskRef}
              style={{
                opacity: loneToolActive ? undefined : 0,
                visibility: loneToolActive ? 'visible' : 'hidden',
              }}
              className="relative z-10 py-1"
            >
              <p
                ref={subtitleTextRef}
                data-testid="intro-subtitle-text"
                aria-label="Graphic Designer"
                style={{ opacity: loneToolActive ? undefined : 0 }}
                className="relative z-10 font-sans text-xs sm:text-sm md:text-[15px] font-medium uppercase tracking-[0.42em] pl-[0.42em] text-[#F1F5F9] whitespace-nowrap drop-shadow-[0_2px_14px_rgba(255,255,255,0.22)] will-change-[transform,opacity,filter]"
              >
                Graphic Designer
              </p>
            </div>

            <span className="subtitle-accent-rule subtitle-accent-rule-right relative z-10 block w-5 sm:w-8 md:w-12 h-px origin-left bg-gradient-to-l from-transparent to-[#C8A46B]/70 opacity-0" />
          </div>
        </div>
      </div>

      {/* Clean Action CTAs + Luminous Animated Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        <div
          ref={ctaContainerRef}
          style={{
            opacity: ctaRevealed ? undefined : 0,
            visibility: ctaRevealed ? 'visible' : 'hidden',
          }}
          className="intro-ui-reveal flex flex-col items-center gap-5"
        >
          <MagneticButton
            onClick={handleEnter}
            cursorLabel="Enter"
            className="group inline-flex items-center gap-3 px-8 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase bg-[#070B12]/90 border border-[#22D3EE]/55 text-[#F4F1EA] shadow-[0_0_28px_rgba(34,211,238,0.2)] hover:border-[#C8A46B] hover:bg-[#C8A46B] hover:text-[#050506] hover:shadow-[0_0_32px_rgba(200,164,107,0.36)] transition-all duration-300"
          >
            <span>Enter Portfolio</span>
            <ArrowDown
              className="w-4 h-4 text-[#22D3EE] group-hover:text-[#050506] transition-colors"
              aria-hidden="true"
            />
          </MagneticButton>

          <button
            type="button"
            onClick={handleEnter}
            data-testid="intro-scroll-indicator"
            aria-label="Scroll to main portfolio"
            className="group flex flex-col items-center gap-2.5 text-[10px] tracking-[0.24em] uppercase text-[#D8D3C9] hover:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            <span>Scroll to Explore</span>
            <span
              className="relative flex flex-col items-center justify-start"
              aria-hidden="true"
            >
              <span className="absolute -inset-x-3 -inset-y-1 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.38)_0%,rgba(200,164,107,0.2)_55%,transparent_100%)] blur-[6px] animate-scroll-glow" />
              <span className="relative w-[2px] h-9 bg-white/15 overflow-hidden rounded-full shadow-[0_0_12px_rgba(34,211,238,0.45)]">
                <span className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-[#22D3EE] via-[#E6FCFF] to-[#C8A46B] shadow-[0_0_14px_rgba(34,211,238,0.95)] animate-scroll-cue" />
              </span>
              <ChevronDown className="relative -mt-1 w-4 h-4 text-[#22D3EE] drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-scroll-glow" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
