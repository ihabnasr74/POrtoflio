import test from 'node:test';
import assert from 'node:assert/strict';
import * as crtAudio from './crtAudio';
import { getCrtGlowPalette } from './exhibitionPalette';

test('CRT static hiss config stays within crisp 0.25s-0.40s window', () => {
  assert.ok(crtAudio.CRT_STATIC_CONFIG.durationSec >= 0.25);
  assert.ok(crtAudio.CRT_STATIC_CONFIG.durationSec <= 0.4);
  assert.ok(
    crtAudio.CRT_STATIC_CONFIG.attackSec < crtAudio.CRT_STATIC_CONFIG.decayEndSec
  );
});

test('continuous ambient synth pad exports are removed and toggle logic works cleanly', () => {
  assert.equal('AMBIENT_PAD_CONFIG' in crtAudio, false);
  assert.equal('syncAmbientSoundscape' in crtAudio, false);
  assert.equal(crtAudio.computeSoundStateAfterToggle(false), true);
  assert.equal(crtAudio.computeSoundStateAfterToggle(true), false);
});

test('getCrtGlowPalette returns distinct RGB harmonics across flavors including frosted editions', () => {
  const berry = getCrtGlowPalette({
    projectId: 'cwench',
    caption: 'Berry Crush — Stick Pack Action Key Visual',
    accentHex: '#2F6FED',
  });
  const mango = getCrtGlowPalette({
    projectId: 'kuiq-vape',
    caption: 'Mango Mania & Banana Milkshake — Split Campaign',
    accentHex: '#E03E36',
  });
  const frosty = getCrtGlowPalette({
    projectId: 'ya-layl-frosted',
    caption: 'Frosty Blueberry — Crushed Ice & Frosted Berry Clusters',
    accentHex: '#38BDF8',
  });

  assert.notEqual(berry.primaryRgb, mango.primaryRgb);
  assert.notEqual(mango.primaryRgb, frosty.primaryRgb);
  assert.match(frosty.primaryRgb, /^\d+, \d+, \d+$/);
});
