import nodemailer from "nodemailer";

const PAYMENT_LABELS = {
  cash: "Cash on collection",
  card: "Card on collection",
};

// Pure and easy to unit-test: takes an order, returns the email content.
// No side effects, no persistence - nothing here writes the customer's
// details anywhere. The email itself (in the restaurant's inbox) is the
// only record that ends up existing.
export function buildOrderEmail({ customer, items, subtotal }) {
  const itemLines = items.map((item) => `${item.quantity}x ${item.name} - ${item.price}`);
  const paymentLabel = PAYMENT_LABELS[customer.paymentMethod] ?? customer.paymentMethod;

  const subject = `New Wok Fusion order - ${paymentLabel}`;

  const text = [
    "New order from the website:",
    "",
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    `Payment: ${paymentLabel}`,
    "",
    "Order:",
    ...itemLines,
    "",
    `Subtotal: £${Number(subtotal).toFixed(2)}`,
  ].join("\n");

  return { subject, text };
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// transporter is injectable so tests can pass a nodemailer jsonTransport
// instead of hitting a real SMTP server / sending a real email.
export async function sendOrderEmail(order, transporter = createTransporter()) {
  const { subject, text } = buildOrderEmail(order);

  return transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.RESTAURANT_EMAIL,
    subject,
    text,
  });
}
