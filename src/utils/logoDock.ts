export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface DockTransform {
  x: number;
  y: number;
  scale: number;
}

export function computeLogoDockProgress(
  scrollY: number,
  dockStartPx: number,
  dockEndPx: number
): number {
  if (dockEndPx <= dockStartPx) {
    return scrollY >= dockEndPx ? 1 : 0;
  }
  const raw = (scrollY - dockStartPx) / (dockEndPx - dockStartPx);
  return Math.min(1, Math.max(0, raw));
}

export function computeLogoDockTransform(
  sourceRect: RectLike,
  targetRect: RectLike,
  progress: number
): DockTransform {
  const clamped = Math.min(1, Math.max(0, progress));
  if (
    sourceRect.width <= 0 ||
    sourceRect.height <= 0 ||
    targetRect.width <= 0 ||
    targetRect.height <= 0
  ) {
    return { x: 0, y: 0, scale: 1 };
  }

  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  const targetScale = Math.min(
    targetRect.width / sourceRect.width,
    targetRect.height / sourceRect.height
  );

  return {
    x: (targetCenterX - sourceCenterX) * clamped || 0,
    y: (targetCenterY - sourceCenterY) * clamped || 0,
    scale: (1 - clamped) + targetScale * clamped,
  };
}

export interface NavbarBrandToggleState {
  isEmblemActive: boolean;
  emblemOpacity: number;
  emblemScale: number;
  textOpacity: number;
  textScale: number;
}

/**
 * Computes an in-place crossfade/morph between the compact IHAB emblem mark
 * (active at top / #intro) and the "Ihab Nasr" text wordmark (active when
 * scrolled down into portfolio sections), staying fixed inside the top-left
 * header slot without flying across the viewport.
 */
export function computeNavbarBrandToggle(progress: number): NavbarBrandToggleState {
  const clamped = Math.min(1, Math.max(0, progress));

  // Compact emblem fades out completely before wordmark appears (zero overlap)
  const emblemT = Math.min(1, Math.max(0, (clamped - 0.1) / 0.26));
  const emblemOpacity = Number((1 - emblemT).toFixed(3));
  const emblemScale = Number((1 - emblemT * 0.1).toFixed(3));

  // "Ihab Nasr" wordmark fades/morphs in cleanly only after emblem has cleared
  const textT = Math.min(1, Math.max(0, (clamped - 0.4) / 0.26));
  const textOpacity = Number(textT.toFixed(3));
  const textScale = Number((0.94 + textT * 0.06).toFixed(3));

  return {
    isEmblemActive: clamped < 0.38,
    emblemOpacity,
    emblemScale,
    textOpacity,
    textScale,
  };
}
