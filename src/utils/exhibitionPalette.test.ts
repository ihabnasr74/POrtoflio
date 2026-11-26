import test from 'node:test';
import assert from 'node:assert/strict';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { flattenExhibitionPlates } from './portfolioFilters';
import {
  getPlateParticlePalette,
  lerpPalette,
  lerpRgb,
} from './exhibitionPalette';

test('getPlateParticlePalette resolves distinct color harmonies for different artworks', () => {
  const plates = flattenExhibitionPlates(PORTFOLIO_PROJECTS, 'all');
  const berryCrush = plates.find((p) => /berry crush/i.test(p.caption));
  const charcoalV1 = plates.find((p) => p.projectId === 'kuiq-charcoal-v1');
  const lyon = plates.find((p) => p.projectId === 'lyon-double-twist');
  const holiday = plates.find((p) => p.projectId === 'ya-layl-christmas');

  assert.ok(berryCrush && charcoalV1 && lyon && holiday);

  const pBerry = getPlateParticlePalette(berryCrush);
  const pCharcoal = getPlateParticlePalette(charcoalV1);
  const pLyon = getPlateParticlePalette(lyon);
  const pHoliday = getPlateParticlePalette(holiday);

  assert.notDeepEqual(pBerry.primary, pCharcoal.primary);
  assert.notDeepEqual(pCharcoal.primary, pLyon.primary);
  assert.notDeepEqual(pLyon.primary, pHoliday.primary);

  // Every generated palette keeps valid 0..255 RGB channels across all 51 plates
  for (const plate of plates) {
    const pal = getPlateParticlePalette(plate);
    for (const color of [pal.primary, pal.secondary, pal.highlight]) {
      assert.equal(color.length, 3);
      for (const ch of color) {
        assert.ok(ch >= 0 && ch <= 255);
      }
    }
  }
});

test('lerpRgb and lerpPalette smoothly transition particle colors between plates', () => {
  assert.deepEqual(lerpRgb([0, 100, 200], [100, 200, 100], 0), [0, 100, 200]);
  assert.deepEqual(lerpRgb([0, 100, 200], [100, 200, 100], 0.5), [50, 150, 150]);
  assert.deepEqual(lerpRgb([0, 100, 200], [100, 200, 100], 1), [100, 200, 100]);

  const a = {
    primary: [34, 211, 238] as [number, number, number],
    secondary: [244, 63, 94] as [number, number, number],
    highlight: [255, 255, 255] as [number, number, number],
  };
  const b = {
    primary: [249, 115, 22] as [number, number, number],
    secondary: [245, 184, 72] as [number, number, number],
    highlight: [255, 240, 200] as [number, number, number],
  };
  const mid = lerpPalette(a, b, 0.5);
  assert.equal(mid.primary[0], 142);
  assert.equal(mid.secondary[0], 245);
});
