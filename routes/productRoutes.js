const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getSuggestions, getCategoryDeals, createProductReview } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/suggestions', getSuggestions);
router.get('/deals', getCategoryDeals);

router.route('/')
    .get(getProducts)
    .post(protect, authorize('admin'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
