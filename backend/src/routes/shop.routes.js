const express = require('express');
const router = express.Router();
const { createShop, getMyShop, updateShop } = require('../controllers/shop.controller');
const { protect } = require('../middlewares/auth');

router.post('/', protect, createShop);
router.get('/my-shop', protect, getMyShop);
router.put('/my-shop', protect, updateShop);

module.exports = router;