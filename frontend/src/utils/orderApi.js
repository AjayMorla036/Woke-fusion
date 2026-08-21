const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Sends the order to the backend, which emails it to the restaurant.
// Throws with a user-facing message on any failure (validation error
// from the server, network error, or a failed send on the server side).
export async function submitOrder(order) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.errors?.join(" ") || "Could not place the order. Please try again.");
  }

  return body;
}
