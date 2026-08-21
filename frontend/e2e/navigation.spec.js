// Functional / E2E test: every nav link should actually take the visitor
// somewhere real. This is also where a dead link (a nav item pointing at
// a section that doesn't exist) would show up.

import { test, expect } from "@playwright/test";

test.describe("Navbar navigation", () => {
  test("shows the brand and all four nav links", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator(".nav-links");
    await expect(page.locator(".navbar .logo")).toBeVisible();
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Menu" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Our Story" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("Menu link scrolls to the menu section", async ({ page }) => {
    await page.goto("/");

    await page.locator(".nav-links").getByRole("link", { name: "Menu" }).click();
    await expect(page.locator("#menu")).toBeInViewport();
  });

  test("Our Story link scrolls to the story section", async ({ page }) => {
    await page.goto("/");

    await page.locator(".nav-links").getByRole("link", { name: "Our Story" }).click();
    await expect(page.locator("#story")).toBeInViewport();
  });

  test("Contact link points at a section that actually exists on the page", async ({ page }) => {
    await page.goto("/");

    const contactLink = page.locator(".nav-links").getByRole("link", { name: "Contact" });
    const href = await contactLink.getAttribute("href");
    expect(href).toBe("#contact");

    // If this fails, the Contact nav link is dead - there is no element
    // with id="contact" anywhere on the page for it to scroll to.
    const targetId = href.replace("#", "");
    await expect(page.locator(`#${targetId}`)).toHaveCount(1);
  });
});
