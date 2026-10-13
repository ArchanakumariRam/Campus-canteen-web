// RIT Canteen Pro - Express & Mongoose Server (MERN Stack)
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/kpi', require('./routes/kpiRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'RIT Canteen Pro MERN Backend',
    version: '2.0.0',
    timestamp: new Date()
  });
});

// Serve frontend build if present
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));
app.use(express.static(path.join(__dirname, '../')));

// Admin Portal route handler
app.get(['/admin', '/admin.html'], (req, res) => {
  const fs = require('fs');
  const adminDist = path.join(clientBuildPath, 'admin.html');
  const adminClient = path.join(__dirname, '../client/admin.html');
  if (fs.existsSync(adminDist)) {
    return res.sendFile(adminDist);
  }
  if (fs.existsSync(adminClient)) {
    return res.sendFile(adminClient);
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Fallback route
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  const fallbackIndex = path.join(__dirname, '../index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(fallbackIndex);
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 RIT CANTEEN PRO (MERN STACK BACKEND) LIVE!`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🍽️  Endpoints:`);
  console.log(`    - Menu:   http://localhost:${PORT}/api/menu`);
  console.log(`    - Orders: http://localhost:${PORT}/api/orders`);
  console.log(`    - Queue:  http://localhost:${PORT}/api/orders/queue/live`);
  console.log(`    - Auth:   http://localhost:${PORT}/api/auth/users`);
  console.log(`    - KPIs:   http://localhost:${PORT}/api/kpi`);
  console.log(`======================================================\n`);
});
