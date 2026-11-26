import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { ArtworkImage } from './ArtworkImage';
import { KineticWatermark } from './KineticWatermark';

gsap.registerPlugin(ScrollTrigger);

interface PinnedShowcaseProps {
  onSelectProject: (projectId: string) => void;
}

const FEATURED_IDS = [
  'cwench',
  'lyon-double-twist',
  'kuiq-vape',
  'fitfuel-flavors',
  'kuiq-charcoal-v2',
  'ya-layl-flavors',
];

const SHOWCASE_MEDIA_OVERRIDES: Record<string, { src: string; alt: string }> = {
  // Card 01 ('cwench') remains completely untouched with its default coverImage
  'lyon-double-twist': {
    src: '/assets/aistudio/Hyper-Realistic_LYON_Cigarette_Pack_Still_Life-3_71765c28.png',
    alt: 'LYON Double Twist pack staged beside crystal ashtray with smoke, lighter, and leather notebook',
  },
  'kuiq-vape': {
    src: '/portfolio/kuiq-vape-selected-works-2.png',
    alt: 'KUIQ Bar Mango Mania and Banana Milkshake split campaign visual',
  },
  'fitfuel-flavors': {
    src: '/portfolio/choco-cherry-1.png',
    alt: 'FitFuel Strawberry Souffle functional bar with strawberries and red spotlight splash',
  },
  'kuiq-charcoal-v2': {
    src: '/portfolio/96-pcs-box-1.png',
    alt: 'Kuiq V2 96 PCS box on cooled volcanic lava rock with glowing magma fissures',
  },
  'ya-layl-flavors': {
    src: '/portfolio/ya-layl-hookah-flavor-selected-works-10.jpg',
    alt: 'Ya Layl Molasses Wild Dragon carton box mockup in emerald studio light',
  },
};

export function PinnedShowcase({ onSelectProject }: PinnedShowcaseProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const featuredProjects = FEATURED_IDS.map((id) =>
    PORTFOLIO_PROJECTS.find((p) => p.id === id)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (reduced || !containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 90,
          opacity: 0,
          scale: 0.85,
          rotateX: 18,
          duration: 0.85,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 86%',
            once: true,
          },
        });
      }

      if (!isDesktop) return;

      const track = trackRef.current!;
      const scrollDistance = track.scrollWidth - window.innerWidth + 120;
      if (scrollDistance <= 0) return;

      const horizontalTween = gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.5,
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              featuredProjects.length - 1,
              Math.floor(self.progress * featuredProjects.length)
            );
            setActiveSlide(idx);
          },
        },
      });

      // Bold multi-layer horizontal depth parallax inside each campaign image while scrolling
      gsap.utils.toArray<HTMLElement>('.pinned-card-media').forEach((mediaEl) => {
        gsap.fromTo(
          mediaEl,
          { xPercent: -18, scale: 1.24, rotateY: 6 },
          {
            xPercent: 18,
            scale: 1.08,
            rotateY: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: mediaEl,
              containerAnimation: horizontalTween,
              start: 'left right',
              end: 'right left',
              scrub: 0.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [featuredProjects.length]);

  const handleTrackScroll = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) return;
    const track = trackRef.current;
    if (!track || featuredProjects.length === 0) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return;
    const progress = Math.min(1, Math.max(0, track.scrollLeft / maxScroll));
    const idx = Math.min(
      featuredProjects.length - 1,
      Math.round(progress * (featuredProjects.length - 1))
    );
    setActiveSlide(idx);
  };

  return (
    <section
      id="pinned-showcase"
      ref={containerRef}
      className="relative bg-[#06080D]/34 border-b border-white/[0.08] overflow-hidden perspective-stage"
    >
      <div
        aria-hidden="true"
        className="animate-rim-glow pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8A46B]/75 to-transparent shadow-[0_0_22px_rgba(200,164,107,0.4)]"
      />
      <KineticWatermark text="SELECTED WORKS" direction={-1} className="top-8" />
      <div
        ref={headerRef}
        className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 pt-16 pb-8 lg:pt-20 lg:pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 will-change-transform"
      >
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#F4F1EA]">
            Selected Works
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#9A958C]">
          <span className="font-mono tabular-nums text-[#F4F1EA]">
            0{activeSlide + 1} / 0{featuredProjects.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>Select any plate to inspect full series</span>
        </div>
      </div>

      {/* Horizontal Track (pinned scroll on desktop, horizontal snap rail on tablet/mobile) */}
      <div
        ref={trackRef}
        onScroll={handleTrackScroll}
        className="flex gap-5 sm:gap-6 lg:gap-10 px-5 sm:px-8 lg:px-12 pb-14 lg:pb-20 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden will-change-transform"
      >
        {featuredProjects.map((project, idx) => {
          const override = SHOWCASE_MEDIA_OVERRIDES[project.id];
          const mediaSrc = override?.src ?? project.coverImage;
          const mediaAlt = override?.alt ?? project.coverAlt;
          return (
            <article
              key={project.id}
              className="shrink-0 w-[84vw] sm:w-[62vw] lg:w-[44vw] max-w-[660px] snap-center sm:snap-start group"
            >
              <button
                type="button"
                onClick={() => onSelectProject(project.id)}
                data-cursor="Inspect"
                className="w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A46B]"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden border border-white/15 bg-[#0D0D11] shadow-[0_22px_50px_rgba(0,0,0,0.65),0_0_24px_rgba(34,211,238,0.08)] group-hover:border-[#22D3EE]/75 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_34px_rgba(34,211,238,0.28)] transition-[border-color,box-shadow] duration-300">
                  <div className="pinned-card-media w-full h-full will-change-transform">
                    <ArtworkImage
                      src={mediaSrc}
                      alt={mediaAlt}
                      priority
                      className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-45 transition-opacity duration-300" />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="pointer-events-none absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-[#050506]/80 border border-white/15 text-[#F4F1EA] group-hover:bg-[#C8A46B] group-hover:text-[#050506] transition-colors">
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>

              <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#9A958C]">
                    <span className="font-mono tabular-nums text-[#C8A46B]">0{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.primaryDiscipline}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{project.images.length} Artworks</span>
                  </div>
                  <h3 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight text-[#F4F1EA] group-hover:text-[#C8A46B] transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>
            </button>
          </article>
          );
        })}
      </div>
    </section>
  );
}
