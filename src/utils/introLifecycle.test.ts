import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DESIGN_SWARM_CURSORS,
  INTRO_STAGE_GEOMETRY,
  computeIntroStageDimensions,
  computeLoneToolSweepBounds,
  hasLeftIntroStage,
  shouldPrehideIntroStage,
  shouldResetIntroForReturn,
} from './introLifecycle';

test('hasLeftIntroStage detects genuine scroll departure from intro', () => {
  assert.equal(hasLeftIntroStage(0), false);
  assert.equal(hasLeftIntroStage(0.15), false);
  assert.equal(hasLeftIntroStage(0.28), true);
  assert.equal(hasLeftIntroStage(1), true);
});

test('shouldResetIntroForReturn replays only after leaving and returning to top', () => {
  assert.equal(shouldResetIntroForReturn(false, 0), false);
  assert.equal(shouldResetIntroForReturn(true, 0.2), false);
  assert.equal(shouldResetIntroForReturn(true, 0.03), false);
  assert.equal(shouldResetIntroForReturn(true, 0.02), true);
  assert.equal(shouldResetIntroForReturn(true, 0), true);
});

test('shouldPrehideIntroStage enforces strict hidden state offscreen and on scroll-up return', () => {
  // At initial top load, never pre-hide
  assert.equal(
    shouldPrehideIntroStage({ wasAwayFromTop: false, logoDockProgress: 0, prevProgress: 0 }),
    false
  );
  // Once scrolled past intro (>= 0.95), force hidden before return
  assert.equal(
    shouldPrehideIntroStage({ wasAwayFromTop: true, logoDockProgress: 1, prevProgress: 0.92 }),
    true
  );
  // Returning upward from partial scroll (> 0.02) forces hidden immediately before paint
  assert.equal(
    shouldPrehideIntroStage({ wasAwayFromTop: true, logoDockProgress: 0.42, prevProgress: 0.55 }),
    true
  );
});

test('DESIGN_SWARM_CURSORS defines 4 distinct vibrant cursors with waypoints and scatter vectors', () => {
  assert.equal(DESIGN_SWARM_CURSORS.length, 4);
  const colors = new Set(DESIGN_SWARM_CURSORS.map((c) => c.color));
  assert.equal(colors.size, 4);
  for (const cursor of DESIGN_SWARM_CURSORS) {
    assert.ok(cursor.label.length > 0);
    assert.ok(cursor.waypoints.length >= 4);
    assert.notEqual(cursor.scatter.x, 0);
    assert.notEqual(cursor.scatter.y, 0);
  }
});

test('computeIntroStageDimensions aligns SVG bounding box frame directly with emblem bounds across mobile and desktop', () => {
  const viewports: Array<[number, number]> = [
    [360, 740],
    [375, 812],
    [430, 932],
    [1440, 900],
  ];

  for (const [vw, vh] of viewports) {
    const dims = computeIntroStageDimensions(vw, vh);
    const renderedFrameWidth =
      dims.stageWidth * (INTRO_STAGE_GEOMETRY.frameWidth / INTRO_STAGE_GEOMETRY.viewBoxWidth);
    const renderedFrameHeight =
      dims.stageHeight * (INTRO_STAGE_GEOMETRY.frameHeight / INTRO_STAGE_GEOMETRY.viewBoxHeight);

    assert.ok(Math.abs(renderedFrameWidth - dims.emblemWidth) < 0.05);
    assert.ok(Math.abs(renderedFrameHeight - dims.emblemHeight) < 0.05);
    assert.ok(dims.stageWidth <= vw);
  }
});

test('computeLoneToolSweepBounds keeps lone tool sweep and search darts inside viewport across mobile and desktop', () => {
  const cases: Array<[number, number]> = [
    [210, 360],
    [225, 375],
    [245, 430],
    [280, 1440],
  ];

  for (const [subW, vw] of cases) {
    const bounds = computeLoneToolSweepBounds(subW, vw);
    const maxSafe = vw / 2 - 20;
    assert.ok(bounds.leftX < -subW / 2);
    assert.ok(bounds.rightX > subW / 2);
    assert.ok(Math.abs(bounds.leftX) <= maxSafe);
    assert.ok(Math.abs(bounds.rightX) <= maxSafe);
    assert.ok(Math.abs(bounds.searchLeftX) <= maxSafe);
    assert.ok(Math.abs(bounds.searchRightX) <= maxSafe);
  }
});
