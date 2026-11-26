import { useState, useEffect } from 'react';
import { Menu, Volume2, VolumeX, X } from 'lucide-react';
import { DESIGNER_PROFILE } from '../data/portfolioData';
import { computeNavbarBrandToggle } from '../utils/logoDock';
import { MagneticButton } from './MagneticButton';

interface NavbarProps {
  scrollProgress: number;
  logoDockProgress: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Works', id: 'selected-works' },
  { label: 'Iced', id: 'iced-flavors' },
  { label: 'Exhibition', id: 'exhibition' },
  { label: 'About', id: 'about' },
  { label: 'Expertise', id: 'expertise' },
];

export function Navbar({
  scrollProgress,
  logoDockProgress,
  isMuted,
  onToggleSound,
  onNavigate,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const brandState = computeNavbarBrandToggle(logoDockProgress);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-[#050506]/88 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Fixed Top-Left Brand Slot Crossfading In-Place Between Compact IHAB Mark (#intro) and "Ihab Nasr" Text (Portfolio Sections) */}
          <a
            href="#intro"
            aria-label="Ihab Nasr — Scroll to top"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('intro');
            }}
            data-cursor="Top"
            className="relative inline-flex items-center h-10 md:h-11 min-w-[92px] md:min-w-[106px] text-base md:text-lg font-semibold tracking-tight text-[#F4F1EA] whitespace-nowrap shrink-0 hover:text-[#C8A46B] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A46B]"
          >
            <span
              data-testid="navbar-brand-text"
              className="inline-block origin-left transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]"
              style={{
                opacity: brandState.textOpacity,
                transform: `scale(${brandState.textScale})`,
                visibility: brandState.textOpacity > 0.01 ? 'visible' : 'hidden',
                transitionDelay: brandState.textOpacity > 0.01 ? '100ms' : '0ms',
              }}
            >
              Ihab Nasr
            </span>

            <span
              data-testid="navbar-dock-slot"
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 flex items-center w-[80px] md:w-[96px] aspect-[1716/838] overflow-hidden origin-left transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]"
              style={{
                opacity: brandState.emblemOpacity,
                transform: `scale(${brandState.emblemScale})`,
                visibility: brandState.emblemOpacity > 0.01 ? 'visible' : 'hidden',
                transitionDelay: brandState.emblemOpacity > 0.01 ? '100ms' : '0ms',
              }}
            >
              <img
                src={DESIGNER_PROFILE.emblemHeroSrc}
                alt={brandState.isEmblemActive ? 'Ihab Nasr Emblem' : ''}
                referrerPolicy="no-referrer"
                data-testid="navbar-docked-logo"
                style={{ clipPath: 'inset(0 0 8.7% 0)' }}
                className="w-full h-auto max-w-none block select-none"
              />
            </span>
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#B8B2A7]"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#F4F1EA] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-[#C8A46B] after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A46B]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Sound Control + Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              data-testid="navbar-sound-toggle"
              aria-pressed={!isMuted}
              onClick={onToggleSound}
              aria-label={isMuted ? 'Unmute ambient & CRT audio' : 'Mute ambient & CRT audio'}
              title={isMuted ? 'Sound Off — Click to unmute' : 'Sound On — Click to mute'}
              className={`inline-flex items-center justify-center w-10 h-10 md:w-10 md:h-10 border transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B] ${
                isMuted
                  ? 'border-white/15 bg-[#0C0C0F]/80 text-[#78746C] hover:text-[#F4F1EA] hover:border-white/30'
                  : 'border-[#C8A46B]/45 bg-[#0C0E13]/85 text-[#E8C278] hover:border-[#22D3EE] hover:text-[#67E8F9]'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <MagneticButton
              onClick={() => handleLinkClick('contact')}
              cursorLabel="Contact"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase bg-[#F4F1EA] text-[#050506] hover:bg-[#C8A46B] transition-colors whitespace-nowrap shrink-0"
            >
              Inquire
            </MagneticButton>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#F4F1EA] border border-white/15 bg-[#0C0C0F]/90 hover:border-[#C8A46B] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Vivid thicker luminous cyan-to-gold scroll progress bar */}
        <div
          className="w-full h-[4px] bg-white/[0.06] overflow-hidden"
          aria-hidden="true"
        >
          <div
            data-testid="navbar-scroll-progress"
            className="relative h-full w-full origin-left bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] via-55% to-[#E8C278] shadow-[0_0_18px_rgba(34,211,238,0.85),0_0_28px_rgba(200,164,107,0.7)] will-change-transform transition-transform duration-75 ease-out"
            style={{
              transform: `scaleX(${Math.min(1, Math.max(0, scrollProgress))})`,
            }}
          >
            <span className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/90" />
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 bg-[#050506]/98 backdrop-blur-lg flex flex-col justify-between px-5 pt-24 pb-8 overflow-y-auto md:hidden"
        >
          <nav className="flex flex-col gap-6">
            {NAV_ITEMS.map((item, idx) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className="flex items-baseline justify-between border-b border-white/10 pb-4 text-3xl font-serif text-[#F4F1EA] hover:text-[#C8A46B] transition-colors"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-[#9A958C]">0{idx + 1}</span>
              </a>
            ))}
          </nav>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="w-full py-3.5 px-6 text-xs font-semibold tracking-[0.14em] uppercase bg-[#C8A46B] text-[#050506] cursor-pointer"
            >
              Inquire for a Project
            </button>
            <p className="text-xs text-[#9A958C] text-center">
              Brand Identity · Packaging · Advertising · Visual Design
            </p>
          </div>
        </div>
      )}
    </>
  );
}
