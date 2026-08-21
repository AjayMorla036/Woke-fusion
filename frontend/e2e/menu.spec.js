// Content / functional / regression tests for the menu section - the core
// of the site. Includes a dedicated price-formatting check, since that's
// exactly the kind of thing a mocked or shallow smoke test would miss.

import { test, expect } from "@playwright/test";

const CATEGORY_TITLES = [
  "1. BENTO BOX (Build Your Meal)",
  "2. INDIAN CURRIES",
  "3. KOTHU & GORENG",
  "4. NOODLES & RICE",
  "5. WOK WINGS 🍗",
  "6. SIDES, WRAPS & EXTRAS",
  "7. DESSERTS 🍰",
  "8. DRINKS 🥤",
];

const TOTAL_MENU_ITEMS = 23;
const TOTAL_POPULAR_ITEMS = 10;

test.describe("Menu section", () => {
  test("shows the Take Out Only badge and all 8 category headings", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Take Out Only")).toBeVisible();

    for (const title of CATEGORY_TITLES) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test(`renders exactly ${TOTAL_MENU_ITEMS} food cards across all categories`, async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".food-card")).toHaveCount(TOTAL_MENU_ITEMS);
  });

  test(`marks exactly ${TOTAL_POPULAR_ITEMS} items as Popular`, async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".food-badge", { hasText: "Popular" })).toHaveCount(
      TOTAL_POPULAR_ITEMS
    );
  });

  test("every food card has a name, a price, a description and an image with alt text", async ({
    page,
  }) => {
    await page.goto("/");

    const cards = page.locator(".food-card");
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      await expect(card.locator(".food-name")).not.toBeEmpty();
      await expect(card.locator(".food-price")).not.toBeEmpty();
      await expect(card.locator(".food-desc")).not.toBeEmpty();

      const alt = await card.locator(".food-img").getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });

  test("every displayed price uses a single, correct currency symbol", async ({ page }) => {
    await page.goto("/");

    const priceTexts = await page.locator(".food-price").allTextContents();
    expect(priceTexts.length).toBe(TOTAL_MENU_ITEMS);

    for (const price of priceTexts) {
      // Menu prices are in GBP (e.g. "£10.95" or "From £8.95"). If this
      // fails, the price is rendering with a stray "$" in front of the
      // "£" (FoodCard.jsx hardcodes a "$" prefix on top of a price string
      // that already includes its own currency symbol).
      expect(price).toMatch(/£\d+\.\d{2}$/);
      expect(price).not.toContain("$");
    }
  });

  test("Butter Chicken shows its exact expected price", async ({ page }) => {
    await page.goto("/");

    const card = page.locator(".food-card", { hasText: "Butter Chicken" });
    await expect(card.locator(".food-price")).toHaveText("£10.95");
  });
});
