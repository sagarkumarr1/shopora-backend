const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function testSecurity() {
    try {
        console.log('1. Registering/Logging in User...');
        // Create random user
        const userEmail = `security_test_${Date.now()}@test.com`;
        const userPass = 'password123';

        let token;

        // Register
        try {
            const regRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Security Test User',
                    email: userEmail,
                    password: userPass,
                    role: 'user'
                })
            });
            const regData = await regRes.json();

            if (regData.token) {
                token = regData.token;
                console.log('   User registered.');
            } else {
                // Try login if user exists (though random email should prevent this)
                if (regData.error === 'User already exists') {
                    // actually just return, random email should work.
                    console.log('User exists?');
                }
                throw new Error(regData.error || 'Registration failed');
            }
        } catch (e) {
            console.log('   Registration error:', e.message);
            return;
        }

        if (!token) return;

        console.log('2. Fetching a Product...');
        const productsRes = await fetch(`${API_URL}/products`);
        const productsData = await productsRes.json();

        if (!productsData.data || productsData.data.length === 0) {
            console.log('   No products found to test with.');
            return;
        }

        const product = productsData.data[0];

        console.log(`   Found Product: ${product.title} - Real Price: Rs ${product.price}`);

        console.log('3. Attempting to place order with MANIPULATED price...');
        const FAKE_PRICE = 1; // 1 Rupee instead of real price

        const orderPayload = {
            orderItems: [
                {
                    product: product._id,
                    name: product.title,
                    image: product.image,
                    price: FAKE_PRICE, // <--- ATTACK HERE
                    qty: 1
                }
            ],
            shippingAddress: {
                name: 'Security Test User',
                mobile: '1234567890',
                address: '123 Test St',
                city: 'Test City',
                pincode: '12345',
                state: 'Test State',
                locality: 'Test Locality'
            },
            paymentMethod: 'COD',
            itemsPrice: FAKE_PRICE, // <--- ATTACK HERE
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: FAKE_PRICE // <--- ATTACK HERE
        };

        const orderRes = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderPayload)
        });

        const orderData = await orderRes.json();

        if (!orderData.success) {
            console.log('Order creation failed:', orderData.error);
            return;
        }

        const createdOrder = orderData.data;

        console.log('4. validating Created Order...');
        console.log(`   Order ID: ${createdOrder._id}`);
        console.log(`   Order Total Price: Rs ${createdOrder.totalPrice}`);

        // Validation
        const expectedPrice = product.price > 500 ? product.price : product.price + 50; // Shipping logic

        const priceMatch = Math.abs(createdOrder.totalPrice - expectedPrice) < 0.1;
        const fakeMatch = Math.abs(createdOrder.totalPrice - FAKE_PRICE) < 0.1;

        if (priceMatch) {
            console.log('✅ SUCCESS: Backend ignored fake price and calculated correct total.');
        } else if (fakeMatch) {
            console.log('❌ FAILURE: Backend accepted the fake price! Security vulnerability exists.');
        } else {
            console.log(`⚠️  UNCLEAR: Expected ${expectedPrice}, got ${createdOrder.totalPrice}. Check logic.`);
        }

    } catch (err) {
        console.error('Test Failed:', err);
    }
}

// Give server a moment to start
setTimeout(testSecurity, 2000);
