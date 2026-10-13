const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { initialDishes } = require('../seed/seedData');

// In-memory cache synced with database
let memoryDishes = [...initialDishes];

// GET /api/menu - Get all dishes with category/diet filters
router.get('/', async (req, res) => {
  try {
    const { category, diet, search, sort } = req.query;
    let dishes = [];

    try {
      dishes = await MenuItem.find({});
      if (dishes.length === 0) {
        dishes = memoryDishes;
      }
    } catch {
      dishes = memoryDishes;
    }

    // Filter by Category
    if (category && category !== 'all') {
      dishes = dishes.filter(d => d.category === category);
    }

    // Filter by Diet
    if (diet === 'veg') {
      dishes = dishes.filter(d => d.veg === true);
    } else if (diet === 'non-veg') {
      dishes = dishes.filter(d => d.veg === false);
    } else if (diet === 'popular') {
      dishes = dishes.filter(d => d.isBestseller === true);
    }

    // Filter by Search Query
    if (search) {
      const q = search.toLowerCase();
      dishes = dishes.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'price-low') {
      dishes.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      dishes.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      dishes.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: dishes.length, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/menu/:id - Get single dish
router.get('/:id', async (req, res) => {
  try {
    let dish;
    try {
      dish = await MenuItem.findOne({ itemId: req.params.id });
    } catch {
      dish = memoryDishes.find(d => d.itemId === req.params.id);
    }
    if (!dish) return res.status(404).json({ success: false, message: 'Dish not found' });
    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/menu - Add new dish (Admin)
router.post('/', async (req, res) => {
  try {
    const newDishData = {
      ...req.body,
      itemId: req.body.itemId || `dish-${Date.now()}`
    };

    try {
      const created = await MenuItem.create(newDishData);
      memoryDishes.push(created);
      return res.status(201).json({ success: true, data: created });
    } catch {
      memoryDishes.push(newDishData);
      return res.status(201).json({ success: true, data: newDishData });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/menu/:id/stock - Toggle In-Stock / Sold-Out status
router.patch('/:id/stock', async (req, res) => {
  try {
    const { inStock } = req.body;
    let updated;

    try {
      updated = await MenuItem.findOneAndUpdate(
        { itemId: req.params.id },
        { inStock: inStock !== undefined ? inStock : true },
        { new: true }
      );
    } catch {
      // In-memory fallback
      const idx = memoryDishes.findIndex(d => d.itemId === req.params.id);
      if (idx !== -1) {
        memoryDishes[idx].inStock = inStock !== undefined ? inStock : !memoryDishes[idx].inStock;
        updated = memoryDishes[idx];
      }
    }

    if (!updated) return res.status(404).json({ success: false, message: 'Dish not found' });
    res.json({ success: true, message: 'Stock status updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/menu/:id - Delete dish
router.delete('/:id', async (req, res) => {
  try {
    try {
      await MenuItem.findOneAndDelete({ itemId: req.params.id });
    } catch {
      memoryDishes = memoryDishes.filter(d => d.itemId !== req.params.id);
    }
    res.json({ success: true, message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
