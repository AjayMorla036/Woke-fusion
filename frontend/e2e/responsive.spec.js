// Responsive tests, run at explicit mobile widths regardless of which
// Playwright project executes them. This is where the "nav links vanish
// below 768px with no replacement" issue and any horizontal-overflow
// issues from the menu grid's 340px minimum card width would show up.

import { test, expect } from "@playwright/test";

const MOBILE_WIDTHS = [375, 390, 414]; // iPhone SE, iPhone 12/13/14, iPhone 11/XR

test.describe("Responsive layout", () => {
  for (const width of MOBILE_WIDTHS) {
    test(`no horizontal overflow at ${width}px wide`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      // A couple of px of tolerance for scrollbar/rounding quirks.
      expect(scrollWidth).toBeLessThanOrEqual(width + 2);
    });
  }

  test("nav links are hidden below 768px", async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await page.goto("/");

    // Confirms the current (intentional) CSS behavior: nav-links are
    // hidden below the 768px breakpoint.
    await expect(page.locator(".nav-links")).toBeHidden();
  });

  test("the mobile menu toggle is hidden on desktop widths", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });

  test("the hamburger toggle opens a panel with all four nav links on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();

    const panel = page.locator(".mobile-nav-panel");
    await expect(panel.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Menu" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Our Story" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Contact" })).toBeVisible();

    // The toggle itself flips to a close affordance while open.
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
  });

  test("tapping a mobile nav link scrolls to the section and closes the panel", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator(".mobile-nav-panel").getByRole("link", { name: "Our Story" }).click();

    await expect(page.locator(".mobile-nav-panel")).toHaveCount(0);
    await expect(page.locator("#story")).toBeInViewport();
  });

  test("hero heading and CTA remain visible on a small phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Fiery Indo-Chinese Flavors" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore Menu" })).toBeVisible();
  });

  test("food cards stack in a single column on a small phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const cards = page.locator(".food-card");
    const firstBox = await cards.nth(0).boundingBox();
    const secondBox = await cards.nth(1).boundingBox();

    // Single column means the second card is below the first, not beside it.
    expect(secondBox.y).toBeGreaterThanOrEqual(firstBox.y + firstBox.height - 2);
  });
});
