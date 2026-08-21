import { test } from "node:test";
import assert from "node:assert/strict";
import { validateOrder } from "../validateOrder.js";

function validOrder(overrides = {}) {
  return {
    customer: {
      name: "Jamie Smith",
      email: "jamie@example.com",
      phone: "+447741033746",
      address: "1 High Street, London",
      paymentMethod: "cash",
      ...overrides.customer,
    },
    items: overrides.items ?? [{ name: "Butter Chicken", price: "£10.95", quantity: 1 }],
    subtotal: overrides.subtotal ?? 10.95,
  };
}

test("accepts a fully valid order", () => {
  const result = validateOrder(validOrder());
  assert.deepEqual(result, { valid: true, errors: [] });
});

test("rejects a missing name", () => {
  const result = validateOrder(validOrder({ customer: { name: "  " } }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Name is required."));
});

test("rejects a malformed email", () => {
  const result = validateOrder(validOrder({ customer: { email: "not-an-email" } }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("A valid email is required."));
});

test("accepts a phone number with spaces and a leading +", () => {
  const result = validateOrder(validOrder({ customer: { phone: "+44 7741 033746" } }));
  assert.equal(result.valid, true);
});

test("rejects a phone number that's too short", () => {
  const result = validateOrder(validOrder({ customer: { phone: "12345" } }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("A valid phone number is required."));
});

test("rejects an invalid payment method", () => {
  const result = validateOrder(validOrder({ customer: { paymentMethod: "bitcoin" } }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("Payment method")));
});

test("rejects an empty cart", () => {
  const result = validateOrder(validOrder({ items: [] }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Order must contain at least one item."));
});

test("rejects an item with a zero quantity", () => {
  const result = validateOrder(
    validOrder({ items: [{ name: "Butter Chicken", price: "£10.95", quantity: 0 }] })
  );
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("positive quantity")));
});

test("reports every failing field at once, not just the first", () => {
  const result = validateOrder({ customer: {}, items: [] });
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 6);
});
