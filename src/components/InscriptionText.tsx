import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import {
  computeInscriptionStepDelay,
  INSCRIPTION_OBSERVER_THRESHOLDS,
  INSCRIPTION_TIER_CONFIG,
  INSCRIPTION_TRIGGER_THRESHOLD,
} from '../utils/inscriptionConfig';

export interface InscriptionLineSpec {
  selector: string;
  tier: 'display' | 'body';
  settledColorOverride?: string;
  gapAfterSec?: number;
}

export function renderInscriptionWords(
  text: string,
  charClassName: string,
  keyPrefix: string
) {
  const words = text.split(' ');
  return words.map((word, wordIdx) => (
    <span key={`${keyPrefix}-w-${wordIdx}`} className="inline-block whitespace-nowrap">
      {word.split('').map((ch, charIdx) => (
        <span
          key={`${keyPrefix}-c-${wordIdx}-${charIdx}`}
          className={`${charClassName} inline-block will-change-[transform,opacity,filter]`}
        >
          {ch}
        </span>
      ))}
      {wordIdx < words.length - 1 ? '\u00A0' : ''}
    </span>
  ));
}

export function useOneRingInscription({
  containerRef,
  lines,
  replayOnReentry = true,
}: {
  containerRef: RefObject<HTMLElement | null>;
  lines: readonly InscriptionLineSpec[];
  replayOnReentry?: boolean;
}) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getLineChars = (selector: string) =>
      Array.from(container.querySelectorAll<HTMLElement>(selector));

    const allChars = lines.flatMap((l) => getLineChars(l.selector));
    if (allChars.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(allChars, { opacity: 1, clearProps: 'color,textShadow,filter,transform' });
      return;
    }

    let activeTl: gsap.core.Timeline | null = null;
    let hasPlayedForEntry = false;

    const resetToHidden = () => {
      activeTl?.kill();
      activeTl = null;
      hasPlayedForEntry = false;
      gsap.set(allChars, { opacity: 0, clearProps: 'color,textShadow,filter,transform' });
    };

    const playInscription = () => {
      if (hasPlayedForEntry) return;
      hasPlayedForEntry = true;

      activeTl?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(allChars, {
            opacity: 1,
            clearProps: 'color,textShadow,filter,transform',
          });
        },
      });
      activeTl = tl;

      let cursor = 0;
      lines.forEach((line) => {
        const chars = getLineChars(line.selector);
        if (chars.length === 0) return;

        const cfg = INSCRIPTION_TIER_CONFIG[line.tier];
        const settledColor = line.settledColorOverride ?? cfg.settledColor;

        tl.fromTo(
          chars,
          {
            opacity: 0,
            y: cfg.startY,
            filter: `blur(${cfg.blurPx}px)`,
            color: cfg.initialColor,
            textShadow: cfg.initialShadow,
          },
          {
            keyframes: [
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                color: cfg.peakColor,
                textShadow: cfg.peakShadow,
                duration: cfg.glowDuration,
                ease: 'power2.out',
              },
              {
                color: settledColor,
                textShadow: cfg.settledShadow,
                duration: cfg.settleDuration,
                ease: 'power2.inOut',
              },
            ],
            stagger: cfg.stagger,
          },
          cursor
        );

        cursor += computeInscriptionStepDelay(
          chars.length,
          cfg.stagger,
          line.gapAfterSec ?? 0.08
        );
      });
    };

    // Hide cleanly before entry
    resetToHidden();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= INSCRIPTION_TRIGGER_THRESHOLD) {
          playInscription();
        } else if (replayOnReentry && !entry.isIntersecting && entry.intersectionRatio === 0) {
          resetToHidden();
        }
      },
      { threshold: INSCRIPTION_OBSERVER_THRESHOLDS }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      activeTl?.kill();
      activeTl = null;
    };
  }, [containerRef, lines, replayOnReentry]);
}
