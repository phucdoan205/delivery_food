const Cart = require('../models/Cart')

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId')
  if (cart) {
    res.json(cart)
  } else {
    res.json({ userId: req.user._id, items: [] })
  }
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body

  let cart = await Cart.findOne({ userId: req.user._id })

  if (cart) {
    const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId)

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({ foodId, quantity })
    }
    await cart.save()
  } else {
    cart = await Cart.create({
      userId: req.user._id,
      items: [{ foodId, quantity }]
    })
  }

  res.status(201).json(cart)
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:foodId
// @access  Private
const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id })

  if (cart) {
    cart.items = cart.items.filter(item => item.foodId.toString() !== req.params.foodId)
    await cart.save()
    res.json(cart)
  } else {
    res.status(404).json({ message: 'Cart not found' })
  }
}

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id })
  if (cart) {
    cart.items = []
    await cart.save()
    res.json({ message: 'Cart cleared' })
  } else {
    res.status(404).json({ message: 'Cart not found' })
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
}
