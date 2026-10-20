import { chromium, expect } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const executablePath =
  process.env.CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const viewport of process.env.CKB_BROWSER_FAST === "1"
    ? [{ width: 390, height: 844 }]
    : [
        { width: 1440, height: 900 },
        { width: 1920, height: 1080 },
        { width: 390, height: 844 },
        { width: 320, height: 640 },
      ]) {
    await page.setViewportSize(viewport);
    for (const path of [
      "/",
      "/razvitie",
      "/zashchita",
      "/kapital",
      "/obo-mne",
      "/kontakty",
      "/politika",
      "/stati/podgotovka-k-peregovoram",
    ]) {
      const response = await page.goto(base + path, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, path);
      await expect(page.locator("h1")).toHaveCount(1);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${path} overflow ${viewport.width}`,
      );
    }
    console.log(`8 pages passed at ${viewport.width}x${viewport.height}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Меню" }).click();
  await expect(page.locator("#menu-toggle")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-toggle")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page.locator(".task-card a").first().click();
  await page.waitForURL(
    "**/kontakty?direction=development&task=sales#consultation",
  );
  await expect(page.locator("select[name=direction]")).toHaveValue(
    "development",
  );
  await expect(page.locator("textarea")).toHaveValue("Хочу обсудить продажи");
  if (process.env.CKB_TEST_DISABLED_INTAKE === "1")
    await expect(
      page.getByRole("button", { name: "Отправить заявку" }),
    ).toBeDisabled();
  await page.goto(base + "/kontakty?direction=capital", {
    waitUntil: "networkidle",
  });
  await expect(page.locator("select")).toHaveValue("capital");
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator("details").first().locator("summary").click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  const valid = {
    name: "Тест проверки",
    contact: "@test_person",
    direction: "development",
    consent: true,
    page: "/kontakty",
  };
  const cases = [
    [{ ...valid, consent: false }, {}, 400],
    [valid, { Origin: "https://untrusted.example" }, 403],
  ];
  // Valid requests only in an explicitly disabled local intake: never test delivery on a live site.
  if (process.env.CKB_TEST_DISABLED_INTAKE === "1")
    cases.push([valid, { Origin: new URL(base).origin }, 503]);
  for (const [data, headers, status] of cases) {
    const response = await page.request.post(base + "/api/lead", {
      headers,
      data,
    });
    assert.equal(response.status(), status, await response.text());
  }
  assert.equal((await page.goto(base + "/no-such-page")).status(), 404);
  await page.goto(base, { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  const json = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  assert.ok(JSON.parse(json)["@graph"]);
  assert.equal(
    await page.evaluate(() => document.fonts.check('16px "Manrope Variable"')),
    true,
  );
  mkdirSync("../review", { recursive: true });
  await page.screenshot({ path: "../review/mobile-first.png" });
  await page.screenshot({ path: "../review/mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "../review/desktop.png" });
  await page.screenshot({ path: "../review/home-full.png", fullPage: true });
  await page.goto(base + "/razvitie", { waitUntil: "networkidle" });
  await page.screenshot({ path: "../review/development.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    "Menu, Escape, scenario, direction, FAQ, API errors, 404, reduced motion, font and JSON-LD passed",
  );
} finally {
  await browser.close();
}
