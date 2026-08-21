import { useState } from "react";
import { formatGBP } from "../utils/price";
import {
  BENTO_SIZES,
  BENTO_BASES,
  BENTO_PROTEINS,
  BENTO_SAUCES,
  BENTO_DRY_ITEMS,
} from "../data/bentoBoxOptions";

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function BentoBoxConfigurator({ baseId, baseName, onClose, onAdd }) {
  const [size, setSize] = useState(BENTO_SIZES[0]);
  const [base, setBase] = useState(BENTO_BASES[0]);
  const [protein, setProtein] = useState(BENTO_PROTEINS[0]);
  const [sauce, setSauce] = useState(BENTO_SAUCES[0]);
  const [dryItem, setDryItem] = useState(BENTO_DRY_ITEMS[0]);

  const priceLabel = formatGBP(size.price);
  const configuredName = `${baseName} (${size.label}, ${base}, ${protein}, ${sauce.label} Sauce, ${dryItem})`;
  const cartItemId = `bento-${baseId}-${[size.key, base, protein, sauce.key, dryItem]
    .map(slugify)
    .join("-")}`;

  function handleAdd() {
    onAdd({ id: cartItemId, name: configuredName, price: priceLabel, priceValue: size.price });
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="bento-configurator" onClick={(event) => event.stopPropagation()}>
        <div className="cart-header">
          <h3>Build Your Bento Box</h3>
          <button className="cart-close" onClick={onClose} aria-label="Close customizer">
            ×
          </button>
        </div>

        <div className="bento-field">
          <span className="bento-label">Size</span>
          <div className="bento-options" role="group" aria-label="Size">
            {BENTO_SIZES.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`bento-option${size.key === option.key ? " selected" : ""}`}
                aria-pressed={size.key === option.key}
                onClick={() => setSize(option)}
              >
                {option.label} - {formatGBP(option.price)}
              </button>
            ))}
          </div>
        </div>

        <div className="bento-field">
          <label htmlFor="bento-base">Base</label>
          <select id="bento-base" value={base} onChange={(event) => setBase(event.target.value)}>
            {BENTO_BASES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="bento-field">
          <label htmlFor="bento-protein">Protein</label>
          <select
            id="bento-protein"
            value={protein}
            onChange={(event) => setProtein(event.target.value)}
          >
            {BENTO_PROTEINS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="bento-field">
          <span className="bento-label">Sauce</span>
          <div className="bento-options" role="group" aria-label="Sauce">
            {BENTO_SAUCES.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`bento-option${sauce.key === option.key ? " selected" : ""}`}
                aria-pressed={sauce.key === option.key}
                onClick={() => setSauce(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bento-field">
          <label htmlFor="bento-dry-item">Dry Item (2 included)</label>
          <select
            id="bento-dry-item"
            value={dryItem}
            onChange={(event) => setDryItem(event.target.value)}
          >
            {BENTO_DRY_ITEMS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="cart-subtotal">
          <span>Price</span>
          <span>{priceLabel}</span>
        </div>

        <button type="button" className="btn btn-primary cart-checkout" onClick={handleAdd}>
          Add to Order
        </button>
      </div>
    </div>
  );
}
