// Functional / content test: the hero section is the first thing every
// visitor sees, so its copy and primary call-to-action must be correct.

import { test, expect } from "@playwright/test";

test.describe("Hero section", () => {
  test("shows the tagline, title, description and a single primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Master of the Wok")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fiery Indo-Chinese Flavors" })).toBeVisible();
    await expect(page.getByText(/authentic taste of street-style Indo-Chinese cuisine/)).toBeVisible();

    const cta = page.getByRole("link", { name: "Explore Menu" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "#menu");
  });

  test("Explore Menu CTA scrolls the menu section into view", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Explore Menu" }).click();

    await expect(page.locator("#menu")).toBeInViewport();
    await expect(page.getByRole("heading", { name: "A Fusion of Flavors" })).toBeInViewport();
  });

  test("hero background image loads successfully", async ({ page }) => {
    await page.goto("/");

    const heroImage = page.locator(".hero-bg img");
    await expect(heroImage).toBeVisible();

    const naturalWidth = await heroImage.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});
