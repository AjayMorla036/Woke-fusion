import { useState } from "react";
import { submitOrder } from "../utils/orderApi";
import { formatGBP } from "../utils/price";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{7,15}$/;

function validate({ name, email, phone, address, paymentMethod }) {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required.";
  if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address.";
  if (!PHONE_RE.test(phone.replace(/[\s()-]/g, ""))) errors.phone = "Enter a valid phone number.";
  if (!address.trim()) errors.address = "Address is required.";
  if (!paymentMethod) errors.paymentMethod = "Choose how you'll pay.";

  return errors;
}

// Guest checkout only - no accounts, nothing persisted. These details
// exist only long enough to build the order email; once it's sent, the
// parent (CartDrawer) clears the cart and this form unmounts with it.
export default function CheckoutForm({ items, subtotal, onBack, onOrderPlaced }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const fieldErrors = validate({ name, email, phone, address, paymentMethod });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitOrder({
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          paymentMethod,
        },
        items: items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
      });
      onOrderPlaced();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="cart-header">
        <h3>Your Details</h3>
      </div>

      <div className="bento-field">
        <label htmlFor="checkout-name">Name</label>
        <input id="checkout-name" value={name} onChange={(event) => setName(event.target.value)} />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="bento-field">
        <label htmlFor="checkout-email">Email</label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="bento-field">
        <label htmlFor="checkout-phone">Phone number</label>
        <input
          id="checkout-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+44 7xxx xxxxxx"
        />
        {errors.phone && <span className="form-error">{errors.phone}</span>}
      </div>

      <div className="bento-field">
        <label htmlFor="checkout-address">Address</label>
        <input
          id="checkout-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        {errors.address && <span className="form-error">{errors.address}</span>}
      </div>

      <div className="bento-field">
        <span className="bento-label">Payment method</span>
        <div className="bento-options" role="radiogroup" aria-label="Payment method">
          <button
            type="button"
            className={`bento-option${paymentMethod === "cash" ? " selected" : ""}`}
            aria-pressed={paymentMethod === "cash"}
            onClick={() => setPaymentMethod("cash")}
          >
            Cash on collection
          </button>
          <button
            type="button"
            className={`bento-option${paymentMethod === "card" ? " selected" : ""}`}
            aria-pressed={paymentMethod === "card"}
            onClick={() => setPaymentMethod("card")}
          >
            Card on collection
          </button>
        </div>
        {errors.paymentMethod && <span className="form-error">{errors.paymentMethod}</span>}
      </div>

      {submitError && <p className="form-error form-error-general">{submitError}</p>}

      <div className="cart-subtotal">
        <span>Subtotal</span>
        <span>{formatGBP(subtotal)}</span>
      </div>

      <div className="checkout-actions">
        <button type="button" className="btn btn-outline" onClick={onBack} disabled={isSubmitting}>
          Back to cart
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </form>
  );
}
