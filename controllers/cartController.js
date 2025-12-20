const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'title price image slug');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, cartItems: [] });
        }
        res.status(200).json({ success: true, data: cart.cartItems || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
    const { product, quantity, title, price, image, variantId, variantAttributes } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, cartItems: [] });
        }

        // Check if product + variant already exists
        const itemIndex = cart.cartItems.findIndex(item =>
            item.product.toString() === product &&
            item.variantId === variantId
        );

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity += Number(quantity);
        } else {
            cart.cartItems.push({ product, quantity, title, price, image, variantId, variantAttributes });
        }

        await cart.save();

        // Populate and return
        cart = await Cart.findById(cart._id).populate('cartItems.product', 'title price image slug');
        res.status(200).json({ success: true, data: cart.cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update item quantity (Set explicit quantity)
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const productId = req.params.itemId;
    const variantId = req.query.variantId; // Pass variantId in query

    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

        const itemIndex = cart.cartItems.findIndex(item =>
            item.product.toString() === productId &&
            ((!variantId && !item.variantId) || item.variantId === variantId)
        );

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity = Number(quantity);
            if (cart.cartItems[itemIndex].quantity <= 0) {
                cart.cartItems.splice(itemIndex, 1);
            }
        }

        await cart.save();
        cart = await Cart.findById(cart._id).populate('cartItems.product', 'title price image slug');
        res.status(200).json({ success: true, data: cart.cartItems });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}


// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
    const productId = req.params.itemId;
    const variantId = req.query.variantId;

    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

        cart.cartItems = cart.cartItems.filter(item => {
            if (item.product.toString() === productId) {
                // If variantId is provided, only remove that variant.
                // If not provided, remove only non-variant item? OR implementation choice.
                // Best: Match strictly.
                if (variantId) {
                    return item.variantId !== variantId;
                }
                // If no variantId query, remove item only if it HAS no variantId
                return !!item.variantId;
            }
            return true;
        });

        await cart.save();
        cart = await Cart.findById(cart._id).populate('cartItems.product', 'title price image slug');
        res.status(200).json({ success: true, data: cart.cartItems });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
