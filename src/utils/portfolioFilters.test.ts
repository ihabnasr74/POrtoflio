import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DESIGNER_PROFILE,
  ICED_FROSTED_PLATES,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
} from '../data/portfolioData';
import {
  buildMailtoHref,
  filterProjectsByCategory,
  flattenExhibitionPlates,
  getAdjacentProjectIds,
  getCategoryCounts,
  getExhibitionProjectTabs,
  getNextExhibitionIndex,
  validateInquiryForm,
} from './portfolioFilters';
import { shouldPlayCrtSound } from './crtAudio';

const REMOVED_ASSET_FRAGMENTS = [
  'Pear-Strawberry-Rasp-ICE',
  'Pineapple-ICE',
  'Banana-Milkshake',
  'Black-Mamba',
  'Kiwi-Passion-Fruit-Guava',
  'Lucky-Blue-Razz',
  'Lush-Watermelon',
  'Mango-Mania',
  'Mango-Peach-Ice',
  'Mixed-Berries',
  'Golden_Dust_Over_Wet_Wood',
];

test('designer profile includes verified transparent PNG logo asset path', () => {
  assert.equal(
    DESIGNER_PROFILE.emblemHeroSrc,
    '/assets/aistudio/ChatGPT_Image_Nov_24__2026__08_26_32_AM_3cace4ea.png'
  );
});

test('filterProjectsByCategory returns all projects for All Works and filters accurately', () => {
  const all = filterProjectsByCategory(PORTFOLIO_PROJECTS, 'All Works');
  assert.equal(all.length, 10);

  const packaging = filterProjectsByCategory(PORTFOLIO_PROJECTS, 'Packaging Design');
  assert.ok(packaging.length >= 7);
  assert.ok(packaging.every((p) => p.categories.includes('Packaging Design')));
  assert.ok(packaging.some((p) => p.id === 'lyon-double-twist'));
  assert.ok(packaging.some((p) => p.id === 'ya-layl-frosted'));

  const campaigns = filterProjectsByCategory(PORTFOLIO_PROJECTS, 'Creative Campaigns');
  assert.ok(campaigns.some((p) => p.id === 'ya-layl-christmas'));
  assert.ok(campaigns.some((p) => p.id === 'kuiq-vape'));
  assert.ok(campaigns.some((p) => p.id === 'ya-layl-frosted'));
});

test('getCategoryCounts totals match individual category filters', () => {
  const counts = getCategoryCounts(PORTFOLIO_PROJECTS, PORTFOLIO_CATEGORIES);
  assert.equal(counts['All Works'], 10);
  assert.equal(
    counts['Brand Identity'],
    filterProjectsByCategory(PORTFOLIO_PROJECTS, 'Brand Identity').length
  );
  assert.equal(
    counts['Product Visualization'],
    filterProjectsByCategory(PORTFOLIO_PROJECTS, 'Product Visualization').length
  );
});

test('getAdjacentProjectIds wraps cleanly at list boundaries', () => {
  const firstId = PORTFOLIO_PROJECTS[0].id;
  const lastId = PORTFOLIO_PROJECTS[PORTFOLIO_PROJECTS.length - 1].id;

  const atFirst = getAdjacentProjectIds(PORTFOLIO_PROJECTS, firstId);
  assert.equal(atFirst.prevId, lastId);
  assert.equal(atFirst.nextId, PORTFOLIO_PROJECTS[1].id);

  const atLast = getAdjacentProjectIds(PORTFOLIO_PROJECTS, lastId);
  assert.equal(atLast.prevId, PORTFOLIO_PROJECTS[PORTFOLIO_PROJECTS.length - 2].id);
  assert.equal(atLast.nextId, firstId);

  const invalid = getAdjacentProjectIds(PORTFOLIO_PROJECTS, 'nonexistent');
  assert.equal(invalid.prevId, null);
  assert.equal(invalid.nextId, null);
});

test('validateInquiryForm rejects invalid inputs and accepts valid submissions', () => {
  const invalid = validateInquiryForm({
    name: 'A',
    email: 'not-an-email',
    projectType: 'Packaging Design',
    message: 'Too short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateInquiryForm({
    name: 'Karim Mansour',
    email: 'karim@studio.com',
    projectType: 'Brand Identity',
    message: 'Looking to develop packaging and brand identity for a new beverage line.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('designer profile includes updated direct email, phone, and WhatsApp details', () => {
  assert.equal(DESIGNER_PROFILE.contactEmail, 'ihabnasrx@gmail.com');
  assert.equal(DESIGNER_PROFILE.contactPhone, '+201012330832');
  assert.equal(DESIGNER_PROFILE.whatsappUrl, 'https://wa.me/201012330832');
});

test('buildMailtoHref encodes recipient, subject, and body properly', () => {
  const href = buildMailtoHref(
    {
      name: 'Nadia Hassan',
      email: 'nadia@brand.ae',
      projectType: 'Packaging Design',
      message: 'Need a complete 6-SKU carton packaging design.',
    },
    DESIGNER_PROFILE.contactEmail
  );
  assert.ok(href.startsWith('mailto:ihabnasrx@gmail.com?subject='));
  assert.ok(href.includes(encodeURIComponent('Nadia Hassan')));
  assert.ok(href.includes(encodeURIComponent('Packaging Design')));
});

test('all 10 portfolio projects and 6 iced editions have valid local image paths totaling 58 plates', () => {
  const ids = new Set(PORTFOLIO_PROJECTS.map((p) => p.id));
  assert.equal(ids.size, 10);
  assert.ok(!ids.has('kuiq-bar-composite'));
  assert.equal(ICED_FROSTED_PLATES.length, 6);

  let totalImages = 0;
  for (const project of PORTFOLIO_PROJECTS) {
    assert.ok(project.images.length > 0, `${project.id} must have at least 1 image`);
    for (const img of project.images) {
      assert.ok(
        img.src.startsWith('/portfolio/') || img.src.startsWith('/assets/aistudio/'),
        `Expected local /portfolio/ or /assets/aistudio/ asset, got ${img.src}`
      );
      for (const removed of REMOVED_ASSET_FRAGMENTS) {
        assert.ok(!img.src.includes(removed), `Deleted asset found in portfolio: ${img.src}`);
      }
      totalImages += 1;
    }
  }
  assert.equal(totalImages, 58);
});

test('flattenExhibitionPlates flattens all 58 artworks and filters cleanly by project', () => {
  const allPlates = flattenExhibitionPlates(PORTFOLIO_PROJECTS, 'all');
  assert.equal(allPlates.length, 58);
  assert.equal(allPlates[0].plateNumber, 1);
  assert.equal(allPlates[0].totalPlates, 58);
  assert.equal(allPlates[57].plateNumber, 58);

  const lyonPlates = flattenExhibitionPlates(PORTFOLIO_PROJECTS, 'lyon-double-twist');
  assert.equal(lyonPlates.length, 6);
  assert.ok(lyonPlates.every((p) => p.projectId === 'lyon-double-twist' && p.totalPlates === 6));

  const tabs = getExhibitionProjectTabs(PORTFOLIO_PROJECTS);
  assert.equal(tabs[0].id, 'all');
  assert.equal(tabs[0].count, 58);
  assert.equal(tabs.length, PORTFOLIO_PROJECTS.length + 1);
});

test('getNextExhibitionIndex wraps cleanly forward and backward without overflow', () => {
  assert.equal(getNextExhibitionIndex(0, 1, 58), 1);
  assert.equal(getNextExhibitionIndex(57, 1, 58), 0);
  assert.equal(getNextExhibitionIndex(0, -1, 58), 57);
  assert.equal(getNextExhibitionIndex(0, 1, 1), 0);
  assert.equal(getNextExhibitionIndex(0, 1, 0), 0);
});

test('sequential hero CRT channel walk covers all 58 plates across all 10 projects in order', () => {
  const plates = flattenExhibitionPlates(PORTFOLIO_PROJECTS, 'all');
  const visitedProjects = new Set<string>();
  let idx = 0;

  for (let step = 0; step < plates.length; step++) {
    assert.equal(plates[idx].plateNumber, step + 1);
    visitedProjects.add(plates[idx].projectId);
    idx = getNextExhibitionIndex(idx, 1, plates.length);
  }

  assert.equal(idx, 0);
  assert.equal(visitedProjects.size, PORTFOLIO_PROJECTS.length);
});

test('shouldPlayCrtSound respects mute state and audio context availability', () => {
  assert.equal(shouldPlayCrtSound({ isMuted: false, hasAudioContext: true }), true);
  assert.equal(shouldPlayCrtSound({ isMuted: true, hasAudioContext: true }), false);
  assert.equal(shouldPlayCrtSound({ isMuted: false, hasAudioContext: false }), false);
  assert.equal(shouldPlayCrtSound({ isMuted: true, hasAudioContext: false }), false);
});
