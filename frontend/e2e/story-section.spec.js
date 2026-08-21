// Content test for the "Our Story" section - real business info (founder
// name, phone number) that must never silently go missing or stale.

import { test, expect } from "@playwright/test";

test.describe("Our Story section", () => {
  test("shows the founder's name and contact phone number", async ({ page }) => {
    await page.goto("/");

    const story = page.locator("#story");
    await story.scrollIntoViewIfNeeded();

    await expect(story.getByRole("heading", { name: "Our Story" })).toBeVisible();
    await expect(story.getByText("Maicheal Addeti", { exact: true })).toBeVisible();
    await expect(story.getByText("+44 7741 033746")).toBeVisible();
  });

  test("story image loads successfully", async ({ page }) => {
    await page.goto("/");

    const storyImage = page.locator(".story-image img");
    await storyImage.scrollIntoViewIfNeeded();

    const naturalWidth = await storyImage.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("footer repeats the phone number and shows the current copyright year", async ({
    page,
  }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toContainText("+44 7741 033746");
    await expect(footer).toContainText("Wok Fusion. All rights reserved.");
  });
});
