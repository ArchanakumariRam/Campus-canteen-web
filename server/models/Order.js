const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  veg: { type: Boolean, default: true }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  tokenNumber: {
    type: String,
    required: true
  },
  customer: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'student' },
    email: { type: String, default: '' },
    studentId: { type: String, default: '' }
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'cooking', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupCounter: {
    type: Number,
    default: 1
  },
  tableNumber: {
    type: String,
    default: 'Counter Pickup'
  },
  cookingNotes: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    enum: ['campus_wallet', 'upi_qr', 'counter_cash'],
    default: 'campus_wallet'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'refunded'],
    default: 'paid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
