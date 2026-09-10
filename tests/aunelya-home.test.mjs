import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const parseThemeJson = (path) => JSON.parse(read(path).replace(/^\s*\/\*[\s\S]*?\*\//, ''));

const sectionTypes = [
  'aunelya-hero',
  'aunelya-trust-bar',
  'aunelya-product-showcase',
  'aunelya-lifestyle',
  'aunelya-technology',
  'aunelya-reviews',
  'aunelya-final-cta',
];

const productionAssets = [
  'aunelya-hero-desktop.webp',
  'aunelya-product-pink.webp',
  'aunelya-product-white.webp',
  'aunelya-whats-included.webp',
  'aunelya-lifestyle-routine-main.webp',
  'aunelya-lifestyle-home.webp',
  'aunelya-lifestyle-movement.webp',
  'aunelya-lifestyle-routine.webp',
  'aunelya-lifestyle-when-needed.webp',
  'aunelya-technology-product.webp',
];

test('the home template contains the complete Aunelya sequence', () => {
  const template = parseThemeJson('templates/index.json');
  const orderedTypes = template.order.map((id) => template.sections[id].type);
  assert.deepEqual(orderedTypes, sectionTypes);
});

test('every production section, shared asset and snippet exists', () => {
  for (const type of sectionTypes) {
    assert.equal(existsSync(join(root, 'sections', `${type}.liquid`)), true, `${type}.liquid is missing`);
  }
  assert.equal(existsSync(join(root, 'assets', 'aunelya-home.css')), true);
  assert.equal(existsSync(join(root, 'snippets', 'aunelya-image.liquid')), true);
  assert.equal(existsSync(join(root, 'snippets', 'aunelya-icon.liquid')), true);
  for (const asset of productionAssets) {
    assert.equal(existsSync(join(root, 'assets', asset)), true, `${asset} is missing`);
  }
});

test('runtime files never render visual references or unsupported commercial claims', () => {
  const runtime = [
    ...sectionTypes.map((type) => `sections/${type}.liquid`),
    'templates/index.json',
    'assets/aunelya-home.css',
  ].map(read).join('\n');

  assert.doesNotMatch(runtime, /aunelya-ref-/i);
  assert.doesNotMatch(runtime, /10[.,]?000|clientes satisfech|4[.,]8\s*\/\s*5|30 d[ií]as|env[ií]o r[aá]pido/i);
});

test('product cards use a Shopify product setting and real variant URLs without fixed IDs', () => {
  const productSection = read('sections/aunelya-product-showcase.liquid');
  assert.match(productSection, /section\.settings\.product/);
  assert.match(productSection, /variant\.url/);
  assert.match(productSection, /money_with_currency/);
  assert.doesNotMatch(productSection, /variant[_-]?id\s*[=:]\s*["']?\d{5,}/i);
});

test('reviews are disabled and empty by default', () => {
  const template = parseThemeJson('templates/index.json');
  const reviews = Object.values(template.sections).find((section) => section.type === 'aunelya-reviews');
  assert.equal(reviews.settings.enabled, false);
  assert.deepEqual(reviews.blocks ?? {}, {});
});

test('header and footer defaults avoid announcements and invented social profiles', () => {
  const header = parseThemeJson('sections/header-group.json');
  const footer = parseThemeJson('sections/footer-group.json');
  assert.equal(Object.values(header.sections).some((section) => section.type === 'header-announcements'), false);
  assert.doesNotMatch(JSON.stringify(footer), /https?:\/\/(?:www\.)?(?:facebook|instagram|youtube|tiktok|x)\.com\/?["']/i);
});
