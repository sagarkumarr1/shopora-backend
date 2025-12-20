const express = require('express');
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
    .get(getCart)
    .post(addToCart);

router.route('/:itemId')
    .put(updateCartItem)
    .delete(removeFromCart);

module.exports = router;
