export type SensoryMood = 'iced' | 'botanical' | 'water' | 'smoke' | 'neutral';

export interface MoodClassificationInput {
  projectId?: string;
  caption?: string;
  subSeries?: string;
}

export interface ActiveMoodResolutionInput {
  isMuted: boolean;
  modalMood?: SensoryMood | null;
  icedInView: boolean;
  exhibitionInView: boolean;
  exhibitionMood: SensoryMood;
  heroInView: boolean;
  heroMood: SensoryMood;
}

export const SENSORY_FADE_TIMING = {
  fadeInSec: 0.95,
  fadeOutSec: 0.85,
  muteFadeOutSec: 0.45,
} as const;

export function classifyPlateSensoryMood(
  input: MoodClassificationInput
): SensoryMood {
  const projectId = input.projectId ?? '';
  const combinedText = `${input.caption ?? ''} ${input.subSeries ?? ''}`;

  if (
    projectId === 'ya-layl-frosted' ||
    projectId === 'ya-layl-christmas' ||
    /\b(frost|frosty|ice|iced|winter|blizzard|glacier|snow|alpine|freeze)\b/i.test(
      combinedText
    )
  ) {
    return 'iced';
  }

  if (
    projectId === 'cwench' ||
    /\b(water|splash|ripple|rain|condensation|hydration|ocean|cascade)\b/i.test(
      combinedText
    )
  ) {
    return 'water';
  }

  if (
    /\b(moss|botanical|forest|hawaii|coastal palm|coconut|rustic wood|leaf|leaves)\b/i.test(
      combinedText
    )
  ) {
    return 'botanical';
  }

  if (
    projectId === 'kuiq-vape' ||
    projectId === 'kuiq-charcoal-v1' ||
    projectId === 'kuiq-charcoal-v2' ||
    projectId === 'lyon-double-twist' ||
    /\b(smoke|vapor|ashtray|ember|torch|charcoal|volcanic|magma|lounge|love xo|englyzi|havana|lady slayer|red kiss|wild dragon|miami pink)\b/i.test(
      combinedText
    )
  ) {
    return 'smoke';
  }

  return 'neutral';
}

export function resolveActiveSensoryMood({
  isMuted,
  modalMood,
  icedInView,
  exhibitionInView,
  exhibitionMood,
  heroInView,
  heroMood,
}: ActiveMoodResolutionInput): SensoryMood {
  if (isMuted) {
    return 'neutral';
  }

  if (modalMood) {
    return modalMood;
  }

  if (icedInView) {
    return 'iced';
  }

  if (exhibitionInView) {
    return exhibitionMood;
  }

  if (heroInView) {
    return heroMood;
  }

  return 'neutral';
}
