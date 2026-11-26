import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESIGNER_PROFILE } from '../data/portfolioData';
import {
  renderInscriptionWords,
  useOneRingInscription,
  type InscriptionLineSpec,
} from './InscriptionText';
import { KineticWatermark } from './KineticWatermark';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_NAME = 'Ihab Nasr';
const ABOUT_DISCIPLINE = DESIGNER_PROFILE.disciplines.join(' — ');
const ABOUT_BIO =
  'I’m Ihab Nasr, a Graphic Designer focused on creating clean and impactful visual designs. Sculpting cohesive brand identities, shelf-commanding packaging systems, and atmospheric product visuals.';

const ABOUT_INSCRIPTION_LINES: readonly InscriptionLineSpec[] = [
  { selector: '.about-ring-name-char', tier: 'display', gapAfterSec: 0.05 },
  {
    selector: '.about-ring-discipline-char',
    tier: 'body',
    settledColorOverride: '#C8A46B',
    gapAfterSec: 0.05,
  },
  {
    selector: '.about-ring-bio-char',
    tier: 'body',
    settledColorOverride: '#E2E6EC',
    gapAfterSec: 0.05,
  },
];

export function AboutMonograph() {
  const sectionRef = useRef<HTMLElement>(null);
  const inscriptionBlockRef = useRef<HTMLDivElement>(null);

  useOneRingInscription({
    containerRef: inscriptionBlockRef,
    lines: ABOUT_INSCRIPTION_LINES,
    replayOnReentry: true,
  });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        y: 36,
        opacity: 0,
        duration: 0.72,
        stagger: 0.1,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 84%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative scroll-mt-16 md:scroll-mt-20 pt-24 pb-14 md:pt-28 md:pb-18 px-5 sm:px-8 lg:px-12 bg-[#06080D]/34 border-b border-white/[0.08] overflow-hidden perspective-stage"
    >
      <KineticWatermark text="GRAPHIC DESIGNER · PACKAGING" direction={1} className="top-10" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* Top Bio Block: Balanced Compact Hierarchy with One Ring Molten-Gold Reveal */}
        <div ref={inscriptionBlockRef} data-testid="about-inscription-block" className="max-w-4xl">
          <p className="about-reveal text-[11px] tracking-[0.2em] uppercase text-[#C8A46B]">
            About
          </p>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-baseline sm:gap-5">
            <h2
              aria-label={ABOUT_NAME}
              data-testid="about-display-name"
              className="font-serif text-[2.25rem] sm:text-[2.85rem] lg:text-[3.35rem] leading-[1.04] tracking-[0.02em] font-light text-[#F4F1EA] shrink-0"
            >
              {renderInscriptionWords(ABOUT_NAME, 'about-ring-name-char', 'about-name')}
            </h2>

            <p
              aria-label={ABOUT_DISCIPLINE}
              data-testid="about-discipline-line"
              className="mt-1.5 sm:mt-0 text-[11px] sm:text-xs tracking-[0.14em] uppercase text-[#C8A46B] font-medium"
            >
              {renderInscriptionWords(
                ABOUT_DISCIPLINE,
                'about-ring-discipline-char',
                'about-discipline'
              )}
            </p>
          </div>

          <p
            aria-label={ABOUT_BIO}
            data-testid="about-specialization-paragraph"
            className="mt-4 text-sm sm:text-[15.5px] leading-relaxed text-[#E2E6EC] max-w-3xl"
          >
            {renderInscriptionWords(ABOUT_BIO, 'about-ring-bio-char', 'about-bio')}
          </p>
        </div>

        {/* Integrated Compact Two-Column Editorial Grid: Work Experience & Education */}
        <div
          data-testid="about-credentials-grid"
          className="mt-9 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Work Experience */}
          <div className="about-reveal">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#C8A46B]">
              Work Experience
            </p>
            {DESIGNER_PROFILE.experience.map((exp) => (
              <div key={exp.company} className="mt-3 space-y-1.5">
                <h3 className="text-base sm:text-[17px] font-semibold text-[#F4F1EA]">
                  {exp.role}
                </h3>
                <p className="text-[11px] sm:text-xs tracking-[0.08em] uppercase text-[#C8A46B]/90">
                  {exp.company}
                </p>
                <p className="text-sm leading-relaxed text-[#9A958C] max-w-lg">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="about-reveal md:border-l md:border-white/10 md:pl-10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#C8A46B]">
              Education
            </p>
            {DESIGNER_PROFILE.education.map((edu) => (
              <div key={edu.institution} className="mt-3 space-y-1.5">
                <h3 className="text-base sm:text-[17px] font-semibold text-[#F4F1EA]">
                  {edu.degree}
                </h3>
                <p className="text-sm leading-relaxed text-[#B8B2A7] max-w-lg">
                  {edu.institution}
                </p>
                <p className="text-[11px] tracking-[0.1em] uppercase text-[#9A958C]">
                  Status · {edu.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
