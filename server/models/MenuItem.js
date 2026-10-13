const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'snacks', 'meals', 'fastfood', 'beverages', 'desserts']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  veg: {
    type: Boolean,
    default: true
  },
  prepTime: {
    type: String,
    default: '8-10 Mins'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 120
  },
  calories: {
    type: Number,
    default: 350
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  counterNo: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
