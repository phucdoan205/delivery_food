const Promotion = require('../models/Promotion')
const Restaurant = require('../models/Restaurant')
const User = require('../models/User')

// Helper function to check and update expiration status
const checkAndUpdateExpiration = async (promotions) => {
  const now = new Date();
  let updated = false;
  
  for (let promo of promotions) {
    if (promo.status === 'active' && new Date(promo.endDate) < now) {
      promo.status = 'expired';
      await promo.save();
      updated = true;
    }
  }
  return updated;
};

// @desc    Get promotions for a restaurant
// @route   GET /api/promotions/restaurant/:restaurantId
// @access  Public
const getPromotionsByRestaurant = async (req, res) => {
  try {
    let promotions = await Promotion.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    
    const wasUpdated = await checkAndUpdateExpiration(promotions);
    if (wasUpdated) {
      promotions = await Promotion.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    }

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Merchant/Staff
const createPromotion = async (req, res) => {
  const { restaurantId, title, code, discountType, discountValue, startDate, endDate, usageLimit } = req.body;

  // Authorization check
  if (req.user.role === 'merchant') {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } else if (req.user.role === 'staff') {
    if (req.user.restaurantId.toString() !== restaurantId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  // Check if code already exists for this restaurant
  const existingPromo = await Promotion.findOne({ restaurantId, code: code.toUpperCase() });
  if (existingPromo) {
    return res.status(400).json({ message: 'Mã khuyến mãi đã tồn tại cho cửa hàng này' });
  }

  const promotion = new Promotion({
    restaurantId,
    title,
    code: code.toUpperCase(),
    discountType,
    discountValue,
    startDate,
    endDate,
    usageLimit: usageLimit || 0
  });

  const createdPromotion = await promotion.save();

  const io = req.app.get('io');
  if (io) {
    io.emit('promotion_updated', {
      restaurantId,
      promotion: createdPromotion
    });
  }

  res.status(201).json(createdPromotion);
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Merchant/Staff
const updatePromotion = async (req, res) => {
  const { title, code, discountType, discountValue, startDate, endDate, usageLimit, status } = req.body;
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    return res.status(404).json({ message: 'Promotion not found' });
  }

  // Authorization check
  if (req.user.role === 'merchant') {
    const restaurant = await Restaurant.findById(promotion.restaurantId);
    if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } else if (req.user.role === 'staff') {
    if (req.user.restaurantId.toString() !== promotion.restaurantId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (title) promotion.title = title;
  if (code) {
    // Check if new code exists
    const existingPromo = await Promotion.findOne({ restaurantId: promotion.restaurantId, code: code.toUpperCase(), _id: { $ne: promotion._id } });
    if (existingPromo) return res.status(400).json({ message: 'Mã khuyến mãi đã tồn tại' });
    promotion.code = code.toUpperCase();
  }
  if (discountType) promotion.discountType = discountType;
  if (discountValue !== undefined) promotion.discountValue = discountValue;
  if (startDate) promotion.startDate = startDate;
  if (endDate) promotion.endDate = endDate;
  if (usageLimit !== undefined) promotion.usageLimit = usageLimit;
  if (status) promotion.status = status;

  // Auto-check expiration if updating dates
  if (new Date(promotion.endDate) < new Date() && promotion.status === 'active') {
    promotion.status = 'expired';
  } else if (new Date(promotion.endDate) >= new Date() && promotion.status === 'expired') {
    promotion.status = 'active'; // Re-activate if date extended
  }

  const updatedPromotion = await promotion.save();

  const io = req.app.get('io');
  if (io) {
    io.emit('promotion_updated', {
      restaurantId: updatedPromotion.restaurantId,
      promotion: updatedPromotion
    });
  }

  res.json(updatedPromotion);
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Merchant/Staff
const deletePromotion = async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    return res.status(404).json({ message: 'Promotion not found' });
  }

  // Authorization check
  if (req.user.role === 'merchant') {
    const restaurant = await Restaurant.findById(promotion.restaurantId);
    if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } else if (req.user.role === 'staff') {
    if (req.user.restaurantId.toString() !== promotion.restaurantId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const restaurantId = promotion.restaurantId;
  await promotion.deleteOne();

  const io = req.app.get('io');
  if (io) {
    io.emit('promotion_deleted', {
      restaurantId,
      promotionId: req.params.id
    });
  }

  res.json({ message: 'Promotion removed' });
};

// @desc    Save a promotion for a user
// @route   POST /api/promotions/:id/save
// @access  Private
const savePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    if (promotion.status !== 'active') {
      return res.status(400).json({ message: 'Promotion is no longer active' });
    }

    if (promotion.usageLimit > 0) {
      const Order = require('../models/Order');
      const userUsedCount = await Order.countDocuments({
        userId: req.user._id,
        promoCode: promotion.code,
        status: { $ne: 'cancelled' }
      });
      if (userUsedCount >= promotion.usageLimit) {
        return res.status(400).json({ message: 'Bạn đã hết lượt sử dụng mã giảm giá này' });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.savedPromotions && user.savedPromotions.includes(promotion._id)) {
      return res.status(400).json({ message: 'Bạn đã nhận mã giảm giá này rồi' });
    }

    if (!user.savedPromotions) {
      user.savedPromotions = [];
    }

    user.savedPromotions.push(promotion._id);
    await user.save();

    // Remove global usageCount increment on save
    // promotion.usageCount += 1;
    // await promotion.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('promotion_updated', {
        restaurantId: promotion.restaurantId,
        promotion: promotion
      });
    }

    res.json({ message: 'Saved successfully', savedPromotions: user.savedPromotions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved promotions
// @route   GET /api/promotions/user/saved
// @access  Private
const getSavedPromotions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPromotions',
      populate: {
        path: 'restaurantId',
        select: 'name image address'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check expiration and remove or mark them
    let promotions = user.savedPromotions || [];
    const wasUpdated = await checkAndUpdateExpiration(promotions);
    if (wasUpdated) {
      promotions = await Promotion.find({ _id: { $in: promotions.map(p => p._id) } }).populate('restaurantId', 'name image address');
    }

    // Filter out expired or deleted ones to only return active ones
    const activePromotions = promotions.filter(p => p && p.status === 'active');

    // Attach remaining usages for each promotion
    const Order = require('../models/Order');
    const promosWithUsage = await Promise.all(activePromotions.map(async (p) => {
      let remainingUsages = null;
      if (p.usageLimit > 0) {
        const userUsedCount = await Order.countDocuments({
          userId: req.user._id,
          promoCode: p.code,
          status: { $ne: 'cancelled' }
        });
        remainingUsages = Math.max(0, p.usageLimit - userUsedCount);
      }
      return { ...p.toObject(), remainingUsages };
    }));

    res.json(promosWithUsage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPromotionsByRestaurant,
  createPromotion,
  updatePromotion,
  deletePromotion,
  savePromotion,
  getSavedPromotions
};
