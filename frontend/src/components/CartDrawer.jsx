import { useCart } from "../context/useCart";
import { formatGBP } from "../utils/price";

// Matches the phone number already shown in the Story section and
// footer (+44 7741 033746), in the digits-only format wa.me requires.
const RESTAURANT_WHATSAPP_NUMBER = "447741033746";

function buildWhatsAppMessage(items, subtotal, hasApproximatePricing) {
  const lines = items.map((item) => `${item.quantity}x ${item.name} - ${item.price}`);

  let message = `Hi Wok Fusion! I'd like to order:\n\n${lines.join("\n")}\n\nSubtotal: ${formatGBP(subtotal)}`;

  if (hasApproximatePricing) {
    message +=
      '\n\n(One or more items are marked "From" - happy to confirm final details here.)';
  }

  return message;
}

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isOpen,
    closeCart,
    itemCount,
    subtotal,
    hasApproximatePricing,
  } = useCart();

  if (!isOpen) return null;

  const whatsAppHref = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppMessage(items, subtotal, hasApproximatePricing)
  )}`;

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="cart-header">
          <h3>Your Order ({itemCount})</h3>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty. Add something tasty from the menu!</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">{item.price}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="cart-item-remove"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{formatGBP(subtotal)}</span>
            </div>

            {hasApproximatePricing && (
              <p className="cart-note">
                Prices marked &ldquo;From&rdquo; may vary based on your Bento Box choices.
              </p>
            )}

            <a
              className="btn btn-primary cart-checkout"
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order via WhatsApp
            </a>
          </>
        )}
      </div>
    </div>
  );
}
