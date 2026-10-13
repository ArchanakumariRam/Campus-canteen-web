import React, { useState, useMemo } from 'react';
import { FoodCard } from './FoodCard';

const categories = [
  { id: 'all', label: '🍽️ All Dishes' },
  { id: 'breakfast', label: '🍳 Breakfast' },
  { id: 'snacks', label: '🥟 Snacks & Street Food' },
  { id: 'meals', label: '🍛 Lunch & Thalis' },
  { id: 'fastfood', label: '🍔 Burgers & Fast Food' },
  { id: 'beverages', label: '☕ Beverages & Shakes' },
  { id: 'desserts', label: '🍯 Desserts & Sweets' }
];

export const MenuSection = ({ dishes, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category === selectedCategory);
    }

    // Filter by diet
    if (selectedDiet === 'veg') {
      result = result.filter(d => d.veg === true);
    } else if (selectedDiet === 'non-veg') {
      result = result.filter(d => d.veg === false);
    } else if (selectedDiet === 'popular') {
      result = result.filter(d => d.isBestseller === true);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [dishes, selectedCategory, selectedDiet, searchQuery, sortBy]);

  return (
    <section className="menu-controls-section" id="menu-controls">
      {/* Category Tabs Slider */}
      <div className="category-tabs-scroll" role="tablist">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Subfilter Row */}
      <div className="subfilter-row">
        <div className="diet-toggle-group">
          <button
            type="button"
            className={`diet-pill ${selectedDiet === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedDiet('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`diet-pill diet-veg ${selectedDiet === 'veg' ? 'active' : ''}`}
            onClick={() => setSelectedDiet('veg')}
          >
            <span className="diet-badge-icon veg"></span> Pure Veg
          </button>
          <button
            type="button"
            className={`diet-pill diet-nonveg ${selectedDiet === 'non-veg' ? 'active' : ''}`}
            onClick={() => setSelectedDiet('non-veg')}
          >
            <span className="diet-badge-icon non-veg"></span> Non-Veg
          </button>
          <button
            type="button"
            className={`diet-pill diet-popular ${selectedDiet === 'popular' ? 'active' : ''}`}
            onClick={() => setSelectedDiet('popular')}
          >
            ⭐ Bestsellers
          </button>
        </div>

        <div className="sort-select-wrapper">
          <label htmlFor="sort-dropdown-select">Sort by:</label>
          <select
            id="sort-dropdown-select"
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="menu-cards-grid" style={{ marginTop: '2rem' }}>
        {filteredDishes.length > 0 ? (
          filteredDishes.map(dish => (
            <FoodCard key={dish.itemId} dish={dish} />
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🍽️</span>
            <h3>No dishes found matching your selection</h3>
            <p style={{ marginTop: '0.5rem' }}>Try clearing your search query or selecting a different category.</p>
          </div>
        )}
      </div>
    </section>
  );
};
