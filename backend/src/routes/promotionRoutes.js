const express = require('express');
const router = express.Router();
const {
  getPromotionsByRestaurant,
  createPromotion,
  updatePromotion,
  deletePromotion
} = require('../controllers/promotionController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/restaurant/:restaurantId', getPromotionsByRestaurant);

router.post('/', protect, authorize('merchant', 'staff', 'admin'), createPromotion);
router.route('/:id')
  .put(protect, authorize('merchant', 'staff', 'admin'), updatePromotion)
  .delete(protect, authorize('merchant', 'staff', 'admin'), deletePromotion);

module.exports = router;
