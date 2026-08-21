const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{7,15}$/;
const PAYMENT_METHODS = ["cash", "card"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateOrder(payload) {
  const errors = [];
  const customer = payload?.customer ?? {};
  const items = payload?.items;

  if (!isNonEmptyString(customer.name)) {
    errors.push("Name is required.");
  }

  if (!isNonEmptyString(customer.email) || !EMAIL_RE.test(customer.email.trim())) {
    errors.push("A valid email is required.");
  }

  const digitsOnlyPhone = typeof customer.phone === "string" ? customer.phone.replace(/[\s()-]/g, "") : "";
  if (!PHONE_RE.test(digitsOnlyPhone)) {
    errors.push("A valid phone number is required.");
  }

  if (!isNonEmptyString(customer.address)) {
    errors.push("Delivery/collection address is required.");
  }

  if (!PAYMENT_METHODS.includes(customer.paymentMethod)) {
    errors.push('Payment method must be "cash" or "card".');
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Order must contain at least one item.");
  } else {
    const hasInvalidItem = items.some(
      (item) => !isNonEmptyString(item?.name) || !(Number(item?.quantity) > 0)
    );
    if (hasInvalidItem) {
      errors.push("Every order item needs a name and a positive quantity.");
    }
  }

  return { valid: errors.length === 0, errors };
}
