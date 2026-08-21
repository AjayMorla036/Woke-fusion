// Functional test for the one interactive element on every food card.
// Cart behavior itself (quantities, subtotal, WhatsApp handoff) lives in
// cart.spec.js - this file stays focused on the button on the card.

import { test, expect } from "@playwright/test";

test.describe("Food card - Add to Order", () => {
  test("every food card renders an enabled Add to Order button", async ({ page }) => {
    await page.goto("/");

    const buttons = page.getByRole("button", { name: "Add to Order" });
    await expect(buttons).toHaveCount(23);

    await expect(buttons.first()).toBeEnabled();
  });

  test("clicking Add to Order updates the cart badge and shows brief confirmation", async ({
    page,
  }) => {
    await page.goto("/");

    const firstCard = page.locator(".food-card").first();
    await firstCard.getByRole("button", { name: "Add to Order" }).click();

    await expect(page.getByTestId("cart-count")).toHaveText("1");
    await expect(firstCard.getByRole("button", { name: "Added ✓" })).toBeVisible();

    // The confirmation reverts back to the normal label after a moment.
    await expect(firstCard.getByRole("button", { name: "Add to Order" })).toBeVisible({
      timeout: 3000,
    });
  });
});
