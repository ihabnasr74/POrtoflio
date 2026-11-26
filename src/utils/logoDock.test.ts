import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeLogoDockProgress,
  computeLogoDockTransform,
  computeNavbarBrandToggle,
} from './logoDock';

test('computeLogoDockProgress clamps cleanly between 0 and 1 across scroll range', () => {
  assert.equal(computeLogoDockProgress(0, 0, 540), 0);
  assert.equal(computeLogoDockProgress(-20, 0, 540), 0);
  assert.equal(computeLogoDockProgress(270, 0, 540), 0.5);
  assert.equal(computeLogoDockProgress(540, 0, 540), 1);
  assert.equal(computeLogoDockProgress(1400, 0, 540), 1);
});

test('computeLogoDockTransform maps centered hero logo smoothly to top-left navbar slot', () => {
  const heroLogo = { left: 340, top: 200, width: 760, height: 400 };
  const navSlot = { left: 48, top: 20, width: 76, height: 40 };

  const atStart = computeLogoDockTransform(heroLogo, navSlot, 0);
  assert.equal(atStart.x, 0);
  assert.equal(atStart.y, 0);
  assert.equal(atStart.scale, 1);

  const atEnd = computeLogoDockTransform(heroLogo, navSlot, 1);
  // Hero center = (720, 400), Nav center = (86, 40)
  assert.equal(atEnd.x, 86 - 720);
  assert.equal(atEnd.y, 40 - 400);
  assert.equal(atEnd.scale, 0.1);
});

test('computeNavbarBrandToggle swaps in place without overlap between compact emblem at top and Ihab Nasr text when scrolled', () => {
  const atIntro = computeNavbarBrandToggle(0);
  assert.equal(atIntro.isEmblemActive, true);
  assert.equal(atIntro.emblemOpacity, 1);
  assert.equal(atIntro.emblemScale, 1);
  assert.equal(atIntro.textOpacity, 0);

  const midEmblemFade = computeNavbarBrandToggle(0.23);
  assert.ok(midEmblemFade.emblemOpacity > 0 && midEmblemFade.emblemOpacity < 1);
  assert.equal(midEmblemFade.textOpacity, 0);

  const deadband = computeNavbarBrandToggle(0.38);
  assert.equal(deadband.emblemOpacity, 0);
  assert.equal(deadband.textOpacity, 0);

  const midTextFade = computeNavbarBrandToggle(0.53);
  assert.equal(midTextFade.emblemOpacity, 0);
  assert.ok(midTextFade.textOpacity > 0 && midTextFade.textOpacity < 1);

  const scrolledDown = computeNavbarBrandToggle(1);
  assert.equal(scrolledDown.isEmblemActive, false);
  assert.equal(scrolledDown.emblemOpacity, 0);
  assert.equal(scrolledDown.textOpacity, 1);
  assert.equal(scrolledDown.textScale, 1);
});
