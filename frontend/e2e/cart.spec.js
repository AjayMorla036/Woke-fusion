// Functional / E2E tests for the cart drawer and WhatsApp order handoff
// (Phase 2 of the roadmap: make "Add to Order" actually do something).

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

  test('shows an approximate-pricing note when a "From" priced item is in the cart', async ({
    page,
  }) => {
    await page.goto("/");

    await addItemByName(page, "Custom Bento Box");
    await page.getByRole("button", { name: "View your order" }).click();

    await expect(page.getByText(/may vary based on your Bento Box choices/)).toBeVisible();
  });

  test("Order via WhatsApp link is correctly formed with the order details", async ({ page }) => {
    await page.goto("/");

    await addItemByName(page, "Butter Chicken");
    await page.getByRole("button", { name: "View your order" }).click();

    const whatsAppLink = page.getByRole("link", { name: "Order via WhatsApp" });
    const href = await whatsAppLink.getAttribute("href");

    expect(href.startsWith("https://wa.me/447741033746?text=")).toBe(true);

    const encodedMessage = href.split("?text=")[1];
    const message = decodeURIComponent(encodedMessage);

    expect(message).toContain("1x Butter Chicken - £10.95");
    expect(message).toContain("Subtotal: £10.95");
  });

  test("closing the drawer via the × button hides it again", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "View your order" }).click();
    await page.getByRole("button", { name: "Close cart" }).click();

    await expect(page.locator(".cart-drawer")).not.toBeVisible();
  });
});
