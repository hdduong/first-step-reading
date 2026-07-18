import { test } from "@playwright/test";

// Captures screenshots of the key screens into ui-screenshots/, which CI uploads
// as an artifact on every run — so each PR has a visual of the UI to download.
// This sandbox has no browser, so these only render in CI (GitHub's runners).
const SHOTS = "ui-screenshots";

test.beforeEach(async ({ page }) => {
  // Keep the live TTS probe deterministic (same as app.spec.js).
  await page.route("**/api/health", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ status: "ok", tts: false }),
    }),
  );
});

test("home — Words tab", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Pop out Cat" }).waitFor();
  await page.screenshot({ path: `${SHOTS}/01-words.png`, fullPage: true });
});

test("Letter Sounds tab", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Letter Sounds" }).click();
  await page.locator('[data-letter-sound="a"]').waitFor();
  await page.screenshot({ path: `${SHOTS}/01-letter-sounds.png`, fullPage: true });
});

test("Letter sound video", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Letter Sounds" }).click();
  await page
    .locator('[data-letter-sound="a"]')
    .getByRole("button", { name: "Video" })
    .click();
  await page.getByRole("dialog", { name: "A letter sound video" }).waitFor();
  await page.screenshot({ path: `${SHOTS}/02-letter-sound-video.png` });
});

test("word popped out", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Pop out Cat" }).click();
  await page.getByRole("dialog", { name: "Cat" }).waitFor();
  await page.screenshot({ path: `${SHOTS}/02-popout.png` });
});

test("Sight Words tab", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Sight Words" }).click();
  await page.getByText(/Sight words for pages/i).waitFor();
  await page.screenshot({ path: `${SHOTS}/03-sight.png`, fullPage: true });
});

test("Read It tab", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Read It" }).click();
  await page.getByText(/tap any word/i).waitFor();
  await page.screenshot({ path: `${SHOTS}/04-read.png`, fullPage: true });
});

test("Game tab", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Game" }).click();
  await page.getByText(/Listen and find/i).waitFor();
  await page.screenshot({ path: `${SHOTS}/05-game.png`, fullPage: true });
});

test("mobile — Words tab", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Pop out Cat" }).waitFor();
  await page.screenshot({ path: `${SHOTS}/06-mobile-words.png`, fullPage: true });
});

test("mobile — Letter Sounds tab", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Letter Sounds" }).click();
  await page.locator('[data-letter-sound="a"]').waitFor();
  await page.screenshot({
    path: `${SHOTS}/06-mobile-letter-sounds.png`,
    fullPage: true,
  });
});

test("Privacy page", async ({ page }) => {
  await page.goto("/privacy", { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Privacy Policy" }).waitFor();
  await page.screenshot({ path: `${SHOTS}/07-privacy.png`, fullPage: true });
});

test("Copyright page", async ({ page }) => {
  await page.goto("/copyright", { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Copyright Notice" }).waitFor();
  await page.screenshot({ path: `${SHOTS}/08-copyright.png`, fullPage: true });
});
