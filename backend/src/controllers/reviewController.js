const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { orderId, restaurantId, rating, comment, foodReviews } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Chỉ có thể đánh giá đơn hàng đã hoàn thành' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({ message: 'Đơn hàng này đã được đánh giá' });
    }

    const review = await Review.create({
      userId: req.user._id,
      restaurantId,
      orderId,
      rating,
      comment,
      foodReviews
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Private (Merchant/Staff)
const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .populate('userId', 'fullName avatar phone')
      .populate('foodReviews.foodId', 'name image')
      .populate('orderId', 'createdAt items totalAmount')
      .sort({ createdAt: -1 });

    // Calculate stats
    let totalRating = 0;
    let goodCount = 0; // 4-5 stars
    let badCount = 0; // 1-3 stars
    let unrepliedCount = 0;

    reviews.forEach(r => {
      totalRating += r.rating;
      if (r.rating >= 4) goodCount++;
      else badCount++;

      if (!r.reply) unrepliedCount++;
    });

    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({
      reviews,
      stats: {
        total: reviews.length,
        averageRating,
        goodCount,
        badCount,
        unrepliedCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private (Merchant)
const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply || reply.trim() === '') {
      return res.status(400).json({ message: 'Nội dung phản hồi không được để trống' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }

    review.reply = reply;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if order is reviewed
// @route   GET /api/reviews/check/:orderId
// @access  Private
const checkOrderReview = async (req, res) => {
  try {
    const review = await Review.findOne({ orderId: req.params.orderId });
    res.json({ isReviewed: !!review, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getRestaurantReviews,
  replyToReview,
  checkOrderReview
};
