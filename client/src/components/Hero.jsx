import React from 'react';

export const Hero = ({ searchQuery, setSearchQuery, onSearchSubmit, onSelectCategory }) => {
  const scrollToMenu = () => {
    document.getElementById('menu-controls')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    scrollToMenu();
  };

  return (
    <>
      {/* 1. HERO FOOD BANNER */}
      <section className="canteen-hero-banner-section">
        <div className="hero-banner-container">
          <div className="hero-banner-inner">
            <img src="/assets/canteen-banner.jpg" alt="RIT Canteen Food Ordering Banner" className="hero-banner-img" />
            <div className="hero-banner-overlay"></div>
            <div className="hero-banner-content">
              <span className="hero-banner-tag">ONLINE FOOD ORDERING SYSTEM</span>
              <h1 className="hero-banner-title">Canteen Ordering System</h1>
              <p className="hero-banner-desc">
                Canteen Ordering System deals with the smart digital ordering of campus meals, automated kitchen dispatch, cashless student wallet transactions, and instant digital tokens for express counter pickup.
              </p>

              {/* Integrated Search Bar */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', maxWidth: '520px' }}>
                <div className="search-input-group" style={{ flex: 1 }}>
                  <span className="search-lens-icon">🔍</span>
                  <input
                    type="text"
                    className="search-input-field"
                    placeholder="Search dosas, biryani, burgers, chai..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit && onSearchSubmit()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                  <button
                    type="button"
                    className="search-submit-btn"
                    onClick={onSearchSubmit}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="hero-banner-btn-group">
                <button type="button" onClick={scrollToMenu} className="hero-shop-btn">Order Food Now</button>
                <a href="#special-offers" className="hero-special-btn">Special Offers (Save 20%)</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 VALUE PROPOSITION / TRUST CARDS */}
      <section className="trust-features-section">
        <div className="trust-features-container">
          <div className="trust-feature-card">
            <div className="trust-icon-box">
              <span className="trust-icon">✔</span>
            </div>
            <div className="trust-text-box">
              <h3 className="trust-title">Quality Product</h3>
              <p className="trust-desc">100% fresh, hygienic FSSAI 5-star campus meals</p>
            </div>
          </div>

          <div className="trust-feature-card">
            <div className="trust-icon-box">
              <span className="trust-icon">⚡</span>
            </div>
            <div className="trust-text-box">
              <h3 className="trust-title">Fast 8-Min Pickup</h3>
              <p className="trust-desc">Automated kitchen token queue with live callouts</p>
            </div>
          </div>

          <div className="trust-feature-card">
            <div className="trust-icon-box">
              <span className="trust-icon">💳</span>
            </div>
            <div className="trust-text-box">
              <h3 className="trust-title">Cashless Meal Wallet</h3>
              <p className="trust-desc">One-tap Student ID card, UPI, and instant recharge</p>
            </div>
          </div>

          <div className="trust-feature-card">
            <div className="trust-icon-box">
              <span className="trust-icon">📞</span>
            </div>
            <div className="trust-text-box">
              <h3 className="trust-title">24/7 Digital Support</h3>
              <p className="trust-desc">Live counter display & token tracking on mobile</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT CANTEEN ORDERING SYSTEM */}
      <section className="about-canteen-section" id="about-canteen">
        <div className="about-canteen-container">
          <h2 className="about-heading">About Canteen Ordering System</h2>
          <div className="about-red-line"></div>
          <p className="about-description">
            Canteen Ordering System deals with the financial and operational aspects of campus dining products, allowances, deductions, gross orders, net cashless balance, and automated generation of digital pickup tokens for Rajarambapu Institute of Technology. The outstanding benefit of the system is its ease of implementation, eliminating chaotic counter queues, ensuring accurate billing, and providing students and faculty with fast, nutritious dining throughout the semester.
          </p>

          <div className="about-stats-grid">
            <div className="about-stat-item">
              <span className="about-stat-num">3,500+</span>
              <span className="about-stat-label">Daily Meals Served</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-num">&lt; 8 Mins</span>
              <span className="about-stat-label">Average Wait Time</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-num">12+</span>
              <span className="about-stat-label">Active Kitchen Stations</span>
            </div>
            <div className="about-stat-item">
              <span className="about-stat-num">100%</span>
              <span className="about-stat-label">Cashless & Queue-Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 3 SPECIAL OFFER PROMO BANNERS */}
      <section className="special-offers-section" id="special-offers">
        <div className="special-offers-container">
          {/* Promo 1 */}
          <div className="promo-banner-card" onClick={scrollToMenu}>
            <img src="/assets/promo-burger-combo.jpg" alt="Student Special Offer" className="promo-img" />
            <div className="promo-overlay"></div>
            <div className="promo-card-content">
              <span className="promo-sub-badge">WE DELIVER FOOD TO COUNTER</span>
              <span className="promo-discount-tag">SAVE 20%</span>
              <h3 className="promo-title">Special Offer</h3>
              <p className="promo-desc">Jumbo Cheese Burger + Fries + Choco Shake</p>
              <span className="promo-action-btn">Shop Now</span>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="promo-banner-card" onClick={scrollToMenu}>
            <img src="/assets/promo-mobile-order.jpg" alt="Campus Mobile Snacks" className="promo-img" />
            <div className="promo-overlay"></div>
            <div className="promo-card-content">
              <span className="promo-sub-badge">COMMISSION-FREE DIGITAL DINING</span>
              <span className="promo-discount-tag">SAVE 20%</span>
              <h3 className="promo-title">Special Offer</h3>
              <p className="promo-desc">Hot Samosas, Steamed Momos & Kadak Chai</p>
              <span className="promo-action-btn">Shop Now</span>
            </div>
          </div>

          {/* Promo 3 */}
          <div className="promo-banner-card" onClick={scrollToMenu}>
            <img src="/assets/promo-thali-special.jpg" alt="Royal Lunch Thali" className="promo-img" />
            <div className="promo-overlay"></div>
            <div className="promo-card-content">
              <span className="promo-sub-badge">CHEF'S FRESH LUNCH RUSH</span>
              <span className="promo-discount-tag">SAVE 20%</span>
              <h3 className="promo-title">Special Offer</h3>
              <p className="promo-desc">Paneer Butter Masala, Dal & Butter Naan</p>
              <span className="promo-action-btn">Shop Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATEGORIES SHOWCASE GRID */}
      <section className="categories-showcase-section" id="categories-showcase">
        <div className="categories-container">
          <h2 className="categories-section-heading">CATEGORIES</h2>
          <div className="categories-grid">
            <div className="category-item-card" onClick={() => handleCategoryClick('beverages')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=250" alt="Beverages" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">Beverages</h4>
                <p className="cat-item-desc">Fresh juices, cold coffee, cutting chai and fruit smoothies.</p>
              </div>
            </div>

            <div className="category-item-card" onClick={() => handleCategoryClick('breakfast')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=250" alt="Breakfast" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">Breakfast</h4>
                <p className="cat-item-desc">Crispy masala dosa, steaming idli sambar, vada and poha.</p>
              </div>
            </div>

            <div className="category-item-card" onClick={() => handleCategoryClick('meals')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=250" alt="South Indian" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">South Indian</h4>
                <p className="cat-item-desc">Traditional campus mini meals, curd rice, and lemon rice.</p>
              </div>
            </div>

            <div className="category-item-card" onClick={() => handleCategoryClick('snacks')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=250" alt="Snacks" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">Snacks</h4>
                <p className="cat-item-desc">Steamed momos, hot samosas, spring rolls and pakoras.</p>
              </div>
            </div>

            <div className="category-item-card" onClick={() => handleCategoryClick('meals')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=250" alt="North Indian" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">North Indian</h4>
                <p className="cat-item-desc">Paneer butter masala, dal makhani, butter naan & biryani.</p>
              </div>
            </div>

            <div className="category-item-card" onClick={() => handleCategoryClick('fastfood')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=250" alt="Fast Food" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">Fast Food</h4>
                <p className="cat-item-desc">Jumbo cheese burgers, french fries, pizzas and sandwiches.</p>
              </div>
            </div>

            <div className="category-item-card" onClick={() => handleCategoryClick('desserts')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=250" alt="Desserts" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">Desserts</h4>
                <p className="cat-item-desc">Hot gulab jamun, chocolate brownies and rich sundaes.</p>
              </div>
            </div>

            <div className="category-item-card" onClick={() => handleCategoryClick('all')}>
              <div className="cat-img-box">
                <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=250" alt="Combos" className="cat-img" />
              </div>
              <div className="cat-text-box">
                <h4 className="cat-item-title">Value Combos</h4>
                <p className="cat-item-desc">Special meal packs with student discounts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
