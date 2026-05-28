const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Restaurant = require('../models/Restaurant')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { restaurantId, items, totalPrice, deliveryAddress, paymentMethod, promoCode, discountAmount, shippingFee } = req.body

  if (items && items.length === 0) {
    res.status(400).json({ message: 'No order items' })
    return
  }

  const order = new Order({
    userId: req.user._id,
    restaurantId,
    items,
    totalPrice,
    deliveryAddress,
    paymentMethod,
    promoCode,
    discountAmount,
    shippingFee
  })

  const createdOrder = await order.save()

  // Clear cart after order
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] })

  const io = req.app.get('io')
  if (io) {
    io.emit('new_order', createdOrder)
  }

  res.status(201).json(createdOrder)
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'fullName email phone avatar')
    .populate('restaurantId', 'name address')
    .populate('shipperId', 'fullName phone')
    .populate('items.foodId', 'name price image')

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Merchant/Admin/Shipper
const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const order = await Order.findById(req.params.id)

  if (order) {
    if (req.user.role === 'merchant') {
      const restaurant = await Restaurant.findById(order.restaurantId)
      if (restaurant?.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' })
    } else if (req.user.role === 'staff') {
      if (order.restaurantId.toString() !== req.user.restaurantId.toString()) return res.status(403).json({ message: 'Unauthorized' })
    } else if (req.user.role === 'user') {
      if (order.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' })
      if (status !== 'completed' && status !== 'cancelled') return res.status(403).json({ message: 'Users can only complete or cancel orders' })
    }

    order.status = status || order.status
    
    if (status === 'delivering' && req.user.role === 'shipper') {
      if (order.shipperId) {
        return res.status(400).json({ message: 'Đơn hàng này đã được shipper khác nhận' })
      }
      order.shipperId = req.user._id
    }

    const updatedOrder = await order.save()

    const io = req.app.get('io')
    if (io) {
      io.emit('order_status_updated', updatedOrder)
    }

    res.json(updatedOrder)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('restaurantId', 'name image address')
    .populate('items.foodId', 'name price image')
    .sort({ createdAt: -1 })
  res.json(orders)
}

// @desc    Get merchant orders
// @route   GET /api/orders/merchant/:restaurantId
// @access  Private/Merchant
const getMerchantOrders = async (req, res) => {
  if (req.user.role === 'merchant') {
    const restaurant = await Restaurant.findById(req.params.restaurantId)
    if (restaurant?.ownerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' })
  } else if (req.user.role === 'staff') {
    if (req.user.restaurantId.toString() !== req.params.restaurantId.toString()) return res.status(403).json({ message: 'Unauthorized' })
  }

  const orders = await Order.find({ restaurantId: req.params.restaurantId })
    .populate('items.foodId', 'name price image')
    .sort({ createdAt: -1 })
  res.json(orders)
}

const getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find({})
    .populate('userId', 'fullName email phone')
    .populate('restaurantId', 'name address')
    .populate('shipperId', 'fullName phone')
    .populate('items.foodId', 'name price image description')
    .sort({ createdAt: -1 })
  res.json(orders)
}

const getShipperOrders = async (req, res) => {
  const orders = await Order.find({
    $or: [
      { status: 'ready' },
      { status: 'delivering', shipperId: req.user._id },
      { status: 'completed', shipperId: req.user._id }
    ]
  })
  .populate('userId', 'fullName phone address')
  .populate('restaurantId', 'name address')
  .sort({ createdAt: -1 })
  res.json(orders)
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getMerchantOrders,
  getAllOrdersAdmin,
  getShipperOrders,
  getRoute: async (req, res) => {
    try {
      const { coordinates } = req.query;
      if (!coordinates) {
        return res.status(400).json({ message: 'Coordinates are required' });
      }
      
      const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${coordinates}?geometries=geojson`, {
        headers: {
          'User-Agent': 'FoodAppBackend/1.0'
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ message: 'OSRM API failed' });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('getRoute proxy error:', error);
      res.status(500).json({ message: 'Server Error during routing fetch' });
    }
  }
}
