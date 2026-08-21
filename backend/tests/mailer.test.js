import { test } from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { buildOrderEmail, sendOrderEmail } from "../mailer.js";

const SAMPLE_ORDER = {
  customer: {
    name: "Jamie Smith",
    email: "jamie@example.com",
    phone: "+447741033746",
    address: "1 High Street, London",
    paymentMethod: "cash",
  },
  items: [
    { name: "Butter Chicken", price: "£10.95", quantity: 2 },
    { name: "Custom Bento Box (Value, Hakka Noodles, Chicken, Chinese Style Sauce, Veg Spring Rolls)", price: "£8.95", quantity: 1 },
  ],
  subtotal: 30.85,
};

test("buildOrderEmail includes every customer field and every item line", () => {
  const { subject, text } = buildOrderEmail(SAMPLE_ORDER);

  assert.match(subject, /Cash on collection/);
  assert.match(text, /Jamie Smith/);
  assert.match(text, /jamie@example\.com/);
  assert.match(text, /\+447741033746/);
  assert.match(text, /1 High Street, London/);
  assert.match(text, /Cash on collection/);
  assert.match(text, /2x Butter Chicken - £10\.95/);
  assert.match(text, /1x Custom Bento Box \(Value, Hakka Noodles, Chicken, Chinese Style Sauce, Veg Spring Rolls\) - £8\.95/);
  assert.match(text, /Subtotal: £30\.85/);
});

test("buildOrderEmail labels card payments correctly", () => {
  const { subject, text } = buildOrderEmail({
    ...SAMPLE_ORDER,
    customer: { ...SAMPLE_ORDER.customer, paymentMethod: "card" },
  });

  assert.match(subject, /Card on collection/);
  assert.match(text, /Payment: Card on collection/);
});

test("sendOrderEmail sends to RESTAURANT_EMAIL via the given transporter, with no leftover state", async () => {
  process.env.RESTAURANT_EMAIL = "morlaajay38@gmail.com";
  process.env.FROM_EMAIL = "orders@wokfusion.example";

  const transporter = nodemailer.createTransport({ jsonTransport: true });
  const info = await sendOrderEmail(SAMPLE_ORDER, transporter);

  const sentMessage = JSON.parse(info.message);
  assert.equal(sentMessage.to[0].address, "morlaajay38@gmail.com");
  assert.equal(sentMessage.from.address, "orders@wokfusion.example");
  assert.match(sentMessage.subject, /Cash on collection/);
  assert.match(sentMessage.text, /Jamie Smith/);
});
