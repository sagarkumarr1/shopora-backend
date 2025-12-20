const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://shopora-frontend.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}));

// Standard Middlewares
app.use(express.json());
app.use(cookieParser());

// Database Connection Middleware (Serverless Optimized)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection failed', err);
        res.status(500).json({ success: false, error: 'Database Connection Error' });
    }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Shopora API is running in Vercel serverless mode',
        timestamp: new Date().toISOString()
    });
});

// Route Registration
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/address', require('../routes/addressRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));
app.use('/api/categories', require('../routes/categoryRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/hero', require('../routes/heroRoutes'));
app.use('/api/cart', require('../routes/cartRoutes'));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found on this server`
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;

    res.status(statusCode).json({
        success: false,
        error: message
    });
});

// Export the app for Vercel
module.exports = app;
