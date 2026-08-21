import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../server.js";

async function startServer(options) {
  const app = createApp(options);
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

function validOrderPayload() {
  return {
    customer: {
      name: "Jamie Smith",
      email: "jamie@example.com",
      phone: "+447741033746",
      address: "1 High Street, London",
      paymentMethod: "cash",
    },
    items: [{ name: "Butter Chicken", price: "£10.95", quantity: 1 }],
    subtotal: 10.95,
  };
}

test("GET / returns a health message", async () => {
  const { server, baseUrl } = await startServer();
  try {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.match(body.message, /Wok Fusion/);
  } finally {
    server.close();
  }
});

test("POST /order rejects an invalid payload with 400 and field errors", async () => {
  const { server, baseUrl } = await startServer();
  try {
    const response = await fetch(`${baseUrl}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: {}, items: [] }),
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.ok(Array.isArray(body.errors) && body.errors.length > 0);
  } finally {
    server.close();
  }
});

test("POST /order sends the exact order to the mailer and returns 200", async () => {
  let received = null;
  const sendOrderEmail = async (order) => {
    received = order;
  };

  const { server, baseUrl } = await startServer({ sendOrderEmail });
  try {
    const payload = validOrderPayload();
    const response = await fetch(`${baseUrl}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    assert.equal(response.status, 200);
    assert.deepEqual(received, payload);
  } finally {
    server.close();
  }
});

test("POST /order returns a generic 502 (no internal detail) when sending fails", async () => {
  const sendOrderEmail = async () => {
    throw new Error("SMTP connection refused: super secret internal detail");
  };

  const { server, baseUrl } = await startServer({ sendOrderEmail });
  try {
    const response = await fetch(`${baseUrl}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validOrderPayload()),
    });

    assert.equal(response.status, 502);
    const body = await response.json();
    assert.ok(!JSON.stringify(body).includes("SMTP connection refused"));
  } finally {
    server.close();
  }
});

test("a failed send never logs the customer's personal details to the console", async () => {
  const sendOrderEmail = async () => {
    throw new Error("send failed");
  };

  const originalError = console.error;
  const loggedMessages = [];
  console.error = (...args) => loggedMessages.push(args.join(" "));

  const { server, baseUrl } = await startServer({ sendOrderEmail });
  try {
    const payload = validOrderPayload();
    await fetch(`${baseUrl}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const loggedText = loggedMessages.join(" ");
    assert.ok(!loggedText.includes(payload.customer.name));
    assert.ok(!loggedText.includes(payload.customer.email));
    assert.ok(!loggedText.includes(payload.customer.phone));
    assert.ok(!loggedText.includes(payload.customer.address));
  } finally {
    console.error = originalError;
    server.close();
  }
});
