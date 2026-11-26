import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  type PortfolioCategory,
  type PortfolioProject,
} from '../data/portfolioData';
import { filterProjectsByCategory, getCategoryCounts } from '../utils/portfolioFilters';
import { ArtworkImage } from './ArtworkImage';
import { KineticWatermark } from './KineticWatermark';

gsap.registerPlugin(ScrollTrigger);

interface SelectedWorksProps {
  onSelectProject: (projectId: string) => void;
}

function ProjectCard({
  project,
  onSelect,
}: {
  project: PortfolioProject;
  onSelect: (id: string) => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - y) * 11,
      ry: (x - 0.5) * 13,
      gx: Math.round(x * 100),
      gy: Math.round(y * 100),
      hovered: true,
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });

  const spanClass =
    project.layoutHint === 'wide' ? 'md:col-span-2' : 'md:col-span-1';

  const aspectClass =
    project.layoutHint === 'wide'
      ? 'aspect-[16/10] lg:aspect-auto lg:h-[400px]'
      : 'aspect-[4/3.5] lg:aspect-auto lg:h-[400px]';

  return (
    <article className={`${spanClass} work-card perspective-stage`}>
      <button
        ref={cardRef}
        type="button"
        onClick={() => onSelect(project.id)}
        onPointerMove={handleMove}
        onPointerLeave={resetTilt}
        data-cursor="Case Study"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
        className="group w-full text-left transition-transform duration-200 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A46B]"
      >
        <div
          className={`work-card-media relative w-full ${aspectClass} overflow-hidden border border-white/10 bg-[#0B0B0F] transition-all duration-300 group-hover:border-[#C8A46B]/80 group-hover:shadow-[0_24px_65px_rgba(34,211,238,0.18),0_0_28px_rgba(200,164,107,0.22)]`}
        >
          {/* Inner Scroll-Scrubbed Parallax Image Layer */}
          <div className="work-card-parallax absolute -inset-12 will-change-transform">
            {project.coverBackdropSrc && (
              <>
                <img
                  src={project.coverBackdropSrc}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover object-bottom opacity-60 [filter:hue-rotate(175deg)_saturate(1.2)_brightness(0.75)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_65%_at_50%_46%,rgba(37,99,235,0.28)_0%,rgba(34,211,238,0.12)_48%,rgba(5,5,6,0.72)_100%)]"
                />
              </>
            )}
            <ArtworkImage
              src={project.coverImage}
              alt={project.coverAlt}
              fit={project.coverFit ?? 'cover'}
              className={`relative z-10 w-full h-full transition-transform duration-700 ease-out ${
                project.coverFit === 'contain'
                  ? 'p-6 sm:p-8 group-hover:scale-[1.04]'
                  : 'group-hover:scale-[1.05]'
              }`}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80 group-hover:opacity-55 transition-opacity duration-300" />

          {/* Interactive Luminous Spotlight Glow Following Pointer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 mix-blend-screen transition-opacity duration-200"
            style={{
              opacity: tilt.hovered ? 1 : 0,
              background: `radial-gradient(360px circle at ${tilt.gx}% ${tilt.gy}%, rgba(200,164,107,0.28), rgba(34,211,238,0.16) 44%, transparent 74%)`,
            }}
          />

          {/* Viewport Entrance Light Flash Sweep */}
          <div
            aria-hidden="true"
            className="work-card-flash pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen bg-[linear-gradient(112deg,transparent_20%,rgba(34,211,238,0.34)_48%,rgba(232,194,120,0.42)_54%,transparent_78%)]"
          />

          {/* Top-right clean arrow affordance */}
          <div className="pointer-events-none absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center border border-white/15 bg-[#050506]/80 text-[#F4F1EA] group-hover:bg-[#C8A46B] group-hover:border-[#C8A46B] group-hover:text-[#050506] transition-colors duration-200">
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </div>

          {/* Bottom-left subtle count indicator */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-4">
            <span className="font-mono tabular-nums text-[11px] tracking-[0.14em] uppercase text-[#C8A46B]">
              {project.index} · {project.images.length}{' '}
              {project.images.length === 1 ? 'Artwork' : 'Artworks'}
            </span>
          </div>
        </div>

        {/* Clean Unboxed Metadata & Title */}
        <div className="mt-4 pb-4 border-b border-white/[0.08] group-hover:border-[#C8A46B]/40 transition-colors duration-300">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#9A958C]">
            <span>{project.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{project.categories.join(' / ')}</span>
          </div>
          <h3 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight text-[#F4F1EA] group-hover:text-[#C8A46B] transition-colors">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-[#9A958C] line-clamp-2">{project.subtitle}</p>
        </div>
      </button>
    </article>
  );
}

export function SelectedWorks({ onSelectProject }: SelectedWorksProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All Works');

  const categoryCounts = useMemo(
    () => getCategoryCounts(PORTFOLIO_PROJECTS, PORTFOLIO_CATEGORIES),
    []
  );

  const visibleProjects = useMemo(
    () => filterProjectsByCategory(PORTFOLIO_PROJECTS, activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;

        if (headerRef.current) {
          gsap.from(headerRef.current, {
            y: 90,
            opacity: 0,
            scale: 0.85,
            rotateX: 18,
            duration: 0.9,
            ease: 'expo.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 86%',
              once: true,
            },
          });
        }

        gsap.from('.work-card', {
          y: 90,
          opacity: 0,
          scale: 0.85,
          rotateX: 18,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 84%',
            once: true,
          },
        });

        gsap.from('.work-card-media', {
          clipPath: 'inset(22% 0 0 0)',
          borderColor: 'rgba(34,211,238,0.75)',
          duration: 0.95,
          stagger: 0.08,
          ease: 'expo.out',
          clearProps: 'clipPath,borderColor',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        });

        gsap.fromTo(
          '.work-card-flash',
          { xPercent: -90, opacity: 0 },
          {
            xPercent: 110,
            opacity: 0.85,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set('.work-card-flash', { opacity: 0 });
            },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      } else {
        gsap.fromTo(
          '.work-card',
          { y: 40, opacity: 0, scale: 0.92, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: 'expo.out',
            clearProps: 'transform,opacity',
          }
        );
      }

      // Dramatic per-card image depth parallax (4x-5x) while scrolling past the grid
      gsap.utils.toArray<HTMLElement>('.work-card-parallax').forEach((layer) => {
        gsap.fromTo(
          layer,
          { yPercent: -22, scale: 1.18 },
          {
            yPercent: 22,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: {
              trigger: layer,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section
      id="selected-works"
      ref={sectionRef}
      className="relative py-20 md:py-28 px-5 sm:px-8 lg:px-12 bg-[#06080D]/34 border-b border-white/[0.08] overflow-hidden perspective-stage"
    >
      <KineticWatermark text="SELECTED WORKS · ARCHIVE" direction={-1} className="top-10" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* Section Heading & Count */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 will-change-transform"
        >
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C8A46B]">
              Complete Archive
            </p>
            <h2 className="mt-2 font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#F4F1EA]">
              Selected Works
            </h2>
          </div>

          <p className="text-sm text-[#9A958C] max-w-md">
            Every project preserved directly from the original portfolio—spanning brand identities, multi-SKU packaging systems, and commercial product visuals.
          </p>
        </div>

        {/* Interactive Category Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="mt-10 flex flex-wrap items-center gap-2 border-y border-white/[0.08] py-4"
        >
          {PORTFOLIO_CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-2.5 text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B] ${
                  active
                    ? 'bg-[#F4F1EA] text-[#050506]'
                    : 'bg-[#0C0C0F] text-[#B8B2A7] border border-white/10 hover:border-[#C8A46B]/60 hover:text-[#F4F1EA]'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`ml-2 font-mono tabular-nums text-[11px] ${
                    active ? 'text-[#050506]/70' : 'text-[#9A958C]'
                  }`}
                >
                  {categoryCounts[category]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Result Summary */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#9A958C]">
          <span>
            Showing{' '}
            <strong className="font-mono tabular-nums text-[#F4F1EA]">
              {visibleProjects.length}
            </strong>{' '}
            {visibleProjects.length === 1 ? 'project' : 'projects'} in{' '}
            <span className="text-[#C8A46B]">{activeCategory}</span>
          </span>
          <span className="hidden sm:inline">Select a project to view all original plates</span>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div
          data-testid="selected-works-grid"
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-12"
        >
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
