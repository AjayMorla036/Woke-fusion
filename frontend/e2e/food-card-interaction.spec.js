// Functional test for the one interactive element on every food card.
//
// "Add to Order" currently has no onClick handler at all - there is no
// cart/order state anywhere in the app (confirmed: no useState in src/).
// That's a real functional gap given the site's whole purpose is to let
// customers order food, so it's covered here two ways:
//   1. A real test for what exists today (the button renders correctly).
//   2. A test.fixme() for the behavior that SHOULD exist once ordering
//      is implemented (Phase 2 of the roadmap) - this is the "should
//      exist but is blocked" case, not a false failure.

import { test, expect } from "@playwright/test";

test.describe("Food card - Add to Order", () => {
  test("every food card renders an enabled Add to Order button", async ({ page }) => {
    await page.goto("/");

    const buttons = page.getByRole("button", { name: "Add to Order" });
    await expect(buttons).toHaveCount(23);

    await expect(buttons.first()).toBeEnabled();
  });

  test.fixme(
    "clicking Add to Order adds the item to a visible cart/order summary",
    async ({ page }) => {
      // Blocked: no cart state, cart indicator, or order summary exists
      // yet anywhere in the app. This defines the contract the Phase 2
      // "make ordering work" feature needs to satisfy - once a cart
      // indicator exists, replace the selector below with the real one.
      await page.goto("/");

      const firstCard = page.locator(".food-card").first();
      await firstCard.getByRole("button", { name: "Add to Order" }).click();

      await expect(page.getByTestId("cart-count")).toHaveText("1");
    }
  );
});
