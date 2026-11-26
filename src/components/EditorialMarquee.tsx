import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function EditorialMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrubTrackRef = useRef<HTMLDivElement>(null);

  const items = [
    'Brand Identity',
    'Packaging Design',
    'Product Visualization',
    'Advertising',
    'Creative Campaigns',
    'Visual Design',
  ];

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !wrapRef.current || !scrubTrackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scrubTrackRef.current,
        { xPercent: 8 },
        {
          xPercent: -18,
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
  }, []);

  const renderGroup = (prefix: string) => (
    <div className="flex items-center gap-8 pr-8">
      {items.map((item) => (
        <div key={`${prefix}-${item}`} className="flex items-center gap-8">
          <span className="font-serif italic text-xl sm:text-2xl tracking-wide text-[#B8B2A7]">
            {item}
          </span>
          <span aria-hidden="true" className="text-[#C8A46B] text-sm">
            ✦
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="w-full overflow-hidden border-y border-white/[0.1] bg-[#0A0A0D]/55 py-4 select-none"
    >
      <div ref={scrubTrackRef} className="will-change-transform">
        <div className="animate-marquee">
          {renderGroup('a')}
          {renderGroup('b')}
        </div>
      </div>
    </div>
  );
}
