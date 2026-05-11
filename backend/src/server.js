require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const connectDB = require('./config/database');

const app = express();

// ==================== MIDDLEWARE ====================
app.use(helmet());
app.use(cors({
  origin: '*', // Trong production nên giới hạn origin
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ==================== ROUTES ====================
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/shops', require('./routes/shop.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Food Delivery Backend (Multi-Vendor) is running!',
    version: '1.0.0'
  });
});

// ==================== ERROR HANDLER ====================
app.use(require('./middlewares/errorHandler'));

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();