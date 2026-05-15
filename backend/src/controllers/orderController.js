const Order = require('../models/Order')
const Cart = require('../models/Cart')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { restaurantId, items, totalPrice, deliveryAddress, paymentMethod } = req.body

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
    paymentMethod
  })

  const createdOrder = await order.save()

  // Clear cart after order
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] })

  res.status(201).json(createdOrder)
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'fullName email')
    .populate('restaurantId', 'name address')
    .populate('items.foodId', 'name price')

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
    order.status = status || order.status
    
    if (status === 'delivering' && req.user.role === 'shipper') {
      order.shipperId = req.user._id
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404).json({ message: 'Order not found' })
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
}

// @desc    Get merchant orders
// @route   GET /api/orders/merchant/:restaurantId
// @access  Private/Merchant
const getMerchantOrders = async (req, res) => {
  const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 })
  res.json(orders)
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getMerchantOrders
}
