import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, Snowflake, X } from 'lucide-react';
import { ICED_FROSTED_PLATES, type IcedFrostedPlate } from '../data/portfolioData';
import { ArtworkImage } from './ArtworkImage';
import { KineticWatermark } from './KineticWatermark';

interface IcedFlavorsSectionProps {
  onSelectProject: (projectId: string) => void;
  onFreezeActiveChange: (isActive: boolean) => void;
}

export function IcedFlavorsSection({
  onSelectProject,
  onFreezeActiveChange,
}: IcedFlavorsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Trigger full-screen freeze & snowfall takeover immediately when #iced-flavors enters viewport,
  // and smoothly thaw when user scrolls away.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const evaluateFreezeState = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const inBand = rect.top < vh * 0.72 && rect.bottom > vh * 0.28;
      onFreezeActiveChange(inBand);
    };

    evaluateFreezeState();

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            () => {
              evaluateFreezeState();
            },
            { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
          )
        : null;

    observer?.observe(el);
    window.addEventListener('scroll', evaluateFreezeState, { passive: true });
    window.addEventListener('resize', evaluateFreezeState, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', evaluateFreezeState);
      window.removeEventListener('resize', evaluateFreezeState);
      onFreezeActiveChange(false);
    };
  }, [onFreezeActiveChange]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((i) =>
          i === null ? 0 : (i + 1) % ICED_FROSTED_PLATES.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) =>
          i === null
            ? 0
            : (i - 1 + ICED_FROSTED_PLATES.length) % ICED_FROSTED_PLATES.length
        );
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxIndex]);

  const activePlate: IcedFrostedPlate | null =
    lightboxIndex !== null ? ICED_FROSTED_PLATES[lightboxIndex] ?? null : null;

  return (
    <section
      id="iced-flavors"
      ref={sectionRef}
      data-testid="iced-flavors-section"
      className="relative py-20 md:py-28 px-5 sm:px-8 lg:px-12 bg-[#04070C] border-b border-[#7DD3FC]/20 overflow-hidden"
    >
      {/* Glacial Top Hairline Seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#7DD3FC]/75 to-transparent shadow-[0_0_24px_rgba(125,211,252,0.5)]"
      />

      {/* Ambient Sub-Zero Horizon Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(64% 52% at 22% 18%, rgba(56, 189, 248, 0.14) 0%, transparent 72%), radial-gradient(60% 54% at 84% 76%, rgba(186, 230, 253, 0.1) 0%, transparent 74%)',
        }}
      />

      <KineticWatermark text="ICED & FROSTED FLAVORS · SUB-ZERO EDITIONS" direction={1} className="top-10" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* Editorial Glacial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8 md:pb-10">
          <div>
            <div className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[#7DD3FC]">
              <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sub-Zero Collection</span>
              <span aria-hidden="true" className="text-white/25">·</span>
              <span className="font-mono tabular-nums text-[#E0F2FE]">
                {String(ICED_FROSTED_PLATES.length).padStart(2, '0')} Editions
              </span>
            </div>
            <h2 className="mt-2.5 font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#F4F1EA]">
              Iced &amp; Frosted Flavors
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:justify-end">
            <p className="text-sm text-[#A9BACB] max-w-md">
              Menthol and frosted-fruit packaging art direction—sculpted in alpine snowdrifts, crushed crystal ice, and glacial mist lighting.
            </p>
            <button
              type="button"
              onClick={() => onSelectProject('ya-layl-frosted')}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-3 text-xs font-medium tracking-[0.12em] uppercase border border-[#7DD3FC]/35 bg-[#07101A]/80 text-[#E0F2FE] hover:bg-[#7DD3FC] hover:text-[#04070C] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DD3FC]"
            >
              <span>Inspect Series</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scalable Frosted Plates Editorial Grid */}
        <div
          data-testid="iced-flavors-grid"
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-7 gap-y-10"
        >
          {ICED_FROSTED_PLATES.map((plate, index) => {
            const isWide = plate.aspect === 'landscape';
            const portraitCount = ICED_FROSTED_PLATES.filter(
              (p) => p.aspect !== 'landscape'
            ).length;
            const portraitIndex = ICED_FROSTED_PLATES.slice(0, index).filter(
              (p) => p.aspect !== 'landscape'
            ).length;
            const isTrailingDuo =
              !isWide &&
              portraitCount % 3 === 2 &&
              portraitIndex >= portraitCount - 2;

            const colSpanClass = isWide
              ? 'md:col-span-2 lg:col-span-6'
              : isTrailingDuo
                ? 'col-span-1 lg:col-span-3'
                : 'col-span-1 lg:col-span-2';

            return (
              <article
                key={plate.id}
                data-testid="iced-flavor-card"
                className={colSpanClass}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Inspect ${plate.flavorName} — ${plate.seriesLabel}`}
                  data-cursor="Frost View"
                  className="group w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7DD3FC]"
                >
                  <div
                    className={`relative w-full overflow-hidden border border-white/12 bg-[#060B12] transition-all duration-300 group-hover:border-[#7DD3FC]/75 group-hover:shadow-[0_24px_65px_rgba(56,189,248,0.18)] ${
                      isWide
                        ? 'aspect-[16/9] lg:h-[460px] lg:aspect-auto'
                        : 'aspect-[4/4.3] lg:h-[420px] lg:aspect-auto'
                    }`}
                  >
                    <ArtworkImage
                      src={plate.src}
                      alt={plate.alt}
                      priority
                      fit={isWide ? 'contain' : 'cover'}
                      className={`w-full h-full object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                        isWide ? 'object-contain bg-[#040810]' : 'object-cover'
                      }`}
                    />

                    {/* Measured Glacial Scrim + Subtle Frost Edge Specular */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03070D]/80 via-transparent to-transparent opacity-75 group-hover:opacity-55 transition-opacity duration-300"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        boxShadow: `inset 0 0 38px ${plate.frostAccentHex}38`,
                      }}
                    />

                    {/* Top-right expand affordance */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-white/15 bg-[#04070C]/80 text-[#E0F2FE] group-hover:bg-[#7DD3FC] group-hover:border-[#7DD3FC] group-hover:text-[#04070C] transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </span>

                    {/* Bottom-left frosted edition marker */}
                    <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <span className="font-mono tabular-nums text-[11px] tracking-[0.14em] uppercase text-[#BAE6FD]">
                        ICE {String(index + 1).padStart(2, '0')} · {plate.seriesLabel}
                      </span>
                    </div>
                  </div>

                  {/* Clean Unboxed Glacial Metadata */}
                  <div className="mt-4 pb-4 border-b border-white/[0.08] group-hover:border-[#7DD3FC]/40 transition-colors">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A8BD]">
                      <span>{plate.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span>Frosted Edition</span>
                      {plate.arabicTitle && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span dir="rtl" className="text-[#BAE6FD]/90">
                            {plate.arabicTitle}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight text-[#F4F1EA] group-hover:text-[#7DD3FC] transition-colors">
                      {plate.flavorName}
                    </h3>
                    <p className="mt-1 text-sm text-[#94A8BD] truncate">{plate.caption}</p>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Unobstructed Glacial Lightbox Modal (Portaled to document.body above fixed header) */}
      {activePlate &&
        lightboxIndex !== null &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activePlate.flavorName} — Iced Artwork Viewer`}
            data-testid="iced-lightbox-modal"
            className="fixed inset-0 z-[80] bg-[#03060B]/96 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs text-[#BAE6FD] truncate">
                <span className="font-semibold text-[#F4F1EA]">{activePlate.flavorName}</span>
                <span className="mx-2 text-white/30" aria-hidden="true">·</span>
                <span>{activePlate.caption}</span>
                <span className="mx-2 text-white/30" aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#7DD3FC]">
                  {lightboxIndex + 1} / {ICED_FROSTED_PLATES.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close iced artwork lightbox"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs uppercase tracking-[0.12em] border border-white/20 bg-[#060C14] text-[#F4F1EA] hover:border-[#7DD3FC] cursor-pointer shrink-0"
              >
                <span>Exit</span>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <ArtworkImage
                src={activePlate.src}
                alt={activePlate.alt}
                fit="contain"
                priority
                className="max-h-[80vh] max-w-full w-auto"
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous iced flavor plate"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + ICED_FROSTED_PLATES.length) %
                      ICED_FROSTED_PLATES.length
                  )
                }
                className="px-5 py-2.5 min-h-[44px] text-xs uppercase tracking-wider border border-white/15 bg-[#060C14] text-[#F4F1EA] hover:border-[#7DD3FC] cursor-pointer inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                aria-label="Next iced flavor plate"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % ICED_FROSTED_PLATES.length)
                }
                className="px-5 py-2.5 min-h-[44px] text-xs uppercase tracking-wider border border-white/15 bg-[#060C14] text-[#F4F1EA] hover:border-[#7DD3FC] cursor-pointer inline-flex items-center gap-2"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
