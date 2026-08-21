import { useState } from "react";
import { useCart } from "../context/useCart";
import { formatGBP } from "../utils/price";
import CheckoutForm from "./CheckoutForm";
import OrderConfirmation from "./OrderConfirmation";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, closeCart, itemCount, subtotal, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  function handleClose() {
    closeCart();
    setIsCheckingOut(false);
    setOrderConfirmed(false);
  }

  function handleOrderPlaced() {
    clearCart();
    setIsCheckingOut(false);
    setOrderConfirmed(true);
  }

  return (
    <div className="cart-overlay" onClick={handleClose}>
      <div className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        {orderConfirmed ? (
          <OrderConfirmation onClose={handleClose} />
        ) : isCheckingOut ? (
          <CheckoutForm
            items={items}
            subtotal={subtotal}
            onBack={() => setIsCheckingOut(false)}
            onOrderPlaced={handleOrderPlaced}
          />
        ) : (
          <>
            <div className="cart-header">
              <h3>Your Order ({itemCount})</h3>
              <button className="cart-close" onClick={handleClose} aria-label="Close cart">
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

                <button
                  type="button"
                  className="btn btn-primary cart-checkout"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
