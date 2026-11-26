import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSubtitleRevealIndex,
  spawnSubtitleLetterBurst,
  stepSubtitleParticles,
} from './subtitleParticles';

test('spawnSubtitleLetterBurst emits crisp white and silver micro-particles around target letter', () => {
  let seed = 0.17;
  const deterministicRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const sparks = spawnSubtitleLetterBurst({
    x: 120,
    y: 44,
    count: 8,
    random: deterministicRandom,
  });

  assert.equal(sparks.length, 8);
  for (const s of sparks) {
    assert.ok(s.radius >= 0.6 && s.radius <= 2.3);
    assert.ok(s.alpha > 0.7 && s.alpha <= 1);
    assert.ok(
      ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1'].includes(s.color),
      `Unexpected particle color ${s.color}`
    );
  }
});

test('stepSubtitleParticles advances position, fades cleanly, and prunes expired sparks', () => {
  const sparks = spawnSubtitleLetterBurst({
    x: 100,
    y: 50,
    count: 5,
    random: () => 0.5,
  });

  const mid = stepSubtitleParticles(sparks, 0.25);
  assert.equal(mid.length, 5);
  assert.ok(mid.every((p) => p.life > 0 && p.alpha > 0 && p.y !== 50));

  let current = mid;
  for (let i = 0; i < 25; i++) {
    current = stepSubtitleParticles(current, 0.05);
  }
  assert.equal(current.length, 0);
});

test('computeSubtitleRevealIndex maps sweep progress across character count cleanly', () => {
  assert.equal(computeSubtitleRevealIndex(0, 1.0, 16), 0);
  assert.equal(computeSubtitleRevealIndex(0.5, 1.0, 16), 8);
  assert.equal(computeSubtitleRevealIndex(1.0, 1.0, 16), 16);
  assert.equal(computeSubtitleRevealIndex(1.4, 1.0, 16), 16);
});
