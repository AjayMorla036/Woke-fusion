// Tests for the post-order confirmation: the 15-minute pickup countdown
// and the tap-to-call restaurant number. Uses Playwright's clock API to
// fast-forward time deterministically instead of waiting on a real timer.

import { test, expect } from "@playwright/test";

async function placeAnOrder(page) {
  await page.route("**/order", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
  );

  await page.goto("/");
  await page
    .locator(".food-card", { hasText: "Butter Chicken" })
    .getByRole("button", { name: "Add to Order" })
    .click();
  await page.getByRole("button", { name: "View your order" }).click();
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();

  await page.getByLabel("Name").fill("Jamie Smith");
  await page.getByLabel("Email").fill("jamie@example.com");
  await page.getByLabel("Phone number").fill("+44 7741 033746");
  await page.getByLabel("Address").fill("1 High Street, London");
  await page.getByRole("button", { name: "Cash on collection" }).click();
  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByRole("heading", { name: "Order Sent!" })).toBeVisible();
}

test.describe("Order confirmation - pickup countdown", () => {
  test("starts at 15:00 and shows a tap-to-call number for the restaurant", async ({ page }) => {
    await page.clock.install();
    await placeAnOrder(page);

    await expect(page.getByTestId("order-countdown")).toHaveText("15:00");

    const callLink = page.getByRole("link", { name: "+44 7741 033746" });
    await expect(callLink).toHaveAttribute("href", "tel:+447741033746");
  });

  test("counts down as time passes", async ({ page }) => {
    await page.clock.install();
    await placeAnOrder(page);

    await page.clock.fastForward(65_000); // 1 minute 5 seconds
    await expect(page.getByTestId("order-countdown")).toHaveText("13:55");
  });

  test("switches to a ready message once 15 minutes have elapsed", async ({ page }) => {
    await page.clock.install();
    await placeAnOrder(page);

    await page.clock.fastForward(15 * 60 * 1000);

    await expect(page.getByText("Should be ready now!")).toBeVisible();
    await expect(page.getByTestId("order-countdown")).toHaveCount(0);
  });
});
