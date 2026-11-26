import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Copy, Mail, Phone } from 'lucide-react';
import { DESIGNER_PROFILE } from '../data/portfolioData';
import { KineticWatermark } from './KineticWatermark';
import {
  renderInscriptionWords,
  useOneRingInscription,
  type InscriptionLineSpec,
} from './InscriptionText';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_HEADING = 'Every great brand starts with a bold idea.';
const CONTACT_SUBTEXT =
  'Let’s transform your vision into a distinctive visual experience through brand identities that reflect your brand’s personality and create a unique presence.';

const CONTACT_INSCRIPTION_LINES: readonly InscriptionLineSpec[] = [
  { selector: '.ring-heading-char', tier: 'display', gapAfterSec: 0.08 },
  { selector: '.ring-body-char', tier: 'body', gapAfterSec: 0.08 },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.14c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23z" />
      <path d="M16.56 14.01c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

export function ContactFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const inscriptionBlockRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useOneRingInscription({
    containerRef: inscriptionBlockRef,
    lines: CONTACT_INSCRIPTION_LINES,
    replayOnReentry: true,
  });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 36,
        opacity: 0,
        scale: 0.96,
        duration: 0.72,
        stagger: 0.1,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          once: true,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DESIGNER_PROFILE.contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative bg-[#06080D]/34 pt-20 md:pt-28 pb-12 px-5 sm:px-8 lg:px-12 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#22D3EE]/60 via-50% to-transparent animate-rim-glow"
      />
      <KineticWatermark text="COMMISSION · LET'S CREATE" direction={-1} className="top-10" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pb-16 md:pb-20 border-b border-white/10 perspective-stage">
          {/* Left: Closing Editorial Statement with One Ring Molten-Gold Reveal */}
          <div
            ref={inscriptionBlockRef}
            data-testid="contact-inscription-block"
            className="lg:col-span-7"
          >
            <h2
              aria-label={CONTACT_HEADING}
              className="font-serif text-[2.15rem] sm:text-5xl lg:text-[3.45rem] leading-[1.06] tracking-tight font-normal text-[#F4F1EA] [text-wrap:balance]"
            >
              {renderInscriptionWords(CONTACT_HEADING, 'ring-heading-char', 'h2')}
            </h2>
            <p
              aria-label={CONTACT_SUBTEXT}
              className="mt-5 text-[15px] sm:text-[17px] leading-relaxed text-[#E2E6EC] max-w-2xl"
            >
              {renderInscriptionWords(CONTACT_SUBTEXT, 'ring-body-char', 'p')}
            </p>
          </div>

          {/* Right: Spacious Direct Contact Details */}
          <div className="contact-reveal lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-12 flex flex-col justify-center">
            <p className="text-xs tracking-[0.2em] uppercase text-[#C8A46B] mb-5 font-medium">
              Contact
            </p>

            <div className="flex flex-col gap-4">
              {/* Direct Email + Copy Action */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${DESIGNER_PROFILE.contactEmail}`}
                  data-testid="contact-email-link"
                  className="inline-flex items-center gap-2.5 text-base sm:text-lg font-medium text-[#F4F1EA] hover:text-[#C8A46B] transition-colors break-all sm:break-normal"
                >
                  <Mail className="w-4 h-4 text-[#C8A46B] shrink-0" aria-hidden="true" />
                  <span>{DESIGNER_PROFILE.contactEmail}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy direct email to clipboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-[11px] border border-white/15 bg-[#0C0C0F] text-[#B8B2A7] hover:border-[#C8A46B] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-[#C8A46B]" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Phone Number + Phone Call & Official WhatsApp Brand Icon */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${DESIGNER_PROFILE.contactPhone}`}
                  data-testid="contact-phone-link"
                  className="inline-flex items-center gap-2.5 text-base sm:text-lg font-medium tabular-nums text-[#F4F1EA] hover:text-[#22D3EE] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#22D3EE] shrink-0" aria-hidden="true" />
                  <span>{DESIGNER_PROFILE.contactPhone}</span>
                </a>

                <div className="inline-flex items-center gap-2">
                  <a
                    href={`tel:${DESIGNER_PROFILE.contactPhone}`}
                    data-testid="contact-call-button"
                    aria-label={`Call ${DESIGNER_PROFILE.contactPhone}`}
                    title="Call directly"
                    className="w-10 h-10 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-full border border-white/15 bg-[#0C0E13] text-[#E6EEF4] hover:border-[#22D3EE] hover:text-[#22D3EE] hover:shadow-[0_0_14px_rgba(34,211,238,0.35)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]"
                  >
                    <Phone className="w-4 h-4 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                  </a>

                  <a
                    href={DESIGNER_PROFILE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="contact-whatsapp-button"
                    aria-label={`Chat with ${DESIGNER_PROFILE.contactPhone} on WhatsApp`}
                    title="Message on WhatsApp"
                    className="w-10 h-10 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-full border border-white/15 bg-[#0C0E13] text-[#E6EEF4] hover:border-[#25D366] hover:text-[#25D366] hover:shadow-[0_0_14px_rgba(37,211,102,0.35)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Copyright & Site Navigation Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9A958C]">
          <p>
            © {new Date().getFullYear()} {DESIGNER_PROFILE.name} · Graphic Designer
          </p>
          <p>Brand Identity · Packaging Design · Product Visualization · Advertising</p>
        </div>
      </div>
    </footer>
  );
}
