// Accessibility tests: a hand-written structural check (headings, alt
// text) plus an automated axe-core scan (color contrast, ARIA, landmarks,
// and everything else that's impractical to hand-check per element).

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility - structure", () => {
  test("page has exactly one <h1>", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("every <img> on the page has non-empty alt text", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `image #${i} (src: ${await images.nth(i).getAttribute("src")})`).toBeTruthy();
    }
  });

  test("nav is a real <nav> landmark and footer is a real <footer> landmark", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("nav")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
  });
});

test.describe("Accessibility - automated scan (axe-core)", () => {
  test("home page has no critical or serious WCAG violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const seriousOrWorse = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious"
    );

    if (seriousOrWorse.length > 0) {
      console.log(
        "Serious/critical accessibility violations:\n" +
          seriousOrWorse
            .map((v) => `- [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`)
            .join("\n")
      );
    }

    expect(seriousOrWorse).toEqual([]);
  });
});
