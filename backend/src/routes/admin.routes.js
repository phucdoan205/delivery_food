const express = require('express');
const router = express.Router();
const {
  getAllShops,
  approveShop,
  updateGlobalCommission,
  getDashboardStats
} = require('../controllers/admin.controller');

const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/role');

router.get('/shops', protect, authorize('admin'), getAllShops);
router.put('/shops/:shopId/approve', protect, authorize('admin'), approveShop);
router.put('/commission', protect, authorize('admin'), updateGlobalCommission);
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

module.exports = router;