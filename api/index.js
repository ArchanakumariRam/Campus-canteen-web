const express = require('express');
const cors = require('cors');
const connectDB = require('../server/config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/menu', require('../server/routes/menuRoutes'));
app.use('/api/orders', require('../server/routes/orderRoutes'));
app.use('/api/auth', require('../server/routes/authRoutes'));
app.use('/api/kpi', require('../server/routes/kpiRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'RIT Canteen Pro MERN Backend',
    version: '2.0.0',
    timestamp: new Date()
  });
});

const databaseConnection = connectDB();

module.exports = async (req, res) => {
  await databaseConnection;
  return app(req, res);
};
