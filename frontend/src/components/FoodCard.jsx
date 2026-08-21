import { useEffect, useState } from "react";
import { useCart } from "../context/useCart";
import { parsePrice } from "../utils/price";

export default function FoodCard({ id, name, price, description, image, isPopular }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1200);
    return () => clearTimeout(timer);
  }, [justAdded]);

  function handleAddToOrder() {
    addItem({ id, name, price, priceValue: parsePrice(price) });
    setJustAdded(true);
  }

  return (
    <div className="food-card">
      <div className="food-img-wrapper">
        {isPopular && <div className="food-badge">Popular</div>}
        <img src={image} alt={name} className="food-img" />
      </div>
      <div className="food-info">
        <div className="food-header">
          <h3 className="food-name">{name}</h3>
          <span className="food-price">{price}</span>
        </div>
        <p className="food-desc">{description}</p>
        <button
          className={`food-btn${justAdded ? " food-btn-added" : ""}`}
          onClick={handleAddToOrder}
        >
          {justAdded ? "Added ✓" : "Add to Order"}
        </button>
      </div>
    </div>
  );
}
