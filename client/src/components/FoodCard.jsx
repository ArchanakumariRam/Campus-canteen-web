import React from 'react';
import { useCart } from '../context/CartContext';
import { animateAddToCart } from '../utils/cartAnimation';

export const FoodCard = ({ dish }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find(item => item.itemId === dish.itemId);

  return (
    <article className="food-card">
      <div className="food-card-thumb-wrapper">
        <img
          src={dish.image}
          alt={dish.name}
          className="food-card-img"
          loading="lazy"
        />

        {/* Hot Steam Animation for Hot Meals & Drinks */}
        {(dish.category === 'meals' || dish.category === 'breakfast' || dish.category === 'beverages') && (
          <div className="steam-overlay" aria-hidden="true">
            <span className="steam-particle"></span>
            <span className="steam-particle"></span>
            <span className="steam-particle"></span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="food-card-badges-float">
          <span className={`diet-badge-icon ${dish.veg ? 'veg' : 'non-veg'}`} title={dish.veg ? 'Pure Vegetarian' : 'Non-Vegetarian'}></span>
          {dish.badge && (
            <span className="card-top-tag tag-bestseller">
              {dish.badge}
            </span>
          )}
        </div>

        {/* Prep Time Tag */}
        <span className="tag-preptime">
          <span>⏱️</span>
          <span>{dish.prepTime || '8m'}</span>
        </span>
      </div>

      <div className="food-card-body">
        <div className="card-title-row">
          <h3 className="food-card-title">{dish.name}</h3>
        </div>

        <p className="food-card-desc">{dish.description}</p>

        <div className="card-meta-row">
          <div className="card-rating-col">
            <span>⭐ {dish.rating || '4.9'}</span>
            <span className="card-rating-count">({dish.ratingCount || 100})</span>
          </div>
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
            🔥 {dish.calories || 320} kcal
          </span>
        </div>

        <div className="card-footer-action">
          <div className="card-price-col">
            <span className="card-price-value">₹{dish.price}</span>
            <span className="card-price-original">₹{Math.round(dish.price * 1.25)}</span>
            <span className="card-price-discount">20% off</span>
          </div>

          {dish.inStock === false ? (
            <span className="out-of-stock-badge">Sold Out</span>
          ) : cartItem ? (
            <div className="food-qty-stepper">
              <button
                type="button"
                className="stepper-btn"
                onClick={() => updateQuantity(dish.itemId, -1)}
                title="Decrease"
              >
                −
              </button>
              <span className="stepper-value">{cartItem.quantity}</span>
              <button
                type="button"
                className="stepper-btn"
                onClick={(e) => {
                  animateAddToCart(e.currentTarget, dish);
                  updateQuantity(dish.itemId, 1);
                }}
                title="Increase"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={(e) => {
                animateAddToCart(e.currentTarget, dish);
                addToCart(dish);
              }}
            >
              <span>+ Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
