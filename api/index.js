const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('../config/db');

// Initialize Express
const app = express();

// Database Connection Middleware
// We connect on every request but use the CACHED connection from db.js
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection failed', err);
        res.status(500).json({ success: false, error: 'Database Connection Error' });
    }
});

// Standard Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Default to * if not set, but production should use CLIENT_URL
    credentials: true
}));
app.use(cookieParser());

// Route Registration
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/address', require('../routes/addressRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));
app.use('/api/categories', require('../routes/categoryRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/hero', require('../routes/heroRoutes'));
app.use('/api/cart', require('../routes/cartRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// Export for Vercel Serverless Functions
module.exports = app;
