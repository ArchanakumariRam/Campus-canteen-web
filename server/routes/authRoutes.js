const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { initialUsers } = require('../seed/seedData');

let memoryUsers = [...initialUsers];

const mongoose = require('mongoose');

// POST /api/auth/login - Authenticate student or staff
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const emailLower = email.toLowerCase().trim();
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: emailLower });
      } catch (e) {
        console.warn('MongoDB user lookup notice:', e.message);
      }
    }

    if (!user) {
      user = memoryUsers.find(u => u.email.toLowerCase() === emailLower);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Account not found. Please register or verify your email.' });
    }

    if (password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.json({
      success: true,
      message: `Welcome back, ${user.name || user.email}!`,
      data: {
        userId: user.userId || `usr-${user._id || Date.now()}`,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        role: user.role || 'student',
        studentId: user.studentId || user.regNo || 'CAMPUS-MEMBER',
        department: user.department || 'Campus General',
        walletBalance: user.walletBalance !== undefined ? user.walletBalance : 250,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/register - Register a new campus user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, regNo, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const emailLower = email.toLowerCase().trim();
    let existing = null;
    try {
      existing = await User.findOne({ email: emailLower });
    } catch {
      existing = memoryUsers.find(u => u.email.toLowerCase() === emailLower);
    }
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = {
      userId: `usr-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: emailLower,
      password,
      role: role || 'student',
      studentId: regNo || (role === 'faculty' ? `FAC-${Math.floor(100 + Math.random() * 900)}` : `STU-${Math.floor(1000 + Math.random() * 9000)}`),
      department: department || 'Campus General',
      walletBalance: 250, // Welcome ₹250 bonus credits
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    try {
      const created = await User.create(newUser);
      memoryUsers.push(created);
    } catch {
      memoryUsers.push(newUser);
    }

    res.status(201).json({
      success: true,
      message: 'Account registered successfully with ₹250 welcome bonus!',
      data: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
        department: newUser.department,
        walletBalance: newUser.walletBalance,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/users - List all users
router.get('/users', async (req, res) => {
  try {
    let users = [];
    if (mongoose.connection.readyState === 1) {
      try {
        users = await User.find({}, '-password').sort({ createdAt: -1 });
      } catch (e) {
        console.warn('MongoDB users fetch notice:', e.message);
      }
    }
    if (users.length === 0) {
      users = memoryUsers.map(u => {
        const { password, ...safe } = u;
        return safe;
      });
    }
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/users - Admin adds user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, regNo, department, walletBalance } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    const emailLower = email.toLowerCase().trim();
    let existing = memoryUsers.find(u => u.email.toLowerCase() === emailLower);
    if (!existing && mongoose.connection.readyState === 1) {
      existing = await User.findOne({ email: emailLower });
    }
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const newUser = {
      userId: `usr-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: emailLower,
      password: password || 'campus123',
      role: role || 'student',
      studentId: regNo || (role === 'faculty' ? `FAC-${Math.floor(100 + Math.random() * 900)}` : `STU-${Math.floor(1000 + Math.random() * 9000)}`),
      department: department || 'Campus General',
      walletBalance: Number(walletBalance) >= 0 ? Number(walletBalance) : 500,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await User.create(newUser);
        memoryUsers.unshift(created);
        return res.status(201).json({ success: true, message: 'User created successfully', data: created });
      } catch (err) {
        console.warn('MongoDB create user notice:', err.message);
      }
    }
    memoryUsers.unshift(newUser);
    res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/wallet/topup - Top up wallet balance
router.post('/wallet/topup', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const addAmt = Number(amount) || 100;

    let updated;
    try {
      updated = await User.findOneAndUpdate(
        { userId },
        { $inc: { walletBalance: addAmt } },
        { new: true }
      );
    } catch {
      const idx = memoryUsers.findIndex(u => u.userId === userId);
      if (idx !== -1) {
        memoryUsers[idx].walletBalance = (memoryUsers[idx].walletBalance || 0) + addAmt;
        updated = memoryUsers[idx];
      }
    }

    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({
      success: true,
      message: `₹${addAmt} added to wallet successfully!`,
      walletBalance: updated.walletBalance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
