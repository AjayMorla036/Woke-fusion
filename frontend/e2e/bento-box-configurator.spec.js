// Functional / E2E tests for the Custom Bento Box configurator.
//
// Note on pricing in these tests: Value/£8.95, Regular/£10.95 and
// Large/£12.95 are the placeholder size tiers defined in
// src/data/bentoBoxOptions.js - see that file's comment for why they're
// placeholders and what needs confirming with the business before launch.

import { test, expect } from "@playwright/test";

async function openConfigurator(page) {
  await page
    .locator(".food-card", { hasText: "Custom Bento Box" })
    .getByRole("button", { name: "Customize & Add" })
    .click();
}

test.describe("Bento Box configurator", () => {
  test("opens with Value size selected by default, priced at £8.95", async ({ page }) => {
    await page.goto("/");
    await openConfigurator(page);

    await expect(page.getByRole("heading", { name: "Build Your Bento Box" })).toBeVisible();

    const valueButton = page.getByRole("button", { name: "Value - £8.95" });
    await expect(valueButton).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".bento-configurator .cart-subtotal")).toContainText("£8.95");
  });

  test("selecting a different size updates the displayed price", async ({ page }) => {
    await page.goto("/");
    await openConfigurator(page);

    await page.getByRole("button", { name: "Large - £12.95" }).click();

    await expect(page.getByRole("button", { name: "Large - £12.95" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(page.getByRole("button", { name: "Value - £8.95" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    await expect(page.locator(".bento-configurator .cart-subtotal")).toContainText("£12.95");
  });

  test("adding a configured box puts a descriptive line item in the cart at the selected size price", async ({
    page,
  }) => {
    await page.goto("/");
    await openConfigurator(page);

    await page.getByRole("button", { name: "Regular - £10.95" }).click();
    await page.getByLabel("Base").selectOption("Hakka Noodles");
    await page.getByLabel("Protein").selectOption("Chicken");
    await page.getByRole("button", { name: "Indian Style" }).click();
    await page.getByLabel("Dry Item (2 included)").selectOption("Chicken Spring Rolls");

    await page.locator(".bento-configurator").getByRole("button", { name: "Add to Order" }).click();

    // The configurator closes and the order is reflected in the cart badge.
    await expect(page.locator(".bento-configurator")).not.toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    await page.getByRole("button", { name: "View your order" }).click();

    const cartItem = page.locator(".cart-item", { hasText: "Custom Bento Box" });
    await expect(cartItem).toContainText("Regular");
    await expect(cartItem).toContainText("Hakka Noodles");
    await expect(cartItem).toContainText("Chicken");
    await expect(cartItem).toContainText("Indian Style Sauce");
    await expect(cartItem).toContainText("Chicken Spring Rolls");
    await expect(cartItem.locator(".cart-item-price")).toHaveText("£10.95");
  });

  test("two differently-configured boxes appear as two separate cart lines", async ({ page }) => {
    await page.goto("/");

    await openConfigurator(page);
    await page.getByRole("button", { name: "Value - £8.95" }).click();
    await page.locator(".bento-configurator").getByRole("button", { name: "Add to Order" }).click();

    await openConfigurator(page);
    await page.getByRole("button", { name: "Large - £12.95" }).click();
    await page.getByLabel("Protein").selectOption("Prawns");
    await page.locator(".bento-configurator").getByRole("button", { name: "Add to Order" }).click();

    await expect(page.getByTestId("cart-count")).toHaveText("2");

    await page.getByRole("button", { name: "View your order" }).click();
    await expect(page.locator(".cart-item")).toHaveCount(2);
    await expect(page.locator(".cart-subtotal")).toContainText("£21.90"); // £8.95 + £12.95
  });

  test("closing the configurator without adding leaves the cart untouched", async ({ page }) => {
    await page.goto("/");
    await openConfigurator(page);

    await page.getByRole("button", { name: "Close customizer" }).click();

    await expect(page.locator(".bento-configurator")).not.toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("0");
  });
});
