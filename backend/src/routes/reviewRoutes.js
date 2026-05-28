const express = require('express');
const router = express.Router();
const {
  createReview,
  getRestaurantReviews,
  replyToReview,
  checkOrderReview
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, createReview);
router.get('/check/:orderId', protect, checkOrderReview);
router.get('/restaurant/:restaurantId', protect, authorize('merchant', 'admin'), getRestaurantReviews);
router.post('/:id/reply', protect, authorize('merchant', 'admin'), replyToReview);

module.exports = router;
