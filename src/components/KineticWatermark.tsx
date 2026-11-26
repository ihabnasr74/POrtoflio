import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KineticWatermarkProps {
  text: string;
  direction?: 1 | -1;
  className?: string;
}

export function KineticWatermark({
  text,
  direction = 1,
  className = 'top-8',
}: KineticWatermarkProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !wrapRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        trackRef.current,
        { xPercent: -24 * direction },
        {
          xPercent: 24 * direction,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      data-testid="kinetic-watermark"
      className={`pointer-events-none absolute inset-x-0 overflow-hidden select-none z-0 ${className}`}
    >
      <div
        ref={trackRef}
        className="w-max flex items-center gap-12 will-change-transform"
      >
        <span className="font-serif italic text-[clamp(4.5rem,11vw,10rem)] leading-none tracking-[-0.03em] text-white/[0.045] whitespace-nowrap">
          {text}
        </span>
        <span className="font-serif italic text-[clamp(4.5rem,11vw,10rem)] leading-none tracking-[-0.03em] text-[#C8A46B]/[0.05] whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  );
}
