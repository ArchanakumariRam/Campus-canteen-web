const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { initialOrders } = require('../seed/seedData');

let memoryOrders = [...initialOrders];
let tokenCounter = 104;

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const { status, userId } = req.query;
    let orders = [];

    try {
      orders = await Order.find({}).sort({ createdAt: -1 });
      if (orders.length === 0) orders = memoryOrders;
    } catch {
      orders = memoryOrders;
    }

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }
    if (userId) {
      orders = orders.filter(o => o.customer && o.customer.userId === userId);
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/queue/live - Live Waiting Queue Ticker data
router.get('/queue/live', async (req, res) => {
  try {
    let orders = [];
    try {
      orders = await Order.find({});
      if (orders.length === 0) orders = memoryOrders;
    } catch {
      orders = memoryOrders;
    }

    const readyOrder = orders.find(o => o.status === 'ready');
    const waitingOrders = orders.filter(o => o.status === 'pending' || o.status === 'cooking');
    const callingToken = readyOrder ? `${readyOrder.tokenNumber} (Counter ${readyOrder.pickupCounter || 2})` : '#TK-101 (Counter 2)';
    const waitingCount = waitingOrders.length;
    const estWaitTime = `~${Math.max(4, waitingCount * 3)}-${Math.max(6, waitingCount * 4 + 2)} Mins`;

    res.json({
      success: true,
      data: {
        callingToken,
        waitingCount,
        estWaitTime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, cookingNotes, tableNumber, pickupCounter } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    const assignedToken = `#TK-${tokenCounter++}`;
    const newOrderData = {
      orderId: `ord-${Date.now()}`,
      tokenNumber: assignedToken,
      customer: customer || { userId: 'usr-01', name: 'Aryan Sharma', role: 'student' },
      items,
      totalAmount: totalAmount || items.reduce((sum, it) => sum + (it.price * (it.quantity || 1)), 0),
      status: 'pending',
      pickupCounter: pickupCounter || 1,
      tableNumber: tableNumber || 'Counter Pickup',
      cookingNotes: cookingNotes || '',
      paymentMethod: 'campus_wallet',
      paymentStatus: 'paid',
      createdAt: new Date()
    };

    try {
      const created = await Order.create(newOrderData);
      memoryOrders.unshift(created);
      return res.status(201).json({ success: true, message: 'Order placed successfully!', data: created });
    } catch {
      memoryOrders.unshift(newOrderData);
      return res.status(201).json({ success: true, message: 'Order placed successfully!', data: newOrderData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/orders/:id/status - Update kitchen order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'cooking', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let updated;
    try {
      updated = await Order.findOneAndUpdate(
        { orderId: req.params.id },
        { status },
        { new: true }
      );
    } catch {
      const idx = memoryOrders.findIndex(o => o.orderId === req.params.id);
      if (idx !== -1) {
        memoryOrders[idx].status = status;
        updated = memoryOrders[idx];
      }
    }

    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: `Order status moved to ${status}`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
