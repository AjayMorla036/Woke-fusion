export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="/images/hero-wok-cooking.jpg" alt="Wok Cooking" />
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <span className="hero-tagline">Master of the Wok</span>
        <h1 className="hero-title">Fiery Indo-Chinese Flavors</h1>
        <p className="hero-desc">
          Experience the authentic taste of street-style Indo-Chinese cuisine.
          Fresh ingredients, traditional spices, and the intense heat of the wok,
          brought together to create unforgettable dishes.
        </p>
        <div className="hero-actions">
          <a href="#menu" className="btn btn-primary">Explore Menu</a>
        </div>
      </div>
    </section>
  );
}  