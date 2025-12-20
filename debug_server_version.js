const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/SAGAR KUMAR/OneDrive/Pictures/flipkart/shopora-api/.env' });
const User = require('./models/User');

const API_URL = 'http://localhost:5000/api/orders';

const testCrash = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'admin@gmail.com' });

        if (!user) {
            console.log('User not found');
            return;
        }

        // Login to get token (simulated or direct token gen? authService usually needed)
        // Easier: Generate token directly using jwt
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        console.log('Sending request with INVALID product ID to trigger server error...');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderItems: [
                        {
                            product: 'INVALID_ID_THIS_SHOULD_CRASH_MONGOOSE',
                            qty: 1
                        }
                    ],
                    shippingAddress: {
                        name: "Test", mobile: "123", address: "123", city: "Test", pincode: "123", state: "Test", locality: "Test"
                    },
                    paymentMethod: "COD"
                })
            });

            const data = await response.json();
            console.log('Status:', response.status);
            console.log('Data:', data);

        } catch (err) {
            console.log('Fetch error:', err.message);
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

testCrash();
