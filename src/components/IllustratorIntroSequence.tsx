import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  DESIGN_SWARM_CURSORS,
  INTRO_STAGE_GEOMETRY,
  computeIntroStageDimensions,
} from '../utils/introLifecycle';

interface IllustratorIntroSequenceProps {
  onRevealLogo: () => void;
  onLoneToolStart?: () => void;
}

export function IllustratorIntroSequence({
  onRevealLogo,
  onLoneToolStart,
}: IllustratorIntroSequenceProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const burstRingRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const handlePullRef = useRef<SVGLineElement>(null);
  const cursorRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasTriggeredRevealRef = useRef(false);
  const hasTriggeredLoneToolRef = useRef(false);

  const [swarmScale, setSwarmScale] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    return computeIntroStageDimensions(window.innerWidth, window.innerHeight).swarmScale;
  });

  // Synchronize Design Swarm + Pen coordinate stage scale 1:1 with the responsive SVG artboard
  useLayoutEffect(() => {
    const el = artboardRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) {
        setSwarmScale(width / INTRO_STAGE_GEOMETRY.viewBoxWidth);
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    window.addEventListener('resize', updateScale, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  useEffect(() => {
    const triggerReveal = () => {
      if (hasTriggeredRevealRef.current) return;
      hasTriggeredRevealRef.current = true;
      onRevealLogo();
    };

    const triggerLoneTool = () => {
      if (hasTriggeredLoneToolRef.current) return;
      hasTriggeredLoneToolRef.current = true;
      onLoneToolStart?.();
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !stageRef.current) {
      triggerReveal();
      triggerLoneTool();
      return;
    }

    let tlRef: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const bboxFrame = stageRef.current?.querySelector<SVGRectElement>('.ai-bbox-frame');
      const bboxStem = stageRef.current?.querySelector<SVGLineElement>('.ai-bbox-stem');
      const pathA = stageRef.current?.querySelector<SVGPathElement>('.ai-draw-path-a');
      const pathB = stageRef.current?.querySelector<SVGPathElement>('.ai-draw-path-b');
      const pathC = stageRef.current?.querySelector<SVGPathElement>('.ai-draw-path-c');
      const guideRing = stageRef.current?.querySelector<SVGCircleElement>('.ai-guide-ring');
      const guideInner = stageRef.current?.querySelector<SVGCircleElement>('.ai-guide-inner');
      const axisCross = stageRef.current?.querySelectorAll<SVGLineElement>('.ai-axis-line');
      const bezierHandles = stageRef.current?.querySelectorAll<SVGLineElement>('.ai-bezier-handle');
      const swarmTrails = stageRef.current?.querySelectorAll<SVGPathElement>('.swarm-light-trail');

      [bboxFrame, bboxStem, pathA, pathB, pathC, guideRing, guideInner].forEach((el) => {
        if (!el) return;
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });

      if (axisCross) {
        axisCross.forEach((line) => {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        });
      }

      if (bezierHandles) {
        bezierHandles.forEach((line) => {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
        });
      }

      if (swarmTrails) {
        swarmTrails.forEach((trail) => {
          const len = trail.getTotalLength();
          gsap.set(trail, {
            strokeDasharray: `${Math.min(130, len * 0.28)} ${len}`,
            strokeDashoffset: len * 0.28,
            opacity: 0,
          });
        });
      }

      const tl = gsap.timeline({ paused: true });

      // Phase 1 (0.00s -> 0.90s): Vector Bounding Box, 8 Transform Anchor Handles & Minimalist Designer Toolbar
      if (bboxFrame) {
        tl.to(bboxFrame, { strokeDashoffset: 0, duration: 0.72, ease: 'power3.out' }, 0);
      }
      if (bboxStem) {
        tl.to(bboxStem, { strokeDashoffset: 0, duration: 0.34, ease: 'power3.out' }, 0.16);
      }

      tl.fromTo(
        '.ai-bbox-handle',
        { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
        {
          opacity: 1,
          scale: 1,
          transformOrigin: '50% 50%',
          duration: 0.36,
          stagger: 0.035,
          ease: 'back.out(2)',
        },
        0.14
      );

      tl.fromTo(
        '.ai-toolbar-dock',
        { opacity: 0, y: -8, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.58, ease: 'power3.out' },
        0.08
      );

      if (axisCross && axisCross.length > 0) {
        tl.to(
          axisCross,
          { strokeDashoffset: 0, duration: 0.72, stagger: 0.08, ease: 'power3.out' },
          0.08
        );
      }

      if (guideRing) {
        tl.to(guideRing, { strokeDashoffset: 0, duration: 0.95, ease: 'power3.out' }, 0.1);
      }
      if (guideInner) {
        tl.to(guideInner, { strokeDashoffset: 0, duration: 0.85, ease: 'power3.out' }, 0.22);
      }

      // Phase 2 (0.24s -> 2.18s): Vector Sculpting + Collaborative Multi-Cursor Design Swarm
      if (pathA) {
        tl.to(pathA, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.26);
      }
      if (pathB) {
        tl.to(pathB, { strokeDashoffset: 0, duration: 1.38, ease: 'power2.inOut' }, 0.44);
      }
      if (pathC) {
        tl.to(pathC, { strokeDashoffset: 0, duration: 1.24, ease: 'power3.out' }, 0.68);
      }

      tl.fromTo(
        '.ai-anchor-node',
        { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
        {
          scale: 1,
          opacity: 1,
          transformOrigin: '50% 50%',
          duration: 0.34,
          stagger: 0.11,
          ease: 'back.out(2.2)',
        },
        0.32
      );

      if (bezierHandles && bezierHandles.length > 0) {
        tl.to(
          bezierHandles,
          { opacity: 0.95, strokeDashoffset: 0, duration: 0.5, stagger: 0.14, ease: 'power3.out' },
          0.48
        );
      }

      if (handlePullRef.current) {
        tl.fromTo(
          handlePullRef.current,
          { attr: { x2: 145, y2: 181 } },
          { attr: { x2: 168, y2: 104 }, duration: 0.82, ease: 'power3.out' },
          0.66
        );
      }

      // Active Pen Nib sculpting primary curve inside the unified 760x402 coordinate stage
      if (penRef.current) {
        tl.fromTo(
          penRef.current,
          { opacity: 0, x: -284, y: 69, rotate: -22, scale: 0.84 },
          { opacity: 1, x: -115, y: -56, rotate: -6, scale: 1.05, duration: 0.64, ease: 'power3.out' },
          0.2
        )
          .to(
            penRef.current,
            { x: 40, y: -42, rotate: 4, scale: 1.02, duration: 0.62, ease: 'power2.inOut' },
            0.86
          )
          .to(
            penRef.current,
            { x: 245, y: -62, rotate: 12, scale: 0.9, opacity: 0, duration: 0.56, ease: 'power3.out' },
            1.5
          );
      }

      // Luminous Light Trails sweeping behind the 4 collaborative cursors
      if (swarmTrails) {
        swarmTrails.forEach((trail, idx) => {
          const len = trail.getTotalLength();
          tl.to(trail, { opacity: 0.72, duration: 0.2, ease: 'power2.out' }, 0.12 + idx * 0.04)
            .to(
              trail,
              { strokeDashoffset: -len, duration: 1.85, ease: 'power2.inOut' },
              0.12 + idx * 0.04
            )
            .to(trail, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.98);
        });
      }

      // Collaborative Multi-Cursor "Design Swarm" Choreography (Cyan, Electric Blue, Violet, Gold)
      DESIGN_SWARM_CURSORS.forEach((cursor, idx) => {
        const el = cursorRefs.current[idx];
        if (!el) return;

        const ripple = el.querySelector<HTMLElement>('.swarm-click-ripple');
        gsap.set(el, {
          opacity: 0,
          x: cursor.start.x,
          y: cursor.start.y,
          scale: 0.76,
        });

        tl.to(
          el,
          {
            opacity: 1,
            scale: 1,
            duration: 0.26,
            ease: 'power3.out',
          },
          0.08 + idx * 0.05
        );

        cursor.waypoints.forEach((wp, wpIdx) => {
          const prevAt = wpIdx === 0 ? 0.08 + idx * 0.05 : cursor.waypoints[wpIdx - 1].at;
          const dur = Math.max(0.28, wp.at - prevAt);
          tl.to(
            el,
            {
              x: wp.x,
              y: wp.y,
              duration: dur,
              ease: wp.snap ? 'back.out(1.45)' : 'power3.inOut',
            },
            prevAt
          );

          if (wp.snap && ripple) {
            tl.fromTo(
              ripple,
              { scale: 0.35, opacity: 0.92 },
              { scale: 2.35, opacity: 0, duration: 0.38, ease: 'power2.out' },
              wp.at
            );
          }
        });

        // Graceful inward convergence into center silhouette before luminous burst
        tl.to(
          el,
          {
            x: cursor.converge.x,
            y: cursor.converge.y,
            scale: 0.92,
            duration: 0.32,
            ease: 'power3.in',
          },
          1.84
        );

        // Explosive luminous burst scatter outward as metallic 3D logo materializes
        tl.to(
          el,
          {
            x: cursor.scatter.x,
            y: cursor.scatter.y,
            scale: 1.24,
            opacity: 0,
            duration: 0.56,
            ease: 'power3.out',
          },
          2.14
        );
      });

      // Phase 3 (2.12s -> 3.05s): Convergent Burst -> Hands Off to Diagonal Liquid-Chrome Logo Morph
      if (burstRingRef.current) {
        tl.fromTo(
          burstRingRef.current,
          { opacity: 0, scale: 0.2 },
          { opacity: 0.9, scale: 1.4, duration: 0.45, ease: 'power3.out' },
          2.1
        ).to(
          burstRingRef.current,
          { opacity: 0, scale: 2.15, duration: 0.55, ease: 'power2.out' },
          2.36
        );
      }

      if (flashRef.current) {
        tl.fromTo(
          flashRef.current,
          { opacity: 0, scale: 0.42 },
          {
            opacity: 0.96,
            scale: 1.35,
            duration: 0.34,
            ease: 'power2.out',
            onStart: triggerReveal,
          },
          2.12
        ).to(
          flashRef.current,
          { opacity: 0, scale: 1.78, duration: 0.65, ease: 'power3.out' },
          2.44
        );
      } else {
        tl.call(triggerReveal, [], 2.12);
      }

      // Dissolve designer toolbar outward right as Design Swarm scatters, leaving the lone tool behind
      tl.to(
        '.ai-toolbar-dock',
        { opacity: 0, y: -12, scale: 0.9, duration: 0.36, ease: 'power2.in' },
        2.14
      );

      tl.to(
        stageRef.current,
        { opacity: 0, scale: 1.03, duration: 0.46, ease: 'power3.out' },
        2.24
      );

      tl.call(triggerReveal, [], 2.12);
      tl.call(triggerLoneTool, [], 2.74);
      tlRef = tl;
    }, stageRef);

    const playRaf = requestAnimationFrame(() => {
      tlRef?.play(0);
    });

    const handleVisibility = () => {
      if (!document.hidden && tlRef && !hasTriggeredLoneToolRef.current && !tlRef.isActive()) {
        tlRef.play();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(playRaf);
      document.removeEventListener('visibilitychange', handleVisibility);
      ctx.revert();
    };
  }, [onRevealLogo, onLoneToolStart]);

  return (
    <div
      ref={stageRef}
      data-testid="illustrator-intro-sequence"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center -translate-y-[7vh] sm:-translate-y-[6vh]"
    >
      {/* Artboard width = emblemWidth * (760/684) so ai-bbox-frame (684x334) hugs the exact settled IHAB emblem across all mobile & desktop screens */}
      <div
        ref={artboardRef}
        className="relative w-[calc(min(88vw,760px,94dvh)*1.111111)] aspect-[760/402] flex items-center justify-center"
      >
        {/* Compact Horizontal Designer Software Toolbar Dock for Mobile (< sm) Centered Above Bounding Box */}
        <div
          data-testid="designer-software-toolbar-mobile"
          className="ai-toolbar-dock flex sm:hidden flex-row items-center gap-2 absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-lg border border-white/15 bg-[#090D14]/88 backdrop-blur-md shadow-[0_12px_28px_rgba(0,0,0,0.65),0_0_16px_rgba(34,211,238,0.12)]"
        >
          <div className="w-5 h-5 flex items-center justify-center rounded text-[#B8B2A7]">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <path d="M5 3L15 10.5L9.8 11.6L7.2 16.5L5 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#22D3EE]/16 border border-[#22D3EE]/55 text-[#22D3EE]">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <path d="M13 3L17 7L14.5 9.5L10.5 5.5L13 3Z" stroke="#C8A46B" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M10.5 5.5L5.5 8L3.5 16.5L12 14.5L14.5 9.5" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
              <circle cx="9.5" cy="10.5" r="1.1" fill="#C8A46B" />
            </svg>
          </div>
          <div className="w-5 h-5 flex items-center justify-center rounded text-[#C8A46B]/85">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <path d="M4 15C5.5 8 14.5 8 16 15" stroke="currentColor" strokeWidth="1.3" />
              <line x1="4" y1="6" x2="16" y2="6" stroke="#22D3EE" strokeWidth="1.1" strokeOpacity="0.8" />
              <circle cx="4" cy="6" r="1.4" fill="#22D3EE" />
              <circle cx="16" cy="6" r="1.4" fill="#22D3EE" />
              <rect x="8.5" y="4.5" width="3" height="3" fill="#090D14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="w-5 h-5 flex items-center justify-center rounded text-[#B8B2A7]">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <circle cx="8" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.3" />
              <rect x="8" y="8.5" width="7.5" height="7.5" rx="1.2" stroke="#C8A46B" strokeWidth="1.2" strokeDasharray="2 1.5" />
            </svg>
          </div>
          <span className="h-3.5 w-[1px] bg-white/15" />
          <div className="relative w-4 h-4">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 rounded-[2px] bg-[#22D3EE]/85 border border-white/60" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-[2px] bg-[#090D14] border-2 border-[#C8A46B]" />
          </div>
        </div>

        {/* Sleek Minimalist Graphic Design Software Toolbar Dock for Tablet & Desktop (sm+) */}
        <div
          data-testid="designer-software-toolbar"
          className="ai-toolbar-dock hidden sm:flex flex-col items-center gap-2 absolute -left-4 lg:-left-7 top-1/2 -translate-y-1/2 z-20 w-9 py-2.5 px-1.5 rounded-lg border border-white/15 bg-[#090D14]/82 backdrop-blur-md shadow-[0_14px_34px_rgba(0,0,0,0.65),0_0_20px_rgba(34,211,238,0.12)]"
        >
          {/* Direct Selection Arrow */}
          <div className="w-6 h-6 flex items-center justify-center rounded text-[#B8B2A7]">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <path d="M5 3L15 10.5L9.8 11.6L7.2 16.5L5 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Active Pen Tool */}
          <div className="w-6 h-6 flex items-center justify-center rounded bg-[#22D3EE]/16 border border-[#22D3EE]/55 text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.38)]">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <path d="M13 3L17 7L14.5 9.5L10.5 5.5L13 3Z" stroke="#C8A46B" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M10.5 5.5L5.5 8L3.5 16.5L12 14.5L14.5 9.5" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
              <circle cx="9.5" cy="10.5" r="1.1" fill="#C8A46B" />
            </svg>
          </div>
          {/* Anchor Point / Bezier Handle Tool */}
          <div className="w-6 h-6 flex items-center justify-center rounded text-[#C8A46B]/85">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <path d="M4 15C5.5 8 14.5 8 16 15" stroke="currentColor" strokeWidth="1.3" />
              <line x1="4" y1="6" x2="16" y2="6" stroke="#22D3EE" strokeWidth="1.1" strokeOpacity="0.8" />
              <circle cx="4" cy="6" r="1.4" fill="#22D3EE" />
              <circle cx="16" cy="6" r="1.4" fill="#22D3EE" />
              <rect x="8.5" y="4.5" width="3" height="3" fill="#090D14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          {/* Shape Builder */}
          <div className="w-6 h-6 flex items-center justify-center rounded text-[#B8B2A7]">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <circle cx="8" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.3" />
              <rect x="8" y="8.5" width="7.5" height="7.5" rx="1.2" stroke="#C8A46B" strokeWidth="1.2" strokeDasharray="2 1.5" />
            </svg>
          </div>
          {/* Eyedropper */}
          <div className="w-6 h-6 flex items-center justify-center rounded text-[#B8B2A7]">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <path d="M12.5 4.5C13.7 3.3 15.5 3.3 16.5 4.3C17.5 5.3 17.5 7.1 16.3 8.3L14 10.6L10.2 6.8L12.5 4.5Z" stroke="#C8A46B" strokeWidth="1.25" />
              <path d="M11 7.6L4.5 14.1L4 16.5L6.4 16L12.9 9.5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Divider + Dual Fill & Stroke Swatches */}
          <span className="w-4 h-[1px] bg-white/15 my-0.5" />
          <div className="relative w-5 h-5">
            <span className="absolute top-0 left-0 w-3 h-3 rounded-[2px] bg-[#22D3EE]/85 border border-white/60" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-[2px] bg-[#090D14] border-2 border-[#C8A46B]" />
          </div>
        </div>

        {/* Vector Artboard Bounding Box (684x334 centered in 760x402), Transform Anchor Handles, Golden-Ratio Guides & Cubic Bezier Drawing */}
        <svg viewBox="0 0 760 402" fill="none" className="w-full h-full overflow-visible">
          {/* Vector Selection Bounding Box + Rotation Pivot Stem (Exact 1716:838 Emblem Aspect Ratio) */}
          <g data-testid="vector-bounding-box">
            <rect
              x="38"
              y="34"
              width="684"
              height="334"
              rx="2"
              className="ai-bbox-frame"
              stroke="rgba(34,211,238,0.52)"
              strokeWidth="1.35"
            />
            {/* Top Rotation Stem + Circular Pivot Node */}
            <line
              x1="380"
              y1="34"
              x2="380"
              y2="14"
              className="ai-bbox-stem"
              stroke="rgba(200,164,107,0.72)"
              strokeWidth="1.2"
            />
            <g transform="translate(380 10)">
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#050506"
                stroke="#C8A46B"
                strokeWidth="1.5"
                className="ai-bbox-handle"
              />
            </g>
            {/* 8 Transform Bounding-Box Anchor Squares (4 Corners + 4 Edge Midpoints) */}
            <g transform="translate(38 34)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#22D3EE" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
            <g transform="translate(380 34)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#22D3EE" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
            <g transform="translate(722 34)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#C8A46B" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
            <g transform="translate(722 201)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#C8A46B" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
            <g transform="translate(722 368)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#22D3EE" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
            <g transform="translate(380 368)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#22D3EE" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
            <g transform="translate(38 368)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#C8A46B" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
            <g transform="translate(38 201)">
              <rect x="-4" y="-4" width="8" height="8" fill="#050506" stroke="#22D3EE" strokeWidth="1.6" className="ai-bbox-handle" />
            </g>
          </g>

          {/* Swarm Cursor Luminous Motion Light Trails */}
          <path
            d="M 64 329 Q 115 231 168 104 T 316 202 T 536 140 L 362 193"
            className="swarm-light-trail"
            stroke="#22D3EE"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 38 34 Q 140 34 722 34 T 722 201 T 722 368 L 400 189"
            className="swarm-light-trail"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 660 43 Q 460 81 422 124 T 240 290 T 502 290 T 370 215"
            className="swarm-light-trail"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 695 359 Q 510 146 380 10 T 536 140 T 664 130 L 394 211"
            className="swarm-light-trail"
            stroke="#C8A46B"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Precision Diagonal & Horizontal Symmetry Guides */}
          <line
            x1="48"
            y1="201"
            x2="712"
            y2="201"
            className="ai-axis-line"
            stroke="rgba(34,211,238,0.22)"
            strokeWidth="1"
          />
          <line
            x1="380"
            y1="26"
            x2="380"
            y2="376"
            className="ai-axis-line"
            stroke="rgba(200,164,107,0.24)"
            strokeWidth="1"
          />

          {/* Golden-Ratio Geometric Construction Rings */}
          <circle
            cx="380"
            cy="201"
            r="154"
            className="ai-guide-ring"
            stroke="rgba(34,211,238,0.42)"
            strokeWidth="1.35"
          />
          <circle
            cx="380"
            cy="201"
            r="96"
            className="ai-guide-inner"
            stroke="rgba(200,164,107,0.48)"
            strokeWidth="1.35"
          />

          {/* Primary Sculpted Bezier Vector Curves Mirroring the IHAB Silhouette */}
          <path
            d="M96 270 C 156 100, 262 100, 316 202 C 362 288, 452 88, 536 140 C 618 190, 636 292, 664 130"
            className="ai-draw-path-a"
            stroke="url(#introVectorGradA)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M140 124 L 236 290 C 296 290, 360 164, 422 124 L 502 290 C 562 250, 624 230, 650 264"
            className="ai-draw-path-b"
            stroke="url(#introVectorGradB)"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M250 298 C 378 228, 494 158, 628 174 C 674 180, 680 244, 616 272"
            className="ai-draw-path-c"
            stroke="rgba(244,241,234,0.68)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Bezier Tangent Handle Levers */}
          <line
            ref={handlePullRef}
            x1="96"
            y1="270"
            x2="168"
            y2="104"
            className="ai-bezier-handle"
            stroke="#22D3EE"
            strokeWidth="1.3"
            strokeOpacity="0.88"
          />
          <line
            x1="452"
            y1="88"
            x2="618"
            y2="190"
            className="ai-bezier-handle"
            stroke="#C8A46B"
            strokeWidth="1.3"
            strokeOpacity="0.88"
          />

          {/* Anchor Squares & Handle Tip Circles */}
          <g transform="translate(96 270)">
            <rect x="-5" y="-5" width="10" height="10" fill="#050506" stroke="#22D3EE" strokeWidth="1.8" className="ai-anchor-node" />
          </g>
          <g transform="translate(316 202)">
            <rect x="-5" y="-5" width="10" height="10" fill="#050506" stroke="#F4F1EA" strokeWidth="1.8" className="ai-anchor-node" />
          </g>
          <g transform="translate(422 124)">
            <rect x="-5" y="-5" width="10" height="10" fill="#050506" stroke="#C8A46B" strokeWidth="1.8" className="ai-anchor-node" />
          </g>
          <g transform="translate(536 140)">
            <rect x="-5" y="-5" width="10" height="10" fill="#050506" stroke="#C8A46B" strokeWidth="1.8" className="ai-anchor-node" />
          </g>
          <g transform="translate(664 130)">
            <rect x="-5" y="-5" width="10" height="10" fill="#050506" stroke="#22D3EE" strokeWidth="1.8" className="ai-anchor-node" />
          </g>
          <g transform="translate(168 104)">
            <circle cx="0" cy="0" r="5" fill="#050506" stroke="#22D3EE" strokeWidth="1.7" className="ai-anchor-node" />
          </g>
          <g transform="translate(618 190)">
            <circle cx="0" cy="0" r="5" fill="#050506" stroke="#C8A46B" strokeWidth="1.7" className="ai-anchor-node" />
          </g>

          <defs>
            <linearGradient id="introVectorGradA" x1="96" y1="270" x2="664" y2="130" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" />
              <stop offset="0.5" stopColor="#F4F1EA" />
              <stop offset="1" stopColor="#C8A46B" />
            </linearGradient>
            <linearGradient id="introVectorGradB" x1="140" y1="124" x2="650" y2="264" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C8A46B" />
              <stop offset="0.55" stopColor="#38BDF8" />
              <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>

        {/* Proportionally Scaled 760x402 Coordinate Stage for Pen Nib + Multi-Cursor Design Swarm */}
        <div
          data-testid="design-swarm-cursors"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
        >
          <div
            className="relative w-[760px] h-[402px] shrink-0 origin-center"
            style={{ transform: `scale(${swarmScale})` }}
          >
            {/* Active Adobe Illustrator Pen Tool Nib Sculpting the Primary Curve */}
            <div
              ref={penRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#22D3EE] drop-shadow-[0_0_24px_rgba(34,211,238,0.85)]"
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11">
                <path d="M33 6L42 15L36 21L27 12L33 6Z" fill="#081018" stroke="#C8A46B" strokeWidth="1.9" strokeLinejoin="round" />
                <path d="M27 12L13 18L7 41L30 35L36 21" fill="#081018" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                <path d="M7 41L20 28" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <circle cx="22" cy="26" r="2.4" fill="#C8A46B" />
              </svg>
            </div>

            {DESIGN_SWARM_CURSORS.map((cursor, idx) => (
              <div
                key={cursor.id}
                ref={(el) => {
                  cursorRefs.current[idx] = el;
                }}
                data-testid={`swarm-cursor-${cursor.id}`}
                className="absolute left-1/2 top-1/2 will-change-transform"
              >
                {/* Snap Ripple Ring */}
                <span
                  className="swarm-click-ripple pointer-events-none absolute -left-3 -top-3 w-6 h-6 rounded-full border-2 opacity-0"
                  style={{ borderColor: cursor.color }}
                />

                {/* Sleek Collaborative Vector Pointer Arrow */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 -translate-x-[2px] -translate-y-[2px]"
                  style={{
                    filter: `drop-shadow(0 0 12px ${cursor.glowColor}) drop-shadow(0 4px 10px rgba(0,0,0,0.75))`,
                  }}
                >
                  <path
                    d="M3.5 2.5L19.5 10.6L11.8 12.8L8.4 20.5L3.5 2.5Z"
                    fill={cursor.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Collaborative Designer Role Tag Attached at Pointer Tail */}
                <div
                  className={`-mt-1 inline-flex items-center px-2.5 py-0.5 rounded-[5px] border text-[10px] font-semibold tracking-[0.06em] whitespace-nowrap shadow-[0_6px_18px_rgba(0,0,0,0.65)] ${
                    cursor.badgeAlign === 'left'
                      ? '-translate-x-[calc(100%+4px)] rounded-tr-none'
                      : 'ml-4 rounded-tl-none'
                  }`}
                  style={{
                    backgroundColor: cursor.badgeBg,
                    borderColor: cursor.color,
                    color: cursor.badgeText,
                    boxShadow: `0 6px 18px rgba(0,0,0,0.6), 0 0 14px ${cursor.glowColor.replace('0.85', '0.28')}`,
                  }}
                >
                  {cursor.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expanding Convergent Light Burst Ring on Materialization */}
        <div
          ref={burstRingRef}
          className="pointer-events-none absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-[#22D3EE]/70 opacity-0 mix-blend-screen will-change-transform"
          style={{
            boxShadow:
              '0 0 42px rgba(34,211,238,0.65), inset 0 0 28px rgba(200,164,107,0.45)',
          }}
        />

        {/* Holographic Synthesis Ignition Halo Triggering Vector-to-Metallic Materialization */}
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen will-change-transform"
          style={{
            background:
              'radial-gradient(54% 58% at 50% 50%, rgba(235,252,255,0.86) 0%, rgba(34,211,238,0.6) 28%, rgba(200,164,107,0.36) 52%, transparent 78%)',
          }}
        />
      </div>
    </div>
  );
}
