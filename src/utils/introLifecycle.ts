export interface SwarmCursorWaypoints {
  id: string;
  label: string;
  color: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  badgeAlign?: 'right' | 'left';
  start: { x: number; y: number };
  waypoints: Array<{ x: number; y: number; at: number; snap?: boolean }>;
  converge: { x: number; y: number };
  scatter: { x: number; y: number };
}

/**
 * Thresholds governing unified replay when scrolling away from #intro and back to top.
 */
export const INTRO_LEFT_DOCK_THRESHOLD = 0.28;
export const INTRO_OFFSCREEN_HIDE_THRESHOLD = 0.95;
export const INTRO_RETURN_TOP_THRESHOLD = 0.02;

export function hasLeftIntroStage(logoDockProgress: number): boolean {
  return logoDockProgress >= INTRO_LEFT_DOCK_THRESHOLD;
}

export function shouldResetIntroForReturn(
  wasAwayFromTop: boolean,
  logoDockProgress: number
): boolean {
  return wasAwayFromTop && logoDockProgress <= INTRO_RETURN_TOP_THRESHOLD;
}

/**
 * Determines whether the settled #intro emblem, subtitle, and CTAs must be forced
 * into their strict hidden pre-reveal state (opacity: 0, visibility: hidden) so
 * zero pre-animation flash can occur while scrolled down or scrolling back up.
 */
export function shouldPrehideIntroStage(params: {
  wasAwayFromTop: boolean;
  logoDockProgress: number;
  prevProgress: number;
}): boolean {
  const { wasAwayFromTop, logoDockProgress, prevProgress } = params;
  if (logoDockProgress >= INTRO_OFFSCREEN_HIDE_THRESHOLD) {
    return true;
  }
  const isReturningUp = logoDockProgress < prevProgress - 0.002;
  if (wasAwayFromTop && isReturningUp && logoDockProgress > INTRO_RETURN_TOP_THRESHOLD) {
    return true;
  }
  return false;
}

/**
 * Shared geometric constants synchronizing the #intro Illustrator bounding box
 * (viewBox 760x402, frame 684x334) with the settled metallic IHAB emblem (1716x838).
 */
export const INTRO_STAGE_GEOMETRY = {
  viewBoxWidth: 760,
  viewBoxHeight: 402,
  frameX: 38,
  frameY: 34,
  frameWidth: 684,
  frameHeight: 334,
  emblemAspectWidth: 1716,
  emblemAspectHeight: 838,
  stageToEmblemRatio: 760 / 684, // 1.111111...
} as const;

export function computeIntroStageDimensions(
  viewportWidth: number,
  viewportHeight: number
): {
  emblemWidth: number;
  emblemHeight: number;
  stageWidth: number;
  stageHeight: number;
  swarmScale: number;
} {
  const safeW = Math.max(320, viewportWidth);
  const safeH = Math.max(480, viewportHeight);
  const emblemWidth = Math.min(safeW * 0.88, 760, safeH * 0.94);
  const emblemHeight =
    emblemWidth * (INTRO_STAGE_GEOMETRY.emblemAspectHeight / INTRO_STAGE_GEOMETRY.emblemAspectWidth);
  const stageWidth = emblemWidth * INTRO_STAGE_GEOMETRY.stageToEmblemRatio;
  const stageHeight =
    stageWidth * (INTRO_STAGE_GEOMETRY.viewBoxHeight / INTRO_STAGE_GEOMETRY.viewBoxWidth);
  const swarmScale = stageWidth / INTRO_STAGE_GEOMETRY.viewBoxWidth;

  return {
    emblemWidth,
    emblemHeight,
    stageWidth,
    stageHeight,
    swarmScale,
  };
}

/**
 * Computes viewport-safe horizontal sweep & curiosity-dart coordinates (relative
 * to center) for the Lone Illustrator Tool animation beneath the IHAB emblem.
 */
export function computeLoneToolSweepBounds(
  subtitleWidth: number,
  viewportWidth: number
): {
  leftX: number;
  rightX: number;
  searchLeftX: number;
  searchRightX: number;
} {
  const safeVw = Math.max(320, viewportWidth);
  const safeSubW = Math.max(140, Math.min(subtitleWidth, safeVw - 64));
  const halfText = safeSubW / 2;
  const leadMargin = Math.min(24, Math.max(14, safeVw * 0.04));
  const maxHalfReach = Math.max(88, safeVw / 2 - 28);

  const leftX = -Math.min(halfText + leadMargin, maxHalfReach);
  const rightX = Math.min(halfText + leadMargin + 8, maxHalfReach);
  const searchRightX = Math.min(Math.max(46, halfText * 0.62), maxHalfReach - 14);
  const searchLeftX = -Math.min(Math.max(56, halfText * 0.76), maxHalfReach - 10);

  return {
    leftX,
    rightX,
    searchLeftX,
    searchRightX,
  };
}

/**
 * 4 vibrant collaborative designer cursors (Cyan, Electric Blue, Violet, Warm Gold)
 * sculpting paths, Bezier handles, and bounding-box corners in the 760x402 stage.
 */
export const DESIGN_SWARM_CURSORS: readonly SwarmCursorWaypoints[] = [
  {
    id: 'cyan-path',
    label: 'Path · Curve',
    color: '#22D3EE',
    glowColor: 'rgba(34,211,238,0.85)',
    badgeBg: 'rgba(8,36,46,0.92)',
    badgeText: '#CFFAFE',
    start: { x: -316, y: 128 },
    waypoints: [
      { x: -284, y: 69, at: 0.14, snap: true },
      { x: -212, y: -97, at: 0.56, snap: true },
      { x: -64, y: 1, at: 1.04, snap: true },
      { x: 156, y: -61, at: 1.56, snap: true },
    ],
    converge: { x: -18, y: -8 },
    scatter: { x: -340, y: -190 },
  },
  {
    id: 'blue-frame',
    label: 'Frame · Align',
    color: '#3B82F6',
    glowColor: 'rgba(59,130,246,0.85)',
    badgeBg: 'rgba(13,27,62,0.92)',
    badgeText: '#DBEAFE',
    badgeAlign: 'left',
    start: { x: 0, y: -167 },
    waypoints: [
      { x: -195, y: -167, at: 0.22, snap: true },
      { x: 342, y: -167, at: 0.72, snap: true },
      { x: 342, y: 0, at: 1.22 },
      { x: 342, y: 167, at: 1.66, snap: true },
    ],
    converge: { x: 20, y: -12 },
    scatter: { x: 345, y: -195 },
  },
  {
    id: 'violet-bezier',
    label: 'Bezier · Node',
    color: '#A855F7',
    glowColor: 'rgba(168,85,247,0.85)',
    badgeBg: 'rgba(42,16,66,0.92)',
    badgeText: '#F3E8FF',
    badgeAlign: 'right',
    start: { x: 280, y: -158 },
    waypoints: [
      { x: 42, y: -77, at: 0.36, snap: true },
      { x: -140, y: 89, at: 0.88 },
      { x: 122, y: 89, at: 1.32, snap: true },
      { x: 238, y: -11, at: 1.72, snap: true },
    ],
    converge: { x: -10, y: 14 },
    scatter: { x: -315, y: 185 },
  },
  {
    id: 'gold-chrome',
    label: 'Chrome · Light',
    color: '#C8A46B',
    glowColor: 'rgba(200,164,107,0.88)',
    badgeBg: 'rgba(44,32,14,0.92)',
    badgeText: '#FEF3C7',
    badgeAlign: 'left',
    start: { x: 315, y: 158 },
    waypoints: [
      { x: 0, y: -191, at: 0.28, snap: true },
      { x: 156, y: -61, at: 0.82, snap: true },
      { x: 284, y: -71, at: 1.38, snap: true },
      { x: 236, y: 55, at: 1.76 },
    ],
    converge: { x: 14, y: 10 },
    scatter: { x: 335, y: 185 },
  },
];
