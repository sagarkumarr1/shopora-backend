const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        console.log('=> Using cached database connection');
        return cachedDb;
    }

    try {
        console.log('=> Creating new database connection');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        cachedDb = conn;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return cachedDb;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
