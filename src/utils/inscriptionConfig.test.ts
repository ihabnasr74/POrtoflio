import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeInscriptionStepDelay,
  INSCRIPTION_OBSERVER_THRESHOLDS,
  INSCRIPTION_TIER_CONFIG,
  INSCRIPTION_TRIGGER_THRESHOLD,
} from './inscriptionConfig';

test('inscription config uses matching threshold and crisp bright white/silver settled colors', () => {
  assert.equal(INSCRIPTION_TRIGGER_THRESHOLD, 0.16);
  assert.deepEqual(INSCRIPTION_OBSERVER_THRESHOLDS, [0, 0.16]);
  assert.equal(INSCRIPTION_TIER_CONFIG.display.settledColor, '#F4F1EA');
  assert.equal(INSCRIPTION_TIER_CONFIG.body.settledColor, '#E2E6EC');
  assert.equal(INSCRIPTION_TIER_CONFIG.display.stagger, 0.018);
  assert.equal(INSCRIPTION_TIER_CONFIG.body.stagger, 0.006);
});

test('computeInscriptionStepDelay calculates sequential cascade offsets cleanly', () => {
  assert.equal(computeInscriptionStepDelay(0, 0.018), 0);
  const offset = computeInscriptionStepDelay(40, INSCRIPTION_TIER_CONFIG.display.stagger);
  assert.ok(Math.abs(offset - 0.8) < 1e-6);
});
