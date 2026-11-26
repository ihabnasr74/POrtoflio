import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeLightingDotOpacity,
  createLightingDots,
  stepLightingDot,
} from './ambientParticles';

test('createLightingDots produces requested pinpoint and micro-bokeh particles within normalized bounds', () => {
  const dots = createLightingDots(64);
  assert.equal(dots.length, 64);

  const pinpoints = dots.filter((d) => d.kind === 'pinpoint');
  const bokehs = dots.filter((d) => d.kind === 'bokeh');
  assert.ok(pinpoints.length > bokehs.length);
  assert.ok(bokehs.length > 0);

  for (const d of dots) {
    assert.ok(d.x >= 0 && d.x <= 1);
    assert.ok(d.y >= 0 && d.y <= 1);
    assert.ok(d.r > 0);
    assert.ok(d.baseAlpha > 0 && d.baseAlpha <= 1);
  }
});

test('stepLightingDot advances upward diagonal motion and wraps cleanly around edges', () => {
  const dot = createLightingDots(1)[0];
  const moved = stepLightingDot(dot, 0.03, 1.2, 1);
  assert.notEqual(moved.x, dot.x);
  assert.notEqual(moved.y, dot.y);

  const wrapped = stepLightingDot({ ...dot, y: -0.07 }, 0.016, 2.0, 1);
  assert.ok(wrapped.y >= 0 && wrapped.y <= 1.06);
});

test('computeLightingDotOpacity stays bounded smoothly between 0 and 1', () => {
  const dots = createLightingDots(12);
  for (let t = 0; t <= 10; t += 0.5) {
    for (const d of dots) {
      const { alpha, flashBoost } = computeLightingDotOpacity(d, t, 0);
      assert.ok(alpha >= 0 && alpha <= 1);
      assert.ok(flashBoost >= 0 && flashBoost <= 0.45);
    }
  }
});
