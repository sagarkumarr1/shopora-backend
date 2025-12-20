const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/SAGAR KUMAR/OneDrive/Pictures/flipkart/shopora-api/.env' });
const User = require('./models/User'); // Correct path relative to root

// Models are in shopora-api/models
// Script will be in shopora-api/scripts or root? 
// Let's put it in shopora-api root.

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const checkAdmins = async () => {
    await connectDB();
    try {
        const admins = await User.find({ role: 'admin' }).select('name email role');
        console.log('--- ADMIN USERS ---');
        console.log(admins);
        console.log('-------------------');

        const allUsers = await User.find({}).limit(5).select('name email role');
        console.log('--- FIRST 5 USERS ---');
        console.log(allUsers);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkAdmins();
