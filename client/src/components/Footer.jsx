import React from 'react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Subscribed to RIT Canteen daily meal specials!');
  };

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Col 1: Get in Touch */}
          <div className="footer-col">
            <h4 className="footer-col-title">GET IN TOUCH</h4>
            <p className="footer-col-desc">
              Cloud Canteen deals with the financial and operational aspects of employee and student orders, deductions, and live cafeteria dispatch in our campus.
            </p>
            <div className="footer-contact-items">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Canteen Block, Rajarambapu Institute of Technology, Rajaramnagar, Sakharale, Islampur, Maharashtra - 415414</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>canteen@ritindia.edu</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+91 2342 220 329 / +91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Shop */}
          <div className="footer-col">
            <h4 className="footer-col-title">QUICK SHOP</h4>
            <ul className="footer-links-list">
              <li><a href="#view-menu" onClick={scrollToTop}>› Home</a></li>
              <li><a href="#about-canteen">› About Us</a></li>
              <li><a href="#menu-controls">› All Products</a></li>
              <li><a href="#categories-showcase">› Categories</a></li>
              <li><a href="#special-offers">› Special Offers</a></li>
              <li><a href="#orders">› Track Token</a></li>
            </ul>
          </div>

          {/* Col 3: My Account / Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">MY ACCOUNT</h4>
            <ul className="footer-links-list">
              <li><a href="#wallet">› Canteen Meal Wallet</a></li>
              <li><a href="#cart">› Shopping Plate / Cart</a></li>
              <li><a href="#orders">› Checkout Status</a></li>
              <li><a href="/admin.html" target="_blank" rel="noopener noreferrer">› Kitchen & Staff Login</a></li>
              <li><a href="#dietary">› Dietary & FSSAI Info</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Follow Us */}
          <div className="footer-col">
            <h4 className="footer-col-title">NEWSLETTER</h4>
            <p className="footer-col-desc">
              Subscribe for our channel for getting latest meal specials and product updates.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Your Email Address" required className="newsletter-input" />
              <button type="submit" className="newsletter-submit-btn">Sign Up</button>
            </form>
            <div className="footer-social-section">
              <span className="social-title">FOLLOW US</span>
              <div className="footer-social-icons">
                <a href="#twitter" className="social-icon" title="Twitter / X">𝕏</a>
                <a href="#facebook" className="social-icon" title="Facebook">f</a>
                <a href="#linkedin" className="social-icon" title="LinkedIn">in</a>
                <a href="#instagram" className="social-icon" title="Instagram">📷</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Payment Options and Copyright */}
        <div className="footer-bottom-bar">
          <div className="footer-payment-badges">
            <span className="pay-badge">💳 Visa</span>
            <span className="pay-badge">💳 MasterCard</span>
            <span className="pay-badge">💳 RuPay</span>
            <span className="pay-badge">📱 UPI</span>
            <span className="pay-badge">🎓 Student ID</span>
          </div>
          <div className="footer-copyright-text">
            © 2026 RIT Canteen. All Rights Reserved. Rajarambapu Institute of Technology.
          </div>
        </div>
      </div>
    </footer>
  );
};
