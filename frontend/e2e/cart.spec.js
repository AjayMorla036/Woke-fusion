// Functional / E2E tests for the cart drawer itself (adding, quantities,
// removing). The checkout form and order-submission flow have their own
// dedicated file: checkout.spec.js.

import { test, expect } from "@playwright/test";

async function addItemByName(page, name) {
  await page.locator(".food-card", { hasText: name }).getByRole("button", { name: "Add to Order" }).click();
}

test.describe("Cart drawer", () => {
  test("cart badge starts at 0 and the drawer is closed by default", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("cart-count")).toHaveText("0");
    await expect(page.getByText("Your cart is empty")).not.toBeVisible();
  });

  test("opening the cart with nothing added shows the empty state", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "View your order" }).click();
    await expect(page.getByText(/Your cart is empty/)).toBeVisible();
  });

  test("adding an item shows it in the drawer with the correct price and subtotal", async ({
    page,
  }) => {
    await page.goto("/");

    await addItemByName(page, "Butter Chicken");
    await page.getByRole("button", { name: "View your order" }).click();

    const cartItem = page.locator(".cart-item", { hasText: "Butter Chicken" });
    await expect(cartItem).toBeVisible();
    await expect(cartItem.locator(".cart-item-price")).toHaveText("£10.95");
    await expect(cartItem.locator(".cart-item-qty")).toHaveText("1");

    const subtotal = page.locator(".cart-subtotal");
    await expect(subtotal).toContainText("£10.95");
  });

  test("adding the same item twice increments its quantity instead of duplicating the row", async ({
    page,
  }) => {
    await page.goto("/");

    await addItemByName(page, "Butter Chicken");
    await addItemByName(page, "Butter Chicken");

    await expect(page.getByTestId("cart-count")).toHaveText("2");

    await page.getByRole("button", { name: "View your order" }).click();
    await expect(page.locator(".cart-item", { hasText: "Butter Chicken" })).toHaveCount(1);
    await expect(page.locator(".cart-item-qty")).toHaveText("2");
    await expect(page.locator(".cart-subtotal")).toContainText("£21.90");
  });

  test("+ and - controls update quantity and subtotal, and remove deletes the line", async ({
    page,
  }) => {
    await page.goto("/");

    await addItemByName(page, "Butter Chicken");
    await page.getByRole("button", { name: "View your order" }).click();

    await page.getByRole("button", { name: "Increase quantity of Butter Chicken" }).click();
    await expect(page.locator(".cart-item-qty")).toHaveText("2");
    await expect(page.locator(".cart-subtotal")).toContainText("£21.90");

    await page.getByRole("button", { name: "Decrease quantity of Butter Chicken" }).click();
    await expect(page.locator(".cart-item-qty")).toHaveText("1");

    await page.getByRole("button", { name: "Remove Butter Chicken" }).click();
    await expect(page.getByText(/Your cart is empty/)).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("0");
  });

  test("a non-empty cart shows a Proceed to Checkout button instead of a WhatsApp link", async ({
    page,
  }) => {
    await page.goto("/");

    await addItemByName(page, "Butter Chicken");
    await page.getByRole("button", { name: "View your order" }).click();

    await expect(page.getByRole("button", { name: "Proceed to Checkout" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Order via WhatsApp" })).toHaveCount(0);
  });

  test("closing the drawer via the × button hides it again", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "View your order" }).click();
    await page.getByRole("button", { name: "Close cart" }).click();

    await expect(page.locator(".cart-drawer")).not.toBeVisible();
  });
});
