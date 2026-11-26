import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  cursorLabel?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  cursorLabel,
  strength = 0.28,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState({
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    gx: 50,
    gy: 50,
    hovered: false,
  });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setState({
      x: Math.max(-12, Math.min(12, dx)),
      y: Math.max(-9, Math.min(9, dy)),
      rx: (0.5 - ny) * 14,
      ry: (nx - 0.5) * 18,
      gx: Math.round(nx * 100),
      gy: Math.round(ny * 100),
      hovered: true,
    });
  };

  const handleMouseLeave = () => {
    setState({ x: 0, y: 0, rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });
  };

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      data-cursor={cursorLabel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(700px) translate3d(${state.x}px, ${state.y}px, 0) rotateX(${state.rx}deg) rotateY(${state.ry}deg)`,
        boxShadow: state.hovered
          ? '0 10px 30px rgba(34,211,238,0.22), 0 0 22px rgba(200,164,107,0.34)'
          : undefined,
      }}
      className={`relative overflow-hidden transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B] ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: state.hovered ? 1 : 0,
          background: `radial-gradient(120px circle at ${state.gx}% ${state.gy}%, rgba(34,211,238,0.34), rgba(200,164,107,0.22) 55%, transparent 80%)`,
        }}
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2.5">
        {children}
      </span>
    </button>
  );
}
