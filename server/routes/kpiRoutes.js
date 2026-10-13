const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { initialOrders, initialDishes } = require('../seed/seedData');

// GET /api/kpi - Dashboard revenue and operations metrics
router.get('/', async (req, res) => {
  try {
    let orders = [];
    let dishes = [];

    try {
      orders = await Order.find({});
      if (orders.length === 0) orders = initialOrders;
      dishes = await MenuItem.find({});
      if (dishes.length === 0) dishes = initialDishes;
    } catch {
      orders = initialOrders;
      dishes = initialDishes;
    }

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const activeKitchenTickets = orders.filter(o => o.status === 'pending' || o.status === 'cooking').length;
    const readyForPickup = orders.filter(o => o.status === 'ready').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const activeMenuItems = dishes.filter(d => d.inStock !== false).length;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        activeKitchenTickets,
        readyForPickup,
        completedOrders,
        activeMenuItems,
        avgWaitMinutes: 8
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
