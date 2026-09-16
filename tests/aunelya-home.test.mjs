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
];

const productionAssets = [
  'aunelya-hero-desktop.webp',
  'aunelya-product-pink-kit.webp',
  'aunelya-product-white-kit.webp',
  'aunelya-product-pink-kit-alt.webp',
  'aunelya-lifestyle-routine-main.webp',
  'aunelya-lifestyle-home.webp',
  'aunelya-lifestyle-home-reading.webp',
  'aunelya-lifestyle-movement.webp',
  'aunelya-lifestyle-routine-bus.webp',
  'aunelya-lifestyle-when-needed.webp',
  'aunelya-product-white-kit-alt.webp',
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
  assert.equal(showcase.settings.cta_label, 'Ir al producto');
  assert.equal(showcase.settings.product, 'cinturon-termico-aunelya');
  assert.doesNotMatch(productSection, /all_products_collection_url/);
});

const pdpSectionTypes = ['product-information', 'aunelya-product-reviews', 'aunelya-review-form', 'aunelya-faq'];

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

test('the mobile sticky add to cart always renders a visible short label', () => {
  const section = read('sections/product-information.liquid');
  const short = section.match(/<span class="add-to-cart-text__short">[\s\S]*?<\/span>/);
  assert.ok(short, 'short label is missing');
  assert.match(short[0], /products\.product\.add_to_cart/);
  assert.match(short[0], /products\.product\.sold_out/);
  assert.match(short[0], /products\.product\.unavailable/);
});

test('shared sections used by home and PDP avoid medical, review and urgency claims', () => {
  const runtime = [
    'sections/aunelya-product-showcase.liquid',
    'sections/aunelya-lifestyle.liquid',
    'sections/aunelya-technology.liquid',
  ].map(read).join('\n');

  assert.doesNotMatch(runtime, /\bcura\b|tratamiento|elimina (el )?dolor|medicaci[oó]n|best ?seller|estrellas|[uú]ltimas unidades|stock bajo|descuento/i);
});

test('the footer uses the Aunelya section with real store links only', () => {
  const group = parseThemeJson('sections/footer-group.json');
  const types = group.order.map((id) => group.sections[id].type);
  assert.deepEqual(types, ['aunelya-footer']);

  const footer = group.sections[group.order[0]];
  const serialized = JSON.stringify(footer);
  assert.doesNotMatch(serialized, /collections\/all|https?:\/\//i);
  assert.match(serialized, /shopify:\/\/pages\/contact/);

  const section = read('sections/aunelya-footer.liquid');
  assert.match(section, /aunelya-footer-banner/);
  assert.match(section, /aunelya-image/);
  assert.equal((section.match(/shop\.name/g) ?? []).length, 1, 'shop.name is only used in the copyright');
  assert.match(read('assets/aunelya-tokens.css'), /\.aunelya-button \{/);
  assert.match(section, /shop\.policies/);
  assert.match(section, /variant\.url/);
  assert.match(section, /routes\.cart_url/);
  assert.doesNotMatch(section, /t[ée]rminos|\/pages\/(?!contact)|collections\/all|href="https?:/i);

  const layout = read('layout/theme.liquid');
  assert.match(layout, /aunelya-tokens\.css/);
  assert.match(layout, /aunelya-footer\.css/);
});

test('the contact page renders an editorial hero, optional details and accessible form states', () => {
  const section = read('sections/aunelya-contact.liquid');
  assert.match(section, /aunelya-contact__hero/);
  assert.match(section, /aunelya-lifestyle-home\.webp/);
  assert.match(section, /section\.settings\.email != blank/);
  assert.match(section, /aria-invalid="true"/);
  assert.match(section, /aria-busy/);
  assert.match(section, /aunelya-contact__success/);

  const template = parseThemeJson('templates/page.contact.json');
  const settings = template.sections.aunelya_contact.settings;
  for (const key of ['email', 'phone', 'location', 'hours']) {
    assert.equal(settings[key], '', `${key} must stay empty until the merchant fills it`);
  }

  const layout = read('layout/theme.liquid');
  assert.match(layout, /aunelya-contact\.css/);
});

test('the FAQ page template stays available without being linked from the footer', () => {
  const template = parseThemeJson('templates/page.faq.json');
  assert.deepEqual(template.order.map((id) => template.sections[id].type), ['aunelya-faq']);
  assert.equal(template.sections[template.order[0]].settings.heading_tag, 'h1');
  assert.match(read('layout/theme.liquid'), /template\.suffix == 'faq'/);

  const footer = JSON.stringify(parseThemeJson('sections/footer-group.json'));
  assert.doesNotMatch(footer, /preguntas-frecuentes/);
});

test('product ratings render curated anonymous reviews averaging 4.8 with manual submission', () => {
  const template = parseThemeJson('templates/product.json');
  const reviews = Object.values(template.sections).find((section) => section.type === 'aunelya-product-reviews');
  assert.ok(reviews, 'aunelya-product-reviews section is missing from product.json');

  const blocks = Object.values(reviews.blocks ?? {}).filter((block) => block.type === 'review');
  assert.equal(blocks.length, 6, 'expected 6 curated review blocks');

  let total = 0;
  let anonymous = 0;
  let named = 0;
  for (const block of blocks) {
    assert.ok(block.settings.author.length > 0, 'review author is missing');
    if (/^anónimo$/i.test(block.settings.author.trim())) {
      anonymous += 1;
    } else {
      named += 1;
    }
    assert.match(block.settings.date, /(14|15|16|17|18|19|20) SEP 2026/);
    assert.match(block.settings.variant, /^Color: (Rosa|Blanco)$/);
    assert.ok(block.settings.text.length > 5, 'review text is missing');
    total += block.settings.rating;
  }
  assert.ok(anonymous >= 2, `expected at least 2 anonymous reviews, got ${anonymous}`);
  assert.ok(named >= 2, `expected at least 2 named reviews, got ${named}`);
  const average = Math.round((total / blocks.length) * 10) / 10;
  assert.equal(average, 4.8, `expected 4.8 average, got ${average}`);

  // Manual review form follows the reviews section and links back via anchor.
  const formSection = Object.values(template.sections).find((section) => section.type === 'aunelya-review-form');
  assert.ok(formSection, 'aunelya-review-form section is missing from product.json');
  assert.equal(reviews.settings.write_link, '#aunelya-review-form');

  const header = template.sections.main.blocks['product-details'].blocks.aunelya_header;
  assert.equal(header.blocks.aunelya_rating.type, 'aunelya-rating-badge');
  assert.equal(header.blocks.aunelya_rating.settings.show_manual, true);
  assert.equal(header.blocks.aunelya_rating.settings.manual_rating, 4.8);
  assert.equal(header.blocks.aunelya_rating.settings.manual_count, 6);

  const badge = read('blocks/aunelya-rating-badge.liquid');
  assert.match(badge, /metafields\.reviews\.rating_count/);
  assert.match(badge, /if rating_count > 0/);
  assert.match(badge, /show_manual/);

  const section = read('sections/aunelya-product-reviews.liquid');
  assert.match(section, /metafields\.reviews\.rating/);
  assert.match(section, /metafields\.reviews\.rating_count/);
  assert.match(section, /"type": "@app"/);
  assert.match(section, /aunelya-reviews-pdp__empty/);
  assert.doesNotMatch(section, /aunelya-review-card__photos/);
  assert.doesNotMatch(section, /aunelya-review-card__variant/);
  assert.doesNotMatch(section, /"presets": \[\s*\{[^\]]*"blocks"/);

  // Curated test reviews must stay free of medical promises.
  assert.doesNotMatch(JSON.stringify(reviews), /\bcura\b|tratamiento|elimina (el )?dolor|medicaci[oó]n/i);

  const form = read('sections/aunelya-review-form.liquid');
  assert.match(form, /\{%-?\s*form 'contact'/);
  assert.match(form, /name="contact\[email\]"/);
  assert.match(form, /form\.posted_successfully\?/);
  assert.match(form, /aria-invalid="true"/);
  assert.match(form, /aria-busy/);
});

test('the product gallery groups media by the selected color', () => {
  const gallery = read('snippets/product-media-gallery-content.liquid');
  assert.match(gallery, /Aunelya: show only the selected color's media/);
  assert.match(gallery, /media_alt contains value_name/);

  const template = parseThemeJson('templates/product.json');
  assert.equal(template.sections.main.blocks['media-gallery'].settings.hide_variants, true);
});
