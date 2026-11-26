export type RgbTriplet = [number, number, number];

export interface PlateParticlePalette {
  primary: RgbTriplet;
  secondary: RgbTriplet;
  highlight: RgbTriplet;
}

const PROJECT_DEFAULT_PALETTES: Record<string, PlateParticlePalette> = {
  cwench: {
    primary: [56, 189, 248],   // cool hydration cyan
    secondary: [244, 63, 94],  // berry crimson
    highlight: [191, 219, 254],
  },
  'kuiq-vape': {
    primary: [244, 63, 94],
    secondary: [251, 191, 36],
    highlight: [254, 240, 138],
  },
  'fitfuel-products': {
    primary: [226, 232, 240],
    secondary: [200, 164, 107],
    highlight: [56, 189, 248],
  },
  'fitfuel-flavors': {
    primary: [245, 158, 11],
    secondary: [225, 29, 72],
    highlight: [253, 230, 138],
  },
  'kuiq-charcoal-v1': {
    primary: [249, 115, 22],   // glowing charcoal ember
    secondary: [245, 184, 72], // warm amber gold
    highlight: [56, 189, 248], // torch flame blue accent
  },
  'kuiq-charcoal-v2': {
    primary: [251, 146, 60],   // volcanic magma orange
    secondary: [74, 222, 128], // botanical emerald leaf
    highlight: [253, 224, 138],
  },
  'ya-layl-flavors': {
    primary: [200, 164, 107],
    secondary: [244, 63, 94],
    highlight: [253, 230, 138],
  },
  'ya-layl-christmas': {
    primary: [239, 68, 68],    // holiday crimson
    secondary: [234, 179, 8],  // warm gold bokeh
    highlight: [226, 232, 240],
  },
  'lyon-double-twist': {
    primary: [59, 130, 246],   // electric cobalt
    secondary: [236, 72, 153], // iridescent magenta
    highlight: [186, 230, 253],
  },
  'ya-layl-frosted': {
    primary: [56, 189, 248],   // crystalline glacial cyan
    secondary: [186, 230, 253], // icy silver mist
    highlight: [240, 249, 255],
  },
};

const CAPTION_KEYWORD_PALETTES: Array<{
  match: RegExp;
  palette: PlateParticlePalette;
}> = [
  {
    match: /rainbow swirl/i,
    palette: {
      primary: [251, 146, 60],
      secondary: [56, 189, 248],
      highlight: [244, 114, 182],
    },
  },
  {
    match: /cherry lime/i,
    palette: {
      primary: [163, 230, 53],
      secondary: [244, 63, 94],
      highlight: [254, 240, 138],
    },
  },
  {
    match: /berry crush/i,
    palette: {
      primary: [56, 189, 248],
      secondary: [244, 63, 94],
      highlight: [147, 197, 253],
    },
  },
  {
    match: /mango mania|banana milkshake/i,
    palette: {
      primary: [250, 204, 21],
      secondary: [249, 115, 22],
      highlight: [254, 249, 195],
    },
  },
  {
    match: /mixed berries|kiwi passion/i,
    palette: {
      primary: [192, 132, 252],
      secondary: [56, 189, 248],
      highlight: [244, 114, 182],
    },
  },
  {
    match: /pear strawberry/i,
    palette: {
      primary: [244, 63, 94],
      secondary: [163, 230, 53],
      highlight: [254, 215, 170],
    },
  },
  {
    match: /cookie de la cr/i,
    palette: {
      primary: [232, 194, 120],
      secondary: [180, 130, 82],
      highlight: [255, 243, 214],
    },
  },
  {
    match: /choco cherry/i,
    palette: {
      primary: [225, 29, 72],
      secondary: [217, 142, 75],
      highlight: [254, 205, 211],
    },
  },
  {
    match: /strawberry souffl/i,
    palette: {
      primary: [244, 63, 94],
      secondary: [134, 239, 172],
      highlight: [255, 228, 230],
    },
  },
  {
    match: /englyzi/i,
    palette: {
      primary: [99, 102, 241],
      secondary: [245, 184, 72],
      highlight: [199, 210, 254],
    },
  },
  {
    match: /havana/i,
    palette: {
      primary: [217, 155, 78],
      secondary: [234, 88, 12],
      highlight: [254, 243, 199],
    },
  },
  {
    match: /lady slayer/i,
    palette: {
      primary: [225, 29, 72],
      secondary: [236, 72, 153],
      highlight: [253, 164, 175],
    },
  },
  {
    match: /hawaii/i,
    palette: {
      primary: [34, 211, 238],
      secondary: [251, 191, 36],
      highlight: [167, 243, 208],
    },
  },
  {
    match: /love xo/i,
    palette: {
      primary: [244, 114, 182],
      secondary: [225, 29, 72],
      highlight: [251, 207, 232],
    },
  },
  {
    match: /mango tango/i,
    palette: {
      primary: [245, 158, 11],
      secondary: [234, 179, 8],
      highlight: [254, 240, 138],
    },
  },
  {
    match: /miami pink/i,
    palette: {
      primary: [244, 114, 182],
      secondary: [45, 212, 191],
      highlight: [252, 231, 243],
    },
  },
  {
    match: /red kiss/i,
    palette: {
      primary: [220, 38, 38],
      secondary: [226, 232, 240],
      highlight: [254, 202, 202],
    },
  },
  {
    match: /spring water/i,
    palette: {
      primary: [52, 211, 153],
      secondary: [56, 189, 248],
      highlight: [209, 250, 229],
    },
  },
  {
    match: /wild dragon/i,
    palette: {
      primary: [16, 185, 129],
      secondary: [236, 72, 153],
      highlight: [167, 243, 208],
    },
  },
  {
    match: /premium 20 seal/i,
    palette: {
      primary: [34, 197, 94],
      secondary: [59, 130, 246],
      highlight: [226, 232, 240],
    },
  },
  {
    match: /crystal ashtray|veined marble/i,
    palette: {
      primary: [217, 179, 114],
      secondary: [96, 165, 250],
      highlight: [244, 241, 234],
    },
  },
  {
    match: /lemon lime ice/i,
    palette: {
      primary: [163, 230, 53],
      secondary: [125, 211, 252],
      highlight: [236, 253, 245],
    },
  },
  {
    match: /frosty blueberry/i,
    palette: {
      primary: [96, 165, 250],
      secondary: [186, 230, 253],
      highlight: [239, 246, 255],
    },
  },
  {
    match: /frosty mango peach/i,
    palette: {
      primary: [251, 191, 36],
      secondary: [125, 211, 252],
      highlight: [254, 243, 199],
    },
  },
  {
    match: /frosty raspberry/i,
    palette: {
      primary: [244, 63, 94],
      secondary: [186, 230, 253],
      highlight: [255, 228, 230],
    },
  },
  {
    match: /frosty/i,
    palette: {
      primary: [56, 189, 248],
      secondary: [191, 219, 254],
      highlight: [240, 249, 255],
    },
  },
];

export function hexToRgb(hex: string): RgbTriplet {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return Number.isNaN(r) ? [200, 164, 107] : [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r, g, b];
    }
  }
  return [200, 164, 107];
}

export function getPlateParticlePalette(plate: {
  projectId: string;
  caption: string;
  accentHex?: string;
}): PlateParticlePalette {
  for (const entry of CAPTION_KEYWORD_PALETTES) {
    if (entry.match.test(plate.caption)) {
      return entry.palette;
    }
  }

  if (PROJECT_DEFAULT_PALETTES[plate.projectId]) {
    return PROJECT_DEFAULT_PALETTES[plate.projectId];
  }

  const fallback = hexToRgb(plate.accentHex ?? '#C8A46B');
  return {
    primary: fallback,
    secondary: [232, 194, 120],
    highlight: [244, 241, 234],
  };
}

export interface CrtGlowPalette {
  primaryRgb: string;
  secondaryRgb: string;
  highlightRgb: string;
}

export function getCrtGlowPalette(plate: {
  projectId: string;
  caption: string;
  accentHex?: string;
}): CrtGlowPalette {
  const p = getPlateParticlePalette(plate);
  return {
    primaryRgb: `${p.primary[0]}, ${p.primary[1]}, ${p.primary[2]}`,
    secondaryRgb: `${p.secondary[0]}, ${p.secondary[1]}, ${p.secondary[2]}`,
    highlightRgb: `${p.highlight[0]}, ${p.highlight[1]}, ${p.highlight[2]}`,
  };
}

export function lerpRgb(a: RgbTriplet, b: RgbTriplet, t: number): RgbTriplet {
  const clamped = Math.min(1, Math.max(0, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * clamped),
    Math.round(a[1] + (b[1] - a[1]) * clamped),
    Math.round(a[2] + (b[2] - a[2]) * clamped),
  ];
}

export function lerpPalette(
  current: PlateParticlePalette,
  target: PlateParticlePalette,
  t: number
): PlateParticlePalette {
  return {
    primary: lerpRgb(current.primary, target.primary, t),
    secondary: lerpRgb(current.secondary, target.secondary, t),
    highlight: lerpRgb(current.highlight, target.highlight, t),
  };
}

/**
 * Samples vibrant dominant & secondary colors directly from a decoded HTMLImageElement
 * onto an offscreen 24x24 canvas, falling back gracefully if pixels are opaque-black
 * or unreadable.
 */
export function sampleArtworkImagePalette(
  img: HTMLImageElement,
  fallback: PlateParticlePalette
): PlateParticlePalette {
  try {
    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      return fallback;
    }
    const size = 24;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return fallback;

    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    // Bin hue/saturation pixels in 12 hue buckets to find vibrant dominant + contrasting accent
    const buckets = Array.from({ length: 12 }, () => ({
      weight: 0,
      r: 0,
      g: 0,
      b: 0,
    }));

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 128) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      // Skip near-black and flat dark gray studio backdrop pixels
      if (max < 42 || delta < 22) continue;

      const sat = delta / Math.max(1, max);
      let hue = 0;
      if (max === r) hue = ((g - b) / delta) % 6;
      else if (max === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
      const hueDeg = ((hue * 60) + 360) % 360;
      const bucketIdx = Math.floor(hueDeg / 30) % 12;

      const weight = sat * (0.4 + max / 255);
      buckets[bucketIdx].weight += weight;
      buckets[bucketIdx].r += r * weight;
      buckets[bucketIdx].g += g * weight;
      buckets[bucketIdx].b += b * weight;
    }

    const sorted = buckets
      .map((bk, idx) => ({ ...bk, idx }))
      .filter((bk) => bk.weight > 0.25)
      .sort((a, b) => b.weight - a.weight);

    if (sorted.length === 0) return fallback;

    const top = sorted[0];
    const primary: RgbTriplet = [
      Math.min(255, Math.round(top.r / top.weight)),
      Math.min(255, Math.round(top.g / top.weight)),
      Math.min(255, Math.round(top.b / top.weight)),
    ];

    const distinctSecond = sorted.find(
      (bk) => Math.abs(bk.idx - top.idx) >= 2 && Math.abs(bk.idx - top.idx) <= 10
    );
    const secondary: RgbTriplet = distinctSecond
      ? [
          Math.min(255, Math.round(distinctSecond.r / distinctSecond.weight)),
          Math.min(255, Math.round(distinctSecond.g / distinctSecond.weight)),
          Math.min(255, Math.round(distinctSecond.b / distinctSecond.weight)),
        ]
      : fallback.secondary;

    const highlight: RgbTriplet = [
      Math.min(255, Math.round(primary[0] * 0.45 + 255 * 0.55)),
      Math.min(255, Math.round(primary[1] * 0.45 + 255 * 0.55)),
      Math.min(255, Math.round(primary[2] * 0.45 + 255 * 0.55)),
    ];

    return { primary, secondary, highlight };
  } catch {
    return fallback;
  }
}
