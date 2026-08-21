import { useState } from "react";
import Hero from "./components/Hero";
import FoodCard from "./components/FoodCard";
import CartDrawer from "./components/CartDrawer";
import BentoBoxConfigurator from "./components/BentoBoxConfigurator";
import { useCart } from "./context/useCart";
import { RESTAURANT_PHONE_DISPLAY } from "./data/contact";
import "./index.css";

export default function App() {
  const [configuringItem, setConfiguringItem] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuCategories = [
    {
      category: "1. BENTO BOX (Build Your Meal)",
      description: "A configurable, high-margin item. Choose Size (Value/Regular/Large), Base (Rice/Noodles/Chips), Protein, Sauce, and Dry Item. Includes 2 Spring Rolls.",
      items: [
        {
          id: 101,
          name: "Custom Bento Box",
          price: "From £8.95",
          description: "Build your perfect box. 1. Size (Value/Regular/Large) 2. Base (Egg/Veg Fried Rice, Hakka Noodles, Plain Rice, Spicy Chips) 3. Protein (Chicken, Beef, Prawns, Paneer, Soya) 4. Sauce (Chinese/Indian style) 5. Dry Item (2 Spring Rolls - choose the style).",
          image: "/bento-box.png",
          isPopular: true,
          configurable: true
        }
      ]
    },
    {
      category: "2. INDIAN CURRIES",
      description: "Core Identity Section. Served with Steamed Rice, Jeera Rice, or Naan.",
      items: [
        { id: 201, name: "Butter Chicken", price: "£10.95", description: "Rich, creamy tomato gravy with tender chicken tikka pieces.", image: "/images/butter-chicken.jpg", isPopular: true },
        { id: 202, name: "Chicken Tikka Masala", price: "£10.95", description: "Classic roasted chicken chunks in a spicy, creamy orange curry sauce.", image: "/images/chicken-tikka-masala.jpg" },
        { id: 203, name: "Mutton Rogan Josh", price: "£12.95", description: "Aromatic slow-cooked lamb curry with Kashmiri chilies.", image: "/images/mutton-rogan-josh.jpg" },
        { id: 204, name: "Paneer Butter Masala", price: "£9.95", description: "Soft paneer cubes in a rich, buttery tomato sauce. (Veg)", image: "/images/paneer-butter-masala.jpg", isPopular: true },
        { id: 205, name: "Dal Tadka", price: "£7.95", description: "Yellow lentils tempered with cumin, garlic, and chilies. (Veg)", image: "/images/dal-tadka.jpg" }
      ]
    },
    {
      category: "3. KOTHU & GORENG",
      description: "Signature Street Section - Sri Lankan Favorites",
      items: [
        { id: 301, name: "Chicken Kothu", price: "£9.50", description: "Shredded godamba roti stir-fried with chicken, egg, onion, and spices.", image: "/images/chicken-kothu.jpg", isPopular: true },
        { id: 302, name: "Mutton Kothu", price: "£10.95", description: "Classic Sri Lankan street food with tender mutton pieces.", image: "/images/chicken-kothu.jpg" },
        { id: 303, name: "Nasi Goreng (Chicken/Prawn/Beef/Veg)", price: "From £9.95", description: "Smokey aromatic stir-fried rice with spices. Served with fried egg.", image: "/images/nasi-goreng.jpg", isPopular: true }
      ]
    },
    {
      category: "4. NOODLES & RICE",
      description: "Dual Cuisine System: Chinese Style & Indian-Chinese Fusion",
      items: [
        { id: 401, name: "Hakka Noodles", price: "£8.95", description: "Classic street-style wok tossed noodles with shredded vegetables. (Chinese Style)", image: "/images/hakka-noodles.jpg" },
        { id: 402, name: "Chilli Garlic Noodles", price: "£9.50", description: "Spicy and garlicky wok-tossed noodles. (Indian-Chinese Fusion)", image: "/images/chilli-garlic-noodles.jpg", isPopular: true },
        { id: 403, name: "Triple Schezwan Rice", price: "£10.95", description: "A fiery combination of rice, noodles, and crispy fried noodles in schezwan sauce.", image: "/images/triple-schezwan-rice.jpg" }
      ]
    },
    {
      category: "5. WOK WINGS 🍗",
      description: "Crispy, Juicy, Addictive.",
      items: [
        { id: 501, name: "Salt & Pepper Wings", price: "£6.50", description: "Crispy wings tossed with sea salt, cracked pepper, and fresh chilies.", image: "/images/wok-wings.jpg", isPopular: true },
        { id: 502, name: "Teriyaki Wings", price: "£6.50", description: "Sweet and sticky glazed wok wings.", image: "/images/wok-wings.jpg" },
        { id: 503, name: "Indian Tandoori Wings", price: "£6.95", description: "Fusion wings marinated in tandoori spices and wok-tossed.", image: "/images/indian-tandoori-wings.jpg" }
      ]
    },
    {
      category: "6. SIDES, WRAPS & EXTRAS",
      description: "Rolls, Wraps, Dumplings and Loaded Fries.",
      items: [
        { id: 601, name: "Veg / Chicken Spring Rolls", price: "£4.50", description: "Crispy fried rolls served with sweet chili dip.", image: "/images/spring-rolls.jpg" },
        { id: 602, name: "Chicken Tikka Wrap", price: "£6.50", description: "Tandoori chicken tikka wrapped in a soft tortilla with mint chutney.", image: "/images/chicken-tikka-wrap.jpg", isPopular: true },
        { id: 603, name: "Loaded Masala Fries", price: "£5.50", description: "Crispy fries topped with spicy masala sauce and cheese.", image: "/images/loaded-masala-fries.jpg" },
        { id: 604, name: "Dumplings (Veg / Chicken)", price: "£5.95", description: "Steamed or pan-fried dumplings.", image: "/images/dumplings.jpg" }
      ]
    },
    {
      category: "7. DESSERTS 🍰",
      description: "Sweet endings to a spicy meal.",
      items: [
        { id: 701, name: "Gulab Jamun", price: "£3.95", description: "Deep-fried dough balls soaked in sweet, sticky sugar syrup.", image: "/images/gulab-jamun.jpg" },
        { id: 702, name: "Boba Cheesecake", price: "£5.50", description: "Our special fusion dessert. Creamy cheesecake topped with boba pearls.", image: "/images/boba-cheesecake.jpg", isPopular: true }
      ]
    },
    {
      category: "8. DRINKS 🥤",
      description: "Refreshing beverages.",
      items: [
        { id: 801, name: "Mango Lassi", price: "£3.50", description: "Classic sweet and rich yogurt-based mango drink.", image: "/images/mango-lassi.jpg", isPopular: true },
        { id: 802, name: "Masala Chai", price: "£2.50", description: "Authentic Indian spiced tea.", image: "/images/masala-chai.jpg" }
      ]
    }
  ];

  const { itemCount, toggleCart, addItem } = useCart();

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Wok<span style={{ color: '#fff' }}>Fusion</span></div>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#menu">Menu</a>
            <a href="#story">Our Story</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="cart-button" onClick={toggleCart} aria-label="View your order">
            🛒
            <span className="cart-count" data-testid="cart-count">{itemCount}</span>
          </button>
          <button
            className="mobile-nav-toggle"
            aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            {isMobileNavOpen ? "✕" : "☰"}
          </button>
        </div>

        {isMobileNavOpen && (
          <div className="mobile-nav-panel">
            <a href="#home" onClick={() => setIsMobileNavOpen(false)}>Home</a>
            <a href="#menu" onClick={() => setIsMobileNavOpen(false)}>Menu</a>
            <a href="#story" onClick={() => setIsMobileNavOpen(false)}>Our Story</a>
            <a href="#contact" onClick={() => setIsMobileNavOpen(false)}>Contact</a>
          </div>
        )}
      </nav>

      <CartDrawer />

      {configuringItem && (
        <BentoBoxConfigurator
          baseId={configuringItem.id}
          baseName={configuringItem.name}
          onClose={() => setConfiguringItem(null)}
          onAdd={(configuredItem) => {
            addItem(configuredItem);
            setConfiguringItem(null);
          }}
        />
      )}

      <div id="home">
        <Hero />
      </div>

      <section id="menu" className="menu-section">
        <span className="section-subtitle">Discover Our Menu</span>
        <h2 className="section-title">A Fusion of Flavors</h2>
        <p className="hero-desc" style={{ marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem auto' }}>
          Combining the best of Indo-Chinese wok cooking with authentic Sri Lankan street food.
        </p>

        <div className="takeout-badge" style={{ margin: '0 auto 4rem auto', display: 'inline-flex' }}>
          <span className="icon">🥡</span>
          <span>Take Out Only</span>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {menuCategories.map((category, index) => (
            <div key={index}>
              <h3 className="menu-category-title">{category.category}</h3>
              <p className="menu-category-desc">{category.description}</p>
              <div className="menu-grid">
                {category.items.map(item => (
                  <FoodCard
                    key={item.id}
                    {...item}
                    onCustomize={() => setConfiguringItem(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="story" className="story-section">
        <div className="story-container">
          <div className="story-content">
            <h2 className="section-title" style={{ textAlign: 'left' }}>Our Story</h2>
            <span className="section-subtitle" style={{ textAlign: 'left' }}>Affordable. Fast. Delicious.</span>
            <p className="story-text">
              Wok Fusion was born out of a simple need: affordable, fast, and high-quality food for everyone.
              Founded by Maicheal Addeti during his student years, he understood exactly how hard it is to manage
              finances while studying. He wanted to create a place where people didn't have to compromise on taste
              or portion sizes just to save money.
            </p>
            <p className="story-text">
              Today, Wok Fusion brings together the fiery, wok-tossed brilliance of Indo-Chinese cuisine and
              the rich, comforting flavors of Sri Lankan street food. Designed for busy lives, we are exclusively
              a take-out restaurant, ensuring your food is ready fast and priced fairly.
            </p>
            <div className="owner-info">
              <p><strong>Maicheal Addeti</strong> - Founder</p>
              <p>Phone: {RESTAURANT_PHONE_DISPLAY}</p>
            </div>
          </div>
          <div className="story-image">
            <img src="/images/restaurant-atmosphere.jpg" alt="Restaurant atmosphere" />
          </div>
        </div>
      </section>

      <footer id="contact" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#050505', borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>Wok<span style={{ color: '#fff' }}>Fusion</span></div>
        <p style={{ marginBottom: '0.5rem' }}>Take-Out Only • {RESTAURANT_PHONE_DISPLAY}</p>
        <p>© 2026 Wok Fusion. All rights reserved.</p>
      </footer>
    </div>
  );
}