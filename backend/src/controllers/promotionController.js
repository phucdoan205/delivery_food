const Promotion = require('../models/Promotion')
const Restaurant = require('../models/Restaurant')

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

module.exports = {
  getPromotionsByRestaurant,
  createPromotion,
  updatePromotion,
  deletePromotion
};
