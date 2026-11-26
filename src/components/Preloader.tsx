import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (params.get('autostart') === '1' || reduced) {
      onComplete();
      return;
    }

    const start = performance.now();
    const duration = 680;
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(step);
      } else {
        setExiting(true);
        setTimeout(onComplete, 360);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <div
      aria-hidden="true"
      onClick={() => {
        setExiting(true);
        setTimeout(onComplete, 200);
      }}
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#050506] px-6 py-8 md:px-12 md:py-10 transition-all duration-300 ease-out ${
        exiting ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-[#9A958C]">
        <span>Ihab Nasr</span>
        <span className="font-mono tabular-nums">{progress}%</span>
      </div>

      <div className="max-w-4xl">
        <p className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#F4F1EA]">
          Graphic &amp; Visual Design
        </p>
        <p className="mt-3 text-sm text-[#9A958C]">
          Brand Identity · Packaging Design · Product Visualization · Advertising
        </p>
      </div>

      <div className="w-full h-px bg-[#1E1E24] overflow-hidden">
        <div
          className="h-full bg-[#C8A46B] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
