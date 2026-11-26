import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { EXPERTISE_CAPABILITIES, PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { KineticWatermark } from './KineticWatermark';

gsap.registerPlugin(ScrollTrigger);

interface ExpertiseSectionProps {
  onSelectProject: (projectId: string) => void;
}

export function ExpertiseSection({ onSelectProject }: ExpertiseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerParallaxRef = useRef<HTMLDivElement>(null);
  const headerRevealRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string>(EXPERTISE_CAPABILITIES[0].id);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.expertise-row-reveal', {
        y: 90,
        opacity: 0,
        scale: 0.85,
        rotateX: 18,
        duration: 0.9,
        stagger: 0.1,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 84%',
          once: true,
        },
      });

      if (headerRevealRef.current) {
        gsap.from(headerRevealRef.current, {
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

      if (window.matchMedia('(min-width: 1024px)').matches && headerParallaxRef.current) {
        gsap.fromTo(
          headerParallaxRef.current,
          { yPercent: -20 },
          {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="relative py-20 md:py-28 px-5 sm:px-8 lg:px-12 bg-[#06080D]/34 border-b border-white/[0.08] overflow-hidden perspective-stage"
    >
      <KineticWatermark text="CAPABILITIES · BRAND ARCHITECTURE" direction={1} className="top-10" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Header with Kinetic Parallax */}
          <div
            ref={headerParallaxRef}
            className="lg:col-span-4 will-change-transform"
          >
            <div ref={headerRevealRef}>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C8A46B]">
                Capabilities
              </p>
              <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#F4F1EA] [text-wrap:balance]">
                Creative Expertise
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#9A958C]">
                From structural retail packaging and multi-flavor product architecture to dramatic studio advertising renders, every engagement balances aesthetic clarity with commercial shelf presence.
              </p>
            </div>
          </div>

          {/* Right Interactive Capability Accordion */}
          <div className="lg:col-span-8 border-t border-white/10">
            {EXPERTISE_CAPABILITIES.map((cap) => {
              const isOpen = expandedId === cap.id;
              const linkedProjects = PORTFOLIO_PROJECTS.filter((p) =>
                cap.linkedProjectIds.includes(p.id)
              );

              return (
                <div
                  key={cap.id}
                  className="expertise-row-reveal border-b border-white/10"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpandedId(isOpen ? '' : cap.id)}
                    className="w-full py-6 sm:py-7 flex items-center justify-between gap-6 text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A46B]"
                  >
                    <div className="flex items-baseline gap-5 sm:gap-8">
                      <span className="font-mono tabular-nums text-xs text-[#C8A46B]">
                        {cap.index}.
                      </span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F4F1EA] group-hover:text-[#C8A46B] transition-colors">
                          {cap.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#9A958C]">{cap.headline}</p>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-[#9A958C] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C8A46B]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-8 pl-6 sm:pl-14 pr-2 sm:pr-4 space-y-6">
                      <p className="text-sm sm:text-base leading-relaxed text-[#B8B2A7] max-w-2xl">
                        {cap.description}
                      </p>

                      <div>
                        <p className="text-xs tracking-[0.16em] uppercase text-[#9A958C] mb-2">
                          Core Deliverables
                        </p>
                        <p className="text-sm text-[#F4F1EA]">
                          {cap.techniques.join(' · ')}
                        </p>
                      </div>

                      {linkedProjects.length > 0 && (
                        <div>
                          <p className="text-xs tracking-[0.16em] uppercase text-[#9A958C] mb-3">
                            Related Commissions
                          </p>
                          <div className="flex flex-wrap gap-2.5 sm:gap-3">
                            {linkedProjects.map((proj) => (
                              <button
                                key={proj.id}
                                type="button"
                                onClick={() => onSelectProject(proj.id)}
                                data-cursor="Open"
                                className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[40px] text-xs font-medium text-left bg-[#0E0E12] border border-white/10 text-[#F4F1EA] hover:border-[#C8A46B] hover:text-[#C8A46B] transition-colors cursor-pointer"
                              >
                                <span>{proj.title}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
