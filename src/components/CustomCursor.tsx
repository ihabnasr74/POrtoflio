import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;
      setLabel(cursorTarget?.dataset.cursor || null);
    };

    const onLeave = () => setVisible(false);
    const onClearLabel = () => setLabel(null);

    const tick = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onClearLabel, { passive: true });
    window.addEventListener('keydown', onClearLabel);
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClearLabel);
      window.removeEventListener('keydown', onClearLabel);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-[90] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-full border transition-all duration-200 ease-out ${
          label
            ? 'h-16 w-16 border-[#C8A46B]/80 bg-[#0C0C0F]/85 backdrop-blur-sm text-[#F4F1EA]'
            : 'h-7 w-7 border-[#F4F1EA]/35 bg-transparent'
        }`}
      >
        {label && (
          <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#C8A46B]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
