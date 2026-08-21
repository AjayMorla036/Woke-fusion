// SEO / metadata test. Not glamorous, but a wrong <title> or missing
// meta description is exactly the kind of thing that ships silently and
// only gets noticed when someone shares the link and sees "frontend" in
// the browser tab and link preview.

import { test, expect } from "@playwright/test";

test.describe("Page metadata", () => {
  test("has a branded page title, not the default Vite scaffold title", async ({ page }) => {
    await page.goto("/");

    // If this fails, index.html still has the placeholder <title>frontend</title>
    // left over from `npm create vite`.
    await expect(page).toHaveTitle(/Wok Fusion/i);
  });

  test("has a meta description mentioning the restaurant", async ({ page }) => {
    await page.goto("/");

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);

    const content = await description.getAttribute("content");
    expect(content).toBeTruthy();
    expect(content.toLowerCase()).toContain("wok fusion");
  });

  test("declares a favicon", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  });
});
