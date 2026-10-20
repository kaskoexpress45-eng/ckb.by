import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const internal = new Set();
  for (const route of ['/', '/razvitie', '/zashchita', '/kapital', '/obo-mne', '/kontakty', '/stati', '/stati/podgotovka-k-peregovoram', '/politika']) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => ({href: a.getAttribute('href'), text: a.textContent.trim(), name: a.getAttribute('aria-label')})));
    for (const link of links) {
      assert.ok(link.text || link.name, `Unnamed link on ${route}`);
      assert.ok(link.href && link.href !== '#', `Empty destination on ${route}`);
      const url = new URL(link.href, base + route);
      if (url.origin !== new URL(base).origin) continue;
      internal.add(url.pathname + url.search);
      if (url.pathname === route && url.hash) {
        assert.equal(await page.locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).count(), 1, `Missing anchor ${link.href}`);
      }
    }
    if (process.env.CKB_TEST_DISABLED_INTAKE === '1') await expect(page.locator('form.lead-form')).toHaveCount(0);
  }
  for (const path of internal) {
    const response = await page.request.get(base + path);
    assert.equal(response.status(), 200, `Broken internal link ${path}`);
  }
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.hero-actions a').first().click();
  await page.waitForURL('**/kontakty?direction=development#consultation');
  await expect(page.locator('.direct-contact-panel .button')).toBeVisible();
  for (const index of [0, 1, 2]) {
    await page.goto(base, { waitUntil: 'networkidle' });
    const card = page.locator('a.task-card').nth(index);
    const destination = await card.getAttribute('href');
    await card.locator('h3').click();
    await page.waitForURL(base + destination);
    const draft = new URL(await page.locator('.direct-contact-panel .button').getAttribute('href'));
    assert.ok(draft.searchParams.get('text').includes(await page.locator('.direct-contact-panel .large-text').innerText()));
    await page.goBack({ waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/');
  }
  await page.goto(base + '/razvitie', { waitUntil: 'networkidle' });
  const formats = await page.locator('.format-grid a').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')));
  assert.equal(formats.length, 8);
  assert.equal(new Set(formats).size, 8, 'Each format must retain its own selection');
  for (let i = 0; i < formats.length; i++) {
    await page.goto(base + '/razvitie', { waitUntil: 'networkidle' });
    const title = await page.locator('.format-grid article').nth(i).locator('h3').innerText();
    await page.locator('.format-grid a').nth(i).click();
    await page.waitForURL(base + formats[i]);
    await expect(page.locator('.direct-contact-panel .large-text')).toContainText(title);
  }
  await page.goto(base + '/razvitie', { waitUntil: 'networkidle' });
  await expect(page.locator('.topic-list > a')).toHaveCount(6);
  await page.locator('.topic-list > a').nth(1).click();
  await expect(page.locator('.direct-contact-panel .large-text')).toHaveText('Хочу обсудить переговоры');
  for (const [route, direction] of [['/zashchita', 'protection'], ['/kapital', 'capital']]) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.locator('.page-hero .button').click();
    await page.waitForURL(`**/kontakty?direction=${direction}#consultation`);
    assert.equal(new URL(page.url()).searchParams.get('direction'), direction);
    const panel = page.locator('.direct-contact-panel .button');
    const box = await panel.boundingBox();
    assert.ok(box.width >= 44 && box.height >= 44, 'Contact action needs a large tap target');
  }
  await page.goto(base + '/kontakty?task=toString&format=unknown', { waitUntil: 'networkidle' });
  await expect(page.locator('.direct-contact-panel .large-text')).toHaveText('Хочу обсудить продажи и переговоры');
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Header overflow at ${width}`);
    const toggle = page.getByRole('button', { name: 'Меню' });
    if (width <= 1050) {
      await toggle.click();
      await page.locator('#main-nav').getByRole('link', { name: 'Продажи и переговоры', exact: true }).click();
      await page.waitForURL('**/razvitie');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#main-nav a[aria-current=page]')).toHaveText('Продажи и переговоры');
    } else {
      await expect(page.locator('.header-consult')).toBeVisible();
    }
  }
  // Intercept only the external navigation; no Telegram message is sent.
  let telegramNavigation = "";
  await page.route('https://t.me/**', async route => {
    telegramNavigation = route.request().url();
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Telegram navigation test</title>' });
  });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/kontakty?direction=development&task=sales']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const button = page.locator('.direct-contact-panel .button');
      await button.scrollIntoViewIfNeeded();
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
      telegramNavigation = "";
      await button.click();
      await page.waitForURL('https://t.me/**');
      const target = new URL(telegramNavigation);
      assert.equal(target.pathname, '/yuribelchik');
      assert.ok(target.searchParams.get('text').startsWith('Здравствуйте, Юрий!'));
    }
  }
  assert.deepEqual(errors, []);
  console.log(`${internal.size} internal destinations, anchors, 3 tasks, 8 formats, topic selection, 2 service directions, back navigation, 4 navigation widths and real Telegram-link clicks at 320/390px passed`);
} finally { await browser.close(); }
