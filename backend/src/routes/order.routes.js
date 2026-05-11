const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus
} = require('../controllers/order.controller');

const { protect } = require('../middlewares/auth');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/shop-orders', protect, getShopOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;