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

test('the color section uses floating product options without card surfaces', () => {
  const productSection = read('sections/aunelya-product-showcase.liquid');
  const template = read('templates/index.json');

  assert.match(productSection, /aunelya-color-option/);
  assert.doesNotMatch(productSection, /aunelya-variant-card/);
  assert.doesNotMatch(productSection, /card_color/);
  assert.doesNotMatch(template, /card_color/);
});

test('color options stack on mobile without a horizontal carousel', () => {
  const css = read('assets/aunelya-home.css');

  assert.doesNotMatch(css, /scroll-snap-type/);
  assert.doesNotMatch(css, /aunelya-variant-card/);
  assert.match(
    css,
    /@media \(max-width: 767px\)[\s\S]*?\.aunelya-product__variants\s*\{[^}]*grid-template-columns:\s*1fr;/,
  );
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

test('the color section links whole cards and no longer renders what is included', () => {
  const productSection = read('sections/aunelya-product-showcase.liquid');
  const template = parseThemeJson('templates/index.json');
  const showcase = Object.values(template.sections).find((section) => section.type === 'aunelya-product-showcase');

  assert.doesNotMatch(productSection, /aunelya-included|whats-included|included_/);
  assert.doesNotMatch(JSON.stringify(showcase), /included_/);
  assert.match(productSection, /aunelya-color-option__cta/);
  assert.match(productSection, /featured_product\.url/);
  assert.equal(showcase.settings.cta_label, 'Ver producto');
});

const pdpSectionTypes = ['product-information', 'aunelya-technology', 'aunelya-lifestyle', 'aunelya-included', 'aunelya-faq'];

test('the product template is a native Horizon PDP followed by Aunelya sections', () => {
  const template = parseThemeJson('templates/product.json');
  assert.deepEqual(template.order.map((id) => template.sections[id].type), pdpSectionTypes);

  const main = template.sections.main;
  const details = main.blocks['product-details'];
  const types = details.block_order.map((id) => details.blocks[id].type);
  assert.deepEqual(types, ['group', 'variant-picker', 'buy-buttons', 'aunelya-trust-list', 'aunelya-product-description']);
  assert.equal(main.settings.enable_sticky_add_to_cart, true);

  const header = details.blocks.aunelya_header.blocks;
  assert.match(header.aunelya_title.settings.text, /closest\.product\.title/);
  assert.equal(header.aunelya_price.type, 'price');
});

test('the product page never hardcodes product data or unsupported claims', () => {
  const runtime = [
    'templates/product.json',
    'sections/aunelya-included.liquid',
    'sections/aunelya-faq.liquid',
    'blocks/aunelya-trust-list.liquid',
    'blocks/aunelya-product-description.liquid',
    'assets/aunelya-product.css',
  ].map(read).join('\n');

  assert.doesNotMatch(runtime, /MX\$|799|variant[_-]?id\s*[=:]\s*["']?\d{5,}/i);
  assert.doesNotMatch(runtime, /\bcura\b|tratamiento|elimina (el )?dolor|medicaci[oó]n|best ?seller|estrellas|rese[nñ]as|\d+\s*°|\d+\s*(horas|minutos|d[ií]as)/i);
  assert.doesNotMatch(runtime, /aunelya-ref-/i);
});

test('the contact page uses the native Shopify contact form in the Aunelya style', () => {
  const template = parseThemeJson('templates/page.contact.json');
  assert.deepEqual(template.order.map((id) => template.sections[id].type), ['aunelya-contact', 'aunelya-faq']);

  const section = read('sections/aunelya-contact.liquid');
  assert.match(section, /\{%-?\s*form 'contact'/);
  assert.match(section, /name="contact\[email\]"/);
  assert.match(section, /name="contact\[body\]"/);
  assert.match(section, /form\.posted_successfully\?/);

  const layout = read('layout/theme.liquid');
  assert.match(layout, /template\.suffix == 'contact'/);
});

test('the contact page avoids invented contact details and response times', () => {
  const runtime = [read('sections/aunelya-contact.liquid'), read('templates/page.contact.json')].join('\n');
  assert.doesNotMatch(runtime, /@[a-z0-9-]+\.[a-z]{2,}|\+?\d[\d\s-]{7,}|\d+\s*(horas|minutos|d[ií]as)|24\s*\/\s*7|whatsapp/i);
});
