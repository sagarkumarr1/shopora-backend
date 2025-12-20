const express = require('express');
const { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(addOrderItems)
    .get(authorize('admin'), getOrders);

router.route('/myorders').get(getMyOrders);

router.route('/:id').get(getOrderById);

router.route('/:id/status').put(authorize('admin'), updateOrderStatus);
router.route('/:id/cancel').put(cancelOrder);

module.exports = router;
