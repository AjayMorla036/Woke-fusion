// Functional / E2E tests for the checkout form and order submission.
//
// The backend's POST /order is always mocked here via page.route() - an
// automated test run must never actually email the restaurant. The
// backend's own request/validation/email-building logic has its own
// test suite in backend/tests/.

import { test, expect } from "@playwright/test";

async function addItemAndOpenCheckout(page, itemName) {
  await page
    .locator(".food-card", { hasText: itemName })
    .getByRole("button", { name: "Add to Order" })
    .click();
  await page.getByRole("button", { name: "View your order" }).click();
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
}

async function fillValidDetails(page) {
  await page.getByLabel("Name").fill("Jamie Smith");
  await page.getByLabel("Email").fill("jamie@example.com");
  await page.getByLabel("Phone number").fill("+44 7741 033746");
  await page.getByLabel("Address").fill("1 High Street, London");
  await page.getByRole("button", { name: "Cash on collection" }).click();
}

test.describe("Checkout form", () => {
  test("submitting with everything empty shows an error per field and never hits the server", async ({
    page,
  }) => {
    let orderRequested = false;
    await page.route("**/order", (route) => {
      orderRequested = true;
      route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });

    await page.goto("/");
    await addItemAndOpenCheckout(page, "Butter Chicken");

    await page.getByRole("button", { name: "Place Order" }).click();

    await expect(page.getByText("Name is required.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Enter a valid phone number.")).toBeVisible();
    await expect(page.getByText("Address is required.")).toBeVisible();
    await expect(page.getByText("Choose how you'll pay.")).toBeVisible();

    expect(orderRequested).toBe(false);
  });

  test("Back to cart returns to the item list without submitting", async ({ page }) => {
    await page.goto("/");
    await addItemAndOpenCheckout(page, "Butter Chicken");

    await page.getByRole("button", { name: "Back to cart" }).click();

    await expect(page.getByRole("heading", { name: /Your Order/ })).toBeVisible();
    await expect(page.locator(".cart-item", { hasText: "Butter Chicken" })).toBeVisible();
  });

  test("a valid submission sends the correct payload, shows confirmation, and clears the cart", async ({
    page,
  }) => {
    let capturedBody = null;
    await page.route("**/order", (route) => {
      capturedBody = route.request().postDataJSON();
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Order sent to the restaurant." }),
      });
    });

    await page.goto("/");
    await addItemAndOpenCheckout(page, "Butter Chicken");
    await fillValidDetails(page);
    await page.getByRole("button", { name: "Place Order" }).click();

    await expect(page.getByRole("heading", { name: "Order Sent!" })).toBeVisible();
    await expect(page.getByText(/emailed to Wok Fusion/)).toBeVisible();

    expect(capturedBody).toMatchObject({
      customer: {
        name: "Jamie Smith",
        email: "jamie@example.com",
        phone: "+44 7741 033746",
        address: "1 High Street, London",
        paymentMethod: "cash",
      },
      items: [{ name: "Butter Chicken", price: "£10.95", quantity: 1 }],
      subtotal: 10.95,
    });

    // Closing the confirmation and reopening the cart shows it's empty -
    // the order (and the customer's details along with it) is gone.
    await page.getByRole("button", { name: "Close cart" }).click();
    await expect(page.getByTestId("cart-count")).toHaveText("0");
  });

  test("a failed submission shows the server's error and keeps the cart intact to retry", async ({
    page,
  }) => {
    await page.route("**/order", (route) => {
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          errors: ["Could not send the order right now. Please try again or call the restaurant directly."],
        }),
      });
    });

    await page.goto("/");
    await addItemAndOpenCheckout(page, "Butter Chicken");
    await fillValidDetails(page);
    await page.getByRole("button", { name: "Place Order" }).click();

    await expect(page.getByText(/Could not send the order right now/)).toBeVisible();
    // Still on the form, cart untouched - nothing was cleared on failure.
    await expect(page.getByRole("button", { name: "Place Order" })).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });

  test("an invalid phone number is rejected client-side before any request is made", async ({
    page,
  }) => {
    let orderRequested = false;
    await page.route("**/order", (route) => {
      orderRequested = true;
      route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });

    await page.goto("/");
    await addItemAndOpenCheckout(page, "Butter Chicken");

    await page.getByLabel("Name").fill("Jamie Smith");
    await page.getByLabel("Email").fill("jamie@example.com");
    await page.getByLabel("Phone number").fill("123");
    await page.getByLabel("Address").fill("1 High Street, London");
    await page.getByRole("button", { name: "Cash on collection" }).click();
    await page.getByRole("button", { name: "Place Order" }).click();

    await expect(page.getByText("Enter a valid phone number.")).toBeVisible();
    expect(orderRequested).toBe(false);
  });
});
