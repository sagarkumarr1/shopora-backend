const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: process.env.NODE_ENV !== 'production', // Performance optimization for production
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error; // Let the server handling logic catch it
    }
};

module.exports = connectDB;
