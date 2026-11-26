export interface InscriptionTierStyle {
  stagger: number;
  glowDuration: number;
  settleDuration: number;
  blurPx: number;
  startY: number;
  initialColor: string;
  peakColor: string;
  settledColor: string;
  initialShadow: string;
  peakShadow: string;
  settledShadow: string;
}

export const INSCRIPTION_TRIGGER_THRESHOLD = 0.16;
export const INSCRIPTION_OBSERVER_THRESHOLDS: number[] = [0, INSCRIPTION_TRIGGER_THRESHOLD];

export const INSCRIPTION_TIER_CONFIG: Record<'display' | 'body', InscriptionTierStyle> = {
  display: {
    stagger: 0.018,
    glowDuration: 0.24,
    settleDuration: 0.38,
    blurPx: 1.5,
    startY: 4,
    initialColor: '#FFE08A',
    peakColor: '#FFF3C4',
    settledColor: '#F4F1EA',
    initialShadow:
      '0 0 18px rgba(255, 168, 38, 0.98), 0 0 32px rgba(255, 94, 0, 0.82)',
    peakShadow:
      '0 0 18px rgba(255, 178, 56, 0.95), 0 0 30px rgba(255, 102, 0, 0.78)',
    settledShadow: '0 0 0px rgba(255, 178, 56, 0)',
  },
  body: {
    stagger: 0.006,
    glowDuration: 0.2,
    settleDuration: 0.34,
    blurPx: 1.2,
    startY: 3,
    initialColor: '#FFC864',
    peakColor: '#FFE7A8',
    settledColor: '#E2E6EC',
    initialShadow:
      '0 0 14px rgba(255, 152, 24, 0.92), 0 0 24px rgba(255, 86, 0, 0.72)',
    peakShadow:
      '0 0 13px rgba(255, 164, 42, 0.88), 0 0 22px rgba(255, 92, 0, 0.65)',
    settledShadow: '0 0 0px rgba(255, 164, 42, 0)',
  },
};

export function computeInscriptionStepDelay(
  charCount: number,
  stagger: number,
  gapSec = 0.08
): number {
  if (charCount <= 0) return 0;
  return charCount * stagger + gapSec;
}
