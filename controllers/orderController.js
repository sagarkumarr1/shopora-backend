const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Move import to top
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
    try {
        console.log('addOrderItems: Request received');

        const {
            orderItems,
            shippingAddress,
            paymentMethod
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            console.log('addOrderItems: No order items');
            return res.status(400).json({ success: false, error: 'No order items' });
        }

        console.log(`addOrderItems: Processing ${orderItems.length} items`);

        // 1. Recalculate prices from DB
        let calculatedItemsPrice = 0;
        const verifiedOrderItems = [];

        for (const item of orderItems) {
            // item.product is the ID
            console.log(`addOrderItems: Fetching product ${item.product}`);

            let productFromDb;
            try {
                productFromDb = await Product.findById(item.product);
            } catch (dbErr) {
                console.error(`addOrderItems: DB Error fetching product ${item.product}`, dbErr);
                throw dbErr;
            }

            if (!productFromDb) {
                console.log(`addOrderItems: Product not found ${item.product}`);
                return res.status(404).json({ success: false, error: `Product not found: ${item.name}` });
            }

            let finalPrice = productFromDb.price;

            // Check variant
            if (item.variantId) {
                console.log(`addOrderItems: Checking variant ${item.variantId}`);
                // variants is a subdocument array
                const variant = productFromDb.variants.id(item.variantId);
                if (variant) {
                    finalPrice = variant.price;
                    console.log(`addOrderItems: Found variant price ${finalPrice}`);
                } else {
                    console.log('addOrderItems: Variant not found, falling back to base price');
                }
            } else {
                console.log(`addOrderItems: Using base price ${finalPrice}`);
            }

            calculatedItemsPrice += finalPrice * item.quantity;

            verifiedOrderItems.push({
                product: item.product,
                title: item.title || item.name || productFromDb.title, // Fallback title
                image: item.image || productFromDb.image || 'https://via.placeholder.com/150', // Fallback image from DB
                price: finalPrice, // Server-side price
                quantity: item.quantity,
                variantId: item.variantId,
                variantAttributes: item.variantAttributes
            });
        }

        console.log(`addOrderItems: calculatedItemsPrice = ${calculatedItemsPrice}`);

        // 2. Calculate Shipping (Logic: Free if > 500, else 50)
        const shippingPrice = calculatedItemsPrice > 500 ? 0 : 50;

        // 3. Tax
        const taxPrice = 0;

        // 4. Total
        const totalPrice = calculatedItemsPrice + shippingPrice + taxPrice;

        console.log(`addOrderItems: totalPrice = ${totalPrice}`);

        const order = new Order({
            user: req.user.id,
            orderItems: verifiedOrderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice: calculatedItemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        console.log(`addOrderItems: Order saved ${createdOrder._id}`);

        // Clear User's Cart
        try {
            const userCart = await Cart.findOne({ user: req.user.id });
            if (userCart) {
                userCart.cartItems = [];
                await userCart.save();
            }
        } catch (cartErr) {
            console.error('addOrderItems: Error clearing cart', cartErr);
            // Continue execution
        }

        // Notify Admin via Email
        try {
            const message = `
                New Order Placed!
                
                Order ID: ${createdOrder._id}
                User ID: ${req.user.id}
                Total Amount: ₹${totalPrice}
                Payment Method: ${paymentMethod}
                
                Items:
                ${verifiedOrderItems.map(item => `- ${item.title} x ${item.quantity}`).join('\n')}
            `;

            if (process.env.ADMIN_EMAIL) {
                sendEmail({
                    email: process.env.ADMIN_EMAIL, // Admin email from .env
                    subject: `New Order Received - #${createdOrder._id}`,
                    message: message
                });
                console.log('Order notification sent to admin.');
            }
        } catch (emailError) {
            console.error('Failed to send order notification email:', emailError);
            // Continue without failing the request
        }

        res.status(201).json({ success: true, data: createdOrder });

    } catch (err) {
        console.error('SERVER ERROR IN addOrderItems:', err);
        if (err.stack) console.error(err.stack);

        // Log to file for debugging
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../error.log');
        const logMsg = `\n[${new Date().toISOString()}] SERVER ERROR: ${err.message}\nStack: ${err.stack}\nRequest Body: ${JSON.stringify(req.body)}\n`;
        try {
            fs.appendFileSync(logPath, logMsg);
        } catch (fileErr) {
            console.error('Failed to write to error log', fileErr);
        }

        // Return specific error message instead of generic "Server Error"
        res.status(500).json({ success: false, error: err.message || 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.status(200).json({ success: true, data: order });
        } else {
            res.status(404).json({ success: false, error: 'Order not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;

            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            if (req.body.tracking) {
                order.trackingResult = {
                    id: req.body.tracking.id,
                    courier: req.body.tracking.courier,
                    url: req.body.tracking.url,
                    update_time: Date.now()
                };
            }

            if (req.body.estimatedDeliveryDate) {
                order.estimatedDeliveryDate = req.body.estimatedDeliveryDate;
            }

            const updatedOrder = await order.save();
            res.status(200).json({ success: true, data: updatedOrder });
        } else {
            res.status(404).json({ success: false, error: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        console.log('Attempting to cancel order ID:', req.params.id); // DEBUG LOG
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Check if user owns the order (or is admin)
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        // Check if order is already delivered or shipped
        if (order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped' || order.orderStatus === 'Cancelled') {
            return res.status(400).json({ success: false, error: `Cannot cancel order with status: ${order.orderStatus}` });
        }

        order.orderStatus = 'Cancelled';
        const updatedOrder = await order.save();

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
