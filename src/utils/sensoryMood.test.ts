import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SENSORY_FADE_TIMING,
  classifyPlateSensoryMood,
  resolveActiveSensoryMood,
} from './sensoryMood';
import { createFrostFlakes, stepFrostFlakes } from './frostParticles';

test('classifyPlateSensoryMood maps iced, botanical, water, smoke, and neutral artworks cleanly', () => {
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'ya-layl-frosted',
      caption: 'Lemon Lime Ice — Frozen Citrus Cube & Frosted Lime',
    }),
    'iced'
  );
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'ya-layl-christmas',
      caption: 'Frosty Raspberry & Dubai Nights — Winter Holiday Diptych',
    }),
    'iced'
  );
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'cwench',
      caption: 'Cherry Lime — 16 Individual Packets Box & Overhead Crystal Splash',
    }),
    'water'
  );
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'fitfuel-products',
      caption: 'FitFuel Shaker — Rain & Steel Atmosphere',
    }),
    'water'
  );
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'fitfuel-flavors',
      caption: 'Strawberry Soufflé — Botanical Moss Editorial',
      subSeries: 'Botanical Trio',
    }),
    'botanical'
  );
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'ya-layl-flavors',
      caption: 'Hawaii — Coastal Palm Edition',
    }),
    'botanical'
  );
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'lyon-double-twist',
      caption: 'Crystal Ashtray & Smoke — Luxury Lounge Still Life',
    }),
    'smoke'
  );
  assert.equal(
    classifyPlateSensoryMood({
      projectId: 'fitfuel-products',
      caption: 'Branded Takeaway Cup — Studio Spotlight',
    }),
    'neutral'
  );
});

test('resolveActiveSensoryMood respects mute and section priority order', () => {
  assert.equal(
    resolveActiveSensoryMood({
      isMuted: true,
      modalMood: 'iced',
      icedInView: true,
      exhibitionInView: true,
      exhibitionMood: 'water',
      heroInView: true,
      heroMood: 'smoke',
    }),
    'neutral'
  );

  assert.equal(
    resolveActiveSensoryMood({
      isMuted: false,
      modalMood: null,
      icedInView: true,
      exhibitionInView: true,
      exhibitionMood: 'water',
      heroInView: false,
      heroMood: 'smoke',
    }),
    'iced'
  );

  assert.equal(
    resolveActiveSensoryMood({
      isMuted: false,
      modalMood: 'botanical',
      icedInView: true,
      exhibitionInView: false,
      exhibitionMood: 'water',
      heroInView: false,
      heroMood: 'smoke',
    }),
    'botanical'
  );

  assert.ok(SENSORY_FADE_TIMING.fadeInSec >= 0.8);
  assert.ok(SENSORY_FADE_TIMING.fadeOutSec >= 0.5);
});

test('createFrostFlakes generates layered snow & ice crystals and wraps cleanly over time', () => {
  const flakes = createFrostFlakes(72);
  assert.equal(flakes.length, 72);
  assert.ok(flakes.some((f) => f.crystalline));
  assert.ok(flakes.some((f) => !f.crystalline));

  for (let step = 0; step < 120; step++) {
    stepFrostFlakes(flakes, 0.03, step * 0.03);
  }
  for (const flake of flakes) {
    assert.ok(flake.y >= -0.06 && flake.y <= 1.06);
    assert.ok(flake.x >= -0.08 && flake.x <= 1.08);
  }
});
