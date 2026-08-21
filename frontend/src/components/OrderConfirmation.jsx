import { useEffect, useState } from "react";
import { RESTAURANT_PHONE_DISPLAY, RESTAURANT_PHONE_TEL } from "../data/contact";

const READY_IN_SECONDS = 15 * 60;

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function OrderConfirmation({ onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(READY_IN_SECONDS);

  useEffect(() => {
    const startedAt = Date.now();

    // Recomputed from actual elapsed time on every tick, rather than
    // decrementing by 1 each time - immune to drift if the browser
    // throttles timers on a backgrounded tab.
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(READY_IN_SECONDS - elapsed, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isReady = secondsLeft === 0;

  return (
    <>
      <div className="cart-header">
        <h3>Order Sent!</h3>
        <button className="cart-close" onClick={onClose} aria-label="Close cart">
          ×
        </button>
      </div>

      <p className="cart-empty">Thanks! Your order has been emailed to Wok Fusion.</p>

      <div className="order-countdown" role="timer" aria-live="polite">
        <span className="order-countdown-label">
          {isReady ? "Should be ready now!" : "Estimated ready in"}
        </span>
        {!isReady && (
          <span className="order-countdown-time" data-testid="order-countdown">
            {formatCountdown(secondsLeft)}
          </span>
        )}
      </div>

      <p className="cart-note">
        Running late, or need an update? Call us on{" "}
        <a href={`tel:${RESTAURANT_PHONE_TEL}`}>{RESTAURANT_PHONE_DISPLAY}</a>.
      </p>
    </>
  );
}
