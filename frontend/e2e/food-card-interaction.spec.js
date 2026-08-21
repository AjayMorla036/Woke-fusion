// Functional test for the one interactive element on every food card.
// Cart behavior lives in cart.spec.js; the Bento Box's own configurator
// lives in bento-box-configurator.spec.js - this file stays focused on
// the plain "Add to Order" button that every non-configurable card has.

import { test, expect } from "@playwright/test";

const TOTAL_MENU_ITEMS = 23;
const CONFIGURABLE_ITEMS = 1; // Custom Bento Box

test.describe("Food card - Add to Order", () => {
  test(`every non-configurable food card renders an enabled Add to Order button (${
    TOTAL_MENU_ITEMS - CONFIGURABLE_ITEMS
  } of them)`, async ({ page }) => {
    await page.goto("/");

    const buttons = page.getByRole("button", { name: "Add to Order" });
    await expect(buttons).toHaveCount(TOTAL_MENU_ITEMS - CONFIGURABLE_ITEMS);

    await expect(buttons.first()).toBeEnabled();
  });

  test("the Bento Box shows Customize & Add instead of Add to Order", async ({ page }) => {
    await page.goto("/");

    const bentoCard = page.locator(".food-card", { hasText: "Custom Bento Box" });
    await expect(bentoCard.getByRole("button", { name: "Customize & Add" })).toBeVisible();
    await expect(bentoCard.getByRole("button", { name: "Add to Order" })).not.toBeVisible();
  });

  test("clicking Add to Order updates the cart badge and shows brief confirmation", async ({
    page,
  }) => {
    await page.goto("/");

    const card = page.locator(".food-card", { hasText: "Butter Chicken" });
    await card.getByRole("button", { name: "Add to Order" }).click();

    await expect(page.getByTestId("cart-count")).toHaveText("1");
    await expect(card.getByRole("button", { name: "Added ✓" })).toBeVisible();

    // The confirmation reverts back to the normal label after a moment.
    await expect(card.getByRole("button", { name: "Add to Order" })).toBeVisible({
      timeout: 3000,
    });
  });
});
