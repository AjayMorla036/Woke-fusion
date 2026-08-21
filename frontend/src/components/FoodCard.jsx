export default function FoodCard({ name, price, description, image, isPopular }) {
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
        <button className="food-btn">Add to Order</button>
      </div>
    </div>
  );
}